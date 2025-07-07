import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ValueProposition: React.FC = () => {
  return (
    <section className="py-40 bg-red-50 border-t-2 border-primary-red">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-slide-up">
          <div className="flex justify-center mb-6">
            <AlertTriangle className="w-16 h-16 text-primary-red" />
          </div>
          
          <h2 className="font-heading text-5xl font-bold text-gray-900 mb-10">
            You've tried agencies, freelancers, DIY ads..
          </h2>
          
          <p className="font-body text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto font-medium">
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