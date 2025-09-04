import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';
import { SubscriptionCard } from '@/components/SubscriptionCard';

const plans = [
  {
    plan: 'free' as const,
    name: 'Free',
    price: 0,
    billingCycle: 'monthly' as const,
    features: [
      '5 workflows per month',
      'Basic templates',
      'Community support',
      'Standard integrations'
    ]
  },
  {
    plan: 'pro' as const,
    name: 'Pro',
    price: 29,
    billingCycle: 'monthly' as const,
    features: [
      'Unlimited workflows',
      'Advanced templates',
      'Priority support',
      'Custom integrations',
      'Advanced analytics'
    ]
  },
  {
    plan: 'enterprise' as const,
    name: 'Enterprise',
    price: 99,
    billingCycle: 'monthly' as const,
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'Advanced security (SSO)',
      'Custom deployment',
      'Dedicated support'
    ]
  }
];

export default function PricingPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSubscriptionChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 mb-16"
          >
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
              Simple, Transparent
              <span className="block bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Pricing
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the perfect plan for your AI workflow needs. Start free and scale as you grow.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={`${plan.name}-${refreshKey}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <SubscriptionCard
                  plan={plan.plan}
                  name={plan.name}
                  price={plan.price}
                  billingCycle={plan.billingCycle}
                  features={plan.features}
                  onSubscribe={handleSubscriptionChange}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about our pricing and features.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: 'Can I upgrade or downgrade my plan?',
                answer: 'Yes, you can change your plan at any time. Upgrades are effective immediately, and downgrades take effect at the next billing cycle.',
              },
              {
                question: 'What happens during the free trial?',
                answer: 'You get full access to Pro features for 7 days. No credit card required. You can cancel anytime without charge.',
              },
              {
                question: 'Do you offer refunds?',
                answer: 'We offer a 30-day money-back guarantee for all paid plans. Contact support if youre not satisfied.',
              },
              {
                question: 'Is there a setup fee?',
                answer: 'No setup fees, ever. You only pay the monthly or annual subscription fee for your chosen plan.',
              },
              {
                question: 'Can I cancel anytime?',
                answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.',
              },
              {
                question: 'Do you offer discounts for nonprofits?',
                answer: 'Yes, we offer special pricing for educational institutions and nonprofit organizations. Contact us for details.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="space-y-2"
              >
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of developers building the future with UGraph.
            </p>
            <Button size="lg" className="text-lg px-8" asChild>
              <Link to="/auth/signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}