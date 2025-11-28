# Blog Dynamic Routing Implementation Documentation

## Overview
This document provides complete documentation for the dynamic blog routing system that creates individual, persistent blog pages accessible via unique SEO-friendly URLs.

## 1. Route Configuration

### Primary Routes (App.tsx)
```typescript
// Public blog routes - accessible to all users
<Route path="/blog" element={<BlogPage />} />
<Route path="/blog/:slug" element={<BlogPostPage />} />

// Protected admin routes - authentication required
<Route path="/admin/posts/new" element={<ProtectedRoute><PostEditor /></ProtectedRoute>} />
<Route path="/admin/posts/edit/:id" element={<ProtectedRoute><PostEditor /></ProtectedRoute>} />
```

### URL Structure
- **Blog List**: `https://melnyresults.com/blog`
- **Individual Posts**: `https://melnyresults.com/blog/[slug]`
  - Example: `https://melnyresults.com/blog/how-to-scale-your-business`
  - Slug is automatically generated from post title or custom slug field

## 2. Database Schema

### Blog Posts Table (blog_posts)
```sql
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE,                    -- SEO-friendly URL identifier
  content text NOT NULL,
  excerpt text,
  author text NOT NULL,
  image_url text,
  published_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- SEO Fields
  meta_title text,
  meta_description text,
  canonical_url text,
  keywords text,
  tags text,
  noindex boolean DEFAULT false,

  -- Publishing Control
  is_published boolean DEFAULT false,
  scheduled_publish_date timestamptz,

  -- Schema & Related Posts
  schema_type text DEFAULT 'blog',     -- 'blog' or 'custom'
  custom_schema jsonb,
  related_post_ids text[],

  -- Engagement
  likes_count integer DEFAULT 0
);
```

### Supporting Tables
```sql
-- Comments with approval workflow
CREATE TABLE blog_comments (
  id uuid PRIMARY KEY,
  post_id uuid REFERENCES blog_posts(id),
  user_name text NOT NULL,
  user_email text NOT NULL,
  comment_text text NOT NULL,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Likes with fingerprint tracking
CREATE TABLE blog_likes (
  id uuid PRIMARY KEY,
  post_id uuid REFERENCES blog_posts(id),
  user_fingerprint text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_fingerprint)
);

-- View tracking
CREATE TABLE blog_views (
  id uuid PRIMARY KEY,
  post_id uuid REFERENCES blog_posts(id),
  user_fingerprint text NOT NULL,
  viewed_at timestamptz DEFAULT now(),
  view_date date DEFAULT CURRENT_DATE,
  UNIQUE(post_id, user_fingerprint, view_date)
);
```

## 3. Data Fetching Logic

### useBlogPosts Hook
```typescript
// Location: src/hooks/useBlogPosts.ts

export const useBlogPosts = () => {
  const fetchPosts = async (includeScheduled = false) => {
    const { data: { user } } = await supabase.auth.getUser();

    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false });

    // Public users only see published posts with valid schedule dates
    if (!user && !includeScheduled) {
      query = query
        .eq('is_published', true)
        .or(`scheduled_publish_date.is.null,scheduled_publish_date.lte.${new Date().toISOString()}`);
    }

    const { data: blogPosts, error } = await query;
    return blogPosts;
  };
};
```

### Key Features:
- **Public Access**: Non-authenticated users see only published posts
- **Scheduled Posts**: Posts scheduled for future dates remain hidden until publish time
- **Admin Access**: Authenticated admins see all posts regardless of status
- **Real-time Updates**: Automatic refresh when posts are created/updated

## 4. Blog Post Page Component

### BlogPostPage.tsx Implementation

#### Route Parameter Extraction
```typescript
const { slug } = useParams();  // Extract slug from URL: /blog/:slug
```

#### Post Lookup Logic
```typescript
useEffect(() => {
  if (posts.length > 0 && slug) {
    // Find post by slug field in database
    const foundPost = posts.find(p => p.slug === slug);

    if (foundPost) {
      setPost(foundPost);
      setNotFound(false);
      // ... generate table of contents, etc.
    } else {
      setNotFound(true);  // Trigger 404
    }
  }
}, [posts, slug]);
```

#### Complete Post Display
```typescript
// Full post content with:
- Title and metadata
- Featured image
- Author and publish date
- Full HTML content (rich text)
- Table of contents (generated from H2/H3 tags)
- Like button with count
- Comments section (view + submit)
- Related posts recommendations
- Share buttons (Twitter, Facebook, LinkedIn)
- SEO metadata and structured data
```

## 5. Error Handling (404 Page)

### Not Found State
```typescript
if (notFound) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Blog Post Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The blog post you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>
      </div>
    </div>
  );
}
```

## 6. SEO Optimization

### Meta Tags Implementation
```typescript
usePageMeta({
  title: post.meta_title || `${post.title} - Melny Results Blog`,
  description: post.meta_description || post.excerpt,
  keywords: post.keywords || 'marketing strategy, business growth',
  ogTitle: post.meta_title || post.title,
  ogDescription: post.meta_description || post.excerpt,
  ogImage: post.image_url,
  canonicalUrl: post.canonical_url || `https://melnyresults.com/blog/${slug}`,
  noindex: post.noindex || false,
});
```

### Structured Data (Schema.org)
```typescript
// Automatic BlogPosting schema
const schemaData = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.title,
  "image": post.image_url,
  "author": {
    "@type": "Person",
    "name": post.author
  },
  "datePublished": post.published_at,
  "dateModified": post.updated_at,
  "description": post.excerpt,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": canonicalUrl
  }
};

// Custom schema support
if (post.schema_type === 'custom' && post.custom_schema) {
  schemaData = post.custom_schema;
}
```

## 7. URL Generation

### Slug Generation Logic
```typescript
// Automatic slug generation in PostEditor
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// URL construction
const postUrl = `/blog/${post.slug}`;
```

### Slug Helper Function
```typescript
const getPostSlug = (post) => {
  if (post.slug) {
    return post.slug;  // Use database slug if available
  }
  // Fallback to generated slug from title + ID
  const slug = post.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${slug}-${post.id.slice(0, 8)}`;
};
```

## 8. Engagement Features

### View Tracking
```typescript
// Automatic view tracking via useBlogEngagement hook
const trackView = async (postId: string) => {
  const fingerprint = generateFingerprint();
  await supabase
    .from('blog_views')
    .insert([{
      post_id: postId,
      user_fingerprint: fingerprint,
      viewed_at: new Date().toISOString(),
      view_date: new Date().toISOString().split('T')[0]
    }]);
};
```

### Likes System
```typescript
const handleLike = async () => {
  if (hasLiked) return;

  const fingerprint = generateFingerprint();
  await supabase
    .from('blog_likes')
    .insert([{ post_id: postId, user_fingerprint: fingerprint }]);

  setHasLiked(true);
  setLikes(likes + 1);
};
```

### Comments System
```typescript
const submitComment = async (formData) => {
  await supabase
    .from('blog_comments')
    .insert([{
      post_id: postId,
      user_name: formData.user_name,
      user_email: formData.user_email,
      comment_text: formData.comment_text,
      is_approved: false  // Requires admin approval
    }]);
};
```

## 9. Row Level Security (RLS)

### Public Read Access
```sql
-- Anyone can view published and scheduled posts
CREATE POLICY "Anyone can view published and scheduled posts"
  ON blog_posts FOR SELECT
  TO public
  USING (
    is_published = true
    AND (
      scheduled_publish_date IS NULL
      OR scheduled_publish_date <= now()
    )
  );

-- Authenticated users can see all posts
CREATE POLICY "Authenticated users can view all posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (true);
```

### Comment Policies
```sql
-- Anyone can view approved comments
CREATE POLICY "Anyone can view approved comments"
  ON blog_comments FOR SELECT
  TO public
  USING (is_approved = true);

-- Anyone can submit comments
CREATE POLICY "Anyone can create comments"
  ON blog_comments FOR INSERT
  TO public
  WITH CHECK (true);
```

## 10. Sitemap Generation

### Automatic Sitemap
```typescript
// Only includes published, non-noindex posts
const { data: posts } = await supabase
  .from('blog_posts')
  .select('slug, updated_at, published_at')
  .eq('is_published', true)
  .eq('noindex', false)
  .or(`scheduled_publish_date.is.null,scheduled_publish_date.lte.${new Date().toISOString()}`)
  .order('published_at', { ascending: false });

posts.forEach(post => {
  urls.push({
    loc: `https://melnyresults.com/blog/${post.slug}`,
    lastmod: new Date(post.updated_at).toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.8,
  });
});
```

## 11. Related Posts

### Internal Linking
```typescript
// Display related posts selected by admin
const relatedPosts = post.related_post_ids && post.related_post_ids.length > 0
  ? posts.filter(p => post.related_post_ids?.includes(p.id)).slice(0, 3)
  : posts.filter(p => p.id !== post.id).slice(0, 3);  // Fallback to recent posts
```

## 12. Performance Optimizations

### Loading States
```typescript
if (loading) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto mb-4"></div>
        <p className="text-gray-600">Loading post...</p>
      </div>
    </div>
  );
}
```

### Image Optimization
```typescript
// Use appropriate image sizes and lazy loading
<img
  src={post.image_url}
  alt={post.title}
  loading="lazy"
  className="w-full h-96 object-cover"
/>
```

## 13. Testing Checklist

- [x] Posts are publicly accessible without authentication
- [x] Unique URLs work correctly (/blog/post-slug)
- [x] 404 page shows for non-existent posts
- [x] SEO metadata is properly set
- [x] Structured data validates on Google
- [x] Scheduled posts remain hidden until publish time
- [x] Related posts display correctly
- [x] Comments require approval
- [x] Likes prevent duplicates
- [x] Views are tracked correctly
- [x] Sitemap includes all public posts

## 14. API Endpoints Summary

### Public Endpoints
- `GET /blog` - List all published posts
- `GET /blog/:slug` - View individual post
- `POST /blog_comments` - Submit comment
- `POST /blog_likes` - Like a post
- `POST /blog_views` - Track view

### Protected Endpoints (Admin)
- `POST /blog_posts` - Create post
- `PUT /blog_posts/:id` - Update post
- `DELETE /blog_posts/:id` - Delete post
- `PUT /blog_comments/:id` - Approve comment

## 15. Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Conclusion

This implementation provides:
- ✅ Dynamic routing with SEO-friendly URLs
- ✅ Persistent, publicly accessible blog pages
- ✅ Complete CRUD operations for posts
- ✅ Proper error handling (404s)
- ✅ SEO optimization with meta tags and structured data
- ✅ Engagement features (likes, comments, views)
- ✅ Admin approval workflow for comments
- ✅ Scheduled publishing
- ✅ Related posts and internal linking
- ✅ Automatic sitemap generation

All features are production-ready and fully integrated with Supabase.
