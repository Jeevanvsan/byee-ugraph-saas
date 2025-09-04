export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          avatar_url: string | null;
          plan: 'free' | 'pro' | 'enterprise';
          role: 'user' | 'admin' | 'owner';
          organization_id: string | null;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          avatar_url?: string | null;
          plan?: 'free' | 'pro' | 'enterprise';
          role?: 'user' | 'admin' | 'owner';
          organization_id?: string | null;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          avatar_url?: string | null;
          plan?: 'free' | 'pro' | 'enterprise';
          organization_id?: string | null;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: 'free' | 'pro' | 'enterprise';
          status: 'active' | 'cancelled' | 'expired' | 'trialing';
          billing_cycle: 'monthly' | 'annual';
          amount: number;
          user_type: 'individual' | 'organization_member';
          api_key: string | null;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          current_period_start: string;
          current_period_end: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan: 'free' | 'pro' | 'enterprise';
          status?: 'active' | 'cancelled' | 'expired' | 'trialing';
          billing_cycle: 'monthly' | 'annual';
          amount: number;
          user_type?: 'individual' | 'organization_member';
          api_key?: string | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          current_period_start?: string;
          current_period_end?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan?: 'free' | 'pro' | 'enterprise';
          status?: 'active' | 'cancelled' | 'expired' | 'trialing';
          billing_cycle?: 'monthly' | 'annual';
          amount?: number;
          user_type?: 'individual' | 'organization_member';
          api_key?: string | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          current_period_start?: string;
          current_period_end?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      workflows: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          nodes: any;
          edges: any;
          status: 'draft' | 'published' | 'archived';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          nodes?: any;
          edges?: any;
          status?: 'draft' | 'published' | 'archived';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          nodes?: any;
          edges?: any;
          status?: 'draft' | 'published' | 'archived';
          created_at?: string;
          updated_at?: string;
        };
      };
      usage_metrics: {
        Row: {
          id: string;
          user_id: string;
          metric_type: string;
          metric_value: number;
          recorded_at: string;
          metadata: any;
        };
        Insert: {
          id?: string;
          user_id: string;
          metric_type: string;
          metric_value?: number;
          recorded_at?: string;
          metadata?: any;
        };
        Update: {
          id?: string;
          user_id?: string;
          metric_type?: string;
          metric_value?: number;
          recorded_at?: string;
          metadata?: any;
        };
      };
      email_logs: {
        Row: {
          id: string;
          user_id: string;
          email_type: string;
          recipient_email: string;
          subject: string;
          status: 'sent' | 'failed' | 'pending';
          sent_at: string | null;
          error_message: string | null;
          metadata: any;
        };
        Insert: {
          id?: string;
          user_id: string;
          email_type: string;
          recipient_email: string;
          subject: string;
          status?: 'sent' | 'failed' | 'pending';
          sent_at?: string | null;
          error_message?: string | null;
          metadata?: any;
        };
        Update: {
          id?: string;
          user_id?: string;
          email_type?: string;
          recipient_email?: string;
          subject?: string;
          status?: 'sent' | 'failed' | 'pending';
          sent_at?: string | null;
          error_message?: string | null;
          metadata?: any;
        };
      };
      testimonials: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          email: string;
          company: string | null;
          position: string | null;
          avatar_url: string | null;
          content: string;
          rating: number;
          product: 'ugraph' | 'secureflow' | 'ai-connect' | 'team-workspace';
          status: 'pending' | 'approved' | 'rejected';
          is_featured: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          email: string;
          company?: string | null;
          position?: string | null;
          avatar_url?: string | null;
          content: string;
          rating?: number;
          product?: 'ugraph' | 'secureflow' | 'ai-connect' | 'team-workspace';
          status?: 'pending' | 'approved' | 'rejected';
          is_featured?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          email?: string;
          company?: string | null;
          position?: string | null;
          avatar_url?: string | null;
          content?: string;
          rating?: number;
          product?: 'ugraph' | 'secureflow' | 'ai-connect' | 'team-workspace';
          status?: 'pending' | 'approved' | 'rejected';
          is_featured?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      organization_memberships: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string;
          role: 'owner' | 'admin' | 'member';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          user_id: string;
          role?: 'owner' | 'admin' | 'member';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          user_id?: string;
          role?: 'owner' | 'admin' | 'member';
          created_at?: string;
          updated_at?: string;
        };
      };
      website_admins: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      organization_subscriptions: {
        Row: {
          id: string;
          organization_id: string;
          product_slug: string;
          plan: 'free' | 'pro' | 'enterprise';
          status: 'active' | 'cancelled' | 'expired' | 'trialing';
          api_key: string;
          billing_cycle: 'monthly' | 'annual';
          amount: number;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          current_period_start: string;
          current_period_end: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          product_slug: string;
          plan: 'free' | 'pro' | 'enterprise';
          status?: 'active' | 'cancelled' | 'expired' | 'trialing';
          api_key: string;
          billing_cycle: 'monthly' | 'annual';
          amount: number;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          current_period_start?: string;
          current_period_end?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          product_slug?: string;
          plan?: 'free' | 'pro' | 'enterprise';
          status?: 'active' | 'cancelled' | 'expired' | 'trialing';
          api_key?: string;
          billing_cycle?: 'monthly' | 'annual';
          amount?: number;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          current_period_start?: string;
          current_period_end?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          icon: string;
          status: 'hot' | 'latest' | 'coming_soon' | 'beta' | 'active';
          route: string;
          gradient_colors: string;
          button_text: string;
          users_count: string | null;
          workflows_count: string | null;
          uptime: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description: string;
          icon: string;
          status: 'hot' | 'latest' | 'coming_soon' | 'beta' | 'active';
          route: string;
          gradient_colors?: string;
          button_text?: string;
          users_count?: string | null;
          workflows_count?: string | null;
          uptime?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          icon?: string;
          status?: 'hot' | 'latest' | 'coming_soon' | 'beta' | 'active';
          route?: string;
          gradient_colors?: string;
          button_text?: string;
          users_count?: string | null;
          workflows_count?: string | null;
          uptime?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
