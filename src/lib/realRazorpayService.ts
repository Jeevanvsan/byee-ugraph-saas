import { supabase } from './supabase';

declare global {
  interface Window {
    Razorpay: any;
  }
}

class RealRazorpayService {
  private razorpayKeyId: string;

  constructor() {
    this.razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
  }

  async processPayment(
    amount: number,
    productSlug: string,
    plan: string,
    billingCycle: string,
    userDetails: { name: string; email: string },
    organizationId?: string
  ): Promise<void> {
    try {
      console.log('=== STARTING PAYMENT PROCESS ===');
      console.log('Amount:', amount, 'Product:', productSlug, 'Plan:', plan);
      
      // Test Supabase connection first
      console.log('Testing Supabase connection...');
      
      // Create order via Supabase Edge Function
      console.log('Calling create-razorpay-order function...');
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount: amount * 100, currency: 'INR' }
      });

      console.log('Order response:', { orderData, orderError });
      
      if (orderError) {
        console.error('Order creation failed:', orderError);
        throw new Error('Failed to create order: ' + orderError.message);
      }
      
      if (!orderData?.order_id) {
        console.error('No order_id received:', orderData);
        throw new Error('Invalid order response');
      }

      console.log('Initializing Razorpay with order_id:', orderData.order_id);
      
      // Initialize Razorpay checkout
      const options = {
        key: this.razorpayKeyId,
        amount: amount * 100,
        currency: 'INR',
        name: 'Byee UGraph SaaS',
        description: `${plan} subscription for ${productSlug}`,
        order_id: orderData.order_id,
        handler: async (response: any) => {
          await this.handlePaymentSuccess(response, productSlug, plan, billingCycle, amount, organizationId);
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: () => {
            console.log('Payment cancelled');
          }
        }
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
    amount: number,
    organizationId?: string
  ): Promise<void> {
    try {
      // Verify payment via Supabase Edge Function
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

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      // Generate API key
      const { data: apiKey } = await supabase.rpc('generate_api_key');
      
      const subscriptionData = {
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
      };

      // Create subscription based on type
      if (organizationId) {
        const { error } = await supabase
          .from('organization_subscriptions')
          .insert({
            ...subscriptionData,
            organization_id: organizationId,
            product_slug: productSlug
          });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('subscriptions')
          .insert({
            ...subscriptionData,
            user_type: 'individual'
          });
        if (error) throw error;
      }

      // Show success and reload
      alert('Payment successful! Subscription activated.');
      window.location.reload();
    } catch (error) {
      console.error('Payment processing failed:', error);
      alert('Payment verification failed. Please contact support.');
    }
  }
}

export const realRazorpayService = new RealRazorpayService();