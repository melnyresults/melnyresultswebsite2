import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="pt-48 pb-40 bg-gradient-to-b from-gray-50 to-white overflow-hidden relative">
      {/* Background Geometric Pattern */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Content */}
          <div className="animate-slide-up">
            <h1 className="text-6xl lg:text-7xl font-semibold text-gray-900 leading-tight mb-6">
              More Growth. More Clients.{' '}
              <span className="text-primary-red">Guaranteed.</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed mb-12 max-w-3xl mx-auto">
              And this time, you won't be burned. We don't get paid unless you win. 
              No contracts. No fluff. Just results — or you owe us nothing.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
              <Link
                to="/free-marketing-analysis"
                className="inline-flex items-center justify-center bg-primary-red text-white px-10 py-5 rounded-full text-lg font-semibold hover:bg-red-700 transition-all duration-200 hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                <Rocket className="w-5 h-5 mr-2" />
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