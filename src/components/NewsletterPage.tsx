import React, { useState } from 'react';
import { Menu, X as CloseIcon, CheckCircle, Mail, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const NewsletterPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('newsletter_signups')
        .insert([{
          email: formData.email
        }]);

      if (error) {
        // Handle duplicate email error gracefully
        if (error.code === '23505') {
          setError('This email is already subscribed to our newsletter.');
        } else {
          throw error;
        }
      } else {
        // Redirect to thank you page
        navigate('/newsletter/thank-you');
      }
    } catch (err) {
      console.error('Newsletter signup error:', err);
      setError(err instanceof Error ? err.message : 'There was an error signing you up. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <Link to="/newsletter" className="text-primary-blue font-medium">
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
                className="block px-3 py-2 text-primary-blue w-full text-left font-medium"
              >
                Newsletter
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Section - Reduced top padding and combined sections */}
      <section className="pt-16 pb-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-slide-up">
            {/* Newsletter Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary-blue rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              <span className="text-primary-red">THE</span> Newsletter To Grow Your Business.
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed mb-10 max-w-3xl mx-auto">
              Get proven marketing strategies, sales training and demand generation tactics that actually work—on a daily directly into your inbox.
            </p>

            {/* Benefits */}
            <div className="max-w-2xl mx-auto mb-10">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <ArrowRight className="w-6 h-6 text-primary-red flex-shrink-0" />
                  <span className="text-lg text-gray-700 font-medium">No generic advice</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <ArrowRight className="w-6 h-6 text-primary-red flex-shrink-0" />
                  <span className="text-lg text-gray-700 font-medium">No theoretical frameworks</span>
                </div>
              </div>
              
              <div className="mt-6">
                <p className="text-lg text-gray-700 font-semibold">
                  Just practical strategies used by expert marketers to grow any business.
                </p>
              </div>
            </div>

            {/* Newsletter Form - Moved up into main section */}
            <div className="max-w-lg mx-auto">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-primary-blue focus:bg-white transition-colors text-lg"
                    placeholder="your@email.com"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-red text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-all duration-200 hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Signing You Up...
                    </div>
                  ) : (
                    'Send Me Client-Getting Strategies'
                  )}
                </button>

                {/* Microcopy */}
                <p className="text-sm text-gray-500 text-center">
                  No spam. No BS. Just tactics that work.
                </p>
              </form>

              {/* Additional Trust Elements */}
              <div className="mt-8 text-center">
                <div className="flex justify-center items-center gap-6 flex-wrap">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Weekly insights</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Unsubscribe anytime</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>No sales pitches</span>
                  </div>
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

export default NewsletterPage;