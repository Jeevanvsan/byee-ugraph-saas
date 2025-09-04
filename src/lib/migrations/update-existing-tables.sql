-- Update existing profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL;

-- Update existing users to have default role
UPDATE profiles SET role = 'user' WHERE role IS NULL;

-- Create index for new columns
CREATE INDEX IF NOT EXISTS profiles_organization_id_idx ON profiles(organization_id);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);