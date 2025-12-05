/*
  # Add Booking Calendar Events Mapping Table

  1. New Tables
    - `booking_calendar_events`
      - `id` (uuid, primary key)
      - `booking_id` (uuid, references bookings)
      - `calendar_event_id` (text, Google Calendar event ID)
      - `calendar_link` (text, link to calendar event)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `booking_calendar_events` table
    - Add policies for users to manage their own booking events
    - Public can view event links for their bookings

  3. Purpose
    - Maps bookings to Google Calendar events
    - Stores calendar event IDs for updates/cancellations
    - Provides quick access to calendar links
*/

CREATE TABLE IF NOT EXISTS booking_calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  calendar_event_id text NOT NULL,
  calendar_link text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(booking_id)
);

CREATE INDEX IF NOT EXISTS idx_booking_calendar_events_booking_id ON booking_calendar_events(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_calendar_events_calendar_event_id ON booking_calendar_events(calendar_event_id);

ALTER TABLE booking_calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own booking calendar events"
  ON booking_calendar_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_calendar_events.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert booking calendar events"
  ON booking_calendar_events FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Users can update own booking calendar events"
  ON booking_calendar_events FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_calendar_events.booking_id
      AND bookings.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_calendar_events.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own booking calendar events"
  ON booking_calendar_events FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_calendar_events.booking_id
      AND bookings.user_id = auth.uid()
    )
  );
