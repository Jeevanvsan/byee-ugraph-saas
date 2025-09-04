-- Remove role column from profiles and create separate website_admins table

-- 1. Create website_admins table
CREATE TABLE IF NOT EXISTS website_admins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Remove role column from profiles (if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='role') THEN
        ALTER TABLE profiles DROP COLUMN role;
    END IF;
END $$;

-- 3. Create indexes
CREATE INDEX IF NOT EXISTS website_admins_user_id_idx ON website_admins(user_id);

-- 4. Enable RLS
ALTER TABLE website_admins ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for website_admins
CREATE POLICY "Website admins can view themselves" ON website_admins
  FOR SELECT USING (user_id = auth.uid());

-- 6. Update organization policies to use website_admins table
DROP POLICY IF EXISTS "Admins can create organizations" ON organizations;
CREATE POLICY "Website admins can create organizations" ON organizations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM website_admins 
      WHERE website_admins.user_id = auth.uid()
    )
  );

-- 7. Add trigger for updated_at
CREATE TRIGGER update_website_admins_updated_at BEFORE UPDATE ON website_admins
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();