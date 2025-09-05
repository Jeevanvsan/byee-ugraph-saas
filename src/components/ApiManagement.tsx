import React, { useState, useEffect } from 'react';
import { Plus, Key, Eye, EyeOff, Copy, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/hooks/use-toast';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  product_slug: string;
  subscription_id: string;
  created_at: string;
  last_used: string | null;
}

export function ApiManagement({ subscriptions }: { subscriptions: any[] }) {
  const { user } = useAuthStore();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [createKeyOpen, setCreateKeyOpen] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [newKey, setNewKey] = useState({
    name: '',
    subscriptionId: ''
  });

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load API keys",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateApiKey = async () => {
    if (!user || !newKey.name || !newKey.subscriptionId) return;

    try {
      const subscription = subscriptions.find(s => s.id === newKey.subscriptionId);
      if (!subscription) throw new Error('Subscription not found');

      const { data: keyData } = await supabase.rpc('generate_api_key');
      
      const { error } = await supabase
        .from('api_keys')
        .insert({
          user_id: user.id,
          name: newKey.name,
          key: keyData,
          product_slug: subscription.plan, // Assuming plan maps to product
          subscription_id: newKey.subscriptionId
        });

      if (error) throw error;

      setCreateKeyOpen(false);
      setNewKey({ name: '', subscriptionId: '' });
      loadApiKeys();
      
      toast({
        title: "Success",
        description: "API key created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive",
      });
    }
  };

  const handleDeleteApiKey = async (keyId: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', keyId);

      if (error) throw error;

      loadApiKeys();
      toast({
        title: "Success",
        description: "API key deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete API key",
        variant: "destructive",
      });
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
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

  if (loading) return <div>Loading API keys...</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>API Keys</CardTitle>
          <Dialog open={createKeyOpen} onOpenChange={setCreateKeyOpen}>
            <DialogTrigger asChild>
              <Button disabled={subscriptions.length === 0}>
                <Plus className="h-4 w-4 mr-2" />
                Create API Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New API Key</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Key Name</Label>
                  <Input
                    value={newKey.name}
                    onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
                    placeholder="My API Key"
                  />
                </div>
                <div>
                  <Label>Subscription</Label>
                  <Select value={newKey.subscriptionId} onValueChange={(value) => setNewKey({ ...newKey, subscriptionId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subscription" />
                    </SelectTrigger>
                    <SelectContent>
                      {subscriptions.filter(s => s.status === 'active').map((sub) => (
                        <SelectItem key={sub.id} value={sub.id}>
                          {sub.plan} - ₹{sub.amount}/{sub.billing_cycle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreateApiKey} className="w-full">
                  Create API Key
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {subscriptions.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            No active subscriptions. Subscribe to a product to create API keys.
          </p>
        ) : apiKeys.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            No API keys created yet.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>API Key</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell className="font-medium">{apiKey.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{apiKey.product_slug}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {visibleKeys.has(apiKey.id) ? apiKey.key : apiKey.key.substring(0, 8) + '...'}
                      </code>
                      <Button size="sm" variant="ghost" onClick={() => toggleKeyVisibility(apiKey.id)}>
                        {visibleKeys.has(apiKey.id) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(apiKey.key)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(apiKey.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {apiKey.last_used ? new Date(apiKey.last_used).toLocaleDateString() : 'Never'}
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleDeleteApiKey(apiKey.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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