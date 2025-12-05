import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface CalendarEvent {
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
}

interface TimeSlot {
  start: string;
  end: string;
}

export const useCalendarAvailability = (userId: string, date: Date | null) => {
  const [busySlots, setBusySlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasConnection, setHasConnection] = useState<boolean | null>(null);

  useEffect(() => {
    if (userId && date) {
      fetchCalendarBusySlots();
    } else {
      setBusySlots([]);
      setHasConnection(null);
    }
  }, [userId, date?.toISOString()]);

  const fetchCalendarBusySlots = async () => {
    if (!userId || !date) return;

    try {
      setIsLoading(true);
      setError(null);

      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      const session = await supabase.auth.getSession();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/calendar-sync`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: session.data.session
              ? `Bearer ${session.data.session.access_token}`
              : `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            userId,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          }),
        }
      );

      const data = await response.json();

      if (response.status === 404) {
        setHasConnection(false);
        setBusySlots([]);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch calendar events');
      }

      setHasConnection(true);

      const events = data.events || [];
      const slots: TimeSlot[] = events
        .map((event: CalendarEvent) => ({
          start: event.start.dateTime || event.start.date || '',
          end: event.end.dateTime || event.end.date || '',
        }))
        .filter((slot: TimeSlot) => slot.start && slot.end);

      setBusySlots(slots);
    } catch (err) {
      console.error('Error fetching calendar availability:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setBusySlots([]);
    } finally {
      setIsLoading(false);
    }
  };

  const isTimeSlotBusy = (slotStart: Date, slotEnd: Date): boolean => {
    return busySlots.some((busy) => {
      const busyStart = new Date(busy.start);
      const busyEnd = new Date(busy.end);

      return (
        (slotStart >= busyStart && slotStart < busyEnd) ||
        (slotEnd > busyStart && slotEnd <= busyEnd) ||
        (slotStart <= busyStart && slotEnd >= busyEnd)
      );
    });
  };

  return {
    busySlots,
    isTimeSlotBusy,
    isLoading,
    error,
    hasConnection,
    refetch: fetchCalendarBusySlots,
  };
};
