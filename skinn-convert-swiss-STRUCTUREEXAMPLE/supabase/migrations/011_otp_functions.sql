-- Migration: 011_otp_functions.sql
-- Purpose: Add OTP sending and management functions
-- Created: 2025-08-22

-- Create table for OTP codes if not exists
CREATE TABLE IF NOT EXISTS otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  contact_type VARCHAR(10) CHECK (contact_type IN ('email', 'phone')) NOT NULL,
  contact_value TEXT NOT NULL,
  code VARCHAR(6) NOT NULL,
  code_hash TEXT NOT NULL, -- Store bcrypt hash for security
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  expires_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ,
  session_id UUID REFERENCES form_sessions(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_code CHECK (code ~ '^\d{6}$')
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_otp_codes_user_contact ON otp_codes(user_id, contact_type, contact_value);
CREATE INDEX IF NOT EXISTS idx_otp_codes_expires ON otp_codes(expires_at) WHERE verified_at IS NULL;

-- Enable RLS
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

-- RLS policies for OTP codes
CREATE POLICY otp_codes_insert ON otp_codes
  FOR INSERT WITH CHECK (true); -- Allow inserts through functions

CREATE POLICY otp_codes_update ON otp_codes
  FOR UPDATE USING (expires_at > NOW() AND attempts < max_attempts);

-- Function to generate and send OTP
CREATE OR REPLACE FUNCTION send_otp_v2(
  p_user_id TEXT,
  p_contact_type VARCHAR(10),
  p_contact_value TEXT,
  p_session_id UUID DEFAULT NULL
)
RETURNS TABLE (
  success BOOLEAN,
  otp_id UUID,
  masked_contact TEXT,
  expires_at TIMESTAMPTZ,
  error TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_otp_code VARCHAR(6);
  v_otp_id UUID;
  v_masked_contact TEXT;
  v_expires_at TIMESTAMPTZ;
  v_recent_attempts INTEGER;
BEGIN
  -- Check rate limiting (max 5 OTP requests per hour)
  SELECT COUNT(*)
  INTO v_recent_attempts
  FROM otp_codes
  WHERE user_id = p_user_id
    AND created_at > NOW() - INTERVAL '1 hour';
  
  IF v_recent_attempts >= 5 THEN
    RETURN QUERY SELECT 
      false::BOOLEAN,
      NULL::UUID,
      NULL::TEXT,
      NULL::TIMESTAMPTZ,
      'Too many OTP requests. Please try again later.'::TEXT;
    RETURN;
  END IF;

  -- Invalidate any existing OTPs for this user/contact
  UPDATE otp_codes
  SET verified_at = NOW()
  WHERE user_id = p_user_id
    AND contact_type = p_contact_type
    AND contact_value = p_contact_value
    AND expires_at > NOW()
    AND verified_at IS NULL;

  -- Generate random 6-digit code
  v_otp_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
  
  -- Set expiration (10 minutes)
  v_expires_at := NOW() + INTERVAL '10 minutes';
  
  -- Mask contact value
  IF p_contact_type = 'email' THEN
    v_masked_contact := REGEXP_REPLACE(p_contact_value, '(.{2})(.*)(@.*)', '\1***\3');
  ELSE
    v_masked_contact := REGEXP_REPLACE(p_contact_value, '(\d{3})(\d*)(\d{3})', '\1***\3');
  END IF;
  
  -- Insert OTP record
  INSERT INTO otp_codes (
    user_id,
    contact_type,
    contact_value,
    code,
    code_hash,
    expires_at,
    session_id
  ) VALUES (
    p_user_id,
    p_contact_type,
    p_contact_value,
    v_otp_code,
    crypt(v_otp_code, gen_salt('bf', 8)), -- bcrypt hash with cost factor 8
    v_expires_at,
    p_session_id
  )
  RETURNING id INTO v_otp_id;
  
  -- TODO: Integrate with actual email/SMS service
  -- For now, we'll log the OTP (in production, remove this and send via service)
  RAISE NOTICE 'OTP Code for % (%): %', p_contact_type, v_masked_contact, v_otp_code;
  
  RETURN QUERY SELECT 
    true::BOOLEAN,
    v_otp_id,
    v_masked_contact,
    v_expires_at,
    NULL::TEXT;
    
EXCEPTION
  WHEN OTHERS THEN
    RETURN QUERY SELECT 
      false::BOOLEAN,
      NULL::UUID,
      NULL::TEXT,
      NULL::TIMESTAMPTZ,
      SQLERRM::TEXT;
END;
$$;

-- Enhanced OTP verification function
CREATE OR REPLACE FUNCTION verify_otp_v2(
  p_otp_id UUID,
  p_otp_code VARCHAR(6),
  p_session_id UUID DEFAULT NULL
)
RETURNS TABLE (
  success BOOLEAN,
  verified BOOLEAN,
  error TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_otp_record RECORD;
BEGIN
  -- Get OTP record
  SELECT *
  INTO v_otp_record
  FROM otp_codes
  WHERE id = p_otp_id
    AND expires_at > NOW()
    AND verified_at IS NULL
    AND attempts < max_attempts
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT 
      false::BOOLEAN,
      false::BOOLEAN,
      'Invalid or expired OTP'::TEXT;
    RETURN;
  END IF;
  
  -- Increment attempts
  UPDATE otp_codes
  SET attempts = attempts + 1
  WHERE id = p_otp_id;
  
  -- Verify the code using bcrypt comparison
  IF v_otp_record.code_hash = crypt(p_otp_code, v_otp_record.code_hash) THEN
    -- Mark as verified
    UPDATE otp_codes
    SET verified_at = NOW()
    WHERE id = p_otp_id;
    
    -- Update user profile verification status if applicable
    IF v_otp_record.contact_type = 'email' THEN
      UPDATE user_profiles_v2
      SET email_verified = true
      WHERE id = v_otp_record.user_id;
    ELSIF v_otp_record.contact_type = 'phone' THEN
      UPDATE user_profiles_v2
      SET phone_verified = true
      WHERE id = v_otp_record.user_id;
    END IF;
    
    -- Update form session if provided
    IF p_session_id IS NOT NULL THEN
      UPDATE form_sessions
      SET last_activity_at = NOW()
      WHERE id = p_session_id;
    END IF;
    
    RETURN QUERY SELECT 
      true::BOOLEAN,
      true::BOOLEAN,
      NULL::TEXT;
  ELSE
    -- Check if max attempts reached
    IF v_otp_record.attempts + 1 >= v_otp_record.max_attempts THEN
      -- Invalidate the OTP
      UPDATE otp_codes
      SET verified_at = NOW()
      WHERE id = p_otp_id;
      
      RETURN QUERY SELECT 
        false::BOOLEAN,
        false::BOOLEAN,
        'Maximum attempts exceeded. Please request a new code.'::TEXT;
    ELSE
      RETURN QUERY SELECT 
        false::BOOLEAN,
        false::BOOLEAN,
        'Invalid code. Please try again.'::TEXT;
    END IF;
  END IF;
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN QUERY SELECT 
      false::BOOLEAN,
      false::BOOLEAN,
      SQLERRM::TEXT;
END;
$$;

-- Cleanup function for expired OTPs (to be called periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  DELETE FROM otp_codes
  WHERE expires_at < NOW() - INTERVAL '1 hour'
    OR (verified_at IS NOT NULL AND verified_at < NOW() - INTERVAL '24 hours');
  
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RETURN v_deleted_count;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION send_otp_v2 TO anon;
GRANT EXECUTE ON FUNCTION verify_otp_v2 TO anon;
GRANT EXECUTE ON FUNCTION cleanup_expired_otps TO service_role;