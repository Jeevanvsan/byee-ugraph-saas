import React, { useState, useEffect } from 'react';
import { Building, Users, CreditCard, Key } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateOrganization } from '@/components/CreateOrganization';
import { OrganizationInfo } from '@/components/OrganizationInfo';
import { UserManagement } from '@/components/UserManagement';
import { ProductSubscriptions } from '@/components/ProductSubscriptions';
import { useAuthStore } from '@/stores/authStore';

export function OrgAdminDashboard() {
  const { user, refreshUser } = useAuthStore();
  const [hasOrganization, setHasOrganization] = useState(!!user?.organization_id);

  useEffect(() => {
    setHasOrganization(!!user?.organization_id);
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Organization Dashboard
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue={hasOrganization ? "users" : "organization"}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="organization">
              <Building className="h-4 w-4 mr-2" />
              Organization
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="subscriptions">
              <CreditCard className="h-4 w-4 mr-2" />
              Subscriptions
            </TabsTrigger>
            <TabsTrigger value="api-keys">
              <Key className="h-4 w-4 mr-2" />
              API Keys
            </TabsTrigger>
          </TabsList>

          <TabsContent value="organization">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  {hasOrganization ? 'Organization Settings' : 'Create Organization'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <button onClick={refreshUser} className="px-4 py-2 bg-blue-500 text-white rounded">
                    Refresh User Data
                  </button>
                  <p className="text-sm mt-2">User org ID: {user?.organization_id || 'None'}</p>
                </div>
                {hasOrganization ? (
                  <OrganizationInfo />
                ) : (
                  <CreateOrganization onSuccess={async () => {
                    await refreshUser();
                    setHasOrganization(true);
                  }} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            {hasOrganization ? (
              <UserManagement organizationId={user?.organization_id || ''} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Organization Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Create an organization first to manage users.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="subscriptions">
            {hasOrganization ? (
              <ProductSubscriptions organizationId={user?.organization_id || ''} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Subscriptions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Create an organization first to manage subscriptions.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="api-keys">
            <Card>
              <CardHeader>
                <CardTitle>API Key Management</CardTitle>
              </CardHeader>
              <CardContent>
                {hasOrganization ? (
                  <p className="text-muted-foreground">
                    API keys are automatically generated when you subscribe to products. 
                    Check the Subscriptions tab to manage your API keys.
                  </p>
                ) : (
                  <p className="text-muted-foreground">Create an organization first to get API keys.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}