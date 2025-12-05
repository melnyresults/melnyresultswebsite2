import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDateLong, formatTimeSlot, formatDuration, TIMEZONE_LIST } from '../lib/timeUtils';
import { generateTimeSlots, getAvailableDates } from '../lib/availabilityUtils';
import { EventType } from '../hooks/useEventTypes';
import { Booking } from '../hooks/useBookings';
import { AvailabilitySlot, DateOverride } from '../hooks/useAvailability';
import { useCalendarAvailability } from '../hooks/useCalendarAvailability';
import { createCalendarEvent } from '../lib/calendarService';

interface UserProfile {
  full_name: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  company?: string;
  welcome_message: string;
  timezone: string;
  id: string;
}

export const PublicBookingPage: React.FC = () => {
  const { username, slug } = useParams<{ username: string; slug: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [eventType, setEventType] = useState<EventType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [guestData, setGuestData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [loading, setLoading] = useState(true);
  const [bookingStep, setBookingStep] = useState<'select-date' | 'select-time' | 'guest-info' | 'confirmation'>('select-date');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const { isTimeSlotBusy, hasConnection } = useCalendarAvailability(
    profile?.id || '',
    selectedDate
  );

  useEffect(() => {
    loadBookingData();
  }, [username, slug]);

  useEffect(() => {
    if (eventType && selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedDate, eventType]);

  const loadBookingData = async () => {
    try {
      setLoading(true);

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('username', username)
        .maybeSingle();

      if (!profileData) {
        throw new Error('User not found');
      }
      setProfile(profileData);

      const { data: eventTypeData } = await supabase
        .from('event_types')
        .select('*')
        .eq('slug', slug)
        .eq('user_id', profileData.id)
        .eq('is_active', true)
        .maybeSingle();

      if (!eventTypeData) {
        throw new Error('Event type not found');
      }
      setEventType(eventTypeData);

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + eventTypeData.max_future_days);

      const { data: scheduleMapping } = await supabase
        .from('event_type_availability')
        .select('schedule_id')
        .eq('event_type_id', eventTypeData.id)
        .maybeSingle();

      const scheduleId = scheduleMapping?.schedule_id;

      let availabilitySlots: AvailabilitySlot[] = [];
      if (scheduleId) {
        const { data: slotsData } = await supabase
          .from('availability_slots')
          .select('*')
          .eq('schedule_id', scheduleId);
        availabilitySlots = slotsData || [];
      } else {
        const { data: defaultSchedule } = await supabase
          .from('availability_schedules')
          .select('id')
          .eq('user_id', profileData.id)
          .eq('is_default', true)
          .maybeSingle();

        if (defaultSchedule) {
          const { data: slotsData } = await supabase
            .from('availability_slots')
            .select('*')
            .eq('schedule_id', defaultSchedule.id);
          availabilitySlots = slotsData || [];
        }
      }

      const { data: overridesData } = await supabase
        .from('date_overrides')
        .select('*')
        .eq('user_id', profileData.id);

      const dates = getAvailableDates(
        startDate,
        endDate,
        availabilitySlots,
        overridesData || []
      );
      setAvailableDates(dates);

    } catch (error) {
      console.error('Error loading booking data:', error);
      alert('Failed to load booking page');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableSlots = async () => {
    if (!eventType || !selectedDate || !profile) return;

    try {
      const { data: scheduleMapping } = await supabase
        .from('event_type_availability')
        .select('schedule_id')
        .eq('event_type_id', eventType.id)
        .maybeSingle();

      const scheduleId = scheduleMapping?.schedule_id;

      let availabilitySlots: AvailabilitySlot[] = [];
      if (scheduleId) {
        const { data: slotsData } = await supabase
          .from('availability_slots')
          .select('*')
          .eq('schedule_id', scheduleId);
        availabilitySlots = slotsData || [];
      }

      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', profile.id)
        .gte('start_time', selectedDate.toISOString().split('T')[0])
        .lte('start_time', new Date(selectedDate.getTime() + 86400000).toISOString());

      const { data: overridesData } = await supabase
        .from('date_overrides')
        .select('*')
        .eq('user_id', profile.id);

      const slots = generateTimeSlots(
        selectedDate,
        eventType.duration,
        availabilitySlots,
        bookingsData || [],
        eventType,
        overridesData || []
      );

      const filteredSlots = slots.filter(s => {
        if (!s.available) return false;

        if (hasConnection && isTimeSlotBusy) {
          return !isTimeSlotBusy(s.start, s.end);
        }

        return true;
      });

      setAvailableSlots(filteredSlots);
    } catch (error) {
      console.error('Error loading slots:', error);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setBookingStep('select-time');
  };

  const handleSlotSelect = (slot: { start: Date; end: Date }) => {
    setSelectedSlot(slot);
    setBookingStep('guest-info');
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSlot || !eventType || !profile) return;

    try {
      const { data: booking, error } = await supabase
        .from('bookings')
        .insert({
          event_type_id: eventType.id,
          user_id: profile.id,
          guest_name: guestData.name,
          guest_email: guestData.email,
          guest_phone: guestData.phone || null,
          start_time: selectedSlot.start.toISOString(),
          end_time: selectedSlot.end.toISOString(),
          timezone: guestData.timezone,
          notes: guestData.notes || null,
          status: eventType.requires_confirmation ? 'pending' : 'confirmed',
        })
        .select()
        .single();

      if (error) throw error;

      if (booking && hasConnection) {
        await createCalendarEvent({
          userId: profile.id,
          bookingId: booking.id,
          summary: `${eventType.name} with ${guestData.name}`,
          description: guestData.notes || `Meeting scheduled via booking system`,
          startTime: selectedSlot.start.toISOString(),
          endTime: selectedSlot.end.toISOString(),
          attendeeEmail: guestData.email,
          attendeeName: guestData.name,
          location: eventType.location_type === 'custom' ? eventType.location_details : eventType.location_type,
          timezone: guestData.timezone,
        });
      }

      setBookingSuccess(true);
      setBookingStep('confirmation');
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const isDateAvailable = (date: Date | null) => {
    if (!date) return false;
    return availableDates.some(
      (d) => d.toDateString() === date.toDateString()
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking page...</p>
        </div>
      </div>
    );
  }

  if (!profile || !eventType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Page Not Found</h2>
          <p className="text-gray-600">This booking page does not exist or is no longer available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-5">
            <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white">
              <div className="mb-6">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-20 h-20 rounded-full border-4 border-white/30"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">
                    {profile.full_name.charAt(0)}
                  </div>
                )}
              </div>

              <h1 className="text-3xl font-bold mb-2">{profile.full_name}</h1>
              {profile.company && (
                <p className="text-blue-100 mb-4">{profile.company}</p>
              )}

              <div className="mt-8 mb-6">
                <h2 className="text-2xl font-semibold mb-2">{eventType.name}</h2>
                {eventType.description && (
                  <p className="text-blue-100">{eventType.description}</p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-200" />
                  <span>{formatDuration(eventType.duration)}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-200" />
                  <span className="capitalize">{eventType.location_type.replace('_', ' ')}</span>
                </div>
              </div>

              {profile.welcome_message && (
                <div className="mt-8 p-4 bg-white/10 rounded-lg">
                  <p className="text-sm">{profile.welcome_message}</p>
                </div>
              )}
            </div>

            <div className="md:col-span-3 p-8">
              {bookingStep === 'select-date' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Select a Date</h3>

                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => {
                        const newMonth = new Date(currentMonth);
                        newMonth.setMonth(newMonth.getMonth() - 1);
                        setCurrentMonth(newMonth);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h4 className="font-semibold">
                      {currentMonth.toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </h4>
                    <button
                      onClick={() => {
                        const newMonth = new Date(currentMonth);
                        newMonth.setMonth(newMonth.getMonth() + 1);
                        setCurrentMonth(newMonth);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}

                    {getDaysInMonth(currentMonth).map((date, index) => (
                      <button
                        key={index}
                        onClick={() => date && isDateAvailable(date) && handleDateSelect(date)}
                        disabled={!date || !isDateAvailable(date)}
                        className={`aspect-square rounded-lg text-sm font-medium transition-colors ${
                          date && isDateAvailable(date)
                            ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                            : 'text-gray-300 cursor-not-allowed'
                        }`}
                      >
                        {date?.getDate()}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {bookingStep === 'select-time' && selectedDate && (
                <div>
                  <button
                    onClick={() => setBookingStep('select-date')}
                    className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to date selection</span>
                  </button>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {formatDateLong(selectedDate, guestData.timezone)}
                  </h3>
                  <p className="text-gray-600 mb-6">Select a time slot</p>

                  {availableSlots.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <p className="text-gray-600">No available time slots for this date</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                      {availableSlots.map((slot, index) => (
                        <button
                          key={index}
                          onClick={() => handleSlotSelect({ start: slot.start, end: slot.end })}
                          className="px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors text-center font-medium"
                        >
                          {formatTimeSlot(slot.start, guestData.timezone)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {bookingStep === 'guest-info' && selectedSlot && (
                <div>
                  <button
                    onClick={() => setBookingStep('select-time')}
                    className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to time selection</span>
                  </button>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">Your Information</h3>
                  <p className="text-gray-600 mb-6">
                    {formatDateLong(selectedSlot.start, guestData.timezone)} at{' '}
                    {formatTimeSlot(selectedSlot.start, guestData.timezone)}
                  </p>

                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={guestData.name}
                        onChange={(e) => setGuestData({ ...guestData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={guestData.email}
                        onChange={(e) => setGuestData({ ...guestData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={guestData.phone}
                        onChange={(e) => setGuestData({ ...guestData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Timezone
                      </label>
                      <select
                        value={guestData.timezone}
                        onChange={(e) => setGuestData({ ...guestData, timezone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {TIMEZONE_LIST.map((tz) => (
                          <option key={tz} value={tz}>
                            {tz}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Notes
                      </label>
                      <textarea
                        value={guestData.notes}
                        onChange={(e) => setGuestData({ ...guestData, notes: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Any questions or special requests?"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Schedule Meeting
                    </button>
                  </form>
                </div>
              )}

              {bookingStep === 'confirmation' && bookingSuccess && selectedSlot && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {eventType.requires_confirmation
                      ? 'Booking Request Sent!'
                      : 'Meeting Scheduled!'}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {formatDateLong(selectedSlot.start, guestData.timezone)}
                  </p>
                  <p className="text-gray-600 mb-6">
                    {formatTimeSlot(selectedSlot.start, guestData.timezone)}
                  </p>
                  <div className="bg-blue-50 rounded-lg p-6 text-left mb-6">
                    {eventType.requires_confirmation ? (
                      <p className="text-sm text-gray-700">
                        Your booking request has been sent to {profile.full_name}. You will receive
                        a confirmation email once it's approved.
                      </p>
                    ) : (
                      <p className="text-sm text-gray-700">
                        A confirmation email has been sent to {guestData.email} with meeting details
                        and calendar invites.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
