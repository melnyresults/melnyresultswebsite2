import React, { useState } from 'react';
import { Menu, X as CloseIcon, MoreHorizontal, Heart, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBlogPosts } from '../hooks/useBlogPosts';

const BlogPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { posts, loading, likePost } = useBlogPosts();
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set());

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  const createSlug = (title: string, id: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return `${slug}-${id.slice(0, 8)}`;
  };

  const handleLike = async (e: React.MouseEvent, postId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (likingPosts.has(postId)) return;
    
    setLikingPosts(prev => new Set(prev).add(postId));
    
    const result = await likePost(postId);
    if (result.error && !result.error.includes('already liked')) {
      alert('Error liking post: ' + result.error);
    }
    
    setLikingPosts(prev => {
      const newSet = new Set(prev);
      newSet.delete(postId);
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-20">
            {/* Centered Navigation Links */}
            <div className="flex items-center space-x-12">
              {/* Navigation Links - Desktop */}
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-gray-900 hover:text-primary-blue transition-colors duration-200 font-medium">
                  Home
                </Link>
                <Link to="/free-marketing-analysis" className="text-gray-900 hover:text-primary-blue transition-colors duration-200 font-medium">
                  Free Marketing Analysis
                </Link>
                <Link to="/blog" className="text-primary-blue font-medium">
                  Blog
                </Link>
                <Link to="/newsletter" className="text-gray-900 hover:text-primary-blue transition-colors duration-200 font-medium">
                  Newsletter
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-900 hover:text-primary-blue w-full text-left font-medium"
              >
                Home
              </Link>
              <Link
                to="/free-marketing-analysis"
                className="block px-3 py-2 text-gray-900 hover:text-primary-blue w-full text-left font-medium"
              >
                Free Marketing Analysis
              </Link>
              <Link
                to="/blog"
                className="block px-3 py-2 text-primary-blue w-full text-left font-medium"
              >
                Blog
              </Link>
              <Link
                to="/newsletter"
                className="block px-3 py-2 text-gray-900 hover:text-primary-blue w-full text-left font-medium"
              >
                Newsletter
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Blog Header */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-slide-up">
            <h1 className="text-5xl font-bold text-gray-900 mb-8">
              Welcome to Melny Results Blog!
            </h1>
          </div>
        </div>
      </section>

      {/* Blog Filter */}
      <section className="py-2 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <button className="text-primary-blue font-medium border-b-2 border-primary-blue pb-2">
              All Posts
            </button>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No blog posts yet</h3>
              <p className="text-gray-600">Check back soon for new content!</p>
            </div>
          ) : (
            <div className="space-y-12 animate-slide-up">
              {posts.map((post) => (
                <Link 
                  key={post.id} 
                  to={`/blog/${createSlug(post.title, post.id)}`}
                  className="block"
                >
                  <article className="group cursor-pointer">
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                      {/* Featured Image */}
                      <div className="relative overflow-hidden rounded-lg bg-black">
                        <img 
                          src={post.image_url || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'}
                          alt={post.title}
                          className="w-full h-64 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
                          <div>
                            <div className="text-gray-300 text-sm font-medium mb-2">
                              MELNYRESULTS.COM
                            </div>
                            <h2 className="text-white text-3xl font-bold leading-tight">
                              {post.title}
                            </h2>
                          </div>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="space-y-4">
                        {/* Author Info */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {post.author.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{post.author}</div>
                              <div className="text-sm text-gray-500">
                                {formatDate(post.published_at)} • {getReadTime(post.content)}
                              </div>
                            </div>
                          </div>
                          <button 
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            onClick={(e) => e.preventDefault()}
                          >
                            <MoreHorizontal className="w-5 h-5 text-gray-400" />
                          </button>
                        </div>

                        {/* Post Title (Mobile) */}
                        <h2 className="lg:hidden text-2xl font-bold text-gray-900 group-hover:text-primary-blue transition-colors">
                          {post.title}
                        </h2>

                        {/* Post Excerpt */}
                        <p className="text-gray-600 leading-relaxed">
                          {post.excerpt}
                        </p>

                        {/* Post Stats */}
                        <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                          <span className="text-sm text-gray-500">
                            {Math.floor(Math.random() * 50) + 10} views
                          </span>
                          <span className="text-sm text-gray-500">
                            {Math.floor(Math.random() * 5)} comments
                          </span>
                          <button 
                            className={`flex items-center gap-1 text-sm transition-colors ${
                              likingPosts.has(post.id) 
                                ? 'text-red-500' 
                                : 'text-gray-500 hover:text-red-500'
                            }`}
                            onClick={(e) => handleLike(e, post.id)}
                            disabled={likingPosts.has(post.id)}
                          >
                            <Heart className={`w-4 h-4 ${likingPosts.has(post.id) ? 'fill-current' : ''}`} />
                            {post.likes_count || 0}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Cookies + Privacy Link */}
            <div>
              <Link 
                to="/privacy-policy" 
                className="text-white hover:text-gray-300 transition-colors underline text-sm tracking-wide"
              >
                Cookies + Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogPage;