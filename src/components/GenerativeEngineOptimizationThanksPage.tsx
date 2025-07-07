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
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
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
                  </script>

                  <stripe-buy-button
                    buy-button-id="buy_btn_1RHo9FRoGKTuFXtOtdkGb66F"
                    publishable-key="pk_live_51QnPa5RoGKTuFXtOojWjniXOxD6jfuTxdXQxnbuZNE9Hq14NJb9d8KMyUS6P0IaTm5WK9zt1qD685TvFFSbe01OI00JvtkwAlO"
                  >
                  </stripe-buy-button>
                </div>
              </div>
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