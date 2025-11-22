-- ==========================================
-- SECURE SESSION MANAGEMENT
-- ==========================================
-- VERSION: 1.0
-- CREATED: 2025-08-19
-- PURPOSE: Phase 0.2 - Enhanced session security with server-side validation,
--          device fingerprinting, and automatic expiry management
-- ==========================================

-- Drop and recreate sessions table with enhanced security
DROP TABLE IF EXISTS public.questionnaire_sessions CASCADE;

-- ==========================================
-- 1. SECURE SESSIONS TABLE
-- ==========================================
CREATE TABLE public.questionnaire_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Session tokens (cryptographically secure)
    session_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
    refresh_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
    csrf_token TEXT NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
    
    -- Session state
    status TEXT NOT NULL DEFAULT 'active' 
        CHECK (status IN ('active', 'inactive', 'expired', 'revoked', 'locked')),
    
    -- Security fields
    ip_address INET NOT NULL,
    user_agent TEXT,
    device_fingerprint TEXT NOT NULL,
    device_name TEXT,
    device_type TEXT CHECK (device_type IN ('mobile', 'tablet', 'desktop', 'unknown')),
    
    -- Multi-device tracking
    device_id UUID DEFAULT uuid_generate_v4(),
    is_primary_device BOOLEAN DEFAULT false,
    trusted_device BOOLEAN DEFAULT false,
    
    -- Timing
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_activity_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ DEFAULT (CURRENT_TIMESTAMP + INTERVAL '2 hours'),
    inactive_expires_at TIMESTAMPTZ DEFAULT (CURRENT_TIMESTAMP + INTERVAL '30 minutes'),
    refresh_expires_at TIMESTAMPTZ DEFAULT (CURRENT_TIMESTAMP + INTERVAL '7 days'),
    
    -- Activity tracking
    activity_count INTEGER DEFAULT 0,
    last_validated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    validation_failures INTEGER DEFAULT 0,
    
    -- Form progress
    current_step INTEGER DEFAULT 1,
    form_data JSONB DEFAULT '{}',
    completed_steps INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Constraints
    CONSTRAINT valid_expiry CHECK (expires_at > created_at),
    CONSTRAINT valid_refresh CHECK (refresh_expires_at > expires_at)
);

-- Indexes for performance
CREATE INDEX idx_session_token ON public.questionnaire_sessions(session_token) WHERE status = 'active';
CREATE INDEX idx_session_user ON public.questionnaire_sessions(user_id) WHERE status = 'active';
CREATE INDEX idx_session_device ON public.questionnaire_sessions(device_fingerprint);
CREATE INDEX idx_session_expires ON public.questionnaire_sessions(expires_at) WHERE status = 'active';
CREATE INDEX idx_session_inactive ON public.questionnaire_sessions(inactive_expires_at) WHERE status = 'active';

-- ==========================================
-- 2. SESSION VALIDATION LOG
-- ==========================================
CREATE TABLE public.session_validations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.questionnaire_sessions(id) ON DELETE CASCADE,
    
    -- Validation details
    validation_type TEXT NOT NULL CHECK (validation_type IN (
        'token', 'expiry', 'ip', 'device', 'csrf', 'activity'
    )),
    is_valid BOOLEAN NOT NULL,
    failure_reason TEXT,
    
    -- Request context
    ip_address INET,
    user_agent TEXT,
    device_fingerprint TEXT,
    endpoint TEXT,
    
    -- Timing
    validated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    validation_duration_ms INTEGER,
    
    -- Response
    action_taken TEXT,
    new_token_issued BOOLEAN DEFAULT false
);

-- Index for monitoring
CREATE INDEX idx_validation_session ON public.session_validations(session_id);
CREATE INDEX idx_validation_failures ON public.session_validations(is_valid) WHERE is_valid = false;

-- ==========================================
-- 3. DEVICE REGISTRY
-- ==========================================
CREATE TABLE public.trusted_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Device identification
    device_fingerprint TEXT NOT NULL,
    device_name TEXT,
    device_type TEXT,
    device_id UUID NOT NULL,
    
    -- Trust status
    is_trusted BOOLEAN DEFAULT false,
    trust_level INTEGER DEFAULT 0 CHECK (trust_level >= 0 AND trust_level <= 10),
    verified_at TIMESTAMPTZ,
    verified_by TEXT, -- email/phone/authenticator
    
    -- Security
    last_seen_ip INET,
    last_seen_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    successful_logins INTEGER DEFAULT 0,
    failed_attempts INTEGER DEFAULT 0,
    
    -- Management
    added_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ DEFAULT (CURRENT_TIMESTAMP + INTERVAL '90 days'),
    revoked_at TIMESTAMPTZ,
    revoke_reason TEXT,
    
    -- Metadata
    browser_info JSONB,
    os_info JSONB,
    
    CONSTRAINT unique_user_device UNIQUE (user_id, device_fingerprint)
);

-- Indexes
CREATE INDEX idx_trusted_user ON public.trusted_devices(user_id) WHERE is_trusted = true;
CREATE INDEX idx_trusted_fingerprint ON public.trusted_devices(device_fingerprint);

-- ==========================================
-- 4. SESSION CREATION FUNCTION
-- ==========================================
CREATE OR REPLACE FUNCTION public.create_secure_session(
    p_user_id UUID,
    p_ip_address INET,
    p_user_agent TEXT,
    p_device_fingerprint TEXT,
    p_device_name TEXT DEFAULT NULL,
    p_form_data JSONB DEFAULT '{}'
)
RETURNS TABLE(
    success BOOLEAN,
    session_id UUID,
    session_token TEXT,
    refresh_token TEXT,
    csrf_token TEXT,
    expires_at TIMESTAMPTZ,
    error_message TEXT
) AS $$
DECLARE
    v_session_id UUID;
    v_session_token TEXT;
    v_refresh_token TEXT;
    v_csrf_token TEXT;
    v_expires_at TIMESTAMPTZ;
    v_device_type TEXT;
    v_trusted_device RECORD;
    v_existing_sessions INTEGER;
BEGIN
    -- Check for existing active sessions
    SELECT COUNT(*) INTO v_existing_sessions
    FROM public.questionnaire_sessions
    WHERE user_id = p_user_id
    AND status = 'active'
    AND expires_at > CURRENT_TIMESTAMP;
    
    -- Limit concurrent sessions per user (max 5)
    IF v_existing_sessions >= 5 THEN
        -- Revoke oldest session
        UPDATE public.questionnaire_sessions
        SET status = 'revoked',
            metadata = metadata || jsonb_build_object('revoke_reason', 'max_sessions_exceeded')
        WHERE user_id = p_user_id
        AND status = 'active'
        ORDER BY created_at ASC
        LIMIT 1;
    END IF;
    
    -- Detect device type from user agent
    v_device_type := CASE
        WHEN p_user_agent ILIKE '%mobile%' OR p_user_agent ILIKE '%android%' OR p_user_agent ILIKE '%iphone%' THEN 'mobile'
        WHEN p_user_agent ILIKE '%tablet%' OR p_user_agent ILIKE '%ipad%' THEN 'tablet'
        WHEN p_user_agent ILIKE '%windows%' OR p_user_agent ILIKE '%mac%' OR p_user_agent ILIKE '%linux%' THEN 'desktop'
        ELSE 'unknown'
    END;
    
    -- Check if device is trusted
    SELECT * INTO v_trusted_device
    FROM public.trusted_devices
    WHERE user_id = p_user_id
    AND device_fingerprint = p_device_fingerprint
    AND is_trusted = true
    AND expires_at > CURRENT_TIMESTAMP;
    
    -- Generate secure tokens
    v_session_token := encode(gen_random_bytes(32), 'hex');
    v_refresh_token := encode(gen_random_bytes(32), 'hex');
    v_csrf_token := encode(gen_random_bytes(32), 'hex');
    
    -- Set expiry based on trust level
    IF v_trusted_device.is_trusted THEN
        v_expires_at := CURRENT_TIMESTAMP + INTERVAL '4 hours'; -- Extended for trusted devices
    ELSE
        v_expires_at := CURRENT_TIMESTAMP + INTERVAL '2 hours'; -- Standard expiry
    END IF;
    
    -- Create session
    INSERT INTO public.questionnaire_sessions (
        user_id, session_token, refresh_token, csrf_token,
        ip_address, user_agent, device_fingerprint, device_name, device_type,
        trusted_device, expires_at, form_data
    ) VALUES (
        p_user_id, v_session_token, v_refresh_token, v_csrf_token,
        p_ip_address, p_user_agent, p_device_fingerprint, p_device_name, v_device_type,
        v_trusted_device.is_trusted, v_expires_at, p_form_data
    ) RETURNING id INTO v_session_id;
    
    -- Update device last seen
    IF v_trusted_device.is_trusted THEN
        UPDATE public.trusted_devices
        SET last_seen_at = CURRENT_TIMESTAMP,
            last_seen_ip = p_ip_address,
            successful_logins = successful_logins + 1
        WHERE id = v_trusted_device.id;
    END IF;
    
    -- Log session creation in audit
    INSERT INTO public.audit_logs (
        table_name, record_id, action, user_id, ip_address, changes
    ) VALUES (
        'questionnaire_sessions', v_session_id, 'session_created', p_user_id, p_ip_address,
        jsonb_build_object(
            'device_type', v_device_type,
            'trusted', COALESCE(v_trusted_device.is_trusted, false)
        )
    );
    
    RETURN QUERY SELECT 
        TRUE, v_session_id, v_session_token, v_refresh_token, 
        v_csrf_token, v_expires_at, NULL::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 5. SESSION VALIDATION FUNCTION
-- ==========================================
CREATE OR REPLACE FUNCTION public.validate_session(
    p_session_token TEXT,
    p_csrf_token TEXT DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_device_fingerprint TEXT DEFAULT NULL,
    p_endpoint TEXT DEFAULT NULL
)
RETURNS TABLE(
    is_valid BOOLEAN,
    session_id UUID,
    user_id UUID,
    new_token TEXT,
    error_message TEXT,
    requires_action TEXT
) AS $$
DECLARE
    v_session RECORD;
    v_validation_start TIMESTAMPTZ;
    v_validation_ms INTEGER;
    v_new_token TEXT DEFAULT NULL;
    v_requires_action TEXT DEFAULT NULL;
BEGIN
    v_validation_start := clock_timestamp();
    
    -- Find session
    SELECT * INTO v_session
    FROM public.questionnaire_sessions
    WHERE session_token = p_session_token
    AND status = 'active';
    
    IF NOT FOUND THEN
        -- Log failed validation
        INSERT INTO public.session_validations (
            validation_type, is_valid, failure_reason, 
            ip_address, device_fingerprint, endpoint
        ) VALUES (
            'token', false, 'Session not found or inactive',
            p_ip_address, p_device_fingerprint, p_endpoint
        );
        
        RETURN QUERY SELECT FALSE, NULL::UUID, NULL::UUID, NULL::TEXT, 
            'Invalid session'::TEXT, NULL::TEXT;
        RETURN;
    END IF;
    
    -- Check expiry
    IF v_session.expires_at < CURRENT_TIMESTAMP THEN
        UPDATE public.questionnaire_sessions
        SET status = 'expired'
        WHERE id = v_session.id;
        
        INSERT INTO public.session_validations (
            session_id, validation_type, is_valid, failure_reason
        ) VALUES (
            v_session.id, 'expiry', false, 'Session expired'
        );
        
        RETURN QUERY SELECT FALSE, v_session.id, v_session.user_id, NULL::TEXT,
            'Session expired'::TEXT, 'login'::TEXT;
        RETURN;
    END IF;
    
    -- Check inactive expiry
    IF v_session.inactive_expires_at < CURRENT_TIMESTAMP THEN
        UPDATE public.questionnaire_sessions
        SET status = 'inactive'
        WHERE id = v_session.id;
        
        RETURN QUERY SELECT FALSE, v_session.id, v_session.user_id, NULL::TEXT,
            'Session inactive too long'::TEXT, 'refresh'::TEXT;
        RETURN;
    END IF;
    
    -- Validate CSRF token if provided
    IF p_csrf_token IS NOT NULL AND p_csrf_token != v_session.csrf_token THEN
        UPDATE public.questionnaire_sessions
        SET validation_failures = validation_failures + 1
        WHERE id = v_session.id;
        
        -- Lock session after 3 failures
        IF v_session.validation_failures + 1 >= 3 THEN
            UPDATE public.questionnaire_sessions
            SET status = 'locked'
            WHERE id = v_session.id;
            
            INSERT INTO public.suspicious_activities (
                user_id, ip_address, activity_type, severity, description
            ) VALUES (
                v_session.user_id, p_ip_address, 'csrf_failure', 'high',
                'Multiple CSRF validation failures'
            );
        END IF;
        
        INSERT INTO public.session_validations (
            session_id, validation_type, is_valid, failure_reason
        ) VALUES (
            v_session.id, 'csrf', false, 'CSRF token mismatch'
        );
        
        RETURN QUERY SELECT FALSE, v_session.id, v_session.user_id, NULL::TEXT,
            'Security validation failed'::TEXT, NULL::TEXT;
        RETURN;
    END IF;
    
    -- Validate device fingerprint if provided
    IF p_device_fingerprint IS NOT NULL AND p_device_fingerprint != v_session.device_fingerprint THEN
        -- Device changed - require re-authentication
        v_requires_action := 'verify_device';
        
        INSERT INTO public.suspicious_activities (
            user_id, ip_address, activity_type, severity, description
        ) VALUES (
            v_session.user_id, p_ip_address, 'device_change', 'medium',
            format('Device fingerprint changed during session %s', v_session.id)
        );
    END IF;
    
    -- Check IP address change
    IF p_ip_address IS NOT NULL AND p_ip_address != v_session.ip_address THEN
        -- Log IP change
        INSERT INTO public.session_validations (
            session_id, validation_type, is_valid, failure_reason,
            ip_address, action_taken
        ) VALUES (
            v_session.id, 'ip', true, 'IP address changed',
            p_ip_address, 'logged'
        );
    END IF;
    
    -- Update session activity
    UPDATE public.questionnaire_sessions
    SET last_activity_at = CURRENT_TIMESTAMP,
        inactive_expires_at = CURRENT_TIMESTAMP + INTERVAL '30 minutes',
        activity_count = activity_count + 1,
        last_validated_at = CURRENT_TIMESTAMP
    WHERE id = v_session.id;
    
    -- Token rotation for enhanced security (every 10 validations)
    IF v_session.activity_count % 10 = 0 THEN
        v_new_token := encode(gen_random_bytes(32), 'hex');
        
        UPDATE public.questionnaire_sessions
        SET session_token = v_new_token
        WHERE id = v_session.id;
    END IF;
    
    -- Calculate validation duration
    v_validation_ms := EXTRACT(MILLISECONDS FROM clock_timestamp() - v_validation_start)::INTEGER;
    
    -- Log successful validation
    INSERT INTO public.session_validations (
        session_id, validation_type, is_valid, 
        ip_address, device_fingerprint, endpoint,
        validation_duration_ms, new_token_issued
    ) VALUES (
        v_session.id, 'token', true,
        p_ip_address, p_device_fingerprint, p_endpoint,
        v_validation_ms, v_new_token IS NOT NULL
    );
    
    RETURN QUERY SELECT TRUE, v_session.id, v_session.user_id, 
        v_new_token, NULL::TEXT, v_requires_action;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 6. SESSION REFRESH FUNCTION
-- ==========================================
CREATE OR REPLACE FUNCTION public.refresh_session(
    p_refresh_token TEXT,
    p_ip_address INET,
    p_device_fingerprint TEXT
)
RETURNS TABLE(
    success BOOLEAN,
    session_token TEXT,
    refresh_token TEXT,
    csrf_token TEXT,
    expires_at TIMESTAMPTZ,
    error_message TEXT
) AS $$
DECLARE
    v_session RECORD;
    v_new_session_token TEXT;
    v_new_refresh_token TEXT;
    v_new_csrf_token TEXT;
BEGIN
    -- Find session by refresh token
    SELECT * INTO v_session
    FROM public.questionnaire_sessions
    WHERE refresh_token = p_refresh_token
    AND refresh_expires_at > CURRENT_TIMESTAMP;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, NULL::TEXT, NULL::TEXT, NULL::TEXT,
            NULL::TIMESTAMPTZ, 'Invalid or expired refresh token'::TEXT;
        RETURN;
    END IF;
    
    -- Validate device
    IF v_session.device_fingerprint != p_device_fingerprint THEN
        -- Log suspicious activity
        INSERT INTO public.suspicious_activities (
            user_id, ip_address, activity_type, severity, description
        ) VALUES (
            v_session.user_id, p_ip_address, 'refresh_device_mismatch', 'high',
            'Refresh token used from different device'
        );
        
        -- Revoke session
        UPDATE public.questionnaire_sessions
        SET status = 'revoked'
        WHERE id = v_session.id;
        
        RETURN QUERY SELECT FALSE, NULL::TEXT, NULL::TEXT, NULL::TEXT,
            NULL::TIMESTAMPTZ, 'Security violation detected'::TEXT;
        RETURN;
    END IF;
    
    -- Generate new tokens
    v_new_session_token := encode(gen_random_bytes(32), 'hex');
    v_new_refresh_token := encode(gen_random_bytes(32), 'hex');
    v_new_csrf_token := encode(gen_random_bytes(32), 'hex');
    
    -- Update session with new tokens
    UPDATE public.questionnaire_sessions
    SET session_token = v_new_session_token,
        refresh_token = v_new_refresh_token,
        csrf_token = v_new_csrf_token,
        expires_at = CURRENT_TIMESTAMP + INTERVAL '2 hours',
        inactive_expires_at = CURRENT_TIMESTAMP + INTERVAL '30 minutes',
        refresh_expires_at = CURRENT_TIMESTAMP + INTERVAL '7 days',
        last_activity_at = CURRENT_TIMESTAMP,
        status = 'active'
    WHERE id = v_session.id
    RETURNING expires_at INTO expires_at;
    
    -- Log refresh
    INSERT INTO public.audit_logs (
        table_name, record_id, action, user_id, ip_address
    ) VALUES (
        'questionnaire_sessions', v_session.id, 'session_refreshed',
        v_session.user_id, p_ip_address
    );
    
    RETURN QUERY SELECT TRUE, v_new_session_token, v_new_refresh_token,
        v_new_csrf_token, expires_at, NULL::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 7. SESSION REVOCATION FUNCTION
-- ==========================================
CREATE OR REPLACE FUNCTION public.revoke_session(
    p_session_token TEXT,
    p_reason TEXT DEFAULT 'user_logout'
)
RETURNS BOOLEAN AS $$
DECLARE
    v_session RECORD;
BEGIN
    -- Find and revoke session
    UPDATE public.questionnaire_sessions
    SET status = 'revoked',
        metadata = metadata || jsonb_build_object(
            'revoked_at', CURRENT_TIMESTAMP,
            'revoke_reason', p_reason
        )
    WHERE session_token = p_session_token
    AND status = 'active'
    RETURNING * INTO v_session;
    
    IF FOUND THEN
        -- Log revocation
        INSERT INTO public.audit_logs (
            table_name, record_id, action, user_id, changes
        ) VALUES (
            'questionnaire_sessions', v_session.id, 'session_revoked',
            v_session.user_id, jsonb_build_object('reason', p_reason)
        );
        
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 8. CLEANUP FUNCTIONS
-- ==========================================
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    v_expired_count INTEGER;
    v_inactive_count INTEGER;
    v_total_count INTEGER;
BEGIN
    -- Mark expired sessions
    UPDATE public.questionnaire_sessions
    SET status = 'expired'
    WHERE status = 'active'
    AND expires_at < CURRENT_TIMESTAMP;
    GET DIAGNOSTICS v_expired_count = ROW_COUNT;
    
    -- Mark inactive sessions
    UPDATE public.questionnaire_sessions
    SET status = 'inactive'
    WHERE status = 'active'
    AND inactive_expires_at < CURRENT_TIMESTAMP;
    GET DIAGNOSTICS v_inactive_count = ROW_COUNT;
    
    -- Delete old sessions (> 30 days)
    DELETE FROM public.questionnaire_sessions
    WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '30 days';
    
    v_total_count := v_expired_count + v_inactive_count;
    RETURN v_total_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 9. MONITORING FUNCTIONS
-- ==========================================
CREATE OR REPLACE FUNCTION public.get_session_statistics(
    p_user_id UUID DEFAULT NULL,
    p_time_window INTERVAL DEFAULT '24 hours'
)
RETURNS TABLE(
    active_sessions BIGINT,
    expired_sessions BIGINT,
    revoked_sessions BIGINT,
    average_session_duration INTERVAL,
    failed_validations BIGINT,
    token_rotations BIGINT,
    unique_devices BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(CASE WHEN status = 'active' THEN 1 END)::BIGINT as active_sessions,
        COUNT(CASE WHEN status = 'expired' THEN 1 END)::BIGINT as expired_sessions,
        COUNT(CASE WHEN status = 'revoked' THEN 1 END)::BIGINT as revoked_sessions,
        AVG(CASE 
            WHEN status IN ('expired', 'revoked') 
            THEN last_activity_at - created_at 
            ELSE NULL 
        END) as average_session_duration,
        (SELECT COUNT(*) FROM public.session_validations 
         WHERE is_valid = false 
         AND validated_at > CURRENT_TIMESTAMP - p_time_window
         AND (p_user_id IS NULL OR session_id IN (
             SELECT id FROM public.questionnaire_sessions WHERE user_id = p_user_id
         )))::BIGINT as failed_validations,
        (SELECT COUNT(*) FROM public.session_validations 
         WHERE new_token_issued = true 
         AND validated_at > CURRENT_TIMESTAMP - p_time_window
         AND (p_user_id IS NULL OR session_id IN (
             SELECT id FROM public.questionnaire_sessions WHERE user_id = p_user_id
         )))::BIGINT as token_rotations,
        COUNT(DISTINCT device_fingerprint)::BIGINT as unique_devices
    FROM public.questionnaire_sessions
    WHERE created_at > CURRENT_TIMESTAMP - p_time_window
    AND (p_user_id IS NULL OR user_id = p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 10. RLS POLICIES
-- ==========================================

-- Enable RLS
ALTER TABLE public.questionnaire_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trusted_devices ENABLE ROW LEVEL SECURITY;

-- Service role full access
CREATE POLICY "Service role sessions" ON public.questionnaire_sessions
FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role validations" ON public.session_validations
FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role devices" ON public.trusted_devices
FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Users can see own sessions
CREATE POLICY "Users own sessions" ON public.questionnaire_sessions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users own devices" ON public.trusted_devices
FOR SELECT USING (auth.uid() = user_id);

-- ==========================================
-- COMMENTS FOR DOCUMENTATION
-- ==========================================

COMMENT ON TABLE public.questionnaire_sessions IS 
'Secure session management with device fingerprinting and automatic expiry';

COMMENT ON TABLE public.session_validations IS 
'Audit log of all session validation attempts for security monitoring';

COMMENT ON TABLE public.trusted_devices IS 
'Registry of trusted devices per user for enhanced security';

COMMENT ON FUNCTION public.create_secure_session IS 
'Creates a cryptographically secure session with device tracking';

COMMENT ON FUNCTION public.validate_session IS 
'Validates session with multiple security checks and token rotation';

COMMENT ON FUNCTION public.refresh_session IS 
'Refreshes session tokens with device validation';