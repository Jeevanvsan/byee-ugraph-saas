-- Check your user status (replace with your email)
SELECT id, email, role, organization_id FROM profiles WHERE email = 'your-email@example.com';

-- Check if policies exist
SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename = 'organizations';

-- Fix your user role if needed
UPDATE profiles SET role = 'owner' WHERE email = 'your-email@example.com';