import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import { BillingDashboard } from './BillingDashboard';

export function UserSubscriptions() {
  const { user } = useAuthStore();

  if (user?.organization_id) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            You are part of an organization. Contact your organization admin to manage subscriptions.
          </p>
        </CardContent>
      </Card>
    );
  }

  return <BillingDashboard />;
}