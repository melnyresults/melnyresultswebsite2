import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import ValueProposition from './components/ValueProposition';
import FeaturesSection from './components/FeaturesSection';
import TestimonialsSection from './components/TestimonialsSection';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import CloserPage from './components/CloserPage';
import CloserThankYouPage from './components/CloserThankYouPage';
import BlogPage from './components/BlogPage';
import BlogPostPage from './components/BlogPostPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import FreeMarketingAnalysisPage from './components/FreeMarketingAnalysisPage';
import ThankYouConsultPage from './components/ThankYouConsultPage';
import NewsletterPage from './components/NewsletterPage';
import NewsletterThankYouPage from './components/NewsletterThankYouPage';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import PostEditor from './components/PostEditor';
import ProtectedRoute from './components/ProtectedRoute';
import GenerativeEngineOptimizationPage from './components/GenerativeEngineOptimizationPage';

// Component to handle scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
}

function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <ValueProposition />
      <FeaturesSection />
      <TestimonialsSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/closer" element={<CloserPage />} />
        <Route path="/closer/thank-you" element={<CloserThankYouPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/free-marketing-analysis" element={<FreeMarketingAnalysisPage />} />
        <Route path="/thankyou-consult" element={<ThankYouConsultPage />} />
        <Route path="/newsletter" element={<NewsletterPage />} />
        <Route path="/newsletter/thank-you" element={<NewsletterThankYouPage />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/generative-engine-optimization-guide" element={<GenerativeEngineOptimizationPage />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/posts/new" 
          element={
            <ProtectedRoute>
              <PostEditor />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/posts/edit/:id" 
          element={
            <ProtectedRoute>
              <PostEditor />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;