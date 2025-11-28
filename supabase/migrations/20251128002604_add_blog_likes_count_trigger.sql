/*
  # Add Automatic Likes Count Update

  ## Problem
  - The `likes_count` field in blog_posts needs to stay in sync with blog_likes table
  - Manual updates using supabase.sql don't work in JS client
  
  ## Solution
  - Create a function to count likes for a post
  - Create triggers to automatically update likes_count when likes are added/removed
  
  ## Changes
  1. Create function to update likes count
  2. Create trigger on INSERT to blog_likes
  3. Create trigger on DELETE from blog_likes
*/

-- Function to update likes count for a post
CREATE OR REPLACE FUNCTION update_blog_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the likes_count in blog_posts
  UPDATE blog_posts
  SET likes_count = (
    SELECT COUNT(*)
    FROM blog_likes
    WHERE post_id = COALESCE(NEW.post_id, OLD.post_id)
  )
  WHERE id = COALESCE(NEW.post_id, OLD.post_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger when a like is added
DROP TRIGGER IF EXISTS blog_likes_insert_trigger ON blog_likes;
CREATE TRIGGER blog_likes_insert_trigger
  AFTER INSERT ON blog_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_post_likes_count();

-- Trigger when a like is removed
DROP TRIGGER IF EXISTS blog_likes_delete_trigger ON blog_likes;
CREATE TRIGGER blog_likes_delete_trigger
  AFTER DELETE ON blog_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_post_likes_count();

-- Update existing posts to have correct likes count
UPDATE blog_posts
SET likes_count = (
  SELECT COUNT(*)
  FROM blog_likes
  WHERE blog_likes.post_id = blog_posts.id
);
