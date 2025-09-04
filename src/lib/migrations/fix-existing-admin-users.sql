-- Fix existing users with role='admin' to role='owner'
UPDATE profiles SET role = 'owner' WHERE role = 'admin';