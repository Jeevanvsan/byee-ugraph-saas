import React, { useState, useEffect } from 'react';
import { Building, Users, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrganizationSubscriptions } from '@/components/OrganizationSubscriptions';
import { CreateOrganization } from '@/components/CreateOrganization';
import { organizationService, OrganizationWithMembers } from '@/lib/organizationService';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/hooks/use-toast';

export function OrganizationDashboard() {
  const { user } = useAuthStore();
  const [organization, setOrganization] = useState<OrganizationWithMembers | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'owner' | 'admin' | 'member'>('member');

  useEffect(() => {
    if (user?.role === 'owner') {
      if (user.organization_id) {
        loadOrganization();
      } else {
        setLoading(false); // Owner without org - show create org option
      }
    } else if (user?.organization_id) {
      loadOrganization();
    }
  }, [user]);

  const loadOrganization = async () => {
    if (!user?.organization_id) return;

    try {
      const data = await organizationService.getOrganizationWithMembers(user.organization_id);
      setOrganization(data);
      
      // Find user's role in the organization
      const membership = data.members.find(m => m.user_id === user.id);
      if (membership) {
        setUserRole(membership.role);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load organization",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!organization) {
    // If user is owner role, show create organization option
    if (user?.role === 'owner') {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create Your Organization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                As an organization admin, you can create and manage your organization.
              </p>
              <CreateOrganization onSuccess={() => window.location.reload()} />
            </CardContent>
          </Card>
        </div>
      );
    }
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Organization</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You are not a member of any organization. Contact your administrator to get access.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOrgAdmin = userRole === 'owner' || userRole === 'admin';
  const isOrgUser = userRole === 'member';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {organization.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                Role: {userRole} • {organization.members.length} members
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview">
          <TabsList className={`grid w-full ${isOrgAdmin ? 'grid-cols-3' : 'grid-cols-2'}`}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {isOrgAdmin && <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>}
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Organization</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{organization.name}</div>
                  <p className="text-xs text-muted-foreground">
                    {organization.description || 'No description'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{organization.members.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Active members
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Your Role</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold capitalize">{userRole}</div>
                  <p className="text-xs text-muted-foreground">
                    {isOrgAdmin ? 'Can manage subscriptions' : 'View only access'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {isOrgAdmin && (
            <TabsContent value="subscriptions">
              <OrganizationSubscriptions 
                organizationId={organization.id} 
                isAdmin={isOrgAdmin}
              />
            </TabsContent>
          )}

          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Organization Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {organization.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">
                          {member.user.first_name} {member.user.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {member.user.email}
                        </div>
                      </div>
                      <div className="text-sm font-medium capitalize">
                        {member.role}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}