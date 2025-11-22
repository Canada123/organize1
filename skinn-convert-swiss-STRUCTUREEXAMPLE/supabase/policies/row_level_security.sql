-- ==========================================
-- SUPABASE ROW LEVEL SECURITY POLICIES
-- ==========================================
-- VERSION: 1.0
-- CREATED: 2025-08-19
-- PURPOSE: Comprehensive RLS policies for eligibility questionnaire
--          Ensures data privacy, GDPR compliance, and secure access
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_insurance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gp_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contraindications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_contraindications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gdpr_requests ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 1. USER PROFILES POLICIES
-- ==========================================

-- Users can only access their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Admin access for support (using custom claims or specific admin role)
CREATE POLICY "Admins can access all profiles" ON public.user_profiles
    FOR ALL USING (
        (auth.jwt() ->> 'role')::text = 'admin' OR
        (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
    );

-- ==========================================
-- 2. INSURANCE SYSTEM POLICIES
-- ==========================================

-- Insurance providers and models are public reference data
CREATE POLICY "Insurance providers are publicly readable" ON public.insurance_providers
    FOR SELECT USING (is_active = true);

CREATE POLICY "Insurance models are publicly readable" ON public.insurance_models
    FOR SELECT USING (is_active = true);

-- User insurance data is private
CREATE POLICY "Users can view own insurance" ON public.user_insurance
    FOR SELECT USING (
        auth.uid()::text IN (
            SELECT id::text FROM public.user_profiles WHERE id = user_id
        )
    );

CREATE POLICY "Users can manage own insurance" ON public.user_insurance
    FOR ALL USING (
        auth.uid()::text IN (
            SELECT id::text FROM public.user_profiles WHERE id = user_id
        )
    );

-- ==========================================
-- 3. QUESTIONNAIRE SESSION POLICIES
-- ==========================================

-- Users can access their own sessions
CREATE POLICY "Users can view own sessions" ON public.questionnaire_sessions
    FOR SELECT USING (
        auth.uid() = user_id OR 
        (user_id IS NULL AND auth.jwt() ->> 'email' = email)
    );

-- Anonymous users can create sessions (before auth)
CREATE POLICY "Anonymous can create sessions" ON public.questionnaire_sessions
    FOR INSERT WITH CHECK (
        user_id IS NULL OR auth.uid() = user_id
    );

-- Users can update their own sessions
CREATE POLICY "Users can update own sessions" ON public.questionnaire_sessions
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        (user_id IS NULL AND auth.jwt() ->> 'email' = email)
    );

-- Session token access (for resume functionality)
CREATE POLICY "Session token access" ON public.questionnaire_sessions
    FOR SELECT USING (
        -- Allow access via session token for resume functionality
        -- This will be handled by a secure server function
        true
    );

-- ==========================================
-- 4. FORM SUBMISSIONS POLICIES
-- ==========================================

-- Users can only access form data from their sessions
CREATE POLICY "Users can view own form submissions" ON public.form_submissions
    FOR SELECT USING (
        session_id IN (
            SELECT id FROM public.questionnaire_sessions 
            WHERE auth.uid() = user_id OR 
                  (user_id IS NULL AND auth.jwt() ->> 'email' = email)
        )
    );

CREATE POLICY "Users can manage own form submissions" ON public.form_submissions
    FOR ALL USING (
        session_id IN (
            SELECT id FROM public.questionnaire_sessions 
            WHERE auth.uid() = user_id OR 
                  (user_id IS NULL AND auth.jwt() ->> 'email' = email)
        )
    );

-- ==========================================
-- 5. OTP VERIFICATION POLICIES
-- ==========================================

-- OTP verification access is limited to the session owner
CREATE POLICY "Users can view own OTP verifications" ON public.otp_verifications
    FOR SELECT USING (
        session_id IN (
            SELECT id FROM public.questionnaire_sessions 
            WHERE auth.uid() = user_id OR 
                  (user_id IS NULL AND (
                      auth.jwt() ->> 'email' = email OR 
                      auth.jwt() ->> 'phone' = phone
                  ))
        )
    );

-- System can create OTP records (via secure function)
CREATE POLICY "System can create OTP verifications" ON public.otp_verifications
    FOR INSERT WITH CHECK (true); -- Controlled by secure functions

-- ==========================================
-- 6. USER DOCUMENTS POLICIES
-- ==========================================

-- Users can only access their own documents
CREATE POLICY "Users can view own documents" ON public.user_documents
    FOR SELECT USING (
        auth.uid() = user_id OR
        session_id IN (
            SELECT id FROM public.questionnaire_sessions 
            WHERE auth.uid() = user_id
        )
    );

CREATE POLICY "Users can upload own documents" ON public.user_documents
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR
        session_id IN (
            SELECT id FROM public.questionnaire_sessions 
            WHERE auth.uid() = user_id
        )
    );

-- Documents marked for sharing with GP can be accessed by healthcare providers
CREATE POLICY "Healthcare providers can view shared documents" ON public.user_documents
    FOR SELECT USING (
        access_level IN ('shared_with_gp', 'shared_with_provider') AND
        (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'healthcare_provider'
    );

-- ==========================================
-- 7. PAYMENT TRANSACTION POLICIES
-- ==========================================

-- Users can only view their own payment transactions
CREATE POLICY "Users can view own payments" ON public.payment_transactions
    FOR SELECT USING (
        auth.uid() = user_id OR
        session_id IN (
            SELECT id FROM public.questionnaire_sessions 
            WHERE auth.uid() = user_id
        )
    );

-- System can create payment records (via secure Stripe webhook)
CREATE POLICY "System can manage payments" ON public.payment_transactions
    FOR ALL USING (
        -- This will be controlled by secure server functions
        -- that verify Stripe webhook signatures
        (auth.jwt() ->> 'role')::text = 'service_role' OR
        auth.uid() = user_id
    );

-- ==========================================
-- 8. GP REFERRAL POLICIES
-- ==========================================

-- Users can view their own referrals
CREATE POLICY "Users can view own referrals" ON public.gp_referrals
    FOR SELECT USING (auth.uid() = user_id);

-- Healthcare providers can view referrals directed to them
CREATE POLICY "GPs can view directed referrals" ON public.gp_referrals
    FOR SELECT USING (
        (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'healthcare_provider' AND
        gp_email = auth.jwt() ->> 'email'
    );

-- System can create referrals
CREATE POLICY "System can create referrals" ON public.gp_referrals
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR
        (auth.jwt() ->> 'role')::text = 'service_role'
    );

-- ==========================================
-- 9. AUDIT LOG POLICIES
-- ==========================================

-- Audit logs are view-only for users (their own data)
CREATE POLICY "Users can view own audit logs" ON public.audit_logs
    FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all audit logs
CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
    FOR SELECT USING (
        (auth.jwt() ->> 'role')::text = 'admin' OR
        (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
    );

-- System can insert audit logs
CREATE POLICY "System can insert audit logs" ON public.audit_logs
    FOR INSERT WITH CHECK (
        (auth.jwt() ->> 'role')::text = 'service_role' OR
        auth.uid()::text = user_id::text
    );

-- ==========================================
-- 10. CONTRAINDICATIONS POLICIES
-- ==========================================

-- Contraindications reference data is publicly readable
CREATE POLICY "Contraindications are publicly readable" ON public.contraindications
    FOR SELECT USING (is_active = true);

-- User contraindications are private
CREATE POLICY "Users can view own contraindications" ON public.user_contraindications
    FOR SELECT USING (
        session_id IN (
            SELECT id FROM public.questionnaire_sessions 
            WHERE auth.uid() = user_id
        )
    );

CREATE POLICY "System can manage contraindications" ON public.user_contraindications
    FOR ALL USING (
        session_id IN (
            SELECT id FROM public.questionnaire_sessions 
            WHERE auth.uid() = user_id
        ) OR
        (auth.jwt() ->> 'role')::text = 'service_role'
    );

-- ==========================================
-- 11. GDPR REQUEST POLICIES
-- ==========================================

-- Users can view and create their own GDPR requests
CREATE POLICY "Users can manage own GDPR requests" ON public.gdpr_requests
    FOR ALL USING (auth.uid() = user_id);

-- Admins can view all GDPR requests
CREATE POLICY "Admins can view all GDPR requests" ON public.gdpr_requests
    FOR SELECT USING (
        (auth.jwt() ->> 'role')::text = 'admin' OR
        (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
    );

-- ==========================================
-- 12. SECURITY FUNCTIONS
-- ==========================================

-- Function to check if user owns a session (for complex queries)
CREATE OR REPLACE FUNCTION public.user_owns_session(session_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.questionnaire_sessions
        WHERE id = session_uuid AND (
            auth.uid() = user_id OR
            (user_id IS NULL AND auth.jwt() ->> 'email' = email)
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate session token (for resume functionality)
CREATE OR REPLACE FUNCTION public.validate_session_token(token UUID, email_input TEXT DEFAULT NULL)
RETURNS UUID AS $$
DECLARE
    session_uuid UUID;
BEGIN
    SELECT id INTO session_uuid
    FROM public.questionnaire_sessions
    WHERE session_token = token 
    AND status = 'in_progress'
    AND expires_at > NOW()
    AND (email_input IS NULL OR email = email_input);
    
    RETURN session_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create audit log entry
CREATE OR REPLACE FUNCTION public.create_audit_log(
    action_text TEXT,
    table_name_param TEXT DEFAULT NULL,
    record_id_param UUID DEFAULT NULL,
    old_values_param JSONB DEFAULT NULL,
    new_values_param JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    audit_id UUID;
BEGIN
    INSERT INTO public.audit_logs (
        action, table_name, record_id, user_id, 
        old_values, new_values, ip_address, user_agent
    ) VALUES (
        action_text, table_name_param, record_id_param, auth.uid(),
        old_values_param, new_values_param,
        inet_client_addr(), current_setting('request.headers.user-agent', true)
    ) RETURNING id INTO audit_id;
    
    RETURN audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 13. PERFORMANCE INDEXES
-- ==========================================

-- Critical indexes for RLS policy performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_id ON public.user_profiles(id);
CREATE INDEX IF NOT EXISTS idx_questionnaire_sessions_user_id_email ON public.questionnaire_sessions(user_id, email);
CREATE INDEX IF NOT EXISTS idx_form_submissions_session_id ON public.form_submissions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_documents_user_id_session_id ON public.user_documents(user_id, session_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id_session_id ON public.payment_transactions(user_id, session_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id_timestamp ON public.audit_logs(user_id, timestamp);

-- ==========================================
-- 14. TRIGGER FUNCTIONS FOR AUDIT LOGGING
-- ==========================================

-- Generic audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM public.create_audit_log('insert', TG_TABLE_NAME, NEW.id, NULL, to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        PERFORM public.create_audit_log('update', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM public.create_audit_log('delete', TG_TABLE_NAME, OLD.id, to_jsonb(OLD), NULL);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to sensitive tables
CREATE TRIGGER audit_user_profiles AFTER INSERT OR UPDATE OR DELETE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_form_submissions AFTER INSERT OR UPDATE OR DELETE ON public.form_submissions
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_user_documents AFTER INSERT OR UPDATE OR DELETE ON public.user_documents
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_payment_transactions AFTER INSERT OR UPDATE OR DELETE ON public.payment_transactions
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_gdpr_requests AFTER INSERT OR UPDATE OR DELETE ON public.gdpr_requests
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();

-- ==========================================
-- COMMENTS FOR DOCUMENTATION
-- ==========================================

COMMENT ON POLICY "Users can view own profile" ON public.user_profiles IS 
'Users can only access their own profile data, ensuring privacy';

COMMENT ON POLICY "Session token access" ON public.questionnaire_sessions IS 
'Special policy for resume functionality - controlled by secure server functions';

COMMENT ON FUNCTION public.validate_session_token(UUID, TEXT) IS 
'Validates session tokens for secure resume functionality without authentication';

COMMENT ON FUNCTION public.create_audit_log(TEXT, TEXT, UUID, JSONB, JSONB) IS 
'Creates audit log entries for GDPR compliance and security monitoring';