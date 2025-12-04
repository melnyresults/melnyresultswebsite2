/*
  # Create Notifications System

  1. New Tables
    - `notifications`
      - `id` (uuid, primary key)
      - `type` (text, notification type like 'new_lead', 'deal_won', etc.)
      - `title` (text, notification title)
      - `message` (text, notification message)
      - `link` (text, optional URL to navigate to)
      - `metadata` (jsonb, additional data like opportunity_id, pipeline_id, etc.)
      - `is_read` (boolean, default false)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on notifications table
    - Add policies for authenticated users to view and mark as read

  3. Triggers
    - Create trigger to auto-generate notifications when opportunities are created
    - Notifications are system-wide for all authenticated users

  4. Functions
    - Function to create notification when opportunity is created
*/

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'info',
  title text NOT NULL,
  message text NOT NULL,
  link text,
  metadata jsonb DEFAULT '{}',
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can mark notifications as read"
  ON notifications FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Function to create notification for new opportunity
CREATE OR REPLACE FUNCTION notify_new_opportunity()
RETURNS TRIGGER AS $$
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

-- Create trigger for new opportunities
DROP TRIGGER IF EXISTS trigger_notify_new_opportunity ON opportunities;
CREATE TRIGGER trigger_notify_new_opportunity
  AFTER INSERT ON opportunities
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_opportunity();

-- Function to create notification when deal is won
CREATE OR REPLACE FUNCTION notify_deal_won()
RETURNS TRIGGER AS $$
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
      'Deal Closed Won! 🎉',
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

-- Create trigger for won deals
DROP TRIGGER IF EXISTS trigger_notify_deal_won ON opportunities;
CREATE TRIGGER trigger_notify_deal_won
  AFTER UPDATE ON opportunities
  FOR EACH ROW
  EXECUTE FUNCTION notify_deal_won();
