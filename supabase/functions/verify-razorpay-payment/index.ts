import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createHmac } from "https://deno.land/std@0.168.0/crypto/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()
    
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')!
    
    const body = razorpay_order_id + "|" + razorpay_payment_id
    
    const expectedSignature = await createHmac("sha256", razorpayKeySecret)
      .update(body)
      .digest("hex")
    
    const verified = expectedSignature === razorpay_signature
    
    return new Response(
      JSON.stringify({ verified }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message, verified: false }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})