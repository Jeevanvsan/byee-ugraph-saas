import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Zap,
  Users,
  Building,
  Globe,
  Shield,
  Star,
  CheckCircle,
  Layers,
  Bot,
  Workflow,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';
import { db } from '@/lib/database';

// Icon mapping
const getIconComponent = (iconName: string) => {
  const iconProps = { className: "w-7 h-7" };
  const icons: Record<string, JSX.Element> = {
    Zap: <Zap {...iconProps} />,
    Users: <Users {...iconProps} />,
    Building: <Building {...iconProps} />,
    Globe: <Globe {...iconProps} />,
    Shield: <Shield {...iconProps} />,
    Star: <Star {...iconProps} />,
    Layers: <Layers {...iconProps} />,
    Bot: <Bot {...iconProps} />,
    Workflow: <Workflow {...iconProps} />,
  };
  return icons[iconName] || <Zap {...iconProps} />;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const activeProducts = await db.getActiveProducts();
        setProducts(activeProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Header />

      {/* Breadcrumb */}
      <section className="py-4 px-6 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto">
          <nav className="flex items-center space-x-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-primary transition-colors">SandVar</Link>
            <span>›</span>
            <span className="text-white font-medium">Products</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        {/* Background Gradient Orbs */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge className="mb-6 bg-gradient-to-r from-primary to-purple-600 text-white px-5 py-2 text-sm font-semibold">
              🌟 AI-Powered Workflow Suite
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-white via-primary to-purple-300 bg-clip-text text-transparent">
                Build Smarter, Not Harder
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
              Discover the next generation of AI-driven tools that turn complex workflows into intuitive visual experiences.
            </p>

            <Button
              asChild
              size="lg"
              className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Link to="/signup">
                Start Building Free <ArrowRight className="ml-3 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Products Grid - Alternating Layout */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black z-0"></div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-6xl mx-auto space-y-32">
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary"></div>
              </div>
            ) : (
              products.map((product, index) => {
                const isEven = index % 2 === 0;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: isEven ? -60 : 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className={`flex flex-col md:flex-row items-center gap-12 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    {/* Image / Visual Placeholder */}
                    <div className="md:w-1/2">
                      <div
                        className={`relative overflow-hidden rounded-3xl border border-gray-700 bg-gradient-to-br ${product.gradientColors} p-8 shadow-2xl`}
                      >
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                          {getIconComponent(product.icon)}
                        </div>
                        <div className="mt-6 text-2xl font-bold">{product.name}</div>
                        <div className="text-sm opacity-90 mt-2">{product.description.split('.')[0]}.</div>

                        {/* Decorative Elements */}
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
                          <div className="absolute -top-10 -left-10 w-24 h-24 bg-primary/10 rounded-full blur-lg"></div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="md:w-1/2 space-y-6">
                      {product.status === 'hot' && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-4 py-1.5 shadow-lg">
                          🔥 Most Popular
                        </Badge>
                      )}

                      <h2 className="text-4xl font-bold">{product.name}</h2>
                      <p className="text-lg text-gray-300 leading-relaxed">{product.description}</p>

                      <ul className="space-y-2">
                        {product.features?.slice(0, 3).map((feature: string, i: number) => (
                          <li key={i} className="flex items-center text-gray-400">
                            <CheckCircle className="w-5 h-5 text-primary mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <Button
                        asChild
                        className={`bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white px-8 py-6 rounded-2xl font-medium text-lg transition-all duration-300 transform hover:scale-105 shadow-lg`}
                      >
                        <Link to={product.route} className="flex items-center">
                          {product.buttonText}
                          <ArrowRight className="ml-3 w-5 h-5" />
                        </Link>
                      </Button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-28 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-900/10 to-blue-900/10 z-0"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>

        <div className="container mx-auto relative z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold mb-6 text-transparent bg-gradient-to-r from-white to-gray-300 bg-clip-text">
              Ready to Build the Future?
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Join innovators from around the world using SandVar to accelerate AI development.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-black hover:bg-gray-200 text-lg px-10 py-7 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                <Link to="/signup">Start Free</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 text-lg px-10 py-7 rounded-full font-medium transition-all transform hover:scale-105"
              >
                <Link to="/docs">View Docs</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-16 text-gray-400">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">SandVar</h3>
              <p className="mb-4">Empowering builders with visual AI orchestration.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/products/ugraph" className="hover:text-primary transition-colors">UGraph</Link></li>
                <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link to="/changelog" className="hover:text-primary transition-colors">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="/docs" className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>&copy; 2025 SandVar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}