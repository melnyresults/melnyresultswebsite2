import React, { useState } from 'react';
import { Menu, X as CloseIcon, CheckCircle, Mail, ArrowRight, Lock, Users, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { saveNewsletterSignup } from '../lib/localStorage';
import { usePageMeta } from '../hooks/usePageMeta';

const NewsletterPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  usePageMeta({
    title: 'Marketing Newsletter - Melny Results',
    description: 'Get proven marketing strategies, sales training and demand generation tactics that actually work—delivered directly to your inbox.',
    keywords: 'marketing newsletter, business growth tips, marketing strategies, email marketing, lead generation tactics',
    ogTitle: 'THE Newsletter To Grow Your Business - Melny Results',
    ogDescription: 'Just practical strategies used by expert marketers to grow any business.',
  });

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
      // Send to Zapier webhook first
      const webhookData = {
        email: formData.email,
        source: 'Newsletter Page',
        form_type: 'Newsletter Signup',
        submitted_at: new Date().toISOString(),
        page_url: window.location.href
      };
      
      console.log('Sending webhook data:', webhookData);
      
      try {
        const response = await fetch('https://hooks.zapier.com/hooks/catch/19293386/u3fdxuh/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData),
        });
        
        console.log('Webhook response status:', response.status);
        console.log('Webhook sent successfully');
      } catch (webhookError) {
        console.error('Webhook error:', webhookError);
        // Continue with local storage even if webhook fails
      }

      const result = saveNewsletterSignup(formData.email);
      
      if (!result.success) {
        setError(result.error || 'Failed to sign up for newsletter');
      } else {
        // Redirect to thank you page
        navigate('/newsletter/thank-you');
      }
    } catch (err) {
      console.error('Newsletter signup error:', err);
      setError('There was an error signing you up. Please try again.');
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
                <Link to="/newsletter" className="text-primary-red font-semibold">
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
                className="block px-3 py-2 text-primary-red w-full text-left font-semibold"
              >
                Newsletter
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Enhanced Design */}
      <section className="pt-16 pb-20 bg-gray-50 border-t-4 border-primary-blue">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-slide-up">
            {/* Enhanced Newsletter Icon with Animation */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-primary-blue rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer group">
                <Mail className="w-10 h-10 text-white group-hover:animate-bounce" />
              </div>
            </div>

            {/* Enhanced Headline */}
            <h1 className="text-5xl lg:text-7xl font-semibold text-gray-900 leading-tight mb-6">
              <span className="text-primary-red">THE</span> Newsletter To Grow Your Business.
            </h1>
            
            {/* Enhanced Subheadline */}
            <p className="text-2xl text-gray-600 leading-relaxed mb-12 max-w-3xl mx-auto font-medium">
              Get proven marketing strategies, sales training and demand generation tactics that actually work—on a daily directly into your inbox.
            </p>

            {/* Enhanced Feature Bullets - Horizontal Layout */}
            <div className="max-w-3xl mx-auto mb-12">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-lg text-gray-700 font-medium">No generic advice</span>
                </div>
                <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-lg text-gray-700 font-medium">No theoretical frameworks</span>
                </div>
              </div>
              
              <div className="mt-8">
                <p className="text-xl text-gray-700 font-semibold">
                  Just practical strategies used by expert marketers to grow any business.
                </p>
              </div>
            </div>

            {/* Enhanced Email Form Card */}
            <div className="max-w-lg mx-auto">
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-fade-in-up">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full md:w-3/4 mx-auto block px-4 py-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent focus:bg-white transition-colors text-lg"
                      placeholder="your@email.com"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Enhanced Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary-red text-white px-8 py-5 rounded-lg text-lg font-semibold hover:bg-red-800 transition-all duration-200 hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    <Lock className="w-5 h-5" />
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
              </div>

              {/* Enhanced Trust Bar */}
              <div className="mt-8 animate-fade-in-up">
                <div className="flex justify-center items-center gap-8 py-6 bg-white rounded-lg shadow-sm border border-gray-100 flex-wrap">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Weekly insights</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Unsubscribe anytime</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium">No sales pitches</span>
                  </div>
                </div>
              </div>

              {/* Final Reassurance Block with Social Proof */}
              <div className="mt-8 p-6 bg-gradient-to-br from-primary-blue to-blue-700 rounded-2xl text-white text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Users className="w-6 h-6" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                </div>
                <p className="text-lg font-medium">
                  Join 1,200+ business owners who get actionable marketing tips every week.
                </p>
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
            
            {/* Logo */}
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

export default NewsletterPage;