import React, { useState, useEffect } from 'react';
import { Plus, Key, Eye, EyeOff, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { productsService } from '@/lib/productsService';

export function OrgBillingDashboard({ organizationId }: { organizationId: string }) {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [organizationId]);

  const loadData = async () => {
    try {
      const [_, productsData] = await Promise.all([
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
    const { data, error } = await supabase
      .from('organization_subscriptions')
      .select('*')
      .eq('organization_id', organizationId);

    if (error) throw error;
    setSubscriptions(data || []);
  };

  const handleSubscribe = async (productSlug: string, plan: string) => {
    try {
      const { directRazorpayService } = await import('@/lib/directRazorpayService');
      const amount = plan === 'pro' ? 2999 : 9999;
      
      // Get current user for org subscription
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name, email')
        .eq('id', user.id)
        .single();
      
      if (!profile) throw new Error('Profile not found');
      
      await directRazorpayService.processPayment(
        amount,
        productSlug,
        plan,
        'monthly',
        {
          name: `${profile.first_name} ${profile.last_name}`,
          email: profile.email
        },
        organizationId
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
    <Tabs defaultValue="subscriptions" className="space-y-4">
      <TabsList>
        <TabsTrigger value="subscriptions">Organization Subscriptions</TabsTrigger>
        <TabsTrigger value="products">Available Products</TabsTrigger>
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
                      <TableCell>{products.find(p => p.slug === sub.product_slug)?.name || sub.product_slug}</TableCell>
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
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}