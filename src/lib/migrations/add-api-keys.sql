-- Add API keys and organization subscriptions

-- Create organization_subscriptions table
CREATE TABLE organization_subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  product_slug TEXT NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'pro', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'trialing')),
  api_key TEXT NOT NULL UNIQUE,
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'annual')),
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 month'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, product_slug)
);

-- Create indexes
CREATE INDEX organization_subscriptions_org_id_idx ON organization_subscriptions(organization_id);
CREATE INDEX organization_subscriptions_api_key_idx ON organization_subscriptions(api_key);
CREATE INDEX organization_subscriptions_status_idx ON organization_subscriptions(status);
CREATE INDEX organization_subscriptions_product_idx ON organization_subscriptions(product_slug);

-- Enable RLS
ALTER TABLE organization_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organization_subscriptions
CREATE POLICY "Organization members can view their subscriptions" ON organization_subscriptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_memberships 
      WHERE organization_memberships.organization_id = organization_subscriptions.organization_id 
      AND organization_memberships.user_id = auth.uid()
    )
  );

CREATE POLICY "Organization owners/admins can manage subscriptions" ON organization_subscriptions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM organization_memberships 
      WHERE organization_memberships.organization_id = organization_subscriptions.organization_id 
      AND organization_memberships.user_id = auth.uid()
      AND organization_memberships.role IN ('owner', 'admin')
    )
  );

-- Add trigger for updated_at
CREATE TRIGGER update_organization_subscriptions_updated_at BEFORE UPDATE ON organization_subscriptions
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to generate API key
CREATE OR REPLACE FUNCTION generate_api_key()
RETURNS TEXT AS $$
BEGIN
  RETURN 'byee_' || encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql;