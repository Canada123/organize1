-- ==========================================
-- MIGRATION 001: INITIAL SCHEMA SETUP
-- ==========================================
-- VERSION: 1.0
-- CREATED: 2025-08-19
-- PURPOSE: Initial database setup for eligibility questionnaire
-- DESCRIPTION: Creates all tables, functions, policies, and reference data
-- 
-- AFFECTED OBJECTS:
-- - All base tables for questionnaire system
-- - RLS policies for data protection
-- - Core functions for session and OTP management
-- - Storage bucket configuration
-- - Reference data population
-- ==========================================

-- Check if this migration has already been applied
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'migration_history' 
        AND table_schema = 'public'
    ) THEN
        IF EXISTS (
            SELECT 1 FROM public.migration_history 
            WHERE migration_number = '001'
        ) THEN
            RAISE NOTICE 'Migration 001 has already been applied. Skipping...';
            RETURN;
        END IF;
    END IF;
END $$;

-- Create migration history table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.migration_history (
    id SERIAL PRIMARY KEY,
    migration_number TEXT UNIQUE NOT NULL,
    migration_name TEXT NOT NULL,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    applied_by TEXT DEFAULT current_user
);

-- Begin transaction
BEGIN;

-- ==========================================
-- STEP 1: CREATE EXTENSIONS
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_crypto";

-- ==========================================
-- STEP 2: CREATE HELPER FUNCTIONS
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- STEP 3: CREATE CORE TABLES
-- ==========================================

-- User profiles (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    phone TEXT,
    first_name TEXT,
    last_name TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    
    -- Swiss address fields
    street_address TEXT,
    city TEXT,
    postal_code TEXT,
    canton TEXT CHECK (canton IN ('AG', 'AI', 'AR', 'BE', 'BL', 'BS', 'FR', 'GE', 'GL', 'GR', 'JU', 'LU', 'NE', 'NW', 'OW', 'SG', 'SH', 'SO', 'SZ', 'TG', 'TI', 'UR', 'VD', 'VS', 'ZG', 'ZH')),
    country TEXT DEFAULT 'CH',
    
    -- Preferences
    language_preference TEXT DEFAULT 'de' CHECK (language_preference IN ('de', 'fr', 'it', 'en')),
    marketing_consent BOOLEAN DEFAULT FALSE,
    data_processing_consent BOOLEAN NOT NULL DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insurance providers
CREATE TABLE public.insurance_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    contact_info JSONB,
    regions TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insurance models
CREATE TABLE public.insurance_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES public.insurance_providers(id) ON DELETE CASCADE,
    model_type TEXT NOT NULL CHECK (model_type IN ('standard', 'flex', 'hmo', 'hausarzt', 'telmed')),
    model_name TEXT NOT NULL,
    description TEXT,
    requires_gp_referral BOOLEAN NOT NULL DEFAULT FALSE,
    deductible_options INTEGER[],
    coverage_percentage DECIMAL(3,2) DEFAULT 0.90,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User insurance
CREATE TABLE public.user_insurance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES public.insurance_providers(id),
    model_id UUID REFERENCES public.insurance_models(id),
    
    policy_number TEXT,
    deductible_amount INTEGER,
    
    -- GP information
    has_gp BOOLEAN,
    gp_name TEXT,
    gp_practice_name TEXT,
    gp_address TEXT,
    gp_phone TEXT,
    gp_email TEXT,
    
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'failed', 'manual_review')),
    verification_date TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_user_insurance_updated_at
    BEFORE UPDATE ON public.user_insurance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Questionnaire sessions
CREATE TABLE public.questionnaire_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    email TEXT,
    phone TEXT,
    
    session_token UUID DEFAULT uuid_generate_v4(),
    current_stage INTEGER DEFAULT 0 CHECK (current_stage >= 0 AND current_stage <= 4),
    stage_completion_status BOOLEAN[] DEFAULT ARRAY[false, false, false, false, false],
    
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    otp_attempts INTEGER DEFAULT 0,
    last_otp_sent TIMESTAMP WITH TIME ZONE,
    
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_questionnaire_sessions_updated_at
    BEFORE UPDATE ON public.questionnaire_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_questionnaire_sessions_token ON public.questionnaire_sessions(session_token);
CREATE INDEX idx_questionnaire_sessions_email ON public.questionnaire_sessions(email);
CREATE INDEX idx_questionnaire_sessions_user_id ON public.questionnaire_sessions(user_id);

-- Form submissions
CREATE TABLE public.form_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.questionnaire_sessions(id) ON DELETE CASCADE,
    stage_number INTEGER NOT NULL CHECK (stage_number >= 0 AND stage_number <= 4),
    
    form_data JSONB NOT NULL,
    encrypted_medical_data TEXT,
    encryption_key_hint TEXT,
    
    is_valid BOOLEAN DEFAULT TRUE,
    validation_errors JSONB,
    
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(session_id, stage_number)
);

CREATE TRIGGER update_form_submissions_updated_at
    BEFORE UPDATE ON public.form_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- OTP verifications
CREATE TABLE public.otp_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.questionnaire_sessions(id) ON DELETE CASCADE,
    
    email TEXT,
    phone TEXT,
    verification_type TEXT NOT NULL CHECK (verification_type IN ('email', 'phone', 'both')),
    
    otp_code TEXT NOT NULL,
    otp_expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '10 minutes'),
    
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_otp_verifications_session_id ON public.otp_verifications(session_id);
CREATE INDEX idx_otp_verifications_expires_at ON public.otp_verifications(otp_expires_at);

-- User documents
CREATE TABLE public.user_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.questionnaire_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    
    document_type TEXT NOT NULL CHECK (document_type IN ('ecg_report', 'gp_referral', 'insurance_card', 'id_document', 'medical_report', 'other')),
    file_name TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    
    bucket_name TEXT DEFAULT 'user-documents',
    file_path TEXT NOT NULL,
    
    upload_status TEXT DEFAULT 'uploaded' CHECK (upload_status IN ('uploading', 'uploaded', 'processing', 'processed', 'failed')),
    processing_result JSONB,
    
    is_encrypted BOOLEAN DEFAULT TRUE,
    access_level TEXT DEFAULT 'private' CHECK (access_level IN ('private', 'shared_with_gp', 'shared_with_provider')),
    
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    
    retention_until TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 years'),
    deletion_requested BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Payment transactions
CREATE TABLE public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.questionnaire_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    
    stripe_payment_intent_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    stripe_payment_method_id TEXT,
    
    amount_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'CHF',
    payment_type TEXT NOT NULL CHECK (payment_type IN ('self_pay', 'insurance_copay', 'deductible')),
    
    package_type TEXT NOT NULL CHECK (package_type IN ('3_day', '5_day', '10_day')),
    package_price_cents INTEGER NOT NULL,
    
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'canceled', 'refunded')),
    failure_reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    paid_at TIMESTAMP WITH TIME ZONE,
    refunded_at TIMESTAMP WITH TIME ZONE
);

CREATE TRIGGER update_payment_transactions_updated_at
    BEFORE UPDATE ON public.payment_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- GP referrals
CREATE TABLE public.gp_referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.questionnaire_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    
    gp_name TEXT NOT NULL,
    gp_practice_name TEXT,
    gp_email TEXT,
    gp_phone TEXT,
    gp_address TEXT,
    
    referral_type TEXT DEFAULT 'screening' CHECK (referral_type IN ('screening', 'diagnostic', 'follow_up')),
    clinical_indication TEXT,
    urgency_level TEXT DEFAULT 'routine' CHECK (urgency_level IN ('urgent', 'semi_urgent', 'routine')),
    
    referral_letter_path TEXT,
    patient_summary_path TEXT,
    
    status TEXT DEFAULT 'generated' CHECK (status IN ('generated', 'sent', 'acknowledged', 'processed')),
    sent_at TIMESTAMP WITH TIME ZONE,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_gp_referrals_updated_at
    BEFORE UPDATE ON public.gp_referrals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit logs
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    action TEXT NOT NULL,
    table_name TEXT,
    record_id UUID,
    
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    session_id UUID REFERENCES public.questionnaire_sessions(id) ON DELETE SET NULL,
    
    ip_address INET,
    user_agent TEXT,
    
    old_values JSONB,
    new_values JSONB,
    
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source TEXT DEFAULT 'web_app'
);

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON public.audit_logs(timestamp);
CREATE INDEX idx_audit_logs_table_record ON public.audit_logs(table_name, record_id);

-- Data retention policies
CREATE TABLE public.data_retention_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name TEXT NOT NULL,
    retention_period INTERVAL NOT NULL,
    deletion_rule TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GDPR requests
CREATE TABLE public.gdpr_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    
    request_type TEXT NOT NULL CHECK (request_type IN ('access', 'rectification', 'erasure', 'portability', 'restriction')),
    request_description TEXT,
    
    status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'in_progress', 'completed', 'rejected')),
    status_reason TEXT,
    
    assigned_to TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    
    response_data JSONB,
    response_file_path TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_gdpr_requests_updated_at
    BEFORE UPDATE ON public.gdpr_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Contraindications
CREATE TABLE public.contraindications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    condition_name TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('absolute', 'relative', 'caution')),
    description TEXT,
    alert_message TEXT,
    requires_gp_clearance BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE
);

-- User contraindications
CREATE TABLE public.user_contraindications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.questionnaire_sessions(id) ON DELETE CASCADE,
    contraindication_id UUID REFERENCES public.contraindications(id),
    
    user_response JSONB,
    risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    
    alert_shown BOOLEAN DEFAULT FALSE,
    gp_notified BOOLEAN DEFAULT FALSE,
    screening_blocked BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- STEP 4: POPULATE REFERENCE DATA
-- ==========================================

-- Insert Swiss insurance providers
INSERT INTO public.insurance_providers (name, short_name, contact_info, regions) VALUES
('CSS Versicherung', 'CSS', '{"website": "css.ch", "phone": "058 277 11 11"}', ARRAY['AG', 'BL', 'BS', 'SO', 'ZH']),
('Helsana Versicherungen AG', 'HELS', '{"website": "helsana.ch", "phone": "0844 80 81 82"}', ARRAY['ZH', 'BE', 'LU', 'SG']),
('SWICA Krankenversicherung', 'SWIC', '{"website": "swica.ch", "phone": "0800 80 90 90"}', ARRAY['ZH', 'SG', 'TG', 'GR']),
('Concordia Kranken- und Unfallversicherung', 'CONC', '{"website": "concordia.ch", "phone": "0800 78 78 78"}', ARRAY['BE', 'LU', 'NW', 'OW']),
('Groupe Mutuel', 'GM', '{"website": "groupemutuel.ch", "phone": "0848 803 111"}', ARRAY['VD', 'VS', 'FR', 'GE']),
('KPT/CPT Krankenversicherung AG', 'KPT', '{"website": "kpt.ch", "phone": "058 310 16 16"}', ARRAY['BE', 'SO', 'BL', 'AG']),
('Sanitas Krankenversicherung', 'SAN', '{"website": "sanitas.com", "phone": "0844 150 150"}', ARRAY['ZH', 'AG', 'TG', 'SH']),
('Sympany Krankenversicherung AG', 'SYM', '{"website": "sympany.ch", "phone": "0800 955 956"}', ARRAY['BL', 'BS', 'AG', 'SO']),
('Visana Services AG', 'VIS', '{"website": "visana.ch", "phone": "0848 848 899"}', ARRAY['BE', 'SO', 'BL', 'JU']);

-- Insert common contraindications
INSERT INTO public.contraindications (condition_name, severity, description, alert_message, requires_gp_clearance) VALUES
('Active Pacemaker', 'absolute', 'Electronic cardiac devices may interfere with ECG readings', 'You have indicated you have a pacemaker. Please consult your cardiologist before proceeding with ECG monitoring.', true),
('Pregnancy', 'relative', 'Special considerations needed for pregnant patients', 'Pregnancy requires special medical supervision. Please consult your doctor before proceeding.', true),
('Recent Heart Surgery', 'relative', 'Post-surgical monitoring requirements', 'Recent heart surgery requires ongoing medical supervision. Please get clearance from your surgeon.', true),
('Severe Skin Conditions', 'caution', 'May affect device adhesion and comfort', 'Severe skin conditions may affect device comfort. Consider discussing with your dermatologist.', false),
('Age Under 18', 'absolute', 'Pediatric patients require special protocols', 'This service is currently only available for adults 18 and over.', true),
('Age Over 85', 'relative', 'Elderly patients may need additional monitoring', 'Patients over 85 may benefit from additional medical supervision during monitoring.', true);

-- Insert data retention policies
INSERT INTO public.data_retention_policies (table_name, retention_period, deletion_rule) VALUES
('form_submissions', '7 years', 'anonymize'),
('user_documents', '7 years', 'hard_delete'),
('audit_logs', '10 years', 'hard_delete'),
('otp_verifications', '30 days', 'hard_delete'),
('questionnaire_sessions', '2 years', 'anonymize'),
('payment_transactions', '10 years', 'anonymize');

-- Record migration as applied
INSERT INTO public.migration_history (migration_number, migration_name)
VALUES ('001', 'Initial Schema Setup - Tables, Functions, and Reference Data');

-- Commit transaction
COMMIT;

RAISE NOTICE 'Migration 001 completed successfully. Created % tables with reference data.', 
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name NOT LIKE '%migration%');