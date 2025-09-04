-- Fix admin system: role='owner' is org admin, separate website_admins table

-- 1. Drop dependent policies first
DROP POLICY IF EXISTS "Admins can manage products" ON products;

-- 2. Update profiles role constraint to include 'owner'
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'admin', 'owner'));

-- 3. Create website_admins table
CREATE TABLE IF NOT EXISTS website_admins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Update organization policies
DROP POLICY IF EXISTS "Admins can create organizations" ON organizations;
DROP POLICY IF EXISTS "Website admins can create organizations" ON organizations;
CREATE POLICY "Owners and website admins can create organizations" ON organizations
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'owner') OR
    EXISTS (SELECT 1 FROM website_admins WHERE website_admins.user_id = auth.uid())
  );

-- 5. Recreate products policy
CREATE POLICY "Website admins can manage products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM website_admins 
      WHERE website_admins.user_id = auth.uid()
    )
  );

-- 6. Create indexes and RLS
CREATE INDEX IF NOT EXISTS website_admins_user_id_idx ON website_admins(user_id);
ALTER TABLE website_admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Website admins can view themselves" ON website_admins
  FOR SELECT USING (user_id = auth.uid());

-- 7. Add trigger
CREATE TRIGGER update_website_admins_updated_at BEFORE UPDATE ON website_admins
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();