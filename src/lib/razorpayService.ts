import { supabase } from './supabase';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
}

class RazorpayService {
  private razorpayKey: string;

  constructor() {
    this.razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
  }

  async createOrder(amount: number, currency: string = 'INR'): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount: amount * 100, currency } // Razorpay expects amount in paise
      });

      if (error) throw error;
      return data.order_id;
    } catch (error) {
      throw new Error('Failed to create payment order');
    }
  }

  async processPayment(
    amount: number,
    productSlug: string,
    plan: string,
    billingCycle: string,
    userDetails: { name: string; email: string }
  ): Promise<void> {
    try {
      // Create order
      const orderId = await this.createOrder(amount);

      // Initialize Razorpay
      const options: RazorpayOptions = {
        key: this.razorpayKey,
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        name: 'Byee UGraph SaaS',
        description: `${plan} subscription for ${productSlug}`,
        order_id: orderId,
        handler: async (response: any) => {
          await this.handlePaymentSuccess(response, productSlug, plan, billingCycle, amount);
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
        },
        theme: {
          color: '#3B82F6',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      throw new Error('Failed to initialize payment');
    }
  }

  private async handlePaymentSuccess(
    response: any,
    productSlug: string,
    plan: string,
    billingCycle: string,
    amount: number
  ): Promise<void> {
    try {
      // Verify payment
      const { data: verificationResult, error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
        body: {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        }
      });

      if (verifyError || !verificationResult.verified) {
        throw new Error('Payment verification failed');
      }

      // Create subscription
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      const { data: apiKey } = await supabase.rpc('generate_api_key');
      
      const { error: subError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          plan: plan,
          status: 'active',
          billing_cycle: billingCycle,
          amount: amount,
          api_key: apiKey,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + (billingCycle === 'annual' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString()
        });

      if (subError) throw subError;

      // Show success message
      window.location.reload();
    } catch (error) {
      console.error('Payment processing failed:', error);
      throw error;
    }
  }
}

export const razorpayService = new RazorpayService();