import { supabase } from './supabase';
import { emailService } from './emailService';

class SubscriptionService {
  async handlePaymentSuccess(userId: string, amount: number): Promise<void> {
    // Update subscription status
    const { error } = await supabase
      .from('subscriptions')
      .update({ 
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      })
      .eq('user_id', userId);

    if (error) throw error;

    // Send payment success email
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, first_name, last_name')
      .eq('id', userId)
      .single();

    if (profile) {
      await emailService.sendEmail('payment_success', profile.email, `${profile.first_name} ${profile.last_name}`);
    }
  }

  async handlePaymentFailed(userId: string): Promise<void> {
    // Update subscription status
    const { error } = await supabase
      .from('subscriptions')
      .update({ status: 'past_due' })
      .eq('user_id', userId);

    if (error) throw error;

    // Send payment failed email
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, first_name, last_name')
      .eq('id', userId)
      .single();

    if (profile) {
      await emailService.sendEmail('payment_failed', profile.email, `${profile.first_name} ${profile.last_name}`);
    }
  }

  async sendPaymentReminder(userId: string): Promise<void> {
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, first_name, last_name')
      .eq('id', userId)
      .single();

    if (profile) {
      await emailService.sendEmail('payment_reminder', profile.email, `${profile.first_name} ${profile.last_name}`);
    }
  }

  async handleTrialExpired(userId: string): Promise<void> {
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, first_name, last_name')
      .eq('id', userId)
      .single();

    if (profile) {
      await emailService.sendEmail('trial_expired', profile.email, `${profile.first_name} ${profile.last_name}`);
    }
  }
}

export const subscriptionService = new SubscriptionService();