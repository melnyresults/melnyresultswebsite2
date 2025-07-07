import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { saveMarketingSubmission } from '../lib/localStorage';

const GenerativeEngineOptimizationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '+1 '
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

      saveMarketingSubmission({
        first_name: 'GEO Guide',
        last_name: 'Request',
        email: formData.email,
        phone: formData.phone,
        company_name: 'GEO Guide Download',
        how_did_you_find_us: 'GEO Landing Page',
        monthly_spend: 'Unknown',
        website: ''
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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content - Takes full height minus footer */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto text-center w-full">
          <div className="animate-slide-up">
            {/* Free Guide Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-primary-red text-white rounded-full text-sm font-semibold mb-8">
              Free Guide
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              AI Just Changed the Way People Buy.<br />
              <span className="text-primary-red">Is Your Business Still Playing by the Old Rules?</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl text-gray-600 leading-relaxed mb-12 max-w-3xl mx-auto">
              Get the no-BS guide that shows how to get your business recommended by ChatGPT, Google, Bing & Perplexity — before they hand your leads to a competitor.
            </p>

            {/* Form */}
            <div className="max-w-md mx-auto">
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
                    className="w-full px-4 py-4 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-primary-blue focus:bg-white transition-colors text-lg"
                    placeholder="your@email.com"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Phone Field */}
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
                    className="w-full px-4 py-4 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-primary-blue focus:bg-white transition-colors text-lg"
                    placeholder="+1 (555) 123-4567"
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
                      Sending Your Guide...
                    </div>
                  ) : (
                    'Get My Free Guide Now'
                  )}
                </button>

                {/* Trust Elements */}
                <div className="flex justify-center items-center gap-6 pt-6 border-t border-gray-100 flex-wrap">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Instant download</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>No spam</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>100% free</span>
                  </div>
                </div>
              </form>
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
                src="/src/assets/image (10).png" 
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