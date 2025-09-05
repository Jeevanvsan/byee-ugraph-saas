import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Key, Eye, EyeOff, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/hooks/use-toast';
import { productsService } from '@/lib/productsService';
import { ApiManagement } from './ApiManagement';

export function BillingDashboard() {
  const { user } = useAuthStore();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [subsData, productsData] = await Promise.all([
        loadSubscriptions(),
        productsService.getActiveProducts()
      ]);
      setProducts(productsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSubscriptions = async () => {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;
    setSubscriptions(data || []);
    return data || [];
  };

  const handleSubscribe = async (productSlug: string, plan: string) => {
    if (!user) return;
    
    try {
      const { directRazorpayService } = await import('@/lib/directRazorpayService');
      const amount = plan === 'pro' ? 2999 : 9999;
      
      await directRazorpayService.processPayment(
        amount,
        productSlug,
        plan,
        'monthly',
        {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email
        }
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Payment failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Billing & Subscriptions</h2>
      </div>

      <Tabs defaultValue="subscriptions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="subscriptions">My Subscriptions</TabsTrigger>
          <TabsTrigger value="products">Available Products</TabsTrigger>
          <TabsTrigger value="apis">API Management</TabsTrigger>
          <TabsTrigger value="billing">Payment Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions">
          <Card>
            <CardHeader>
              <CardTitle>Active Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              {subscriptions.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No active subscriptions</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Next Billing</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell>{sub.plan}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{sub.plan}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={sub.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}>
                            {sub.status}
                          </Badge>
                        </TableCell>
                        <TableCell>₹{sub.amount}/{sub.billing_cycle}</TableCell>
                        <TableCell>{new Date(sub.current_period_end).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>{product.name}</span>
                    <Badge variant="secondary">{product.status}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                  <div className="space-y-2">
                    <Button 
                      className="w-full" 
                      onClick={() => handleSubscribe(product.slug, 'pro')}
                    >
                      Subscribe Pro - ₹2,999/month
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleSubscribe(product.slug, 'enterprise')}
                    >
                      Subscribe Enterprise - ₹9,999/month
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="apis">
          <ApiManagement subscriptions={subscriptions} />
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Payment Method</h4>
                    <p className="text-sm text-muted-foreground">Razorpay</p>
                  </div>
                  <Button variant="outline">Update</Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Billing Address</h4>
                    <p className="text-sm text-muted-foreground">Update your billing information</p>
                  </div>
                  <Button variant="outline">Edit</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}