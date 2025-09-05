import React from 'react';
import { OrgBillingDashboard } from './OrgBillingDashboard';



export function ProductSubscriptions({ organizationId }: { organizationId: string }) {
  return <OrgBillingDashboard organizationId={organizationId} />;
}