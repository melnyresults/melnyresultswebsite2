import React, { useState } from 'react';
import { Menu, X as CloseIcon, CheckCircle, Mail, FileText, Phone, ArrowRight, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { usePageMeta } from '../hooks/usePageMeta';

const ThankYouConsultPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { posts } = useBlogPosts();
  
  usePageMeta({
    title: 'Thank You - Free Marketing Analysis Request - Melny Results',
    description: 'Thanks for signing up! We\'re analyzing your business right now. Ivan will personally review your information and get in touch within 24 hours.',
    keywords: 'thank you, marketing analysis, business consultation, growth plan',
    ogTitle: 'Thanks for Signing Up! - Melny Results',
    ogDescription: 'We\'re analyzing your business right now—here\'s what to expect next.',
  });

  const createSlug = (title: string, id: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return `${slug}-${id.slice(0, 8)}`;
  };

  // Get the first 3 blog posts for display
  const displayPosts = posts.length > 0 ? posts.slice(0, 3) : [
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

      {/* Enhanced Hero Section */}
      <section className="py-20 bg-green-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            {/* Animated Green Checkmark */}
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-green-500 rounded-lg flex items-center justify-center animate-bounce">
                <CheckCircle className="w-14 h-14 text-white" strokeWidth={3} />
              </div>
            </div>

            {/* Enhanced Main Headline */}
            <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 mb-8">
              Thanks for Signing Up!
            </h1>

            {/* Enhanced Subheadline */}
            <div className="max-w-2xl mx-auto mb-8">
              <p className="text-xl text-gray-700 leading-relaxed mb-4 font-medium">
                We're analyzing your business right now—here's what to expect next.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Ivan will personally review your information and get in touch within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Next Steps Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in-up">
            {/* Steps Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center p-8 bg-white rounded-2xl shadow-sm border-r border-gray-200 md:border-r-2">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="w-8 h-8 text-primary-blue" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  📧 Step 1
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Watch your email</strong>—your analysis arrives in 24 hours.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center p-8 bg-white rounded-2xl shadow-sm border-r border-gray-200 md:border-r-2">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  📝 Step 2
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Review your custom growth plan</strong> tailored to your business.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center p-8 bg-white rounded-2xl shadow-sm">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <Phone className="w-8 h-8 text-primary-red" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  📞 Step 3
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Book your free strategy call</strong> (if you want help implementing).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Blog Promo Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in-up">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                🎯 Get a Head Start While You Wait
              </h2>
              <p className="text-xl text-gray-600">
                Discover proven strategies to accelerate your growth
              </p>
            </div>

            {/* Blog Cards Slider */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {displayPosts.map((post, index) => (
                <Link 
                  key={post.id || index} 
                  to={posts.length > 0 ? `/blog/${createSlug(post.title, post.id)}` : '/blog'}
                  className="group cursor-pointer"
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden h-full border border-gray-100">
                    {/* Thumbnail Image */}
                    <div className="relative overflow-hidden">
                      <img 
                        src={post.image_url || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'}
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-blue transition-colors duration-300">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-4">
                        {post.excerpt || "Discover proven strategies to grow your business faster."}
                      </p>
                      <div className="inline-flex items-center text-primary-blue font-medium group-hover:text-blue-700 transition-colors">
                        Read Now
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Enhanced CTA Button */}
            <div className="text-center">
              <Link
                to="/blog"
                className="inline-flex items-center px-8 py-4 bg-primary-red text-white rounded-lg text-lg font-semibold hover:bg-red-800 transition-all duration-200 hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                <Target className="w-5 h-5 mr-2" />
                Explore All Resources
              </Link>
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

export default ThankYouConsultPage;