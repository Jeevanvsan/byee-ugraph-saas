export const config = {
  app: {
    name: 'UGraph',
    description: 'Visual AI Agent Orchestration Platform',
    version: '1.0.0',
  },
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  },
  auth: {
    tokenKey: 'ugraph_token',
    refreshTokenKey: 'ugraph_refresh_token',
  },
  stripe: {
    publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',
  },
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  },
  plans: {
    free: {
      name: 'Starter',
      price: 0,
      interval: 'month',
      features: [
        '7-day monitoring trial',
        'Local-only graphs',
        'Basic node types',
        'Community support'
      ],
      limits: {
        graphs: 5,
        monitoring: 7,
        apiCalls: 100,
        customAgents: false,
        serverSync: false,
        support: 'community'
      }
    },
    pro: {
      name: 'Professional',
      price: 29,
      interval: 'month',
      features: [
        'Unlimited monitoring',
        'Server sync enabled',
        'All node types',
        'Custom agents',
        'API key access',
        'Email support'
      ],
      limits: {
        graphs: 'unlimited',
        monitoring: 'unlimited',
        apiCalls: 10000,
        customAgents: true,
        serverSync: true,
        support: 'email'
      }
    },
    enterprise: {
      name: 'Enterprise',
      price: 99,
      interval: 'month',
      features: [
        'Everything in Pro',
        'Advanced admin controls',
        'SSO integration',
        'Priority support',
        'Custom integrations',
        'SLA guarantee'
      ],
      limits: {
        graphs: 'unlimited',
        monitoring: 'unlimited',
        apiCalls: 'unlimited',
        customAgents: true,
        serverSync: true,
        support: 'priority'
      }
    }
  }
} as const;