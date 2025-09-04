import { supabase } from './supabase';

export interface CompanyStats {
  activeUsers: number;
  projectsDeployed: number;
  countriesServed: number;
  teamMembers: number;
}

class StatsService {
  async getCompanyStats(): Promise<CompanyStats> {
    try {
      // Get active users count
      const { count: activeUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .neq('role', 'admin');

      // Get total projects/workflows deployed
      const { count: projectsDeployed } = await supabase
        .from('workflows')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');

      // Mock countries served (in real app, this could come from user location data)
      const countriesServed = Math.max(0, Math.floor((activeUsers || 0) / 50));

      return {
        activeUsers: activeUsers || 0,
        projectsDeployed: projectsDeployed || 0,
        countriesServed,
        teamMembers: 0 // Static team size
      };
    } catch (error) {
      // Fallback to mock data if database is not available
      return {
        activeUsers: 0,
        projectsDeployed: 0,
        countriesServed: 0,
        teamMembers: 0
      };
    }
  }
}

export const statsService = new StatsService();