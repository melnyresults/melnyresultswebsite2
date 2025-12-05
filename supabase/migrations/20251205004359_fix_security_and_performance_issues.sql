/*
  # Fix Security and Performance Issues

  1. Performance Improvements
    - Add missing indexes for all foreign key columns
    - Optimize RLS policies to use `(select auth.uid())` pattern
    - Fix function search paths for security

  2. Missing Indexes
    All foreign key columns now have proper indexes for optimal query performance:
    - availability_schedules (user_id)
    - booking_analytics (booking_id, event_type_id)
    - booking_form_fields (event_type_id)
    - booking_form_responses (booking_id, field_id)
    - event_type_availability (schedule_id)
    - lead_notes (lead_id)
    - lead_payments (lead_id)
    - leads (pipeline_id, stage_id)
    - opportunities (pipeline_id, stage_id)
    - opportunity_payments (opportunity_id)
    - pipeline_stages (pipeline_id)
    - platform_connections (platform_id)
    - platform_integrations (created_by)

  3. RLS Policy Optimization
    All policies now use `(select auth.uid())` to prevent per-row re-evaluation
    This significantly improves query performance at scale

  4. Security Enhancements
    - Functions now have immutable search_path
    - Prevents search_path manipulation attacks
*/

-- Add missing indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_availability_schedules_user_id ON availability_schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_booking_analytics_booking_id ON booking_analytics(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_analytics_event_type_id ON booking_analytics(event_type_id);
CREATE INDEX IF NOT EXISTS idx_booking_form_fields_event_type_id ON booking_form_fields(event_type_id);
CREATE INDEX IF NOT EXISTS idx_booking_form_responses_booking_id ON booking_form_responses(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_form_responses_field_id ON booking_form_responses(field_id);
CREATE INDEX IF NOT EXISTS idx_event_type_availability_schedule_id ON event_type_availability(schedule_id);
CREATE INDEX IF NOT EXISTS idx_lead_notes_lead_id ON lead_notes(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_payments_lead_id ON lead_payments(lead_id);
CREATE INDEX IF NOT EXISTS idx_leads_pipeline_id ON leads(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_leads_stage_id ON leads(stage_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_pipeline_id ON opportunities(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_stage_id ON opportunities(stage_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_payments_opportunity_id ON opportunity_payments(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_stages_pipeline_id ON pipeline_stages(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_platform_connections_platform_id ON platform_connections(platform_id);
CREATE INDEX IF NOT EXISTS idx_platform_integrations_created_by ON platform_integrations(created_by);

-- Drop and recreate user_profiles policies with optimized auth checks
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

-- Drop and recreate push_subscriptions policies
DROP POLICY IF EXISTS "Users can view own push subscriptions" ON push_subscriptions;
DROP POLICY IF EXISTS "Users can insert own push subscriptions" ON push_subscriptions;
DROP POLICY IF EXISTS "Users can update own push subscriptions" ON push_subscriptions;
DROP POLICY IF EXISTS "Users can delete own push subscriptions" ON push_subscriptions;

CREATE POLICY "Users can view own push subscriptions"
  ON push_subscriptions FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own push subscriptions"
  ON push_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own push subscriptions"
  ON push_subscriptions FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own push subscriptions"
  ON push_subscriptions FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Drop and recreate event_types policies
DROP POLICY IF EXISTS "Users can view own event types" ON event_types;
DROP POLICY IF EXISTS "Users can insert own event types" ON event_types;
DROP POLICY IF EXISTS "Users can update own event types" ON event_types;
DROP POLICY IF EXISTS "Users can delete own event types" ON event_types;

CREATE POLICY "Users can view own event types"
  ON event_types FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own event types"
  ON event_types FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own event types"
  ON event_types FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own event types"
  ON event_types FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Drop and recreate availability_schedules policies
DROP POLICY IF EXISTS "Users can manage own schedules" ON availability_schedules;

CREATE POLICY "Users can manage own schedules"
  ON availability_schedules FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- Drop and recreate availability_slots policies
DROP POLICY IF EXISTS "Users can manage own availability slots" ON availability_slots;

CREATE POLICY "Users can manage own availability slots"
  ON availability_slots FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM availability_schedules
      WHERE availability_schedules.id = availability_slots.schedule_id
      AND availability_schedules.user_id = (select auth.uid())
    )
  );

-- Drop and recreate event_type_availability policies
DROP POLICY IF EXISTS "Users can manage event availability mappings" ON event_type_availability;

CREATE POLICY "Users can manage event availability mappings"
  ON event_type_availability FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM event_types
      WHERE event_types.id = event_type_availability.event_type_id
      AND event_types.user_id = (select auth.uid())
    )
  );

-- Drop and recreate bookings policies
DROP POLICY IF EXISTS "Users can view own hosted bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own hosted bookings" ON bookings;

CREATE POLICY "Users can view own hosted bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can update own hosted bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- Drop and recreate booking_form_fields policies
DROP POLICY IF EXISTS "Users can manage own form fields" ON booking_form_fields;

CREATE POLICY "Users can manage own form fields"
  ON booking_form_fields FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM event_types
      WHERE event_types.id = booking_form_fields.event_type_id
      AND event_types.user_id = (select auth.uid())
    )
  );

-- Drop and recreate booking_form_responses policies
DROP POLICY IF EXISTS "Users can view responses for own bookings" ON booking_form_responses;

CREATE POLICY "Users can view responses for own bookings"
  ON booking_form_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_form_responses.booking_id
      AND bookings.user_id = (select auth.uid())
    )
  );

-- Drop and recreate google_calendar_connections policies
DROP POLICY IF EXISTS "Users can manage own calendar connections" ON google_calendar_connections;

CREATE POLICY "Users can manage own calendar connections"
  ON google_calendar_connections FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- Drop and recreate date_overrides policies
DROP POLICY IF EXISTS "Users can manage own date overrides" ON date_overrides;

CREATE POLICY "Users can manage own date overrides"
  ON date_overrides FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- Drop and recreate booking_analytics policies
DROP POLICY IF EXISTS "Users can view own analytics" ON booking_analytics;
DROP POLICY IF EXISTS "Users can insert own analytics" ON booking_analytics;

CREATE POLICY "Users can view own analytics"
  ON booking_analytics FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own analytics"
  ON booking_analytics FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- Drop and recreate booking_calendar_events policies
DROP POLICY IF EXISTS "Users can view own booking calendar events" ON booking_calendar_events;
DROP POLICY IF EXISTS "Users can update own booking calendar events" ON booking_calendar_events;
DROP POLICY IF EXISTS "Users can delete own booking calendar events" ON booking_calendar_events;

CREATE POLICY "Users can view own booking calendar events"
  ON booking_calendar_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_calendar_events.booking_id
      AND bookings.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can update own booking calendar events"
  ON booking_calendar_events FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_calendar_events.booking_id
      AND bookings.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_calendar_events.booking_id
      AND bookings.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can delete own booking calendar events"
  ON booking_calendar_events FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_calendar_events.booking_id
      AND bookings.user_id = (select auth.uid())
    )
  );

-- Fix function search paths for security
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public, pg_temp
SECURITY DEFINER;

DROP FUNCTION IF EXISTS generate_confirmation_token() CASCADE;
CREATE OR REPLACE FUNCTION generate_confirmation_token()
RETURNS text AS $$
DECLARE
  token text;
  exists_check boolean;
BEGIN
  LOOP
    token := encode(gen_random_bytes(16), 'hex');
    
    SELECT EXISTS(
      SELECT 1 FROM bookings WHERE confirmation_token = token
    ) INTO exists_check;
    
    EXIT WHEN NOT exists_check;
  END LOOP;
  
  RETURN token;
END;
$$ LANGUAGE plpgsql
SET search_path = public, pg_temp
SECURITY DEFINER;

-- Recreate triggers with updated functions
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_event_types_updated_at ON event_types;
CREATE TRIGGER update_event_types_updated_at BEFORE UPDATE ON event_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_availability_schedules_updated_at ON availability_schedules;
CREATE TRIGGER update_availability_schedules_updated_at BEFORE UPDATE ON availability_schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_google_calendar_connections_updated_at ON google_calendar_connections;
CREATE TRIGGER update_google_calendar_connections_updated_at BEFORE UPDATE ON google_calendar_connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
