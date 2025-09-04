-- Fix RLS policies to avoid infinite recursion

-- Drop problematic policies
DROP POLICY IF EXISTS "Organization owners can manage memberships" ON organization_memberships;
DROP POLICY IF EXISTS "Users can view memberships of their organizations" ON organization_memberships;

-- Create simpler policies
CREATE POLICY "Users can view their own memberships" ON organization_memberships
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert memberships when creating org" ON organization_memberships
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Organization owners can manage all memberships" ON organization_memberships
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM organization_memberships 
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );