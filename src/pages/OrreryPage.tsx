import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Globe, Shield, Users, CheckCircle, Star, Play, Download, Code, Bot, Workflow, Layers, Check, X, ChevronDown, ChevronUp, Building, Activity, AlertTriangle, BarChart3, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';
import { productStatsService, ProductStats } from '@/lib/productStatsService';

const features = [
  {
    icon: Activity,
    title: 'Real-time Execution Monitoring',
    description: 'Monitor LangGraph workflows as they execute with millisecond precision. Track node performance and execution paths in real-time.',
    benefits: ['Live execution tracking', 'Node performance metrics', 'Execution path visualization']
  },
  {
    icon: AlertTriangle,
    title: 'Smart Alerting System',
    description: 'Get instant notifications when workflows encounter errors, performance bottlenecks, or unexpected behaviors.',
    benefits: ['Custom alert thresholds', 'Multi-channel notifications', 'Root cause analysis']
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Deep analytical insights into workflow performance, resource utilization, and optimization opportunities.',
    benefits: ['Performance trend analysis', 'Resource consumption reports', 'Optimization recommendations']
  },
  {
    icon: Clock,
    title: 'Historical Data Retention',
    description: 'Access execution history with detailed metrics for compliance, debugging, and performance analysis.',
    benefits: ['Long-term data storage', 'Historical trend analysis', 'Audit-ready reports']
  }
];

const integrations = [
  { name: 'LangGraph', logo: '⛓️', category: 'Core Framework' },
  // { name: 'OpenAI GPT-4', logo: '🤖', category: 'LLM' },
  // { name: 'Hugging Face', logo: '🤗', category: 'Models' },
  // { name: 'AWS CloudWatch', logo: '☁️', category: 'Monitoring' },
  // { name: 'Slack', logo: '💬', category: 'Notifications' },
  // { name: 'PagerDuty', logo: '🚨', category: 'Alerting' },
  // { name: 'Grafana', logo: '📊', category: 'Analytics' },
  // { name: 'Datadog', logo: '🐕', category: 'Monitoring' }
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'AI Engineer at TechCorp',
    avatar: '👩‍💻',
    content: 'Orrery gives us complete visibility into our LangGraph workflows. The real-time alerts have prevented several production incidents.',
    rating: 5,
    company: 'TechCorp'
  },
  {
    name: 'Michael Rodriguez',
    role: 'CTO at StartupXYZ',
    avatar: '👨‍💼',
    content: 'The analytics dashboard helped us optimize our workflows and reduce execution time by 40%. Essential for any serious LangGraph implementation.',
    rating: 5,
    company: 'StartupXYZ'
  },
  {
    name: 'Emma Thompson',
    role: 'Data Scientist at Enterprise Inc',
    avatar: '👩‍🔬',
    content: 'Finally a monitoring solution built specifically for LangGraph! The historical data analysis has been invaluable for our compliance requirements.',
    rating: 5,
    company: 'Enterprise Inc'
  }
];

const pricingPlans = [
  {
    name: 'Starter',
    price: '$0',
    period: 'forever',
    description: 'Perfect for individuals monitoring basic LangGraph workflows',
    icon: Users,
    popular: false,
    features: [
      'Monitor up to 5 workflows',
      'Basic alerting (email only)',
      '7-day data retention',
      'Standard analytics dashboard',
      'Community support',
    ],
    limitations: [
      'Limited historical data',
      'No custom alert rules',
      'No API access',
    ]
  },
  {
    name: 'Pro',
    price: '$49',
    period: 'per month',
    description: 'For teams building and monitoring production LangGraph workflows',
    icon: Zap,
    popular: true,
    features: [
      'Unlimited workflow monitoring',
      'Advanced alerting (Slack, SMS, Webhooks)',
      '90-day data retention',
      'Custom analytics dashboards',
      'Priority support',
      'API access',
      'Performance benchmarking',
    ],
    limitations: []
  },
  {
    name: 'Enterprise',
    price: '$149',
    period: 'per month',
    description: 'For organizations with complex monitoring requirements and compliance needs',
    icon: Building,
    popular: false,
    features: [
      'Everything in Pro',
      'Unlimited data retention',
      'Custom alert rules',
      'Advanced compliance reporting',
      'Dedicated support',
      'SLA guarantees',
      'Single sign-on (SSO)',
      'Custom training',
    ],
    limitations: []
  },
];

const faqs = [
  {
    question: 'What LangGraph versions are supported?',
    answer: 'Orrery supports all current versions of LangGraph including 0.1.x and 0.2.x. We regularly update our monitoring agents to maintain compatibility with new releases.'
  },
  {
    question: 'How does the alerting system work?',
    answer: 'Our smart alerting system monitors key performance metrics and execution patterns. You can configure custom thresholds for response times, error rates, and resource usage. Alerts can be sent via email, Slack, SMS, or webhook integrations.'
  },
  {
    question: 'Can I export monitoring data?',
    answer: 'Yes! Pro and Enterprise plans include API access to all monitoring data. You can export metrics, execution logs, and analytics reports in multiple formats including CSV, JSON, and PDF.'
  },
  {
    question: 'What kind of analytics does Orrery provide?',
    answer: 'Our analytics platform provides execution performance trends, resource utilization patterns, error analysis, optimization recommendations, and compliance reporting. All dashboards are customizable and can be shared with team members.'
  },
  {
    question: 'How is data security handled?',
    answer: 'All monitoring data is encrypted in transit and at rest. Enterprise plans include advanced security features like SSO, audit logs, and compliance certifications (SOC 2, GDPR, HIPAA). We never access your workflow code or data.'
  }
];

export default function OrreryPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [stats, setStats] = useState<ProductStats>({ activeUsers: 0, workflowsCreated: 0, uptime: '99.9%' });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const productStats = await productStatsService.getOrreryStats();
        setStats(productStats);
      } catch (error) {
        console.error('Failed to fetch Orrery stats:', error);
      }
    };
    fetchStats();
  }, []);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing-section');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      
      {/* Breadcrumb */}
      <section className="py-6 px-6 bg-muted/30">
        <div className="container mx-auto">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">SandVar</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
            <span>/</span>
            <span className="text-foreground">Orrery</span>
          </nav>
        </div>
      </section>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block px-6 py-3 bg-primary/10 text-primary rounded-full text-lg font-medium"
                >
                  🔍 Real-time LangGraph Monitoring
                </motion.div>
                
                <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
                  Monitor Your AI Agents
                  <span className="block bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    In Real-time
                  </span>
                </h1>
                
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Gain complete visibility into your LangGraph workflows with real-time monitoring, 
                  intelligent alerts, and deep analytical insights. Never fly blind with your AI systems.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8" asChild>
                  <Link to="/auth/signup">
                    Start Monitoring Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8" onClick={scrollToPricing}>
                  View Plans
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.activeUsers.toLocaleString()}+</div>
                  <div className="text-sm text-muted-foreground">Active Teams</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.workflowsCreated.toLocaleString()}+</div>
                  <div className="text-sm text-muted-foreground">Workflows Monitored</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.uptime}</div>
                  <div className="text-sm text-muted-foreground">Platform Uptime</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative h-96 rounded-2xl bg-gradient-to-br from-primary/5 to-purple-500/5 border"
            >
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Live Workflow Dashboard
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Real-time insights into your LangGraph executions with performance metrics, alerts, and optimization recommendations.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Comprehensive LangGraph Monitoring
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to ensure your LangGraph workflows perform reliably in production.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 bg-gradient-to-br from-background to-muted/20 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base mb-4">
                      {feature.description}
                    </CardDescription>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Seamless Integrations
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Connect Orrery with your existing tools and infrastructure for a complete monitoring ecosystem.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-6 hover:shadow-lg transition-all">
                  <div className="text-4xl mb-3">{integration.logo}</div>
                  <h4 className="font-medium mb-1">{integration.name}</h4>
                  <p className="text-xs text-muted-foreground">{integration.category}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Trusted by AI Teams</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join industry leaders who rely on Orrery for LangGraph monitoring.
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

      {/* Pricing Section */}
      <section id="pricing-section" className="py-20 px-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto">
          {/* Pricing Hero */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              💎 Transparent Monitoring Plans
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Choose Your Monitoring Plan
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              From individual developers to enterprise teams, we have a plan that scales with your LangGraph monitoring needs.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-12">
              <span className={`mr-3 ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isAnnual ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAnnual ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`ml-3 ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                Annual <span className="text-green-600 font-medium">(Save 20%)</span>
              </span>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
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
                <Card className={`h-full border-0 shadow-xl bg-white dark:bg-gray-800 ${plan.popular ? 'ring-2 ring-primary shadow-primary/20' : ''}`}>
                  <CardHeader className="pb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <plan.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-foreground">
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
                      className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : 'bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200'}`}
                      size="lg"
                      asChild
                    >
                      <Link to={plan.price === '$0' ? '/auth/signup' : '/subscriptions'}>
                        {plan.price === '$0' ? 'Get Started Free' : 'Start Free Trial'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    
                    <div>
                      <h4 className="font-semibold mb-3">What's included:</h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-foreground">{feature}</span>
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
                              <span className="text-sm text-muted-foreground dark:text-gray-400">{limitation}</span>
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

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4">Frequently Asked Questions</h3>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about Orrery monitoring.
              </p>
            </div>

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
                        <h4 className="text-lg font-semibold pr-4">{faq.question}</h4>
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
          </motion.div>
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
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold text-white">
              Ready to Monitor Your LangGraph Workflows?
            </h2>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Join teams who ensure their AI agents perform reliably with real-time insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
                <Link to="/auth/signup">
                  Start Free Monitoring
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent border-white text-white hover:bg-white hover:text-primary" onClick={scrollToPricing}>
                View Plans
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
                <li><Link to="/products/orrery" className="hover:text-white transition-colors">Orrery</Link></li>
                <li><button onClick={scrollToPricing} className="hover:text-white transition-colors">Pricing</button></li>
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