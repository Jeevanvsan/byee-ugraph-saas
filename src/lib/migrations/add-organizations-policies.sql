-- RLS Policies for organizations and memberships

-- RLS Policies for organizations
CREATE POLICY "Users can view organizations they belong to" ON organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_memberships 
      WHERE organization_memberships.organization_id = organizations.id 
      AND organization_memberships.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can create organizations" ON organizations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Organization owners can update organizations" ON organizations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM organization_memberships 
      WHERE organization_memberships.organization_id = organizations.id 
      AND organization_memberships.user_id = auth.uid()
      AND organization_memberships.role = 'owner'
    )
  );

-- RLS Policies for organization_memberships
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

CREATE POLICY "Organization owners can manage memberships" ON organization_memberships
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM organization_memberships om 
      WHERE om.organization_id = organization_memberships.organization_id 
      AND om.user_id = auth.uid()
      AND om.role = 'owner'
    )
  );

-- Add triggers for updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_organization_memberships_updated_at BEFORE UPDATE ON organization_memberships
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();