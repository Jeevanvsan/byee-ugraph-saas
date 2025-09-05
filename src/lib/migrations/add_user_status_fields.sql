-- Add is_active field to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add status field to organization_memberships table  
ALTER TABLE organization_memberships 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive'));

-- Update existing records to have active status
UPDATE profiles SET is_active = true WHERE is_active IS NULL;
UPDATE organization_memberships SET status = 'active' WHERE status IS NULL;

-- Create index for better performance on status queries
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_org_memberships_status ON organization_memberships(status);