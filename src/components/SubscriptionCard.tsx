import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap } from 'lucide-react';
import { realSubscriptionService } from '@/lib/realSubscriptionService';
import { useAuthStore } from '@/stores/authStore';

interface SubscriptionCardProps {
  plan: 'free' | 'pro' | 'enterprise';
  name: string;
  price: number;
  billingCycle: 'monthly' | 'annual';
  features: string[];
  isCurrentPlan?: boolean;
  onSubscribe?: () => void;
}

export function SubscriptionCard({ 
  plan, 
  name, 
  price, 
  billingCycle, 
  features, 
  isCurrentPlan = false,
  onSubscribe 
}: SubscriptionCardProps) {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await realSubscriptionService.createSubscription({
        userId: user.id,
        product: 'ugraph',
        plan,
        billingCycle
      });

      alert(`Successfully subscribed to ${name} plan!`);
      onSubscribe?.();
    } catch (error: any) {
      console.error('Subscription error:', error);
      console.error('Error message:', error?.message);
      console.error('Error details:', error?.details);
      alert(`Subscription failed: ${error?.message || 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanIcon = () => {
    switch (plan) {
      case 'pro': return <Zap className="h-5 w-5" />;
      case 'enterprise': return <Crown className="h-5 w-5" />;
      default: return null;
    }
  };

  const displayPrice = billingCycle === 'annual' ? price * 12 * 0.8 : price;

  return (
    <Card className={`relative ${plan === 'pro' ? 'border-primary shadow-lg' : ''}`}>
      {plan === 'pro' && (
        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
          Most Popular
        </Badge>
      )}
      
      <CardHeader className="text-center">
        <div className="flex items-center justify-center space-x-2">
          {getPlanIcon()}
          <CardTitle className="text-xl">{name}</CardTitle>
        </div>
        <div className="space-y-1">
          <div className="text-3xl font-bold text-foreground">
            ${displayPrice}
            <span className="text-sm font-normal text-muted-foreground">
              /{billingCycle === 'annual' ? 'year' : 'month'}
            </span>
          </div>
          {billingCycle === 'annual' && price > 0 && (
            <p className="text-sm text-green-600 dark:text-green-400">Save 20% annually</p>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-500 dark:text-green-400" />
              <span className="text-sm text-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          onClick={handleSubscribe}
          disabled={isCurrentPlan || isLoading}
          className="w-full"
          variant={plan === 'pro' ? 'default' : 'outline'}
        >
          {isLoading ? 'Processing...' : isCurrentPlan ? 'Current Plan' : `Subscribe to ${name}`}
        </Button>
      </CardContent>
    </Card>
  );
}