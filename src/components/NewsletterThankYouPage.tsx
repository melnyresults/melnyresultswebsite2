import React, { useState } from 'react';
import { Menu, X as CloseIcon, CheckCircle, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBlogPosts } from '../hooks/useBlogPosts';

const NewsletterThankYouPage: React.FC = () => {
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
      <section className="pt-16 pb-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" strokeWidth={3} />
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
            You're Almost In!
          </h1>

          {/* Instructions */}
          <div className="max-w-2xl mx-auto mb-12">
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              <strong>Check your inbox</strong> for a confirmation email to complete your subscription.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              If you don't see it in the next few minutes, check your <strong>spam folder</strong> and mark it as "not spam" so you don't miss our client-getting strategies.
            </p>
          </div>

          {/* What to Expect */}
          <div className="max-w-2xl mx-auto mb-12 p-8 bg-gray-50 rounded-2xl">
            <div className="flex justify-center mb-4">
              <Mail className="w-8 h-8 text-primary-blue" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              What to Expect
            </h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-primary-red mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Weekly emails with proven marketing strategies</span>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-primary-red mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Real case studies from successful campaigns</span>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-primary-red mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Actionable tactics you can implement immediately</span>
              </div>
            </div>
          </div>

          {/* CTA to Blog */}
          <div className="mb-12">
            <p className="text-lg text-gray-700 mb-6">
              While you wait, check out our latest insights:
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center px-8 py-4 bg-primary-blue text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-200 hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              Read Our Blog
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      {displayPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Latest Marketing Insights
              </h2>
              <p className="text-gray-600">
                Get started with these proven strategies
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
                        <h3 className="text-white text-xl font-bold leading-tight group-hover:text-primary-blue transition-colors duration-300">
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
          </div>
        </section>
      )}

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

export default NewsletterThankYouPage;