/*
  # Create Enhanced Blog System with SEO Fields

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `content` (text, required) 
      - `excerpt` (text, required)
      - `author` (text, required)
      - `published_at` (timestamptz, required)
      - `created_at` (timestamptz, auto)
      - `updated_at` (timestamptz, auto)
      - `image_url` (text, optional)
      - `likes_count` (integer, default 0)
      - `meta_title` (text, optional) - SEO meta title
      - `meta_description` (text, optional) - SEO meta description
      - `slug` (text, optional) - URL slug
      - `canonical_url` (text, optional) - Canonical URL
      - `keywords` (text, optional) - SEO keywords
      - `tags` (text, optional) - Post tags
    - `comments` - Blog post comments
    - `likes` - Post likes tracking
    - `marketing_submissions` - Form submissions
    - `newsletter_signups` - Email signups

  2. Security
    - Enable RLS on all tables
    - Public read access for published content
    - Insert policies for user interactions
*/

-- Create blog_posts table with enhanced SEO fields
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  author TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  image_url TEXT,
  likes_count INTEGER NOT NULL DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  slug TEXT,
  canonical_url TEXT,
  keywords TEXT,
  tags TEXT
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  content TEXT NOT NULL,
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_ip TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(post_id, user_ip)
);

-- Create marketing_submissions table
CREATE TABLE IF NOT EXISTS marketing_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company_name TEXT NOT NULL,
  how_did_you_find_us TEXT NOT NULL,
  monthly_spend TEXT NOT NULL,
  website TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create newsletter_signups table
CREATE TABLE IF NOT EXISTS newsletter_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_marketing_submissions_created_at ON marketing_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_signups_email ON newsletter_signups(email);

-- Insert sample blog posts with SEO fields
INSERT INTO blog_posts (
  title, 
  content, 
  excerpt, 
  author, 
  published_at, 
  image_url, 
  likes_count,
  meta_title,
  meta_description,
  slug,
  canonical_url,
  keywords,
  tags
) VALUES
(
  'Smart Small > Big Dumb',
  '<h2>Focus Creates Impact</h2><p>When you try to speak to everyone, you end up speaking to no one. Smart marketers identify their perfect customer and craft messages that resonate deeply with that specific audience.</p><h2>Quality Over Quantity</h2><p>A hundred highly qualified leads are worth more than a thousand tire-kickers. Focus on attracting the right people, not just more people.</p><h2>Efficiency Drives Profit</h2><p>Smart campaigns use resources efficiently. Instead of burning cash on broad targeting, invest in precise strategies that deliver measurable results.</p><p>Remember: Your goal isn''t to impress everyone with the size of your marketing budget. Your goal is to grow your business profitably.</p>',
  'Why smart, targeted campaigns always outperform massive, unfocused marketing efforts.',
  'Ivan Melnychenko',
  NOW() - INTERVAL '2 days',
  'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
  15,
  'Smart Small Beats Big Dumb Marketing - Melny Results',
  'Discover why targeted marketing campaigns outperform massive unfocused efforts. Learn smart strategies that drive real business growth.',
  'smart-small-beats-big-dumb-marketing',
  'https://melnyresults.com/blog/smart-small-beats-big-dumb-marketing',
  'targeted marketing, smart campaigns, marketing efficiency, business growth, marketing strategy',
  'marketing-strategy, business-growth, efficiency'
),
(
  'Easy Problem Fixer',
  '<h2>Identify Hidden Pain Points</h2><p>Your customers have problems they can''t articulate. Your job is to identify these hidden pain points and position your solution as the obvious answer.</p><h2>Simplify Complex Solutions</h2><p>Even if your service is complex, your explanation shouldn''t be. Break down your solution into simple, digestible benefits that anyone can understand.</p><h2>Be Proactive, Not Reactive</h2><p>Don''t wait for customers to come to you with problems. Anticipate their needs and present solutions before they even ask.</p><blockquote><p>"The best time to solve a problem is before it becomes a problem."</p></blockquote><p>When you position yourself as the easy problem fixer, customers don''t shop around. They come straight to you.</p>',
  'How to position yourself as the go-to solution for problems your customers don''t even know they have.',
  'Ivan Melnychenko',
  NOW() - INTERVAL '5 days',
  'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
  23,
  'Become the Easy Problem Fixer - Customer Solutions Guide',
  'Learn how to position your business as the go-to solution for customer problems they don''t even know they have.',
  'easy-problem-fixer-customer-solutions',
  'https://melnyresults.com/blog/easy-problem-fixer-customer-solutions',
  'problem solving, customer solutions, business positioning, proactive marketing, customer needs',
  'customer-solutions, positioning, problem-solving'
),
(
  'Do Less',
  '<h2>Focus Amplifies Results</h2><p>When you spread your efforts across too many initiatives, each one gets diluted attention. Focus your energy on the few things that drive the biggest impact.</p><h2>Expertise Comes from Repetition</h2><p>You can''t become world-class at something you only do occasionally. Pick your core strengths and double down on them.</p><h2>Clarity Attracts Customers</h2><p>Customers are confused by businesses that try to be everything to everyone. Clear positioning makes buying decisions easy.</p><h3>The 80/20 Rule in Action</h3><p>Identify the 20% of your activities that generate 80% of your results. Then eliminate or delegate everything else.</p><p>Stop trying to do it all. Start doing what matters most.</p>',
  'Why focusing on fewer things will actually grow your business faster than trying to do everything.',
  'Ivan Melnychenko',
  NOW() - INTERVAL '1 week',
  'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
  18,
  'Do Less, Achieve More - Business Focus Strategy',
  'Discover why focusing on fewer things will grow your business faster than trying to do everything. Master the art of strategic focus.',
  'do-less-achieve-more-business-focus',
  'https://melnyresults.com/blog/do-less-achieve-more-business-focus',
  'business focus, productivity, 80/20 rule, strategic planning, business efficiency',
  'productivity, focus, strategy'
);

-- Insert mock comments
INSERT INTO comments (post_id, author_name, author_email, content, approved)
SELECT
  id,
  'John Doe',
  'john@example.com',
  'Great article! Very informative and well-written.',
  true
FROM blog_posts
LIMIT 1;

-- Insert mock likes
INSERT INTO likes (post_id, user_ip)
SELECT
  id,
  '192.168.1.' || (random() * 255)::int::text
FROM blog_posts, generate_series(1, 3);

-- Enable Row Level Security (RLS) for tables
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_signups ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Enable read access for approved comments" ON comments FOR SELECT USING (approved = true);
CREATE POLICY "Enable read access for likes" ON likes FOR SELECT USING (true);

-- Create policies for insert access (anonymous users can insert)
CREATE POLICY "Enable insert for anonymous users" ON likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for anonymous users" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for anonymous users" ON marketing_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for anonymous users" ON newsletter_signups FOR INSERT WITH CHECK (true);