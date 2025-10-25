/*
  # Add Schema Type and Related Posts Support

  1. Changes to blog_posts table
    - Add `schema_type` (text, default 'blog') - Either 'blog' or 'custom'
    - Add `custom_schema` (jsonb, nullable) - Custom JSON-LD schema when schema_type is 'custom'
    - Add `related_post_ids` (text array, nullable) - Array of related post IDs for internal linking
  
  2. Behavior
    - schema_type defaults to 'blog' for automatic blog schema generation
    - When schema_type is 'custom', custom_schema field contains the JSON-LD data
    - related_post_ids stores IDs of posts to show as related content
  
  3. Notes
    - Related posts can be manually selected by the admin
    - Schema can be toggled between automatic blog schema and custom JSON-LD
*/

-- Add new columns to blog_posts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'schema_type'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN schema_type text DEFAULT 'blog';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'custom_schema'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN custom_schema jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'related_post_ids'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN related_post_ids text[];
  END IF;
END $$;

-- Create index for better query performance on related posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_related ON blog_posts USING GIN(related_post_ids);
