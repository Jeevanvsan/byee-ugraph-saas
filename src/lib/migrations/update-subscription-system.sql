-- Add user_type to distinguish subscription types
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'individual' CHECK (user_type IN ('individual', 'organization_member'));
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS api_key TEXT UNIQUE;

-- Add function to generate API key for individual subscriptions
UPDATE subscriptions SET api_key = generate_api_key() WHERE api_key IS NULL;

-- Create index
CREATE INDEX IF NOT EXISTS subscriptions_api_key_idx ON subscriptions(api_key);
CREATE INDEX IF NOT EXISTS subscriptions_user_type_idx ON subscriptions(user_type);