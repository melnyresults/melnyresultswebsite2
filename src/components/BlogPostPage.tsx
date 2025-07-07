import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Menu, X as CloseIcon, ArrowLeft, Calendar, User, Clock, Heart, Share2, MessageCircle, Facebook, Twitter, Linkedin, Copy, Tag } from 'lucide-react';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { BlogPost } from '../lib/localStorage';
import { usePageMeta } from '../hooks/usePageMeta';

const BlogPostPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [tableOfContents, setTableOfContents] = useState<Array<{id: string, text: string, level: number}>>([]);
  const [activeSection, setActiveSection] = useState('');
  
  const { slug } = useParams();
  const navigate = useNavigate();
  const { posts, likePost } = useBlogPosts();

  useEffect(() => {
    if (posts.length > 0 && slug) {
      const slugParts = slug.split('-');
      const postId = slugParts[slugParts.length - 1];
      
      const foundPost = posts.find(p => p.id.startsWith(postId));
      
      if (foundPost) {
        setPost(foundPost);
        setNotFound(false);
        
        // Generate table of contents
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = foundPost.content;
        const headings = tempDiv.querySelectorAll('h2, h3');
        const toc = Array.from(headings).map((heading, index) => ({
          id: `heading-${index}`,
          text: heading.textContent || '',
          level: parseInt(heading.tagName.charAt(1))
        }));
        setTableOfContents(toc);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }
  }, [posts, slug]);
  
  // Update meta tags when post is loaded
  usePageMeta({
    title: post ? `${post.title} - Melny Results Blog` : 'Post Not Found - Melny Results',
    description: post ? (post.excerpt || generateExcerpt(post.content)) : 'The blog post you\'re looking for doesn\'t exist.',
    keywords: post ? 'marketing strategy, business growth, lead generation, digital marketing' : 'blog, marketing',
    ogTitle: post ? post.title : 'Post Not Found',
    ogDescription: post ? (post.excerpt || generateExcerpt(post.content)) : 'The blog post you\'re looking for doesn\'t exist.',
    ogImage: post?.image_url,
  });

  // Scroll spy for table of contents
  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('h2, h3');
      let current = '';
      
      headings.forEach((heading, index) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          current = `heading-${index}`;
        }
      });
      
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const plainText = content.replace(/<[^>]*>/g, '');
    const wordCount = plainText.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  const formatContent = (content: string) => {
    // Add IDs to headings for table of contents
    let formattedContent = content;
    const headingRegex = /<(h[23])([^>]*)>(.*?)<\/h[23]>/gi;
    let headingIndex = 0;
    
    formattedContent = formattedContent.replace(headingRegex, (match, tag, attrs, text) => {
      const id = `heading-${headingIndex}`;
      headingIndex++;
      return `<${tag} id="${id}"${attrs}>${text}</${tag}>`;
    });

    return { __html: formattedContent };
  };

  const handleLike = async () => {
    if (!post || isLiking || hasLiked) return;
    
    setIsLiking(true);
    
    const result = await likePost(post.id);
    if (result.error) {
      if (result.error.includes('already liked')) {
        setHasLiked(true);
      } else {
        alert('Error liking post: ' + result.error);
      }
    } else {
      setHasLiked(true);
      setPost(prev => prev ? { ...prev, likes_count: prev.likes_count + 1 } : null);
    }
    
    setIsLiking(false);
  };

  const handleShare = (platform?: string) => {
    const url = window.location.href;
    const title = post?.title || '';
    const text = post?.excerpt || '';

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        break;
      default:
        if (navigator.share && post) {
          navigator.share({ title, text, url });
        } else {
          navigator.clipboard.writeText(url);
          alert('Link copied to clipboard!');
        }
    }
  };

  const createSlug = (title: string, id: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return `${slug}-${id.slice(0, 8)}`;
  };

  const getRandomCategory = () => {
    const categories = ['Growth Strategies', 'Success Stories', 'Tips', 'Case Studies'];
    return categories[Math.floor(Math.random() * categories.length)];
  };

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

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
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

  const relatedPosts = posts.filter(p => p.id !== post.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-20">
            <div className="flex items-center space-x-12">
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-gray-900 hover:text-primary-blue transition-colors duration-200 font-medium">
                  Home
                </Link>
                <Link to="/free-marketing-analysis" className="text-gray-900 hover:text-primary-blue transition-colors duration-200 font-medium">
                  Free Marketing Analysis
                </Link>
                <Link to="/blog" className="text-primary-red font-semibold">
                  Blog
                </Link>
                <Link to="/newsletter" className="text-gray-900 hover:text-primary-blue transition-colors duration-200 font-medium">
                  Newsletter
                </Link>
              </div>
            </div>

            <div className="md:hidden absolute right-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-900 hover:text-primary-blue focus:outline-none"
              >
                {isMobileMenuOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block px-3 py-2 text-gray-900 hover:text-primary-blue w-full text-left font-medium">
                Home
              </Link>
              <Link to="/free-marketing-analysis" className="block px-3 py-2 text-gray-900 hover:text-primary-blue w-full text-left font-medium">
                Free Marketing Analysis
              </Link>
              <Link to="/blog" className="block px-3 py-2 text-primary-red w-full text-left font-semibold">
                Blog
              </Link>
              <Link to="/newsletter" className="block px-3 py-2 text-gray-900 hover:text-primary-blue w-full text-left font-medium">
                Newsletter
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Back to Blog */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative">
        {/* Featured Image */}
        {post.image_url && (
          <div className="relative h-96 overflow-hidden">
            <img 
              src={post.image_url}
              alt={`Featured image for: ${post.title}`}
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            
            {/* Category Badge */}
            <div className="absolute top-6 left-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-primary-red text-white">
                <Tag className="w-4 h-4 mr-2" />
                {getRandomCategory()}
              </span>
            </div>
          </div>
        )}

        {/* Title and Meta */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight mb-6">
              {post.title}
            </h1>

            <div className="flex items-center justify-center gap-6 text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(post.published_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{getReadTime(post.content)}</span>
              </div>
            </div>

            {/* Social Actions */}
            <div className="flex items-center justify-center gap-4 pb-8 border-b border-gray-200">
              <button 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  hasLiked || isLiking
                    ? 'text-red-500 bg-red-50'
                    : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
                }`}
                onClick={handleLike}
                disabled={isLiking || hasLiked}
              >
                <Heart className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
                <span>{post.likes_count}</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span>{Math.floor(Math.random() * 10)}</span>
              </button>
              <button 
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                onClick={() => handleShare()}
              >
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Social Share Sidebar - Desktop */}
          <div className="hidden lg:block lg:w-16">
            <div className="sticky top-32 space-y-4">
              <button
                onClick={() => handleShare('facebook')}
                className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                title="Share on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="w-12 h-12 bg-sky-500 text-white rounded-lg flex items-center justify-center hover:bg-sky-600 transition-colors"
                title="Share on Twitter"
              >
                <Twitter className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="w-12 h-12 bg-blue-700 text-white rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors"
                title="Share on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="w-12 h-12 bg-gray-600 text-white rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                title="Copy Link"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Article Content */}
          <div className="lg:flex-1 max-w-3xl">
            <article className="prose prose-lg max-w-none">
              <div 
                className="text-gray-700 leading-relaxed space-y-6 prose prose-lg prose-headings:text-gray-900 prose-headings:font-semibold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-em:text-gray-800 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-blockquote:text-gray-800 prose-blockquote:border-l-primary-blue prose-blockquote:bg-blue-50 prose-blockquote:p-6 prose-blockquote:rounded-r-lg prose-blockquote:text-xl prose-blockquote:font-medium prose-a:text-primary-blue prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={formatContent(post.content)}
              />

              {/* Inline CTA */}
              <div className="my-12 p-8 bg-primary-red text-white rounded-2xl text-center">
                <h3 className="text-2xl font-semibold mb-4">Want a free growth plan?</h3>
                <p className="text-red-100 mb-6">Get a custom marketing strategy tailored to your business — no cost, no catch.</p>
                <Link
                  to="/free-marketing-analysis"
                  className="inline-flex items-center px-6 py-3 bg-white text-primary-red rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                >
                  Get Your Free Plan
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </Link>
              </div>
            </article>
          </div>

          {/* Table of Contents - Desktop */}
          {tableOfContents.length > 0 && (
            <div className="hidden lg:block lg:w-64">
              <div className="sticky top-32">
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h3>
                  <nav className="space-y-2">
                    {tableOfContents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block text-sm transition-colors ${
                          activeSection === item.id
                            ? 'text-primary-blue font-medium'
                            : 'text-gray-600 hover:text-gray-900'
                        } ${item.level === 3 ? 'ml-4' : ''}`}
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">Related Articles</h2>
              <p className="text-gray-600">Continue reading for more marketing insights</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${createSlug(relatedPost.title, relatedPost.id)}`}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group"
                >
                  <img 
                    src={relatedPost.image_url || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop'}
                    alt={relatedPost.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-red text-white mb-3">
                      <Tag className="w-3 h-3 mr-1" />
                      {getRandomCategory()}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-blue transition-colors">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div>
              <Link 
                to="/privacy-policy" 
                className="text-white hover:text-gray-300 transition-colors underline text-sm tracking-wide"
              >
                Cookies + Privacy
              </Link>
            </div>
            
            <div className="mt-8">
              <img 
                src="/src/assets/image (10).png" 
                alt="Melny Results Logo" 
                className="h-48 w-auto mx-auto"
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogPostPage;