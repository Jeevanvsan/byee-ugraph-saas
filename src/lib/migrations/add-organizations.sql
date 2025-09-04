-- Add organizations and organization memberships to the database

-- Create organizations table
CREATE TABLE organizations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create organization_memberships table
CREATE TABLE organization_memberships (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- Add organization_id to profiles table
ALTER TABLE profiles ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL;

-- Create indexes
CREATE INDEX organizations_created_by_idx ON organizations(created_by);
CREATE INDEX organizations_slug_idx ON organizations(slug);
CREATE INDEX organization_memberships_org_id_idx ON organization_memberships(organization_id);
CREATE INDEX organization_memberships_user_id_idx ON organization_memberships(user_id);
CREATE INDEX profiles_organization_id_idx ON profiles(organization_id);

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_memberships ENABLE ROW LEVEL SECURITY;