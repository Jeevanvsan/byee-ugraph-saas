import { supabase, signInWithPassword, signUpWithPassword, signInWithGoogle, signOut } from './supabase';
import { Database } from '@/types/database';
import { emailService } from './emailService';

export type Profile = Database['public']['Tables']['profiles']['Row'];

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'enterprise';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

class AuthService {
  async login(email: string, password: string): Promise<{ user: AuthUser; session: unknown }> {
    const { data, error } = await signInWithPassword(email, password);
    
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('No user returned from login');

    const profile = await this.getProfile(data.user.id);
    if (!profile) throw new Error('Profile not found');

    return { user: this.transformProfile(profile), session: data.session };
  }

  async register(userData: RegisterData): Promise<{ user: AuthUser; session: unknown }> {
    const { email, password, firstName, lastName } = userData;
    
    const { data, error } = await signUpWithPassword(email, password, {
      first_name: firstName,
      last_name: lastName,
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('No user returned from registration');

    // Create profile manually if trigger fails
    try {
      await supabase.from('profiles').insert({
        id: data.user.id,
        email: email,
        first_name: firstName,
        last_name: lastName,
        plan: 'free',
        is_verified: false
      });
    } catch (profileError) {
      console.log('Profile creation handled by trigger or already exists');
    }

    // Send welcome email
    await emailService.sendEmail('welcome', email, `${firstName} ${lastName}`);

    // Return user data directly without profile lookup
    const user: AuthUser = {
      id: data.user.id,
      email: email,
      firstName: firstName,
      lastName: lastName,
      plan: 'free',
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return { user, session: data.session };
  }

  async logout(): Promise<void> {
    const { error } = await signOut();
    if (error) throw new Error(error.message);
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;

    const profile = await this.getProfile(user.id);
    return profile ? this.transformProfile(profile) : null;
  }

  private async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    return error ? null : data;
  }

  private transformProfile(profile: Profile): AuthUser {
    return {
      id: profile.id,
      email: profile.email,
      firstName: profile.first_name,
      lastName: profile.last_name,
      avatar: profile.avatar_url || undefined,
      plan: profile.plan,
      isVerified: profile.is_verified,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
    };
  }
}

export const authService = new AuthService();