-- Complete migration SQL for organization and subscription system

-- 1. Update existing profiles table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='role') THEN
        ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='organization_id') THEN
        ALTER TABLE profiles ADD COLUMN organization_id UUID;
    END IF;
END $$;

-- Update existing users to have default role
UPDATE profiles SET role = 'user' WHERE role IS NULL;

-- 2. Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create organization_memberships table
CREATE TABLE IF NOT EXISTS organization_memberships (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- 4. Create organization_subscriptions table
CREATE TABLE IF NOT EXISTS organization_subscriptions (
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

-- 5. Update existing subscriptions table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscriptions' AND column_name='user_type') THEN
        ALTER TABLE subscriptions ADD COLUMN user_type TEXT DEFAULT 'individual' CHECK (user_type IN ('individual', 'organization_member'));
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscriptions' AND column_name='api_key') THEN
        ALTER TABLE subscriptions ADD COLUMN api_key TEXT UNIQUE;
    END IF;
END $$;

-- 6. Add foreign key constraint to profiles after organizations table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='profiles_organization_id_fkey') THEN
        ALTER TABLE profiles ADD CONSTRAINT profiles_organization_id_fkey 
        FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 7. Create indexes
CREATE INDEX IF NOT EXISTS profiles_organization_id_idx ON profiles(organization_id);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);
CREATE INDEX IF NOT EXISTS organizations_created_by_idx ON organizations(created_by);
CREATE INDEX IF NOT EXISTS organizations_slug_idx ON organizations(slug);
CREATE INDEX IF NOT EXISTS organization_memberships_org_id_idx ON organization_memberships(organization_id);
CREATE INDEX IF NOT EXISTS organization_memberships_user_id_idx ON organization_memberships(user_id);
CREATE INDEX IF NOT EXISTS organization_subscriptions_org_id_idx ON organization_subscriptions(organization_id);
CREATE INDEX IF NOT EXISTS organization_subscriptions_api_key_idx ON organization_subscriptions(api_key);
CREATE INDEX IF NOT EXISTS organization_subscriptions_status_idx ON organization_subscriptions(status);
CREATE INDEX IF NOT EXISTS organization_subscriptions_product_idx ON organization_subscriptions(product_slug);
CREATE INDEX IF NOT EXISTS subscriptions_api_key_idx ON subscriptions(api_key);
CREATE INDEX IF NOT EXISTS subscriptions_user_type_idx ON subscriptions(user_type);

-- 8. Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_subscriptions ENABLE ROW LEVEL SECURITY;

-- 9. Create function to generate API key
CREATE OR REPLACE FUNCTION generate_api_key()
RETURNS TEXT AS $$
BEGIN
  RETURN 'SVR_' || encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql;

-- 10. Generate API keys for existing subscriptions
UPDATE subscriptions SET api_key = generate_api_key() WHERE api_key IS NULL;

-- 11. RLS Policies for organizations
DROP POLICY IF EXISTS "Users can view organizations they belong to" ON organizations;
CREATE POLICY "Users can view organizations they belong to" ON organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_memberships 
      WHERE organization_memberships.organization_id = organizations.id 
      AND organization_memberships.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can create organizations" ON organizations;
CREATE POLICY "Admins can create organizations" ON organizations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Organization owners can update organizations" ON organizations;
CREATE POLICY "Organization owners can update organizations" ON organizations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM organization_memberships 
      WHERE organization_memberships.organization_id = organizations.id 
      AND organization_memberships.user_id = auth.uid()
      AND organization_memberships.role = 'owner'
    )
  );

-- 12. RLS Policies for organization_memberships
DROP POLICY IF EXISTS "Users can view memberships of their organizations" ON organization_memberships;
CREATE POLICY "Users can view memberships of their organizations" ON organization_memberships
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM organization_memberships om 
      WHERE om.organization_id = organization_memberships.organization_id 
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  );

DROP POLICY IF EXISTS "Organization owners can manage memberships" ON organization_memberships;
CREATE POLICY "Organization owners can manage memberships" ON organization_memberships
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM organization_memberships om 
      WHERE om.organization_id = organization_memberships.organization_id 
      AND om.user_id = auth.uid()
      AND om.role = 'owner'
    )
  );

-- 13. RLS Policies for organization_subscriptions
DROP POLICY IF EXISTS "Organization members can view their subscriptions" ON organization_subscriptions;
CREATE POLICY "Organization members can view their subscriptions" ON organization_subscriptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_memberships 
      WHERE organization_memberships.organization_id = organization_subscriptions.organization_id 
      AND organization_memberships.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Organization owners/admins can manage subscriptions" ON organization_subscriptions;
CREATE POLICY "Organization owners/admins can manage subscriptions" ON organization_subscriptions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM organization_memberships 
      WHERE organization_memberships.organization_id = organization_subscriptions.organization_id 
      AND organization_memberships.user_id = auth.uid()
      AND organization_memberships.role IN ('owner', 'admin')
    )
  );

-- 14. Add triggers for updated_at
DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_organization_memberships_updated_at ON organization_memberships;
CREATE TRIGGER update_organization_memberships_updated_at BEFORE UPDATE ON organization_memberships
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_organization_subscriptions_updated_at ON organization_subscriptions;
CREATE TRIGGER update_organization_subscriptions_updated_at BEFORE UPDATE ON organization_subscriptions
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();