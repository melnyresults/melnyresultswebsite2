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
3. **Copy Price ID**: Copy the price ID (starts with `price_`) and add it to your `.env` file
4. **Get API Keys**: Copy your publishable and secret keys from the API keys section

### 3. Webhook Configuration

1. **Create Webhook**: In Stripe Dashboard, go to Webhooks and create a new endpoint
2. **Set URL**: Point it to `https://yourdomain.com/api/stripe-webhook`
3. **Select Events**: Choose these events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. **Copy Secret**: Copy the webhook signing secret and add it to your `.env` file

### 4. Deployment Options

#### Option A: Vercel (Recommended)
1. Deploy to Vercel
2. Add environment variables in Vercel dashboard
3. The API routes will automatically work

#### Option B: Netlify
1. Deploy to Netlify
2. Add environment variables in Netlify dashboard
3. The functions will be available at `/.netlify/functions/`

#### Option C: Custom Server
1. Deploy the API folder to any Node.js hosting service
2. Update the API URLs in `src/lib/stripe.ts` to point to your server

### 5. Testing

1. Use Stripe test mode with test cards
2. Test card: `4242 4242 4242 4242`
3. Use any future expiry date and any 3-digit CVC

### 6. Going Live

1. Switch to live mode in Stripe Dashboard
2. Update environment variables with live keys
3. Update webhook URL to production domain
4. Test with real payment methods

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
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