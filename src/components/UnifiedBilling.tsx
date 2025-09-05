import React, { useState, useEffect } from 'react';
import { CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { directRazorpayService } from '@/lib/directRazorpayService';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/hooks/use-toast';

interface Subscription {
  id: string;
  plan: string;
  status: string;
  amount: number;
  billing_cycle: string;
  current_period_end: string;
  product_slug?: string;
  api_key: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: string;
}

interface UnifiedBillingProps {
  userType: 'individual' | 'organization';
}

export function UnifiedBilling({ userType }: UnifiedBillingProps) {
  const { user } = useAuthStore();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'plus' | 'pro'>('plus');
  const [upgradeModal, setUpgradeModal] = useState<Subscription | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [user, userType]);

  const loadData = async () => {
    if (!user) return;
    
    try {
      // Load products
      console.log('Loading products...');
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*');
      
      console.log('All products:', productsData);
      console.log('Products error:', productsError);
      
      const activeProducts = productsData?.filter(p => p.status === 'active' || p.status === 'coming_soon') || [];
      console.log('Active products:', activeProducts);
      
      // Load subscriptions
      if (userType === 'organization' && user.organization_id) {
        const { data } = await supabase
          .from('organization_subscriptions')
          .select('*')
          .eq('organization_id', user.organization_id);
        setSubscriptions(data || []);
      } else {
        const { data } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id);
        setSubscriptions(data || []);
      }
      
      setProducts(activeProducts);
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

  const handleUpgrade = async (newPlan: 'plus' | 'pro') => {
    if (!upgradeModal) return;
    
    const planPrices = { plus: 1500, pro: 2500 };
    const amount = planPrices[newPlan];
    
    try {
      // Update existing subscription directly without creating new one
      if (userType === 'organization') {
        const { error } = await supabase
          .from('organization_subscriptions')
          .update({ 
            plan: newPlan, 
            amount: amount,
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
          .eq('id', upgradeModal.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('subscriptions')
          .update({ 
            plan: newPlan, 
            amount: amount,
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
          .eq('id', upgradeModal.id);
        if (error) throw error;
      }
      
      setUpgradeModal(null);
      loadData();
      
      toast({
        title: "Success",
        description: `Upgraded to ${newPlan} plan successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upgrade subscription",
        variant: "destructive",
      });
    }
  };

  const handleCancelSubscription = async (subscriptionId: string, razorpaySubId?: string) => {
    if (!confirm('Are you sure you want to cancel your subscription? You can resume it later.')) {
      return;
    }

    try {
      // Cancel in Razorpay if subscription ID exists
      if (razorpaySubId && razorpaySubId !== 'sub_temp_' + Date.now()) {
        const { error: razorpayError } = await supabase.functions.invoke('cancel-razorpay-subscription', {
          body: { subscription_id: razorpaySubId }
        });
        if (razorpayError) console.warn('Razorpay cancellation failed:', razorpayError);
      }

      // Update database
      if (userType === 'organization') {
        const { error } = await supabase
          .from('organization_subscriptions')
          .update({ status: 'cancelled' })
          .eq('id', subscriptionId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('subscriptions')
          .update({ status: 'cancelled' })
          .eq('id', subscriptionId);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Subscription cancelled successfully. You can resume it anytime.",
      });
      
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel subscription",
        variant: "destructive",
      });
    }
  };

  const handleResumeSubscription = async (subscriptionId: string, razorpaySubId?: string) => {
    try {
      // Resume in Razorpay if subscription ID exists
      if (razorpaySubId && razorpaySubId !== 'sub_temp_' + Date.now()) {
        const { error: razorpayError } = await supabase.functions.invoke('resume-razorpay-subscription', {
          body: { subscription_id: razorpaySubId }
        });
        if (razorpayError) console.warn('Razorpay resume failed:', razorpayError);
      }

      // Update database
      if (userType === 'organization') {
        const { error } = await supabase
          .from('organization_subscriptions')
          .update({ 
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
          .eq('id', subscriptionId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('subscriptions')
          .update({ 
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
          .eq('id', subscriptionId);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Subscription resumed successfully",
      });
      
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resume subscription",
        variant: "destructive",
      });
    }
  };

  const handleSubscribeSubmit = async () => {
    if (!user || !selectedProduct) return;
    
    setPaymentLoading(true);
    try {
      const planPrices = { plus: 1500, pro: 2500 };
      const amount = planPrices[selectedPlan as keyof typeof planPrices];
      
      if (userType === 'organization' && user?.organization_id) {
        // Check if subscription already exists
        const { data: existing, error: checkError } = await supabase
          .from('organization_subscriptions')
          .select('id')
          .eq('organization_id', user.organization_id)
          .eq('product_slug', selectedProduct)
          .maybeSingle();
          
        console.log('Existing subscription check:', { existing, checkError });
          
        if (existing && !checkError) {
          toast({
            title: "Already Subscribed",
            description: "Organization already has a subscription for this product",
            variant: "destructive",
          });
          return;
        }
        
        // Process payment for organization
        await directRazorpayService.processPayment(
          amount,
          selectedProduct,
          selectedPlan,
          'monthly',
          {
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Customer',
            email: user.email || 'customer@example.com'
          },
          user.organization_id
        );
      } else {
        // Process payment for individual
        await directRazorpayService.processPayment(
          amount,
          selectedProduct,
          selectedPlan,
          'monthly',
          {
            name: user.user_metadata?.full_name || user.email || '',
            email: user.email || ''
          }
        );
      }
      
      setDialogOpen(false);
      setSelectedProduct('');
      setSelectedPlan('pro');
    } catch (error) {
      toast({
        title: "Error",
        description: "Payment failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CreditCard className="h-6 w-6" />
          <h1 className="text-2xl font-bold">
            {userType === 'organization' ? 'Organization' : 'Individual'} Billing & Subscriptions
          </h1>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <CreditCard className="h-4 w-4 mr-2" />
              New Subscription
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Subscribe to Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="product">Product</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.slug}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="plan">Plan</Label>
                <Select value={selectedPlan} onValueChange={(value: 'pro' | 'enterprise') => setSelectedPlan(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plus">Plus - ₹1,500/month</SelectItem>
                    <SelectItem value="pro">Pro - ₹2,500/month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleSubscribeSubmit} 
                className="w-full" 
                disabled={!selectedProduct || paymentLoading}
              >
                {paymentLoading ? 'Processing...' : `Pay ₹${selectedPlan === 'plus' ? '1,500' : '2,500'} & Subscribe`}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            {subscriptions.length === 0 ? (
              <p className="text-muted-foreground">No active subscriptions</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    {userType === 'organization' && <TableHead>Product</TableHead>}
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((sub) => (
                    <TableRow key={sub.id}>
                      {userType === 'organization' && <TableCell>{sub.product_slug}</TableCell>}
                      <TableCell>
                        <Badge variant="outline">{sub.plan}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={sub.status === 'active' ? 'bg-green-500/10 text-green-400' : ''}>
                          {sub.status}
                        </Badge>
                      </TableCell>
                      <TableCell>₹{sub.amount}/month</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {sub.status === 'active' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setUpgradeModal(sub)}
                              >
                                Upgrade
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleCancelSubscription(sub.id, sub.razorpay_subscription_id)}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          {sub.status === 'cancelled' && (
                            <Button 
                              size="sm" 
                              variant="default"
                              onClick={() => handleResumeSubscription(sub.id, sub.razorpay_subscription_id)}
                            >
                              Resume
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Products</CardTitle>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <p className="text-muted-foreground">No products available</p>
            ) : (
              <div className="grid gap-4">
                {products.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {upgradeModal && (
        <Dialog open={true} onOpenChange={() => setUpgradeModal(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upgrade Subscription</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>Current Plan: <Badge>{upgradeModal.plan}</Badge> - ₹{upgradeModal.amount}/month</p>
              
              <div>
                <Label>New Plan</Label>
                <Select value={selectedPlan} onValueChange={(value: 'plus' | 'pro') => setSelectedPlan(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plus">Plus - ₹1,500/month</SelectItem>
                    <SelectItem value="pro">Pro - ₹2,500/month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={() => handleUpgrade(selectedPlan)} className="flex-1">
                  Upgrade to {selectedPlan} - ₹{selectedPlan === 'plus' ? '1,500' : '2,500'}/month
                </Button>
                <Button variant="outline" onClick={() => setUpgradeModal(null)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}