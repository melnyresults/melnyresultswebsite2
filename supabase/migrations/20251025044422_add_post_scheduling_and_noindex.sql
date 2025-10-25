/*
  # Add Post Scheduling and NoIndex Support

  1. Changes to blog_posts table
    - Add `scheduled_publish_date` (timestamptz, nullable) - When the post should be published
    - Add `is_published` (boolean, default false) - Whether the post is currently published
    - Add `noindex` (boolean, default false) - Whether to exclude from search engine indexing
  
  2. Behavior
    - Posts with scheduled_publish_date in the future are not visible to public
    - Posts with is_published = false are not visible to public
    - Posts with noindex = true are excluded from sitemap.xml
    - Authenticated admins can see all posts regardless of status
  
  3. Security
    - Update RLS policies to respect scheduling and publish status
*/

-- Add new columns to blog_posts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'scheduled_publish_date'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN scheduled_publish_date timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'is_published'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN is_published boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'noindex'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN noindex boolean DEFAULT false;
  END IF;
END $$;

-- Create index for scheduled posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_scheduled_publish ON blog_posts(scheduled_publish_date) WHERE scheduled_publish_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published) WHERE is_published = true;

-- Drop old public view policy
DROP POLICY IF EXISTS "Anyone can view published posts" ON blog_posts;

-- Create new policy that respects scheduling
CREATE POLICY "Anyone can view published and scheduled posts"
  ON blog_posts FOR SELECT
  TO public
  USING (
    is_published = true 
    AND (
      scheduled_publish_date IS NULL 
      OR scheduled_publish_date <= now()
    )
  );

-- Authenticated users can see all posts
CREATE POLICY "Authenticated users can view all posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (true);
