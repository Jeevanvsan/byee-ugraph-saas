import React, { useState, useEffect } from 'react';
import { Building, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { organizationService, OrganizationWithMembers } from '@/lib/organizationService';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';

export function OrganizationInfo() {
  const { user } = useAuthStore();
  const [organization, setOrganization] = useState<OrganizationWithMembers | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrganization();
  }, [user]);

  const loadOrganization = async () => {
    if (!user?.organization_id) {
      console.log('No organization_id found');
      setLoading(false);
      return;
    }

    console.log('Loading organization:', user.organization_id);
    try {
      // Use simple query directly
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', user.organization_id)
        .single();
        
      if (error) throw error;
      
      // Get member count separately
      const { count } = await supabase
        .from('organization_memberships')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', user.organization_id);
      
      console.log('Organization loaded:', data);
      setOrganization({ ...data, members: [], memberCount: count || 0 });
    } catch (error) {
      console.error('Failed to load organization:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading organization...</div>;
  }

  if (!organization) {
    return <div>No organization found</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2" />
            {organization.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Slug</p>
              <p className="font-mono">{organization.slug}</p>
            </div>
            
            {organization.description && (
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p>{organization.description}</p>
              </div>
            )}
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {(organization as any).memberCount || 0} members
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Created {new Date(organization.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}