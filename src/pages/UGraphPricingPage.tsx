import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, X, Star, Users, Building, Zap, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for individuals getting started with AI workflows',
    icon: Users,
    popular: false,
    features: [
      '5 workflows per month',
      'Basic templates',
      'Community support',
      'Standard integrations',
      'Basic analytics',
    ],
    limitations: [
      'Limited to 100 nodes',
      'No custom connectors',
      'No priority support',
    ]
  },
  {
    name: 'Pro',
    price: '$29',
    period: 'per month',
    description: 'For professionals and small teams building complex workflows',
    icon: Zap,
    popular: true,
    features: [
      'Unlimited workflows',
      'Advanced templates',
      'Priority support',
      'Custom integrations',
      'Advanced analytics',
      'Team collaboration',
      'Version control',
      'API access',
    ],
    limitations: []
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: 'per month',
    description: 'For large teams with advanced requirements and compliance needs',
    icon: Building,
    popular: false,
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'Advanced security (SSO)',
      'Custom deployment',
      'Dedicated support',
      'SLA guarantees',
      'Advanced compliance',
      'Custom training',
    ],
    limitations: []
  },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'AI Engineer at TechCorp',
    avatar: '👩‍💻',
    content: 'UGraph completely transformed how we build AI workflows. The visual interface makes complex orchestration intuitive.',
    rating: 5
  },
  {
    name: 'Michael Rodriguez',
    role: 'CTO at StartupXYZ',
    avatar: '👨‍💼',
    content: 'We reduced our AI development time by 60% using UGraph. The 3D visualization helps our team collaborate effectively.',
    rating: 5
  },
  {
    name: 'Emma Thompson',
    role: 'Data Scientist at Enterprise Inc',
    avatar: '👩‍🔬',
    content: 'The best AI workflow platform I\'ve used. The integration capabilities are outstanding.',
    rating: 5
  }
];

const faqs = [
  {
    question: 'How does the visual workflow builder work?',
    answer: 'Our intuitive drag-and-drop interface allows you to create complex AI workflows by connecting nodes visually. Each node represents a specific AI operation or data transformation, and you can easily configure parameters and see real-time execution.'
  },
  {
    question: 'Can I integrate with existing AI models and services?',
    answer: 'Yes! UGraph supports integration with popular AI services like OpenAI, Hugging Face, AWS SageMaker, and many others. You can also deploy custom models and create custom connectors for your specific needs.'
  },
  {
    question: 'What kind of support do you provide?',
    answer: 'We offer different levels of support based on your plan. Free users get community support, Pro users get priority email support, and Enterprise customers get dedicated support with SLA guarantees and phone support.'
  },
  {
    question: 'Is there a limit on workflow complexity?',
    answer: 'Free plans are limited to 100 nodes per workflow. Pro and Enterprise plans have no limits on workflow complexity, allowing you to build sophisticated AI systems with thousands of interconnected components.'
  },
  {
    question: 'How secure is my data?',
    answer: 'We take security seriously. All data is encrypted in transit and at rest. Enterprise plans include advanced security features like SSO, audit logs, and compliance certifications (SOC 2, GDPR, HIPAA).'
  }
];

export default function UGraphPricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      {/* Breadcrumb */}
      <section className="py-6 px-6 bg-muted/30">
        <div className="container mx-auto">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">SandVar</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
            <span>/</span>
            <Link to="/products/ugraph" className="hover:text-primary transition-colors">UGraph</Link>
            <span>/</span>
            <span className="text-foreground">Pricing</span>
          </nav>
        </div>
      </section>
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 bg-gradient-to-br from-primary via-purple-600 to-blue-700">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              💎 Simple, Transparent Pricing
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Choose Your Plan
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              From individuals to enterprise teams, we have a plan that scales with your AI workflow needs.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-12">
              <span className={`mr-3 ${!isAnnual ? 'text-white' : 'text-white/60'}`}>Monthly</span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isAnnual ? 'bg-white' : 'bg-white/20'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-primary transition-transform ${
                    isAnnual ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`ml-3 ${isAnnual ? 'text-white' : 'text-white/60'}`}>
                Annual <span className="text-green-200 font-medium">(Save 20%)</span>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-6 -mt-12">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
                      ⭐ Most Popular
                    </Badge>
                  </div>
                )}
                <Card className={`h-full border-0 shadow-xl bg-white ${plan.popular ? 'ring-2 ring-primary shadow-primary/20' : ''}`}>
                  <CardHeader className="pb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <plan.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">
                          {isAnnual && plan.price !== '$0' 
                            ? `$${Math.round(parseInt(plan.price.slice(1)) * 0.8)}`
                            : plan.price
                          }
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {plan.price === '$0' ? plan.period : isAnnual ? 'per month, billed annually' : plan.period}
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-base">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : 'bg-gray-900 hover:bg-gray-800'}`}
                      size="lg"
                    >
                      {plan.price === '$0' ? 'Get Started Free' : 'Start Free Trial'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    
                    <div>
                      <h4 className="font-semibold mb-3">What's included:</h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {plan.limitations.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 text-muted-foreground">Limitations:</h4>
                        <ul className="space-y-2">
                          {plan.limitations.map((limitation, idx) => (
                            <li key={idx} className="flex items-start">
                              <X className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-muted-foreground">{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of developers and teams who trust UGraph for their AI workflows.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-lg mr-4">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about UGraph and our pricing.
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
                      {expandedFaq === index ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      )}
                    </button>
                    {expandedFaq === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t"
                      >
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary to-purple-600">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your AI Workflows?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of developers building the future with UGraph. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8">
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">SandVar</h3>
              <p className="text-gray-400 mb-4">
                Building the future of AI workflow orchestration.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/products/ugraph" className="hover:text-white transition-colors">UGraph</Link></li>
                <li><Link to="/products/ugraph/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SandVar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}