import { supabase } from './supabase';
import { Database } from '@/types/database';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  productId: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired' | 'trialing';
  billingCycle: 'monthly' | 'annual';
  amount: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  createdAt: string;
  updatedAt: string;
}

export interface Workflow {
  id: string;
  userId: string;
  name: string;
  description?: string;
  nodes: Record<string, unknown>[];
  edges: Record<string, unknown>[];
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  userId?: string;
  name: string;
  email: string;
  company?: string;
  position?: string;
  avatarUrl?: string;
  content: string;
  rating: number;
  product: 'orrery' | 'secureflow' | 'ai-connect' | 'team-workspace';
  status: 'pending' | 'approved' | 'rejected';
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  status: 'hot' | 'latest' | 'coming_soon' | 'beta' | 'active';
  route: string;
  gradientColors: string;
  buttonText: string;
  usersCount: string | null;
  workflowsCount: string | null;
  uptime: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

class SupabaseDatabase {
  // User operations
  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error) return null;
    return this.transformProfile(data);
  }

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return this.transformProfile(data);
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        first_name: updates.firstName,
        last_name: updates.lastName,
        avatar_url: updates.avatar,
        plan: updates.plan,
        is_verified: updates.isVerified,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.transformProfile(data);
  }

  // Subscription operations
  async createSubscription(subData: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>): Promise<Subscription> {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: subData.userId,
        product_id: subData.productId,
        plan: subData.plan,
        status: subData.status,
        billing_cycle: subData.billingCycle,
        amount: subData.amount,
        current_period_start: subData.currentPeriodStart,
        current_period_end: subData.currentPeriodEnd,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.transformSubscription(data);
  }

  async getSubscriptionByUserId(userId: string): Promise<Subscription | null> {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error) return null;
    return this.transformSubscription(data);
  }

  async updateSubscription(id: string, updates: Partial<Subscription>): Promise<Subscription> {
    const { data, error } = await supabase
      .from('subscriptions')
      .update({
        plan: updates.plan,
        status: updates.status,
        billing_cycle: updates.billingCycle,
        amount: updates.amount,
        current_period_start: updates.currentPeriodStart,
        current_period_end: updates.currentPeriodEnd,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.transformSubscription(data);
  }

  // Workflow operations
  async createWorkflow(workflowData: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>): Promise<Workflow> {
    const { data, error } = await supabase
      .from('workflows')
      .insert({
        user_id: workflowData.userId,
        name: workflowData.name,
        description: workflowData.description,
        nodes: workflowData.nodes,
        edges: workflowData.edges,
        status: workflowData.status,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.transformWorkflow(data);
  }

  async getWorkflowsByUserId(userId: string): Promise<Workflow[]> {
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(this.transformWorkflow);
  }

  async getWorkflowById(id: string): Promise<Workflow | null> {
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return this.transformWorkflow(data);
  }

  async updateWorkflow(id: string, updates: Partial<Workflow>): Promise<Workflow> {
    const { data, error } = await supabase
      .from('workflows')
      .update({
        name: updates.name,
        description: updates.description,
        nodes: updates.nodes,
        edges: updates.edges,
        status: updates.status,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.transformWorkflow(data);
  }

  async deleteWorkflow(id: string): Promise<void> {
    const { error } = await supabase
      .from('workflows')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }

  // Testimonial operations
  async createTestimonial(testimonialData: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>): Promise<Testimonial> {
    const { data, error } = await supabase
      .from('testimonials')
      .insert({
        user_id: testimonialData.userId || null,
        name: testimonialData.name,
        email: testimonialData.email,
        company: testimonialData.company || null,
        position: testimonialData.position || null,
        avatar_url: testimonialData.avatarUrl || null,
        content: testimonialData.content,
        rating: testimonialData.rating,
        product: testimonialData.product,
        status: testimonialData.status,
        is_featured: testimonialData.isFeatured,
        display_order: testimonialData.displayOrder,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.transformTestimonial(data);
  }

  async getApprovedTestimonials(product?: string): Promise<Testimonial[]> {
    let query = supabase
      .from('testimonials')
      .select('*')
      .eq('status', 'approved')
      .order('display_order', { ascending: true });

    if (product) {
      query = query.eq('product', product);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    return data.map(this.transformTestimonial);
  }

  async getFeaturedTestimonials(limit: number = 3): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('status', 'approved')
      .eq('is_featured', true)
      .order('display_order', { ascending: true })
      .limit(limit);

    if (error) throw new Error(error.message);
    return data.map(this.transformTestimonial);
  }

  async getTestimonialsByUserId(userId: string): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(this.transformTestimonial);
  }

  async updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial> {
    const { data, error } = await supabase
      .from('testimonials')
      .update({
        name: updates.name,
        email: updates.email,
        company: updates.company || null,
        position: updates.position || null,
        avatar_url: updates.avatarUrl || null,
        content: updates.content,
        rating: updates.rating,
        product: updates.product,
        status: updates.status,
        is_featured: updates.isFeatured,
        display_order: updates.displayOrder,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.transformTestimonial(data);
  }

  async deleteTestimonial(id: string): Promise<void> {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }

  // Product operations
  async getActiveProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw new Error(error.message);
    return data.map(this.transformProduct);
  }

  async getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw new Error(error.message);
    return data.map(this.transformProduct);
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) return null;
    return this.transformProduct(data);
  }

  // Analytics and stats
  async getUserStats(userId: string): Promise<{
    totalWorkflows: number;
    activeWorkflows: number;
    plan: string;
    subscriptionStatus: string;
  }> {
    const [workflows, subscription, user] = await Promise.all([
      this.getWorkflowsByUserId(userId),
      this.getSubscriptionByUserId(userId),
      this.getUserById(userId),
    ]);

    return {
      totalWorkflows: workflows.length,
      activeWorkflows: workflows.filter(w => w.status === 'published').length,
      plan: user?.plan || 'free',
      subscriptionStatus: subscription?.status || 'inactive',
    };
  }

  // Transform functions
  private transformProfile(profile: Database['public']['Tables']['profiles']['Row']): User {
    return {
      id: profile.id,
      email: profile.email,
      firstName: profile.first_name,
      lastName: profile.last_name,
      avatar: profile.avatar_url || undefined,
      plan: profile.plan,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
      isVerified: profile.is_verified,
    };
  }

  private transformSubscription(sub: Database['public']['Tables']['subscriptions']['Row']): Subscription {
    return {
      id: sub.id,
      userId: sub.user_id,
      productId: 'orrery', // Default product since it's not in the current schema
      plan: sub.plan,
      status: sub.status,
      billingCycle: sub.billing_cycle,
      amount: sub.amount,
      currentPeriodStart: sub.current_period_start,
      currentPeriodEnd: sub.current_period_end,
      createdAt: sub.created_at,
      updatedAt: sub.updated_at,
    };
  }

  private transformWorkflow(workflow: Database['public']['Tables']['workflows']['Row']): Workflow {
    return {
      id: workflow.id,
      userId: workflow.user_id,
      name: workflow.name,
      description: workflow.description || undefined,
      nodes: Array.isArray(workflow.nodes) ? workflow.nodes : [],
      edges: Array.isArray(workflow.edges) ? workflow.edges : [],
      status: workflow.status,
      createdAt: workflow.created_at,
      updatedAt: workflow.updated_at,
    };
  }

  private transformTestimonial(testimonial: Database['public']['Tables']['testimonials']['Row']): Testimonial {
    return {
      id: testimonial.id,
      userId: testimonial.user_id || undefined,
      name: testimonial.name,
      email: testimonial.email,
      company: testimonial.company || undefined,
      position: testimonial.position || undefined,
      avatarUrl: testimonial.avatar_url || undefined,
      content: testimonial.content,
      rating: testimonial.rating,
      product: testimonial.product,
      status: testimonial.status,
      isFeatured: testimonial.is_featured,
      displayOrder: testimonial.display_order,
      createdAt: testimonial.created_at,
      updatedAt: testimonial.updated_at,
    };
  }

  private transformProduct(product: any): Product {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      icon: product.icon,
      status: product.status,
      route: product.route,
      gradientColors: product.gradient_colors,
      buttonText: product.button_text,
      usersCount: product.users_count,
      workflowsCount: product.workflows_count,
      uptime: product.uptime,
      isActive: product.is_active,
      sortOrder: product.sort_order,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    };
  }
}

export const db = new SupabaseDatabase();
