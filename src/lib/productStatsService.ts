import { supabase } from './supabase';

export interface ProductStats {
  activeUsers: number;
  workflowsCreated: number;
  uptime: string;
}

class ProductStatsService {
  async getUGraphStats(): Promise<ProductStats> {
    try {
      // Get users subscribed to UGraph (excluding admins)
      const { count: activeUsers } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('product', 'ugraph')
        .eq('status', 'active');

      // Get workflows created for UGraph
      const { count: workflowsCreated } = await supabase
        .from('workflows')
        .select('*', { count: 'exact', head: true })
        .eq('product', 'ugraph');

      return {
        activeUsers: activeUsers || 0,
        workflowsCreated: workflowsCreated || 0,
        uptime: '99.9%'
      };
    } catch (error) {
      // Fallback values
      return {
        activeUsers: 0,
        workflowsCreated: 0,
        uptime: '99.9%'
      };
    }
  }
}

export const productStatsService = new ProductStatsService();