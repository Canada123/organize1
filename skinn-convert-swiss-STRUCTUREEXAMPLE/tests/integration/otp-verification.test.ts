import { describe, it, expect, beforeAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';

// Test configuration
const supabaseUrl = 'https://okswbvqfmpjmgubhlpzz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rc3didnFmbXBqbWd1YmhscHp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3Njg1NjUsImV4cCI6MjA3MTM0NDU2NX0.BJAOllcxabLD1JI_wKGdlFsceBWSuHX75LBfehdURxY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

describe('OTP Verification System', () => {
  let testUserId: string;
  let testOtpId: string;
  let testOtpCode: string;

  beforeAll(() => {
    testUserId = `test_user_${Date.now()}`;
  });

  it('should send OTP successfully', async () => {
    const { data, error } = await supabase.rpc('send_otp_v2', {
      p_user_id: testUserId,
      p_contact_type: 'email',
      p_contact_value: 'test@example.com',
      p_session_id: null
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data[0].success).toBe(true);
    expect(data[0].otp_id).toBeDefined();
    expect(data[0].masked_contact).toBe('te***@example.com');
    expect(data[0].expires_at).toBeDefined();

    testOtpId = data[0].otp_id;
    
    // Note: In production, the OTP would be sent via email/SMS
    // For testing, we'll need to retrieve it from the database
  });

  it('should retrieve OTP code for testing', async () => {
    // This is only for testing - in production, users receive codes via email/SMS
    const { data, error } = await supabase
      .from('otp_codes')
      .select('code')
      .eq('id', testOtpId)
      .single();

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.code).toMatch(/^\d{6}$/);
    
    testOtpCode = data.code;
  });

  it('should verify correct OTP code', async () => {
    const { data, error } = await supabase.rpc('verify_otp_v2', {
      p_otp_id: testOtpId,
      p_otp_code: testOtpCode,
      p_session_id: null
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data[0].success).toBe(true);
    expect(data[0].verified).toBe(true);
  });

  it('should reject incorrect OTP code', async () => {
    // Send a new OTP first
    const sendResult = await supabase.rpc('send_otp_v2', {
      p_user_id: `${testUserId}_2`,
      p_contact_type: 'email',
      p_contact_value: 'test2@example.com',
      p_session_id: null
    });

    const newOtpId = sendResult.data[0].otp_id;

    // Try with wrong code
    const { data, error } = await supabase.rpc('verify_otp_v2', {
      p_otp_id: newOtpId,
      p_otp_code: '000000',
      p_session_id: null
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data[0].success).toBe(false);
    expect(data[0].verified).toBe(false);
    expect(data[0].error).toContain('Invalid code');
  });

  it('should enforce rate limiting', async () => {
    const rateLimitUserId = `rate_limit_test_${Date.now()}`;
    
    // Send 5 OTPs (the limit)
    for (let i = 0; i < 5; i++) {
      const { data } = await supabase.rpc('send_otp_v2', {
        p_user_id: rateLimitUserId,
        p_contact_type: 'email',
        p_contact_value: `test${i}@example.com`,
        p_session_id: null
      });
      expect(data[0].success).toBe(true);
    }

    // 6th attempt should fail
    const { data } = await supabase.rpc('send_otp_v2', {
      p_user_id: rateLimitUserId,
      p_contact_type: 'email',
      p_contact_value: 'test6@example.com',
      p_session_id: null
    });

    expect(data[0].success).toBe(false);
    expect(data[0].error).toContain('Too many OTP requests');
  });

  it('should enforce max attempts limit', async () => {
    // Send a new OTP
    const sendResult = await supabase.rpc('send_otp_v2', {
      p_user_id: `${testUserId}_attempts`,
      p_contact_type: 'phone',
      p_contact_value: '+41791234567',
      p_session_id: null
    });

    const attemptOtpId = sendResult.data[0].otp_id;

    // Make 3 wrong attempts (the limit)
    for (let i = 1; i <= 3; i++) {
      const { data } = await supabase.rpc('verify_otp_v2', {
        p_otp_id: attemptOtpId,
        p_otp_code: '111111',
        p_session_id: null
      });
      
      if (i < 3) {
        expect(data[0].error).toContain('Invalid code');
      } else {
        expect(data[0].error).toContain('Maximum attempts exceeded');
      }
    }

    // 4th attempt should fail even with correct code
    const { data } = await supabase.rpc('verify_otp_v2', {
      p_otp_id: attemptOtpId,
      p_otp_code: '123456', // Even if this were correct
      p_session_id: null
    });

    expect(data[0].success).toBe(false);
    expect(data[0].error).toContain('Invalid or expired OTP');
  });
});

describe('Form Session Management', () => {
  let testSessionId: string;
  let testSessionToken: string;
  const testUserId = `session_test_${Date.now()}`;

  it('should create a secure form session', async () => {
    const { data, error } = await supabase.rpc('create_secure_form_session', {
      p_user_id: testUserId,
      p_initial_data: { test: 'data' },
      p_session_type: 'eligibility_questionnaire'
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data[0].success).toBe(true);
    expect(data[0].session_id).toBeDefined();
    expect(data[0].session_token).toBeDefined();
    expect(data[0].expires_at).toBeDefined();

    testSessionId = data[0].session_id;
    testSessionToken = data[0].session_token;
  });

  it('should save form progress', async () => {
    const formData = {
      contactInfo: {
        email: 'test@example.com',
        dateOfBirth: '1990-01-01'
      },
      currentStep: 'eligibility',
      completedSteps: ['contact']
    };

    const { data, error } = await supabase.rpc('save_form_progress_v2', {
      p_session_id: testSessionId,
      p_step: 2,
      p_data: formData,
      p_user_id: testUserId
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.success).toBe(true);
  });

  it('should check eligibility', async () => {
    const formData = {
      age: 35,
      hasInsurance: true,
      symptoms: ['chest_pain', 'shortness_of_breath'],
      familyHistory: true,
      contraindications: {
        pregnant: false,
        pacemaker: false,
        recentHospitalization: false
      }
    };

    const { data, error } = await supabase.rpc('check_eligibility_v2', {
      p_form_data: formData
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data[0]).toHaveProperty('eligibility_score');
    expect(data[0]).toHaveProperty('eligibility_pathway');
    expect(data[0]).toHaveProperty('estimated_cost_cents');
    
    // High risk due to symptoms
    expect(data[0].eligibility_score).toBeGreaterThanOrEqual(70);
    expect(data[0].eligibility_pathway).toBe('insurance_gp_required');
  });

  it('should retrieve form session', async () => {
    const { data, error } = await supabase
      .from('form_sessions')
      .select('*')
      .eq('id', testSessionId)
      .single();

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.user_id).toBe(testUserId);
    expect(data.status).toBe('active');
    expect(data.current_step).toBe(2);
  });
});

describe('User Profile Management', () => {
  const testUserId = `profile_test_${Date.now()}`;

  it('should create user profile with validation', async () => {
    const { data, error } = await supabase.rpc('create_user_profile_v2', {
      p_user_id: testUserId,
      p_date_of_birth: '1985-05-15',
      p_phone: '+41791234567',
      p_address: {
        street: 'Bahnhofstrasse 1',
        postal_code: '8001',
        city: 'Zürich',
        canton: 'ZH'
      },
      p_preferred_language: 'de'
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.success).toBe(true);
  });

  it('should reject underage users', async () => {
    const underageDate = new Date();
    underageDate.setFullYear(underageDate.getFullYear() - 17); // 17 years old

    const { data, error } = await supabase.rpc('create_user_profile_v2', {
      p_user_id: `underage_${Date.now()}`,
      p_date_of_birth: underageDate.toISOString().split('T')[0],
      p_phone: '+41791234568',
      p_address: null,
      p_preferred_language: 'en'
    });

    expect(error).toBeDefined();
    expect(error.message).toContain('age_check');
  });

  it('should validate Swiss cantons', async () => {
    const { error } = await supabase
      .from('user_profiles_v2')
      .insert({
        id: `canton_test_${Date.now()}`,
        date_of_birth: '1980-01-01',
        canton: 'XX', // Invalid canton
        preferred_language: 'de'
      });

    expect(error).toBeDefined();
    expect(error.message).toContain('canton');
  });
});