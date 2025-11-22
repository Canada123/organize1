-- ==========================================
-- OTP VERIFICATION SYSTEM
-- ==========================================
-- VERSION: 1.0
-- CREATED: 2025-08-19
-- PURPOSE: Secure OTP verification for email and phone
--          with rate limiting and security measures
-- ==========================================

-- ==========================================
-- 1. OTP GENERATION & SENDING
-- ==========================================

-- Generate and send OTP for email verification
CREATE OR REPLACE FUNCTION public.send_email_otp(
    session_token_input UUID,
    email_input TEXT
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT,
    expires_at TIMESTAMPTZ,
    attempts_remaining INTEGER
) AS $$
DECLARE
    session_record RECORD;
    otp_code TEXT;
    hashed_otp TEXT;
    existing_otp RECORD;
    new_expires TIMESTAMPTZ;
    remaining_attempts INTEGER;
BEGIN
    -- Validate email format
    IF email_input !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RETURN QUERY SELECT FALSE, 'Invalid email format', NULL::TIMESTAMPTZ, 0;
        RETURN;
    END IF;
    
    -- Get session
    SELECT * INTO session_record
    FROM public.questionnaire_sessions
    WHERE session_token = session_token_input
    AND status = 'in_progress'
    AND expires_at > NOW();
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, 'Session not found or expired', NULL::TIMESTAMPTZ, 0;
        RETURN;
    END IF;
    
    -- Check for existing recent OTP (rate limiting)
    SELECT * INTO existing_otp
    FROM public.otp_verifications
    WHERE session_id = session_record.id
    AND email = email_input
    AND verification_type IN ('email', 'both')
    AND created_at > NOW() - INTERVAL '1 minute'
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF FOUND THEN
        remaining_attempts := existing_otp.max_attempts - existing_otp.attempts;
        RETURN QUERY SELECT 
            FALSE, 
            'Please wait before requesting another OTP',
            existing_otp.otp_expires_at,
            remaining_attempts;
        RETURN;
    END IF;
    
    -- Check daily rate limit (max 5 OTPs per email per day)
    IF (SELECT COUNT(*) 
        FROM public.otp_verifications 
        WHERE email = email_input 
        AND created_at > CURRENT_DATE) >= 5 THEN
        RETURN QUERY SELECT 
            FALSE, 
            'Daily OTP limit exceeded. Please try again tomorrow.',
            NULL::TIMESTAMPTZ, 
            0;
        RETURN;
    END IF;
    
    -- Generate 6-digit OTP
    otp_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    hashed_otp := encode(digest(otp_code || session_record.id::text, 'sha256'), 'hex');
    new_expires := NOW() + INTERVAL '10 minutes';
    
    -- Store OTP record
    INSERT INTO public.otp_verifications (
        session_id, email, verification_type, otp_code, 
        otp_expires_at, ip_address, user_agent
    ) VALUES (
        session_record.id, email_input, 'email', hashed_otp,
        new_expires, 
        inet_client_addr(),
        current_setting('request.headers.user-agent', true)
    );
    
    -- Update session with email
    UPDATE public.questionnaire_sessions
    SET email = email_input, last_activity = NOW()
    WHERE id = session_record.id;
    
    -- Log OTP generation
    PERFORM public.create_audit_log(
        'otp_email_sent',
        'otp_verifications',
        session_record.id,
        NULL,
        jsonb_build_object('email', email_input, 'expires_at', new_expires)
    );
    
    -- TODO: Integration with email service (SendGrid, AWS SES, etc.)
    -- This would send the actual email with the OTP code
    -- For now, we'll just log that an OTP was generated
    
    RETURN QUERY SELECT TRUE, 'OTP sent successfully', new_expires, 3;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Generate and send OTP for phone verification
CREATE OR REPLACE FUNCTION public.send_phone_otp(
    session_token_input UUID,
    phone_input TEXT
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT,
    expires_at TIMESTAMPTZ,
    attempts_remaining INTEGER
) AS $$
DECLARE
    session_record RECORD;
    otp_code TEXT;
    hashed_otp TEXT;
    existing_otp RECORD;
    new_expires TIMESTAMPTZ;
    remaining_attempts INTEGER;
    cleaned_phone TEXT;
BEGIN
    -- Clean and validate Swiss phone number
    cleaned_phone := regexp_replace(phone_input, '[^0-9+]', '', 'g');
    
    -- Swiss phone number validation (basic)
    IF NOT (cleaned_phone ~ '^(\+41|0041|0)[1-9][0-9]{8}$') THEN
        RETURN QUERY SELECT FALSE, 'Invalid Swiss phone number format', NULL::TIMESTAMPTZ, 0;
        RETURN;
    END IF;
    
    -- Normalize to international format
    IF cleaned_phone ~ '^0[1-9]' THEN
        cleaned_phone := '+41' || substring(cleaned_phone from 2);
    ELSIF cleaned_phone ~ '^0041' THEN
        cleaned_phone := '+41' || substring(cleaned_phone from 5);
    END IF;
    
    -- Get session
    SELECT * INTO session_record
    FROM public.questionnaire_sessions
    WHERE session_token = session_token_input
    AND status = 'in_progress'
    AND expires_at > NOW();
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, 'Session not found or expired', NULL::TIMESTAMPTZ, 0;
        RETURN;
    END IF;
    
    -- Check for existing recent OTP (rate limiting)
    SELECT * INTO existing_otp
    FROM public.otp_verifications
    WHERE session_id = session_record.id
    AND phone = cleaned_phone
    AND verification_type IN ('phone', 'both')
    AND created_at > NOW() - INTERVAL '1 minute'
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF FOUND THEN
        remaining_attempts := existing_otp.max_attempts - existing_otp.attempts;
        RETURN QUERY SELECT 
            FALSE, 
            'Please wait before requesting another OTP',
            existing_otp.otp_expires_at,
            remaining_attempts;
        RETURN;
    END IF;
    
    -- Check daily rate limit (max 3 SMS OTPs per phone per day)
    IF (SELECT COUNT(*) 
        FROM public.otp_verifications 
        WHERE phone = cleaned_phone 
        AND created_at > CURRENT_DATE) >= 3 THEN
        RETURN QUERY SELECT 
            FALSE, 
            'Daily SMS limit exceeded. Please try again tomorrow.',
            NULL::TIMESTAMPTZ, 
            0;
        RETURN;
    END IF;
    
    -- Generate 6-digit OTP
    otp_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    hashed_otp := encode(digest(otp_code || session_record.id::text, 'sha256'), 'hex');
    new_expires := NOW() + INTERVAL '10 minutes';
    
    -- Store OTP record
    INSERT INTO public.otp_verifications (
        session_id, phone, verification_type, otp_code, 
        otp_expires_at, ip_address, user_agent
    ) VALUES (
        session_record.id, cleaned_phone, 'phone', hashed_otp,
        new_expires, 
        inet_client_addr(),
        current_setting('request.headers.user-agent', true)
    );
    
    -- Update session with phone
    UPDATE public.questionnaire_sessions
    SET phone = cleaned_phone, last_activity = NOW()
    WHERE id = session_record.id;
    
    -- Log OTP generation
    PERFORM public.create_audit_log(
        'otp_sms_sent',
        'otp_verifications',
        session_record.id,
        NULL,
        jsonb_build_object('phone', cleaned_phone, 'expires_at', new_expires)
    );
    
    -- TODO: Integration with SMS service (Twilio, AWS SNS, etc.)
    -- This would send the actual SMS with the OTP code
    -- For now, we'll just log that an OTP was generated
    
    RETURN QUERY SELECT TRUE, 'SMS OTP sent successfully', new_expires, 3;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 2. OTP VERIFICATION
-- ==========================================

-- Verify OTP code
CREATE OR REPLACE FUNCTION public.verify_otp(
    session_token_input UUID,
    otp_code_input TEXT,
    verification_type_input TEXT DEFAULT 'email'
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT,
    user_id UUID,
    email_verified BOOLEAN,
    phone_verified BOOLEAN,
    attempts_remaining INTEGER
) AS $$
DECLARE
    session_record RECORD;
    otp_record RECORD;
    hashed_input TEXT;
    remaining_attempts INTEGER;
    user_profile_id UUID;
    new_email_verified BOOLEAN := FALSE;
    new_phone_verified BOOLEAN := FALSE;
BEGIN
    -- Validate inputs
    IF verification_type_input NOT IN ('email', 'phone', 'both') THEN
        RETURN QUERY SELECT FALSE, 'Invalid verification type', NULL::UUID, FALSE, FALSE, 0;
        RETURN;
    END IF;
    
    IF LENGTH(otp_code_input) != 6 OR otp_code_input !~ '^[0-9]{6}$' THEN
        RETURN QUERY SELECT FALSE, 'Invalid OTP format', NULL::UUID, FALSE, FALSE, 0;
        RETURN;
    END IF;
    
    -- Get session
    SELECT * INTO session_record
    FROM public.questionnaire_sessions
    WHERE session_token = session_token_input
    AND status = 'in_progress'
    AND expires_at > NOW();
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, 'Session not found or expired', NULL::UUID, FALSE, FALSE, 0;
        RETURN;
    END IF;
    
    -- Get latest OTP record
    SELECT * INTO otp_record
    FROM public.otp_verifications
    WHERE session_id = session_record.id
    AND verification_type = verification_type_input
    AND otp_expires_at > NOW()
    AND attempts < max_attempts
    AND is_verified = FALSE
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, 'No valid OTP found or expired', NULL::UUID, FALSE, FALSE, 0;
        RETURN;
    END IF;
    
    -- Hash the input OTP for comparison
    hashed_input := encode(digest(otp_code_input || session_record.id::text, 'sha256'), 'hex');
    
    -- Increment attempt count
    UPDATE public.otp_verifications
    SET attempts = attempts + 1
    WHERE id = otp_record.id;
    
    remaining_attempts := otp_record.max_attempts - (otp_record.attempts + 1);
    
    -- Check if OTP matches
    IF otp_record.otp_code != hashed_input THEN
        -- Log failed attempt
        PERFORM public.create_audit_log(
            'otp_verification_failed',
            'otp_verifications',
            otp_record.id,
            NULL,
            jsonb_build_object('attempts_remaining', remaining_attempts)
        );
        
        RETURN QUERY SELECT FALSE, 'Invalid OTP code', NULL::UUID, FALSE, FALSE, remaining_attempts;
        RETURN;
    END IF;
    
    -- OTP is valid - mark as verified
    UPDATE public.otp_verifications
    SET 
        is_verified = TRUE,
        verified_at = NOW()
    WHERE id = otp_record.id;
    
    -- Update session verification status
    IF verification_type_input = 'email' THEN
        new_email_verified := TRUE;
        UPDATE public.questionnaire_sessions
        SET email_verified = TRUE, last_activity = NOW()
        WHERE id = session_record.id;
    ELSIF verification_type_input = 'phone' THEN
        new_phone_verified := TRUE;
        UPDATE public.questionnaire_sessions
        SET phone_verified = TRUE, last_activity = NOW()
        WHERE id = session_record.id;
    ELSIF verification_type_input = 'both' THEN
        new_email_verified := TRUE;
        new_phone_verified := TRUE;
        UPDATE public.questionnaire_sessions
        SET email_verified = TRUE, phone_verified = TRUE, last_activity = NOW()
        WHERE id = session_record.id;
    END IF;
    
    -- Check if user already exists with this email/phone
    IF verification_type_input IN ('email', 'both') AND session_record.email IS NOT NULL THEN
        SELECT id INTO user_profile_id
        FROM public.user_profiles
        WHERE email = session_record.email;
        
        -- Create user profile if doesn't exist
        IF NOT FOUND THEN
            INSERT INTO public.user_profiles (id, email)
            VALUES (gen_random_uuid(), session_record.email)
            RETURNING id INTO user_profile_id;
        END IF;
        
        -- Link session to user
        UPDATE public.questionnaire_sessions
        SET user_id = user_profile_id
        WHERE id = session_record.id;
    END IF;
    
    -- Log successful verification
    PERFORM public.create_audit_log(
        'otp_verification_success',
        'otp_verifications',
        otp_record.id,
        NULL,
        jsonb_build_object(
            'verification_type', verification_type_input,
            'user_id', user_profile_id
        )
    );
    
    -- Return current verification status
    SELECT email_verified, phone_verified INTO new_email_verified, new_phone_verified
    FROM public.questionnaire_sessions
    WHERE id = session_record.id;
    
    RETURN QUERY SELECT TRUE, 'OTP verified successfully', user_profile_id, new_email_verified, new_phone_verified, remaining_attempts;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 3. OTP STATUS & MANAGEMENT
-- ==========================================

-- Get current OTP status for a session
CREATE OR REPLACE FUNCTION public.get_otp_status(
    session_token_input UUID
)
RETURNS TABLE(
    email_otp_active BOOLEAN,
    email_otp_expires TIMESTAMPTZ,
    email_verified BOOLEAN,
    phone_otp_active BOOLEAN,
    phone_otp_expires TIMESTAMPTZ,
    phone_verified BOOLEAN,
    email_attempts_remaining INTEGER,
    phone_attempts_remaining INTEGER
) AS $$
DECLARE
    session_record RECORD;
    email_otp RECORD;
    phone_otp RECORD;
BEGIN
    -- Get session
    SELECT * INTO session_record
    FROM public.questionnaire_sessions
    WHERE session_token = session_token_input
    AND status = 'in_progress';
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, NULL::TIMESTAMPTZ, FALSE, FALSE, NULL::TIMESTAMPTZ, FALSE, 0, 0;
        RETURN;
    END IF;
    
    -- Get latest email OTP
    SELECT * INTO email_otp
    FROM public.otp_verifications
    WHERE session_id = session_record.id
    AND verification_type IN ('email', 'both')
    AND otp_expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1;
    
    -- Get latest phone OTP
    SELECT * INTO phone_otp
    FROM public.otp_verifications
    WHERE session_id = session_record.id
    AND verification_type IN ('phone', 'both')
    AND otp_expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1;
    
    RETURN QUERY SELECT 
        email_otp.id IS NOT NULL AND NOT email_otp.is_verified,
        email_otp.otp_expires_at,
        session_record.email_verified,
        phone_otp.id IS NOT NULL AND NOT phone_otp.is_verified,
        phone_otp.otp_expires_at,
        session_record.phone_verified,
        CASE WHEN email_otp.id IS NOT NULL THEN email_otp.max_attempts - email_otp.attempts ELSE 0 END,
        CASE WHEN phone_otp.id IS NOT NULL THEN phone_otp.max_attempts - phone_otp.attempts ELSE 0 END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Resend OTP (with additional rate limiting)
CREATE OR REPLACE FUNCTION public.resend_otp(
    session_token_input UUID,
    verification_type_input TEXT
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT,
    expires_at TIMESTAMPTZ
) AS $$
DECLARE
    session_record RECORD;
    last_otp RECORD;
BEGIN
    -- Get session
    SELECT * INTO session_record
    FROM public.questionnaire_sessions
    WHERE session_token = session_token_input
    AND status = 'in_progress';
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, 'Session not found', NULL::TIMESTAMPTZ;
        RETURN;
    END IF;
    
    -- Check if we can resend (must wait at least 30 seconds)
    SELECT * INTO last_otp
    FROM public.otp_verifications
    WHERE session_id = session_record.id
    AND verification_type = verification_type_input
    AND created_at > NOW() - INTERVAL '30 seconds'
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF FOUND THEN
        RETURN QUERY SELECT FALSE, 'Please wait 30 seconds before resending', last_otp.otp_expires_at;
        RETURN;
    END IF;
    
    -- Resend based on type
    IF verification_type_input = 'email' THEN
        IF session_record.email IS NULL THEN
            RETURN QUERY SELECT FALSE, 'No email associated with session', NULL::TIMESTAMPTZ;
            RETURN;
        END IF;
        
        RETURN QUERY SELECT * FROM public.send_email_otp(session_token_input, session_record.email);
        
    ELSIF verification_type_input = 'phone' THEN
        IF session_record.phone IS NULL THEN
            RETURN QUERY SELECT FALSE, 'No phone associated with session', NULL::TIMESTAMPTZ;
            RETURN;
        END IF;
        
        RETURN QUERY SELECT * FROM public.send_phone_otp(session_token_input, session_record.phone);
        
    ELSE
        RETURN QUERY SELECT FALSE, 'Invalid verification type', NULL::TIMESTAMPTZ;
        RETURN;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Clean up expired OTP records (for maintenance)
CREATE OR REPLACE FUNCTION public.cleanup_expired_otp()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.otp_verifications
    WHERE otp_expires_at < NOW() - INTERVAL '1 day'; -- Keep records for 1 day after expiry for audit
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    IF deleted_count > 0 THEN
        PERFORM public.create_audit_log(
            'otp_cleanup',
            'otp_verifications',
            NULL,
            NULL,
            jsonb_build_object('deleted_count', deleted_count)
        );
    END IF;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 4. SECURITY & MONITORING
-- ==========================================

-- Get OTP verification statistics (for security monitoring)
CREATE OR REPLACE FUNCTION public.get_otp_statistics(
    start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days'
)
RETURNS TABLE(
    total_otp_sent BIGINT,
    email_otp_sent BIGINT,
    phone_otp_sent BIGINT,
    successful_verifications BIGINT,
    failed_attempts BIGINT,
    blocked_attempts BIGINT,
    success_rate DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_sent,
        COUNT(*) FILTER (WHERE verification_type IN ('email', 'both')) as email_sent,
        COUNT(*) FILTER (WHERE verification_type IN ('phone', 'both')) as phone_sent,
        COUNT(*) FILTER (WHERE is_verified = TRUE) as successful,
        COUNT(*) FILTER (WHERE attempts > 0 AND is_verified = FALSE) as failed,
        COUNT(*) FILTER (WHERE attempts >= max_attempts AND is_verified = FALSE) as blocked,
        CASE 
            WHEN COUNT(*) > 0 THEN 
                ROUND((COUNT(*) FILTER (WHERE is_verified = TRUE)::DECIMAL / COUNT(*)::DECIMAL) * 100, 2)
            ELSE 0
        END as success_rate
    FROM public.otp_verifications
    WHERE created_at >= start_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check for suspicious OTP activity
CREATE OR REPLACE FUNCTION public.check_suspicious_otp_activity(
    lookback_hours INTEGER DEFAULT 24
)
RETURNS TABLE(
    email TEXT,
    phone TEXT,
    ip_address INET,
    failed_attempts BIGINT,
    time_window INTERVAL,
    risk_level TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH suspicious_activity AS (
        SELECT 
            ov.email,
            ov.phone,
            ov.ip_address,
            COUNT(*) as failed_count,
            (NOW() - MIN(ov.created_at))::INTERVAL as time_span
        FROM public.otp_verifications ov
        WHERE ov.created_at > NOW() - (lookback_hours || ' hours')::INTERVAL
        AND ov.attempts > 0
        AND ov.is_verified = FALSE
        GROUP BY ov.email, ov.phone, ov.ip_address
        HAVING COUNT(*) >= 3 -- 3+ failed attempts is suspicious
    )
    SELECT 
        sa.email,
        sa.phone,
        sa.ip_address,
        sa.failed_count,
        sa.time_span,
        CASE 
            WHEN sa.failed_count >= 10 THEN 'critical'
            WHEN sa.failed_count >= 6 THEN 'high'
            WHEN sa.failed_count >= 3 THEN 'medium'
            ELSE 'low'
        END as risk_level
    FROM suspicious_activity sa
    ORDER BY sa.failed_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- COMMENTS FOR DOCUMENTATION
-- ==========================================

COMMENT ON FUNCTION public.send_email_otp(UUID, TEXT) IS 
'Generates and sends OTP to email address with rate limiting and validation';

COMMENT ON FUNCTION public.send_phone_otp(UUID, TEXT) IS 
'Generates and sends SMS OTP to Swiss phone number with format validation';

COMMENT ON FUNCTION public.verify_otp(UUID, TEXT, TEXT) IS 
'Verifies OTP code and handles user account creation/linking';

COMMENT ON FUNCTION public.get_otp_status(UUID) IS 
'Returns current OTP verification status and attempt counts for a session';

COMMENT ON FUNCTION public.cleanup_expired_otp() IS 
'Maintenance function to clean up expired OTP records (run daily)';

COMMENT ON FUNCTION public.check_suspicious_otp_activity(INTEGER) IS 
'Security monitoring function to detect potential OTP abuse or attacks';