import React, { useState, useEffect } from 'react';
import { CreditCard, Key, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/hooks/use-toast';

export function UserSubscriptions() {
  const { user } = useAuthStore();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createSubOpen, setCreateSubOpen] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  
  const [newSub, setNewSub] = useState({
    plan: 'pro' as 'free' | 'pro' | 'enterprise',
    billingCycle: 'monthly' as 'monthly' | 'annual',
    amount: 29
  });

  useEffect(() => {
    if (user) loadSubscriptions();
  }, [user]);

  const loadSubscriptions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('user_type', 'individual');

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
    if (!user) return;

    try {
      const { data: apiKey } = await supabase.rpc('generate_api_key');
      
      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          plan: newSub.plan,
          billing_cycle: newSub.billingCycle,
          amount: newSub.amount,
          user_type: 'individual',
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

  if (loading) return <div className="p-8">Loading...</div>;

  // Don't show if user is organization member
  if (user?.organization_id) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            You are part of an organization. Contact your organization admin to manage subscriptions.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Subscriptions</h2>
        <Dialog open={createSubOpen} onOpenChange={setCreateSubOpen}>
          <DialogTrigger asChild>
            <Button>
              <CreditCard className="h-4 w-4 mr-2" />
              Subscribe
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Subscription</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Plan</Label>
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
                <Label>Billing</Label>
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