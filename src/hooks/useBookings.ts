import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Booking {
  id: string;
  event_type_id: string;
  user_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  start_time: string;
  end_time: string;
  timezone: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  location?: string;
  notes?: string;
  cancellation_reason?: string;
  google_event_id?: string;
  reminder_sent: boolean;
  confirmation_token?: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface BookingWithEventType extends Booking {
  event_types: {
    name: string;
    duration: number;
    color: string;
  };
}

export function useBookings() {
  const [bookings, setBookings] = useState<BookingWithEventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async (filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setBookings([]);
        return;
      }

      let query = supabase
        .from('bookings')
        .select(`
          *,
          event_types (
            name,
            duration,
            color
          )
        `)
        .eq('user_id', user.id)
        .order('start_time', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.startDate) {
        query = query.gte('start_time', filters.startDate);
      }

      if (filters?.endDate) {
        query = query.lte('start_time', filters.endDate);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setBookings(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData: {
    event_type_id: string;
    guest_name: string;
    guest_email: string;
    guest_phone?: string;
    start_time: string;
    end_time: string;
    timezone: string;
    notes?: string;
  }) => {
    try {
      const eventType = await getEventTypeById(bookingData.event_type_id);
      if (!eventType) throw new Error('Event type not found');

      const confirmationToken = generateToken();

      const { data, error: createError } = await supabase
        .from('bookings')
        .insert({
          ...bookingData,
          user_id: eventType.user_id,
          status: eventType.requires_confirmation ? 'pending' : 'confirmed',
          confirmation_token: confirmationToken,
        })
        .select()
        .single();

      if (createError) throw createError;

      await supabase
        .from('booking_analytics')
        .insert({
          user_id: eventType.user_id,
          booking_id: data.id,
          event_type_id: bookingData.event_type_id,
          metric_type: 'booked',
        });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create booking';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateBooking = async (id: string, updates: Partial<Booking>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      await fetchBookings();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update booking';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const cancelBooking = async (id: string, reason?: string) => {
    try {
      const booking = bookings.find(b => b.id === id);

      const { data, error: cancelError } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          cancellation_reason: reason,
          cancelled_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (cancelError) throw cancelError;

      if (booking) {
        await supabase
          .from('booking_analytics')
          .insert({
            user_id: booking.user_id,
            booking_id: id,
            event_type_id: booking.event_type_id,
            metric_type: 'cancelled',
          });
      }

      await fetchBookings();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel booking';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const confirmBooking = async (id: string) => {
    return updateBooking(id, { status: 'confirmed' });
  };

  const getUpcomingBookings = () => {
    const now = new Date().toISOString();
    return bookings.filter(
      b => b.start_time > now && (b.status === 'confirmed' || b.status === 'pending')
    );
  };

  const getBookingsByDateRange = (startDate: string, endDate: string) => {
    return bookings.filter(
      b => b.start_time >= startDate && b.start_time <= endDate
    );
  };

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    updateBooking,
    cancelBooking,
    confirmBooking,
    getUpcomingBookings,
    getBookingsByDateRange,
  };
}

async function getEventTypeById(id: string) {
  const { data } = await supabase
    .from('event_types')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  return data;
}

function generateToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
