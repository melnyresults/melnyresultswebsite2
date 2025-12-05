/*
  # Create Blog Supporting Tables

  1. New Tables
    - blog_likes: Track user likes on posts
    - blog_comments: Store post comments
    - blog_views: Track post views

  2. Security
    - Enable RLS on all tables
    - Appropriate policies for each table

  3. Features
    - Automatic likes_count update via triggers
    - Fingerprint-based tracking for anonymous users
*/

-- Create blog_likes table
CREATE TABLE IF NOT EXISTS blog_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  user_fingerprint text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_fingerprint)
);

-- Create blog_comments table
CREATE TABLE IF NOT EXISTS blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE NOT NULL,
  author_name text NOT NULL,
  author_email text NOT NULL,
  content text NOT NULL,
  approved boolean DEFAULT false,
  user_fingerprint text,
  created_at timestamptz DEFAULT now()
);

-- Create blog_views table
CREATE TABLE IF NOT EXISTS blog_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE NOT NULL,
  user_fingerprint text NOT NULL,
  viewed_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_fingerprint)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_blog_likes_post_id ON blog_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_approved ON blog_comments(approved);
CREATE INDEX IF NOT EXISTS idx_blog_views_post_id ON blog_views(post_id);

-- Function to increment likes count
CREATE OR REPLACE FUNCTION increment_blog_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE blog_posts
  SET likes_count = likes_count + 1
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement likes count
CREATE OR REPLACE FUNCTION decrement_blog_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE blog_posts
  SET likes_count = likes_count - 1
  WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Triggers for likes count
CREATE TRIGGER increment_likes_on_insert
  AFTER INSERT ON blog_likes
  FOR EACH ROW
  EXECUTE FUNCTION increment_blog_likes_count();

CREATE TRIGGER decrement_likes_on_delete
  AFTER DELETE ON blog_likes
  FOR EACH ROW
  EXECUTE FUNCTION decrement_blog_likes_count();

-- Enable RLS
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_likes
CREATE POLICY "Anyone can read likes"
  ON blog_likes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert likes"
  ON blog_likes
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can delete their own likes"
  ON blog_likes
  FOR DELETE
  TO public
  USING (true);

-- RLS Policies for blog_comments
CREATE POLICY "Anyone can read approved comments"
  ON blog_comments
  FOR SELECT
  TO public
  USING (approved = true);

CREATE POLICY "Authenticated users can read all comments"
  ON blog_comments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert comments"
  ON blog_comments
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update comments"
  ON blog_comments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete comments"
  ON blog_comments
  FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for blog_views
CREATE POLICY "Anyone can insert views"
  ON blog_views
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read views"
  ON blog_views
  FOR SELECT
  TO authenticated
  USING (true);

-- Grant permissions
GRANT SELECT, INSERT, DELETE ON blog_likes TO anon;
GRANT ALL ON blog_likes TO authenticated;
GRANT SELECT, INSERT ON blog_comments TO anon;
GRANT ALL ON blog_comments TO authenticated;
GRANT INSERT ON blog_views TO anon;
GRANT ALL ON blog_views TO authenticated;
