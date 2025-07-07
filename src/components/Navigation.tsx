import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 bg-white ${
      isScrolled 
        ? 'shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm' 
        : 'shadow-[0_4px_20px_rgb(0,0,0,0.08)]'
    }`}>
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
              <Link
                to="/products"
                className="block px-3 py-2 text-gray-900 hover:text-primary-blue w-full text-left font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
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
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/free-marketing-analysis"
              className="block px-3 py-2 text-gray-900 hover:text-primary-blue w-full text-left font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Free Marketing Analysis
            </Link>
            <Link
              to="/blog"
              className="block px-3 py-2 text-gray-900 hover:text-primary-blue w-full text-left font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/newsletter"
              className="block px-3 py-2 text-gray-900 hover:text-primary-blue w-full text-left font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Newsletter
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;