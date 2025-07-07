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
    <section id="cta" className="py-24 bg-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-semibold text-gray-900 mb-6">
            Ready for Your{' '}
            <span className="text-primary-red">BOOM</span>{' '}
            Moment?
          </h2>
          <h3 className="text-2xl font-semibold text-gray-700 mb-8">
            Let's Build Your Growth Plan — No Cost. No Catch.
          </h3>
          
          {/* Centered paragraph with the three key points */}
          <div className="max-w-3xl mx-auto mb-12">
            <p className="text-lg text-gray-600 mb-4">
              You've seen what we do. You've heard what our clients say.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              Now it's your turn to stop burning cash and start winning.
            </p>
            <p className="text-lg text-gray-600">
              No contracts. No pressure. Just a custom plan to get more clients — fast.
            </p>
          </div>
        </div>

        {/* Centered box */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-50 p-8 rounded-2xl">
            <h4 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Most Agencies Sell You Dreams.{' '}
              <span className="text-primary-blue">We Hand You The Map.</span>
            </h4>
            
            <div className="space-y-4 mb-8 text-left">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
            
            <div className="text-center mb-4">
              <Link
                to="/free-marketing-analysis"
                className="inline-block bg-primary-red text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-all duration-200 hover:scale-105 shadow-xl hover:shadow-2xl w-full md:w-auto"
              >
                Get My Free Growth Plan Now
              </Link>
            </div>
            
            <p className="text-sm text-gray-500 text-center flex items-center justify-center gap-2 flex-wrap">
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