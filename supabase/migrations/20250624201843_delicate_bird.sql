/*
  # Create Blog Posts Table

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text, required) - The blog post title
      - `content` (text, required) - The full blog post content (HTML supported)
      - `excerpt` (text, optional) - Short description/preview of the post
      - `author` (text, required) - Author name, defaults to 'Ivan Melnychenko'
      - `image_url` (text, optional) - Featured image URL
      - `published_at` (timestamptz, required) - When the post should be published
      - `created_at` (timestamptz) - When the record was created
      - `updated_at` (timestamptz) - When the record was last updated

  2. Security
    - Enable RLS on `blog_posts` table
    - Add policy for public read access to published posts
    - Add policy for authenticated users to manage all posts
    - Add policy for authenticated users to create posts

  3. Indexes
    - Index on `published_at` for efficient sorting
    - Index on `created_at` for admin dashboard sorting
*/

-- Create the blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  excerpt text DEFAULT '',
  author text NOT NULL DEFAULT 'Ivan Melnychenko',
  image_url text,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can read published blog posts"
  ON blog_posts
  FOR SELECT
  TO public
  USING (published_at <= now());

-- Create policies for authenticated users (admin access)
CREATE POLICY "Authenticated users can insert blog posts"
  ON blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update blog posts"
  ON blog_posts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete blog posts"
  ON blog_posts
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();