import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Lock, Download } from 'lucide-react';
import { saveMarketingSubmission } from '../lib/localStorage';
import { usePageMeta } from '../hooks/usePageMeta';

const GenerativeEngineOptimizationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '+1 '
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  usePageMeta({
    title: 'Free GEO Visibility Guide - Melny Results',
    description: 'Get the no-BS guide that shows how to get your business recommended by ChatGPT, Google, Bing & Perplexity — before they hand your leads to a competitor.',
    keywords: 'generative engine optimization, AI search, ChatGPT marketing, Google SGE, Bing AI, Perplexity optimization',
    ogTitle: 'AI Just Changed the Way People Buy. Is Your Business Ready?',
    ogDescription: 'Get your business recommended by ChatGPT, Google, Bing & Perplexity — before competitors take your leads.',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // If user deletes everything, reset to +1 
    if (value === '') {
      value = '+1 ';
    }
    // If user tries to delete the +1 part, prevent it
    else if (!value.startsWith('+')) {
      value = '+1 ' + value;
    }
    // If user deletes the space after +1, add it back
    else if (value === '+1') {
      value = '+1 ';
    }
    
    setFormData(prev => ({
      ...prev,
      phone: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validate phone number has more than just +1
      if (formData.phone.trim() === '+1' || formData.phone.trim() === '+1 ') {
        setError('Please enter a valid phone number');
        setIsSubmitting(false);
        return;
      }

      // Send to Zapier webhook
      try {
        await fetch('https://hooks.zapier.com/hooks/catch/19293386/u3fdxuh/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            source: 'GEO Landing Page',
            form_type: 'GEO Guide Download',
            submitted_at: new Date().toISOString(),
            page_url: window.location.href
          }),
        });
      } catch (webhookError) {
        console.error('Webhook error:', webhookError);
        // Continue with local storage even if webhook fails
      }

      saveMarketingSubmission({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        company_name: 'GEO Guide Download',
        how_did_you_find_us: 'GEO Landing Page',
        monthly_spend: 'Unknown',
        website: ''
      });
      
      // Redirect to thank you page
      navigate('/generative-engine-optimization-guide-thanks');
    } catch (err) {
      console.error('Form submission error:', err);
      setError('There was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Enhanced Hero Section with Gradient Background */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-2xl mx-auto text-center w-full">
          <div className="animate-slide-up">
            {/* Enhanced Free Guide Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-primary-red text-white rounded-full text-sm font-semibold mb-8 shadow-lg">
              Free Guide
            </div>

            {/* Enhanced Main Headline with AI Icon */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-8">
              AI Just Changed the Way People Buy.<br />
              <span className="text-primary-red relative">
                Is Your Business Still Playing by the Old Rules?
                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-red mt-2"></div>
              </span>
            </h1>
            
            {/* Enhanced Subheadline */}
            <p className="text-2xl text-gray-600 leading-relaxed mb-8 max-w-3xl mx-auto font-medium">
              Get the no-BS guide that shows how to get your business recommended by ChatGPT, Google, Bing & Perplexity — before they hand your leads to a competitor.
            </p>

            {/* Privacy Microcopy */}
            <div className="flex items-center justify-center gap-2 mb-12 text-gray-500">
              <Lock className="w-4 h-4" />
              <span className="text-sm">Your details stay private—no spam, ever.</span>
            </div>

            {/* Enhanced Form Card */}
            <div className="max-w-md mx-auto animate-fade-in-up">
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Fields */}
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
                        className="w-full px-6 py-5 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-primary-blue focus:bg-white transition-colors text-lg"
                        placeholder="John"
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
                        className="w-full px-6 py-5 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-primary-blue focus:bg-white transition-colors text-lg"
                        placeholder="Doe"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Enhanced Email Field */}
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
                      className="w-full px-6 py-5 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-primary-blue focus:bg-white transition-colors text-lg"
                      placeholder="your@email.com"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Enhanced Phone Field */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className="w-full px-6 py-5 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-primary-blue focus:bg-white transition-colors text-lg"
                      placeholder="+1 (555) 123-4567"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Enhanced Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary-red text-white px-8 py-5 rounded-lg text-lg font-semibold hover:bg-red-800 transition-all duration-200 hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Sending Your Guide...
                      </div>
                    ) : (
                      'Get My Free Guide Now'
                    )}
                  </button>
                </form>
              </div>

              {/* Enhanced Trust Bar */}
              <div className="mt-8 animate-fade-in-up">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 border-t-2 border-t-gray-200">
                  <div className="flex justify-center items-center gap-8 py-6 px-4 flex-wrap">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium">Instant download</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium">No spam</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium">100% free</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

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

export default GenerativeEngineOptimizationPage;