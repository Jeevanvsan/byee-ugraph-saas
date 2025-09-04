import { supabase } from './supabase';
import { subscriptionService } from './subscriptionService';

// Cron job functions to trigger scheduled emails
export class EmailTriggers {
  // Check for trials expiring in 1 day and send notifications
  static async checkTrialExpirations(): Promise<void> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const { data: expiringTrials } = await supabase
      .from('subscriptions')
      .select('user_id, profiles(email, first_name, last_name)')
      .eq('status', 'trialing')
      .lte('current_period_end', tomorrow.toISOString());

    if (expiringTrials) {
      for (const trial of expiringTrials) {
        await subscriptionService.handleTrialExpired(trial.user_id);
      }
    }
  }

  // Check for payments due in 3 days and send reminders
  static async checkPaymentReminders(): Promise<void> {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    
    const { data: upcomingPayments } = await supabase
      .from('subscriptions')
      .select('user_id, profiles(email, first_name, last_name)')
      .eq('status', 'active')
      .lte('current_period_end', threeDaysFromNow.toISOString());

    if (upcomingPayments) {
      for (const payment of upcomingPayments) {
        await subscriptionService.sendPaymentReminder(payment.user_id);
      }
    }
  }
}