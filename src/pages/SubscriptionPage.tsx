import React from 'react';
import { Header } from '@/components/layout/Header';
import { BillingDashboard } from '@/components/BillingDashboard';

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <BillingDashboard />
      </div>
    </div>
  );
}