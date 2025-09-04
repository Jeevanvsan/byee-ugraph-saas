import { AuthUser } from './auth';

export const getUserType = (user: AuthUser | null, isWebsiteAdmin: boolean = false) => {
  if (!user) return 'guest';
  
  if (isWebsiteAdmin) return 'website_admin';
  if (user.role === 'owner') return 'org_admin';
  if (user.organization_id) return 'org_user';
  return 'individual_user';
};

export const canManageOrganizations = (isWebsiteAdmin: boolean) => {
  return isWebsiteAdmin;
};

export const canManageSubscriptions = (user: AuthUser | null) => {
  return !user?.organization_id; // Individual users only
};

export const canManageOrgSubscriptions = (userOrgRole: string) => {
  return userOrgRole === 'owner' || userOrgRole === 'admin';
};

export const canAccessProducts = (user: AuthUser | null) => {
  return !!user; // All logged in users can access products
};