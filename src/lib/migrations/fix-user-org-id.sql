-- Check and fix user organization_id
SELECT p.id, p.email, p.organization_id, om.organization_id as membership_org_id
FROM profiles p
LEFT JOIN organization_memberships om ON p.id = om.user_id
WHERE p.email = 'test1@gmail.com';

-- Update user's organization_id based on membership
UPDATE profiles 
SET organization_id = (
  SELECT organization_id 
  FROM organization_memberships 
  WHERE user_id = profiles.id 
  AND role = 'owner'
  LIMIT 1
)
WHERE email = 'test1@gmail.com';