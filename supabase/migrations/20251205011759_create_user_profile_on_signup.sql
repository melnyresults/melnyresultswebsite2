/*
  # Auto-create User Profile on Signup

  ## Changes Made
  
  1. **Automatic Profile Creation**
     - Create a trigger that automatically creates a user_profiles record when a new user signs up
     - Extracts email from auth.users and creates default profile values
     - Generates a default username from the email
  
  2. **Handle Existing Users**
     - Check if profile exists before creating
     - Prevents duplicate profile errors
  
  ## Security Notes
  
  - Trigger runs with security definer to bypass RLS during profile creation
  - Default values ensure profile is immediately usable
  - Username is generated as email prefix + random suffix if needed
*/

-- Function to generate unique username from email
CREATE OR REPLACE FUNCTION generate_username_from_email(email text)
RETURNS text AS $$
DECLARE
  base_username text;
  final_username text;
  counter int := 0;
BEGIN
  -- Extract username part from email (before @)
  base_username := split_part(email, '@', 1);
  
  -- Replace non-alphanumeric chars with underscore
  base_username := regexp_replace(base_username, '[^a-zA-Z0-9]', '_', 'g');
  
  -- Ensure username starts with letter
  IF base_username !~ '^[a-zA-Z]' THEN
    base_username := 'user_' || base_username;
  END IF;
  
  -- Try username, add number suffix if taken
  final_username := lower(base_username);
  
  WHILE EXISTS (SELECT 1 FROM user_profiles WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := lower(base_username) || counter::text;
  END LOOP;
  
  RETURN final_username;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create user profile when auth user is created
CREATE OR REPLACE FUNCTION create_user_profile_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create profile if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE id = NEW.id) THEN
    INSERT INTO public.user_profiles (
      id,
      email,
      full_name,
      username,
      timezone,
      welcome_message,
      is_active
    ) VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
      generate_username_from_email(NEW.email),
      'America/New_York',
      'Looking forward to connecting with you!',
      true
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile_on_signup();

-- Create profiles for any existing users who don't have one
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT id, email, raw_user_meta_data
    FROM auth.users
    WHERE id NOT IN (SELECT id FROM public.user_profiles)
  LOOP
    INSERT INTO public.user_profiles (
      id,
      email,
      full_name,
      username,
      timezone,
      welcome_message,
      is_active
    ) VALUES (
      user_record.id,
      user_record.email,
      COALESCE(user_record.raw_user_meta_data->>'full_name', split_part(user_record.email, '@', 1)),
      generate_username_from_email(user_record.email),
      'America/New_York',
      'Looking forward to connecting with you!',
      true
    );
  END LOOP;
END $$;
