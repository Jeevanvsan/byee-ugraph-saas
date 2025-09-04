import React, { useState, useEffect } from 'react';
import { Users, DollarSign, UserCheck, TrendingUp, Mail, Settings, Plus, Edit, Package, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { adminService, AdminStats, UserData } from '@/lib/adminService';
import { Product } from '@/lib/productsService';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { contactService, ContactSubmission } from '@/lib/contactService';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { OrganizationManager } from '@/components/OrganizationManager';
import { OrganizationSubscriptions } from '@/components/OrganizationSubscriptions';

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [submissionsLoading, setSubmissionsLoading] = useState(true);
  const [newAdmin, setNewAdmin] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
    loadDashboardData();
    loadSubmissions();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/admin/login');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      navigate('/admin/login');
    }
  };

  const loadDashboardData = async () => {
    try {
      const [adminStats, allUsers, allProducts] = await Promise.all([
        adminService.getAdminStats(),
        adminService.getAllUsers(),
        adminService.getAllProducts()
      ]);
      setStats(adminStats);
      setUsers(allUsers);
      setProducts(allProducts);
    } catch (error) {
      console.error('Failed to load admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSubmissions = async () => {
    try {
      setSubmissionsLoading(true);
      const data = await contactService.getSubmissions();
      setSubmissions(data);
    } catch (error) {
      console.error('Error loading submissions:', error);
      toast({
        title: "Error",
        description: "Failed to load contact submissions",
        variant: "destructive",
      });
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const handleStatusChange = async (submissionId: string, newStatus: 'responded' | 'archived') => {
    try {
      await contactService.updateSubmissionStatus(submissionId, newStatus);
      await loadSubmissions(); // Reload the list
      toast({
        title: "Status Updated",
        description: "Submission status has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update submission status",
        variant: "destructive",
      });
    }
  };

  const handlePlanChange = async (userId: string, newPlan: 'free' | 'pro' | 'enterprise') => {
    try {
      await adminService.updateUserPlan(userId, newPlan);
      loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Failed to update user plan:', error);
    }
  };

  const handleSendEmail = async (userId: string, type: 'onboarding' | 'invoice') => {
    try {
      await adminService.sendEmail(userId, type);
      alert(`${type} email sent successfully`);
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  const handleCreateAdmin = async () => {
    try {
      await adminService.createAdmin(newAdmin.email, newAdmin.password, newAdmin.firstName, newAdmin.lastName);
      setNewAdmin({ email: '', password: '', firstName: '', lastName: '' });
      alert('Admin created successfully');
    } catch (error) {
      console.error('Failed to create admin:', error);
    }
  };

  const handleMakeUserAdmin = async (userId: string) => {
    try {
      await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', userId);
      loadDashboardData();
      toast({
        title: "Success",
        description: "User promoted to admin",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to promote user",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    try {
      await adminService.updateProduct(editingProduct.id, editingProduct);
      setEditingProduct(null);
      loadDashboardData();
      alert('Product updated successfully');
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <Button onClick={handleLogout} variant="outline">Logout</Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="submissions">Contact Submissions</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pro Users</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.proUsers || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">MRR</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats?.mrr || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Trialing Users</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.trialingUsers || 0}</div>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="mb-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Admin
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Admin</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={newAdmin.firstName}
                        onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={newAdmin.lastName}
                        onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newAdmin.email}
                        onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newAdmin.password}
                        onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                      />
                    </div>
                    <Button onClick={handleCreateAdmin} className="w-full">Create Admin</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>
          <TabsContent value="users">
            {/* Users Table */}
            <Card className="my-8">
              <CardHeader>
                <CardTitle>Users Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.firstName} {user.lastName}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={user.plan}
                            onValueChange={(value) => handlePlanChange(user.id, value as any)}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="free">Free</SelectItem>
                              <SelectItem value="pro">Pro</SelectItem>
                              <SelectItem value="enterprise">Enterprise</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.isVerified ? 'default' : 'secondary'}>
                            {user.isVerified ? 'Verified' : 'Unverified'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendEmail(user.id, 'onboarding')}
                            >
                              <Mail className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMakeUserAdmin(user.id)}
                            >
                              Make Admin
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="organizations">
            <OrganizationManager />
          </TabsContent>
          <TabsContent value="products">
            {/* Product Management */}
            <Card className="my-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Product Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{product.name}</h4>
                          <Badge className={`${
                            product.status === 'hot' ? 'bg-orange-500/10 text-orange-400' :
                            product.status === 'latest' ? 'bg-green-500/10 text-green-400' :
                            product.status === 'beta' ? 'bg-blue-500/10 text-blue-400' :
                            product.status === 'coming_soon' ? 'bg-purple-500/10 text-purple-400' :
                            'bg-gray-500/10 text-gray-400'
                          }`}>
                            {product.status.replace('_', ' ')}
                          </Badge>
                          <Badge variant={product.is_active ? 'default' : 'secondary'}>
                            {product.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setEditingProduct(product)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="submissions">
            <div className="container mx-auto px-4 py-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold">Contact Form Submissions</h1>
                  <Button onClick={loadSubmissions} variant="outline">
                    Refresh
                  </Button>
                </div>

                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Routed To</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissionsLoading ? (
                         <TableRow>
                           <TableCell colSpan={7} className="text-center py-4">
                             Loading...
                           </TableCell>
                         </TableRow>
                      ) : submissions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4">
                            No submissions found
                          </TableCell>
                        </TableRow>
                      ) : (
                        submissions.map((submission) => (
                          <TableRow key={submission.id}>
                            <TableCell>{formatDate(submission.created_at)}</TableCell>
                            <TableCell>{submission.name}</TableCell>
                            <TableCell>{submission.email}</TableCell>
                            <TableCell className="max-w-xs truncate">
                              {submission.message}
                            </TableCell>
                            <TableCell>{submission.support_email}</TableCell>
                            <TableCell>
                              <Select
                                value={submission.status}
                                onValueChange={(value: 'pending' | 'responded' | 'archived') =>
                                  handleStatusChange(submission.id, value === 'pending' ? 'responded' : value)
                                }
                              >
                                <SelectTrigger className="w-[130px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="responded">Responded</SelectItem>
                                  <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  navigator.clipboard.writeText(submission.email);
                                  toast({
                                    title: "Email Copied",
                                    description: "Email address copied to clipboard",
                                  });
                                }}
                              >
                                Copy Email
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Product Edit Dialog */}
        {editingProduct && (
          <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select
                    value={editingProduct.status}
                    onValueChange={(value: any) => setEditingProduct({...editingProduct, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hot">Hot</SelectItem>
                      <SelectItem value="latest">Latest</SelectItem>
                      <SelectItem value="beta">Beta</SelectItem>
                      <SelectItem value="coming_soon">Coming Soon</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Button Text</Label>
                  <Input
                    value={editingProduct.button_text}
                    onChange={(e) => setEditingProduct({...editingProduct, button_text: e.target.value})}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_active}
                    onChange={(e) => setEditingProduct({...editingProduct, is_active: e.target.checked})}
                  />
                  <Label>Active</Label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleUpdateProduct} className="flex-1">
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setEditingProduct(null)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}