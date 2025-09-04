import React, { useState, useEffect } from 'react';
import { Linkedin, Github } from "lucide-react";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Target, Zap, Globe, Shield, Star, CheckCircle, TrendingUp, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';
import { statsService, CompanyStats } from '@/lib/statsService';
import { productsService, Product } from '@/lib/productsService';
import { testimonialsService, Testimonial } from '@/lib/testimonialsService';




const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K+`;
  return `${num}+`;
};


const services = [
  {
    icon: Zap,
    title: 'Visual AI Workflows',
    description: 'Create sophisticated AI systems with our intuitive drag-and-drop interface. No coding required.',
    features: ['3D Visual Builder', 'Real-time Collaboration', 'User friendly UI']
  },
  {
    icon: Globe,
    title: 'Enterprise Solutions',
    description: 'Scalable AI infrastructure designed for enterprise requirements with advanced security.',
    features: ['SSO Integration', 'Advanced Analytics', 'Custom Deployment']
  },
  {
    icon: Shield,
    title: 'AI Orchestration',
    description: 'Orchestrate complex AI agent workflows with LangGraph integration and monitoring.',
    features: ['Multi-Agent Systems', 'Workflow Monitoring', 'Performance Analytics']
  }
];

export default function CompanyHomePage() {
  const [stats, setStats] = useState<CompanyStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]); // <-- from DB

  useEffect(() => {
    const loadData = async () => {
      const [companyStats, productsList, testimonialsList] = await Promise.all([
        statsService.getCompanyStats(),
        productsService.getActiveProducts(),
        testimonialsService.getApprovedTestimonials()
      ]);
      setStats(companyStats);
      setProducts(productsList);
      setTestimonials(testimonialsList);
    };
    loadData();
  }, []);

  const statsDisplay = stats ? [
    { label: 'Active Users', value: formatNumber(stats.activeUsers), icon: Users },
    { label: 'Projects Deployed', value: formatNumber(stats.projectsDeployed), icon: Zap },
    { label: 'Countries Served', value: `${stats.countriesServed}+`, icon: Globe },
    { label: 'Team Members', value: `${stats.teamMembers}+`, icon: Users }
  ] : [
    { label: 'Active Users', value: '...', icon: Users },
    { label: 'Projects Deployed', value: '...', icon: Zap },
    { label: 'Countries Served', value: '...', icon: Globe },
    { label: 'Team Members', value: '...', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-blue-500/5" />
        <div className="container mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-5xl mx-auto"
          >
            <Badge className="mb-8 bg-primary/10 text-primary border-primary/20 text-lg px-6 py-2">
              🚀 The Future of AI Workflow Creation
            </Badge>
            
            <h1 className="text-6xl lg:text-7xl font-bold tracking-tight mb-8">
              Build AI Systems
              <span className="block bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Visually & Intuitively
              </span>
            </h1>
            
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto mb-12">
              SandVar revolutionizes AI development with our visual workflow builder. 
              Create, deploy, and scale sophisticated AI systems without writing complex code.
            </p>
            
            {/* Products Showcase with 3D Effects */}
            <div className="mb-16">
              <h2 className="text-4xl font-bold text-center mb-12">Our Products</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {products.map((product, index) => {
                  const IconComponent = product.icon === 'Zap' ? Zap : 
                                      product.icon === 'Globe' ? Globe :
                                      product.icon === 'Users' ? Users :
                                      product.icon === 'Shield' ? Shield : Zap;
                  
                  const getStatusBadge = (status: string) => {
                    switch(status) {
                      case 'hot': return { text: '🔥 Hot', class: 'bg-orange-500/10 text-orange-400 border-orange-500/20' };
                      case 'latest': return { text: '✨ Latest', class: 'bg-green-500/10 text-green-400 border-green-500/20' };
                      case 'beta': return { text: '🧪 Beta', class: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
                      case 'coming_soon': return { text: 'Coming Soon', class: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
                      default: return { text: 'New', class: 'bg-gray-500/10 text-gray-400 border-gray-500/20' };
                    }
                  };
                  
                  const statusBadge = getStatusBadge(product.status);
                  const isComingSoon = product.status === 'coming_soon';
                  
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, rotateY: -15, z: -50 }}
                      animate={{ opacity: 1, rotateY: 0, z: 0 }}
                      transition={{ duration: 0.8, delay: 0.1 * (index + 1) }}
                      whileHover={{ 
                        scale: 1.05, 
                        rotateY: 5, 
                        z: 20,
                        transition: { duration: 0.3 }
                      }}
                      className={`group relative bg-gradient-to-br ${product.gradient_colors} backdrop-blur-sm rounded-3xl p-6 border border-opacity-20 hover:border-opacity-40 ${product.status === 'hot' ? 'overflow-hidden' : ''}`}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-current/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {product.status === 'hot' && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center animate-pulse">
                          <span className="text-xs font-bold text-white">🔥</span>
                        </div>
                      )}
                      <div className="relative z-10">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center">
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <Badge className={`mb-3 text-sm px-3 py-1 ${statusBadge.class}`}>
                          {statusBadge.text}
                        </Badge>
                        <h3 className="text-xl font-bold mb-3">{product.name}</h3>
                        <p className="text-muted-foreground mb-4 text-sm">{product.description}</p>
                        <Button 
                          disabled={isComingSoon}
                          className={`w-full ${isComingSoon ? 'opacity-60' : 'group-hover:bg-primary/90 transition-colors'}`} 
                          variant={product.status === 'beta' ? 'outline' : 'default'}
                          asChild={!isComingSoon}
                        >
                          {isComingSoon ? (
                            <>
                              {product.button_text}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          ) : (
                            <Link to={product.route}>
                              {product.button_text}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {statsDisplay.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 * index }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold mb-6">About SandVar</h2>
            <p className="text-2xl text-muted-foreground max-w-4xl mx-auto">
              Founded by AI visionaries, we're democratizing artificial intelligence by making 
              complex workflow creation accessible to everyone.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Target className="h-16 w-16 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-lg text-muted-foreground">
                To democratize AI development by providing intuitive tools that enable 
                anyone to build sophisticated artificial intelligence systems.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Zap className="h-16 w-16 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-lg text-muted-foreground">
                A world where AI development is visual, collaborative, and accessible to 
                creators of all technical backgrounds.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Award className="h-16 w-16 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4">Our Values</h3>
              <p className="text-lg text-muted-foreground">
                Innovation, accessibility, and empowerment drive everything we do. 
                We believe in making AI creation intuitive and powerful.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      

      {/* Services Section */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold mb-6">Our Services</h2>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive AI workflow solutions for individuals, teams, and enterprises.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <service.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{service.title}</CardTitle>
                    <CardDescription className="text-lg">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                          <span>{feature}</span>
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
      

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-primary via-purple-600 to-blue-600">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-5xl font-bold text-white mb-8">
              Ready to Transform Your AI Development?
            </h2>
            <p className="text-2xl text-white/90 mb-12">
              Join the AI revolution. Start building sophisticated workflows today with our intuitive platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">SandVar</h3>
              <p className="text-gray-400 mb-6 text-lg">
                Building the future of AI workflow orchestration with innovative visual tools and intuitive interfaces.
              </p>
              {/* Company Emails */}
            <div className="space-y-2 mb-6">
              <p className="text-gray-400 text-lg">
                📧 <a href="mailto:support@sandvar.in" className="hover:text-white transition-colors">support@sandvar.in</a>
              </p>
            </div>
              <div className="flex space-x-6">
                  {/* X Logo */}
                  <a
                    href="https://x.com/sandvar_in"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 300 300"
                      className="h-6 w-6 text-gray-400 hover:text-white transition-colors fill-current"
                    >
                      {/* Equivalent simplified path of the public domain X logo */}
                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontFamily="Blackboard-Bold, sans-serif"
                        fontWeight="bold"
                        fontSize="200"
                      >
                        X
                      </text>
                    </svg>
                  </a>

                  {/* LinkedIn */}
                  <a href="https://www.linkedin.com/company/sandvar" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-6 w-6 text-gray-400 hover:text-white transition-colors" />
                  </a>

                  {/* GitHub 
                  <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
                    <Github className="h-6 w-6 text-gray-400 hover:text-white transition-colors" />
                  </a>
                  */}
                </div>

            </div>
            <div>
              <h4 className="font-bold mb-6 text-lg">Product</h4>
              <ul className="space-y-4 text-gray-400">
                <li><Link to="/products/orrery" className="hover:text-white transition-colors">Orrery</Link></li>
                <li><Link to="/products/orrery/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-lg">Company</h4>
              <ul className="space-y-4 text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-lg">Legal</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="/security" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p className="text-lg">&copy; 2025 SandVar. All rights reserved. </p>
          </div>
        </div>
      </footer>
    </div>
  );
}