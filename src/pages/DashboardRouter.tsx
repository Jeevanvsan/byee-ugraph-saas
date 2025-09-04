import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import { getUserType } from '@/lib/userUtils';
import { AdminDashboard } from './AdminDashboard';
import { OrgAdminDashboard } from './OrgAdminDashboard';
import { OrganizationDashboard } from './OrganizationDashboard';
import { UserDashboard } from './UserDashboard';
import { ProductsOnlyDashboard } from './ProductsOnlyDashboard';

export function DashboardRouter() {
  const { user } = useAuthStore();
  const userType = getUserType(user);

  switch (userType) {
    case 'website_admin':
      return <AdminDashboard />;
    case 'org_admin':
      return <OrgAdminDashboard />;
    case 'org_user':
      return <ProductsOnlyDashboard />;
    case 'individual_user':
      return <UserDashboard />;
    default:
      return <div>Please log in</div>;
  }
}