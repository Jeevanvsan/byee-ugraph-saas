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

const founder = {
  name: 'Jeevan Varghese',
  roles: ['Founder', 'CEO', 'Lead Developer'],
  avatar: '/public/img/ceo_pic.jpg',
  icon: 'JV',
  description: 'Data and AI Engineer an AI enthusiast with a vision to democratize AI workflow creation. Combines technical expertise with entrepreneurial spirit to build tools that empower businesses of all sizes to harness the power of artificial intelligence.',
  linkedin: 'https://www.linkedin.com/in/jeevan-varghese-1a5237214/',
  // stats: [
  //   { label: 'Years Experience', value: '2+' },
  //   { label: 'Technologies Mastered', value: '10+' },
  //   { label: 'Innovation Drive', value: '∞' }
  // ]
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <Header />
      
      <div className="container mx-auto">

        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 max-w-5xl mx-auto"
        >
          <h1 className="text-6xl font-bold mb-6">About SandVar</h1>
          <p className="text-2xl text-muted-foreground leading-relaxed">
            SandVar was founded with one mission — to make artificial intelligence
            development accessible, visual, and intuitive for everyone. We believe
            the future of AI belongs not just to engineers, but to every creator
            with an idea.
          </p>

          {/* Contact Emails */}
          <div className="mt-8 space-y-2 text-lg">
            <p className="text-muted-foreground">
              📧 <a href="mailto:support@sandvar.in" className="text-primary hover:underline">support@sandvar.in</a>
            </p>
          </div>
        </motion.div>

        {/* Mission / Vision / Values */}
        <div className="grid lg:grid-cols-3 gap-12 mb-20">
          {[
            {
              icon: Target,
              title: "Our Mission",
              text: "Democratize AI development with visual tools that empower anyone to build sophisticated systems without code."
            },
            {
              icon: Zap,
              title: "Our Vision",
              text: "A world where AI creation is as simple as sketching an idea, enabling innovation from classrooms to boardrooms."
            },
            {
              icon: Award,
              title: "Our Values",
              text: "Innovation, accessibility, and empowerment guide every decision we make, ensuring technology serves everyone."
            }
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center p-8 rounded-3xl bg-background shadow-lg"
            >
              <item.icon className="h-16 w-16 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-lg text-muted-foreground">{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Founder Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold mb-6">Meet the Founder</h2>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto">
              Driven by innovation and a passion for making AI accessible to everyone, 
              our founder leads the charge in revolutionizing workflow automation.
            </p>
          </motion.div>

          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 max-w-2xl w-full bg-gradient-to-br from-background to-muted/20">
                <CardHeader className="text-center pb-6">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 via-purple-500/20 to-blue-500/20 flex items-center justify-center relative">
                    <div className="w-28 h-28 rounded-full overflow-hidden bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                        <img 
                          src={founder.avatar} 
                          alt={founder.icon} 
                          className="w-full h-full object-cover"
                        />
                      </div>

                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  
                  <CardTitle className="text-3xl mb-4">{founder.name}</CardTitle>
                  <div className="flex flex-wrap justify-center gap-3 mb-6">
                    {founder.roles.map((role, idx) => (
                      <Badge key={idx} className={`${
                        idx === 0 ? 'bg-primary/10 text-primary border-primary/20' :
                        idx === 1 ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {role}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                    {founder.description}
                  </p>
                  
                  {/*
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {founder.stats.map((stat, idx) => (
                      <div key={idx} className="text-center p-4 rounded-2xl bg-muted/50">
                        <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  */}             
                  
                  <Button variant="outline" size="lg" className="w-full md:w-auto px-8" asChild>
                    <a href={founder.linkedin} target="_blank" rel="noopener noreferrer">
                      Connect on LinkedIn
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold mb-10 text-center">Our Journey</h3>
          <div className="space-y-8 max-w-3xl mx-auto">
            {[
              { year: "2024", event: "Founded SandVar with the vision to simplify AI development." },
              { year: "2025", event: "Expanded to enterprise AI orchestration and multi-agent workflows." }
            ].map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                  {milestone.year}
                </div>
                <p className="text-lg text-muted-foreground">{milestone.event}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mt-20"
        >
          <h3 className="text-4xl font-bold mb-6">Let’s Build the Future Together</h3>
          <p className="text-lg text-muted-foreground mb-8">
            Have questions or want to collaborate? Reach out — we’d love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" asChild>
              <a href="mailto:support@sandvar.in">Get Support</a>
            </Button>
          </div>
        </motion.div>

        
      </div>
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
                      <li><Link to="/products/ugraph" className="hover:text-white transition-colors">UGraph</Link></li>
                      <li><Link to="/products/ugraph/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
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
