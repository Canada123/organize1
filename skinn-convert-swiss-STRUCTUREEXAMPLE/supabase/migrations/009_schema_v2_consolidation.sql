-- Schema v2.0 Consolidation Migration
-- Reduces complexity from 20+ tables to 5 core tables
-- Implements GDPR compliance and Swiss healthcare requirements

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Enhanced user_profiles table (extends auth.users)
CREATE TABLE user_profiles_v2 (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT,
  date_of_birth DATE NOT NULL,
  
  -- Address (Swiss compliance)
  street_address TEXT,
  postal_code TEXT,
  city TEXT,
  canton TEXT CHECK (canton IN (
    'AG', 'AR', 'AI', 'BL', 'BS', 'BE', 'FR', 'GE', 'GL', 'GR', 
    'JU', 'LU', 'NE', 'NW', 'OW', 'SH', 'SZ', 'SO', 'SG', 'TG', 
    'TI', 'UR', 'VS', 'VD', 'ZG', 'ZH'
  )),
  
  -- GDPR compliance
  consent_given BOOLEAN DEFAULT false,
  consent_given_at TIMESTAMPTZ,
  data_retention_until TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 years'),
  deletion_requested_at TIMESTAMPTZ,
  
  -- Enhanced OTP rate limiting
  otp_requests_count INTEGER DEFAULT 0,
  otp_requests_reset_at TIMESTAMPTZ DEFAULT NOW(),
  phone_verified BOOLEAN DEFAULT false,
  email_verified BOOLEAN DEFAULT false,
  
  -- Swiss healthcare compliance
  health_insurance_number TEXT,
  preferred_language TEXT DEFAULT 'de' CHECK (preferred_language IN ('de', 'fr', 'it', 'en')),
  emergency_contact JSONB,
  
  -- Medical data classification
  medical_data_classification TEXT DEFAULT 'confidential' CHECK (
    medical_data_classification IN ('public', 'confidential', 'secret')
  ),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT age_check CHECK (date_of_birth <= CURRENT_DATE - INTERVAL '18 years'),
  CONSTRAINT otp_rate_limit CHECK (otp_requests_count <= 5),
  CONSTRAINT swiss_postal_code CHECK (postal_code ~ '^[1-9][0-9]{3}$')
);

-- 2. Unified form_sessions table (replaces multiple questionnaire tables)
CREATE TABLE form_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Form data (JSONB for flexibility)
  form_data JSONB NOT NULL DEFAULT '{}',
  current_step INTEGER DEFAULT 0,
  total_steps INTEGER DEFAULT 5,
  completion_percentage DECIMAL(5,2) DEFAULT 0.0,
  
  -- Status tracking
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired', 'abandoned')),
  eligibility_result JSONB,
  
  -- Session management
  session_token TEXT UNIQUE,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Swiss insurance specifics
  insurance_model TEXT CHECK (insurance_model IN ('standard', 'flex', 'hmo', 'hausarzt', 'telmed', 'self_pay')),
  gp_referral_required BOOLEAN DEFAULT false,
  
  -- Completion tracking
  submitted_at TIMESTAMPTZ,
  completion_time_seconds INTEGER,
  
  -- Recommendations and next steps
  recommendations JSONB,
  next_steps JSONB,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Payments table (Stripe integration with Swiss compliance)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  form_session_id UUID REFERENCES form_sessions(id) ON DELETE CASCADE,
  
  -- Stripe integration
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  stripe_session_id TEXT,
  idempotency_key TEXT UNIQUE NOT NULL,
  
  -- Payment details (CHF 350 for Swiss market)
  amount_cents INTEGER NOT NULL DEFAULT 35000, -- CHF 350.00
  currency TEXT NOT NULL DEFAULT 'CHF',
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'cancelled')),
  
  -- Swiss tax compliance
  billing_address JSONB NOT NULL,
  vat_included BOOLEAN DEFAULT true,
  vat_rate DECIMAL(5,4) DEFAULT 0.077, -- 7.7% Swiss VAT
  vat_amount_cents INTEGER GENERATED ALWAYS AS (
    CASE WHEN vat_included THEN ROUND(amount_cents * vat_rate / (1 + vat_rate)) ELSE 0 END
  ) STORED,
  net_amount_cents INTEGER GENERATED ALWAYS AS (amount_cents - vat_amount_cents) STORED,
  invoice_number TEXT UNIQUE,
  
  -- Processing details
  payment_method TEXT, -- 'card', 'twint', 'bank_transfer'
  processed_at TIMESTAMPTZ,
  failure_reason TEXT,
  failure_code TEXT,
  
  -- PCI DSS compliance (only store last 4 digits)
  last_four_digits TEXT,
  card_brand TEXT,
  card_exp_month INTEGER,
  card_exp_year INTEGER,
  
  -- Refund tracking
  refund_amount_cents INTEGER DEFAULT 0,
  refunded_at TIMESTAMPTZ,
  refund_reason TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Documents table (file management with Swiss healthcare compliance)
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  form_session_id UUID REFERENCES form_sessions(id) ON DELETE CASCADE,
  
  -- Document details
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Supabase storage path
  file_size_bytes INTEGER,
  mime_type TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK (
    document_type IN ('referral', 'invoice', 'report', 'upload', 'ecg', 'prescription', 'insurance_card')
  ),
  
  -- Generation details (for system-generated docs)
  template_used TEXT,
  generation_parameters JSONB,
  
  -- Swiss healthcare compliance
  patient_consent_required BOOLEAN DEFAULT true,
  medical_data_classification TEXT DEFAULT 'confidential' CHECK (
    medical_data_classification IN ('public', 'confidential', 'secret')
  ),
  retention_period_years INTEGER DEFAULT 10, -- Swiss healthcare law
  
  -- Access control
  is_public BOOLEAN DEFAULT false,
  access_expires_at TIMESTAMPTZ,
  download_count INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enhanced audit_events table (GDPR and Swiss DPA compliance)
CREATE TABLE audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Event details
  event_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  
  -- Event data
  event_data JSONB NOT NULL DEFAULT '{}',
  old_values JSONB,
  new_values JSONB,
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  
  -- Swiss/GDPR compliance
  legal_basis TEXT, -- GDPR Article 6 basis
  retention_category TEXT DEFAULT 'operational',
  anonymization_date DATE GENERATED ALWAYS AS (
    CASE 
      WHEN retention_category = 'operational' THEN (created_at::DATE + INTERVAL '7 years')::DATE
      WHEN retention_category = 'medical' THEN (created_at::DATE + INTERVAL '10 years')::DATE
      WHEN retention_category = 'financial' THEN (created_at::DATE + INTERVAL '10 years')::DATE
      ELSE (created_at::DATE + INTERVAL '7 years')::DATE
    END
  ) STORED,
  
  -- Metadata (immutable audit trail)
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create update timestamp triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_v2_updated_at 
  BEFORE UPDATE ON user_profiles_v2 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_form_sessions_updated_at 
  BEFORE UPDATE ON form_sessions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at 
  BEFORE UPDATE ON payments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at 
  BEFORE UPDATE ON documents 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Performance indexes
CREATE INDEX idx_user_profiles_v2_phone ON user_profiles_v2(phone) WHERE phone IS NOT NULL;
CREATE INDEX idx_user_profiles_v2_dob ON user_profiles_v2(date_of_birth);
CREATE INDEX idx_user_profiles_v2_insurance ON user_profiles_v2(health_insurance_number) WHERE health_insurance_number IS NOT NULL;

-- Form sessions indexes with JSONB optimization
CREATE INDEX idx_form_sessions_user_id ON form_sessions(user_id);
CREATE INDEX idx_form_sessions_status ON form_sessions(status);
CREATE INDEX idx_form_sessions_expires_at ON form_sessions(expires_at) WHERE status = 'active';
CREATE INDEX idx_form_sessions_token ON form_sessions(session_token) WHERE session_token IS NOT NULL;

-- JSONB indexes for form data queries
CREATE INDEX idx_form_sessions_eligibility ON form_sessions USING GIN((form_data->'eligibility_result'));
CREATE INDEX idx_form_sessions_insurance_model ON form_sessions(insurance_model) WHERE insurance_model IS NOT NULL;
CREATE INDEX idx_form_sessions_form_data ON form_sessions USING GIN(form_data);

-- Payment indexes
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_stripe_intent ON payments(stripe_payment_intent_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);
CREATE INDEX idx_payments_idempotency ON payments(idempotency_key);
CREATE INDEX idx_payments_invoice_number ON payments(invoice_number) WHERE invoice_number IS NOT NULL;

-- Documents indexes
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_session_id ON documents(form_session_id);
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_documents_medical_classification ON documents(medical_data_classification);
CREATE INDEX idx_documents_retention ON documents(retention_period_years, created_at);

-- Audit events indexes for compliance queries
CREATE INDEX idx_audit_events_user_id ON audit_events(user_id);
CREATE INDEX idx_audit_events_type ON audit_events(event_type);
CREATE INDEX idx_audit_events_entity ON audit_events(entity_type, entity_id);
CREATE INDEX idx_audit_events_created_at ON audit_events(created_at);
CREATE INDEX idx_audit_events_retention ON audit_events(retention_category, anonymization_date);

-- Enable RLS on all tables
ALTER TABLE user_profiles_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

-- Row Level Security Policies

-- user_profiles_v2 policies
CREATE POLICY "Users can view own profile v2" ON user_profiles_v2
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile v2" ON user_profiles_v2
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile v2" ON user_profiles_v2
  FOR INSERT WITH CHECK (auth.uid() = id);

-- form_sessions policies
CREATE POLICY "Users can access own form sessions" ON form_sessions
  FOR ALL USING (user_id = (SELECT auth.uid()));

-- payments policies (read-only for users)
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (user_id = (SELECT auth.uid()));

-- Service role can process payments
CREATE POLICY "Service role can manage payments" ON payments
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- documents policies with medical data protection
CREATE POLICY "Users can access own documents" ON documents
  FOR SELECT USING (
    user_id = (SELECT auth.uid()) AND
    (medical_data_classification = 'public' OR patient_consent_required = false OR 
     EXISTS(SELECT 1 FROM user_profiles_v2 WHERE id = auth.uid() AND consent_given = true))
  );

CREATE POLICY "Users can upload own documents" ON documents
  FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own documents" ON documents
  FOR UPDATE USING (user_id = (SELECT auth.uid()));

-- audit_events policies (read-only for users)
CREATE POLICY "Users can view own audit events" ON audit_events
  FOR SELECT USING (user_id = (SELECT auth.uid()));

-- Service role can log events
CREATE POLICY "Service role can log audit events" ON audit_events
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Insert initial audit event for schema deployment
INSERT INTO audit_events (
  event_type, entity_type, event_data, legal_basis, retention_category
) VALUES (
  'schema_v2_deployed', 'system', 
  jsonb_build_object(
    'migration', '009_schema_v2_consolidation.sql',
    'tables_created', 5,
    'performance_improvement', '75% table reduction'
  ),
  'GDPR Article 6(1)(f) - Legitimate interests',
  'operational'
);