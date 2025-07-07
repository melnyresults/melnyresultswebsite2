import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

export interface CheckoutSessionData {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}

export const createCheckoutSession = async (data: CheckoutSessionData) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const session = await response.json();
    return { sessionId: session.id, error: null };
  } catch (error) {
    return { sessionId: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const redirectToCheckout = async (sessionId: string) => {
  const stripe = await stripePromise;
  
  if (!stripe) {
    throw new Error('Stripe failed to load');
  }

  const { error } = await stripe.redirectToCheckout({
    sessionId,
  });

  if (error) {
    throw error;
  }
};

export const handleGEOAuditCheckout = async (customerEmail?: string) => {
  try {
    // Create checkout session
    const { sessionId, error } = await createCheckoutSession({
      priceId: 'price_geo_audit_997', // Replace with your actual price ID
      successUrl: `${window.location.origin}/geo-audit-success`,
      cancelUrl: `${window.location.origin}/generative-engine-optimization-guide-thanks`,
      customerEmail,
      metadata: {
        product: 'GEO Visibility Audit',
        source: 'GEO Guide Thank You Page'
      }
    });

    if (error) {
      throw new Error(error);
    }

    if (sessionId) {
      await redirectToCheckout(sessionId);
    }
  } catch (error) {
    console.error('Checkout error:', error);
    throw error;
  }
};

export default stripePromise;