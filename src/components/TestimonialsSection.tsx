import React from 'react';
import { X, CheckCircle } from 'lucide-react';

const ComparisonSection: React.FC = () => {
  const otherAgencies = [
    "Generic content templates",
    "Monthly reporting only", 
    "Separate teams for different platforms",
    "Long-term contracts required",
    "One-size-fits-all approach"
  ];

  const melnyResults = [
    "If it doesn't work, we refund you",
    "Start small and see if we're a good fit",
    "Facebook, Instagram, Google, we cover it all",
    "Stay flexible - no long-term commitments required",
    "Regular calls to review what's working"
  ];

  return (
    <section id="comparison" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8">
            Why choose Melny Results over everyone else?
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Other Agencies */}
          <div className="bg-red-50 p-8 rounded-2xl border border-red-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Other Agencies
            </h3>
            <div className="space-y-4">
              {otherAgencies.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Melny Results */}
          <div className="bg-green-50 p-8 rounded-2xl border border-green-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Melny Results
            </h3>
            <div className="space-y-4">
              {melnyResults.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FAQSection: React.FC = () => {
  const faqs = [
    {
      question: "How quickly will I see results?",
      answer: "Most clients start seeing new leads within the first 2 weeks. We guarantee results within 30 days or you get your money back."
    },
    {
      question: "Do I need to sign a long-term contract?",
      answer: "No contracts required. We work month-to-month because we're confident in our results. You can cancel anytime."
    },
    {
      question: "What makes you different from other agencies?",
      answer: "We focus on results, not reports. If we don't fill your calendar with new customers, we refund your money. Simple as that."
    },
    {
      question: "How much does it cost?",
      answer: "Our pricing depends on your business size and goals. Book a free call and we'll create a custom plan that fits your budget."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {faq.question}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
