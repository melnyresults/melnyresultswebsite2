/*
  # Create Newsletter Signups Table

  1. New Tables
    - `newsletter_signups`
      - `id` (uuid, primary key)
      - `email` (text, required, unique) - Email address of subscriber
      - `created_at` (timestamptz) - When the signup occurred
      - `updated_at` (timestamptz) - When the record was last updated
      - `confirmed` (boolean) - Whether the email has been confirmed
      - `unsubscribed` (boolean) - Whether the user has unsubscribed

  2. Security
    - Enable RLS on `newsletter_signups` table
    - Add policy for public insert access (newsletter signups)
    - Add policy for authenticated users to read all signups (admin access)

  3. Indexes
    - Index on `created_at` for efficient sorting
    - Index on `email` for quick lookups and duplicate prevention
*/

-- Create the newsletter_signups table
CREATE TABLE IF NOT EXISTS newsletter_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  confirmed boolean DEFAULT false,
  unsubscribed boolean DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE newsletter_signups ENABLE ROW LEVEL SECURITY;

-- Create policy for public newsletter signups
CREATE POLICY "Anyone can sign up for newsletter"
  ON newsletter_signups
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy for authenticated users to read signups (admin access)
CREATE POLICY "Authenticated users can read all newsletter signups"
  ON newsletter_signups
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_newsletter_signups_created_at ON newsletter_signups(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_signups_email ON newsletter_signups(email);

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_newsletter_signups_updated_at ON newsletter_signups;
CREATE TRIGGER update_newsletter_signups_updated_at
  BEFORE UPDATE ON newsletter_signups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();