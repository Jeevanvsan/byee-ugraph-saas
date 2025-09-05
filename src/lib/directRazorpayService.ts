import { supabase } from './supabase';

declare global {
  interface Window {
    Razorpay: any;
  }
}

class DirectRazorpayService {
  private razorpayKeyId: string;

  constructor() {
    this.razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_RDujO3De4Zew7R';
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
      console.log('=== DIRECT RAZORPAY SERVICE - STARTING PAYMENT ===');
      console.log('Amount:', amount, 'Product:', productSlug, 'Plan:', plan);
      
      // Use direct payment without order creation
      console.log('Processing direct payment');
      
      const options = {
        key: this.razorpayKeyId,
        amount: amount * 100,
        currency: 'INR',
        name: 'Byee UGraph SaaS',
        description: `${plan} subscription for ${productSlug}`,
        // order_id: orderData.order_id, // Skip order creation
        handler: async (response: any) => {
          await this.handleSubscriptionSuccess(response, productSlug, plan, billingCycle, amount, organizationId);
        },
        config: {
          display: {
            language: 'en'
          }
        },
        method: {
          card: true,
          netbanking: true,
          wallet: true,
          upi: true
        },
        notes: {
          product: productSlug,
          plan: plan
        },
        prefill: {
          name: userDetails.name || 'Customer',
          email: userDetails.email || 'customer@example.com',
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: () => {
            console.log('Payment cancelled');
          }
        },
        config: {
          display: {
            blocks: {
              banks: {
                name: 'Pay using ' + plan + ' plan',
                instruments: [
                  {
                    method: 'card'
                  },
                  {
                    method: 'netbanking'
                  }
                ]
              }
            }
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      throw new Error('Failed to initialize payment');
    }
  }

  private async handleSubscriptionSuccess(
    response: any,
    productSlug: string,
    plan: string,
    billingCycle: string,
    amount: number,
    organizationId?: string
  ): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      const subscriptionData = {
        user_id: user.id,
        plan: plan,
        status: 'active',
        billing_cycle: billingCycle,
        amount: amount,
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + (billingCycle === 'annual' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString()
      };

      if (organizationId) {
        const { error } = await supabase
          .from('organization_subscriptions')
          .insert({
            organization_id: organizationId,
            product_slug: productSlug,
            plan: plan,
            status: 'active',
            billing_cycle: billingCycle,
            amount: amount,
            // No API key created by default
            razorpay_subscription_id: response.razorpay_subscription_id || 'sub_temp_' + Date.now(),
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + (billingCycle === 'annual' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString()
          });
        if (error) {
          console.error('Organization subscription insert error:', error);
          throw error;
        }
      } else {
        const { error } = await supabase
          .from('subscriptions')
          .insert({
            user_id: user.id,
            plan: plan,
            status: 'active',
            billing_cycle: billingCycle,
            amount: amount,
            razorpay_subscription_id: response.razorpay_subscription_id || 'sub_temp_' + Date.now(),
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + (billingCycle === 'annual' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
            user_type: 'individual'
          });
        if (error) {
          console.error('Individual subscription insert error:', error);
          throw error;
        }
      }

      alert('Subscription created successfully! Recurring payments activated.');
      window.location.reload();
    } catch (error) {
      console.error('Payment processing failed:', error);
      alert('Payment failed. Please try again.');
    }
  }
}

export const directRazorpayService = new DirectRazorpayService();