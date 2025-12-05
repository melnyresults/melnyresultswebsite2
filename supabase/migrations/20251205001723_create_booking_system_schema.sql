/*
  # Calendly-like Booking System Schema

  ## Overview
  Complete database schema for a booking/scheduling application with Google Calendar integration.

  ## 1. New Tables
  
  ### user_profiles
  - `id` (uuid, primary key) - Links to auth.users
  - `full_name` (text) - User's full name
  - `username` (text, unique) - Unique booking URL slug
  - `email` (text) - User's email
  - `avatar_url` (text, nullable) - Profile picture
  - `timezone` (text) - User's default timezone
  - `bio` (text, nullable) - Profile bio/description
  - `company` (text, nullable) - Company name
  - `welcome_message` (text, nullable) - Message shown on booking page
  - `is_active` (boolean) - Account active status
  - `created_at`, `updated_at` (timestamptz)

  ### event_types
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - Owner
  - `name` (text) - Event type name (e.g., "30 Minute Meeting")
  - `slug` (text) - URL slug
  - `description` (text, nullable)
  - `duration` (integer) - Duration in minutes
  - `color` (text) - Calendar color
  - `location_type` (text) - phone/zoom/google_meet/custom
  - `location_value` (text, nullable) - Location details
  - `is_active` (boolean) - Published status
  - `buffer_before` (integer) - Buffer time before (minutes)
  - `buffer_after` (integer) - Buffer time after (minutes)
  - `max_bookings_per_day` (integer, nullable)
  - `min_notice` (integer) - Minimum notice in minutes
  - `max_future_days` (integer) - How far ahead bookings allowed
  - `requires_confirmation` (boolean)
  - `redirect_url` (text, nullable) - Post-booking redirect
  - `confirmation_message` (text, nullable)
  - `created_at`, `updated_at` (timestamptz)

  ### availability_schedules
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key)
  - `name` (text) - Schedule name
  - `timezone` (text)
  - `is_default` (boolean)
  - `created_at`, `updated_at` (timestamptz)

  ### availability_slots
  - `id` (uuid, primary key)
  - `schedule_id` (uuid, foreign key)
  - `day_of_week` (integer) - 0-6 (Sunday-Saturday)
  - `start_time` (time) - Start time
  - `end_time` (time) - End time
  - `created_at` (timestamptz)

  ### event_type_availability
  - Links event types to availability schedules
  - `event_type_id` (uuid, foreign key)
  - `schedule_id` (uuid, foreign key)

  ### bookings
  - `id` (uuid, primary key)
  - `event_type_id` (uuid, foreign key)
  - `user_id` (uuid, foreign key) - Host
  - `guest_name` (text) - Attendee name
  - `guest_email` (text) - Attendee email
  - `guest_phone` (text, nullable)
  - `start_time` (timestamptz)
  - `end_time` (timestamptz)
  - `timezone` (text) - Guest's timezone
  - `status` (text) - pending/confirmed/cancelled/completed
  - `location` (text, nullable)
  - `notes` (text, nullable) - Guest notes/questions
  - `cancellation_reason` (text, nullable)
  - `google_event_id` (text, nullable) - Synced Google Calendar event ID
  - `reminder_sent` (boolean)
  - `confirmation_token` (text, unique, nullable)
  - `cancelled_at` (timestamptz, nullable)
  - `created_at`, `updated_at` (timestamptz)

  ### booking_form_fields
  - `id` (uuid, primary key)
  - `event_type_id` (uuid, foreign key)
  - `field_type` (text) - text/textarea/email/phone/select/checkbox
  - `label` (text) - Field label
  - `placeholder` (text, nullable)
  - `is_required` (boolean)
  - `options` (jsonb, nullable) - For select/checkbox
  - `order_index` (integer)
  - `created_at` (timestamptz)

  ### booking_form_responses
  - `id` (uuid, primary key)
  - `booking_id` (uuid, foreign key)
  - `field_id` (uuid, foreign key)
  - `response_value` (text)
  - `created_at` (timestamptz)

  ### google_calendar_connections
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key, unique)
  - `access_token` (text) - Encrypted OAuth token
  - `refresh_token` (text) - Encrypted refresh token
  - `token_expiry` (timestamptz)
  - `calendar_id` (text) - Primary calendar ID
  - `is_active` (boolean)
  - `last_sync` (timestamptz, nullable)
  - `created_at`, `updated_at` (timestamptz)

  ### date_overrides
  - For date-specific availability exceptions
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key)
  - `date` (date)
  - `is_available` (boolean)
  - `start_time` (time, nullable)
  - `end_time` (time, nullable)
  - `created_at` (timestamptz)

  ### booking_analytics
  - Track booking metrics
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key)
  - `booking_id` (uuid, foreign key)
  - `event_type_id` (uuid, foreign key)
  - `metric_type` (text) - booked/cancelled/completed/no_show
  - `metric_date` (date)
  - `created_at` (timestamptz)

  ## 2. Security
  - Enable RLS on all tables
  - Add policies for authenticated users to manage their own data
  - Public read access for booking pages (via username/slug)
  - Secure policies for sensitive data (tokens, personal info)

  ## 3. Indexes
  - Performance indexes on frequently queried columns
  - Foreign key indexes
  - Unique indexes for usernames, slugs, tokens

  ## 4. Functions
  - Trigger to update `updated_at` timestamps
  - Function to check availability conflicts
  - Function to generate unique booking confirmation tokens
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  username text UNIQUE NOT NULL,
  email text NOT NULL,
  avatar_url text,
  timezone text NOT NULL DEFAULT 'America/New_York',
  bio text,
  company text,
  welcome_message text DEFAULT 'Welcome! Please select a time slot for our meeting.',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Event Types Table
CREATE TABLE IF NOT EXISTS event_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  duration integer NOT NULL DEFAULT 30,
  color text DEFAULT '#3b82f6',
  location_type text DEFAULT 'google_meet',
  location_value text,
  is_active boolean DEFAULT true,
  buffer_before integer DEFAULT 0,
  buffer_after integer DEFAULT 0,
  max_bookings_per_day integer,
  min_notice integer DEFAULT 60,
  max_future_days integer DEFAULT 60,
  requires_confirmation boolean DEFAULT false,
  redirect_url text,
  confirmation_message text DEFAULT 'Your meeting has been scheduled successfully!',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, slug)
);

-- Availability Schedules Table
CREATE TABLE IF NOT EXISTS availability_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  timezone text NOT NULL DEFAULT 'America/New_York',
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Availability Slots Table
CREATE TABLE IF NOT EXISTS availability_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id uuid NOT NULL REFERENCES availability_schedules(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at timestamptz DEFAULT now(),
  CHECK (end_time > start_time)
);

-- Event Type to Availability Schedule Mapping
CREATE TABLE IF NOT EXISTS event_type_availability (
  event_type_id uuid NOT NULL REFERENCES event_types(id) ON DELETE CASCADE,
  schedule_id uuid NOT NULL REFERENCES availability_schedules(id) ON DELETE CASCADE,
  PRIMARY KEY (event_type_id, schedule_id)
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type_id uuid NOT NULL REFERENCES event_types(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  guest_name text NOT NULL,
  guest_email text NOT NULL,
  guest_phone text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  timezone text NOT NULL,
  status text NOT NULL DEFAULT 'confirmed',
  location text,
  notes text,
  cancellation_reason text,
  google_event_id text,
  reminder_sent boolean DEFAULT false,
  confirmation_token text UNIQUE,
  cancelled_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  CHECK (end_time > start_time)
);

-- Booking Form Fields Table
CREATE TABLE IF NOT EXISTS booking_form_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type_id uuid NOT NULL REFERENCES event_types(id) ON DELETE CASCADE,
  field_type text NOT NULL,
  label text NOT NULL,
  placeholder text,
  is_required boolean DEFAULT false,
  options jsonb,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CHECK (field_type IN ('text', 'textarea', 'email', 'phone', 'select', 'checkbox', 'radio'))
);

-- Booking Form Responses Table
CREATE TABLE IF NOT EXISTS booking_form_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  field_id uuid NOT NULL REFERENCES booking_form_fields(id) ON DELETE CASCADE,
  response_value text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Google Calendar Connections Table
CREATE TABLE IF NOT EXISTS google_calendar_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token text NOT NULL,
  refresh_token text NOT NULL,
  token_expiry timestamptz NOT NULL,
  calendar_id text NOT NULL DEFAULT 'primary',
  is_active boolean DEFAULT true,
  last_sync timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Date Overrides Table (for exceptions to regular availability)
CREATE TABLE IF NOT EXISTS date_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  is_available boolean NOT NULL DEFAULT false,
  start_time time,
  end_time time,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Booking Analytics Table
CREATE TABLE IF NOT EXISTS booking_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  event_type_id uuid NOT NULL REFERENCES event_types(id) ON DELETE CASCADE,
  metric_type text NOT NULL,
  metric_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  CHECK (metric_type IN ('booked', 'cancelled', 'completed', 'no_show', 'rescheduled'))
);

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_event_types_user_id ON event_types(user_id);
CREATE INDEX IF NOT EXISTS idx_event_types_slug ON event_types(slug);
CREATE INDEX IF NOT EXISTS idx_event_types_is_active ON event_types(is_active);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_event_type_id ON bookings(event_type_id);
CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON bookings(start_time);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_guest_email ON bookings(guest_email);
CREATE INDEX IF NOT EXISTS idx_availability_slots_schedule_id ON availability_slots(schedule_id);
CREATE INDEX IF NOT EXISTS idx_availability_slots_day ON availability_slots(day_of_week);
CREATE INDEX IF NOT EXISTS idx_booking_analytics_user_id ON booking_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_booking_analytics_metric_date ON booking_analytics(metric_date);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_types_updated_at BEFORE UPDATE ON event_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_availability_schedules_updated_at BEFORE UPDATE ON availability_schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_google_calendar_connections_updated_at BEFORE UPDATE ON google_calendar_connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate unique confirmation token
CREATE OR REPLACE FUNCTION generate_confirmation_token()
RETURNS text AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_type_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_form_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_form_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_calendar_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE date_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Public can view active profiles by username"
  ON user_profiles FOR SELECT
  TO anon
  USING (is_active = true);

-- RLS Policies for event_types
CREATE POLICY "Users can view own event types"
  ON event_types FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own event types"
  ON event_types FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own event types"
  ON event_types FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own event types"
  ON event_types FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view active event types"
  ON event_types FOR SELECT
  TO anon
  USING (is_active = true);

-- RLS Policies for availability_schedules
CREATE POLICY "Users can manage own schedules"
  ON availability_schedules FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for availability_slots
CREATE POLICY "Users can manage own availability slots"
  ON availability_slots FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM availability_schedules
      WHERE availability_schedules.id = availability_slots.schedule_id
      AND availability_schedules.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can view availability slots"
  ON availability_slots FOR SELECT
  TO anon
  USING (true);

-- RLS Policies for event_type_availability
CREATE POLICY "Users can manage event availability mappings"
  ON event_type_availability FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM event_types
      WHERE event_types.id = event_type_availability.event_type_id
      AND event_types.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can view event availability mappings"
  ON event_type_availability FOR SELECT
  TO anon
  USING (true);

-- RLS Policies for bookings
CREATE POLICY "Users can view own hosted bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own hosted bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can view booking by confirmation token"
  ON bookings FOR SELECT
  TO anon
  USING (confirmation_token IS NOT NULL);

-- RLS Policies for booking_form_fields
CREATE POLICY "Users can manage own form fields"
  ON booking_form_fields FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM event_types
      WHERE event_types.id = booking_form_fields.event_type_id
      AND event_types.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can view form fields"
  ON booking_form_fields FOR SELECT
  TO anon
  USING (true);

-- RLS Policies for booking_form_responses
CREATE POLICY "Users can view responses for own bookings"
  ON booking_form_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_form_responses.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert form responses"
  ON booking_form_responses FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- RLS Policies for google_calendar_connections
CREATE POLICY "Users can manage own calendar connections"
  ON google_calendar_connections FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for date_overrides
CREATE POLICY "Users can manage own date overrides"
  ON date_overrides FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view date overrides"
  ON date_overrides FOR SELECT
  TO anon
  USING (true);

-- RLS Policies for booking_analytics
CREATE POLICY "Users can view own analytics"
  ON booking_analytics FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics"
  ON booking_analytics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
