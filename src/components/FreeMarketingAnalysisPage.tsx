import React, { useState } from 'react';
import { Menu, X as CloseIcon, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

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
      const { error } = await supabase
        .from('marketing_analysis_submissions')
        .insert([{
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          company_name: formData.companyName,
          how_did_you_find_us: formData.howDidYouFindUs,
          monthly_spend: formData.monthlySpend,
          website: formData.website
        }]);

      if (error) throw error;
      
      // Redirect to thank you page
      navigate('/thankyou-consult');
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : 'There was an error submitting your request. Please try again.');
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
                <Link to="/free-marketing-analysis" className="text-primary-blue font-medium">
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
                className="block px-3 py-2 text-primary-blue w-full text-left font-medium"
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

      {/* Combined Hero and Form Section - Reduced top padding and combined sections */}
      <section className="pt-16 pb-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-slide-up">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Claim Your Free Marketing Analysis — No Contracts. No Pressure. Just a Plan That Works.
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed mb-10 max-w-3xl mx-auto">
              Fill out the form below. We'll review your business and send you a custom plan to get more clients — fast.
            </p>

            {/* Form Section - Moved up into main section */}
            <div className="max-w-2xl mx-auto">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
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
                      className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-primary-blue focus:bg-white transition-colors"
                      disabled={isSubmitting}
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
                      className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-primary-blue focus:bg-white transition-colors"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-primary-blue focus:bg-white transition-colors"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-primary-blue focus:bg-white transition-colors"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-primary-blue focus:bg-white transition-colors"
                    disabled={isSubmitting}
                  />
                </div>

                {/* How did you find us */}
                <div>
                  <label htmlFor="howDidYouFindUs" className="block text-sm font-medium text-gray-700 mb-2">
                    How did you find us?
                  </label>
                  <select
                    id="howDidYouFindUs"
                    name="howDidYouFindUs"
                    value={formData.howDidYouFindUs}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-primary-blue focus:bg-white transition-colors"
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

                {/* Monthly Spend */}
                <div>
                  <label htmlFor="monthlySpend" className="block text-sm font-medium text-gray-700 mb-2">
                    How much are you spending per month (USD)?
                  </label>
                  <select
                    id="monthlySpend"
                    name="monthlySpend"
                    value={formData.monthlySpend}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-primary-blue focus:bg-white transition-colors"
                    disabled={isSubmitting}
                  >
                    <option value="">Select a range</option>
                    <option value="< $1k">Less than $1,000</option>
                    <option value="$1k–$5k">$1,000 - $5,000</option>
                    <option value="$5k+">$5,000+</option>
                    <option value="not-spending">Not currently spending on marketing</option>
                  </select>
                </div>

                {/* Website */}
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-primary-blue focus:bg-white transition-colors"
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

                {/* Trust Badges */}
                <div className="flex justify-center items-center gap-6 pt-6 border-t border-gray-100 flex-wrap">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>No contracts</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>No obligations</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>You own your data</span>
                  </div>
                </div>
              </form>

              {/* Bottom CTA */}
              <div className="mt-12 p-8 bg-gray-50 rounded-2xl text-center">
                <p className="text-lg text-gray-700">
                  <strong>Still deciding?</strong> 👉 Our plans have helped clients go from $0 to record revenues — with no risk. Claim yours today.
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
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FreeMarketingAnalysisPage;