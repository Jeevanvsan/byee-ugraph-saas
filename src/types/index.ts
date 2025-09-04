export interface User {
  id: string;
  name: string;
  email: string;
  provider: 'email' | 'google';
  plan: 'free' | 'pro' | 'enterprise';
  apiKey?: string;
  role: 'user' | 'admin';
  theme: 'light' | 'dark' | 'system';
  trialEndsAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Graph {
  id: string;
  userId: string;
  name: string;
  description?: string;
  graphData: GraphData;
  isCustomAgent: boolean;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  viewport?: { x: number; y: number; zoom: number };
}

export interface GraphNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: NodeData;
  width?: number;
  height?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: string;
}

export type NodeType = 
  | 'aiagent'
  | 'llm'
  | 'prompt'
  | 'condition'
  | 'tool'
  | 'code'
  | 'document'
  | 'retriever'
  | 'custom';

export interface NodeData {
  label: string;
  description?: string;
  config: Record<string, unknown>;
  inputs?: Port[];
  outputs?: Port[];
}

export interface Port {
  id: string;
  name: string;
  type: 'input' | 'output';
  dataType: string;
  position: { x: number; y: number };
}

export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
}

export interface MonitoringLog {
  id: string;
  userId: string;
  graphId?: string;
  eventType: string;
  data: Record<string, unknown>;
  timestamp: Date;
}

export interface ApiKeyUsage {
  id: string;
  userId: string;
  apiKey: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  timestamp: Date;
}

export interface UsageStats {
  currentPeriod: {
    apiCalls: number;
    graphsCreated: number;
    monitoringTime: number;
  };
  limits: {
    apiCalls: number;
    graphsCreated: number;
    monitoringTime: number;
  };
  trialDaysRemaining?: number;
}

export interface AdminStats {
  users: {
    total: number;
    activeLast30Days: number;
    proUsers: number;
    trialUsers: number;
  };
  revenue: {
    mrr: number;
    arr: number;
    growthRate: number;
  };
  usage: {
    totalGraphs: number;
    totalApiCalls: number;
    avgSessionDuration: number;
  };
}

export interface PlanFeatures {
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    graphs: number | 'unlimited';
    monitoring: number | 'unlimited';
    apiCalls: number | 'unlimited';
    customAgents: boolean;
    serverSync: boolean;
    support: 'community' | 'email' | 'priority';
  };
}

export interface EmailTemplate {
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

export interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  currentModal: string | null;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}