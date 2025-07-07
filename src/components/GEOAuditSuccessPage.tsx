import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, Mail, Phone } from 'lucide-react';

const GEOAuditSuccessPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Success Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" strokeWidth={3} />
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-8">
            Payment Successful! 🎉
          </h1>

          {/* Confirmation Message */}
          <div className="max-w-3xl mx-auto mb-12">
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              <strong>Your GEO Visibility Audit is confirmed!</strong>
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              We'll begin your comprehensive audit within 24 hours and deliver your personalized report within 3-5 business days.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              You'll receive a detailed analysis of your visibility across ChatGPT, Google SGE, Bing Chat & Perplexity, plus actionable steps to dominate AI search.
            </p>
          </div>
        </div>
      </section>

      {/* What Happens Next */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Happens Next?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-primary-blue rounded-full flex items-center justify-center text-white font-bold text-lg">
                  1
                </div>
              </div>
              <div className="flex justify-center mb-4">
                <Mail className="w-8 h-8 text-primary-blue" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Confirmation Email
              </h3>
              <p className="text-gray-600">
                You'll receive a confirmation email with your receipt and next steps within the next few minutes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-primary-blue rounded-full flex items-center justify-center text-white font-bold text-lg">
                  2
                </div>
              </div>
              <div className="flex justify-center mb-4">
                <Calendar className="w-8 h-8 text-primary-blue" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Audit Begins
              </h3>
              <p className="text-gray-600">
                Our team starts your comprehensive GEO visibility audit within 24 hours of payment confirmation.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-primary-red rounded-full flex items-center justify-center text-white font-bold text-lg">
                  3
                </div>
              </div>
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-primary-red" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Report Delivered
              </h3>
              <p className="text-gray-600">
                Receive your detailed GEO audit report with actionable recommendations within 3-5 business days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Get */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your GEO Audit Will Include:
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">AI Search Visibility Analysis</h4>
                <p className="text-gray-600">Complete assessment across ChatGPT, Google SGE, Bing Chat & Perplexity</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Competitor Comparison</h4>
                <p className="text-gray-600">See exactly how your competitors are getting recommended instead of you</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Screenshots & Citations</h4>
                <p className="text-gray-600">Visual proof of current rankings with specific AI responses</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Action Plan</h4>
                <p className="text-gray-600">Step-by-step strategy to improve your AI search visibility</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Priority Recommendations</h4>
                <p className="text-gray-600">Ranked list of optimizations for maximum impact</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Implementation Timeline</h4>
                <p className="text-gray-600">Clear roadmap with realistic timelines for each optimization</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Questions About Your Audit?
          </h2>
          
          <div className="max-w-2xl mx-auto mb-8">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Our team is here to help. If you have any questions about your GEO Visibility Audit or need assistance, don't hesitate to reach out.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@melnyresults.com"
              className="inline-flex items-center px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Mail className="w-5 h-5 mr-2" />
              Email Support
            </a>
            <Link
              to="/blog"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Read Our Blog
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Cookies + Privacy Link */}
            <div>
              <Link 
                to="/privacy-policy" 
                className="text-white hover:text-gray-300 transition-colors underline text-sm tracking-wide"
              >
                Cookies + Privacy
              </Link>
            </div>
            
            {/* Logo */}
            <div className="mt-8">
              <img 
                src="/src/assets/image (10).png" 
                alt="Melny Results Logo" 
                className="h-48 w-auto mx-auto"
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GEOAuditSuccessPage;