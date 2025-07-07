import React, { useState } from 'react';
import { Check, X, Menu, X as CloseIcon } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const CloserPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    salesExperience: '',
    whyCloser: '',
    agreeCommission: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate form submission (you can replace this with actual API call)
      console.log('Form submitted:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store form data in localStorage for potential future use
      localStorage.setItem('closerApplication', JSON.stringify({
        ...formData,
        submittedAt: new Date().toISOString()
      }));
      
      // Redirect to thank you page
      navigate('/closer/thank-you');
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error submitting your application. Please try again.');
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
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-8">
            You're Either a Closer... Or<br />
            <span className="text-primary-red">You're Pretending.</span>
          </h1>
          
          <div className="max-w-2xl mx-auto mb-12 leading-relaxed">
            <p className="text-lg text-gray-700 mb-1">
              We're hiring <strong>1 high-ticket closer</strong> to handle <strong>10-30 pre-booked calls</strong>
            </p>
            <p className="text-lg text-gray-700 mb-1">
              <strong>a week</strong>, selling marketing services from <strong>$2K to $30K/month</strong>.
            </p>
            <p className="text-lg text-gray-700 mb-1">
              No cold calling. No base pay. No tire kickers.
            </p>
            <p className="text-lg text-gray-700 font-semibold">
              Just red-hot leads... and fat commission.
            </p>
          </div>

          {/* YouTube Video */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                src="https://www.youtube.com/embed/aUJI02OenUg"
                title="This Is The Best Closer Role You'll Find..."
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          <p className="text-gray-600 italic">
            Watch this video before you apply. It filters out the weak.
          </p>
        </div>
      </section>

      {/* Is This For Me Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-12">
              "Is this really for me?"
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* This is for you if */}
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-8">
                This is for you if...
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-lg text-gray-700">You've got 6-12+ months sales experience</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-lg text-gray-700">You speak and write fluent English</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-lg text-gray-700">You know Zoom, Slack, CRMs, Google Sheets</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-lg text-gray-700">You're available for 10-30 calls/week</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-lg text-gray-700">You thrive on commission and pressure</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-lg text-gray-700">You're coachable, competitive, and want more</span>
                </div>
              </div>
            </div>

            {/* Don't even bother if */}
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-8">
                Don't even bother if...
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <X className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                  <span className="text-lg text-gray-700">You're looking for base pay</span>
                </div>
                <div className="flex items-start gap-3">
                  <X className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                  <span className="text-lg text-gray-700">You ghost leads or flake on calls</span>
                </div>
                <div className="flex items-start gap-3">
                  <X className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                  <span className="text-lg text-gray-700">You want someone to "train you from scratch"</span>
                </div>
                <div className="flex items-start gap-3">
                  <X className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                  <span className="text-lg text-gray-700">You're a "people person" but can't close</span>
                </div>
                <div className="flex items-start gap-3">
                  <X className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                  <span className="text-lg text-gray-700">You're scared to get uncomfortable</span>
                </div>
                <div className="flex items-start gap-3">
                  <X className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                  <span className="text-lg text-gray-700">You need to be told what to do every day</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to prove you're a closer?
            </h2>
            <p className="text-lg text-gray-700 mb-2">
              Fill this out and we'll send you an email with the next available time slots.
            </p>
            <p className="text-lg text-gray-700 font-semibold">
              We're moving fast—be ready.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-primary-blue focus:bg-white transition-colors"
                disabled={isSubmitting}
              />
            </div>

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

            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn / Portfolio / Recordings (Link) (optional)
              </label>
              <input
                type="url"
                id="linkedin"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-primary-blue focus:bg-white transition-colors"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="salesExperience" className="block text-sm font-medium text-gray-700 mb-2">
                Brief sales experience summary (1-3 sentences) *
              </label>
              <textarea
                id="salesExperience"
                name="salesExperience"
                required
                rows={4}
                value={formData.salesExperience}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-primary-blue focus:bg-white transition-colors resize-none"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="whyCloser" className="block text-sm font-medium text-gray-700 mb-2">
                Why do you want this closer role?
              </label>
              <textarea
                id="whyCloser"
                name="whyCloser"
                rows={4}
                value={formData.whyCloser}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-primary-blue focus:bg-white transition-colors resize-none"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="agreeCommission"
                name="agreeCommission"
                required
                checked={formData.agreeCommission}
                onChange={handleInputChange}
                className="mt-1 w-4 h-4 text-primary-blue border-gray-300 rounded focus:ring-primary-blue"
                disabled={isSubmitting}
              />
              <label htmlFor="agreeCommission" className="text-sm text-gray-700">
                I understand this is a commission-only position.
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Submitting Application...
                </div>
              ) : (
                'Apply Now – Let\'s See What You\'ve Got'
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            We're Only Hiring ONE Closer.
          </h2>
          
          <div className="max-w-2xl mx-auto mb-12">
            <p className="text-lg text-gray-700 mb-2">
              We're not mass-recruiting. This isn't a churn-and-burn boiler room.
            </p>
            <p className="text-lg text-gray-700 mb-2">
              We're bringing in one savage to step in, close hard, and make a ton of money.
            </p>
            <p className="text-lg text-gray-700 mb-2">
              If this page is live, the spot's still open.
            </p>
            <p className="text-lg text-gray-700 font-semibold">
              But if you hesitate... someone else is taking it.
            </p>
          </div>

          <button 
            onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-primary-red text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors duration-200"
          >
            Apply Now Before the Spot's Gone
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
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CloserPage;