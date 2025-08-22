import React from 'react';
import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden relative">
      {/* SEO H1 - Hidden but accessible to search engines */}
      <h1 className="sr-only">
        Melny Results - We'll Fill Your Calendar with New Customers in 30 Days - Guaranteed
      </h1>
      
      {/* Background Geometric Pattern */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-slide-up text-left">
            <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight mb-6">
              We'll Fill Your Calendar with New Customers in 30 Days -{' '}
              <span className="text-primary-red">Guaranteed.</span>
            </h2>
            
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              <strong>Stop waiting for customers to find you.</strong>
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-12">
              We put your business in front of locals actively searching for your services - starting this month.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                to="/free-marketing-analysis"
                className="inline-flex items-center justify-center bg-primary-red text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-all duration-200 hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                <Phone className="w-5 h-5 mr-2" />
                Book a Call
              </Link>
            </div>
          </div>

          {/* Video Section */}
          <div className="animate-slide-up">
            <div className="bg-white p-4 rounded-2xl shadow-xl">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  src="https://www.youtube.com/embed/aUJI02OenUg"
                  title="Melny Results - Customer Growth Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;