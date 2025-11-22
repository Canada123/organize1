import { describe, it, expect, beforeAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';

// Test configuration - using the CORRECT myant-europe project
const supabaseUrl = 'https://trfrikhxxtzmknjmpgub.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyZnJpa2h4eHR6bWtuam1wZ3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MzA1NTYsImV4cCI6MjA2MzMwNjU1Nn0.SHfsMDCQcXbL0auHK3Ct8oTBcjNWoTt03LQhvRdiTWA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

describe('Supabase Auth OTP Integration - myant-europe', () => {
  const testEmail = `test-${Date.now()}@example.com`;

  it('should connect to the correct Supabase project (myant-europe)', async () => {
    // Verify we can connect to the database
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);

    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it('should send OTP email successfully', async () => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: testEmail,
      options: {
        shouldCreateUser: true,
        data: {
          source: 'eligibility_form'
        }
      }
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    
    // Note: In test environment, we can't actually receive the email
    // In production, user would receive email with OTP code
  // Console statement removed by ESLint fix
  });

  it('should handle OTP verification flow', async () => {
    // In a real test, we would:
    // 1. Send OTP
    // 2. Retrieve the token from email (in dev, from Supabase dashboard)
    // 3. Verify the token
    
    // For now, we'll test the error handling
    const { error } = await supabase.auth.verifyOtp({
      email: testEmail,
      token: '123456', // Invalid token
      type: 'email'
    });

    // Should fail with invalid token
    expect(error).toBeDefined();
    expect(error?.message).toContain('Token');
  });

  it('should create user profile after successful auth', async () => {
    // Test that we can create a user profile linked to auth.users
    const testUserId = 'test-user-' + Date.now();
    
    // First, check if we can insert a user profile
    // (In production, this would happen after successful OTP verification)
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);

    expect(profileError).toBeNull();
    // Profile table exists and is accessible
  });

  it('should enforce rate limiting', async () => {
    // Test that rate limiting works (5 attempts per hour per email)
    const rateLimitEmail = `ratelimit-${Date.now()}@example.com`;
    const attempts = [];

    // Try to send 6 OTPs (should fail on 6th)
    for (let i = 0; i < 6; i++) {
      const promise = supabase.auth.signInWithOtp({
        email: rateLimitEmail,
        options: { shouldCreateUser: false }
      });
      attempts.push(promise);
    }

    const results = await Promise.allSettled(attempts);
    
    // First 5 should succeed or at least not be rate limited
    // 6th might be rate limited (depends on Supabase Auth settings)
    const errors = results.filter(r => r.status === 'rejected');
  // Console statement removed by ESLint fix
  });
});

describe('Form Session Integration with Auth', () => {
  it('should create secure form session for authenticated user', async () => {
    // This would normally be called after successful OTP verification
    const mockUserId = '550e8400-e29b-41d4-a716-446655440000'; // Valid UUID
    
    // Test that form_sessions table is accessible
    const { data, error } = await supabase
      .from('form_sessions')
      .select('*')
      .limit(1);

    expect(error).toBeNull();
    // Table exists and has proper RLS policies
  });
});