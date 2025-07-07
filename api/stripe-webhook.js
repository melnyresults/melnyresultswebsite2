const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, stripe-signature');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        console.log('Payment successful for session:', session.id);
        console.log('Customer email:', session.customer_email);
        console.log('Amount paid:', session.amount_total / 100, session.currency.toUpperCase());
        
        // Here you can:
        // 1. Send confirmation email to customer
        // 2. Send notification to your team
        // 3. Store order in your database
        // 4. Trigger fulfillment process
        
        await handleSuccessfulPayment(session);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        console.log('Payment intent succeeded:', paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.log('Payment failed:', paymentIntent.id);
        
        // Handle failed payment
        await handleFailedPayment(paymentIntent);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

// Helper function to handle successful payments
async function handleSuccessfulPayment(session) {
  try {
    // Example: Send email notification
    console.log('Processing fulfillment for:', {
      sessionId: session.id,
      customerEmail: session.customer_email,
      amount: session.amount_total / 100,
      currency: session.currency,
      metadata: session.metadata
    });

    // You can integrate with email services like:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Resend
    
    // Example email notification to your team:
    await sendNotificationEmail({
      to: 'fulfillment@melnyresults.com',
      subject: 'New GEO Audit Order - Action Required',
      body: `
        New GEO Audit order received!
        
        Order Details:
        - Session ID: ${session.id}
        - Customer Email: ${session.customer_email}
        - Amount: $${session.amount_total / 100} ${session.currency.toUpperCase()}
        - Product: ${session.metadata?.product || 'GEO Visibility Audit'}
        - Source: ${session.metadata?.source || 'Unknown'}
        
        Please begin the audit process within 24 hours.
      `
    });

    // Example confirmation email to customer:
    await sendConfirmationEmail({
      to: session.customer_email,
      subject: 'Your GEO Audit Order Confirmation',
      body: `
        Thank you for your purchase!
        
        Your GEO Visibility Audit has been confirmed and we'll begin the process within 24 hours.
        
        You'll receive your detailed report within 3-5 business days.
        
        Order ID: ${session.id}
        Amount: $${session.amount_total / 100} ${session.currency.toUpperCase()}
        
        If you have any questions, please contact us at support@melnyresults.com
      `
    });

  } catch (error) {
    console.error('Error in fulfillment process:', error);
  }
}

// Helper function to handle failed payments
async function handleFailedPayment(paymentIntent) {
  try {
    console.log('Payment failed for:', paymentIntent.id);
    
    // You might want to:
    // 1. Send notification to your team
    // 2. Log the failure for analysis
    // 3. Send follow-up email to customer (if appropriate)
    
  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
}

// Placeholder email functions - replace with your email service
async function sendNotificationEmail({ to, subject, body }) {
  // Implement your email sending logic here
  console.log('Sending notification email:', { to, subject });
}

async function sendConfirmationEmail({ to, subject, body }) {
  // Implement your email sending logic here
  console.log('Sending confirmation email:', { to, subject });
}