export interface MockSubscription {
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

class MockSubscriptionService {
  private getStorageKey(): string {
    return 'byee_subscriptions';
  }

  private getSubscriptions(): MockSubscription[] {
    const data = localStorage.getItem(this.getStorageKey());
    return data ? JSON.parse(data) : [];
  }

  private saveSubscriptions(subscriptions: MockSubscription[]): void {
    localStorage.setItem(this.getStorageKey(), JSON.stringify(subscriptions));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  async createSubscription(
    userId: string,
    productId: string,
    plan: 'free' | 'pro' | 'enterprise',
    billingCycle: 'monthly' | 'annual' = 'monthly'
  ): Promise<MockSubscription> {
    const subscriptions = this.getSubscriptions();
    
    // Cancel existing subscription for this product
    const existingIndex = subscriptions.findIndex(
      s => s.userId === userId && s.productId === productId && s.status === 'active'
    );
    if (existingIndex !== -1) {
      subscriptions[existingIndex].status = 'cancelled';
    }

    const planPrices = { free: 0, pro: 29, enterprise: 99 };
    const amount = billingCycle === 'annual' ? planPrices[plan] * 12 * 0.8 : planPrices[plan];

    const subscription: MockSubscription = {
      id: this.generateId(),
      userId,
      productId,
      plan,
      status: plan === 'free' ? 'active' : 'trialing',
      billingCycle,
      amount,
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + (billingCycle === 'annual' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    subscriptions.push(subscription);
    this.saveSubscriptions(subscriptions);
    return subscription;
  }

  async getSubscriptionByUser(userId: string, productId?: string): Promise<MockSubscription | null> {
    const subscriptions = this.getSubscriptions();
    return subscriptions.find(s => 
      s.userId === userId && 
      s.status === 'active' && 
      (!productId || s.productId === productId)
    ) || null;
  }

  async getUserSubscriptions(userId: string): Promise<MockSubscription[]> {
    const subscriptions = this.getSubscriptions();
    return subscriptions.filter(s => s.userId === userId);
  }

  async updateSubscription(id: string, updates: Partial<MockSubscription>): Promise<MockSubscription> {
    const subscriptions = this.getSubscriptions();
    const index = subscriptions.findIndex(s => s.id === id);
    
    if (index === -1) throw new Error('Subscription not found');

    subscriptions[index] = {
      ...subscriptions[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveSubscriptions(subscriptions);
    return subscriptions[index];
  }

  async cancelSubscription(id: string): Promise<void> {
    await this.updateSubscription(id, { status: 'cancelled' });
  }

  async activateSubscription(id: string): Promise<MockSubscription> {
    return this.updateSubscription(id, { status: 'active' });
  }

  // Mock payment processing
  async processPayment(subscriptionId: string, paymentMethod: string): Promise<{ success: boolean; transactionId?: string }> {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock success/failure (90% success rate)
    const success = Math.random() > 0.1;
    
    if (success) {
      await this.activateSubscription(subscriptionId);
      return { success: true, transactionId: `txn_${Date.now()}` };
    } else {
      return { success: false };
    }
  }

  // Initialize with free subscription for new users
  async initializeFreeSubscription(userId: string, productId: string = 'ugraph'): Promise<MockSubscription> {
    const existing = await this.getSubscriptionByUser(userId, productId);
    if (existing) return existing;

    return this.createSubscription(userId, productId, 'free', 'monthly');
  }
}

export const mockSubscriptionService = new MockSubscriptionService();