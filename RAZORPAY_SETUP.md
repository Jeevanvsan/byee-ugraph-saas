# Razorpay Integration Setup

## 1. Environment Variables

Test card : 4718 6091 0820 4366

Add to your `.env.local` file:

```env
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

## 2. Supabase Edge Functions

Deploy the edge functions:

```bash
supabase functions deploy create-razorpay-order
supabase functions deploy verify-razorpay-payment
```

Set environment variables in Supabase:

```bash
supabase secrets set RAZORPAY_KEY_ID=rzp_test_your_key_id
supabase secrets set RAZORPAY_KEY_SECRET=your_key_secret
```

## 3. Database Function

Create the `generate_api_key` function in Supabase:

```sql
CREATE OR REPLACE FUNCTION generate_api_key()
RETURNS TEXT AS $$
BEGIN
  RETURN 'sk_' || encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql;
```

## 4. Test Payment Flow

1. Go to subscription page
2. Click "Subscribe Pro" or "Subscribe Enterprise"
3. Razorpay checkout will open
4. Use test card: 4111 1111 1111 1111
5. Any future date for expiry
6. Any CVV
7. Payment will be processed and subscription created

## 5. Webhook (Optional)

For production, set up Razorpay webhook to handle payment failures and subscription updates.