import React, { useState } from 'react';
import { Menu, X as CloseIcon, Search, Calendar, User, ArrowRight, Clock, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { usePageMeta } from '../hooks/usePageMeta';

const BlogPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { posts, loading } = useBlogPosts();

  // Production domain configuration
  const PRODUCTION_DOMAIN = 'https://melnyresults.com';
  
  usePageMeta({
    title: 'Marketing Blog - Melny Results',
    description: 'Get proven marketing strategies, case studies, and growth tactics that actually work. No fluff. No theory. Just actionable insights.',
    keywords: 'marketing blog, business growth tips, marketing strategies, lead generation, digital marketing insights',
    ogTitle: 'Marketing Insights That Actually Work - Melny Results Blog',
    ogDescription: 'No fluff. No theory. Just proven strategies to grow your business faster.',
    canonicalUrl: `${PRODUCTION_DOMAIN}/blog`,
  });

  const categories = ['Growth Strategies', 'Success Stories', 'Tips', 'Case Studies'];

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

  const getPostSlug = (post: any) => {
    if (post.slug && post.slug.trim()) {
      return post.slug;
    }
    // Fallback to generating from title only (no ID) if slug doesn't exist
    const slug = post.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return slug;
  };

  const getRandomCategory = () => {
    return categories[Math.floor(Math.random() * categories.length)];
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || getRandomCategory() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

      {/* Blog Header */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-slide-up">
            <h1 className="text-5xl font-semibold text-gray-900 mb-6">
              Marketing Insights That Actually Work
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              No fluff. No theory. Just proven strategies to grow your business faster.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content - Blog Grid */}
            <div className="lg:w-2/3">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
                  <p className="text-gray-600">Try adjusting your search or category filter.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredPosts.map((post) => (
                    <article 
                      key={post.id} 
                      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group"
                    >
                      {/* Featured Image */}
                      <div className="relative overflow-hidden">
                        <img 
                          src={post.image_url || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop'}
                          alt={post.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          style={{ aspectRatio: '16/9' }}
                          loading="lazy"
                        />
                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-red text-white">
                            <Tag className="w-3 h-3 mr-1" />
                            {getRandomCategory()}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-blue transition-colors">
                          {post.title}
                        </h2>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{post.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(post.published_at)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{getReadTime(post.content)}</span>
                          </div>
                        </div>

                        {/* Read More Button */}
                        <Link
                          to={`/blog/${getPostSlug(post)}`}
                          className="inline-flex items-center gap-2 bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium group"
                        >
                          Read More
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
              <div className="space-y-8">
                {/* Search Bar */}
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Articles</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search for insights..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory('')}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        !selectedCategory 
                          ? 'bg-primary-blue text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      All Posts
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category 
                            ? 'bg-primary-blue text-white' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Posts */}
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>
                  <div className="space-y-4">
                    {posts.slice(0, 3).map((post) => (
                      <Link
                        key={post.id}
                        to={`/blog/${getPostSlug(post)}`}
                        className="block group"
                      >
                        <div className="flex gap-3">
                          <img
                            src={post.image_url || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'}
                            alt={post.title}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-primary-blue transition-colors">
                              {post.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(post.published_at)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Trust Badge */}
                <div className="bg-gradient-to-br from-primary-blue to-blue-700 p-6 rounded-2xl text-white text-center">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Trusted by 500+ Small Businesses</h3>
                  <p className="text-blue-100 text-sm">
                    Join successful business owners who rely on our proven marketing strategies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                src="/melny-results-logo.png" 
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

export default BlogPage;