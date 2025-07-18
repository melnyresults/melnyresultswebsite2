import React, { useEffect, useRef } from 'react';
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
import GenerativeEngineOptimizationThanksPage from './components/GenerativeEngineOptimizationThanksPage';
import GenerativeEngineOptimizationNThanksPage from './components/GenerativeEngineOptimizationNThanksPage';
import BlogPublishConfirmation from './components/BlogPublishConfirmation';
import { usePageMeta } from './hooks/usePageMeta';

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

// Scroll animation hook
function useScrollAnimation() {
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section) => {
      section.classList.add('animate-on-scroll');
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);
}

function HomePage() {
  useScrollAnimation();
  
  usePageMeta({
    title: 'Melny Results - Online Marketing Agency',
    description: 'Melny Results is an online marketing agency that becomes your marketing department on-demand. More Growth. More Clients. Guaranteed.',
    keywords: 'marketing agency, digital marketing, lead generation, business growth, marketing strategy, guaranteed results',
    ogTitle: 'Melny Results - More Growth. More Clients. Guaranteed.',
    ogDescription: 'No contracts. No fluff. Just results — or you owe us nothing. Get your free growth plan today.',
  });
  
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
        <Route path="/generative-engine-optimization-guide-thanks" element={<GenerativeEngineOptimizationThanksPage />} />
        <Route path="/generative-engine-optimization-guide-nthanks" element={<GenerativeEngineOptimizationNThanksPage />} />
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
        <Route 
          path="/admin/posts/published/:id" 
          element={
            <ProtectedRoute>
              <BlogPublishConfirmation />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;