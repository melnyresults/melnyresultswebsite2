import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ValueProposition: React.FC = () => {
  return (
    <section className="py-40 bg-red-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-slide-up">
          <div className="flex items-center justify-center mb-6">
            <div className="w-1 h-16 bg-primary-red mr-6"></div>
            <AlertTriangle className="w-14 h-14 text-primary-red" />
          </div>
          
          <h2 className="text-4xl font-semibold text-gray-900 mb-8">
            You've tried agencies, freelancers, DIY ads..
          </h2>
          
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            And got nothing but wasted time, empty promises, and bills. We're different: 
            We don't ask for trust — we earn it, one client at a time, with real leads, 
            real calls, real growth. <span className="font-semibold text-primary-red">Or you don't pay.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;