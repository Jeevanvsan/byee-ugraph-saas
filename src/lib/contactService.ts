import { supabase } from './supabase';

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  support_email: string;
  created_at: string;
  status: 'pending' | 'responded' | 'archived';
  response_notes?: string;
  responded_at?: string;
}

const SUPPORT_EMAILS = {
  SUPPORT: 'support@byee.in',
  INFO: 'info@byee.in'
};

export const contactService = {
  async submitContactForm(data: {
    name: string;
    email: string;
    message: string;
  }): Promise<ContactSubmission> {
    // Determine which support email to use based on the message content
    const support_email = data.message.toLowerCase().includes('support') 
      ? SUPPORT_EMAILS.SUPPORT 
      : SUPPORT_EMAILS.INFO;

    const { data: submission, error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name: data.name,
          email: data.email,
          message: data.message,
          support_email,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Error submitting contact form: ${error.message}`);
    }

    return submission;
  },

  async getSubmissions(): Promise<ContactSubmission[]> {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching contact submissions: ${error.message}`);
    }

    return data;
  },

  async updateSubmissionStatus(
    id: string,
    status: 'responded' | 'archived',
    response_notes?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('contact_submissions')
      .update({
        status,
        response_notes,
        responded_at: status === 'responded' ? new Date().toISOString() : null
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Error updating submission status: ${error.message}`);
    }
  }
};
