# Supabase Setup Instructions for Byee.in UGraph

## 1. Create Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new account or sign in
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - Name: `byee-ugraph-saas`
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
5. Click "Create new project"

## 2. Get Project Credentials

1. Go to Project Settings → API
2. Copy the following values:
   - Project URL
   - Project anon/public key

## 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_URL=http://localhost:5173
```

## 4. Set Up Database Schema

1. Go to SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `src/lib/database-setup.sql`
3. Run the SQL script to create all tables, policies, and triggers

## 5. Configure Authentication

1. Go to Authentication → Settings
2. Site URL: `http://localhost:5173` (development) or your production URL
3. Redirect URLs: Add your callback URLs:
   - `http://localhost:5173/auth/callback`
   - `https://yourdomain.com/auth/callback` (production)

## 6. Set Up Google OAuth (Optional)

1. Go to Authentication → Providers
2. Enable Google provider
3. Create Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `https://your-project.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to Supabase

## 7. Email Configuration

1. Go to Authentication → Settings → SMTP Settings
2. Configure your SMTP provider or use Supabase's default
3. Customize email templates as needed

## 8. Row Level Security (RLS)

The database setup script automatically enables RLS and creates policies. Key policies include:

- **profiles**: Users can only view/update their own profile
- **subscriptions**: Users can only access their own subscription data
- **workflows**: Users can only manage their own workflows
- **usage_metrics**: Users can only view their own usage data
- **email_logs**: Users can view their own email history

## 9. Edge Functions (Future Enhancement)

For advanced email functionality, you can deploy Edge Functions:

1. Install Supabase CLI
2. Create functions in `supabase/functions/`
3. Deploy with `supabase functions deploy`

## 10. Testing the Setup

1. Start your development server: `pnpm run dev`
2. Navigate to `/auth/signup`
3. Create a test account
4. Verify the user appears in Authentication → Users
5. Check that profile and subscription records are created automatically

## 11. Production Deployment

1. Update environment variables with production URLs
2. Configure production redirect URLs
3. Set up proper SMTP for email delivery
4. Enable additional security features as needed

## Troubleshooting

### Common Issues:

1. **"relation does not exist" errors**: Make sure you ran the database setup script
2. **RLS policy errors**: Verify policies are created and enabled
3. **OAuth redirect errors**: Check redirect URLs match exactly
4. **Email not sending**: Verify SMTP configuration

### Useful Supabase CLI Commands:

```bash
# Install CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Generate TypeScript types
supabase gen types typescript --project-id your-project-ref > src/types/database.ts

# Reset database (development only)
supabase db reset
```

## Migration from localStorage

The application includes a built-in migration system that will:

1. Detect existing localStorage data
2. Offer to migrate data to Supabase
3. Preserve all user workflows and settings
4. Create appropriate Supabase records

Users will see a migration notice on first login after the Supabase integration is deployed.