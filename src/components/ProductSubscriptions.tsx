import React, { useState, useEffect } from 'react';
import { CreditCard, Key, Eye, EyeOff, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

const PRODUCTS = [
  { slug: 'ugraph', name: 'UGraph', description: 'Visual AI workflow builder' },
  { slug: 'secureflow', name: 'SecureFlow', description: 'Enterprise security' },
  { slug: 'ai-connect', name: 'AI Connect', description: 'AI model integration' },
];

export function ProductSubscriptions({ organizationId }: { organizationId: string }) {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createSubOpen, setCreateSubOpen] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  
  const [newSub, setNewSub] = useState({
    productSlug: '',
    plan: 'pro' as 'pro' | 'enterprise',
    billingCycle: 'monthly' as 'monthly' | 'annual',
    amount: 29
  });

  useEffect(() => {
    loadSubscriptions();
  }, [organizationId]);

  const loadSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('organization_subscriptions')
        .select('*')
        .eq('organization_id', organizationId);

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load subscriptions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubscription = async () => {
    try {
      const { data: apiKey } = await supabase.rpc('generate_api_key');
      
      const { error } = await supabase
        .from('organization_subscriptions')
        .insert({
          organization_id: organizationId,
          product_slug: newSub.productSlug,
          plan: newSub.plan,
          billing_cycle: newSub.billingCycle,
          amount: newSub.amount,
          api_key: apiKey,
          status: 'active'
        });

      if (error) throw error;

      setCreateSubOpen(false);
      loadSubscriptions();
      toast({
        title: "Success",
        description: "Subscription created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create subscription",
        variant: "destructive",
      });
    }
  };

  const toggleKeyVisibility = (subId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(subId)) {
      newVisible.delete(subId);
    } else {
      newVisible.add(subId);
    }
    setVisibleKeys(newVisible);
  };

  const getProductName = (slug: string) => {
    return PRODUCTS.find(p => p.slug === slug)?.name || slug;
  };

  if (loading) return <div>Loading subscriptions...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Product Subscriptions</h3>
        <Dialog open={createSubOpen} onOpenChange={setCreateSubOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Subscribe to Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Subscribe to Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Product</label>
                <Select value={newSub.productSlug} onValueChange={(value) => setNewSub({ ...newSub, productSlug: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCTS.map((product) => (
                      <SelectItem key={product.slug} value={product.slug}>
                        {product.name} - {product.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Plan</label>
                <Select value={newSub.plan} onValueChange={(value: any) => setNewSub({ ...newSub, plan: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pro">Pro - $29/month</SelectItem>
                    <SelectItem value="enterprise">Enterprise - $99/month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Billing</label>
                <Select value={newSub.billingCycle} onValueChange={(value: any) => setNewSub({ ...newSub, billingCycle: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateSubscription} className="w-full">
                Subscribe
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {subscriptions.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No subscriptions</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>API Key</TableHead>
                  <TableHead>Expires</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>
                      <div className="font-medium">{getProductName(sub.product_slug)}</div>
                      <div className="text-sm text-muted-foreground">{sub.product_slug}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{sub.plan}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={sub.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}>
                        {sub.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {visibleKeys.has(sub.id) ? sub.api_key : sub.api_key?.substring(0, 8) + '...'}
                        </code>
                        <Button size="sm" variant="ghost" onClick={() => toggleKeyVisibility(sub.id)}>
                          {visibleKeys.has(sub.id) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(sub.current_period_end).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}