/*
  # Create CRM Tables

  1. New Tables
    - `pipelines`
      - `id` (uuid, primary key)
      - `name` (text, pipeline name)
      - `description` (text, optional description)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `pipeline_stages`
      - `id` (uuid, primary key)
      - `pipeline_id` (uuid, foreign key to pipelines)
      - `name` (text, stage name like "Prospecting", "Qualified", etc.)
      - `order` (integer, for ordering stages)
      - `color` (text, hex color for UI)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `opportunities`
      - `id` (uuid, primary key)
      - `pipeline_id` (uuid, foreign key to pipelines)
      - `stage_id` (uuid, foreign key to pipeline_stages)
      - `lead_name` (text, contact name)
      - `business_name` (text, company name)
      - `value` (decimal, deal value in USD)
      - `location` (text, location/state)
      - `city` (text, city)
      - `phone_number` (text, contact phone)
      - `email` (text, contact email)
      - `tags` (text[], array of tags)
      - `source` (text, lead source like "Website", "Referral", etc.)
      - `source_owner` (text, sales rep who brought the lead)
      - `notes` (text, lead notes)
      - `status` (text, "open", "won", "lost")
      - `closed_at` (timestamptz, when deal was closed)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `opportunity_payments`
      - `id` (uuid, primary key)
      - `opportunity_id` (uuid, foreign key to opportunities)
      - `amount` (decimal, payment amount)
      - `payment_date` (timestamptz, when payment was made)
      - `payment_method` (text, payment method)
      - `notes` (text, payment notes)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their CRM data
*/

-- Create pipelines table
CREATE TABLE IF NOT EXISTS pipelines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pipelines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view pipelines"
  ON pipelines FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create pipelines"
  ON pipelines FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update pipelines"
  ON pipelines FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete pipelines"
  ON pipelines FOR DELETE
  TO authenticated
  USING (true);

-- Create pipeline_stages table
CREATE TABLE IF NOT EXISTS pipeline_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id uuid REFERENCES pipelines(id) ON DELETE CASCADE,
  name text NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  color text DEFAULT '#3B82F6',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view pipeline stages"
  ON pipeline_stages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create pipeline stages"
  ON pipeline_stages FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update pipeline stages"
  ON pipeline_stages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete pipeline stages"
  ON pipeline_stages FOR DELETE
  TO authenticated
  USING (true);

-- Create opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id uuid REFERENCES pipelines(id) ON DELETE CASCADE,
  stage_id uuid REFERENCES pipeline_stages(id) ON DELETE SET NULL,
  lead_name text NOT NULL,
  business_name text DEFAULT '',
  value decimal(10, 2) DEFAULT 0,
  location text DEFAULT '',
  city text DEFAULT '',
  phone_number text DEFAULT '',
  email text DEFAULT '',
  tags text[] DEFAULT '{}',
  source text DEFAULT '',
  source_owner text DEFAULT '',
  notes text DEFAULT '',
  status text DEFAULT 'open',
  closed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view opportunities"
  ON opportunities FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create opportunities"
  ON opportunities FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update opportunities"
  ON opportunities FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete opportunities"
  ON opportunities FOR DELETE
  TO authenticated
  USING (true);

-- Create opportunity_payments table
CREATE TABLE IF NOT EXISTS opportunity_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid REFERENCES opportunities(id) ON DELETE CASCADE,
  amount decimal(10, 2) NOT NULL,
  payment_date timestamptz DEFAULT now(),
  payment_method text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE opportunity_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view opportunity payments"
  ON opportunity_payments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create opportunity payments"
  ON opportunity_payments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update opportunity payments"
  ON opportunity_payments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete opportunity payments"
  ON opportunity_payments FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_pipeline_stages_pipeline_id ON pipeline_stages(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_pipeline_id ON opportunities(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_stage_id ON opportunities(stage_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON opportunities(status);
CREATE INDEX IF NOT EXISTS idx_opportunity_payments_opportunity_id ON opportunity_payments(opportunity_id);

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_pipelines_updated_at') THEN
    CREATE TRIGGER update_pipelines_updated_at
      BEFORE UPDATE ON pipelines
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_pipeline_stages_updated_at') THEN
    CREATE TRIGGER update_pipeline_stages_updated_at
      BEFORE UPDATE ON pipeline_stages
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_opportunities_updated_at') THEN
    CREATE TRIGGER update_opportunities_updated_at
      BEFORE UPDATE ON opportunities
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_opportunity_payments_updated_at') THEN
    CREATE TRIGGER update_opportunity_payments_updated_at
      BEFORE UPDATE ON opportunity_payments
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
