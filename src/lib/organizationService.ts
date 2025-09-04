import { supabase } from './supabase';
import { Database } from '@/types/database';

export type Organization = Database['public']['Tables']['organizations']['Row'];
export type OrganizationMembership = Database['public']['Tables']['organization_memberships']['Row'];

export interface OrganizationWithMembers extends Organization {
  members: (OrganizationMembership & {
    user: {
      id: string;
      email: string;
      first_name: string;
      last_name: string;
    };
  })[];
}

class OrganizationService {
  async createOrganization(name: string, slug: string, description?: string): Promise<Organization> {
    const { data, error } = await supabase
      .from('organizations')
      .insert({
        name,
        slug,
        description,
        created_by: (await supabase.auth.getUser()).data.user!.id
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    const userId = (await supabase.auth.getUser()).data.user!.id;
    
    // Add creator as owner
    await supabase
      .from('organization_memberships')
      .insert({
        organization_id: data.id,
        user_id: userId,
        role: 'owner'
      });

    // Update user's organization_id
    await supabase
      .from('profiles')
      .update({ organization_id: data.id })
      .eq('id', userId);

    return data;
  }

  async getOrganizations(): Promise<Organization[]> {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  async getOrganizationWithMembers(orgId: string): Promise<OrganizationWithMembers> {
    const { data, error } = await supabase
      .from('organizations')
      .select(`
        *,
        members:organization_memberships(
          *,
          user:profiles(id, email, first_name, last_name)
        )
      `)
      .eq('id', orgId)
      .single();

    if (error) throw new Error(error.message);
    return data as OrganizationWithMembers;
  }

  async addUserToOrganization(orgId: string, email: string, firstName: string, lastName: string, password: string): Promise<void> {
    // For now, we'll create a placeholder user entry
    // In production, this would integrate with your user creation system
    const userId = crypto.randomUUID();
    
    // Create profile entry
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email,
        first_name: firstName,
        last_name: lastName,
        organization_id: orgId,
        role: 'user'
      });

    if (profileError) throw new Error(profileError.message);

    // Add to organization
    const { error: memberError } = await supabase
      .from('organization_memberships')
      .insert({
        organization_id: orgId,
        user_id: userId,
        role: 'member'
      });

    if (memberError) throw new Error(memberError.message);
  }

  async updateMemberRole(membershipId: string, role: 'owner' | 'admin' | 'member'): Promise<void> {
    const { error } = await supabase
      .from('organization_memberships')
      .update({ role })
      .eq('id', membershipId);

    if (error) throw new Error(error.message);
  }

  async removeMember(membershipId: string): Promise<void> {
    const { error } = await supabase
      .from('organization_memberships')
      .delete()
      .eq('id', membershipId);

    if (error) throw new Error(error.message);
  }
}

export const organizationService = new OrganizationService();