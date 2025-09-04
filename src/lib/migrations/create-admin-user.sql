-- Update existing user to admin role
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Or create new admin user (replace with actual user ID from auth.users)
INSERT INTO profiles (id, email, first_name, last_name, role) 
VALUES ('user-uuid-here', 'admin@example.com', 'Admin', 'User', 'admin');