/*
  # Create Marketing Analysis Submissions Table

  1. New Tables
    - `marketing_analysis_submissions`
      - `id` (uuid, primary key)
      - `first_name` (text, required) - First name of the submitter
      - `last_name` (text, required) - Last name of the submitter
      - `email` (text, required) - Email address
      - `phone` (text, required) - Phone number
      - `company_name` (text, required) - Company name
      - `how_did_you_find_us` (text, optional) - How they found the company
      - `monthly_spend` (text, optional) - Monthly marketing spend range
      - `website` (text, optional) - Company website URL
      - `created_at` (timestamptz) - When the submission was created
      - `updated_at` (timestamptz) - When the record was last updated

  2. Security
    - Enable RLS on `marketing_analysis_submissions` table
    - Add policy for public insert access (form submissions)
    - Add policy for authenticated users to read all submissions (admin access)

  3. Indexes
    - Index on `created_at` for efficient sorting
    - Index on `email` for potential duplicate checking
*/

-- Create the marketing_analysis_submissions table
CREATE TABLE IF NOT EXISTS marketing_analysis_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  company_name text NOT NULL,
  how_did_you_find_us text DEFAULT '',
  monthly_spend text DEFAULT '',
  website text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE marketing_analysis_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for public form submissions
CREATE POLICY "Anyone can submit marketing analysis requests"
  ON marketing_analysis_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy for authenticated users to read submissions (admin access)
CREATE POLICY "Authenticated users can read all submissions"
  ON marketing_analysis_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_marketing_submissions_created_at ON marketing_analysis_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketing_submissions_email ON marketing_analysis_submissions(email);

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_marketing_submissions_updated_at ON marketing_analysis_submissions;
CREATE TRIGGER update_marketing_submissions_updated_at
  BEFORE UPDATE ON marketing_analysis_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();