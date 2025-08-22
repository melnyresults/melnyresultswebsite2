import React from 'react';
import { Search, Users, MapPin } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: (
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-32 h-24 rounded-lg object-cover"
        >
          <source src="https://framerusercontent.com/assets/WXvY7G3Uj0EvURAFFTjGY6wbe1c.mp4" type="video/mp4" />
        </video>
      ),
      title: "Ads To Get To The Top Of Google",
      description: "Show up when locals search for what you offer",
      isVideo: true
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "FB/IG Ads To Reach EVERY Local Client",
      description: "Be everywhere. Google, Instagram, Facebook, YouTube…",
      isVideo: false
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Reach Number 1 On Google For Free",
      description: "Be the #1 on Google Maps organically.",
      isVideo: false
    }
  ];

  return (
    <section id="services" className="py-20" style={{ backgroundColor: '#efebe5' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8">
            How we can help you grooow
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              style={{ backgroundColor: '#fbf1e5' }}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="flex flex-col items-center text-center">
                {feature.isVideo ? (
                  <div className="mb-6">
                    {feature.icon}
                  </div>
                ) : (
                  <div className="mb-4 p-3 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors duration-300">
                    <div className="text-primary-blue group-hover:text-blue-800 transition-colors duration-300">
                      {feature.icon}
                    </div>
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
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