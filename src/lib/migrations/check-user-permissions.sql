-- Check user permissions and roles

-- 1. Check current user's profile
SELECT id, email, role, organization_id FROM profiles WHERE email = 'your-email@example.com';

-- 2. Check if user is in website_admins
SELECT * FROM website_admins WHERE user_id = (SELECT id FROM profiles WHERE email = 'your-email@example.com');

-- 3. Update user to owner role (replace email)
UPDATE profiles SET role = 'owner' WHERE email = 'your-email@example.com';

-- 4. Check organization policies
SELECT * FROM pg_policies WHERE tablename = 'organizations';