import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, currency = 'INR', interval, period, product_slug, plan } = await req.json()
    
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')!
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')!
    
    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`)

    console.log('Creating Razorpay subscription plan...')

    // Create subscription plan
    const planResponse = await fetch('https://api.razorpay.com/v1/plans', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        period: 'monthly',
        interval: interval,
        item: {
          name: `${product_slug} ${plan} plan`,
          amount: amount,
          currency: currency,
        },
      }),
    })

    const planData = await planResponse.json()
    
    if (!planResponse.ok) {
      throw new Error(`Plan creation failed: ${planData.error?.description}`)
    }

    // Create subscription
    const subscriptionResponse = await fetch('https://api.razorpay.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan_id: planData.id,
        customer_notify: 1,
        total_count: 12, // 12 months for annual, will be overridden for monthly
        notes: {
          product_slug: product_slug,
          plan: plan
        }
      }),
    })

    const subscription = await subscriptionResponse.json()
    
    if (!subscriptionResponse.ok) {
      throw new Error(`Subscription creation failed: ${subscription.error?.description}`)
    }
    
    return new Response(
      JSON.stringify({ 
        subscription_id: subscription.id,
        plan_id: planData.id 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Subscription creation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})