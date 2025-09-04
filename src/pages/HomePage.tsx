import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Globe, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { GraphNode } from '@/types';
import { Helmet } from "react-helmet";


const heroNodes: GraphNode[] = [
  {
    id: '1',
    type: 'aiagent',
    position: { x: -2, y: 1 },
    data: {
      label: 'AI Agent',
      config: {},
    },
  },
  {
    id: '2',
    type: 'llm',
    position: { x: 0, y: 2 },
    data: {
      label: 'LLM',
      config: {},
    },
  },
  {
    id: '3',
    type: 'tool',
    position: { x: 2, y: 1 },
    data: {
      label: 'Tool',
      config: {},
    },
  },
  {
    id: '4',
    type: 'condition',
    position: { x: 0, y: 0 },
    data: {
      label: 'Decision',
      config: {},
    },
  },
];

const heroEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e2-4', source: '2', target: '4' },
];

const features = [
  {
    icon: Zap,
    title: 'Intuitive 3D Interface',
    description: 'Create complex AI workflows with our revolutionary 3D visual builder. No coding required.',
  },
  {
    icon: Globe,
    title: 'LangGraph Integration',
    description: 'Native support for LangGraph with advanced agent orchestration capabilities.',
  },
  {
    icon: Shield,
    title: 'Enterprise Ready',
    description: 'Built for scale with enterprise-grade security, monitoring, and administration.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Work together seamlessly with real-time collaboration and sharing features.',
  },
];

export default function HomePage() {
  return (
    
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      
      <Header />
      
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
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
                >
                  The Future of AI Workflow Creation
                </motion.div>
                
                <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
                  Build AI Agents
                  <span className="block bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Visually
                  </span>
                </h1>
                
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Create sophisticated LangGraph workflows with our intuitive 3D visual builder. 
                  No coding experience required - just drag, drop, and deploy.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8" asChild>
                  <Link to="/auth/signup">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                  <Link to="/products/ugraph">
                    Explore UGraph
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">1000+</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">Workflows Created</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative h-96 rounded-2xl bg-gradient-to-br from-primary/5 to-purple-500/5 border"
            >
              <Suspense fallback={<div className="h-full animate-pulse bg-muted rounded-2xl" />}>
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  3D Workflow Preview
                </div>
              </Suspense>
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent rounded-2xl" />
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
              Why Choose UGraph?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the next generation of AI workflow creation with our powerful, 
              yet intuitive platform designed for everyone.
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
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
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
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold text-white">
              Ready to Transform Your AI Workflow?
            </h2>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Join thousands of developers and teams who are already building the future with UGraph.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
                <Link to="/auth/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent border-white text-white hover:bg-white hover:text-primary" asChild>
                <Link to="/pricing">
                  View Pricing
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}