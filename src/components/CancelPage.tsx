import React, { useState } from 'react';
import { Menu, X as CloseIcon, XCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const CancelPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                <Link to="/products" className="text-gray-900 hover:text-primary-blue transition-colors duration-200 font-medium">
                  Products
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
              <Link
                to="/products"
                className="block px-3 py-2 text-gray-900 hover:text-primary-blue w-full text-left font-medium"
              >
                Products
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Cancel Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Cancel Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-red-500 rounded-lg flex items-center justify-center">
              <XCircle className="w-12 h-12 text-white" strokeWidth={3} />
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
            Payment Cancelled
          </h1>

          {/* Message */}
          <div className="max-w-2xl mx-auto mb-12">
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              No worries! Your payment was cancelled and no charges were made to your account.
            </p>
            <p className="text-lg text-gray-600">
              If you changed your mind or encountered an issue, you can try again or explore our other options.
            </p>
          </div>

          {/* Options */}
          <div className="max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              What Would You Like to Do?
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-primary-red mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Try the purchase again with a different payment method</span>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-primary-red mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Start with our free marketing analysis instead</span>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-primary-red mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Browse our blog for free marketing insights</span>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-primary-red mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Contact us if you need help or have questions</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-primary-red text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </Link>
            <Link
              to="/free-marketing-analysis"
              className="inline-flex items-center px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Get Free Analysis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>

          {/* Alternative Options */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-50 p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Start with Something Free
              </h3>
              <p className="text-gray-700 mb-6">
                Not ready to purchase? Get a free marketing analysis to see what we can do for your business.
              </p>
              <Link
                to="/free-marketing-analysis"
                className="inline-flex items-center px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Get Free Analysis
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Learn More First
              </h3>
              <p className="text-gray-700 mb-6">
                Check out our blog for proven marketing strategies and insights that you can implement right away.
              </p>
              <Link
                to="/blog"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Read Our Blog
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
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

export default CancelPage;