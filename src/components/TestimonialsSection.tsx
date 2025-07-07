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
          <h2 className="text-4xl font-semibold text-gray-900 mb-8">
            Real Results from Real Clients
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative border-t-4 border-primary-blue"
            >
              <div className="absolute top-6 right-6">
                <Quote className="w-8 h-8 text-primary-blue opacity-20" />
              </div>
              
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-500 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-lg text-gray-700 mb-6 italic leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-blue rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
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