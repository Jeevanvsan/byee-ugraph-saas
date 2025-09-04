// API endpoints for external products to validate API keys
// This would typically be implemented as actual API routes

import { apiAuthService } from './apiAuthService';

export class ApiEndpoints {
  // Validate API key endpoint - to be called by external products
  static async validateApiKey(request: {
    api_key: string;
    product_slug: string;
  }): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      const result = await apiAuthService.validateApiKey(
        request.api_key,
        request.product_slug
      );

      if (!result.valid) {
        return {
          success: false,
          error: 'Invalid or expired API key'
        };
      }

      return {
        success: true,
        data: {
          organization_id: result.organization_id,
          plan: result.plan,
          status: result.status,
          expires_at: result.expires_at
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }

  // Usage tracking endpoint - for external products to report usage
  static async trackUsage(request: {
    api_key: string;
    product_slug: string;
    usage_type: string;
    usage_count: number;
    metadata?: any;
  }): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // First validate the API key
      const validation = await apiAuthService.validateApiKey(
        request.api_key,
        request.product_slug
      );

      if (!validation.valid) {
        return {
          success: false,
          error: 'Invalid API key'
        };
      }

      // Track usage (this would be implemented based on your needs)
      // For now, we'll just return success
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to track usage'
      };
    }
  }
}

// Example usage for Orrery or other external products:
/*
// In Orrery application:
const validateAuth = async (apiKey: string) => {
  const response = await fetch('/api/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: apiKey,
      product_slug: 'ugraph'
    })
  });
  
  const result = await response.json();
  return result.success;
};
*/