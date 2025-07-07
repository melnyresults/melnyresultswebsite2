import React, { useEffect } from 'react';

const GenerativeEngineOptimizationThanksPage: React.FC = () => {
  useEffect(() => {
    // Load Stripe script dynamically
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/buy-button.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Section 1: Confirmation Message */}
      <section className="pt-16 pb-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Your GEO Visibility Guide Is On Its Way to Your Inbox 📩
            </h1>
            
            <div className="max-w-2xl mx-auto">
              <p className="text-xl text-gray-700 leading-relaxed mb-2">
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
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            WATCH THIS SHORT VIDEO FIRST
          </h2>
          
          <p className="text-lg text-gray-700 leading-relaxed mb-8 max-w-3xl mx-auto">
            Discover why 99% of business owners are invisible to ChatGPT, Google's SGE & Bing AI…<br />
            And what the smart ones are doing right now to get recommended before their competitors.
          </p>

          {/* YouTube Video */}
          <div className="max-w-3xl mx-auto">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                src="https://www.youtube.com/embed/B2QTYiWmUa0"
                title="GEO Visibility Video"
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
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Want to Know Exactly Where You Stand in AI Search?
          </h2>
          
          <div className="max-w-3xl mx-auto text-lg text-gray-700 leading-relaxed space-y-4">
            <p>
              We've helped business owners uncover exactly why their competitors are getting recommended by AI… and how to flip the script in their favor.
            </p>
            <p>
              If you want us to personally audit your visibility across ChatGPT, Google SGE, Bing Chat & Perplexity… and give you a step-by-step game plan to dominate AI search…
            </p>
            <p className="font-semibold text-xl">
              You can get a 1-time GEO Visibility Audit for just $997.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Purchase CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ⚡ Limited-Time Offer for New Subscribers ⚡
            </h2>
            
            <p className="text-lg text-gray-700 mb-8">
              This page is the only place you'll see this offer. Don't sleep on it.
            </p>

            {/* Price and Stripe Button */}
            <div className="mb-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Get My GEO Audit Now
                </h3>
                <div className="text-4xl font-bold text-gray-900">
                  $997
                </div>
              </div>

              {/* Stripe Payment Button */}
              <div className="flex justify-center">
                <div className="stripe-button-container">
                  <stripe-buy-button
                    buy-button-id="buy_btn_1RHo9FRoGKTuFXtOtdkGb66F"
                    publishable-key="pk_live_51QnPa5RoGKTuFXtOojWjniXOxD6jfuTxdXQxnbuZNE9Hq14NJb9d8KMyUS6P0IaTm5WK9zt1qD685TvFFSbe01OI00JvtkwAlO"
                  >
                  </stripe-buy-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Value Bullets and Social Proof */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Value Bullets */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                What You Get:
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="text-lg text-gray-700">100% actionable report</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="text-lg text-gray-700">No guesswork — get screenshots, citations, action steps</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="text-lg text-gray-700">Created by a real team, not some AI prompt jockey</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="text-lg text-gray-700">Full transparency + tailored to your business</span>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <blockquote className="text-lg text-gray-700 italic leading-relaxed mb-4">
                "Yes, we would be interested in buying Google's Chrome browser"
              </blockquote>
              <div className="text-sm text-gray-600">
                <div className="font-semibold">— Nick Turner</div>
                <div>April 22, 2025, OpenAI's ChatGPT Head of Product</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GenerativeEngineOptimizationThanksPage;