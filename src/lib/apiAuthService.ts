import { supabase } from './supabase';
import { Database } from '@/types/database';

export type OrganizationSubscription = Database['public']['Tables']['organization_subscriptions']['Row'];

export interface ApiAuthResponse {
  valid: boolean;
  organization_id?: string;
  product_slug?: string;
  plan?: string;
  status?: string;
  expires_at?: string;
}

class ApiAuthService {
  // Validate API key for external products (like Orrery)
  async validateApiKey(apiKey: string, productSlug: string): Promise<ApiAuthResponse> {
    try {
      // Check organization subscriptions first
      const { data: orgData } = await supabase
        .from('organization_subscriptions')
        .select('*')
        .eq('api_key', apiKey)
        .eq('product_slug', productSlug)
        .single();

      if (orgData && orgData.status === 'active' && new Date() <= new Date(orgData.current_period_end)) {
        return {
          valid: true,
          organization_id: orgData.organization_id,
          product_slug: orgData.product_slug,
          plan: orgData.plan,
          status: orgData.status,
          expires_at: orgData.current_period_end
        };
      }

      // Check individual subscriptions
      const { data: userSub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('api_key', apiKey)
        .single();

      if (userSub && userSub.status === 'active' && new Date() <= new Date(userSub.current_period_end)) {
        return {
          valid: true,
          plan: userSub.plan,
          status: userSub.status,
          expires_at: userSub.current_period_end
        };
      }

      return { valid: false };
    } catch (error) {
      return { valid: false };
    }
  }

  // Create subscription and generate API key
  async createSubscription(
    organizationId: string,
    productSlug: string,
    plan: 'free' | 'pro' | 'enterprise',
    billingCycle: 'monthly' | 'annual',
    amount: number
  ): Promise<OrganizationSubscription> {
    // Generate API key
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .rpc('generate_api_key');

    if (apiKeyError) throw new Error(apiKeyError.message);

    const { data, error } = await supabase
      .from('organization_subscriptions')
      .insert({
        organization_id: organizationId,
        product_slug: productSlug,
        plan,
        billing_cycle: billingCycle,
        amount,
        api_key: apiKeyData,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // Get organization subscriptions
  async getOrganizationSubscriptions(organizationId: string): Promise<OrganizationSubscription[]> {
    const { data, error } = await supabase
      .from('organization_subscriptions')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  // Update subscription status (for payment failures, cancellations)
  async updateSubscriptionStatus(
    subscriptionId: string,
    status: 'active' | 'cancelled' | 'expired' | 'trialing'
  ): Promise<void> {
    const { error } = await supabase
      .from('organization_subscriptions')
      .update({ status })
      .eq('id', subscriptionId);

    if (error) throw new Error(error.message);
  }

  // Regenerate API key
  async regenerateApiKey(subscriptionId: string): Promise<string> {
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .rpc('generate_api_key');

    if (apiKeyError) throw new Error(apiKeyError.message);

    const { error } = await supabase
      .from('organization_subscriptions')
      .update({ api_key: apiKeyData })
      .eq('id', subscriptionId);

    if (error) throw new Error(error.message);
    return apiKeyData;
  }
}

export const apiAuthService = new ApiAuthService();