import { supabase } from './supabase';

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  position: string;
  avatar_url?: string;
  content: string;
  rating: number;
  product: string;
}

export const testimonialsService = {
  async getApprovedTestimonials(): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('id, name, company, position, avatar_url, content, rating, product')
      .eq('status', 'approved')
      .order('rating', { ascending: false })      // highest rating first
      .order('display_order', { ascending: true }) // tie-breaker
      .limit(6);                                   // only top 6

    if (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }
    return data || [];
  }
};
