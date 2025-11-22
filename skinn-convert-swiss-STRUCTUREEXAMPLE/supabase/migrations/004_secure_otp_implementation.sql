-- ==========================================
-- SECURE OTP IMPLEMENTATION
-- ==========================================
-- VERSION: 1.0
-- CREATED: 2025-08-19
-- PURPOSE: Phase 0.1 - Critical security fix for OTP verification
--          Implements bcrypt hashing, rate limiting, and audit logging
-- ==========================================

-- Drop existing insecure OTP table if exists
DROP TABLE IF EXISTS public.otp_verifications CASCADE;

-- ==========================================
-- 1. SECURE OTP VERIFICATION TABLE
-- ==========================================
CREATE TABLE public.otp_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    phone TEXT,
    otp_hash TEXT NOT NULL, -- Bcrypt hashed OTP
    otp_type TEXT NOT NULL CHECK (otp_type IN ('email', 'phone', 'both')),
    purpose TEXT NOT NULL CHECK (purpose IN ('signup', 'login', 'verification', 'password_reset')),
    
    -- Security fields
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    locked_until TIMESTAMPTZ,
    ip_address INET,
    user_agent TEXT,
    device_fingerprint TEXT,
    
    -- Timing
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ DEFAULT (CURRENT_TIMESTAMP + INTERVAL '10 minutes'),
    verified_at TIMESTAMPTZ,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Constraints
    CONSTRAINT valid_contact CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- Indexes for performance
CREATE INDEX idx_otp_email ON public.otp_verifications(email) WHERE email IS NOT NULL;
CREATE INDEX idx_otp_phone ON public.otp_verifications(phone) WHERE phone IS NOT NULL;
CREATE INDEX idx_otp_expires ON public.otp_verifications(expires_at) WHERE verified_at IS NULL;
CREATE INDEX idx_otp_ip ON public.otp_verifications(ip_address);

-- ==========================================
-- 2. RATE LIMITING TABLE
-- ==========================================
CREATE TABLE public.rate_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    identifier TEXT NOT NULL, -- Can be email, phone, IP, or user_id
    identifier_type TEXT NOT NULL CHECK (identifier_type IN ('email', 'phone', 'ip', 'user_id')),
    action TEXT NOT NULL CHECK (action IN ('otp_request', 'otp_verify', 'login', 'signup')),
    
    -- Rate limit tracking
    attempts INTEGER DEFAULT 1,
    window_start TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    window_duration INTERVAL DEFAULT '15 minutes',
    max_attempts INTEGER DEFAULT 3,
    
    -- Blocking
    blocked_until TIMESTAMPTZ,
    block_reason TEXT,
    
    -- Metadata
    last_attempt_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    ip_addresses INET[] DEFAULT ARRAY[]::INET[],
    
    CONSTRAINT unique_rate_limit UNIQUE (identifier, identifier_type, action)
);

-- Indexes for rate limiting
CREATE INDEX idx_rate_limit_identifier ON public.rate_limits(identifier, identifier_type);
CREATE INDEX idx_rate_limit_blocked ON public.rate_limits(blocked_until) WHERE blocked_until IS NOT NULL;

-- ==========================================
-- 3. SUSPICIOUS ACTIVITY TABLE
-- ==========================================
CREATE TABLE public.suspicious_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address INET NOT NULL,
    activity_type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    
    -- Details
    description TEXT NOT NULL,
    request_data JSONB,
    user_agent TEXT,
    device_fingerprint TEXT,
    
    -- Response
    action_taken TEXT,
    blocked BOOLEAN DEFAULT false,
    
    -- Timing
    occurred_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES auth.users(id),
    resolution_notes TEXT
);

-- Index for monitoring
CREATE INDEX idx_suspicious_ip ON public.suspicious_activities(ip_address);
CREATE INDEX idx_suspicious_user ON public.suspicious_activities(user_id);
CREATE INDEX idx_suspicious_severity ON public.suspicious_activities(severity, occurred_at DESC);

-- ==========================================
-- 4. OTP GENERATION FUNCTION (SECURE)
-- ==========================================
CREATE OR REPLACE FUNCTION public.generate_secure_otp(
    p_email TEXT DEFAULT NULL,
    p_phone TEXT DEFAULT NULL,
    p_purpose TEXT DEFAULT 'verification',
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_device_fingerprint TEXT DEFAULT NULL
)
RETURNS TABLE(
    success BOOLEAN,
    otp_id UUID,
    otp_code TEXT,
    expires_at TIMESTAMPTZ,
    error_message TEXT
) AS $$
DECLARE
    v_otp_code TEXT;
    v_otp_hash TEXT;
    v_otp_id UUID;
    v_identifier TEXT;
    v_identifier_type TEXT;
    v_rate_limit RECORD;
    v_existing_otp RECORD;
BEGIN
    -- Determine identifier for rate limiting
    IF p_email IS NOT NULL THEN
        v_identifier := p_email;
        v_identifier_type := 'email';
    ELSIF p_phone IS NOT NULL THEN
        v_identifier := p_phone;
        v_identifier_type := 'phone';
    ELSE
        RETURN QUERY SELECT FALSE, NULL::UUID, NULL::TEXT, NULL::TIMESTAMPTZ, 'Email or phone required'::TEXT;
        RETURN;
    END IF;
    
    -- Check rate limiting
    SELECT * INTO v_rate_limit
    FROM public.rate_limits
    WHERE identifier = v_identifier
    AND identifier_type = v_identifier_type
    AND action = 'otp_request'
    AND (blocked_until IS NULL OR blocked_until > CURRENT_TIMESTAMP);
    
    IF FOUND THEN
        -- Check if within window
        IF v_rate_limit.window_start + v_rate_limit.window_duration > CURRENT_TIMESTAMP THEN
            -- Still within window
            IF v_rate_limit.attempts >= v_rate_limit.max_attempts THEN
                -- Block for exponential backoff
                UPDATE public.rate_limits
                SET blocked_until = CURRENT_TIMESTAMP + (INTERVAL '15 minutes' * POWER(2, v_rate_limit.attempts - v_rate_limit.max_attempts)),
                    block_reason = 'Too many OTP requests'
                WHERE id = v_rate_limit.id;
                
                -- Log suspicious activity
                INSERT INTO public.suspicious_activities (
                    ip_address, activity_type, severity, description
                ) VALUES (
                    p_ip_address, 'excessive_otp_requests', 'medium',
                    format('Excessive OTP requests from %s', v_identifier)
                );
                
                RETURN QUERY SELECT FALSE, NULL::UUID, NULL::TEXT, NULL::TIMESTAMPTZ, 
                    'Too many requests. Please try again later.'::TEXT;
                RETURN;
            ELSE
                -- Increment attempts
                UPDATE public.rate_limits
                SET attempts = attempts + 1,
                    last_attempt_at = CURRENT_TIMESTAMP,
                    ip_addresses = array_append(ip_addresses, p_ip_address)
                WHERE id = v_rate_limit.id;
            END IF;
        ELSE
            -- Reset window
            UPDATE public.rate_limits
            SET attempts = 1,
                window_start = CURRENT_TIMESTAMP,
                last_attempt_at = CURRENT_TIMESTAMP,
                ip_addresses = ARRAY[p_ip_address]
            WHERE id = v_rate_limit.id;
        END IF;
    ELSE
        -- Create new rate limit entry
        INSERT INTO public.rate_limits (
            identifier, identifier_type, action, ip_addresses
        ) VALUES (
            v_identifier, v_identifier_type, 'otp_request', ARRAY[p_ip_address]
        );
    END IF;
    
    -- Check for existing unexpired OTP
    SELECT * INTO v_existing_otp
    FROM public.otp_verifications
    WHERE (email = p_email OR phone = p_phone)
    AND expires_at > CURRENT_TIMESTAMP
    AND verified_at IS NULL
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF FOUND THEN
        -- Invalidate old OTP
        UPDATE public.otp_verifications
        SET expires_at = CURRENT_TIMESTAMP
        WHERE id = v_existing_otp.id;
    END IF;
    
    -- Generate 6-digit OTP
    v_otp_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    
    -- Hash OTP with bcrypt (cost factor 12)
    v_otp_hash := crypt(v_otp_code, gen_salt('bf', 12));
    
    -- Create OTP record
    INSERT INTO public.otp_verifications (
        email, phone, otp_hash, otp_type, purpose,
        ip_address, user_agent, device_fingerprint
    ) VALUES (
        p_email, p_phone, v_otp_hash,
        CASE 
            WHEN p_email IS NOT NULL AND p_phone IS NOT NULL THEN 'both'
            WHEN p_email IS NOT NULL THEN 'email'
            ELSE 'phone'
        END,
        p_purpose, p_ip_address, p_user_agent, p_device_fingerprint
    ) RETURNING id, expires_at INTO v_otp_id, expires_at;
    
    -- Return success
    RETURN QUERY SELECT TRUE, v_otp_id, v_otp_code, expires_at, NULL::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 5. OTP VERIFICATION FUNCTION (SECURE)
-- ==========================================
CREATE OR REPLACE FUNCTION public.verify_secure_otp(
    p_otp_code TEXT,
    p_email TEXT DEFAULT NULL,
    p_phone TEXT DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS TABLE(
    success BOOLEAN,
    user_id UUID,
    error_message TEXT,
    remaining_attempts INTEGER
) AS $$
DECLARE
    v_otp RECORD;
    v_identifier TEXT;
    v_identifier_type TEXT;
    v_rate_limit RECORD;
BEGIN
    -- Determine identifier
    IF p_email IS NOT NULL THEN
        v_identifier := p_email;
        v_identifier_type := 'email';
    ELSIF p_phone IS NOT NULL THEN
        v_identifier := p_phone;
        v_identifier_type := 'phone';
    ELSE
        RETURN QUERY SELECT FALSE, NULL::UUID, 'Email or phone required'::TEXT, 0;
        RETURN;
    END IF;
    
    -- Check rate limiting for verification
    SELECT * INTO v_rate_limit
    FROM public.rate_limits
    WHERE identifier = v_identifier
    AND identifier_type = v_identifier_type
    AND action = 'otp_verify';
    
    IF FOUND AND v_rate_limit.blocked_until > CURRENT_TIMESTAMP THEN
        RETURN QUERY SELECT FALSE, NULL::UUID, 
            format('Account locked until %s', v_rate_limit.blocked_until::TEXT)::TEXT, 0;
        RETURN;
    END IF;
    
    -- Find the OTP record
    SELECT * INTO v_otp
    FROM public.otp_verifications
    WHERE (email = p_email OR phone = p_phone)
    AND expires_at > CURRENT_TIMESTAMP
    AND verified_at IS NULL
    AND locked_until IS NULL OR locked_until < CURRENT_TIMESTAMP
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF NOT FOUND THEN
        -- Log suspicious activity
        INSERT INTO public.suspicious_activities (
            ip_address, activity_type, severity, description
        ) VALUES (
            p_ip_address, 'invalid_otp_attempt', 'low',
            format('OTP verification attempt with no valid OTP for %s', v_identifier)
        );
        
        RETURN QUERY SELECT FALSE, NULL::UUID, 'Invalid or expired OTP'::TEXT, 0;
        RETURN;
    END IF;
    
    -- Verify OTP hash
    IF NOT (v_otp.otp_hash = crypt(p_otp_code, v_otp.otp_hash)) THEN
        -- Increment attempts
        UPDATE public.otp_verifications
        SET attempts = attempts + 1
        WHERE id = v_otp.id;
        
        -- Check if should lock
        IF v_otp.attempts + 1 >= v_otp.max_attempts THEN
            -- Lock with exponential backoff
            UPDATE public.otp_verifications
            SET locked_until = CURRENT_TIMESTAMP + 
                (INTERVAL '15 minutes' * POWER(2, v_otp.attempts + 1 - v_otp.max_attempts))
            WHERE id = v_otp.id;
            
            -- Log suspicious activity
            INSERT INTO public.suspicious_activities (
                user_id, ip_address, activity_type, severity, description
            ) VALUES (
                v_otp.user_id, p_ip_address, 'otp_lockout', 'high',
                format('OTP locked after %s failed attempts for %s', v_otp.attempts + 1, v_identifier)
            );
            
            RETURN QUERY SELECT FALSE, NULL::UUID, 'Too many failed attempts. OTP locked.'::TEXT, 0;
        ELSE
            RETURN QUERY SELECT FALSE, NULL::UUID, 'Invalid OTP code'::TEXT, 
                (v_otp.max_attempts - v_otp.attempts - 1);
        END IF;
        RETURN;
    END IF;
    
    -- OTP is valid - mark as verified
    UPDATE public.otp_verifications
    SET verified_at = CURRENT_TIMESTAMP
    WHERE id = v_otp.id;
    
    -- Clear rate limits for successful verification
    DELETE FROM public.rate_limits
    WHERE identifier = v_identifier
    AND identifier_type = v_identifier_type
    AND action IN ('otp_request', 'otp_verify');
    
    RETURN QUERY SELECT TRUE, v_otp.user_id, NULL::TEXT, v_otp.max_attempts;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 6. CLEANUP FUNCTION FOR EXPIRED OTPs
-- ==========================================
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.otp_verifications
    WHERE expires_at < CURRENT_TIMESTAMP - INTERVAL '24 hours'
    OR verified_at < CURRENT_TIMESTAMP - INTERVAL '7 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Also clean old rate limits
    DELETE FROM public.rate_limits
    WHERE window_start < CURRENT_TIMESTAMP - INTERVAL '24 hours'
    AND blocked_until IS NULL;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 7. IP BLOCKING FUNCTIONS
-- ==========================================
CREATE OR REPLACE FUNCTION public.check_ip_blocked(p_ip_address INET)
RETURNS BOOLEAN AS $$
DECLARE
    v_blocked BOOLEAN := FALSE;
BEGIN
    -- Check if IP is in suspicious activities with high/critical severity
    SELECT EXISTS(
        SELECT 1 
        FROM public.suspicious_activities
        WHERE ip_address = p_ip_address
        AND severity IN ('high', 'critical')
        AND (resolved_at IS NULL OR resolved_at > CURRENT_TIMESTAMP - INTERVAL '24 hours')
        AND blocked = true
    ) INTO v_blocked;
    
    -- Check rate limits
    IF NOT v_blocked THEN
        SELECT EXISTS(
            SELECT 1
            FROM public.rate_limits
            WHERE identifier = p_ip_address::TEXT
            AND identifier_type = 'ip'
            AND blocked_until > CURRENT_TIMESTAMP
        ) INTO v_blocked;
    END IF;
    
    RETURN v_blocked;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 8. MONITORING FUNCTIONS
-- ==========================================
CREATE OR REPLACE FUNCTION public.get_otp_statistics(
    p_time_window INTERVAL DEFAULT '24 hours'
)
RETURNS TABLE(
    total_requests BIGINT,
    successful_verifications BIGINT,
    failed_attempts BIGINT,
    locked_accounts BIGINT,
    suspicious_activities BIGINT,
    average_verification_time INTERVAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_requests,
        COUNT(verified_at)::BIGINT as successful_verifications,
        SUM(attempts)::BIGINT as failed_attempts,
        COUNT(CASE WHEN locked_until > CURRENT_TIMESTAMP THEN 1 END)::BIGINT as locked_accounts,
        (SELECT COUNT(*) FROM public.suspicious_activities 
         WHERE occurred_at > CURRENT_TIMESTAMP - p_time_window)::BIGINT as suspicious_activities,
        AVG(verified_at - created_at) as average_verification_time
    FROM public.otp_verifications
    WHERE created_at > CURRENT_TIMESTAMP - p_time_window;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 9. RLS POLICIES
-- ==========================================

-- Enable RLS
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suspicious_activities ENABLE ROW LEVEL SECURITY;

-- Service role can do everything
CREATE POLICY "Service role has full access to OTP" ON public.otp_verifications
FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role has full access to rate limits" ON public.rate_limits
FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role has full access to suspicious activities" ON public.suspicious_activities
FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Users can only see their own OTP verifications
CREATE POLICY "Users can view own OTP verifications" ON public.otp_verifications
FOR SELECT USING (auth.uid() = user_id);

-- ==========================================
-- 10. TRIGGERS FOR AUDIT LOGGING
-- ==========================================

-- Trigger function for OTP audit
CREATE OR REPLACE FUNCTION public.audit_otp_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.audit_logs (
            table_name, record_id, action, user_id, 
            changes, ip_address, created_at
        ) VALUES (
            'otp_verifications', NEW.id, 'otp_generated', NEW.user_id,
            jsonb_build_object(
                'email', NEW.email,
                'phone', NEW.phone,
                'purpose', NEW.purpose
            ),
            NEW.ip_address, CURRENT_TIMESTAMP
        );
    ELSIF TG_OP = 'UPDATE' AND NEW.verified_at IS NOT NULL AND OLD.verified_at IS NULL THEN
        INSERT INTO public.audit_logs (
            table_name, record_id, action, user_id,
            changes, ip_address, created_at
        ) VALUES (
            'otp_verifications', NEW.id, 'otp_verified', NEW.user_id,
            jsonb_build_object(
                'verified_at', NEW.verified_at,
                'attempts', NEW.attempts
            ),
            NEW.ip_address, CURRENT_TIMESTAMP
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER audit_otp_activity_trigger
AFTER INSERT OR UPDATE ON public.otp_verifications
FOR EACH ROW EXECUTE FUNCTION public.audit_otp_activity();

-- ==========================================
-- COMMENTS FOR DOCUMENTATION
-- ==========================================

COMMENT ON TABLE public.otp_verifications IS 
'Secure OTP verification table with bcrypt hashing and rate limiting';

COMMENT ON TABLE public.rate_limits IS 
'Rate limiting table for preventing brute force attacks and abuse';

COMMENT ON TABLE public.suspicious_activities IS 
'Tracks suspicious activities for security monitoring and response';

COMMENT ON FUNCTION public.generate_secure_otp IS 
'Generates a secure OTP with rate limiting and suspicious activity detection';

COMMENT ON FUNCTION public.verify_secure_otp IS 
'Verifies an OTP with bcrypt comparison and lockout protection';