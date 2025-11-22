-- ==========================================
-- MIGRATION 002: ROW LEVEL SECURITY POLICIES
-- ==========================================
-- VERSION: 1.0
-- CREATED: 2025-08-19
-- PURPOSE: Enable RLS and create comprehensive security policies
-- DESCRIPTION: Applies row-level security policies to all tables
--              ensuring proper data isolation and access control
-- 
-- AFFECTED OBJECTS:
-- - All public tables (RLS enabled)
-- - Security policies for user data isolation
-- - Admin and service role access policies
-- - Performance indexes for policy queries
-- ==========================================

-- Check if this migration has already been applied
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM public.migration_history 
        WHERE migration_number = '002'
    ) THEN
        RAISE NOTICE 'Migration 002 has already been applied. Skipping...';
        RETURN;
    END IF;
END $$;

-- Begin transaction
BEGIN;

-- ==========================================
-- STEP 1: ENABLE RLS ON ALL TABLES
-- ==========================================
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
-- STEP 2: USER PROFILE POLICIES
-- ==========================================
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can access all profiles" ON public.user_profiles
    FOR ALL USING (
        (auth.jwt() ->> 'role')::text = 'admin' OR
        (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
    );

-- ==========================================
-- STEP 3: INSURANCE SYSTEM POLICIES
-- ==========================================
CREATE POLICY "Insurance providers are publicly readable" ON public.insurance_providers
    FOR SELECT USING (is_active = true);

CREATE POLICY "Insurance models are publicly readable" ON public.insurance_models
    FOR SELECT USING (is_active = true);

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
-- STEP 4: SESSION MANAGEMENT POLICIES
-- ==========================================
CREATE POLICY "Users can view own sessions" ON public.questionnaire_sessions
    FOR SELECT USING (
        auth.uid() = user_id OR 
        (user_id IS NULL AND auth.jwt() ->> 'email' = email)
    );

CREATE POLICY "Anonymous can create sessions" ON public.questionnaire_sessions
    FOR INSERT WITH CHECK (
        user_id IS NULL OR auth.uid() = user_id
    );

CREATE POLICY "Users can update own sessions" ON public.questionnaire_sessions
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        (user_id IS NULL AND auth.jwt() ->> 'email' = email)
    );

-- ==========================================
-- STEP 5: FORM SUBMISSION POLICIES
-- ==========================================
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
-- STEP 6: OTP VERIFICATION POLICIES
-- ==========================================
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

CREATE POLICY "System can create OTP verifications" ON public.otp_verifications
    FOR INSERT WITH CHECK (true);

-- ==========================================
-- STEP 7: DOCUMENT POLICIES
-- ==========================================
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

CREATE POLICY "Healthcare providers can view shared documents" ON public.user_documents
    FOR SELECT USING (
        access_level IN ('shared_with_gp', 'shared_with_provider') AND
        (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'healthcare_provider'
    );

-- ==========================================
-- STEP 8: PAYMENT POLICIES
-- ==========================================
CREATE POLICY "Users can view own payments" ON public.payment_transactions
    FOR SELECT USING (
        auth.uid() = user_id OR
        session_id IN (
            SELECT id FROM public.questionnaire_sessions 
            WHERE auth.uid() = user_id
        )
    );

CREATE POLICY "System can manage payments" ON public.payment_transactions
    FOR ALL USING (
        (auth.jwt() ->> 'role')::text = 'service_role' OR
        auth.uid() = user_id
    );

-- ==========================================
-- STEP 9: GP REFERRAL POLICIES
-- ==========================================
CREATE POLICY "Users can view own referrals" ON public.gp_referrals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "GPs can view directed referrals" ON public.gp_referrals
    FOR SELECT USING (
        (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'healthcare_provider' AND
        gp_email = auth.jwt() ->> 'email'
    );

CREATE POLICY "System can create referrals" ON public.gp_referrals
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR
        (auth.jwt() ->> 'role')::text = 'service_role'
    );

-- ==========================================
-- STEP 10: AUDIT LOG POLICIES
-- ==========================================
CREATE POLICY "Users can view own audit logs" ON public.audit_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
    FOR SELECT USING (
        (auth.jwt() ->> 'role')::text = 'admin' OR
        (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
    );

CREATE POLICY "System can insert audit logs" ON public.audit_logs
    FOR INSERT WITH CHECK (
        (auth.jwt() ->> 'role')::text = 'service_role' OR
        auth.uid()::text = user_id::text
    );

-- ==========================================
-- STEP 11: CONTRAINDICATION POLICIES
-- ==========================================
CREATE POLICY "Contraindications are publicly readable" ON public.contraindications
    FOR SELECT USING (is_active = true);

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
-- STEP 12: GDPR REQUEST POLICIES
-- ==========================================
CREATE POLICY "Users can manage own GDPR requests" ON public.gdpr_requests
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all GDPR requests" ON public.gdpr_requests
    FOR SELECT USING (
        (auth.jwt() ->> 'role')::text = 'admin' OR
        (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
    );

-- ==========================================
-- STEP 13: SECURITY HELPER FUNCTIONS
-- ==========================================
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
        inet_client_addr(), 
        current_setting('request.headers.user-agent', true)
    ) RETURNING id INTO audit_id;
    
    RETURN audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- STEP 14: PERFORMANCE INDEXES FOR RLS
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_user_profiles_id ON public.user_profiles(id);
CREATE INDEX IF NOT EXISTS idx_questionnaire_sessions_user_id_email ON public.questionnaire_sessions(user_id, email);
CREATE INDEX IF NOT EXISTS idx_form_submissions_session_id ON public.form_submissions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_documents_user_id_session_id ON public.user_documents(user_id, session_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id_session_id ON public.payment_transactions(user_id, session_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id_timestamp ON public.audit_logs(user_id, timestamp);

-- ==========================================
-- STEP 15: AUDIT TRIGGERS
-- ==========================================
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

-- Record migration as applied
INSERT INTO public.migration_history (migration_number, migration_name)
VALUES ('002', 'Row Level Security Policies and Audit System');

-- Commit transaction
COMMIT;

RAISE NOTICE 'Migration 002 completed successfully. Applied RLS policies to % tables with audit triggers.',
    (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public');