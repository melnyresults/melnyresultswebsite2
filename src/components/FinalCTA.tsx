import React from 'react';
import { CheckCircle, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const FinalCTA: React.FC = () => {
  const benefits = [
    "A tailored growth blueprint for your business",
    "Competitor snapshot — where you're losing leads today",
    "Clear next steps to bring in more clients this month",
    "Zero sales pitch — you keep the plan, no strings"
  ];

  return (
    <section id="cta" className="py-24 bg-navy-500 border-t-2 border-primary-red">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading text-6xl font-bold text-white mb-8">
            Ready for Your{' '}
            <span className="text-primary-red">BOOM</span>{' '}
            Moment?
          </h2>
          <h3 className="font-heading text-3xl font-bold text-gray-100 mb-10">
            Let's Build Your Growth Plan — No Cost. No Catch.
          </h3>
          
          {/* Centered paragraph with the three key points */}
          <div className="max-w-3xl mx-auto mb-12">
            <p className="font-body text-lg text-gray-200 mb-4 font-medium">
              You've seen what we do. You've heard what our clients say.
            </p>
            <p className="font-body text-lg text-gray-200 mb-4 font-medium">
              Now it's your turn to stop burning cash and start winning.
            </p>
            <p className="font-body text-lg text-gray-200 font-medium">
              No contracts. No pressure. Just a custom plan to get more clients — fast.
            </p>
          </div>
        </div>

        {/* Centered box */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-10 rounded-2xl shadow-premium-xl">
            <h4 className="font-heading text-3xl font-bold text-gray-900 mb-8 text-center">
              Most Agencies Sell You Dreams.{' '}
              <span className="text-navy-500">We Hand You The Map.</span>
            </h4>
            
            <div className="space-y-5 mb-10 text-left">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-7 h-7 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="font-body text-gray-800 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
            
            <div className="text-center mb-4">
              <Link
                to="/free-marketing-analysis"
                className="inline-block bg-primary-red text-white px-12 py-6 rounded-lg text-lg font-heading font-bold uppercase tracking-cta hover:bg-red-700 transition-all duration-200 hover:scale-105 shadow-premium-lg hover:shadow-premium-xl w-full md:w-auto min-h-[56px] flex items-center justify-center"
              >
                Get My Free Growth Plan Now
              </Link>
            </div>
            
            <p className="font-body text-sm text-gray-600 text-center flex items-center justify-center gap-2 flex-wrap">
              <Lock className="w-4 h-4" />
              <span className="w-2 h-2 bg-primary-red rounded-full animate-bounce-gentle"></span>
              Only 5 free plans available this month. No obligations. No risk. Just results.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;