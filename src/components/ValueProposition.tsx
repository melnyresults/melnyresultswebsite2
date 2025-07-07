import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ValueProposition: React.FC = () => {
  return (
    <section className="py-32 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-slide-up">
          <div className="flex justify-center mb-6">
            <AlertTriangle className="w-12 h-12 text-primary-red" />
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
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