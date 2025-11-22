-- ==========================================
-- SKIIN Switzerland - Eligibility Questionnaire Schema
-- ==========================================
-- VERSION: 1.0
-- CREATED: 2025-08-19
-- PURPOSE: Comprehensive database schema for multi-stage eligibility questionnaire
--          with Swiss insurance integration, OTP verification, and GDPR compliance
-- 
-- FEATURES:
-- - Anonymous → authenticated user flow with OTP
-- - Stage-by-stage form persistence with resume capability
-- - Swiss insurance provider validation
-- - Payment processing integration (Stripe)
-- - File upload handling for medical documents
-- - GDPR compliance with audit logging
-- - RLS policies for data protection
-- ==========================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_crypto"; -- For encryption

-- ==========================================
-- 1. USERS & AUTHENTICATION EXTENSION
-- ==========================================

-- Extend Supabase auth.users with custom profile data
-- Note: auth.users table is managed by Supabase, we extend with custom table
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
    
    -- Metadata
    language_preference TEXT DEFAULT 'de' CHECK (language_preference IN ('de', 'fr', 'it', 'en')),
    marketing_consent BOOLEAN DEFAULT FALSE,
    data_processing_consent BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 2. SWISS INSURANCE SYSTEM
-- ==========================================

-- Swiss insurance providers
CREATE TABLE public.insurance_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL, -- CSS, Helsana, SWICA, Concordia, etc.
    short_name TEXT NOT NULL, -- CSS, HELS, SWIC, CONC
    is_active BOOLEAN DEFAULT TRUE,
    contact_info JSONB, -- Phone, email, website
    regions TEXT[], -- Cantons where active
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Swiss insurance models (Standard, Flex, HMO, Hausarzt, Telmed)
CREATE TABLE public.insurance_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES public.insurance_providers(id) ON DELETE CASCADE,
    model_type TEXT NOT NULL CHECK (model_type IN ('standard', 'flex', 'hmo', 'hausarzt', 'telmed')),
    model_name TEXT NOT NULL, -- "HMO Modell", "Hausarzt Modell", etc.
    description TEXT,
    requires_gp_referral BOOLEAN NOT NULL DEFAULT FALSE,
    deductible_options INTEGER[], -- [300, 500, 1000, 1500, 2000, 2500]
    coverage_percentage DECIMAL(3,2) DEFAULT 0.90, -- 90% coverage typical
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User insurance information
CREATE TABLE public.user_insurance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES public.insurance_providers(id),
    model_id UUID REFERENCES public.insurance_models(id),
    
    -- Insurance details
    policy_number TEXT,
    deductible_amount INTEGER,
    
    -- GP information (required for some models)
    has_gp BOOLEAN,
    gp_name TEXT,
    gp_practice_name TEXT,
    gp_address TEXT,
    gp_phone TEXT,
    gp_email TEXT,
    
    -- Verification status
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'failed', 'manual_review')),
    verification_date TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_user_insurance_updated_at
    BEFORE UPDATE ON public.user_insurance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 3. QUESTIONNAIRE SESSION MANAGEMENT
-- ==========================================

-- Sessions for anonymous users and resume functionality
CREATE TABLE public.questionnaire_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- User identification
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE, -- NULL for anonymous users
    email TEXT, -- For anonymous users before authentication
    phone TEXT,
    
    -- Session management
    session_token UUID DEFAULT uuid_generate_v4(), -- Secure token for resume
    current_stage INTEGER DEFAULT 0 CHECK (current_stage >= 0 AND current_stage <= 4),
    stage_completion_status BOOLEAN[] DEFAULT ARRAY[false, false, false, false, false], -- 5 stages
    
    -- Authentication flow tracking
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    otp_attempts INTEGER DEFAULT 0,
    last_otp_sent TIMESTAMP WITH TIME ZONE,
    
    -- Progress tracking
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    
    -- Status
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'), -- 30-day expiry
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_questionnaire_sessions_updated_at
    BEFORE UPDATE ON public.questionnaire_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Index for performance
CREATE INDEX idx_questionnaire_sessions_token ON public.questionnaire_sessions(session_token);
CREATE INDEX idx_questionnaire_sessions_email ON public.questionnaire_sessions(email);
CREATE INDEX idx_questionnaire_sessions_user_id ON public.questionnaire_sessions(user_id);

-- ==========================================
-- 4. FORM DATA STORAGE
-- ==========================================

-- Stage-by-stage form data with encryption for sensitive information
CREATE TABLE public.form_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.questionnaire_sessions(id) ON DELETE CASCADE,
    stage_number INTEGER NOT NULL CHECK (stage_number >= 0 AND stage_number <= 4),
    
    -- Form data (JSON for flexibility)
    form_data JSONB NOT NULL,
    
    -- Encrypted sensitive data (medical history, symptoms)
    encrypted_medical_data TEXT, -- pgp_sym_encrypt() for sensitive medical information
    encryption_key_hint TEXT, -- Hint for key derivation (user-specific)
    
    -- Validation
    is_valid BOOLEAN DEFAULT TRUE,
    validation_errors JSONB, -- Store field-level validation errors
    
    -- Metadata
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint to prevent duplicate stage submissions per session
    UNIQUE(session_id, stage_number)
);

CREATE TRIGGER update_form_submissions_updated_at
    BEFORE UPDATE ON public.form_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 5. OTP VERIFICATION SYSTEM
-- ==========================================

CREATE TABLE public.otp_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.questionnaire_sessions(id) ON DELETE CASCADE,
    
    -- Contact information
    email TEXT,
    phone TEXT,
    verification_type TEXT NOT NULL CHECK (verification_type IN ('email', 'phone', 'both')),
    
    -- OTP details
    otp_code TEXT NOT NULL, -- Hashed OTP code
    otp_expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '10 minutes'),
    
    -- Attempt tracking
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    
    -- Status
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    
    -- Security
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance and cleanup
CREATE INDEX idx_otp_verifications_session_id ON public.otp_verifications(session_id);
CREATE INDEX idx_otp_verifications_expires_at ON public.otp_verifications(otp_expires_at);

-- ==========================================
-- 6. FILE UPLOADS & DOCUMENT STORAGE
-- ==========================================

CREATE TABLE public.user_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.questionnaire_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    
    -- Document details
    document_type TEXT NOT NULL CHECK (document_type IN ('ecg_report', 'gp_referral', 'insurance_card', 'id_document', 'medical_report', 'other')),
    file_name TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    
    -- Supabase Storage references
    bucket_name TEXT DEFAULT 'user-documents',
    file_path TEXT NOT NULL, -- Path in Supabase Storage
    
    -- Processing status
    upload_status TEXT DEFAULT 'uploaded' CHECK (upload_status IN ('uploading', 'uploaded', 'processing', 'processed', 'failed')),
    processing_result JSONB, -- OCR results, validation status, etc.
    
    -- Security & compliance
    is_encrypted BOOLEAN DEFAULT TRUE,
    access_level TEXT DEFAULT 'private' CHECK (access_level IN ('private', 'shared_with_gp', 'shared_with_provider')),
    
    -- Metadata
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    
    -- GDPR compliance
    retention_until TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 years'), -- Swiss medical record retention
    deletion_requested BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- ==========================================
-- 7. PAYMENT PROCESSING (STRIPE INTEGRATION)
-- ==========================================

CREATE TABLE public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.questionnaire_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    
    -- Stripe integration
    stripe_payment_intent_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    stripe_payment_method_id TEXT,
    
    -- Payment details
    amount_cents INTEGER NOT NULL, -- Amount in cents (e.g., 15000 = 150.00 CHF)
    currency TEXT DEFAULT 'CHF',
    payment_type TEXT NOT NULL CHECK (payment_type IN ('self_pay', 'insurance_copay', 'deductible')),
    
    -- Package selection
    package_type TEXT NOT NULL CHECK (package_type IN ('3_day', '5_day', '10_day')),
    package_price_cents INTEGER NOT NULL,
    
    -- Status tracking
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'canceled', 'refunded')),
    failure_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    paid_at TIMESTAMP WITH TIME ZONE,
    refunded_at TIMESTAMP WITH TIME ZONE
);

CREATE TRIGGER update_payment_transactions_updated_at
    BEFORE UPDATE ON public.payment_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 8. GP REFERRAL SYSTEM
-- ==========================================

CREATE TABLE public.gp_referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.questionnaire_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    
    -- GP Information
    gp_name TEXT NOT NULL,
    gp_practice_name TEXT,
    gp_email TEXT,
    gp_phone TEXT,
    gp_address TEXT,
    
    -- Referral details
    referral_type TEXT DEFAULT 'screening' CHECK (referral_type IN ('screening', 'diagnostic', 'follow_up')),
    clinical_indication TEXT, -- Reason for referral
    urgency_level TEXT DEFAULT 'routine' CHECK (urgency_level IN ('urgent', 'semi_urgent', 'routine')),
    
    -- Generated documents
    referral_letter_path TEXT, -- Path to generated PDF
    patient_summary_path TEXT, -- Path to patient summary PDF
    
    -- Status tracking
    status TEXT DEFAULT 'generated' CHECK (status IN ('generated', 'sent', 'acknowledged', 'processed')),
    sent_at TIMESTAMP WITH TIME ZONE,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_gp_referrals_updated_at
    BEFORE UPDATE ON public.gp_referrals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 9. AUDIT LOG FOR GDPR COMPLIANCE
-- ==========================================

CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- What happened
    action TEXT NOT NULL, -- 'create', 'read', 'update', 'delete', 'login', 'otp_sent', etc.
    table_name TEXT,
    record_id UUID,
    
    -- Who did it
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    session_id UUID REFERENCES public.questionnaire_sessions(id) ON DELETE SET NULL,
    
    -- Context
    ip_address INET,
    user_agent TEXT,
    
    -- Changes (for updates/deletes)
    old_values JSONB,
    new_values JSONB,
    
    -- Metadata
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source TEXT DEFAULT 'web_app' -- 'web_app', 'admin_panel', 'api', 'system'
);

-- Indexes for audit queries
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON public.audit_logs(timestamp);
CREATE INDEX idx_audit_logs_table_record ON public.audit_logs(table_name, record_id);

-- ==========================================
-- 10. DATA RETENTION & GDPR COMPLIANCE
-- ==========================================

CREATE TABLE public.data_retention_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name TEXT NOT NULL,
    retention_period INTERVAL NOT NULL, -- e.g., '7 years', '30 days'
    deletion_rule TEXT, -- 'hard_delete', 'soft_delete', 'anonymize'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GDPR data subject requests
CREATE TABLE public.gdpr_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    
    -- Request details
    request_type TEXT NOT NULL CHECK (request_type IN ('access', 'rectification', 'erasure', 'portability', 'restriction')),
    request_description TEXT,
    
    -- Status tracking
    status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'in_progress', 'completed', 'rejected')),
    status_reason TEXT,
    
    -- Processing
    assigned_to TEXT, -- Admin user handling request
    processed_at TIMESTAMP WITH TIME ZONE,
    
    -- Response
    response_data JSONB, -- For data export requests
    response_file_path TEXT, -- Path to exported data file
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_gdpr_requests_updated_at
    BEFORE UPDATE ON public.gdpr_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 11. CONTRAINDICATIONS & EMERGENCY ALERTS
-- ==========================================

CREATE TABLE public.contraindications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    condition_name TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('absolute', 'relative', 'caution')),
    description TEXT,
    alert_message TEXT, -- Message to show user
    requires_gp_clearance BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE
);

-- User contraindication flags
CREATE TABLE public.user_contraindications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.questionnaire_sessions(id) ON DELETE CASCADE,
    contraindication_id UUID REFERENCES public.contraindications(id),
    
    -- Assessment
    user_response JSONB, -- User's answers that triggered this flag
    risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    
    -- Actions taken
    alert_shown BOOLEAN DEFAULT FALSE,
    gp_notified BOOLEAN DEFAULT FALSE,
    screening_blocked BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- POPULATE REFERENCE DATA
-- ==========================================

-- Insert major Swiss insurance providers
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
('form_submissions', '7 years', 'anonymize'), -- Swiss medical record retention
('user_documents', '7 years', 'hard_delete'),
('audit_logs', '10 years', 'hard_delete'), -- Compliance requirement
('otp_verifications', '30 days', 'hard_delete'),
('questionnaire_sessions', '2 years', 'anonymize'),
('payment_transactions', '10 years', 'anonymize'); -- Tax/accounting requirement

COMMENT ON TABLE public.user_profiles IS 'Extended user profile data linked to Supabase auth.users';
COMMENT ON TABLE public.insurance_providers IS 'Swiss health insurance companies and their details';
COMMENT ON TABLE public.insurance_models IS 'Insurance model types (Standard, HMO, Hausarzt, etc.) per provider';
COMMENT ON TABLE public.questionnaire_sessions IS 'Session management for multi-stage forms with resume capability';
COMMENT ON TABLE public.form_submissions IS 'Stage-by-stage form data with encryption for sensitive medical information';
COMMENT ON TABLE public.otp_verifications IS 'Email and phone verification system with rate limiting';
COMMENT ON TABLE public.user_documents IS 'File upload tracking linked to Supabase Storage';
COMMENT ON TABLE public.payment_transactions IS 'Stripe payment integration for self-pay users';
COMMENT ON TABLE public.gp_referrals IS 'General Practitioner referral system and document generation';
COMMENT ON TABLE public.audit_logs IS 'GDPR compliance audit trail for all data access and modifications';
COMMENT ON TABLE public.contraindications IS 'Medical conditions that may prevent or require special handling for ECG monitoring';