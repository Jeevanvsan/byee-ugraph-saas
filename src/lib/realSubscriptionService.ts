import { supabase } from './supabase';

export interface SubscriptionData {
  userId: string;
  product: string;
  plan: 'free' | 'pro' | 'enterprise';
  billingCycle: 'monthly' | 'annual';
}

class RealSubscriptionService {
  async createSubscription(data: SubscriptionData): Promise<void> {
    const planPrices = { free: 0, pro: 29, enterprise: 99 };
    const amount = data.billingCycle === 'annual' ? planPrices[data.plan] * 12 * 0.8 : planPrices[data.plan];

    // First, cancel any existing active subscription for this user
    await supabase
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('user_id', data.userId)
      .eq('status', 'active');

    const { error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: data.userId,
        product_id: data.product,
        plan: data.plan,
        status: data.plan === 'free' ? 'active' : 'trialing',
        billing_cycle: data.billingCycle,
        amount: amount,
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + (data.billingCycle === 'annual' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString()
      });

    if (error) throw error;

    // Update user's plan in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ plan: data.plan })
      .eq('id', data.userId);

    if (profileError) throw profileError;
  }

  async getUserSubscriptions(userId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}

export const realSubscriptionService = new RealSubscriptionService();