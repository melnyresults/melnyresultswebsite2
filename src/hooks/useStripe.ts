import { useState } from 'react';
import { useAuth } from './useAuth';

interface CheckoutSessionRequest {
  priceId: string;
  mode: 'payment' | 'subscription';
  successUrl?: string;
  cancelUrl?: string;
}

interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export const useStripe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const createCheckoutSession = async ({
    priceId,
    mode,
    successUrl = `${window.location.origin}/success`,
    cancelUrl = `${window.location.origin}/cancel`,
  }: CheckoutSessionRequest): Promise<CheckoutSessionResponse | null> => {
    if (!user) {
      setError('User must be authenticated to create checkout session');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Since Supabase functions are no longer available, return an error
      throw new Error('Stripe checkout is not available without a backend service');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const redirectToCheckout = async (checkoutRequest: CheckoutSessionRequest) => {
    const session = await createCheckoutSession(checkoutRequest);
    
    if (session?.url) {
      window.location.href = session.url;
    }
  };

  return {
    createCheckoutSession,
    redirectToCheckout,
    loading,
    error,
  };
};