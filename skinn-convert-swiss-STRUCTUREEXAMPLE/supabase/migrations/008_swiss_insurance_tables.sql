-- ==========================================
-- SWISS INSURANCE SYSTEM TABLES
-- ==========================================
-- VERSION: 1.0
-- CREATED: 2025-08-19
-- PURPOSE: Phase 1.1 - Swiss insurance provider and model tables,
--          GP referral system, and payment tracking
-- ==========================================

-- ==========================================
-- 1. INSURANCE PROVIDERS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.insurance_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    short_name TEXT NOT NULL UNIQUE,
    
    -- Provider details
    is_active BOOLEAN DEFAULT TRUE,
    website TEXT,
    phone TEXT,
    email TEXT,
    
    -- Contact information
    contact_info JSONB DEFAULT '{}',
    
    -- Regional coverage (Swiss cantons)
    regions TEXT[] DEFAULT ARRAY['AG', 'AI', 'AR', 'BE', 'BL', 'BS', 'FR', 'GE', 'GL', 'GR', 
                                  'JU', 'LU', 'NE', 'NW', 'OW', 'SG', 'SH', 'SO', 'SZ', 'TG', 
                                  'TI', 'UR', 'VD', 'VS', 'ZG', 'ZH'],
    
    -- Integration details
    api_enabled BOOLEAN DEFAULT FALSE,
    api_endpoint TEXT,
    api_credentials_encrypted TEXT,
    
    -- Billing information
    billing_contact TEXT,
    billing_email TEXT,
    billing_address JSONB,
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Insert major Swiss insurance providers
INSERT INTO public.insurance_providers (name, short_name, website, phone, is_active) VALUES
    ('CSS Versicherung', 'CSS', 'css.ch', '058 277 11 11', true),
    ('Helsana', 'HELS', 'helsana.ch', '0844 80 81 82', true),
    ('SWICA', 'SWIC', 'swica.ch', '0800 80 90 80', true),
    ('Concordia', 'CONC', 'concordia.ch', '041 228 01 11', true),
    ('Groupe Mutuel', 'GM', 'groupemutuel.ch', '0848 803 111', true),
    ('KPT/CPT', 'KPT', 'kpt.ch', '058 310 91 11', true),
    ('Sanitas', 'SANI', 'sanitas.com', '0844 150 150', true),
    ('Sympany', 'SYMP', 'sympany.ch', '0800 955 955', true),
    ('Visana', 'VISA', 'visana.ch', '031 357 91 11', true)
ON CONFLICT (name) DO NOTHING;

-- ==========================================
-- 2. INSURANCE MODELS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.insurance_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES public.insurance_providers(id) ON DELETE CASCADE,
    
    -- Model details
    model_type TEXT NOT NULL CHECK (model_type IN (
        'standard', 'flex', 'hmo', 'hausarzt', 'telmed'
    )),
    model_name TEXT NOT NULL,
    description TEXT,
    
    -- Requirements
    requires_gp_referral BOOLEAN NOT NULL DEFAULT FALSE,
    requires_network_provider BOOLEAN DEFAULT FALSE,
    network_providers TEXT[],
    
    -- Financial details
    deductible_options INTEGER[] DEFAULT ARRAY[300, 500, 1000, 1500, 2000, 2500],
    coverage_percentage DECIMAL(3,2) DEFAULT 0.90,
    premium_discount_percentage DECIMAL(3,2) DEFAULT 0.00,
    
    -- Eligibility for SKIIN services
    covers_holter_monitoring BOOLEAN DEFAULT TRUE,
    prior_authorization_required BOOLEAN DEFAULT FALSE,
    max_coverage_amount_chf DECIMAL(10,2),
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(provider_id, model_type, model_name)
);

-- Insert common insurance models for each provider
DO $$
DECLARE
    provider RECORD;
BEGIN
    FOR provider IN SELECT id, short_name FROM public.insurance_providers LOOP
        -- Standard model (available for all)
        INSERT INTO public.insurance_models (provider_id, model_type, model_name, requires_gp_referral, coverage_percentage)
        VALUES (provider.id, 'standard', 'Standard Model', false, 0.90);
        
        -- HMO model (most providers offer this)
        INSERT INTO public.insurance_models (provider_id, model_type, model_name, requires_gp_referral, coverage_percentage, premium_discount_percentage)
        VALUES (provider.id, 'hmo', 'HMO Model', true, 0.90, 0.15);
        
        -- Hausarzt model
        INSERT INTO public.insurance_models (provider_id, model_type, model_name, requires_gp_referral, coverage_percentage, premium_discount_percentage)
        VALUES (provider.id, 'hausarzt', 'Hausarzt Model', true, 0.90, 0.10);
        
        -- Telmed model
        INSERT INTO public.insurance_models (provider_id, model_type, model_name, requires_gp_referral, coverage_percentage, premium_discount_percentage)
        VALUES (provider.id, 'telmed', 'Telmed Model', false, 0.90, 0.20);
    END LOOP;
END $$;

-- ==========================================
-- 3. USER INSURANCE TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.user_insurance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    
    -- Insurance details
    provider_id UUID REFERENCES public.insurance_providers(id),
    model_id UUID REFERENCES public.insurance_models(id),
    insurance_number TEXT,
    
    -- Coverage details
    deductible_amount INTEGER CHECK (deductible_amount IN (300, 500, 1000, 1500, 2000, 2500)),
    current_year_expenses DECIMAL(10,2) DEFAULT 0.00,
    deductible_met BOOLEAN DEFAULT FALSE,
    
    -- Verification
    is_verified BOOLEAN DEFAULT FALSE,
    verification_date TIMESTAMPTZ,
    verification_method TEXT CHECK (verification_method IN ('manual', 'api', 'document')),
    verification_document_id UUID,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    valid_from DATE,
    valid_until DATE,
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, provider_id, insurance_number)
);

-- ==========================================
-- 4. GP REFERRALS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.gp_referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    questionnaire_id UUID REFERENCES public.eligibility_questionnaires(id),
    
    -- GP details
    gp_name TEXT NOT NULL,
    gp_practice TEXT,
    gp_email TEXT,
    gp_phone TEXT,
    gp_fax TEXT,
    gp_address JSONB,
    
    -- Referral details
    referral_type TEXT NOT NULL CHECK (referral_type IN (
        'holter_monitoring', 'consultation', 'follow_up', 'emergency'
    )),
    referral_reason TEXT NOT NULL,
    clinical_summary TEXT,
    
    -- Medical information
    symptoms TEXT[],
    risk_factors TEXT[],
    medications TEXT[],
    relevant_history TEXT,
    
    -- Referral status
    status TEXT DEFAULT 'draft' CHECK (status IN (
        'draft', 'sent', 'received', 'accepted', 'rejected', 'expired'
    )),
    
    -- Documents
    referral_letter_url TEXT,
    referral_letter_generated_at TIMESTAMPTZ,
    gp_response_url TEXT,
    gp_response_received_at TIMESTAMPTZ,
    
    -- Timing
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ DEFAULT (CURRENT_TIMESTAMP + INTERVAL '30 days'),
    
    -- Insurance integration
    insurance_id UUID REFERENCES public.user_insurance(id),
    requires_prior_auth BOOLEAN DEFAULT FALSE,
    prior_auth_number TEXT,
    
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 5. PAYMENTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    questionnaire_id UUID REFERENCES public.eligibility_questionnaires(id),
    
    -- Payment details
    amount_chf DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'CHF' CHECK (currency = 'CHF'),
    payment_method TEXT CHECK (payment_method IN (
        'credit_card', 'debit_card', 'twint', 'bank_transfer', 'insurance'
    )),
    
    -- Package details
    package_type TEXT CHECK (package_type IN ('3_day', '5_day', '10_day', 'custom')),
    package_price_chf DECIMAL(10,2),
    discount_amount_chf DECIMAL(10,2) DEFAULT 0.00,
    discount_code TEXT,
    
    -- Stripe integration
    stripe_payment_intent_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    stripe_payment_method_id TEXT,
    stripe_invoice_id TEXT,
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN (
        'pending', 'processing', 'succeeded', 'failed', 'canceled', 'refunded', 'partially_refunded'
    )),
    failure_reason TEXT,
    
    -- Insurance billing (if applicable)
    insurance_claim_id TEXT,
    insurance_coverage_amount DECIMAL(10,2),
    patient_responsibility_amount DECIMAL(10,2),
    
    -- Timing
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    refunded_at TIMESTAMPTZ,
    
    -- Refund details
    refund_amount_chf DECIMAL(10,2),
    refund_reason TEXT,
    stripe_refund_id TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 6. ANALYTICS EVENTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    session_id UUID,
    
    -- Event details
    event_type TEXT NOT NULL,
    event_category TEXT,
    event_action TEXT,
    event_label TEXT,
    event_value INTEGER,
    
    -- Context
    page_url TEXT,
    page_title TEXT,
    referrer TEXT,
    
    -- UTM parameters
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    
    -- Device information
    user_agent TEXT,
    ip_address INET,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    
    -- Location (anonymized)
    country TEXT,
    region TEXT,
    city TEXT,
    
    -- Custom properties
    properties JSONB DEFAULT '{}',
    
    -- Timing
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 7. FEATURE FLAGS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.feature_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Flag details
    flag_name TEXT NOT NULL UNIQUE,
    description TEXT,
    
    -- Targeting
    is_enabled BOOLEAN DEFAULT FALSE,
    rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
    
    -- User targeting
    enabled_for_users UUID[] DEFAULT ARRAY[]::UUID[],
    disabled_for_users UUID[] DEFAULT ARRAY[]::UUID[],
    
    -- Environment targeting
    enabled_environments TEXT[] DEFAULT ARRAY['development'],
    
    -- Conditions
    conditions JSONB DEFAULT '{}',
    
    -- Metadata
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ
);

-- Insert default feature flags
INSERT INTO public.feature_flags (flag_name, description, is_enabled, enabled_environments) VALUES
    ('enable_otp_verification', 'Enable OTP verification for email/phone', true, ARRAY['development', 'staging', 'production']),
    ('enable_stripe_payments', 'Enable Stripe payment processing', false, ARRAY['development', 'staging']),
    ('enable_insurance_api', 'Enable insurance provider API integration', false, ARRAY['development']),
    ('enable_gp_referrals', 'Enable GP referral generation', true, ARRAY['development', 'staging']),
    ('enable_file_uploads', 'Enable document uploads', true, ARRAY['development', 'staging'])
ON CONFLICT (flag_name) DO NOTHING;

-- ==========================================
-- 8. INDEXES
-- ==========================================

-- Insurance providers
CREATE INDEX idx_insurance_providers_active ON public.insurance_providers(is_active) WHERE is_active = TRUE;

-- Insurance models
CREATE INDEX idx_insurance_models_provider ON public.insurance_models(provider_id);
CREATE INDEX idx_insurance_models_type ON public.insurance_models(model_type);

-- User insurance
CREATE INDEX idx_user_insurance_user ON public.user_insurance(user_id);
CREATE INDEX idx_user_insurance_provider ON public.user_insurance(provider_id);

-- GP referrals
CREATE INDEX idx_gp_referrals_user ON public.gp_referrals(user_id);
CREATE INDEX idx_gp_referrals_status ON public.gp_referrals(status);

-- Payments
CREATE INDEX idx_payments_user ON public.payments(user_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_stripe ON public.payments(stripe_payment_intent_id);

-- Analytics
CREATE INDEX idx_analytics_user ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_timestamp ON public.analytics_events(timestamp DESC);
CREATE INDEX idx_analytics_event_type ON public.analytics_events(event_type);

-- Feature flags
CREATE INDEX idx_feature_flags_enabled ON public.feature_flags(is_enabled) WHERE is_enabled = TRUE;

-- ==========================================
-- 9. TRIGGERS
-- ==========================================

-- Apply update trigger to new tables
CREATE TRIGGER update_insurance_providers_updated_at
    BEFORE UPDATE ON public.insurance_providers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_insurance_models_updated_at
    BEFORE UPDATE ON public.insurance_models
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_user_insurance_updated_at
    BEFORE UPDATE ON public.user_insurance
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_gp_referrals_updated_at
    BEFORE UPDATE ON public.gp_referrals
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_feature_flags_updated_at
    BEFORE UPDATE ON public.feature_flags
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ==========================================
-- 10. RLS POLICIES
-- ==========================================

-- Enable RLS
ALTER TABLE public.insurance_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_insurance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gp_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- Insurance providers (public read)
CREATE POLICY "Anyone can view active insurance providers" ON public.insurance_providers
    FOR SELECT USING (is_active = TRUE);

-- Insurance models (public read)
CREATE POLICY "Anyone can view active insurance models" ON public.insurance_models
    FOR SELECT USING (is_active = TRUE);

-- User insurance (user-specific)
CREATE POLICY "Users can view own insurance" ON public.user_insurance
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own insurance" ON public.user_insurance
    FOR ALL USING (auth.uid() = user_id);

-- GP referrals (user-specific)
CREATE POLICY "Users can view own referrals" ON public.gp_referrals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own referrals" ON public.gp_referrals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Payments (user-specific)
CREATE POLICY "Users can view own payments" ON public.payments
    FOR SELECT USING (auth.uid() = user_id);

-- Analytics (write-only for users)
CREATE POLICY "Anyone can write analytics events" ON public.analytics_events
    FOR INSERT WITH CHECK (TRUE);

-- Feature flags (public read)
CREATE POLICY "Anyone can view enabled feature flags" ON public.feature_flags
    FOR SELECT USING (is_enabled = TRUE);

-- Service role full access
CREATE POLICY "Service role has full access to insurance providers" ON public.insurance_providers
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role has full access to insurance models" ON public.insurance_models
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role has full access to user insurance" ON public.user_insurance
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role has full access to GP referrals" ON public.gp_referrals
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role has full access to payments" ON public.payments
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role has full access to analytics" ON public.analytics_events
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role has full access to feature flags" ON public.feature_flags
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ==========================================
-- COMMENTS FOR DOCUMENTATION
-- ==========================================

COMMENT ON TABLE public.insurance_providers IS 
'Swiss health insurance providers with API integration support';

COMMENT ON TABLE public.insurance_models IS 
'Insurance model types (Standard, HMO, Hausarzt, Telmed) with coverage details';

COMMENT ON TABLE public.user_insurance IS 
'User insurance information with verification and deductible tracking';

COMMENT ON TABLE public.gp_referrals IS 
'GP referral management for insurance models requiring referrals';

COMMENT ON TABLE public.payments IS 
'Payment transactions with Stripe integration and insurance billing';

COMMENT ON TABLE public.analytics_events IS 
'Event tracking for analytics and conversion optimization';

COMMENT ON TABLE public.feature_flags IS 
'Feature flag management for gradual rollouts and A/B testing';