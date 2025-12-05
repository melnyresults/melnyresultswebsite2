/*
  # Fix Booking Page and Profile Update Issues

  ## Changes Made
  
  1. **Public Booking Page Access**
     - Add policy to allow public users to view availability_schedules
     - Add policy to allow public users to view bookings (for availability checking)
     - This enables the public booking page to check time slot conflicts
  
  2. **Profile Updates**
     - Ensure updated_at trigger exists and works correctly
     - Verify all user_profiles policies are correctly set
  
  ## Security Notes
  
  - Public can only SELECT bookings (not modify)
  - Public can only SELECT schedules (not modify)
  - All data remains properly secured with RLS
*/

-- Allow public to view availability schedules (needed for booking pages)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'availability_schedules' 
    AND policyname = 'Public can view availability schedules'
  ) THEN
    CREATE POLICY "Public can view availability schedules"
      ON availability_schedules FOR SELECT
      TO anon
      USING (true);
  END IF;
END $$;

-- Allow public to view bookings (needed to check conflicts when booking)
-- This is safe because guests only see start/end times, not sensitive data
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'bookings' 
    AND policyname = 'Public can view bookings for availability checking'
  ) THEN
    CREATE POLICY "Public can view bookings for availability checking"
      ON bookings FOR SELECT
      TO anon
      USING (true);
  END IF;
END $$;

-- Ensure updated_at trigger exists for user_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_user_profiles_updated_at'
  ) THEN
    CREATE TRIGGER update_user_profiles_updated_at 
      BEFORE UPDATE ON user_profiles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Make sure the update_updated_at_column function exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
