/*
  # Fix Security and Performance Issues

  1. Foreign Key Indexes
    - Add missing indexes on foreign key columns for optimal query performance
    - Indexes: lead_notes.created_by, leads.user_id, pipelines.user_id

  2. RLS Policy Optimization
    - Wrap auth.uid() calls with (select auth.uid()) to prevent re-evaluation per row
    - Update all affected policies across multiple tables

  3. Remove Unused Indexes
    - Clean up indexes that are not being used to improve write performance

  4. Fix Multiple Permissive Policies
    - Consolidate or remove duplicate permissive policies
    - Keep the more specific/restrictive policies

  5. Function Search Path
    - Set search_path for all functions to prevent security issues
*/

-- ============================================================
-- 1. ADD MISSING FOREIGN KEY INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_lead_notes_created_by 
  ON lead_notes(created_by);

CREATE INDEX IF NOT EXISTS idx_leads_user_id 
  ON leads(user_id);

CREATE INDEX IF NOT EXISTS idx_pipelines_user_id 
  ON pipelines(user_id);

-- ============================================================
-- 2. OPTIMIZE RLS POLICIES - Replace auth.uid() with (select auth.uid())
-- ============================================================

-- PIPELINES TABLE
DROP POLICY IF EXISTS "Users can view own pipelines" ON pipelines;
CREATE POLICY "Users can view own pipelines"
  ON pipelines FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create own pipelines" ON pipelines;
CREATE POLICY "Users can create own pipelines"
  ON pipelines FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own pipelines" ON pipelines;
CREATE POLICY "Users can update own pipelines"
  ON pipelines FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own pipelines" ON pipelines;
CREATE POLICY "Users can delete own pipelines"
  ON pipelines FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- PIPELINE_STAGES TABLE
DROP POLICY IF EXISTS "Users can view stages of own pipelines" ON pipeline_stages;
CREATE POLICY "Users can view stages of own pipelines"
  ON pipeline_stages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pipelines
      WHERE pipelines.id = pipeline_stages.pipeline_id
      AND pipelines.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create stages in own pipelines" ON pipeline_stages;
CREATE POLICY "Users can create stages in own pipelines"
  ON pipeline_stages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pipelines
      WHERE pipelines.id = pipeline_stages.pipeline_id
      AND pipelines.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update stages in own pipelines" ON pipeline_stages;
CREATE POLICY "Users can update stages in own pipelines"
  ON pipeline_stages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pipelines
      WHERE pipelines.id = pipeline_stages.pipeline_id
      AND pipelines.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pipelines
      WHERE pipelines.id = pipeline_stages.pipeline_id
      AND pipelines.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can delete stages in own pipelines" ON pipeline_stages;
CREATE POLICY "Users can delete stages in own pipelines"
  ON pipeline_stages FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pipelines
      WHERE pipelines.id = pipeline_stages.pipeline_id
      AND pipelines.user_id = (select auth.uid())
    )
  );

-- LEADS TABLE
DROP POLICY IF EXISTS "Users can view own leads" ON leads;
CREATE POLICY "Users can view own leads"
  ON leads FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create own leads" ON leads;
CREATE POLICY "Users can create own leads"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own leads" ON leads;
CREATE POLICY "Users can update own leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own leads" ON leads;
CREATE POLICY "Users can delete own leads"
  ON leads FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- LEAD_NOTES TABLE
DROP POLICY IF EXISTS "Users can view notes on own leads" ON lead_notes;
CREATE POLICY "Users can view notes on own leads"
  ON lead_notes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_notes.lead_id
      AND leads.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create notes on own leads" ON lead_notes;
CREATE POLICY "Users can create notes on own leads"
  ON lead_notes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_notes.lead_id
      AND leads.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update own notes" ON lead_notes;
CREATE POLICY "Users can update own notes"
  ON lead_notes FOR UPDATE
  TO authenticated
  USING (created_by = (select auth.uid()))
  WITH CHECK (created_by = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own notes" ON lead_notes;
CREATE POLICY "Users can delete own notes"
  ON lead_notes FOR DELETE
  TO authenticated
  USING (created_by = (select auth.uid()));

-- LEAD_PAYMENTS TABLE
DROP POLICY IF EXISTS "Users can view payments on own leads" ON lead_payments;
CREATE POLICY "Users can view payments on own leads"
  ON lead_payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_payments.lead_id
      AND leads.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create payments on own leads" ON lead_payments;
CREATE POLICY "Users can create payments on own leads"
  ON lead_payments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_payments.lead_id
      AND leads.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update payments on own leads" ON lead_payments;
CREATE POLICY "Users can update payments on own leads"
  ON lead_payments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_payments.lead_id
      AND leads.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_payments.lead_id
      AND leads.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can delete payments on own leads" ON lead_payments;
CREATE POLICY "Users can delete payments on own leads"
  ON lead_payments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_payments.lead_id
      AND leads.user_id = (select auth.uid())
    )
  );

-- PLATFORM_CONNECTIONS TABLE
DROP POLICY IF EXISTS "Users can view own connections" ON platform_connections;
CREATE POLICY "Users can view own connections"
  ON platform_connections FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create own connections" ON platform_connections;
CREATE POLICY "Users can create own connections"
  ON platform_connections FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own connections" ON platform_connections;
CREATE POLICY "Users can update own connections"
  ON platform_connections FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own connections" ON platform_connections;
CREATE POLICY "Users can delete own connections"
  ON platform_connections FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- PLATFORM_METRICS TABLE
DROP POLICY IF EXISTS "Users can view own metrics" ON platform_metrics;
CREATE POLICY "Users can view own metrics"
  ON platform_metrics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM platform_connections
      WHERE platform_connections.id = platform_metrics.connection_id
      AND platform_connections.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can insert own metrics" ON platform_metrics;
CREATE POLICY "Users can insert own metrics"
  ON platform_metrics FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM platform_connections
      WHERE platform_connections.id = platform_metrics.connection_id
      AND platform_connections.user_id = (select auth.uid())
    )
  );

-- PLATFORM_INTEGRATIONS TABLE (if policies exist)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'platform_integrations' 
    AND policyname = 'Authenticated users can create integrations'
  ) THEN
    DROP POLICY "Authenticated users can create integrations" ON platform_integrations;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'platform_integrations' 
    AND policyname = 'Users can update their own integrations'
  ) THEN
    DROP POLICY "Users can update their own integrations" ON platform_integrations;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'platform_integrations' 
    AND policyname = 'Users can delete their own integrations'
  ) THEN
    DROP POLICY "Users can delete their own integrations" ON platform_integrations;
  END IF;
END $$;

-- ============================================================
-- 3. REMOVE UNUSED INDEXES
-- ============================================================

DROP INDEX IF EXISTS idx_platform_integrations_connected;
DROP INDEX IF EXISTS idx_platform_integrations_created_by;
DROP INDEX IF EXISTS idx_marketing_submissions_created_at;
DROP INDEX IF EXISTS idx_newsletter_signups_email;
DROP INDEX IF EXISTS idx_lead_notes_lead_id;
DROP INDEX IF EXISTS idx_leads_pipeline_id;
DROP INDEX IF EXISTS idx_leads_stage_id;
DROP INDEX IF EXISTS idx_lead_payments_lead_id;
DROP INDEX IF EXISTS idx_opportunities_pipeline_id;
DROP INDEX IF EXISTS idx_opportunities_stage_id;
DROP INDEX IF EXISTS idx_opportunities_status;
DROP INDEX IF EXISTS idx_pipeline_stages_pipeline_id;
DROP INDEX IF EXISTS idx_blog_posts_slug;
DROP INDEX IF EXISTS idx_blog_posts_scheduled_publish;
DROP INDEX IF EXISTS idx_blog_posts_published;
DROP INDEX IF EXISTS idx_blog_posts_related;
DROP INDEX IF EXISTS idx_blog_comments_approved;
DROP INDEX IF EXISTS idx_opportunity_payments_opportunity_id;
DROP INDEX IF EXISTS idx_notifications_is_read;
DROP INDEX IF EXISTS idx_platform_connections_user_id;
DROP INDEX IF EXISTS idx_platform_connections_platform_id;
DROP INDEX IF EXISTS idx_platform_connections_status;
DROP INDEX IF EXISTS idx_platform_metrics_connection_id;
DROP INDEX IF EXISTS idx_platform_metrics_date;
DROP INDEX IF EXISTS idx_platform_metrics_connection_date;

-- ============================================================
-- 4. FIX MULTIPLE PERMISSIVE POLICIES
-- ============================================================

-- Remove generic policies when specific ones exist

-- PIPELINES: Keep user-specific, remove generic
DROP POLICY IF EXISTS "Authenticated users can view pipelines" ON pipelines;
DROP POLICY IF EXISTS "Authenticated users can create pipelines" ON pipelines;
DROP POLICY IF EXISTS "Authenticated users can update pipelines" ON pipelines;
DROP POLICY IF EXISTS "Authenticated users can delete pipelines" ON pipelines;

-- PIPELINE_STAGES: Keep user-specific, remove generic
DROP POLICY IF EXISTS "Authenticated users can view pipeline stages" ON pipeline_stages;
DROP POLICY IF EXISTS "Authenticated users can create pipeline stages" ON pipeline_stages;
DROP POLICY IF EXISTS "Authenticated users can update pipeline stages" ON pipeline_stages;
DROP POLICY IF EXISTS "Authenticated users can delete pipeline stages" ON pipeline_stages;

-- BLOG_POSTS: Keep the anonymous-friendly policy for viewing
DROP POLICY IF EXISTS "Authenticated users can view all posts" ON blog_posts;

-- BLOG_COMMENTS: Keep the anonymous-friendly policy for viewing
DROP POLICY IF EXISTS "Authenticated users can view all comments" ON blog_comments;

-- SITE_SETTINGS: Keep the anonymous-friendly policy
DROP POLICY IF EXISTS "Authenticated users can manage settings" ON site_settings;

-- ============================================================
-- 5. SET SEARCH_PATH FOR FUNCTIONS
-- ============================================================

ALTER FUNCTION update_blog_post_likes_count() SET search_path = public, pg_temp;
ALTER FUNCTION notify_new_opportunity() SET search_path = public, pg_temp;
ALTER FUNCTION notify_deal_won() SET search_path = public, pg_temp;
ALTER FUNCTION update_platform_connection_timestamp() SET search_path = public, pg_temp;
ALTER FUNCTION update_updated_at_column() SET search_path = public, pg_temp;
