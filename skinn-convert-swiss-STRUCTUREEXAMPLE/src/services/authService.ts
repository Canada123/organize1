import { supabase } from '@/lib/supabase';
import type { AuthError, Session, User } from '@supabase/supabase-js';

export class AuthService {
  private static instance: AuthService;
  
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Send OTP to email using Supabase Auth
   */
  async sendOTP(email: string): Promise<{
    success: boolean;
    error?: string;
    retryAfter?: number;
  }> {
    try {
      // Use Supabase Auth's built-in OTP functionality
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/en/eligibility`
        }
      });

      if (error) {
        // Error sending OTP
        
        // Handle rate limiting
        if (error.message?.includes('rate') || error.message?.includes('too many')) {
          return { 
            success: false, 
            error: 'Too many attempts. Please try again in a few minutes.',
            retryAfter: 60
          };
        }
        
        // Handle invalid email
        if (error.message?.includes('invalid') || error.message?.includes('email')) {
          return { 
            success: false, 
            error: 'Please enter a valid email address.'
          };
        }

        return { 
          success: false, 
          error: this.getHumanReadableError(error.message || 'Failed to send verification code')
        };
      }

      return { success: true };
    } catch (error) {
      // Network error sending OTP
      
      // Handle offline/network errors
      if (!navigator.onLine) {
        return { 
          success: false, 
          error: 'No internet connection. Please check your network and try again.'
        };
      }
      
      return { 
        success: false, 
        error: 'Network error. Please check your connection and try again.'
      };
    }
  }

  /**
   * Verify OTP code from email
   */
  async verifyOTP(email: string, token: string): Promise<{
    success: boolean;
    session?: Session | null;
    user?: User | null;
    error?: string;
  }> {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email'
      });

      if (error) {
        // Error verifying OTP
        return { success: false, error: error.message };
      }

      return {
        success: true,
        session: data.session,
        user: data.user
      };
    } catch (error) {
      // Unexpected error verifying OTP
      return { success: false, error: 'Failed to verify code' };
    }
  }

  /**
   * Get current session
   */
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      // Error getting session
      return null;
    }
    
    return session;
  }

  /**
   * Get current user
   */
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      // Error getting user
      return null;
    }
    
    return user;
  }

  /**
   * Sign out user
   */
  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        // Error signing out
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      // Unexpected error signing out
      return { success: false, error: 'Failed to sign out' };
    }
  }

  /**
   * Update user metadata
   */
  async updateUserMetadata(metadata: Record<string, unknown>): Promise<{
    success: boolean;
    user?: User | null;
    error?: string;
  }> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: metadata
      });

      if (error) {
        // Error updating user metadata
        return { success: false, error: error.message };
      }

      return {
        success: true,
        user: data.user
      };
    } catch (error) {
      // Unexpected error updating metadata
      return { success: false, error: 'Failed to update user data' };
    }
  }


  /**
   * Convert technical error messages to user-friendly ones
   */
  private getHumanReadableError(error: string): string {
    const errorMap: Record<string, string> = {
      'Invalid email': 'Please enter a valid email address.',
      'User not found': 'No account found with this email address.',
      'Invalid credentials': 'The verification code is incorrect or has expired.',
      'Email not confirmed': 'Please check your email and click the verification link.',
      'Too many requests': 'Too many attempts. Please wait a few minutes before trying again.',
      'Network error': 'Connection problem. Please check your internet and try again.',
      'Timeout': 'Request timed out. Please try again.',
      'Rate limit exceeded': 'Too many attempts. Please wait before trying again.',
      'Invalid token': 'The verification code is invalid or has expired.',
      'Expired token': 'The verification code has expired. Please request a new one.',
      'Token already used': 'This verification code has already been used. Please request a new one.'
    };

    // Check for exact matches first
    if (errorMap[error]) {
      return errorMap[error];
    }

    // Check for partial matches
    for (const [key, message] of Object.entries(errorMap)) {
      if (error.toLowerCase().includes(key.toLowerCase())) {
        return message;
      }
    }

    // Default fallback with helpful guidance
    if (error.toLowerCase().includes('email')) {
      return 'There was an issue with your email address. Please check it and try again.';
    }
    
    if (error.toLowerCase().includes('network') || error.toLowerCase().includes('connection')) {
      return 'Network error. Please check your internet connection and try again.';
    }

    // Generic fallback
    return 'Something went wrong. Please try again or contact support if the problem persists.';
  }
}

export const authService = AuthService.getInstance();