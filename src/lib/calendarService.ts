import { supabase } from './supabase';

interface CreateCalendarEventParams {
  userId: string;
  bookingId: string;
  summary: string;
  description?: string;
  startTime: string;
  endTime: string;
  attendeeEmail: string;
  attendeeName: string;
  location?: string;
  timezone?: string;
}

export const createCalendarEvent = async (params: CreateCalendarEventParams): Promise<boolean> => {
  try {
    const session = await supabase.auth.getSession();

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-calendar-event`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: session.data.session
            ? `Bearer ${session.data.session.access_token}`
            : `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(params),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 404) {
        console.info('No calendar connection, skipping event creation');
        return false;
      }
      console.error('Failed to create calendar event:', errorData);
      return false;
    }

    const data = await response.json();
    console.log('Calendar event created:', data.eventId);
    return true;

  } catch (error) {
    console.error('Error creating calendar event:', error);
    return false;
  }
};

export const checkCalendarConnection = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('google_calendar_connections')
      .select('is_active')
      .eq('user_id', userId)
      .eq('is_active', true)
      .maybeSingle();

    return !!data && !error;
  } catch (error) {
    console.error('Error checking calendar connection:', error);
    return false;
  }
};
