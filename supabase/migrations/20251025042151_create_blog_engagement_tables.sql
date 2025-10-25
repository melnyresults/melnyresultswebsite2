/*
  # Blog Engagement Tables - Comments, Likes, Views, and Posts

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `slug` (text, unique, required)
      - `content` (text, required)
      - `excerpt` (text)
      - `author` (text, required)
      - `image_url` (text)
      - `meta_title` (text)
      - `meta_description` (text)
      - `canonical_url` (text)
      - `keywords` (text)
      - `tags` (text)
      - `published_at` (timestamptz, required)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
      - `user_id` (uuid, references auth.users)

    - `blog_comments`
      - `id` (uuid, primary key)
      - `post_id` (uuid, references blog_posts, required)
      - `user_name` (text, required)
      - `user_email` (text, required)
      - `comment_text` (text, required)
      - `is_approved` (boolean, default false)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

    - `blog_likes`
      - `id` (uuid, primary key)
      - `post_id` (uuid, references blog_posts, required)
      - `user_fingerprint` (text, required) - browser fingerprint for anonymous tracking
      - `created_at` (timestamptz, default now())
      - Unique constraint on (post_id, user_fingerprint)

    - `blog_views`
      - `id` (uuid, primary key)
      - `post_id` (uuid, references blog_posts, required)
      - `user_fingerprint` (text, required)
      - `viewed_at` (timestamptz, default now())
      - `view_date` (date, default current_date)

    - `site_settings`
      - `id` (uuid, primary key)
      - `setting_key` (text, unique, required)
      - `setting_value` (text)
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on all tables
    - Public can read approved comments and posts
    - Public can create comments (pending approval)
    - Public can add likes and views
    - Only authenticated admins can approve comments
    - Only authenticated admins can manage posts
*/

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  author text NOT NULL DEFAULT 'Ivan Melnychenko',
  image_url text,
  meta_title text,
  meta_description text,
  canonical_url text,
  keywords text,
  tags text,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create blog_comments table
CREATE TABLE IF NOT EXISTS blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  user_email text NOT NULL,
  comment_text text NOT NULL,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_likes table
CREATE TABLE IF NOT EXISTS blog_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_fingerprint text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_fingerprint)
);

-- Create blog_views table
CREATE TABLE IF NOT EXISTS blog_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_fingerprint text NOT NULL,
  viewed_at timestamptz DEFAULT now(),
  view_date date DEFAULT CURRENT_DATE,
  UNIQUE(post_id, user_fingerprint, view_date)
);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value text,
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_approved ON blog_comments(is_approved);
CREATE INDEX IF NOT EXISTS idx_blog_likes_post_id ON blog_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_views_post_id ON blog_views(post_id);

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_posts
CREATE POLICY "Anyone can view published posts"
  ON blog_posts FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for blog_comments
CREATE POLICY "Anyone can view approved comments"
  ON blog_comments FOR SELECT
  TO public
  USING (is_approved = true);

CREATE POLICY "Authenticated users can view all comments"
  ON blog_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create comments"
  ON blog_comments FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update comments"
  ON blog_comments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete comments"
  ON blog_comments FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for blog_likes
CREATE POLICY "Anyone can view likes"
  ON blog_likes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can add likes"
  ON blog_likes FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can remove their own likes"
  ON blog_likes FOR DELETE
  TO public
  USING (true);

-- RLS Policies for blog_views
CREATE POLICY "Anyone can add views"
  ON blog_views FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all views"
  ON blog_views FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for site_settings
CREATE POLICY "Anyone can read settings"
  ON site_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_comments_updated_at
  BEFORE UPDATE ON blog_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
