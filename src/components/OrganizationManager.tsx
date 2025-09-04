import React, { useState, useEffect } from 'react';
import { Plus, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { organizationService, Organization, OrganizationWithMembers } from '@/lib/organizationService';
import { toast } from '@/hooks/use-toast';

export function OrganizationManager() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<OrganizationWithMembers | null>(null);
  const [loading, setLoading] = useState(true);
  const [createOrgOpen, setCreateOrgOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  
  const [newOrg, setNewOrg] = useState({ name: '', slug: '', description: '' });
  const [newUser, setNewUser] = useState({ email: '', firstName: '', lastName: '', password: '' });

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      const data = await organizationService.getOrganizations();
      setOrganizations(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load organizations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadOrganizationDetails = async (orgId: string) => {
    try {
      const data = await organizationService.getOrganizationWithMembers(orgId);
      setSelectedOrg(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load organization details",
        variant: "destructive",
      });
    }
  };

  const handleCreateOrganization = async () => {
    try {
      await organizationService.createOrganization(newOrg.name, newOrg.slug, newOrg.description);
      setNewOrg({ name: '', slug: '', description: '' });
      setCreateOrgOpen(false);
      loadOrganizations();
      toast({
        title: "Success",
        description: "Organization created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create organization",
        variant: "destructive",
      });
    }
  };

  const handleAddUser = async () => {
    if (!selectedOrg) return;
    
    try {
      await organizationService.addUserToOrganization(
        selectedOrg.id,
        newUser.email,
        newUser.firstName,
        newUser.lastName,
        newUser.password
      );
      setNewUser({ email: '', firstName: '', lastName: '', password: '' });
      setAddUserOpen(false);
      loadOrganizationDetails(selectedOrg.id);
      toast({
        title: "Success",
        description: "User added to organization successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add user",
        variant: "destructive",
      });
    }
  };

  const handleRoleChange = async (membershipId: string, role: 'owner' | 'admin' | 'member') => {
    try {
      await organizationService.updateMemberRole(membershipId, role);
      if (selectedOrg) {
        loadOrganizationDetails(selectedOrg.id);
      }
      toast({
        title: "Success",
        description: "Member role updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update member role",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Organization Management</h2>
        <Dialog open={createOrgOpen} onOpenChange={setCreateOrgOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Organization
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Organization</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Organization Name</Label>
                <Input
                  id="name"
                  value={newOrg.name}
                  onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={newOrg.slug}
                  onChange={(e) => setNewOrg({ ...newOrg, slug: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newOrg.description}
                  onChange={(e) => setNewOrg({ ...newOrg, description: e.target.value })}
                />
              </div>
              <Button onClick={handleCreateOrganization} className="w-full">
                Create Organization
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Organizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {organizations.map((org) => (
                <div
                  key={org.id}
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                  onClick={() => loadOrganizationDetails(org.id)}
                >
                  <div>
                    <h4 className="font-medium">{org.name}</h4>
                    <p className="text-sm text-muted-foreground">{org.slug}</p>
                  </div>
                  <Users className="h-4 w-4" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedOrg && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {selectedOrg.name} Members
                <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add User to {selectedOrg.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={newUser.firstName}
                          onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={newUser.lastName}
                          onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        />
                      </div>
                      <Button onClick={handleAddUser} className="w-full">
                        Add User
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedOrg.members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {member.user.first_name} {member.user.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {member.user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={member.role}
                          onValueChange={(value) => handleRoleChange(member.id, value as any)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="owner">Owner</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}