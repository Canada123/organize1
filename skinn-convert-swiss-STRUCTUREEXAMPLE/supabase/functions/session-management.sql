-- ==========================================
-- SESSION MANAGEMENT & RESUME FUNCTIONALITY
-- ==========================================
-- VERSION: 1.0
-- CREATED: 2025-08-19
-- PURPOSE: Secure session management functions for anonymous users
--          and resume functionality across devices
-- ==========================================

-- ==========================================
-- 1. SESSION CREATION & MANAGEMENT
-- ==========================================

-- Create new anonymous session
CREATE OR REPLACE FUNCTION public.create_anonymous_session(
    email_input TEXT DEFAULT NULL,
    phone_input TEXT DEFAULT NULL,
    ip_address_input INET DEFAULT NULL,
    user_agent_input TEXT DEFAULT NULL,
    referrer_input TEXT DEFAULT NULL,
    utm_source_input TEXT DEFAULT NULL,
    utm_medium_input TEXT DEFAULT NULL,
    utm_campaign_input TEXT DEFAULT NULL
)
RETURNS TABLE(
    session_id UUID,
    session_token UUID,
    expires_at TIMESTAMPTZ
) AS $$
DECLARE
    new_session_id UUID;
    new_session_token UUID;
    session_expires TIMESTAMPTZ;
BEGIN
    new_session_id := uuid_generate_v4();
    new_session_token := uuid_generate_v4();
    session_expires := NOW() + INTERVAL '30 days';
    
    INSERT INTO public.questionnaire_sessions (
        id, session_token, email, phone, current_stage,
        ip_address, user_agent, referrer, utm_source, utm_medium, utm_campaign,
        expires_at
    ) VALUES (
        new_session_id, new_session_token, email_input, phone_input, 0,
        ip_address_input, user_agent_input, referrer_input, 
        utm_source_input, utm_medium_input, utm_campaign_input,
        session_expires
    );
    
    -- Log session creation
    PERFORM public.create_audit_log(
        'session_created',
        'questionnaire_sessions',
        new_session_id
    );
    
    RETURN QUERY SELECT new_session_id, new_session_token, session_expires;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Resume session with token and email verification
CREATE OR REPLACE FUNCTION public.resume_session_with_token(
    token_input UUID,
    email_input TEXT
)
RETURNS TABLE(
    session_id UUID,
    current_stage INTEGER,
    stage_completion BOOLEAN[],
    user_id UUID,
    email_verified BOOLEAN,
    phone_verified BOOLEAN,
    last_activity TIMESTAMPTZ
) AS $$
DECLARE
    session_record RECORD;
BEGIN
    -- Find and validate session
    SELECT qs.*, up.id as profile_user_id
    INTO session_record
    FROM public.questionnaire_sessions qs
    LEFT JOIN public.user_profiles up ON up.email = qs.email
    WHERE qs.session_token = token_input
    AND qs.email = email_input
    AND qs.status = 'in_progress'
    AND qs.expires_at > NOW();
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invalid or expired session token';
    END IF;
    
    -- Update last activity
    UPDATE public.questionnaire_sessions 
    SET last_activity = NOW()
    WHERE id = session_record.id;
    
    -- Log session resumption
    PERFORM public.create_audit_log(
        'session_resumed',
        'questionnaire_sessions',
        session_record.id
    );
    
    RETURN QUERY SELECT 
        session_record.id,
        session_record.current_stage,
        session_record.stage_completion_status,
        session_record.profile_user_id,
        session_record.email_verified,
        session_record.phone_verified,
        NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Link authenticated user to existing session
CREATE OR REPLACE FUNCTION public.link_user_to_session(
    session_token_input UUID,
    user_uuid UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN AS $$
DECLARE
    session_record RECORD;
    user_profile RECORD;
BEGIN
    -- Get session details
    SELECT * INTO session_record
    FROM public.questionnaire_sessions
    WHERE session_token = session_token_input
    AND user_id IS NULL
    AND status = 'in_progress';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Session not found or already linked';
    END IF;
    
    -- Get user profile
    SELECT * INTO user_profile
    FROM public.user_profiles
    WHERE id = user_uuid;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User profile not found';
    END IF;
    
    -- Verify email matches (if session has email)
    IF session_record.email IS NOT NULL AND session_record.email != user_profile.email THEN
        RAISE EXCEPTION 'Email mismatch - session email does not match user email';
    END IF;
    
    -- Link user to session
    UPDATE public.questionnaire_sessions
    SET 
        user_id = user_uuid,
        email = user_profile.email,
        phone = user_profile.phone,
        updated_at = NOW()
    WHERE id = session_record.id;
    
    -- Log the linking
    PERFORM public.create_audit_log(
        'session_linked_to_user',
        'questionnaire_sessions',
        session_record.id,
        to_jsonb(session_record),
        jsonb_build_object('user_id', user_uuid)
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 2. STAGE PROGRESSION & VALIDATION
-- ==========================================

-- Update stage completion and progress to next stage
CREATE OR REPLACE FUNCTION public.update_stage_completion(
    session_token_input UUID,
    stage_number_input INTEGER,
    form_data_input JSONB,
    is_complete BOOLEAN DEFAULT TRUE
)
RETURNS TABLE(
    success BOOLEAN,
    next_stage INTEGER,
    contraindications_found BOOLEAN,
    blocking_contraindications TEXT[]
) AS $$
DECLARE
    session_record RECORD;
    new_stage_completion BOOLEAN[];
    next_stage_num INTEGER;
    contraindication_check RECORD;
    blocking_conditions TEXT[] := ARRAY[]::TEXT[];
    has_blocking BOOLEAN := FALSE;
BEGIN
    -- Validate inputs
    IF stage_number_input < 0 OR stage_number_input > 4 THEN
        RAISE EXCEPTION 'Invalid stage number. Must be between 0 and 4.';
    END IF;
    
    -- Get session
    SELECT * INTO session_record
    FROM public.questionnaire_sessions
    WHERE session_token = session_token_input
    AND status = 'in_progress'
    AND expires_at > NOW();
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Session not found or expired';
    END IF;
    
    -- Verify stage progression (can't skip stages)
    IF stage_number_input > session_record.current_stage + 1 THEN
        RAISE EXCEPTION 'Cannot skip stages. Complete stage % first', session_record.current_stage;
    END IF;
    
    -- Save form data
    INSERT INTO public.form_submissions (session_id, stage_number, form_data)
    VALUES (session_record.id, stage_number_input, form_data_input)
    ON CONFLICT (session_id, stage_number) 
    DO UPDATE SET 
        form_data = form_data_input,
        updated_at = NOW();
    
    -- Update stage completion array
    new_stage_completion := session_record.stage_completion_status;
    new_stage_completion[stage_number_input + 1] := is_complete; -- Array is 1-indexed
    
    -- Calculate next stage
    next_stage_num := CASE 
        WHEN is_complete AND stage_number_input < 4 THEN stage_number_input + 1
        ELSE stage_number_input
    END;
    
    -- Check for contraindications if this is medical history stage (stage 2)
    IF stage_number_input = 2 AND is_complete THEN
        -- Check each contraindication against form data
        FOR contraindication_check IN 
            SELECT c.condition_name, c.severity, c.alert_message
            FROM public.contraindications c
            WHERE c.is_active = TRUE
        LOOP
            -- This is a simplified check - in reality, you'd have more sophisticated
            -- logic to check form responses against contraindication criteria
            IF form_data_input ? contraindication_check.condition_name AND
               (form_data_input ->> contraindication_check.condition_name)::boolean = TRUE THEN
                
                -- Log the contraindication
                INSERT INTO public.user_contraindications (
                    session_id, contraindication_id, user_response, risk_level,
                    alert_shown, screening_blocked
                ) 
                SELECT 
                    session_record.id, 
                    c.id, 
                    form_data_input,
                    CASE c.severity 
                        WHEN 'absolute' THEN 'critical'
                        WHEN 'relative' THEN 'high'
                        ELSE 'medium'
                    END,
                    FALSE, -- Will be shown by frontend
                    c.severity = 'absolute' -- Block if absolute contraindication
                FROM public.contraindications c
                WHERE c.condition_name = contraindication_check.condition_name;
                
                -- Add to blocking list if absolute contraindication
                IF contraindication_check.severity = 'absolute' THEN
                    blocking_conditions := array_append(blocking_conditions, contraindication_check.condition_name);
                    has_blocking := TRUE;
                END IF;
            END IF;
        END LOOP;
        
        -- If blocking contraindications found, don't progress
        IF has_blocking THEN
            next_stage_num := stage_number_input;
        END IF;
    END IF;
    
    -- Update session progress
    UPDATE public.questionnaire_sessions
    SET 
        current_stage = next_stage_num,
        stage_completion_status = new_stage_completion,
        last_activity = NOW(),
        completed_at = CASE WHEN next_stage_num = 4 AND new_stage_completion[5] = TRUE THEN NOW() ELSE NULL END,
        status = CASE WHEN next_stage_num = 4 AND new_stage_completion[5] = TRUE THEN 'completed' ELSE 'in_progress' END
    WHERE id = session_record.id;
    
    -- Log stage completion
    PERFORM public.create_audit_log(
        'stage_completed',
        'questionnaire_sessions',
        session_record.id,
        jsonb_build_object('old_stage', session_record.current_stage),
        jsonb_build_object('new_stage', next_stage_num, 'stage_number', stage_number_input)
    );
    
    RETURN QUERY SELECT TRUE, next_stage_num, array_length(blocking_conditions, 1) > 0, blocking_conditions;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get session progress and form data
CREATE OR REPLACE FUNCTION public.get_session_progress(
    session_token_input UUID
)
RETURNS TABLE(
    session_id UUID,
    current_stage INTEGER,
    stage_completion BOOLEAN[],
    form_data JSONB,
    contraindications JSONB,
    payment_required BOOLEAN,
    payment_amount INTEGER,
    expires_at TIMESTAMPTZ
) AS $$
DECLARE
    session_record RECORD;
    combined_form_data JSONB := '{}'::JSONB;
    form_record RECORD;
    contraindication_data JSONB := '[]'::JSONB;
    needs_payment BOOLEAN := FALSE;
    payment_amount_cents INTEGER := 0;
BEGIN
    -- Get session
    SELECT * INTO session_record
    FROM public.questionnaire_sessions
    WHERE session_token = session_token_input
    AND status IN ('in_progress', 'completed')
    AND expires_at > NOW();
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Session not found or expired';
    END IF;
    
    -- Combine all form data from completed stages
    FOR form_record IN 
        SELECT stage_number, form_data 
        FROM public.form_submissions 
        WHERE session_id = session_record.id
        ORDER BY stage_number
    LOOP
        combined_form_data := combined_form_data || 
            jsonb_build_object('stage_' || form_record.stage_number, form_record.form_data);
    END LOOP;
    
    -- Get contraindications
    SELECT jsonb_agg(
        jsonb_build_object(
            'condition', c.condition_name,
            'severity', c.severity,
            'message', c.alert_message,
            'risk_level', uc.risk_level
        )
    ) INTO contraindication_data
    FROM public.user_contraindications uc
    JOIN public.contraindications c ON c.id = uc.contraindication_id
    WHERE uc.session_id = session_record.id;
    
    -- Check if payment is required (stage 3 complete but no insurance coverage)
    IF session_record.stage_completion_status[4] = TRUE THEN -- Stage 3 completed
        SELECT 
            ui.id IS NULL, -- No insurance = payment required
            CASE 
                WHEN combined_form_data->'stage_3'->>'package_type' = '3_day' THEN 12000 -- 120 CHF
                WHEN combined_form_data->'stage_3'->>'package_type' = '5_day' THEN 15000 -- 150 CHF
                WHEN combined_form_data->'stage_3'->>'package_type' = '10_day' THEN 18000 -- 180 CHF
                ELSE 15000 -- Default to 5-day
            END
        INTO needs_payment, payment_amount_cents
        FROM public.questionnaire_sessions qs
        LEFT JOIN public.user_insurance ui ON ui.user_id = qs.user_id
        WHERE qs.id = session_record.id;
    END IF;
    
    RETURN QUERY SELECT 
        session_record.id,
        session_record.current_stage,
        session_record.stage_completion_status,
        combined_form_data,
        COALESCE(contraindication_data, '[]'::JSONB),
        needs_payment,
        payment_amount_cents,
        session_record.expires_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 3. SESSION CLEANUP & MAINTENANCE
-- ==========================================

-- Mark session as abandoned (after inactivity)
CREATE OR REPLACE FUNCTION public.mark_abandoned_sessions()
RETURNS INTEGER AS $$
DECLARE
    abandoned_count INTEGER;
BEGIN
    UPDATE public.questionnaire_sessions
    SET 
        status = 'abandoned',
        updated_at = NOW()
    WHERE status = 'in_progress'
    AND last_activity < NOW() - INTERVAL '7 days'
    AND completed_at IS NULL;
    
    GET DIAGNOSTICS abandoned_count = ROW_COUNT;
    
    -- Log cleanup
    IF abandoned_count > 0 THEN
        PERFORM public.create_audit_log(
            'sessions_marked_abandoned',
            'questionnaire_sessions',
            NULL,
            NULL,
            jsonb_build_object('count', abandoned_count)
        );
    END IF;
    
    RETURN abandoned_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Extend session expiry (for active users)
CREATE OR REPLACE FUNCTION public.extend_session_expiry(
    session_token_input UUID,
    extension_days INTEGER DEFAULT 30
)
RETURNS TIMESTAMPTZ AS $$
DECLARE
    new_expiry TIMESTAMPTZ;
    session_exists BOOLEAN;
BEGIN
    new_expiry := NOW() + (extension_days || ' days')::INTERVAL;
    
    UPDATE public.questionnaire_sessions
    SET 
        expires_at = new_expiry,
        last_activity = NOW()
    WHERE session_token = session_token_input
    AND status = 'in_progress';
    
    GET DIAGNOSTICS session_exists = FOUND;
    
    IF NOT session_exists THEN
        RAISE EXCEPTION 'Session not found or not active';
    END IF;
    
    RETURN new_expiry;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get session statistics (for analytics)
CREATE OR REPLACE FUNCTION public.get_session_statistics(
    start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
    total_sessions BIGINT,
    completed_sessions BIGINT,
    abandoned_sessions BIGINT,
    in_progress_sessions BIGINT,
    completion_rate DECIMAL,
    avg_completion_time INTERVAL,
    stage_drop_off JSONB
) AS $$
DECLARE
    stats_record RECORD;
    stage_stats JSONB;
BEGIN
    -- Calculate basic statistics
    SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'abandoned') as abandoned,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
        CASE 
            WHEN COUNT(*) > 0 THEN 
                ROUND((COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / COUNT(*)::DECIMAL) * 100, 2)
            ELSE 0
        END as comp_rate,
        AVG(completed_at - started_at) FILTER (WHERE status = 'completed') as avg_time
    INTO stats_record
    FROM public.questionnaire_sessions
    WHERE started_at::DATE BETWEEN start_date AND end_date;
    
    -- Calculate stage drop-off rates
    SELECT jsonb_object_agg(
        'stage_' || stage_num,
        completion_count
    ) INTO stage_stats
    FROM (
        SELECT 
            generate_series(0, 4) as stage_num,
            COUNT(*) as completion_count
        FROM public.questionnaire_sessions qs
        WHERE started_at::DATE BETWEEN start_date AND end_date
        AND current_stage >= generate_series(0, 4)
        GROUP BY stage_num
    ) stage_data;
    
    RETURN QUERY SELECT 
        stats_record.total,
        stats_record.completed,
        stats_record.abandoned,
        stats_record.in_progress,
        stats_record.comp_rate,
        stats_record.avg_time,
        COALESCE(stage_stats, '{}'::JSONB);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- COMMENTS FOR DOCUMENTATION
-- ==========================================

COMMENT ON FUNCTION public.create_anonymous_session IS 
'Creates a new anonymous session for users starting the questionnaire';

COMMENT ON FUNCTION public.resume_session_with_token IS 
'Resumes an existing session using session token and email verification';

COMMENT ON FUNCTION public.link_user_to_session IS 
'Links an authenticated user to an existing anonymous session after OTP verification';

COMMENT ON FUNCTION public.update_stage_completion IS 
'Updates stage completion, checks for contraindications, and manages stage progression';

COMMENT ON FUNCTION public.get_session_progress IS 
'Retrieves complete session progress including form data and contraindications';

COMMENT ON FUNCTION public.mark_abandoned_sessions IS 
'Marks inactive sessions as abandoned for cleanup and analytics';

COMMENT ON FUNCTION public.get_session_statistics IS 
'Provides session completion and drop-off statistics for analytics dashboard';