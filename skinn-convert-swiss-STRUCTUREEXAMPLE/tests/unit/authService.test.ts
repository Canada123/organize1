import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '@/services/authService';
import { supabase } from '@/lib/supabase';

// Mock the supabase module
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithOtp: vi.fn(),
      verifyOtp: vi.fn(),
      getSession: vi.fn(),
      getUser: vi.fn(),
      signOut: vi.fn(),
      updateUser: vi.fn()
    }
  }
}));

describe('AuthService', () => {
  const authService = AuthService.getInstance();
  const mockSupabaseAuth = supabase.auth as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = AuthService.getInstance();
      const instance2 = AuthService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('sendOTP', () => {
    it('should send OTP successfully', async () => {
      mockSupabaseAuth.signInWithOtp.mockResolvedValue({ error: null });

      const result = await authService.sendOTP('test@gmail.com');

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
      expect(mockSupabaseAuth.signInWithOtp).toHaveBeenCalledWith({
        email: 'test@gmail.com',
        options: {
          shouldCreateUser: true,
          emailRedirectTo: expect.stringContaining('/en/eligibility')
        }
      });
    });

    it('should handle OTP send errors', async () => {
      const errorMessage = 'Email address is invalid';
      mockSupabaseAuth.signInWithOtp.mockResolvedValue({ 
        error: { message: errorMessage } 
      });

      const result = await authService.sendOTP('invalid@example.com');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Please enter a valid email address.');
    });

    it('should handle unexpected errors', async () => {
      mockSupabaseAuth.signInWithOtp.mockRejectedValue(new Error('Network error'));

      const result = await authService.sendOTP('test@gmail.com');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error. Please check your connection and try again.');
    });
  });

  describe('verifyOTP', () => {
    it('should verify OTP successfully', async () => {
      const mockSession = { access_token: 'token123' };
      const mockUser = { id: 'user123', email: 'test@gmail.com' };
      
      mockSupabaseAuth.verifyOtp.mockResolvedValue({
        data: { session: mockSession, user: mockUser },
        error: null
      });

      const result = await authService.verifyOTP('test@gmail.com', '123456');

      expect(result.success).toBe(true);
      expect(result.session).toBe(mockSession);
      expect(result.user).toBe(mockUser);
      expect(mockSupabaseAuth.verifyOtp).toHaveBeenCalledWith({
        email: 'test@gmail.com',
        token: '123456',
        type: 'email'
      });
    });

    it('should handle invalid OTP', async () => {
      mockSupabaseAuth.verifyOtp.mockResolvedValue({
        data: null,
        error: { message: 'Invalid OTP' }
      });

      const result = await authService.verifyOTP('test@gmail.com', '000000');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid OTP');
    });

    it('should handle verification errors', async () => {
      mockSupabaseAuth.verifyOtp.mockRejectedValue(new Error('Network error'));

      const result = await authService.verifyOTP('test@gmail.com', '123456');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to verify code');
    });
  });

  describe('getSession', () => {
    it('should return session when available', async () => {
      const mockSession = { access_token: 'token123' };
      mockSupabaseAuth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null
      });

      const session = await authService.getSession();

      expect(session).toBe(mockSession);
    });

    it('should return null when no session', async () => {
      mockSupabaseAuth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      });

      const session = await authService.getSession();

      expect(session).toBeNull();
    });

    it('should handle session errors', async () => {
      mockSupabaseAuth.getSession.mockResolvedValue({
        data: { session: null },
        error: { message: 'Session error' }
      });

      const session = await authService.getSession();

      expect(session).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should return user when authenticated', async () => {
      const mockUser = { id: 'user123', email: 'test@gmail.com' };
      mockSupabaseAuth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      const user = await authService.getCurrentUser();

      expect(user).toBe(mockUser);
    });

    it('should return null when not authenticated', async () => {
      mockSupabaseAuth.getUser.mockResolvedValue({
        data: { user: null },
        error: null
      });

      const user = await authService.getCurrentUser();

      expect(user).toBeNull();
    });
  });

  describe('signOut', () => {
    it('should sign out successfully', async () => {
      mockSupabaseAuth.signOut.mockResolvedValue({ error: null });

      const result = await authService.signOut();

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should handle sign out errors', async () => {
      mockSupabaseAuth.signOut.mockResolvedValue({
        error: { message: 'Sign out failed' }
      });

      const result = await authService.signOut();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Sign out failed');
    });
  });

  describe('updateUserMetadata', () => {
    it('should update metadata successfully', async () => {
      const mockUser = { id: 'user123', user_metadata: { test: 'data' } };
      const metadata = { firstName: 'John', lastName: 'Doe' };
      
      mockSupabaseAuth.updateUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      const result = await authService.updateUserMetadata(metadata);

      expect(result.success).toBe(true);
      expect(result.user).toBe(mockUser);
      expect(mockSupabaseAuth.updateUser).toHaveBeenCalledWith({
        data: metadata
      });
    });

    it('should handle update errors', async () => {
      mockSupabaseAuth.updateUser.mockResolvedValue({
        data: null,
        error: { message: 'Update failed' }
      });

      const result = await authService.updateUserMetadata({ test: 'data' });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Update failed');
    });
  });
});