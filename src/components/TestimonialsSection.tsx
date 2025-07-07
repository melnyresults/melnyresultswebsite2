import React from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: "I spent $20k with other marketers and got zero calls. Then these guys came in — BOOM — record revenues.",
      author: "MVA Projects",
      role: "Construction Company",
      rating: 5,
      avatar: "M"
    },
    {
      quote: "First marketing dollars that didn't feel like burning cash.",
      author: "Censored Lawyer",
      role: "Law Practice",
      rating: 5,
      avatar: "C"
    }
  ];

  return (
    <section id="testimonials" className="py-40 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-5xl font-bold text-gray-900 mb-8">
            Real Results from Real Clients
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white p-10 rounded-2xl shadow-premium hover:shadow-premium-xl transition-all duration-300 relative border-t-4 border-navy-500"
            >
              <div className="absolute top-6 right-6">
                <Quote className="w-10 h-10 text-navy-500 opacity-20" />
              </div>
              
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-500 fill-current" />
                ))}
              </div>
              
              <blockquote className="font-body text-xl text-gray-800 mb-8 italic leading-relaxed font-medium">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="flex items-center">
                <div className="w-14 h-14 bg-navy-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-heading font-bold text-gray-900">{testimonial.author}</div>
                  <div className="font-body text-gray-600 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;