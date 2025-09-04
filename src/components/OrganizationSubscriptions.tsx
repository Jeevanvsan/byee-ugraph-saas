import React, { useState, useEffect } from 'react';
import { CreditCard, Key, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiAuthService, OrganizationSubscription } from '@/lib/apiAuthService';
import { toast } from '@/hooks/use-toast';

interface OrganizationSubscriptionsProps {
  organizationId: string;
  isAdmin: boolean;
}

export function OrganizationSubscriptions({ organizationId, isAdmin }: OrganizationSubscriptionsProps) {
  const [subscriptions, setSubscriptions] = useState<OrganizationSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [createSubOpen, setCreateSubOpen] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  
  const [newSub, setNewSub] = useState({
    productSlug: '',
    plan: 'pro' as 'free' | 'pro' | 'enterprise',
    billingCycle: 'monthly' as 'monthly' | 'annual',
    amount: 0
  });

  useEffect(() => {
    loadSubscriptions();
  }, [organizationId]);

  const loadSubscriptions = async () => {
    try {
      const data = await apiAuthService.getOrganizationSubscriptions(organizationId);
      setSubscriptions(data);
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
      await apiAuthService.createSubscription(
        organizationId,
        newSub.productSlug,
        newSub.plan,
        newSub.billingCycle,
        newSub.amount
      );
      setNewSub({ productSlug: '', plan: 'pro', billingCycle: 'monthly', amount: 0 });
      setCreateSubOpen(false);
      loadSubscriptions();
      toast({
        title: "Success",
        description: "Subscription created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create subscription",
        variant: "destructive",
      });
    }
  };

  const handleRegenerateKey = async (subscriptionId: string) => {
    try {
      await apiAuthService.regenerateApiKey(subscriptionId);
      loadSubscriptions();
      toast({
        title: "Success",
        description: "API key regenerated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to regenerate API key",
        variant: "destructive",
      });
    }
  };

  const toggleKeyVisibility = (subscriptionId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(subscriptionId)) {
      newVisible.delete(subscriptionId);
    } else {
      newVisible.add(subscriptionId);
    }
    setVisibleKeys(newVisible);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-400';
      case 'trialing': return 'bg-blue-500/10 text-blue-400';
      case 'cancelled': return 'bg-red-500/10 text-red-400';
      case 'expired': return 'bg-gray-500/10 text-gray-400';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Subscriptions</h2>
        {isAdmin && (
          <Dialog open={createSubOpen} onOpenChange={setCreateSubOpen}>
            <DialogTrigger asChild>
              <Button>
                <CreditCard className="h-4 w-4 mr-2" />
                Subscribe to Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Subscribe to Product</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="productSlug">Product</Label>
                  <Select value={newSub.productSlug} onValueChange={(value) => setNewSub({ ...newSub, productSlug: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ugraph">UGraph</SelectItem>
                      <SelectItem value="secureflow">SecureFlow</SelectItem>
                      <SelectItem value="ai-connect">AI Connect</SelectItem>
                      <SelectItem value="team-workspace">Team Workspace</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="plan">Plan</Label>
                  <Select value={newSub.plan} onValueChange={(value: any) => setNewSub({ ...newSub, plan: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="billingCycle">Billing Cycle</Label>
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
                <div>
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newSub.amount}
                    onChange={(e) => setNewSub({ ...newSub, amount: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <Button onClick={handleCreateSubscription} className="w-full">
                  Create Subscription
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {subscriptions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No subscriptions found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>API Key</TableHead>
                  <TableHead>Expires</TableHead>
                  {isAdmin && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">{sub.product_slug}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{sub.plan}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(sub.status)}>
                        {sub.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {visibleKeys.has(sub.id) 
                            ? sub.api_key 
                            : sub.api_key.substring(0, 8) + '...'
                          }
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleKeyVisibility(sub.id)}
                        >
                          {visibleKeys.has(sub.id) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(sub.api_key)}
                        >
                          Copy
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(sub.current_period_end).toLocaleDateString()}</TableCell>
                    {isAdmin && (
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRegenerateKey(sub.id)}
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Regenerate
                        </Button>
                      </TableCell>
                    )}
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