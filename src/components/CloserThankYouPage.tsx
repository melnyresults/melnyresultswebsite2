import React, { useState } from 'react';
import { Check, Menu, X as CloseIcon, Shield, ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { usePageMeta } from '../hooks/usePageMeta';

const CloserThankYouPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { posts } = useBlogPosts();
  
  usePageMeta({
    title: 'Application Submitted - Closer Position - Melny Results',
    description: 'Your application has been secured. If you\'re a real closer, you\'ll hear from us in the next 24–48 hours.',
    keywords: 'application submitted, closer position, sales job, high ticket sales',
    ogTitle: 'You\'re In. - Closer Application Submitted',
    ogDescription: 'Your application has been secured. Check your email for available time slots.',
  });

  const createSlug = (title: string, id: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return `${slug}-${id.slice(0, 8)}`;
  };

  // Get blog posts for carousel
  const displayPosts = posts.length > 0 ? posts.slice(0, 6) : [
    {
      id: '1',
      title: "Smart Small > Big Dumb",
      excerpt: "Why smart, targeted campaigns always outperform massive, unfocused marketing efforts.",
      image_url: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
    },
    {
      id: '2',
      title: "Easy Problem Fixer",
      excerpt: "How to position yourself as the go-to solution for problems customers don't know they have.",
      image_url: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
    },
    {
      id: '3',
      title: "Do Less",
      excerpt: "Why focusing on fewer things will actually grow your business faster than trying to do everything.",
      image_url: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
    }
  ];

  const getRandomCategory = () => {
    const categories = ['Growth Strategies', 'Success Stories', 'Tips', 'Case Studies'];
    return categories[Math.floor(Math.random() * categories.length)];
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(displayPosts.length / 3));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(displayPosts.length / 3)) % Math.ceil(displayPosts.length / 3));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-20">
            {/* Centered Navigation Links */}
            <div className="flex items-center space-x-12">
              {/* Navigation Links - Desktop */}
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-gray-900 hover:text-primary-blue transition-colors duration-200 font-medium">
                  Home
                </Link>
                <Link to="/free-marketing-analysis" className="text-gray-900 hover:text-primary-blue transition-colors duration-200 font-medium">
                  Free Marketing Analysis
                </Link>
                <Link to="/blog" className="text-gray-900 hover:text-primary-blue transition-colors duration-200 font-medium">
                  Blog
                </Link>
                <Link to="/newsletter" className="text-gray-900 hover:text-primary-blue transition-colors duration-200 font-medium">
                  Newsletter
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden absolute right-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-900 hover:text-primary-blue focus:outline-none"
              >
                {isMobileMenuOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-900 hover:text-primary-blue w-full text-left font-medium"
              >
                Home
              </Link>
              <Link
                to="/free-marketing-analysis"
                className="block px-3 py-2 text-gray-900 hover:text-primary-blue w-full text-left font-medium"
              >
                Free Marketing Analysis
              </Link>
              <Link
                to="/blog"
                className="block px-3 py-2 text-gray-900 hover:text-primary-blue w-full text-left font-medium"
              >
                Blog
              </Link>
              <Link
                to="/newsletter"
                className="block px-3 py-2 text-gray-900 hover:text-primary-blue w-full text-left font-medium"
              >
                Newsletter
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Enhanced Hero Confirmation Block */}
      <section className="py-20 bg-green-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            {/* Animated Green Checkmark */}
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-green-500 rounded-lg flex items-center justify-center animate-bounce">
                <Check className="w-14 h-14 text-white" strokeWidth={3} />
              </div>
            </div>

            {/* Enhanced Main Headline */}
            <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 mb-8">
              You're In.
            </h1>

            {/* Enhanced Subheadline with Shield Icon */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-green-500" />
                <p className="text-xl text-gray-700 leading-relaxed font-medium">
                  Your application has been secured.
                </p>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                If you're a real closer, you'll hear from us in the next <strong>24–48 hours</strong>. 
                Check your email for available time slots. If not? Someone else will take your spot.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Blog Carousel Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in-up">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                🔥 Keep Your Edge — Read Our Top Insights
              </h2>
              <p className="text-xl text-gray-600">
                Grow your skills while you wait for your call.
              </p>
            </div>

            {/* Blog Carousel */}
            <div className="relative">
              {/* Navigation Arrows - Desktop */}
              <div className="hidden md:block">
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                  disabled={displayPosts.length <= 3}
                >
                  <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                  disabled={displayPosts.length <= 3}
                >
                  <ChevronRight className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Carousel Container */}
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {Array.from({ length: Math.ceil(displayPosts.length / 3) }).map((_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-shrink-0">
                      <div className="grid md:grid-cols-3 gap-8 px-4">
                        {displayPosts.slice(slideIndex * 3, (slideIndex + 1) * 3).map((post, index) => (
                          <Link 
                            key={post.id || index} 
                            to={posts.length > 0 ? `/blog/${createSlug(post.title, post.id)}` : '/blog'}
                            className="group cursor-pointer"
                          >
                            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden h-full">
                              {/* Enhanced Featured Image */}
                              <div className="relative overflow-hidden">
                                <img 
                                  src={post.image_url || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'}
                                  alt={post.title}
                                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                {/* Category Badge */}
                                <div className="absolute top-4 left-4">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-red text-white">
                                    <Tag className="w-3 h-3 mr-1" />
                                    {getRandomCategory()}
                                  </span>
                                </div>
                              </div>

                              {/* Enhanced Content */}
                              <div className="p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-blue transition-colors duration-300">
                                  {post.title}
                                </h3>
                                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                                  {post.excerpt || "Discover proven strategies to grow your business faster."}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Swipe Indicator */}
              <div className="md:hidden mt-6 text-center text-sm text-gray-500">
                Swipe to see more →
              </div>

              {/* Pagination Dots */}
              {displayPosts.length > 3 && (
                <div className="flex justify-center mt-8 space-x-2">
                  {Array.from({ length: Math.ceil(displayPosts.length / 3) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                        currentSlide === index ? 'bg-primary-red' : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* View All Blog Posts CTA */}
              <div className="text-center mt-12">
                <Link
                  to="/blog"
                  className="inline-flex items-center px-8 py-4 bg-primary-red text-white rounded-lg text-lg font-semibold hover:bg-red-700 transition-all duration-200 hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  View All Insights
                </Link>
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

export default CloserThankYouPage;