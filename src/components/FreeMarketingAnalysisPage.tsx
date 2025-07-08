import React, { useState } from 'react';
import { Menu, X as CloseIcon, CheckCircle, Clipboard, Shield, Star, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { saveMarketingSubmission } from '../lib/localStorage';
import { usePageMeta } from '../hooks/usePageMeta';

const FreeMarketingAnalysisPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    howDidYouFindUs: '',
    monthlySpend: '',
    website: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  usePageMeta({
    title: 'Free Marketing Analysis - Melny Results',
    description: 'Get a custom marketing strategy tailored to your business — no cost, no catch. Claim your free growth plan today.',
    keywords: 'free marketing analysis, marketing strategy, business growth plan, lead generation, digital marketing consultation',
    ogTitle: 'Claim Your Free Marketing Analysis - No Contracts. No Pressure.',
    ogDescription: 'Fill out the form and we\'ll send you a custom plan to get more clients — fast.',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        company_name: formData.companyName,
        how_did_you_find_us: formData.howDidYouFindUs,
        monthly_spend: formData.monthlySpend,
        website: formData.website,
        source: 'Free Marketing Analysis',
        form_type: 'Marketing Analysis Request',
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

      saveMarketingSubmission({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        company_name: formData.companyName,
        how_did_you_find_us: formData.howDidYouFindUs,
        monthly_spend: formData.monthlySpend,
        website: formData.website
      });
      
      // Redirect to thank you page
      navigate('/thankyou-consult');
    } catch (err) {
      console.error('Form submission error:', err);
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
          <div className="flex justify-center items-center h-20">
            {/* Centered Navigation Links */}
            <div className="flex items-center space-x-12">
              {/* Navigation Links - Desktop */}
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-gray-900 hover:text-primary-blue transition-colors duration-200 font-medium">
                  Home
                </Link>
                <Link to="/free-marketing-analysis" className="text-primary-red font-medium">
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
                className="block px-3 py-2 text-primary-red w-full text-left font-medium"
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

      {/* Hero Section with Form */}
      <section className="pt-16 pb-20 bg-blue-50 border-t-4 border-primary-red">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-slide-up">
            {/* Headline with Icon */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <Clipboard className="w-8 h-8 text-primary-red" />
              <h1 className="text-5xl lg:text-6xl font-semibold text-gray-900 leading-tight">
                Claim Your Free Marketing Analysis — No Contracts. No Pressure. Just a Plan That Works.
              </h1>
            </div>
            
            <p className="text-xl text-gray-600 leading-relaxed mb-12 max-w-3xl mx-auto">
              Fill out the form below. We'll review your business and send you a custom plan to get more clients — fast.
            </p>

            {/* Form Card */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-100">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Contact Details Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 text-left border-b border-gray-200 pb-2">
                      Contact Details
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent focus:bg-white transition-colors"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent focus:bg-white transition-colors"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent focus:bg-white transition-colors"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent focus:bg-white transition-colors"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Business Info Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 text-left border-b border-gray-200 pb-2">
                      Business Info
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                          Company Name *
                        </label>
                        <input
                          type="text"
                          id="companyName"
                          name="companyName"
                          required
                          value={formData.companyName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent focus:bg-white transition-colors"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label htmlFor="howDidYouFindUs" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                          How did you find us?
                        </label>
                        <select
                          id="howDidYouFindUs"
                          name="howDidYouFindUs"
                          value={formData.howDidYouFindUs}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent focus:bg-white transition-colors"
                          disabled={isSubmitting}
                        >
                          <option value="">Select an option</option>
                          <option value="google">Google Search</option>
                          <option value="social-media">Social Media</option>
                          <option value="referral">Referral</option>
                          <option value="youtube">YouTube</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="monthlySpend" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                          How much are you spending per month (USD)?
                        </label>
                        <select
                          id="monthlySpend"
                          name="monthlySpend"
                          value={formData.monthlySpend}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent focus:bg-white transition-colors"
                          disabled={isSubmitting}
                        >
                          <option value="">Select a range</option>
                          <option value="< $1k">Less than $1,000</option>
                          <option value="$1k–$5k">$1,000 - $5,000</option>
                          <option value="$5k+">$5,000+</option>
                          <option value="not-spending">Not currently spending on marketing</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                          Website
                        </label>
                        <input
                          type="url"
                          id="website"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent focus:bg-white transition-colors"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary-red text-white px-8 py-5 rounded-lg text-lg font-semibold hover:bg-red-800 transition-all duration-200 hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    <Shield className="w-5 h-5" />
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Sending Your Request...
                      </div>
                    ) : (
                      'Send Me My Free Analysis'
                    )}
                  </button>

                  {/* Microcopy */}
                  <p className="text-sm text-gray-500 text-center">
                    Your info stays private. No spam. No pushy sales calls — just your custom plan.
                  </p>
                </form>
              </div>

              {/* Trust Bar */}
              <div className="mt-8 animate-fade-in-up">
                <div className="flex justify-center items-center gap-8 py-6 bg-white rounded-lg shadow-sm border border-gray-100 flex-wrap">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium">No contracts</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium">No obligations</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium">You own your data</span>
                  </div>
                </div>
              </div>

              {/* Still Deciding Block */}
              <div className="mt-12 p-8 bg-gray-50 rounded-2xl text-center w-full">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Star className="w-6 h-6 text-yellow-500 fill-current" />
                  <h3 className="text-xl font-semibold text-gray-900">Still deciding?</h3>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  👉 Our plans have helped clients go from $0 to record revenues — with no risk. Claim yours today.
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

export default FreeMarketingAnalysisPage;