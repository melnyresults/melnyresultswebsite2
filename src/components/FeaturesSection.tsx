import React from 'react';
import { X, Shield, Key, Zap, Minus, Lock, Award, Target } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Minus className="w-6 h-6" />,
      title: "No lock-in contracts",
      description: "fire us the moment we stop delivering."
    },
    {
      icon: <Key className="w-6 h-6" />,
      title: "You own it all",
      description: "no more agencies holding your business hostage."
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "No fine-print guarantees",
      description: "we deliver, or we don't get paid."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "No cookie-cutter campaigns",
      description: "we build what works for your business."
    }
  ];

  return (
    <section id="services" className="py-40 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-semibold text-gray-900 mb-8">
            Why We're Different
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-4 bg-red-50 rounded-full group-hover:bg-red-100 transition-colors duration-300">
                  <div className="text-primary-red group-hover:text-red-800 transition-colors duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;