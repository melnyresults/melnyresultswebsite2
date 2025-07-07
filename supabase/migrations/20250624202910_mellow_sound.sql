/*
  # Add Likes System to Blog Posts

  1. New Tables
    - `post_likes`
      - `id` (uuid, primary key)
      - `post_id` (uuid, foreign key to blog_posts)
      - `user_ip` (text) - IP address for anonymous likes
      - `created_at` (timestamptz)

  2. Changes to Existing Tables
    - Add `likes_count` column to `blog_posts` table

  3. Security
    - Enable RLS on `post_likes` table
    - Add policies for public read/write access
    - Add function to update likes count

  4. Indexes
    - Index on `post_id` for efficient counting
    - Unique constraint on `post_id` + `user_ip` to prevent duplicate likes
*/

-- Add likes_count column to blog_posts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'likes_count'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN likes_count integer DEFAULT 0;
  END IF;
END $$;

-- Create post_likes table
CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_ip text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_ip)
);

-- Enable RLS on post_likes
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Allow public to read likes
CREATE POLICY "Anyone can read post likes"
  ON post_likes
  FOR SELECT
  TO public
  USING (true);

-- Allow public to insert likes (one per IP per post)
CREATE POLICY "Anyone can like posts"
  ON post_likes
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public to delete their own likes
CREATE POLICY "Anyone can unlike posts"
  ON post_likes
  FOR DELETE
  TO public
  USING (true);

-- Create index for efficient counting
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);

-- Function to update likes count
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE blog_posts 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE blog_posts 
    SET likes_count = GREATEST(likes_count - 1, 0) 
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update likes count
DROP TRIGGER IF EXISTS trigger_update_likes_count_insert ON post_likes;
CREATE TRIGGER trigger_update_likes_count_insert
  AFTER INSERT ON post_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_post_likes_count();

DROP TRIGGER IF EXISTS trigger_update_likes_count_delete ON post_likes;
CREATE TRIGGER trigger_update_likes_count_delete
  AFTER DELETE ON post_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_post_likes_count();

-- Update existing posts to have correct likes count
UPDATE blog_posts 
SET likes_count = (
  SELECT COUNT(*) 
  FROM post_likes 
  WHERE post_likes.post_id = blog_posts.id
);