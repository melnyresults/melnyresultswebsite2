import React, { useState, useEffect } from 'react';
import { Menu, X as CloseIcon, CheckCircle, ArrowRight, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../hooks/useSubscription';
import { getProductByPriceId } from '../stripe-config';

const SuccessPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { subscription, orders, loading, refetch } = useSubscription();

  useEffect(() => {
    // Refetch subscription and order data when component mounts
    // This ensures we get the latest data after a successful purchase
    refetch();
  }, []);

  const getLatestPurchase = () => {
    if (orders.length > 0) {
      const latestOrder = orders[0];
      return {
        type: 'order',
        amount: latestOrder.amount_total / 100, // Convert from cents
        currency: latestOrder.currency,
        date: new Date(latestOrder.order_date),
      };
    }

    if (subscription?.subscription_id) {
      const product = subscription.price_id ? getProductByPriceId(subscription.price_id) : null;
      return {
        type: 'subscription',
        product: product?.name || 'Subscription',
        status: subscription.subscription_status,
        date: subscription.current_period_start ? new Date(subscription.current_period_start * 1000) : new Date(),
      };
    }

    return null;
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const purchase = getLatestPurchase();

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
                <Link to="/products" className="text-gray-900 hover:text-primary-blue transition-colors duration-200 font-medium">
                  Products
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
              <Link
                to="/products"
                className="block px-3 py-2 text-gray-900 hover:text-primary-blue w-full text-left font-medium"
              >
                Products
              </Link>
            </div>
          </div>
        )}
      </nav>

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
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
            Payment Successful!
          </h1>

          {/* Purchase Details */}
          {loading ? (
            <div className="flex justify-center mb-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
            </div>
          ) : purchase ? (
            <div className="max-w-2xl mx-auto mb-12">
              {purchase.type === 'order' ? (
                <div className="bg-gray-50 p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Purchase Complete
                  </h3>
                  <p className="text-lg text-gray-700 mb-4">
                    Thank you for your purchase of <strong>Get My GEO Audit Now</strong>
                  </p>
                  <div className="text-3xl font-bold text-primary-blue mb-4">
                    {formatPrice(purchase.amount, purchase.currency)}
                  </div>
                  <p className="text-gray-600">
                    Purchased on {purchase.date.toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Subscription Active
                  </h3>
                  <p className="text-lg text-gray-700 mb-4">
                    Your <strong>{purchase.product}</strong> subscription is now active
                  </p>
                  <div className="text-lg font-semibold text-primary-blue mb-4 capitalize">
                    Status: {purchase.status.replace('_', ' ')}
                  </div>
                  <p className="text-gray-600">
                    Started on {purchase.date.toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto mb-12">
              <p className="text-xl text-gray-700">
                Your payment has been processed successfully. You should receive a confirmation email shortly.
              </p>
            </div>
          )}

          {/* Next Steps */}
          <div className="max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              What Happens Next?
            </h3>
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-primary-red mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">You'll receive a confirmation email with your receipt</span>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-primary-red mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Our team will begin working on your GEO audit within 24 hours</span>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-primary-red mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">You'll receive your comprehensive audit report within 3-5 business days</span>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-primary-red mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">A follow-up consultation will be scheduled to discuss your results</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/blog"
              className="inline-flex items-center px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Read Our Blog
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/newsletter"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Subscribe to Newsletter
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Questions About Your Purchase?
            </h3>
            <p className="text-gray-700 mb-4">
              Our team is here to help. If you have any questions about your GEO audit or need assistance, don't hesitate to reach out.
            </p>
            <p className="text-gray-600">
              We'll be in touch soon with your audit results and next steps.
            </p>
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
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SuccessPage;