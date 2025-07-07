import React from 'react';
import { X, Shield, Key, Zap, Minus, Lock, Award, Target } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Minus className="w-7 h-7" />,
      title: "No lock-in contracts",
      description: "fire us the moment we stop delivering."
    },
    {
      icon: <Key className="w-7 h-7" />,
      title: "You own it all",
      description: "no more agencies holding your business hostage."
    },
    {
      icon: <Award className="w-7 h-7" />,
      title: "No fine-print guarantees",
      description: "we deliver, or we don't get paid."
    },
    {
      icon: <Target className="w-7 h-7" />,
      title: "No cookie-cutter campaigns",
      description: "we build what works for your business."
    }
  ];

  return (
    <section id="services" className="py-40 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-5xl font-bold text-gray-900 mb-8">
            Why We're Different
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-10 bg-white rounded-2xl shadow-premium hover:shadow-premium-xl transition-all duration-300 hover:-translate-y-3 border border-gray-200"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 p-5 bg-navy-50 rounded-full group-hover:bg-navy-500 transition-colors duration-300">
                  <div className="text-navy-500 group-hover:text-white transition-colors duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="font-body text-gray-700 leading-relaxed font-medium">
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