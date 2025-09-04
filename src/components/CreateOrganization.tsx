import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { organizationService } from '@/lib/organizationService';
import { toast } from '@/hooks/use-toast';

export function CreateOrganization({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Creating organization:', formData);
      const org = await organizationService.createOrganization(
        formData.name,
        formData.slug,
        formData.description
      );
      
      console.log('Organization created:', org);
      
      toast({
        title: "Success",
        description: "Organization created successfully",
      });
      
      onSuccess();
      
    } catch (error) {
      console.error('Organization creation error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create organization",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Organization Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="slug">Slug (URL identifier)</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="my-company"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating...' : 'Create Organization'}
      </Button>
    </form>
  );
}