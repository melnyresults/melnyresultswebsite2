/*
  # Create blog and marketing schema

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `excerpt` (text)
      - `author` (text)
      - `published_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `image_url` (text, optional)
      - `likes_count` (integer, default 0)
    
    - `comments`
      - `id` (uuid, primary key)
      - `post_id` (uuid, foreign key)
      - `author_name` (text)
      - `author_email` (text)
      - `content` (text)
      - `approved` (boolean, default false)
      - `created_at` (timestamptz)
    
    - `likes`
      - `id` (uuid, primary key)
      - `post_id` (uuid, foreign key)
      - `user_ip` (text)
      - `created_at` (timestamptz)
    
    - `marketing_submissions`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text)
      - `phone` (text)
      - `company_name` (text)
      - `how_did_you_find_us` (text)
      - `monthly_spend` (text)
      - `website` (text)
      - `created_at` (timestamptz)
    
    - `newsletter_signups`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to published blog posts
    - Add policies for authenticated admin access to all data
    - Add policies for public write access to comments, likes, and submissions
*/

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  excerpt text DEFAULT '',
  author text NOT NULL DEFAULT 'Ivan Melnychenko',
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  image_url text,
  likes_count integer DEFAULT 0
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  author_email text NOT NULL,
  content text NOT NULL,
  approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_ip text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_ip)
);

-- Create marketing_submissions table
CREATE TABLE IF NOT EXISTS marketing_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  company_name text NOT NULL,
  how_did_you_find_us text DEFAULT '',
  monthly_spend text DEFAULT '',
  website text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create newsletter_signups table
CREATE TABLE IF NOT EXISTS newsletter_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_signups ENABLE ROW LEVEL SECURITY;

-- Blog posts policies
CREATE POLICY "Anyone can read published blog posts"
  ON blog_posts
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage blog posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (true);

-- Comments policies
CREATE POLICY "Anyone can read approved comments"
  ON comments
  FOR SELECT
  TO public
  USING (approved = true);

CREATE POLICY "Anyone can create comments"
  ON comments
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage comments"
  ON comments
  FOR ALL
  TO authenticated
  USING (true);

-- Likes policies
CREATE POLICY "Anyone can read likes"
  ON likes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create likes"
  ON likes
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage likes"
  ON likes
  FOR ALL
  TO authenticated
  USING (true);

-- Marketing submissions policies (admin only)
CREATE POLICY "Only authenticated users can access marketing submissions"
  ON marketing_submissions
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create marketing submissions"
  ON marketing_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Newsletter signups policies (admin only)
CREATE POLICY "Only authenticated users can access newsletter signups"
  ON newsletter_signups
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create newsletter signups"
  ON newsletter_signups
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Insert sample blog posts
INSERT INTO blog_posts (title, content, excerpt, author, image_url, likes_count) VALUES
(
  'Smart Small > Big Dumb',
  '<p>In the world of marketing, bigger isn''t always better. Smart, targeted campaigns that speak directly to your ideal customers will always outperform massive, unfocused efforts.</p><p>Here''s why small and smart wins every time:</p><h2>Focus Creates Impact</h2><p>When you try to speak to everyone, you end up speaking to no one. Smart marketers identify their perfect customer and craft messages that resonate deeply with that specific audience.</p><h2>Quality Over Quantity</h2><p>A hundred highly qualified leads are worth more than a thousand tire-kickers. Focus on attracting the right people, not just more people.</p><h2>Efficiency Drives Profit</h2><p>Smart campaigns use resources efficiently. Instead of burning cash on broad targeting, invest in precise strategies that deliver measurable results.</p><p>Remember: Your goal isn''t to impress everyone with the size of your marketing budget. Your goal is to grow your business profitably.</p>',
  'Why smart, targeted campaigns always outperform massive, unfocused marketing efforts.',
  'Ivan Melnychenko',
  'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
  12
),
(
  'Easy Problem Fixer',
  '<p>The best marketing doesn''t feel like marketing. It feels like a solution to a problem your customer didn''t even know they had.</p><p>Here''s how to become the easy problem fixer in your industry:</p><h2>Identify Hidden Pain Points</h2><p>Your customers have problems they can''t articulate. Your job is to identify these hidden pain points and position your solution as the obvious answer.</p><h2>Simplify Complex Solutions</h2><p>Even if your service is complex, your explanation shouldn''t be. Break down your solution into simple, digestible benefits that anyone can understand.</p><h2>Be Proactive, Not Reactive</h2><p>Don''t wait for customers to come to you with problems. Anticipate their needs and present solutions before they even ask.</p><blockquote><p>"The best time to solve a problem is before it becomes a problem."</p></blockquote><p>When you position yourself as the easy problem fixer, customers don''t shop around. They come straight to you.</p>',
  'How to position yourself as the go-to solution for problems your customers don''t even know they have.',
  'Ivan Melnychenko',
  'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
  8
),
(
  'Do Less',
  '<p>The most successful businesses aren''t the ones doing everything. They''re the ones doing the right things exceptionally well.</p><p>Here''s why doing less is actually doing more:</p><h2>Focus Amplifies Results</h2><p>When you spread your efforts across too many initiatives, each one gets diluted attention. Focus your energy on the few things that drive the biggest impact.</p><h2>Expertise Comes from Repetition</h2><p>You can''t become world-class at something you only do occasionally. Pick your core strengths and double down on them.</p><h2>Clarity Attracts Customers</h2><p>Customers are confused by businesses that try to be everything to everyone. Clear positioning makes buying decisions easy.</p><h3>The 80/20 Rule in Action</h3><p>Identify the 20% of your activities that generate 80% of your results. Then eliminate or delegate everything else.</p><p>Stop trying to do it all. Start doing what matters most.</p>',
  'Why focusing on fewer things will actually grow your business faster than trying to do everything.',
  'Ivan Melnychenko',
  'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
  15
);