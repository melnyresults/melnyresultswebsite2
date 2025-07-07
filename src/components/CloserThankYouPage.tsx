import React, { useState } from 'react';
import { Check, Menu, X as CloseIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBlogPosts } from '../hooks/useBlogPosts';

const CloserThankYouPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { posts } = useBlogPosts();

  const createSlug = (title: string, id: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return `${slug}-${id.slice(0, 8)}`;
  };

  // Get the first 3 blog posts for display
  const displayPosts = posts.slice(0, 3);

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
                <Link to="/blog" className="text-gray-900 hover:text-primary-blue transition-colors duration-200 font-medium">
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
                className="block px-3 py-2 text-gray-900 hover:text-primary-blue w-full text-left font-medium"
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

      {/* Thank You Section */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Green Checkmark */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-green-500 rounded-lg flex items-center justify-center">
              <Check className="w-12 h-12 text-white" strokeWidth={3} />
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl font-bold text-gray-900 mb-12">
            You're In.
          </h1>

          {/* Confirmation Message */}
          <div className="max-w-2xl mx-auto text-lg text-gray-700">
            <p>
              If you're a real closer, you'll hear from us in the next <strong>24–48 hours</strong>. 
              Check your email for available time slots. If not? Someone else will take your spot.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {displayPosts.length > 0 ? (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  While You Wait, Check Out Our Latest Insights
                </h2>
                <p className="text-gray-600">
                  Learn more about sales, marketing, and business growth
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {displayPosts.map((post) => (
                  <Link 
                    key={post.id} 
                    to={`/blog/${createSlug(post.title, post.id)}`}
                    className="group cursor-pointer"
                  >
                    <div className="relative overflow-hidden rounded-lg bg-black">
                      <img 
                        src={post.image_url || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'}
                        alt={post.title}
                        className="w-full h-64 object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-300"
                      />
                      <div className="absolute inset-0 flex flex-col justify-between p-6">
                        <div className="text-gray-400 text-sm font-medium">
                          MELNYRESULTS.COM
                        </div>
                        <div>
                          <h3 className="text-white text-2xl font-bold leading-tight group-hover:text-primary-blue transition-colors duration-300">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-gray-300 text-sm mt-2 line-clamp-2">
                              {post.excerpt}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-12">
                <Link
                  to="/blog"
                  className="inline-flex items-center px-6 py-3 bg-primary-red text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  View All Blog Posts
                </Link>
              </div>
            </>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {/* Fallback static posts if no blog posts exist */}
              {[
                {
                  title: "Smart Small > Big Dumb",
                  image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                },
                {
                  title: "Easy Problem Fixer",
                  image: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                },
                {
                  title: "Do Less",
                  image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                }
              ].map((post, index) => (
                <Link 
                  key={index} 
                  to="/blog"
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-lg bg-black">
                    <img 
                      src={post.image}
                      alt={post.title}
                      className="w-full h-64 object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 flex flex-col justify-between p-6">
                      <div className="text-gray-400 text-sm font-medium">
                        MELNYRESULTS.COM
                      </div>
                      <div>
                        <h3 className="text-white text-2xl font-bold leading-tight group-hover:text-primary-blue transition-colors duration-300">
                          {post.title}
                        </h3>
                      </div>
                    </div>
                  </div>
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

export default CloserThankYouPage;