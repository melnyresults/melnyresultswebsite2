import React from 'react';
import { Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const FinalCTA: React.FC = () => {
  return (
    <section id="cta" className="py-20 bg-primary-red">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-white mb-6">
            Your Customer flood starts right here.
          </h2>
          
          <div className="max-w-2xl mx-auto mb-8">
            <p className="text-lg text-red-100 leading-relaxed">
              Book a free 30 min call and we'll show you exactly how we'll fill your calendar with new customers.
            </p>
          </div>
          
          <div className="text-center">
            <Link
              to="/free-marketing-analysis"
              className="inline-flex items-center bg-white text-primary-red px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-200 hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              <Phone className="w-5 h-5 mr-2" />
              Book a Call
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;