import React from 'react';
import { CheckCircle, Target, BarChart } from 'lucide-react';

const ValueProposition: React.FC = () => {
  const steps = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Plan Your Success",
      description: "We figure out who your customers are and what they want to hear before we start"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Handle Everything Daily",
      description: "We create ads, schedule them, and manage all your campaigns so you don't have to"
    },
    {
      icon: <BarChart className="w-8 h-8" />,
      title: "Track What Works",
      description: "We see which posts bring in customers and do more of what's working"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-slide-up">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-gray-900 mb-8">
              It's Straightforward
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="group p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-green-50 rounded-full group-hover:bg-green-100 transition-colors duration-300">
                    <div className="text-green-600 group-hover:text-green-800 transition-colors duration-300">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;