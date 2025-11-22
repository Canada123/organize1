-- ==========================================
-- COMPREHENSIVE AUDIT TRAIL SYSTEM
-- ==========================================
-- VERSION: 1.0
-- CREATED: 2025-08-19
-- PURPOSE: Phase 0.3 - Medical-grade audit trail for Swiss healthcare compliance,
--          GDPR compliance, and security monitoring with immutable logs
-- ==========================================

-- Drop existing audit table if exists
DROP TABLE IF EXISTS public.audit_logs CASCADE;

-- ==========================================
-- 1. IMMUTABLE AUDIT LOG TABLE
-- ==========================================
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Event identification
    event_id UUID DEFAULT uuid_generate_v4(), -- Unique event identifier
    event_type TEXT NOT NULL CHECK (event_type IN (
        -- Authentication events
        'auth_signup', 'auth_login', 'auth_logout', 'auth_failed',
        'auth_password_reset', 'auth_email_verified', 'auth_phone_verified',
        
        -- OTP events
        'otp_generated', 'otp_verified', 'otp_failed', 'otp_expired',
        
        -- Session events
        'session_created', 'session_validated', 'session_refreshed',
        'session_expired', 'session_revoked', 'session_locked',
        
        -- Data access events
        'data_read', 'data_write', 'data_update', 'data_delete',
        'data_export', 'data_import',
        
        -- Medical data events
        'medical_data_accessed', 'medical_data_modified',
        'medical_report_generated', 'medical_report_shared',
        
        -- Form events
        'form_started', 'form_step_completed', 'form_saved',
        'form_submitted', 'form_abandoned',
        
        -- Insurance events
        'insurance_verified', 'insurance_failed', 'insurance_updated',
        
        -- Payment events
        'payment_initiated', 'payment_completed', 'payment_failed',
        'payment_refunded',
        
        -- GP events
        'gp_referral_created', 'gp_referral_sent', 'gp_accessed_data',
        
        -- Consent events
        'consent_given', 'consent_withdrawn', 'consent_updated',
        
        -- Security events
        'security_alert', 'suspicious_activity', 'access_denied',
        'rate_limit_exceeded', 'ip_blocked',
        
        -- Admin events
        'admin_access', 'admin_action', 'config_change',
        
        -- GDPR events
        'gdpr_data_request', 'gdpr_data_export', 'gdpr_data_deletion',
        'gdpr_consent_update'
    )),
    
    -- Actor information
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    acting_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- For admin actions on behalf of users
    service_role BOOLEAN DEFAULT false,
    
    -- Context
    table_name TEXT,
    record_id UUID,
    action TEXT NOT NULL,
    
    -- Data tracking
    old_values JSONB, -- Previous state (for updates)
    new_values JSONB, -- New state
    changes JSONB, -- Computed diff
    sensitive_data_accessed BOOLEAN DEFAULT false,
    
    -- Request context
    ip_address INET,
    user_agent TEXT,
    device_fingerprint TEXT,
    session_id UUID,
    request_id UUID,
    endpoint TEXT,
    http_method TEXT,
    
    -- Response
    success BOOLEAN DEFAULT true,
    error_code TEXT,
    error_message TEXT,
    duration_ms INTEGER,
    
    -- Compliance fields
    data_classification TEXT CHECK (data_classification IN (
        'public', 'internal', 'confidential', 'medical', 'pii'
    )),
    retention_period INTERVAL DEFAULT '7 years', -- Swiss medical records requirement
    legal_basis TEXT CHECK (legal_basis IN (
        'consent', 'contract', 'legal_obligation', 'vital_interests',
        'public_task', 'legitimate_interests'
    )),
    
    -- Timestamp (immutable)
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Integrity
    checksum TEXT, -- SHA-256 hash of the row data
    previous_checksum TEXT, -- Chain integrity
    
    -- Prevent updates
    CONSTRAINT audit_logs_immutable CHECK (false) NO INHERIT
);

-- Create partial indexes for performance
CREATE INDEX idx_audit_user ON public.audit_logs(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_audit_event_type ON public.audit_logs(event_type, created_at DESC);
CREATE INDEX idx_audit_table ON public.audit_logs(table_name, record_id) WHERE table_name IS NOT NULL;
CREATE INDEX idx_audit_medical ON public.audit_logs(created_at DESC) WHERE sensitive_data_accessed = true;
CREATE INDEX idx_audit_security ON public.audit_logs(event_type, created_at DESC) 
    WHERE event_type IN ('security_alert', 'suspicious_activity', 'access_denied');
CREATE INDEX idx_audit_gdpr ON public.audit_logs(event_type, user_id) 
    WHERE event_type LIKE 'gdpr_%';

-- ==========================================
-- 2. AUDIT LOG INTEGRITY TABLE
-- ==========================================
CREATE TABLE public.audit_integrity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Checkpoint information
    checkpoint_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    from_timestamp TIMESTAMPTZ NOT NULL,
    to_timestamp TIMESTAMPTZ NOT NULL,
    
    -- Statistics
    total_events INTEGER NOT NULL,
    events_by_type JSONB NOT NULL,
    
    -- Integrity
    merkle_root TEXT NOT NULL, -- Merkle tree root hash
    previous_merkle_root TEXT,
    signature TEXT, -- Digital signature for non-repudiation
    
    -- Verification
    verified_at TIMESTAMPTZ,
    verified_by TEXT,
    verification_result BOOLEAN,
    
    CONSTRAINT integrity_immutable CHECK (false) NO INHERIT
);

-- ==========================================
-- 3. DATA ACCESS LOG (Medical Specific)
-- ==========================================
CREATE TABLE public.medical_data_access_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Patient and accessor
    patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    accessed_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    accessor_role TEXT NOT NULL,
    
    -- What was accessed
    data_type TEXT NOT NULL CHECK (data_type IN (
        'personal_info', 'medical_history', 'questionnaire_responses',
        'ecg_data', 'report', 'insurance_info', 'payment_info'
    )),
    specific_fields TEXT[],
    
    -- Purpose and justification
    access_purpose TEXT NOT NULL CHECK (access_purpose IN (
        'treatment', 'billing', 'quality_improvement', 'legal_requirement',
        'patient_request', 'emergency', 'research'
    )),
    justification TEXT,
    
    -- Context
    access_timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    session_id UUID,
    
    -- Consent tracking
    consent_id UUID,
    consent_valid BOOLEAN DEFAULT true,
    
    -- Swiss medical compliance
    emergency_override BOOLEAN DEFAULT false,
    emergency_justification TEXT,
    
    CONSTRAINT medical_access_immutable CHECK (false) NO INHERIT
);

CREATE INDEX idx_medical_patient ON public.medical_data_access_log(patient_id);
CREATE INDEX idx_medical_accessor ON public.medical_data_access_log(accessed_by);
CREATE INDEX idx_medical_timestamp ON public.medical_data_access_log(access_timestamp DESC);

-- ==========================================
-- 4. CONSENT AUDIT TABLE
-- ==========================================
CREATE TABLE public.consent_audit (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- User and consent
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    consent_type TEXT NOT NULL CHECK (consent_type IN (
        'data_processing', 'marketing', 'research', 'third_party_sharing',
        'medical_records', 'insurance_sharing', 'gp_sharing'
    )),
    
    -- Consent details
    action TEXT NOT NULL CHECK (action IN ('granted', 'withdrawn', 'updated')),
    consent_version TEXT NOT NULL,
    consent_text TEXT NOT NULL,
    
    -- Legal basis
    legal_basis TEXT NOT NULL,
    purpose TEXT NOT NULL,
    data_categories TEXT[],
    recipients TEXT[],
    retention_period INTERVAL,
    
    -- Context
    given_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    withdrawn_at TIMESTAMPTZ,
    ip_address INET,
    user_agent TEXT,
    
    -- Verification
    verification_method TEXT CHECK (verification_method IN (
        'checkbox', 'signature', 'email', 'sms', 'double_opt_in'
    )),
    verified BOOLEAN DEFAULT false,
    
    CONSTRAINT consent_audit_immutable CHECK (false) NO INHERIT
);

CREATE INDEX idx_consent_user ON public.consent_audit(user_id);
CREATE INDEX idx_consent_type ON public.consent_audit(consent_type, given_at DESC);

-- ==========================================
-- 5. AUDIT LOGGING FUNCTIONS
-- ==========================================

-- Function to create audit log with automatic checksum
CREATE OR REPLACE FUNCTION public.create_audit_log(
    p_event_type TEXT,
    p_action TEXT,
    p_user_id UUID DEFAULT NULL,
    p_table_name TEXT DEFAULT NULL,
    p_record_id UUID DEFAULT NULL,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_session_id UUID DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    v_audit_id UUID;
    v_changes JSONB;
    v_previous_checksum TEXT;
    v_row_data TEXT;
    v_checksum TEXT;
    v_sensitive BOOLEAN DEFAULT false;
BEGIN
    -- Calculate changes if both old and new values provided
    IF p_old_values IS NOT NULL AND p_new_values IS NOT NULL THEN
        v_changes := jsonb_build_object(
            'modified_fields', (
                SELECT jsonb_object_agg(key, jsonb_build_object(
                    'old', p_old_values->key,
                    'new', p_new_values->key
                ))
                FROM jsonb_object_keys(p_new_values) AS key
                WHERE p_old_values->key IS DISTINCT FROM p_new_values->key
            )
        );
    END IF;
    
    -- Check if sensitive data
    IF p_table_name IN ('medical_questionnaires', 'questionnaire_responses', 
                        'medical_conditions', 'gp_referrals') THEN
        v_sensitive := true;
    END IF;
    
    -- Get previous checksum for chain integrity
    SELECT checksum INTO v_previous_checksum
    FROM public.audit_logs
    ORDER BY created_at DESC
    LIMIT 1;
    
    -- Generate audit ID
    v_audit_id := uuid_generate_v4();
    
    -- Create row data for checksum
    v_row_data := concat(
        v_audit_id::text, '|',
        p_event_type, '|',
        p_action, '|',
        COALESCE(p_user_id::text, ''), '|',
        COALESCE(p_table_name, ''), '|',
        COALESCE(p_record_id::text, ''), '|',
        CURRENT_TIMESTAMP::text
    );
    
    -- Generate checksum
    v_checksum := encode(
        digest(concat(v_row_data, '|', COALESCE(v_previous_checksum, '')), 'sha256'),
        'hex'
    );
    
    -- Insert audit log
    INSERT INTO public.audit_logs (
        id, event_type, action, user_id, table_name, record_id,
        old_values, new_values, changes, sensitive_data_accessed,
        ip_address, session_id, checksum, previous_checksum,
        data_classification
    ) VALUES (
        v_audit_id, p_event_type, p_action, p_user_id, p_table_name, p_record_id,
        p_old_values, p_new_values, v_changes, v_sensitive,
        p_ip_address, p_session_id, v_checksum, v_previous_checksum,
        CASE WHEN v_sensitive THEN 'medical' ELSE 'internal' END
    );
    
    RETURN v_audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log medical data access
CREATE OR REPLACE FUNCTION public.log_medical_data_access(
    p_patient_id UUID,
    p_data_type TEXT,
    p_access_purpose TEXT,
    p_specific_fields TEXT[] DEFAULT NULL,
    p_justification TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    v_accessor_id UUID;
    v_accessor_role TEXT;
BEGIN
    v_accessor_id := auth.uid();
    v_accessor_role := COALESCE(
        auth.jwt() -> 'user_metadata' ->> 'role',
        'patient'
    );
    
    -- Log medical data access
    INSERT INTO public.medical_data_access_log (
        patient_id, accessed_by, accessor_role, data_type,
        specific_fields, access_purpose, justification,
        ip_address, session_id
    ) VALUES (
        p_patient_id, v_accessor_id, v_accessor_role, p_data_type,
        p_specific_fields, p_access_purpose, p_justification,
        inet_client_addr(),
        auth.jwt() ->> 'session_id'
    );
    
    -- Also create main audit log
    PERFORM public.create_audit_log(
        'medical_data_accessed',
        format('Accessed %s data', p_data_type),
        p_patient_id,
        'medical_data',
        p_patient_id,
        NULL,
        jsonb_build_object(
            'data_type', p_data_type,
            'purpose', p_access_purpose
        ),
        inet_client_addr()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 6. TRIGGER FUNCTIONS FOR AUTOMATIC AUDIT
-- ==========================================

-- Generic audit trigger function
CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    v_event_type TEXT;
    v_old_values JSONB;
    v_new_values JSONB;
BEGIN
    -- Determine event type
    v_event_type := CASE TG_OP
        WHEN 'INSERT' THEN 'data_write'
        WHEN 'UPDATE' THEN 'data_update'
        WHEN 'DELETE' THEN 'data_delete'
    END;
    
    -- Get old and new values
    IF TG_OP = 'DELETE' THEN
        v_old_values := to_jsonb(OLD);
        v_new_values := NULL;
    ELSIF TG_OP = 'INSERT' THEN
        v_old_values := NULL;
        v_new_values := to_jsonb(NEW);
    ELSE -- UPDATE
        v_old_values := to_jsonb(OLD);
        v_new_values := to_jsonb(NEW);
    END IF;
    
    -- Create audit log
    PERFORM public.create_audit_log(
        v_event_type,
        TG_OP,
        COALESCE(NEW.user_id, OLD.user_id, auth.uid()),
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        v_old_values,
        v_new_values,
        inet_client_addr()
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 7. APPLY AUDIT TRIGGERS TO SENSITIVE TABLES
-- ==========================================

-- Apply to questionnaire tables
CREATE TRIGGER audit_questionnaire_sessions
AFTER INSERT OR UPDATE OR DELETE ON public.questionnaire_sessions
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

CREATE TRIGGER audit_questionnaire_responses
AFTER INSERT OR UPDATE OR DELETE ON public.questionnaire_responses
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

-- Apply to medical tables
CREATE TRIGGER audit_medical_conditions
AFTER INSERT OR UPDATE OR DELETE ON public.medical_conditions
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

CREATE TRIGGER audit_gp_referrals
AFTER INSERT OR UPDATE OR DELETE ON public.gp_referrals
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

-- Apply to payment tables
CREATE TRIGGER audit_payments
AFTER INSERT OR UPDATE OR DELETE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

-- ==========================================
-- 8. COMPLIANCE REPORTING FUNCTIONS
-- ==========================================

-- GDPR data export function
CREATE OR REPLACE FUNCTION public.export_user_audit_data(
    p_user_id UUID
)
RETURNS TABLE(
    event_type TEXT,
    action TEXT,
    table_name TEXT,
    timestamp TIMESTAMPTZ,
    ip_address INET,
    changes JSONB
) AS $$
BEGIN
    -- Log GDPR request
    PERFORM public.create_audit_log(
        'gdpr_data_export',
        'User data export requested',
        p_user_id
    );
    
    -- Return user's audit data
    RETURN QUERY
    SELECT 
        al.event_type,
        al.action,
        al.table_name,
        al.created_at as timestamp,
        al.ip_address,
        al.changes
    FROM public.audit_logs al
    WHERE al.user_id = p_user_id
    ORDER BY al.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Compliance report function
CREATE OR REPLACE FUNCTION public.generate_compliance_report(
    p_start_date TIMESTAMPTZ,
    p_end_date TIMESTAMPTZ
)
RETURNS TABLE(
    report_type TEXT,
    metric TEXT,
    value BIGINT
) AS $$
BEGIN
    RETURN QUERY
    -- Medical data access statistics
    SELECT 
        'Medical Data Access'::TEXT,
        data_type::TEXT,
        COUNT(*)::BIGINT
    FROM public.medical_data_access_log
    WHERE access_timestamp BETWEEN p_start_date AND p_end_date
    GROUP BY data_type
    
    UNION ALL
    
    -- Consent statistics
    SELECT 
        'Consent Management'::TEXT,
        consent_type || ' - ' || action::TEXT,
        COUNT(*)::BIGINT
    FROM public.consent_audit
    WHERE given_at BETWEEN p_start_date AND p_end_date
    GROUP BY consent_type, action
    
    UNION ALL
    
    -- Security events
    SELECT 
        'Security Events'::TEXT,
        event_type::TEXT,
        COUNT(*)::BIGINT
    FROM public.audit_logs
    WHERE created_at BETWEEN p_start_date AND p_end_date
    AND event_type IN ('security_alert', 'suspicious_activity', 'access_denied')
    GROUP BY event_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 9. AUDIT INTEGRITY VERIFICATION
-- ==========================================

CREATE OR REPLACE FUNCTION public.verify_audit_integrity(
    p_from_timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP - INTERVAL '24 hours',
    p_to_timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
)
RETURNS TABLE(
    is_valid BOOLEAN,
    total_records INTEGER,
    invalid_records INTEGER[],
    merkle_root TEXT
) AS $$
DECLARE
    v_record RECORD;
    v_expected_checksum TEXT;
    v_previous_checksum TEXT := NULL;
    v_invalid_ids INTEGER[] := ARRAY[]::INTEGER[];
    v_total INTEGER := 0;
    v_merkle_data TEXT := '';
BEGIN
    -- Verify chain integrity
    FOR v_record IN 
        SELECT id, checksum, previous_checksum, 
               event_type, action, user_id, table_name, 
               record_id, created_at
        FROM public.audit_logs
        WHERE created_at BETWEEN p_from_timestamp AND p_to_timestamp
        ORDER BY created_at ASC
    LOOP
        v_total := v_total + 1;
        
        -- Verify previous checksum matches
        IF v_previous_checksum IS NOT NULL AND 
           v_record.previous_checksum != v_previous_checksum THEN
            v_invalid_ids := array_append(v_invalid_ids, v_record.id);
        END IF;
        
        v_previous_checksum := v_record.checksum;
        v_merkle_data := v_merkle_data || v_record.checksum;
    END LOOP;
    
    -- Calculate merkle root
    merkle_root := encode(digest(v_merkle_data, 'sha256'), 'hex');
    
    -- Store integrity checkpoint
    IF array_length(v_invalid_ids, 1) IS NULL THEN
        INSERT INTO public.audit_integrity (
            from_timestamp, to_timestamp, total_events,
            merkle_root, previous_merkle_root
        ) VALUES (
            p_from_timestamp, p_to_timestamp, v_total,
            merkle_root,
            (SELECT merkle_root FROM public.audit_integrity 
             ORDER BY checkpoint_at DESC LIMIT 1)
        );
    END IF;
    
    RETURN QUERY SELECT 
        array_length(v_invalid_ids, 1) IS NULL,
        v_total,
        v_invalid_ids,
        merkle_root;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 10. PREVENT AUDIT LOG MODIFICATIONS
-- ==========================================

-- Function to prevent updates/deletes on audit tables
CREATE OR REPLACE FUNCTION public.prevent_audit_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Audit logs are immutable and cannot be modified';
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply to all audit tables
CREATE TRIGGER prevent_audit_logs_modification
BEFORE UPDATE OR DELETE ON public.audit_logs
FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_modification();

CREATE TRIGGER prevent_medical_log_modification
BEFORE UPDATE OR DELETE ON public.medical_data_access_log
FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_modification();

CREATE TRIGGER prevent_consent_audit_modification
BEFORE UPDATE OR DELETE ON public.consent_audit
FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_modification();

CREATE TRIGGER prevent_integrity_modification
BEFORE UPDATE OR DELETE ON public.audit_integrity
FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_modification();

-- ==========================================
-- 11. RLS POLICIES
-- ==========================================

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_data_access_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_audit ENABLE ROW LEVEL SECURITY;

-- Service role can read all, but not modify
CREATE POLICY "Service role read audit" ON public.audit_logs
FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role');

-- Users can read their own audit logs
CREATE POLICY "Users read own audit" ON public.audit_logs
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users read own medical access" ON public.medical_data_access_log
FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Users read own consent" ON public.consent_audit
FOR SELECT USING (auth.uid() = user_id);

-- ==========================================
-- COMMENTS FOR DOCUMENTATION
-- ==========================================

COMMENT ON TABLE public.audit_logs IS 
'Immutable audit trail for all system events with blockchain-style integrity';

COMMENT ON TABLE public.medical_data_access_log IS 
'Swiss medical compliance audit log for tracking all medical data access';

COMMENT ON TABLE public.consent_audit IS 
'GDPR-compliant consent tracking with full audit trail';

COMMENT ON FUNCTION public.create_audit_log IS 
'Creates an immutable audit log entry with automatic checksum generation';

COMMENT ON FUNCTION public.verify_audit_integrity IS 
'Verifies the integrity of audit logs using checksum chain validation';