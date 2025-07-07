const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, successUrl, cancelUrl, customerEmail, metadata } = req.body;

    // Validate required fields
    if (!priceId || !successUrl || !cancelUrl) {
      return res.status(400).json({ 
        error: 'Missing required fields: priceId, successUrl, cancelUrl' 
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      metadata: metadata || {},
      payment_intent_data: {
        metadata: metadata || {},
      },
      // Add automatic tax calculation if needed
      automatic_tax: { enabled: false },
      // Add billing address collection
      billing_address_collection: 'required',
    });

    res.status(200).json({ 
      id: session.id, 
      url: session.url 
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to create checkout session' 
    });
  }
};