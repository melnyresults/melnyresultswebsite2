import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Lock, Mail, Play } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

const GenerativeEngineOptimizationNThanksPage: React.FC = () => {
  usePageMeta({
    title: 'GEO Guide Sent - Check Your Inbox - Melny Results',
    description: 'Your GEO Visibility Guide is on its way to your inbox. Watch the video to discover why 99% of businesses are invisible to AI search.',
    keywords: 'GEO guide download, AI visibility audit, generative engine optimization, ChatGPT marketing',
    ogTitle: 'Your GEO Visibility Guide Is On Its Way 📩',
    ogDescription: 'Check your SPAM FOLDER. But before you go… this is where the real edge begins.',
  });
  
  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Hero Confirmation Block */}
      <section className="py-16 bg-green-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-slide-up">
            {/* Animated Envelope Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-primary-blue rounded-full flex items-center justify-center animate-bounce">
                <Mail className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Enhanced Main Headline */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-8">
              Your GEO Visibility Guide Is On Its Way to Your Inbox 📩
            </h1>
            
            <div className="max-w-2xl mx-auto mb-8">
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

      {/* Enhanced Video Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              WATCH THIS SHORT VIDEO FIRST
            </h2>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-8 max-w-3xl mx-auto">
              Discover why 99% of business owners are invisible to ChatGPT, Google's SGE & Bing AI…<br />
              And what the smart ones are doing right now to get recommended before their competitors.
            </p>

            {/* Enhanced Video Frame */}
            <div className="max-w-3xl mx-auto">
              <div className="bg-white p-6 rounded-2xl shadow-xl">
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    src="https://www.youtube.com/embed/B2QTYiWmUa0"
                    title="GEO Visibility Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  {/* Red Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-20 h-20 bg-primary-red rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Video Caption */}
              <p className="text-gray-600 mt-4 text-lg font-medium">
                Watch this 3-min video to see how this works.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Offer Introduction */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Want to Know Exactly Where You Stand in AI Search?
            </h2>
            
            <div className="max-w-3xl mx-auto text-lg text-gray-700 leading-relaxed space-y-4 mb-12">
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
        </div>
      </section>

      {/* Enhanced Offer Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            {/* Enhanced Offer Card */}
            <div className="bg-yellow-50 border-2 border-orange-400 p-8 md:p-12 rounded-2xl shadow-xl max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                ⚡ Limited-Time Offer for New Subscribers ⚡
              </h2>
              
              <p className="text-lg text-gray-700 mb-8">
                This page is the only place you'll see this offer. Don't sleep on it.
              </p>

              {/* Enhanced CTA Button */}
              <a
                href="https://buy.stripe.com/8wM2aZgeF9WmbQIcMU?locale=en&__embed_source=buy_btn_1RHo9FRoGKTuFXtOtdkGb66F"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full bg-primary-red text-white px-8 py-6 rounded-lg text-xl font-bold hover:bg-red-800 transition-all duration-200 hover:scale-105 shadow-xl hover:shadow-2xl mb-4"
              >
                <Lock className="w-6 h-6 mr-3" />
                Get Your AI Visibility Audit – $997
              </a>

              {/* Urgency Line */}
              <p className="text-sm text-gray-600 italic">
                Only available on this page—don't miss out.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced What You Get Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in-up">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Enhanced Value Bullets */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-8">
                  What You Get:
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg text-gray-700 leading-relaxed">100% actionable report</span>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg text-gray-700 leading-relaxed">No guesswork — get screenshots, citations, action steps</span>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg text-gray-700 leading-relaxed">Created by a real team, not some AI prompt jockey</span>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg text-gray-700 leading-relaxed">Full transparency + tailored to your business</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Testimonial */}
              <div className="bg-gray-100 p-8 rounded-2xl">
                <blockquote className="text-xl text-gray-700 italic leading-relaxed mb-6">
                  "Yes, we would be interested in buying Google's Chrome browser"
                </blockquote>
                <div className="text-sm text-gray-600">
                  <div className="font-semibold text-lg">— Nick Turner</div>
                  <div className="mt-1">April 22, 2025, OpenAI's ChatGPT Head of Product</div>
                </div>
              </div>
            </div>
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
                src="/melny-results-logo.png" 
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

export default GenerativeEngineOptimizationNThanksPage;