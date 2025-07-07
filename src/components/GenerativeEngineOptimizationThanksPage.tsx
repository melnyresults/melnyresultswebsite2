import React from 'react';
import { useState } from 'react';
import { handleGEOAuditCheckout } from '../lib/stripe';

const GenerativeEngineOptimizationThanksPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await handleGEOAuditCheckout();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Section 1: Confirmation Message */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-slide-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-8">
              Your GEO Visibility Guide Is On Its Way to Your Inbox 📩
            </h1>
            
            <div className="max-w-2xl mx-auto mb-12">
              <p className="text-xl text-gray-700 leading-relaxed mb-4">
                Check your <strong>SPAM FOLDER</strong>.
              </p>
              <p className="text-xl text-gray-700 leading-relaxed font-semibold">
                BUT BEFORE YOU GO… this is where the real edge begins.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Video Pitch */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              WATCH THIS SHORT VIDEO FIRST
            </h2>
            
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto mb-8">
              Discover why 99% of business owners are invisible to ChatGPT, Google's SGE & Bing AI…<br />
              And what the smart ones are doing right now to get recommended before their competitors.
            </p>
          </div>

          {/* YouTube Video */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                src="https://www.youtube.com/embed/B2QTYiWmUa0"
                title="GEO Visibility Strategy Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Offer Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Want to Know Exactly Where You Stand in AI Search?
          </h2>
          
          <div className="max-w-3xl mx-auto text-lg text-gray-700 leading-relaxed space-y-6">
            <p>
              We've helped business owners uncover exactly why their competitors are getting recommended by AI… and how to flip the script in their favor.
            </p>
            
            <p>
              If you want us to personally audit your visibility across ChatGPT, Google SGE, Bing Chat & Perplexity… and give you a step-by-step game plan to dominate AI search…
            </p>
            
            <p className="text-xl font-semibold text-gray-900">
              You can get a 1-time GEO Visibility Audit for just <span className="text-primary-red">$997</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Purchase CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ⚡ Limited-Time Offer for New Subscribers ⚡
            </h2>
            
            <p className="text-xl text-gray-700 font-semibold">
              This page is the only place you'll see this offer. Don't sleep on it.
            </p>
          </div>

          {/* Price and Button */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg border">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Get My GEO Audit Now
                </h3>
                <div className="text-4xl font-bold text-primary-red mb-6">
                  $997
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Stripe Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-primary-red text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-all duration-200 hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </div>
                ) : (
                  'Get My GEO Audit Now - $997'
                )}
              </button>

              <p className="text-sm text-gray-500 mt-4">
                Secure payment powered by Stripe
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Value Bullets and Social Proof */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Value Bullets */}
          <div className="text-center mb-16">
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <span className="text-lg text-gray-700 font-medium">100% actionable report</span>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <span className="text-lg text-gray-700 font-medium">No guesswork — get screenshots, citations, action steps</span>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <span className="text-lg text-gray-700 font-medium">Created by a real team, not some AI prompt jockey</span>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <span className="text-lg text-gray-700 font-medium">Full transparency + tailored to your business</span>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-50 p-8 rounded-2xl border-l-4 border-primary-blue">
              <blockquote className="text-xl text-gray-800 italic leading-relaxed mb-4">
                "Yes, we would be interested in buying Google's Chrome browser"
              </blockquote>
              <div className="text-right">
                <cite className="text-gray-600 font-medium not-italic">
                  — Nick Turner, April 22, 2025, OpenAI's ChatGPT Head of Product
                </cite>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GenerativeEngineOptimizationThanksPage;