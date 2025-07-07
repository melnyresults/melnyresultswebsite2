import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
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
              className="h-24 w-auto mx-auto"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;