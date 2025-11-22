-- ==========================================
-- CORE USER TABLES
-- ==========================================
-- VERSION: 1.0
-- CREATED: 2025-08-19
-- PURPOSE: Phase 1.1 - Core user management tables for eligibility questionnaire
--          including user profiles and GDPR compliance
-- ==========================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. USER PROFILES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
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
    canton TEXT CHECK (canton IN (
        'AG', 'AI', 'AR', 'BE', 'BL', 'BS', 'FR', 'GE', 'GL', 'GR', 
        'JU', 'LU', 'NE', 'NW', 'OW', 'SG', 'SH', 'SO', 'SZ', 'TG', 
        'TI', 'UR', 'VD', 'VS', 'ZG', 'ZH'
    )),
    country TEXT DEFAULT 'CH',
    
    -- Preferences
    language_preference TEXT DEFAULT 'de' CHECK (language_preference IN ('de', 'fr', 'it', 'en')),
    marketing_consent BOOLEAN DEFAULT FALSE,
    data_processing_consent BOOLEAN NOT NULL DEFAULT TRUE,
    consent_timestamp TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email) WHERE email IS NOT NULL;
CREATE INDEX idx_user_profiles_phone ON public.user_profiles(phone) WHERE phone IS NOT NULL;
CREATE INDEX idx_user_profiles_canton ON public.user_profiles(canton) WHERE canton IS NOT NULL;

-- ==========================================
-- 2. ELIGIBILITY QUESTIONNAIRES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.eligibility_questionnaires (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    session_id UUID UNIQUE, -- Links to questionnaire_sessions
    
    -- Questionnaire metadata
    version TEXT DEFAULT '1.0',
    questionnaire_type TEXT DEFAULT 'standard' CHECK (questionnaire_type IN ('standard', 'quick', 'comprehensive')),
    
    -- Status tracking
    status TEXT DEFAULT 'in_progress' CHECK (status IN (
        'in_progress', 'completed', 'abandoned', 'expired', 'invalidated'
    )),
    
    -- Progress tracking
    current_step INTEGER DEFAULT 1,
    total_steps INTEGER DEFAULT 5,
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    
    -- Results
    is_eligible BOOLEAN,
    eligibility_score INTEGER CHECK (eligibility_score >= 0 AND eligibility_score <= 100),
    risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high', 'very_high')),
    recommendation TEXT,
    
    -- Timing
    started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ,
    abandoned_at TIMESTAMPTZ,
    time_spent_seconds INTEGER DEFAULT 0,
    
    -- Analytics
    source TEXT,
    referral_code TEXT,
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_eligibility_user ON public.eligibility_questionnaires(user_id);
CREATE INDEX idx_eligibility_status ON public.eligibility_questionnaires(status);
CREATE INDEX idx_eligibility_created ON public.eligibility_questionnaires(created_at DESC);

-- ==========================================
-- 3. QUESTIONNAIRE RESPONSES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.questionnaire_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    questionnaire_id UUID REFERENCES public.eligibility_questionnaires(id) ON DELETE CASCADE,
    
    -- Question identification
    question_id TEXT NOT NULL,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN (
        'single_choice', 'multiple_choice', 'text', 'number', 'date', 'boolean', 'scale'
    )),
    question_category TEXT,
    
    -- Response data
    answer_value TEXT,
    answer_values TEXT[], -- For multiple choice
    answer_metadata JSONB,
    
    -- Validation
    is_valid BOOLEAN DEFAULT TRUE,
    validation_errors TEXT[],
    
    -- Medical relevance
    is_medical_data BOOLEAN DEFAULT FALSE,
    affects_eligibility BOOLEAN DEFAULT FALSE,
    weight_factor DECIMAL(3,2) DEFAULT 1.0,
    
    -- Timing
    answered_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    time_to_answer_seconds INTEGER,
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_responses_questionnaire ON public.questionnaire_responses(questionnaire_id);
CREATE INDEX idx_responses_question ON public.questionnaire_responses(question_id);
CREATE INDEX idx_responses_medical ON public.questionnaire_responses(is_medical_data) WHERE is_medical_data = TRUE;

-- ==========================================
-- 4. CONDITIONS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.conditions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    questionnaire_id UUID REFERENCES public.eligibility_questionnaires(id) ON DELETE CASCADE,
    
    -- Condition details
    condition_name TEXT NOT NULL,
    condition_category TEXT CHECK (condition_category IN (
        'cardiovascular', 'respiratory', 'neurological', 'endocrine', 
        'musculoskeletal', 'dermatological', 'psychological', 'other'
    )),
    icd10_code TEXT,
    
    -- Clinical relevance
    severity TEXT CHECK (severity IN ('mild', 'moderate', 'severe', 'critical')),
    onset_date DATE,
    is_chronic BOOLEAN DEFAULT FALSE,
    is_controlled BOOLEAN DEFAULT FALSE,
    
    -- Impact on eligibility
    affects_eligibility BOOLEAN DEFAULT FALSE,
    contraindication_level TEXT CHECK (contraindication_level IN (
        'none', 'relative', 'absolute'
    )),
    requires_gp_clearance BOOLEAN DEFAULT FALSE,
    
    -- Treatment status
    under_treatment BOOLEAN DEFAULT FALSE,
    medications TEXT[],
    treating_physician TEXT,
    
    -- Verification
    verified_by_gp BOOLEAN DEFAULT FALSE,
    verification_date DATE,
    verification_document_id UUID,
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_conditions_user ON public.conditions(user_id);
CREATE INDEX idx_conditions_questionnaire ON public.conditions(questionnaire_id);
CREATE INDEX idx_conditions_contraindication ON public.conditions(contraindication_level) 
    WHERE contraindication_level != 'none';

-- ==========================================
-- 5. GDPR REQUESTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.gdpr_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    
    -- Request details
    request_type TEXT NOT NULL CHECK (request_type IN (
        'access', 'rectification', 'deletion', 'portability', 
        'restriction', 'objection', 'consent_withdrawal'
    )),
    request_reason TEXT,
    
    -- Status tracking
    status TEXT DEFAULT 'pending' CHECK (status IN (
        'pending', 'processing', 'completed', 'rejected', 'partially_completed'
    )),
    
    -- Processing details
    processor_id UUID REFERENCES auth.users(id),
    processing_notes TEXT,
    rejection_reason TEXT,
    
    -- Timing (GDPR requires response within 30 days)
    requested_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    acknowledged_at TIMESTAMPTZ,
    processed_at TIMESTAMPTZ,
    due_date TIMESTAMPTZ DEFAULT (CURRENT_TIMESTAMP + INTERVAL '30 days'),
    
    -- Audit trail
    request_ip INET,
    request_user_agent TEXT,
    verification_method TEXT,
    verified BOOLEAN DEFAULT FALSE,
    
    -- Data export (for access/portability requests)
    export_format TEXT CHECK (export_format IN ('json', 'csv', 'pdf')),
    export_url TEXT,
    export_expires_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_gdpr_user ON public.gdpr_requests(user_id);
CREATE INDEX idx_gdpr_status ON public.gdpr_requests(status) WHERE status != 'completed';
CREATE INDEX idx_gdpr_due_date ON public.gdpr_requests(due_date) WHERE status = 'pending';

-- ==========================================
-- 6. TRIGGER FUNCTIONS
-- ==========================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to all tables
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_eligibility_questionnaires_updated_at
    BEFORE UPDATE ON public.eligibility_questionnaires
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_questionnaire_responses_updated_at
    BEFORE UPDATE ON public.questionnaire_responses
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_conditions_updated_at
    BEFORE UPDATE ON public.conditions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_gdpr_requests_updated_at
    BEFORE UPDATE ON public.gdpr_requests
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ==========================================
-- 7. RLS POLICIES
-- ==========================================

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eligibility_questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gdpr_requests ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Eligibility questionnaires policies
CREATE POLICY "Users can view own questionnaires" ON public.eligibility_questionnaires
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own questionnaires" ON public.eligibility_questionnaires
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own questionnaires" ON public.eligibility_questionnaires
    FOR UPDATE USING (auth.uid() = user_id);

-- Questionnaire responses policies
CREATE POLICY "Users can view own responses" ON public.questionnaire_responses
    FOR SELECT USING (
        questionnaire_id IN (
            SELECT id FROM public.eligibility_questionnaires 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create own responses" ON public.questionnaire_responses
    FOR INSERT WITH CHECK (
        questionnaire_id IN (
            SELECT id FROM public.eligibility_questionnaires 
            WHERE user_id = auth.uid()
        )
    );

-- Conditions policies
CREATE POLICY "Users can view own conditions" ON public.conditions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own conditions" ON public.conditions
    FOR ALL USING (auth.uid() = user_id);

-- GDPR requests policies
CREATE POLICY "Users can view own GDPR requests" ON public.gdpr_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own GDPR requests" ON public.gdpr_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Service role policies (for admin access)
CREATE POLICY "Service role has full access to user_profiles" ON public.user_profiles
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role has full access to questionnaires" ON public.eligibility_questionnaires
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role has full access to responses" ON public.questionnaire_responses
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role has full access to conditions" ON public.conditions
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role has full access to GDPR requests" ON public.gdpr_requests
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ==========================================
-- COMMENTS FOR DOCUMENTATION
-- ==========================================

COMMENT ON TABLE public.user_profiles IS 
'Extended user profile data for Swiss healthcare system with GDPR compliance';

COMMENT ON TABLE public.eligibility_questionnaires IS 
'Main questionnaire tracking table for eligibility assessment';

COMMENT ON TABLE public.questionnaire_responses IS 
'Individual question responses with medical data classification';

COMMENT ON TABLE public.conditions IS 
'Medical conditions reported by users affecting eligibility';

COMMENT ON TABLE public.gdpr_requests IS 
'GDPR compliance tracking for data subject requests';