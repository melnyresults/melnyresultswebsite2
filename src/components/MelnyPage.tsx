import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  CheckCircle, 
  ArrowRight, 
  Target, 
  Zap, 
  Shield, 
  TrendingUp,
  Users,
  Calendar,
  Star,
  Play,
  ChevronLeft,
  ChevronRight,
  MapPin,
  X,
  Menu
} from 'lucide-react';

const MelnyPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCase, setActiveCase] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const [counters, setCounters] = useState({ clients: 0, revenue: 0, leads: 0 });
  const [showStickyButton, setShowStickyButton] = useState(false);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Counter animation
  useEffect(() => {
    if (isVisible['stats']) {
      const duration = 2000;
      const steps = 60;
      const stepTime = duration / steps;
      
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        
        setCounters({
          clients: Math.floor(500 * progress),
          revenue: Math.floor(50 * progress),
          leads: Math.floor(10000 * progress)
        });
        
        if (step >= steps) clearInterval(timer);
      }, stepTime);
    }
  }, [isVisible['stats']]);

  // Sticky button visibility
  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = heroRef.current?.offsetHeight || 0;
      setShowStickyButton(window.scrollY > heroHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const caseStudies = [
    {
      before: '$900 in ads',
      after: '$200K in booked projects',
      business: 'Nashville Kitchen & Bath Contractor',
      story: 'From struggling to find work to being booked 6 months out. We transformed their entire lead generation system.',
      metric: '22,122% ROI'
    },
    {
      before: '2-3 leads/month',
      after: '130 leads in 2 weeks',
      business: 'Home Services Company',
      story: 'Went from feast-or-famine to having to hire 3 new crews to handle demand.',
      metric: '4,233% increase'
    },
    {
      before: 'Slow season panic',
      after: 'Booked 3 months ahead',
      business: 'Local Landscaping Crew',
      story: 'Never worry about seasonal downturns again. Consistent pipeline year-round.',
      metric: '300% growth'
    },
    {
      before: 'Struggling practice',
      after: '$60K in new retainers',
      business: 'Small Law Firm',
      story: 'From chasing clients to clients chasing them. Premium positioning that pays.',
      metric: '$60K revenue'
    },
    {
      before: '$200 cost per lead',
      after: '$100 cost per lead',
      business: 'Roofing Company',
      story: 'Cut lead costs in half while doubling lead quality. More profit, less waste.',
      metric: '50% cost reduction'
    },
    {
      before: 'Slow growth',
      after: 'Record sales month',
      business: 'Medical Spa',
      story: 'Broke every previous sales record and built a waiting list of premium clients.',
      metric: 'Record breaking'
    },
    {
      before: 'Inconsistent work',
      after: 'Multiple 5-figure contracts',
      business: 'B2B Installer',
      story: 'From project-to-project survival to securing enterprise contracts worth $50K+.',
      metric: '$250K+ pipeline'
    }
  ];

  const objections = [
    {
      objection: "I've tried marketing before. It didn't work.",
      answer: "That's exactly what most of our clients said before they came to us. The difference? We don't just run ads or SEO in isolation — we connect everything and track where the money's actually coming from."
    },
    {
      objection: "It's too expensive.",
      answer: "Our clients regularly see $5–$20 back for every $1 invested. That's not expensive — that's smart."
    },
    {
      objection: "I don't have time to manage this.",
      answer: "Perfect. That's why we handle it for you — from first click to booked job."
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(caseStudies.length / 3));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(caseStudies.length / 3)) % Math.ceil(caseStudies.length / 3));
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="/melny-results-logo.png" 
                alt="Melny Results" 
                className="h-8 w-auto"
              />
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#case-studies" className="text-gray-700 hover:text-primary-blue transition-colors">
                Case Studies
              </a>
              <a href="#process" className="text-gray-700 hover:text-primary-blue transition-colors">
                Process
              </a>
              <a href="#tribe" className="text-gray-700 hover:text-primary-blue transition-colors">
                Success Stories
              </a>
              <a 
                href="#cta" 
                className="bg-primary-red text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 hover:scale-105 shadow-lg"
              >
                Get Your Free Growth Plan
              </a>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-primary-blue"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg">
            <div className="px-4 py-2 space-y-2">
              <a href="#case-studies" className="block py-2 text-gray-700">Case Studies</a>
              <a href="#process" className="block py-2 text-gray-700">Process</a>
              <a href="#tribe" className="block py-2 text-gray-700">Success Stories</a>
              <a 
                href="#cta" 
                className="block bg-primary-red text-white px-4 py-2 rounded-lg text-center"
              >
                Get Your Free Growth Plan
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Sticky Mobile CTA */}
      {showStickyButton && (
        <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden">
          <a
            href="#cta"
            className="block bg-primary-red text-white text-center py-4 rounded-lg font-semibold shadow-2xl animate-pulse"
          >
            Get Your Free Growth Plan
          </a>
        </div>
      )}

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="pt-24 pb-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-blue rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-primary-red rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-8 animate-fade-in-up">
              If Your Phone's Not Ringing,{' '}
              <span className="text-primary-red relative">
                Nothing Else Matters.
                <div className="absolute bottom-0 left-0 w-full h-2 bg-primary-red/20 -rotate-1"></div>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              I'm Ivan from Melny Results. We help local businesses dominate their market, 
              fill their calendar with paying customers, and run it all without you lifting a finger.
            </p>

            <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <a
                href="#cta"
                className="inline-flex items-center bg-primary-red text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-all duration-200 hover:scale-105 shadow-xl hover:shadow-2xl group"
              >
                <Phone className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                Get Your Free Growth Plan
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Micro Proof */}
            <div className="mt-12 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="inline-flex items-center bg-green-50 border border-green-200 rounded-lg px-6 py-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
                <span className="text-green-800 font-medium">
                  $900 in ads → $200K in booked projects for a Nashville contractor.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        id="stats" 
        ref={statsRef}
        data-animate
        className="py-16 bg-primary-blue text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="animate-fade-in-up">
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {counters.clients}+
              </div>
              <div className="text-blue-100">Local Businesses Transformed</div>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl md:text-5xl font-bold mb-2">
                ${counters.revenue}M+
              </div>
              <div className="text-blue-100">Revenue Generated</div>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {counters.leads.toLocaleString()}+
              </div>
              <div className="text-blue-100">Quality Leads Delivered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Section */}
      <section 
        id="pain" 
        data-animate
        className="py-20 bg-white"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center transition-all duration-1000 ${isVisible['pain'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">
              Let's be real.
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div className="bg-green-50 p-8 rounded-2xl border-l-4 border-green-500">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Some weeks, you're slammed.</h3>
                <p className="text-gray-700 leading-relaxed">
                  Crews are booked. Phones are buzzing.
                </p>
              </div>
              
              <div className="bg-red-50 p-8 rounded-2xl border-l-4 border-red-500">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Other weeks?</h3>
                <p className="text-gray-700 leading-relaxed">
                  It's dead quiet. You're looking at your calendar wondering if the bills are going to line up with the jobs.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl">
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                You've tried a little marketing before — maybe an ad here, a boost post there. 
                Maybe you even hired someone. But it's always the same story:
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 text-red-600" />
                  </div>
                  <p className="font-semibold text-gray-900">Leads that waste your time.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 text-red-600" />
                  </div>
                  <p className="font-semibold text-gray-900">Agencies that ghost you after you pay.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 text-red-600" />
                  </div>
                  <p className="font-semibold text-gray-900">Reports full of numbers that mean nothing.</p>
                </div>
              </div>
            </div>

            <p className="text-xl text-gray-700 leading-relaxed mt-8">
              It's not that you don't want more customers. It's that marketing always feels like a gamble… 
              and you've got a business to run.
            </p>
          </div>
        </div>
      </section>

      {/* Dream State Section */}
      <section 
        id="dream" 
        data-animate
        className="py-20 bg-gradient-to-br from-blue-50 to-green-50"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center transition-all duration-1000 ${isVisible['dream'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">
              Now picture this:
            </h2>
            
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-center justify-center mb-4">
                  <Phone className="w-12 h-12 text-green-500" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Your phone rings daily.</h3>
                <p className="text-gray-700 leading-relaxed">
                  Your crews stay busy, every week, without the "feast or famine" rollercoaster.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-center justify-center mb-4">
                  <Zap className="w-12 h-12 text-blue-500" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Every new lead is captured automatically.</h3>
                <p className="text-gray-700 leading-relaxed">
                  Every quote is followed up on — without you having to remember.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-center justify-center mb-4">
                  <Target className="w-12 h-12 text-purple-500" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Your name pops up at the top of Google.</h3>
                <p className="text-gray-700 leading-relaxed">
                  You're the business people see in their feed. You're the one everyone calls first.
                </p>
              </div>
            </div>

            <div className="mt-12 bg-primary-red text-white p-8 rounded-2xl">
              <p className="text-xl leading-relaxed">
                And instead of scrambling for work, you're planning ahead — hiring with confidence, 
                picking and choosing the jobs you actually want.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section 
        id="process" 
        data-animate
        className="py-20 bg-white"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 ${isVisible['process'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                Here's how we make that happen:
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                We build you a business growth system that makes you the first call in town… 
                and sets up the tech so every single lead gets handled automatically.
              </p>
            </div>

            <div className="relative">
              {/* Animated Path */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary-blue via-primary-red to-green-500 transform -translate-y-1/2 rounded-full"></div>
              
              <div className="grid md:grid-cols-3 gap-8 relative">
                <div className="text-center group">
                  <div className="w-20 h-20 bg-primary-blue rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Target className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Launch</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We put you in front of the people already looking for what you do.
                  </p>
                </div>
                
                <div className="text-center group">
                  <div className="w-20 h-20 bg-primary-red rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Capture</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Every lead gets tracked, stored, and followed up.
                  </p>
                </div>
                
                <div className="text-center group">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Automate</h3>
                  <p className="text-gray-700 leading-relaxed">
                    The CRM and automations keep working 24/7 so no opportunity slips away.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-16">
              <div className="bg-gray-50 p-8 rounded-2xl inline-block">
                <p className="text-2xl font-semibold text-gray-900 mb-2">You run your business.</p>
                <p className="text-2xl font-semibold text-primary-red">We run the growth.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Proof Wall */}
      <section 
        id="case-studies" 
        data-animate
        className="py-20 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 ${isVisible['case-studies'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                Talk is cheap. Results aren't.
              </h2>
              <p className="text-xl text-gray-600">
                Hover over these wins to see the result — click to read the full story:
              </p>
            </div>

            {/* Desktop Grid */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {caseStudies.map((study, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group overflow-hidden"
                  onMouseEnter={() => setActiveCase(index)}
                  onMouseLeave={() => setActiveCase(null)}
                  onClick={() => setActiveCase(activeCase === index ? null : index)}
                >
                  <div className="p-6 h-64 flex flex-col justify-between">
                    <div>
                      <div className="text-sm text-gray-500 mb-2">{study.business}</div>
                      <div className="text-2xl font-bold text-gray-900 mb-4">
                        {study.before} → {study.after}
                      </div>
                    </div>
                    
                    <div className={`transition-all duration-300 ${activeCase === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                        <div className="text-lg font-semibold text-green-800 mb-2">{study.metric}</div>
                        <p className="text-sm text-gray-700">{study.story}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Carousel */}
            <div className="md:hidden">
              <div className="relative">
                <div className="overflow-hidden">
                  <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {caseStudies.map((study, index) => (
                      <div key={index} className="w-full flex-shrink-0 px-4">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                          <div className="text-sm text-gray-500 mb-2">{study.business}</div>
                          <div className="text-xl font-bold text-gray-900 mb-4">
                            {study.before} → {study.after}
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                            <div className="text-lg font-semibold text-green-800 mb-2">{study.metric}</div>
                            <p className="text-sm text-gray-700">{study.story}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex justify-center mt-6 space-x-2">
                {caseStudies.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      currentSlide === index ? 'bg-primary-red' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section 
        id="why-us" 
        data-animate
        className="py-20 bg-white"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 ${isVisible['why-us'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-8">Why Choose Us</h2>
                <div className="space-y-6">
                  {[
                    'No lock-in contracts — fire us anytime.',
                    'You own everything — ad accounts, website, CRM, all of it.',
                    'Results or you don\'t pay.',
                    'No cookie-cutter campaigns — we build what works for your business.'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-lg text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-red-50 p-8 rounded-2xl border-l-4 border-red-500">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Compare that to agencies that…</h3>
                <div className="space-y-4">
                  {[
                    'Keep your accounts hostage.',
                    'Make you sign 12-month contracts.',
                    'Disappear when the numbers don\'t look good.'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <X className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-red-200">
                  <p className="text-lg font-semibold text-gray-900">
                    We're not "another agency." We're your growth partner — with skin in the game.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Objection Killers */}
      <section 
        id="objections" 
        data-animate
        className="py-20 bg-gray-50"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 ${isVisible['objections'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
              Common Concerns (And The Truth)
            </h2>
            
            <div className="space-y-8">
              {objections.map((item, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className="text-xl font-bold text-red-600 mb-4">"{item.objection}"</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Tribe */}
      <section 
        id="tribe" 
        data-animate
        className="py-20 bg-primary-blue text-white"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center transition-all duration-1000 ${isVisible['tribe'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              When you work with us, you're not just hiring a marketing company.
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
              You're joining a network of local businesses who are taking over their markets.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Contractors</h3>
                <p className="text-blue-100">lock down their city.</p>
              </div>
              
              <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Law firms</h3>
                <p className="text-blue-100">become the first call in town.</p>
              </div>
              
              <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Service companies</h3>
                <p className="text-blue-100">go from "hoping for work" to "turning down jobs."</p>
              </div>
            </div>
            
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm inline-block">
              <p className="text-2xl font-bold">The next win we post? Could be yours.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section 
        id="cta" 
        data-animate
        className="py-20 bg-gradient-to-br from-red-50 to-orange-50"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 ${isVisible['cta'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Your competitors aren't waiting.{' '}
              <span className="text-primary-red">Why should you?</span>
            </h2>
            
            <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
              Let's map out exactly how we'll fill your calendar. 
              Free, no strings, and you can keep the plan whether we work together or not.
            </p>
            
            <Link
              to="/free-marketing-analysis"
              className="inline-flex items-center bg-primary-red text-white px-12 py-6 rounded-lg text-2xl font-bold hover:bg-red-700 transition-all duration-200 hover:scale-105 shadow-2xl hover:shadow-3xl group mb-8"
            >
              <Calendar className="w-8 h-8 mr-4 group-hover:animate-bounce" />
              Get Your Free Growth Plan
              <ArrowRight className="w-8 h-8 ml-4 group-hover:translate-x-2 transition-transform" />
            </Link>
            
            <div className="flex items-center justify-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>No contracts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>No pressure</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Just results</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Link 
              to="/privacy-policy" 
              className="text-gray-400 hover:text-white transition-colors underline mb-8 inline-block"
            >
              Cookies + Privacy
            </Link>
            
            <div>
              <img 
                src="/melny-results-logo.png" 
                alt="Melny Results Logo" 
                className="h-32 w-auto mx-auto opacity-80"
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MelnyPage;