-- Create blog_posts table
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
  likes_count INTEGER NOT NULL DEFAULT 0
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
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_marketing_submissions_created_at ON marketing_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_signups_email ON newsletter_signups(email);

-- Insert mock blog posts
INSERT INTO blog_posts (title, content, excerpt, author, published_at, image_url, likes_count) VALUES
(
  'The Future of Digital Marketing in 2024',
  '<h2>Introduction</h2><p>Digital marketing is evolving at an unprecedented pace. In this comprehensive guide, we explore the latest trends and strategies that will shape the industry in 2024.</p><h2>AI-Powered Marketing</h2><p>Artificial intelligence is revolutionizing how we approach marketing campaigns. From predictive analytics to personalized content creation, AI tools are becoming indispensable.</p><h2>Video Content Dominance</h2><p>Short-form video content continues to dominate social media platforms. Brands that adapt their strategies to include engaging video content will see significantly better engagement rates.</p><h2>Conclusion</h2><p>Staying ahead in digital marketing requires continuous learning and adaptation. Embrace these trends to maintain a competitive edge.</p>',
  'Discover the key trends and strategies that will define digital marketing in 2024, from AI-powered tools to video content dominance.',
  'Sarah Johnson',
  NOW() - INTERVAL '2 days',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop',
  15
),
(
  'SEO Best Practices for Small Businesses',
  '<h2>Getting Started with SEO</h2><p>Search Engine Optimization doesn''t have to be complicated. This guide will walk you through the essential SEO practices every small business should implement.</p><h2>Keyword Research</h2><p>Understanding what your customers are searching for is the foundation of good SEO. Use tools like Google Keyword Planner to identify relevant keywords.</p><h2>On-Page Optimization</h2><p>Optimize your website''s title tags, meta descriptions, and header tags. Make sure your content is well-structured and easy to read.</p><h2>Local SEO</h2><p>For small businesses, local SEO is crucial. Claim your Google Business Profile and ensure your NAP (Name, Address, Phone) information is consistent across all platforms.</p>',
  'Learn the essential SEO practices that can help small businesses improve their online visibility and attract more customers.',
  'Michael Chen',
  NOW() - INTERVAL '5 days',
  'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=800&auto=format&fit=crop',
  23
),
(
  'Social Media Strategy: Building Authentic Connections',
  '<h2>The Power of Authenticity</h2><p>In an era of information overload, authenticity has become the currency of social media success. Consumers are increasingly savvy and can spot inauthentic content from miles away.</p><h2>Know Your Audience</h2><p>Understanding your audience is paramount. Create detailed buyer personas and tailor your content to address their specific needs and pain points.</p><h2>Engagement Over Broadcasting</h2><p>Social media is a two-way street. Respond to comments, ask questions, and create content that encourages conversation.</p><h2>Consistency is Key</h2><p>Develop a content calendar and stick to a regular posting schedule. Consistency builds trust and keeps your brand top of mind.</p>',
  'Discover how to build meaningful connections with your audience through authentic social media marketing strategies.',
  'Emily Rodriguez',
  NOW() - INTERVAL '1 week',
  'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop',
  31
),
(
  'Email Marketing: Still Effective in 2024',
  '<h2>The Email Marketing Renaissance</h2><p>Despite predictions of its demise, email marketing remains one of the most effective digital marketing channels, with an average ROI of $42 for every $1 spent.</p><h2>Personalization Matters</h2><p>Gone are the days of generic blast emails. Use segmentation and personalization to deliver relevant content to your subscribers.</p><h2>Mobile Optimization</h2><p>Over 60% of emails are opened on mobile devices. Ensure your emails are responsive and look great on all screen sizes.</p><h2>Testing and Analytics</h2><p>A/B test your subject lines, content, and send times. Use analytics to continuously improve your email marketing performance.</p>',
  'Email marketing continues to deliver impressive ROI. Learn how to create effective email campaigns that convert.',
  'David Thompson',
  NOW() - INTERVAL '10 days',
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop',
  18
),
(
  'Content Marketing: Quality Over Quantity',
  '<h2>The Content Conundrum</h2><p>Many businesses fall into the trap of prioritizing quantity over quality. However, creating fewer, higher-quality pieces of content often yields better results.</p><h2>Understanding Your Audience''s Journey</h2><p>Create content that addresses each stage of the buyer''s journey: awareness, consideration, and decision.</p><h2>Evergreen vs. Trending Content</h2><p>Balance your content strategy with both evergreen content that remains relevant over time and timely pieces that capitalize on current trends.</p><h2>Repurposing Content</h2><p>Maximize the value of your content by repurposing it across different formats and platforms. Turn blog posts into videos, infographics, or podcast episodes.</p>',
  'Why creating high-quality content is more important than ever, and how to develop a content strategy that drives results.',
  'Sarah Johnson',
  NOW() - INTERVAL '2 weeks',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop',
  27
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

INSERT INTO comments (post_id, author_name, author_email, content, approved)
SELECT
  id,
  'Jane Smith',
  'jane@example.com',
  'Thanks for sharing these insights. I''ve implemented some of these strategies and already seeing results!',
  true
FROM blog_posts
ORDER BY created_at DESC
LIMIT 1;

-- Insert mock likes
INSERT INTO likes (post_id, user_ip)
SELECT
  id,
  '192.168.1.' || (random() * 255)::int::text
FROM blog_posts, generate_series(1, 3);

-- Insert mock marketing submissions
INSERT INTO marketing_submissions (first_name, last_name, email, phone, company_name, how_did_you_find_us, monthly_spend, website) VALUES
('Alice', 'Johnson', 'alice.johnson@techstartup.com', '+1-555-0101', 'Tech Startup Inc', 'Google Search', '$1,000 - $5,000', 'https://techstartup.example.com'),
('Bob', 'Williams', 'bob.williams@ecommerce.com', '+1-555-0102', 'E-Commerce Solutions', 'Referral', '$5,000 - $10,000', 'https://ecommerce.example.com'),
('Carol', 'Davis', 'carol.davis@consulting.com', '+1-555-0103', 'Davis Consulting Group', 'LinkedIn', '$10,000 - $25,000', 'https://consulting.example.com');

-- Insert mock newsletter signups
INSERT INTO newsletter_signups (email) VALUES
('subscriber1@example.com'),
('subscriber2@example.com'),
('subscriber3@example.com'),
('subscriber4@example.com'),
('subscriber5@example.com');

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

-- Note: Admin operations (insert/update/delete on blog_posts, approve comments)
-- should be done with service role key or authenticated admin users
