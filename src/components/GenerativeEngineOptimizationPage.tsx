import React, { useState } from 'react';
import { Menu, X as CloseIcon, Target, Flame, Rocket, Lock, Download, Zap, TrendingUp, Eye } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';

const GenerativeEngineOptimizationPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  usePageMeta({
    title: 'Free Generative Engine Optimization Guide - Melny Results',
    description: 'Download our comprehensive guide to mastering Generative Engine Optimization (GEO) and dominating AI-powered search results.',
    keywords: 'generative engine optimization, GEO, AI search, ChatGPT optimization, AI marketing, search optimization',
    ogTitle: 'Master Generative Engine Optimization - Free Guide',
    ogDescription: 'Get the complete playbook for optimizing your content for AI-powered search engines like ChatGPT, Claude, and Perplexity.',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Validate required fields
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setError('Please enter your first and last name');
        setIsSubmitting(false);
        return;
      }

      if (!formData.email.trim()) {
        setError('Please enter your email address');
        setIsSubmitting(false);
        return;
      }

      // Prepare webhook data with all form fields
      const webhookData = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || '',
        full_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        source: 'GEO Landing Page',
        form_type: 'GEO Guide Download',
        submitted_at: new Date().toISOString(),
        page_url: window.location.href,
        user_agent: navigator.userAgent,
        timestamp: Date.now()
      };
      
      console.log('Sending webhook data to Zapier:', webhookData);
      
      // Send to Zapier webhook
      const response = await fetch('https://hooks.zapier.com/hooks/catch/19293386/u3fdxuh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      console.log('Webhook response status:', response.status);
      console.log('Webhook response headers:', response.headers);

      if (response.ok) {
        const responseData = await response.text();
        console.log('Webhook response data:', responseData);
        console.log('✅ Webhook sent successfully to Zapier');
        
        // Store form data in localStorage for backup
        localStorage.setItem('geoGuideDownload', JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString()
        }));
        
        // Redirect to thank you page
        navigate('/generative-engine-optimization-guide-thanks');
      } else {
        const errorText = await response.text();
        console.error('Webhook failed with status:', response.status, 'Error:', errorText);
        throw new Error(`Failed to submit form: ${response.status} ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Form submission error:', error);
      setError('There was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img 
                  src="/melny-results-logo.png" 
                  alt="Melny Results" 
                  className="h-8 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
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

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <Zap className="w-12 h-12 text-primary-blue animate-pulse" />
          </div>

          {/* Headline */}
          <h1 className="text-5xl lg:text-6xl font-semibold text-gray-900 leading-tight mb-6">
            Master <span className="text-primary-blue relative">
              Generative Engine
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-blue"></div>
            </span><br />
            Optimization (GEO)
          </h1>
          
          {/* Subheadline */}
          <div className="max-w-2xl mx-auto mb-12 leading-relaxed text-xl">
            <p className="text-gray-700 mb-2">
              The <strong>complete playbook</strong> for dominating AI-powered search engines
            </p>
            <p className="text-gray-700 mb-2">
              like <strong>ChatGPT, Claude, and Perplexity</strong>.
            </p>
            <p className="text-gray-700 font-semibold">
              Get found when your customers ask AI for recommendations.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Eye className="w-8 h-8 text-primary-blue mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Get Discovered</h3>
              <p className="text-gray-600 text-sm">Show up in AI responses when prospects search for solutions</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <TrendingUp className="w-8 h-8 text-primary-blue mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Drive Traffic</h3>
              <p className="text-gray-600 text-sm">Capture the growing AI search traffic before competitors</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Target className="w-8 h-8 text-primary-blue mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Beat Competition</h3>
              <p className="text-gray-600 text-sm">Dominate the new frontier of search optimization</p>
            </div>
          </div>
        </div>
      </section>

      {/* Download Form Section */}
      <section className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold text-gray-900 mb-6">
              Download Your Free GEO Guide
            </h2>
            <p className="text-lg text-gray-700 mb-2">
              Enter your details below to get instant access to the complete guide.
            </p>
            <p className="text-lg text-gray-700 font-semibold">
              No fluff. Just actionable strategies that work.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-gray-50 p-8 rounded-2xl shadow-xl border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-colors"
                    disabled={isSubmitting}
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-colors"
                    disabled={isSubmitting}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

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
                  className="w-full px-4 py-4 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-colors"
                  disabled={isSubmitting}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-colors"
                  disabled={isSubmitting}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-blue text-white px-8 py-5 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-200 hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Sending Guide...
                  </div>
                ) : (
                  'Download Free GEO Guide'
                )}
              </button>
            </form>

            {/* Privacy Notice */}
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Lock className="w-4 h-4" />
                <span>Your information is secure. No spam, just valuable insights.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-gray-900 mb-6">
              What You'll Learn Inside
            </h2>
            <p className="text-lg text-gray-700">
              Everything you need to dominate generative AI search results
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-semibold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Understanding GEO Fundamentals</h3>
                  <p className="text-gray-600">How AI engines work and why traditional SEO isn't enough</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-semibold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Content Optimization Strategies</h3>
                  <p className="text-gray-600">Proven techniques to make your content AI-friendly</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-semibold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Authority Building Tactics</h3>
                  <p className="text-gray-600">How to become the go-to source AI engines recommend</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-semibold text-sm">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Technical Implementation</h3>
                  <p className="text-gray-600">Step-by-step setup and optimization checklist</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-semibold text-sm">5</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Measurement & Analytics</h3>
                  <p className="text-gray-600">Track your GEO performance and optimize for results</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-semibold text-sm">6</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Future-Proofing Strategies</h3>
                  <p className="text-gray-600">Stay ahead as AI search continues to evolve</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-primary-blue">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-semibold text-white mb-8">
            Don't Get Left Behind in the AI Revolution
          </h2>
          
          <div className="max-w-2xl mx-auto mb-12">
            <p className="text-lg text-blue-100 mb-2">
              While your competitors are still focused on traditional SEO,
            </p>
            <p className="text-lg text-blue-100 mb-2">
              you can dominate the future of search with GEO.
            </p>
            <p className="text-lg text-white font-semibold">
              Download your free guide and get started today.
            </p>
          </div>

          <button 
            onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-primary-blue px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-200 hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 mx-auto"
          >
            <Download className="w-5 h-5" />
            Get Your Free GEO Guide Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Link 
              to="/privacy-policy" 
              className="text-gray-400 hover:text-white transition-colors underline"
            >
              Cookies + Privacy
            </Link>
            
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

export default GenerativeEngineOptimizationPage;