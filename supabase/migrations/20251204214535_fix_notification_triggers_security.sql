/*
  # Fix Notification Triggers Security

  1. Changes
    - Update notification trigger functions to use SECURITY DEFINER
    - This allows the functions to bypass RLS when creating notifications
    - Necessary because notifications are system-generated, not user-created
    - Add INSERT policy for notifications as a fallback

  2. Security
    - SECURITY DEFINER allows functions to run with creator's privileges
    - Add INSERT policy for authenticated users as well
    - This ensures both triggers and manual inserts work correctly
*/

-- Update the notify_new_opportunity function to use SECURITY DEFINER
CREATE OR REPLACE FUNCTION notify_new_opportunity()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pipeline_name text;
BEGIN
  -- Get pipeline name
  SELECT name INTO pipeline_name
  FROM pipelines
  WHERE id = NEW.pipeline_id;

  -- Create notification
  INSERT INTO notifications (type, title, message, link, metadata)
  VALUES (
    'new_lead',
    'New Lead Created',
    format('New opportunity "%s" ($%s) added to %s pipeline', 
      NEW.lead_name, 
      NEW.value::text,
      COALESCE(pipeline_name, 'Unknown')
    ),
    '/admin/dashboard',
    jsonb_build_object(
      'opportunity_id', NEW.id,
      'pipeline_id', NEW.pipeline_id,
      'lead_name', NEW.lead_name,
      'value', NEW.value
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update the notify_deal_won function to use SECURITY DEFINER
CREATE OR REPLACE FUNCTION notify_deal_won()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pipeline_name text;
BEGIN
  -- Only notify when status changes to 'won'
  IF NEW.status = 'won' AND (OLD.status IS NULL OR OLD.status != 'won') THEN
    -- Get pipeline name
    SELECT name INTO pipeline_name
    FROM pipelines
    WHERE id = NEW.pipeline_id;

    -- Create notification
    INSERT INTO notifications (type, title, message, link, metadata)
    VALUES (
      'deal_won',
      'Deal Closed Won!',
      format('"%s" deal worth $%s has been closed!', 
        NEW.lead_name,
        NEW.value::text
      ),
      '/admin/dashboard',
      jsonb_build_object(
        'opportunity_id', NEW.id,
        'pipeline_id', NEW.pipeline_id,
        'lead_name', NEW.lead_name,
        'value', NEW.value
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add INSERT policy for notifications (fallback for any manual inserts)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'notifications' 
    AND policyname = 'Authenticated users can create notifications'
  ) THEN
    CREATE POLICY "Authenticated users can create notifications"
      ON notifications
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;
