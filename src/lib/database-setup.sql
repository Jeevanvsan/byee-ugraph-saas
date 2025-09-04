-- Database Schema for Byee.in UGraph SaaS Platform
-- This script sets up the complete database structure with RLS policies

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS email_logs CASCADE;
DROP TABLE IF EXISTS usage_metrics CASCADE;
DROP TABLE IF EXISTS workflows CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product TEXT NOT NULL DEFAULT 'ugraph' CHECK (product IN ('ugraph', 'secureflow')),
  plan TEXT NOT NULL CHECK (plan IN ('free', 'pro', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'trialing')),
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'annual')),
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 month'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product, status) -- Only one active subscription per user per product
);

-- Create workflows table
CREATE TABLE workflows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product TEXT NOT NULL DEFAULT 'ugraph' CHECK (product IN ('ugraph', 'secureflow')),
  name TEXT NOT NULL,
  description TEXT,
  nodes JSONB DEFAULT '[]'::jsonb,
  edges JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create usage_metrics table
CREATE TABLE usage_metrics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  metric_type TEXT NOT NULL,
  metric_value INTEGER NOT NULL DEFAULT 0,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create email_logs table
CREATE TABLE email_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email_type TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('sent', 'failed', 'pending')),
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create products table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('hot', 'latest', 'coming_soon', 'beta', 'active')),
  route TEXT NOT NULL,
  gradient_colors TEXT NOT NULL DEFAULT 'from-primary/10 to-purple-500/10',
  button_text TEXT NOT NULL DEFAULT 'Get Started',
  users_count TEXT,
  workflows_count TEXT,
  uptime TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create testimonials table
CREATE TABLE testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  position TEXT,
  avatar_url TEXT,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  product TEXT DEFAULT 'ugraph' CHECK (product IN ('ugraph', 'secureflow', 'ai-connect', 'team-workspace')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX profiles_email_idx ON profiles(email);
CREATE INDEX profiles_plan_idx ON profiles(plan);
CREATE INDEX subscriptions_user_id_idx ON subscriptions(user_id);
CREATE INDEX subscriptions_status_idx ON subscriptions(status);
CREATE INDEX workflows_user_id_idx ON workflows(user_id);
CREATE INDEX workflows_status_idx ON workflows(status);
CREATE INDEX usage_metrics_user_id_idx ON usage_metrics(user_id);
CREATE INDEX usage_metrics_type_idx ON usage_metrics(metric_type);
CREATE INDEX email_logs_user_id_idx ON email_logs(user_id);
CREATE INDEX email_logs_status_idx ON email_logs(status);
CREATE INDEX products_status_idx ON products(status);
CREATE INDEX products_sort_order_idx ON products(sort_order);
CREATE INDEX testimonials_status_idx ON testimonials(status);
CREATE INDEX testimonials_product_idx ON testimonials(product);
CREATE INDEX testimonials_featured_idx ON testimonials(is_featured);
CREATE INDEX testimonials_display_order_idx ON testimonials(display_order);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for workflows
CREATE POLICY "Users can view own workflows" ON workflows
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workflows" ON workflows
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workflows" ON workflows
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workflows" ON workflows
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for usage_metrics
CREATE POLICY "Users can view own usage metrics" ON usage_metrics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage metrics" ON usage_metrics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for email_logs (read-only for users)
CREATE POLICY "Users can view own email logs" ON email_logs
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for products (public read, admin write)
CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for testimonials
CREATE POLICY "Anyone can view approved testimonials" ON testimonials
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can view own testimonials" ON testimonials
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own testimonials" ON testimonials
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own testimonials" ON testimonials
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all testimonials" ON testimonials
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON workflows
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'User')
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the signup
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to check workflow limits based on subscription
CREATE OR REPLACE FUNCTION check_workflow_limit()
RETURNS TRIGGER AS $$
DECLARE
  user_plan TEXT;
  current_count INTEGER;
  max_workflows INTEGER;
BEGIN
  -- Get user's current plan
  SELECT plan INTO user_plan FROM profiles WHERE id = NEW.user_id;
  
  -- Count current workflows
  SELECT COUNT(*) INTO current_count FROM workflows 
  WHERE user_id = NEW.user_id AND status != 'archived';
  
  -- Set limits based on plan
  CASE user_plan
    WHEN 'free' THEN max_workflows := 5;
    WHEN 'pro' THEN max_workflows := 50;
    WHEN 'enterprise' THEN max_workflows := 999999; -- Unlimited
    ELSE max_workflows := 5; -- Default to free
  END CASE;
  
  IF current_count >= max_workflows THEN
    RAISE EXCEPTION 'Workflow limit exceeded for % plan. Upgrade to create more workflows.', user_plan;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for workflow limit checking
CREATE TRIGGER check_workflow_limit_trigger
  BEFORE INSERT ON workflows
  FOR EACH ROW EXECUTE FUNCTION check_workflow_limit();

-- Insert default products
INSERT INTO products (name, slug, description, icon, status, route, gradient_colors, button_text, users_count, workflows_count, uptime, sort_order) VALUES
('UGraph', 'ugraph', 'Most demanded visual AI workflow builder. Create complex AI systems effortlessly.', 'Zap', 'hot', '/products/ugraph', 'from-orange-500/10 via-red-500/10 to-pink-500/10', 'Get Started', '10K+', '50K+', '99.9%', 1),
('SecureFlow', 'secureflow', 'Latest enterprise-grade security and compliance for your AI workflows.', 'Shield', 'latest', '/products/secureflow', 'from-primary/10 via-purple-500/10 to-blue-500/10', 'Explore', '100+', '24/7', 'SOC 2', 4),
('AI Connect', 'ai-connect', 'Seamlessly integrate multiple AI models and APIs into your workflows.', 'Globe', 'beta', '/products/ai-connect', 'from-blue-500/10 via-cyan-500/10 to-teal-500/10', 'Try Beta', '50K+', '100K+', '99.95%', 2),
('Team Workspace', 'team-workspace', 'Collaborative AI workflow development with real-time team features.', 'Users', 'coming_soon', '#', 'from-purple-500/10 via-pink-500/10 to-rose-500/10', 'Notify Me', '1K+', '10K+', '99.8%', 3);

-- Insert sample testimonials (these will be publicly visible)
INSERT INTO testimonials (name, email, company, position, content, rating, product, status, is_featured, display_order) VALUES
('Sarah Johnson', 'sarah@techcorp.com', 'TechCorp Solutions', 'CTO', 'UGraph has revolutionized how we build AI workflows. The visual interface makes complex AI systems accessible to our entire team, not just developers.', 5, 'ugraph', 'approved', true, 1),
('Michael Chen', 'michael@innovateai.com', 'InnovateAI', 'Lead AI Engineer', 'The drag-and-drop functionality in UGraph saved us months of development time. We built our entire recommendation system in just two weeks!', 5, 'ugraph', 'approved', true, 2),
('Emily Rodriguez', 'emily@dataflow.io', 'DataFlow Inc', 'Product Manager', 'SecureFlow gives us the enterprise-grade security we need for our AI workflows. The compliance features are outstanding.', 5, 'secureflow', 'approved', true, 3),
('David Kim', 'david@startupx.com', 'StartupX', 'Founder', 'As a non-technical founder, UGraph allowed me to prototype AI solutions without hiring a full development team. Game changer!', 5, 'ugraph', 'approved', false, 4),
('Lisa Wang', 'lisa@aiventures.com', 'AI Ventures', 'Senior Developer', 'The integration capabilities of AI Connect are phenomenal. We connected 5 different AI models seamlessly.', 4, 'ai-connect', 'approved', false, 5),
('James Thompson', 'james@enterprise.com', 'Enterprise Corp', 'IT Director', 'Team Workspace has transformed our collaborative AI development process. Real-time editing and version control are perfect.', 5, 'team-workspace', 'approved', false, 6);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
