import React, { useState, useEffect } from 'react';
import { Plus, Mail, User, UserX, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';

export function UserManagement({ organizationId }: { organizationId: string }) {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: ''
  });

  useEffect(() => {
    loadUsers();
  }, [organizationId]);

  const loadUsers = async () => {
    try {
      // Get current user's membership to check role
      const { data: currentMembership } = await supabase
        .from('organization_memberships')
        .select('role')
        .eq('organization_id', organizationId)
        .eq('user_id', currentUser?.id)
        .single();

      // Get memberships first
      const { data: memberships, error: memberError } = await supabase
        .from('organization_memberships')
        .select('*')
        .eq('organization_id', organizationId);

      if (memberError) throw memberError;

      // Get profiles for each user
      const userIds = memberships?.map(m => m.user_id) || [];
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, is_active, created_at')
        .in('id', userIds);

      if (profileError) throw profileError;

      // Combine data
      const usersWithProfiles = memberships?.map(membership => ({
        ...membership,
        profile: profiles?.find(p => p.id === membership.user_id),
        currentUserRole: currentMembership?.role
      })) || [];

      setUsers(usersWithProfiles);
    } catch (error) {
      console.error('Load users error:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      // Validate password
      if (newUser.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: {
            first_name: newUser.firstName,
            last_name: newUser.lastName,
            full_name: `${newUser.firstName} ${newUser.lastName}`
          }
        }
      });

      console.log('Auth signup result:', { authData, authError });
      
      if (authError) {
        console.error('Auth error details:', authError);
        throw new Error(`Signup failed: ${authError.message}`);
      }
      if (!authData.user) throw new Error('Failed to create auth user');

      // Create or update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          email: newUser.email,
          first_name: newUser.firstName,
          last_name: newUser.lastName,
          organization_id: organizationId,
          role: 'user',
          plan: 'free',
          is_verified: false,
          is_active: true
        });

      if (profileError) throw profileError;

      // Add to organization
      const { error: memberError } = await supabase
        .from('organization_memberships')
        .insert({
          organization_id: organizationId,
          user_id: authData.user.id,
          role: 'member',
          status: 'active'
        });

      if (memberError) throw memberError;

      setAddUserOpen(false);
      setNewUser({ email: '', firstName: '', lastName: '', password: '' });
      loadUsers();
      
      toast({
        title: "Success",
        description: "User added to organization. They can sign up with this email to access the platform.",
      });
    } catch (error: any) {
      let message = "Failed to create user";
      if (error?.code === '23505') {
        message = "User with this email already exists";
      } else if (error instanceof Error) {
        message = error.message;
      }
      
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleToggleUserStatus = async (membershipId: string, userId: string, currentStatus: string, isProfile: boolean) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const newProfileStatus = newStatus === 'active';
      
      // Update membership status
      const { error: memberError } = await supabase
        .from('organization_memberships')
        .update({ status: newStatus })
        .eq('id', membershipId);

      if (memberError) throw memberError;

      // Update profile status
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_active: newProfileStatus })
        .eq('id', userId);

      if (profileError) {
        console.error('Failed to update profile:', profileError);
      }
      
      loadUsers();
      toast({
        title: "Success",
        description: `User ${newStatus === 'active' ? 'activated' : 'deactivated'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${currentStatus === 'active' ? 'deactivate' : 'activate'} user`,
        variant: "destructive",
      });
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Organization Users</CardTitle>
          <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <Label>First Name</Label>
                  <Input
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Minimum 6 characters"
                  />
                </div>
                <Button onClick={handleAddUser} className="w-full">
                  Add User
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No users in organization</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {member.profile?.first_name} {member.profile?.last_name}
                    </div>
                  </TableCell>
                  <TableCell>{member.profile?.email}</TableCell>
                  <TableCell>
                    <Badge variant={member.role === 'owner' ? 'default' : 'secondary'}>
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge variant={member.status === 'active' && member.profile?.is_active ? 'default' : 'destructive'}>
                        {member.status === 'active' && member.profile?.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(member.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {member.role !== 'owner' && (
                      <div className="flex space-x-2">
                        {/* Regular users can only deactivate */}
                        {member.currentUserRole === 'member' && member.status === 'active' && member.profile?.is_active && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleUserStatus(member.id, member.user_id, 'active', true)}
                            title="Deactivate user"
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        )}
                        {/* Admins can activate and deactivate */}
                        {(member.currentUserRole === 'admin' || member.currentUserRole === 'owner') && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleUserStatus(
                              member.id, 
                              member.user_id, 
                              member.status === 'active' && member.profile?.is_active ? 'active' : 'inactive',
                              true
                            )}
                            title={member.status === 'active' && member.profile?.is_active ? 'Deactivate user' : 'Activate user'}
                          >
                            {member.status === 'active' && member.profile?.is_active ? (
                              <UserX className="h-4 w-4" />
                            ) : (
                              <UserCheck className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}