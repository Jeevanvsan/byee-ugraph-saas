const EMAIL_API_URL = 'http://localhost:5000';

export type EmailType = 'welcome' | 'trial_expired' | 'payment_reminder' | 'payment_success' | 'payment_failed' | 'admin_grant_pro';

interface EmailRequest {
  type: EmailType;
  email: string;
  name: string;
}

class EmailService {
  async sendEmail(type: EmailType, email: string, name: string): Promise<boolean> {
    try {
      const response = await fetch(`${EMAIL_API_URL}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, email, name }),
      });

      return response.ok;
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();