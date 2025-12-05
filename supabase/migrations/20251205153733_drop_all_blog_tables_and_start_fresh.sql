/*
  # Complete Blog System Cleanup

  1. Cleanup Actions
    - Drop all blog-related tables (blog_posts, blog_likes, blog_comments, blog_views)
    - Drop all related triggers and functions
    - Remove all policies (RLS will be dropped with tables)
  
  2. Notes
    - This is a complete reset of the blog system
    - All blog data will be permanently deleted
    - Tables will be recreated in the next migration
*/

-- Drop triggers first
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
DROP TRIGGER IF EXISTS increment_likes_count ON blog_likes;
DROP TRIGGER IF EXISTS decrement_likes_count ON blog_likes;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS increment_post_likes() CASCADE;
DROP FUNCTION IF EXISTS decrement_post_likes() CASCADE;

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS blog_comments CASCADE;
DROP TABLE IF EXISTS blog_likes CASCADE;
DROP TABLE IF EXISTS blog_views CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
