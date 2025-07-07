import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <section className="pt-48 pb-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Content */}
          <div className="animate-slide-up">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              More Growth. More Clients.{' '}
              <span className="text-primary-red">Guaranteed.</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-3xl mx-auto">
              And this time, you won't be burned. We don't get paid unless you win. 
              No contracts. No fluff. Just results — or you owe us nothing.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
              <Link
                to="/free-marketing-analysis"
                className="bg-primary-red text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-all duration-200 hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                Get My Free Growth Plan Now
              </Link>
            </div>
            
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-primary-red rounded-full animate-bounce-gentle"></span>
              Only 5 free plans available this month. No obligations. No risk. Just results.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;