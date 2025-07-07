import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const signature = req.headers.get('stripe-signature')
    const body = await req.text()
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

    if (!signature || !webhookSecret) {
      throw new Error('Missing stripe signature or webhook secret')
    }

    // Initialize Stripe
    const stripe = new (await import('https://esm.sh/stripe@14.21.0')).default(
      Deno.env.get('STRIPE_SECRET_KEY') || '',
      {
        apiVersion: '2023-10-16',
        httpClient: Stripe.createFetchHttpClient(),
      }
    )

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any
        
        // Store order information
        const { error: orderError } = await supabase
          .from('stripe_orders')
          .insert({
            checkout_session_id: session.id,
            payment_intent_id: session.payment_intent,
            customer_id: session.customer,
            amount_subtotal: session.amount_subtotal,
            amount_total: session.amount_total,
            currency: session.currency,
            payment_status: session.payment_status,
            status: 'completed'
          })

        if (orderError) {
          console.error('Error storing order:', orderError)
        }

        // Send fulfillment email (you can customize this)
        await sendFulfillmentEmail(session)
        
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as any
        
        // Update order status if needed
        const { error: updateError } = await supabase
          .from('stripe_orders')
          .update({ payment_status: 'paid' })
          .eq('payment_intent_id', paymentIntent.id)

        if (updateError) {
          console.error('Error updating order:', updateError)
        }
        
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as any
        
        // Update order status
        const { error: updateError } = await supabase
          .from('stripe_orders')
          .update({ 
            payment_status: 'failed',
            status: 'canceled'
          })
          .eq('payment_intent_id', paymentIntent.id)

        if (updateError) {
          console.error('Error updating failed order:', updateError)
        }
        
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

// Helper function to send fulfillment email
async function sendFulfillmentEmail(session: any) {
  try {
    // You can integrate with your email service here
    // For now, we'll just log the fulfillment
    console.log('Fulfillment needed for session:', session.id)
    
    // Example: Send email notification to your team
    // await sendEmail({
    //   to: 'fulfillment@melnyresults.com',
    //   subject: 'New GEO Audit Order',
    //   body: `New order received: ${session.id}\nCustomer: ${session.customer_email}\nAmount: $${session.amount_total / 100}`
    // })
    
    return true
  } catch (error) {
    console.error('Error sending fulfillment email:', error)
    return false
  }
}