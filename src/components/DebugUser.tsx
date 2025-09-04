import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import { getUserType } from '@/lib/userUtils';

export function DebugUser() {
  const { user } = useAuthStore();
  const userType = getUserType(user);

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
      <h3 className="font-bold">Debug User Info:</h3>
      <p>Role: {user?.role}</p>
      <p>Organization ID: {user?.organization_id || 'None'}</p>
      <p>User Type: {userType}</p>
      <p>Email: {user?.email}</p>
    </div>
  );
}