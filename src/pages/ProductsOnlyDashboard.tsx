import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';

export function ProductsOnlyDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Products Dashboard
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Available Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold">UGraph</h3>
                <p className="text-sm text-muted-foreground">Visual AI workflow builder</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold">SecureFlow</h3>
                <p className="text-sm text-muted-foreground">Enterprise security</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold">AI Connect</h3>
                <p className="text-sm text-muted-foreground">AI model integration</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm">
                You are part of an organization. Contact your organization admin to manage subscriptions and API access.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}