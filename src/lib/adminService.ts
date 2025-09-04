import { supabase } from './supabase';
import { Product } from './productsService';
import { emailService } from './emailService';
import { ContactSubmission } from './contactService';

export interface AdminStats {
  totalUsers: number;
  proUsers: number;
  trialingUsers: number;
  mrr: number;
}

export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  plan: 'free' | 'pro' | 'enterprise';
  isVerified: boolean;
  createdAt: string;
  subscriptionStatus?: string;
}

class AdminService {
  async getAdminStats(): Promise<AdminStats> {
    const [totalUsers, proUsers, trialingUsers, subscriptions] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }).neq('role', 'admin'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('plan', 'pro').neq('role', 'admin'),
      supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'trialing'),
      supabase.from('subscriptions').select('amount').eq('status', 'active')
    ]);

    const mrr = subscriptions.data?.reduce((sum, sub) => sum + (sub.amount || 0), 0) || 0;

    return {
      totalUsers: totalUsers.count || 0,
      proUsers: proUsers.count || 0,
      trialingUsers: trialingUsers.count || 0,
      mrr
    };
  }

  async getAllUsers(): Promise<UserData[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id, email, first_name, last_name, plan, is_verified, created_at,
        subscriptions(status)
      `)
      .neq('role', 'admin')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      plan: user.plan,
      isVerified: user.is_verified,
      createdAt: user.created_at,
      subscriptionStatus: user.subscriptions?.[0]?.status
    }));
  }

  async updateUserPlan(userId: string, plan: 'free' | 'pro' | 'enterprise'): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ plan })
      .eq('id', userId);

    if (error) throw error;

    // Update or create subscription
    const { error: subError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        plan,
        status: 'active',
        billing_cycle: 'monthly',
        amount: plan === 'pro' ? 29 : plan === 'enterprise' ? 99 : 0,
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });

    if (subError) throw subError;

    // Send email if upgraded to Pro
    if (plan === 'pro') {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, first_name, last_name')
        .eq('id', userId)
        .single();
      
      if (profile) {
        await emailService.sendEmail('admin_grant_pro', profile.email, `${profile.first_name} ${profile.last_name}`);
      }
    }
  }

  async createAdmin(email: string, password: string, firstName: string, lastName: string): Promise<void> {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { first_name: firstName, last_name: lastName, role: 'admin' }
    });

    if (error) throw error;

    // Update profile with admin role
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', data.user.id);

    if (profileError) throw profileError;
  }

  async sendEmail(userId: string, type: 'onboarding' | 'invoice'): Promise<void> {
    // Mock email sending - in real app, integrate with email service
    const { error } = await supabase
      .from('email_logs')
      .insert({
        user_id: userId,
        email_type: type,
        recipient_email: 'user@example.com',
        subject: type === 'onboarding' ? 'Welcome to Byee.in' : 'Invoice',
        status: 'sent'
      });

    if (error) throw error;
  }

  async getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    const { error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  }

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
    const { error } = await supabase
      .from('products')
      .insert(product);

    if (error) throw error;
  }
}

export const adminService = new AdminService();