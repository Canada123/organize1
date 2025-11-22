-- Business Logic Functions for v2.0 Schema
-- Swiss Holter-monitoring eligibility questionnaire logic

-- 1. Eligibility Assessment Function
CREATE OR REPLACE FUNCTION check_eligibility_v2(p_form_data JSONB)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
  v_eligible BOOLEAN := true;
  v_pathway TEXT := 'reimbursed';
  v_reason TEXT := '';
  v_score INTEGER := 0;
  v_contraindications JSONB;
  v_symptoms JSONB;
  v_insurance_status BOOLEAN;
  v_insurance_model TEXT;
  v_family_history BOOLEAN;
BEGIN
  -- Extract key eligibility factors
  v_contraindications := p_form_data->'contraindications';
  v_symptoms := p_form_data->'symptoms';
  v_insurance_status := COALESCE((p_form_data->>'has_insurance')::BOOLEAN, false);
  v_insurance_model := p_form_data->>'insurance_model';
  v_family_history := COALESCE((p_form_data->>'family_history')::BOOLEAN, false);
  
  -- Check absolute contraindications (stops flow entirely)
  IF v_contraindications->'pregnant' = 'true' OR
     v_contraindications->'pacemaker' = 'true' OR
     v_contraindications->'recent_hospitalization' = 'true' THEN
    v_eligible := false;
    v_pathway := 'excluded';
    v_reason := 'Contraindications present - GP consultation required';
    v_score := 0;
  ELSE
    -- Calculate eligibility score
    v_score := 0;
    
    -- Insurance status (30 points)
    IF v_insurance_status THEN
      v_score := v_score + 30;
    END IF;
    
    -- Symptom presence and severity (40 points max)
    IF v_symptoms IS NOT NULL AND jsonb_typeof(v_symptoms) = 'array' THEN
      v_score := v_score + LEAST(jsonb_array_length(v_symptoms) * 10, 40);
    END IF;
    
    -- Family history (10 points)
    IF v_family_history THEN
      v_score := v_score + 10;
    END IF;
    
    -- Age factor (20 points for >50, 10 points for >40)
    IF p_form_data->>'age' IS NOT NULL THEN
      DECLARE
        v_age INTEGER := (p_form_data->>'age')::INTEGER;
      BEGIN
        IF v_age > 50 THEN
          v_score := v_score + 20;
        ELSIF v_age > 40 THEN
          v_score := v_score + 10;
        END IF;
      END;
    END IF;
    
    -- Determine pathway based on insurance and symptoms
    IF v_insurance_status AND jsonb_array_length(COALESCE(v_symptoms, '[]'::JSONB)) > 0 THEN
      v_eligible := true;
      v_pathway := 'reimbursed';
      v_reason := 'Eligible for insurance reimbursement';
    ELSIF v_insurance_status AND jsonb_array_length(COALESCE(v_symptoms, '[]'::JSONB)) = 0 THEN
      v_eligible := true;
      v_pathway := 'self_pay_option';
      v_reason := 'Screening without symptoms - self-pay option available';
    ELSE
      v_eligible := true;
      v_pathway := 'self_pay';
      v_reason := 'Self-pay pathway available';
    END IF;
  END IF;
  
  -- Build comprehensive result
  v_result := jsonb_build_object(
    'eligible', v_eligible,
    'pathway', v_pathway,
    'reason', v_reason,
    'eligibility_score', v_score,
    'insurance_required', v_insurance_status,
    'insurance_model', COALESCE(v_insurance_model, 'none'),
    'symptoms_present', COALESCE(jsonb_array_length(v_symptoms), 0) > 0,
    'symptom_count', COALESCE(jsonb_array_length(v_symptoms), 0),
    'family_history', v_family_history,
    'contraindications_present', NOT v_eligible AND v_pathway = 'excluded',
    'next_steps', CASE v_pathway
      WHEN 'excluded' THEN jsonb_build_array('contact_gp', 'emergency_if_severe')
      WHEN 'reimbursed' THEN CASE v_insurance_model
        WHEN 'standard' THEN jsonb_build_array('choose_gp_type', 'collect_gp_details')
        WHEN 'flex' THEN jsonb_build_array('choose_gp_type', 'collect_gp_details')
        WHEN 'hmo' THEN jsonb_build_array('collect_assigned_gp_details')
        WHEN 'hausarzt' THEN jsonb_build_array('collect_assigned_gp_details')
        WHEN 'telmed' THEN jsonb_build_array('call_telmed_hotline')
        ELSE jsonb_build_array('collect_insurance_details')
      END
      WHEN 'self_pay_option' THEN jsonb_build_array('choose_payment_method')
      WHEN 'self_pay' THEN jsonb_build_array('collect_phone', 'collect_address', 'process_payment')
      ELSE jsonb_build_array()
    END,
    'recommendations', CASE 
      WHEN v_score >= 70 THEN 'High priority for Holter monitoring'
      WHEN v_score >= 40 THEN 'Moderate priority for monitoring'
      WHEN v_score >= 20 THEN 'Low priority but may benefit from monitoring'
      ELSE 'Consider alternative assessment methods'
    END
  );
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Secure Form Progress Management
CREATE OR REPLACE FUNCTION save_form_progress_v2(
  p_session_id UUID,
  p_step INTEGER,
  p_data JSONB,
  p_user_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_session RECORD;
  v_merged_data JSONB;
  v_eligibility_result JSONB;
  v_completion_percentage DECIMAL(5,2);
BEGIN
  -- Get current session with validation
  SELECT * INTO v_session
  FROM form_sessions
  WHERE id = p_session_id 
  AND (user_id = p_user_id OR p_user_id IS NULL)
  AND status IN ('active', 'completed');
  
  IF NOT FOUND THEN
    -- Log access attempt
    INSERT INTO audit_events (
      user_id, event_type, entity_type, entity_id, event_data
    ) VALUES (
      p_user_id, 'form_access_denied', 'form_session', p_session_id,
      jsonb_build_object('reason', 'Session not found or access denied')
    );
    
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Session not found or access denied'
    );
  END IF;
  
  -- Check if session expired
  IF v_session.expires_at < NOW() THEN
    -- Update session status
    UPDATE form_sessions
    SET status = 'expired'
    WHERE id = p_session_id;
    
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Session expired',
      'session_expired', true
    );
  END IF;
  
  -- Merge new data with existing (deep merge)
  v_merged_data := v_session.form_data || p_data;
  
  -- Calculate completion percentage
  v_completion_percentage := LEAST((p_step::DECIMAL / v_session.total_steps) * 100, 100);
  
  -- Run eligibility check if on eligibility step (step 1)
  IF p_step = 1 THEN
    v_eligibility_result := check_eligibility_v2(v_merged_data);
    v_merged_data := v_merged_data || jsonb_build_object('eligibility_result', v_eligibility_result);
  END IF;
  
  -- Update session with new data
  UPDATE form_sessions
  SET 
    form_data = v_merged_data,
    current_step = p_step,
    completion_percentage = v_completion_percentage,
    last_activity_at = NOW(),
    eligibility_result = COALESCE(v_eligibility_result, eligibility_result),
    status = CASE 
      WHEN p_step >= total_steps THEN 'completed'
      ELSE status
    END,
    submitted_at = CASE 
      WHEN p_step >= total_steps AND submitted_at IS NULL THEN NOW()
      ELSE submitted_at
    END
  WHERE id = p_session_id;
  
  -- Log progress with detailed context
  INSERT INTO audit_events (
    user_id, event_type, entity_type, entity_id, event_data
  ) VALUES (
    v_session.user_id, 'form_progress_saved', 'form_session', p_session_id,
    jsonb_build_object(
      'step', p_step,
      'completion_percentage', v_completion_percentage,
      'data_keys', array_agg(key) FROM jsonb_object_keys(p_data) AS key,
      'eligibility_checked', p_step = 1
    )
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'session_id', p_session_id,
    'current_step', p_step,
    'completion_percentage', v_completion_percentage,
    'eligibility_result', v_eligibility_result,
    'session_status', CASE WHEN p_step >= v_session.total_steps THEN 'completed' ELSE 'active' END
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Secure Session Creation
CREATE OR REPLACE FUNCTION create_secure_form_session(
  p_user_id UUID,
  p_initial_data JSONB DEFAULT '{}',
  p_session_type TEXT DEFAULT 'eligibility_questionnaire'
)
RETURNS JSONB AS $$
DECLARE
  v_session_id UUID;
  v_session_token TEXT;
  v_expires_at TIMESTAMPTZ;
BEGIN
  -- Generate cryptographically secure session token
  v_session_token := encode(gen_random_bytes(32), 'base64');
  v_expires_at := NOW() + INTERVAL '7 days';
  
  -- Create new session
  INSERT INTO form_sessions (
    user_id, form_data, session_token, expires_at, status
  ) VALUES (
    p_user_id, p_initial_data, v_session_token, v_expires_at, 'active'
  ) RETURNING id INTO v_session_id;
  
  -- Log session creation
  INSERT INTO audit_events (
    user_id, event_type, entity_type, entity_id, event_data
  ) VALUES (
    p_user_id, 'session_created', 'form_session', v_session_id,
    jsonb_build_object(
      'session_type', p_session_type,
      'expires_at', v_expires_at,
      'initial_data_keys', array_agg(key) FROM jsonb_object_keys(p_initial_data) AS key
    )
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'session_id', v_session_id,
    'session_token', v_session_token,
    'expires_at', v_expires_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. PCI DSS Compliant Payment Processing
CREATE OR REPLACE FUNCTION process_payment_securely(
  p_user_id UUID,
  p_form_session_id UUID,
  p_stripe_payment_intent_id TEXT,
  p_amount_cents INTEGER,
  p_billing_address JSONB,
  p_idempotency_key TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_payment_id UUID;
  v_existing_payment RECORD;
  v_net_amount INTEGER;
  v_vat_amount INTEGER;
  v_invoice_number TEXT;
BEGIN
  -- Check for idempotency (prevent duplicate charges)
  SELECT * INTO v_existing_payment
  FROM payments
  WHERE idempotency_key = p_idempotency_key;
  
  IF FOUND THEN
    -- Return existing payment result
    RETURN jsonb_build_object(
      'success', (v_existing_payment.status = 'succeeded'),
      'payment_id', v_existing_payment.id,
      'duplicate_request', true,
      'status', v_existing_payment.status,
      'error_message', v_existing_payment.failure_reason
    );
  END IF;
  
  -- Validate amount (CHF 350.00 = 35000 cents)
  IF p_amount_cents != 35000 THEN
    -- Log invalid amount attempt
    INSERT INTO audit_events (
      user_id, event_type, entity_type, event_data
    ) VALUES (
      p_user_id, 'payment_validation_failed', 'payment',
      jsonb_build_object(
        'reason', 'invalid_amount',
        'attempted_amount', p_amount_cents,
        'expected_amount', 35000
      )
    );
    
    RETURN jsonb_build_object(
      'success', false,
      'error_message', 'Invalid amount. Expected CHF 350.00'
    );
  END IF;
  
  -- Calculate Swiss VAT (7.7%)
  v_vat_amount := ROUND(p_amount_cents * 0.077 / 1.077);
  v_net_amount := p_amount_cents - v_vat_amount;
  
  -- Generate invoice number
  v_invoice_number := 'SKIIN-' || TO_CHAR(NOW(), 'YYYY') || '-' || 
                      LPAD(nextval('invoice_sequence')::TEXT, 6, '0');
  
  -- Create payment record
  INSERT INTO payments (
    user_id, form_session_id, stripe_payment_intent_id,
    amount_cents, billing_address, idempotency_key, 
    status, invoice_number, vat_included
  ) VALUES (
    p_user_id, p_form_session_id, p_stripe_payment_intent_id,
    p_amount_cents, p_billing_address, p_idempotency_key,
    'pending', v_invoice_number, true
  ) RETURNING id INTO v_payment_id;
  
  -- Log payment creation with PCI DSS compliance
  INSERT INTO audit_events (
    user_id, event_type, entity_type, entity_id, event_data,
    legal_basis, retention_category
  ) VALUES (
    p_user_id, 'payment_created', 'payment', v_payment_id,
    jsonb_build_object(
      'amount_cents', p_amount_cents,
      'currency', 'CHF',
      'invoice_number', v_invoice_number,
      'stripe_payment_intent_id', p_stripe_payment_intent_id,
      'vat_amount_cents', v_vat_amount,
      'net_amount_cents', v_net_amount
    ),
    'GDPR Article 6(1)(b) - Contract performance',
    'financial'
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'payment_id', v_payment_id,
    'invoice_number', v_invoice_number,
    'amount_breakdown', jsonb_build_object(
      'total_cents', p_amount_cents,
      'net_cents', v_net_amount,
      'vat_cents', v_vat_amount,
      'vat_rate', 0.077,
      'currency', 'CHF'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. GDPR Data Export Function
CREATE OR REPLACE FUNCTION export_user_data_v2(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_user_profile JSONB;
  v_form_sessions JSONB;
  v_payments JSONB;
  v_documents JSONB;
  v_audit_events JSONB;
  v_export JSONB;
BEGIN
  -- Export user profile (anonymize sensitive data)
  SELECT jsonb_build_object(
    'id', id,
    'date_of_birth', date_of_birth,
    'created_at', created_at,
    'consent_given', consent_given,
    'consent_given_at', consent_given_at,
    'preferred_language', preferred_language,
    'medical_data_classification', medical_data_classification
  ) INTO v_user_profile
  FROM user_profiles_v2
  WHERE id = p_user_id;
  
  -- Export form sessions (remove PII from form_data)
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', id,
      'current_step', current_step,
      'completion_percentage', completion_percentage,
      'status', status,
      'eligibility_result', eligibility_result,
      'insurance_model', insurance_model,
      'created_at', created_at,
      'completed_at', submitted_at
    )
  ) INTO v_form_sessions
  FROM form_sessions
  WHERE user_id = p_user_id;
  
  -- Export payment information (PCI DSS compliant)
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', id,
      'amount_cents', amount_cents,
      'currency', currency,
      'status', status,
      'invoice_number', invoice_number,
      'payment_method', payment_method,
      'processed_at', processed_at,
      'created_at', created_at
    )
  ) INTO v_payments
  FROM payments
  WHERE user_id = p_user_id;
  
  -- Export document metadata (not file contents for security)
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', id,
      'filename', filename,
      'document_type', document_type,
      'file_size_bytes', file_size_bytes,
      'created_at', created_at,
      'medical_data_classification', medical_data_classification
    )
  ) INTO v_documents
  FROM documents
  WHERE user_id = p_user_id;
  
  -- Export audit events (last 2 years for performance)
  SELECT jsonb_agg(
    jsonb_build_object(
      'event_type', event_type,
      'entity_type', entity_type,
      'created_at', created_at,
      'legal_basis', legal_basis,
      'retention_category', retention_category
    )
  ) INTO v_audit_events
  FROM audit_events
  WHERE user_id = p_user_id
  AND created_at > NOW() - INTERVAL '2 years';
  
  -- Build complete export
  v_export := jsonb_build_object(
    'export_metadata', jsonb_build_object(
      'export_date', NOW(),
      'user_id', p_user_id,
      'data_controller', 'Myant Inc.',
      'legal_basis', 'GDPR Article 15 - Right of Access',
      'export_format', 'JSON',
      'data_retention_policy', '7 years'
    ),
    'user_profile', v_user_profile,
    'form_sessions', COALESCE(v_form_sessions, '[]'::JSONB),
    'payments', COALESCE(v_payments, '[]'::JSONB),
    'documents', COALESCE(v_documents, '[]'::JSONB),
    'audit_events', COALESCE(v_audit_events, '[]'::JSONB)
  );
  
  -- Log export request
  INSERT INTO audit_events (
    user_id, event_type, entity_type, entity_id, event_data,
    legal_basis, retention_category
  ) VALUES (
    p_user_id, 'data_export_requested', 'user_profile', p_user_id,
    jsonb_build_object(
      'export_size_kb', pg_column_size(v_export) / 1024,
      'records_exported', jsonb_build_object(
        'form_sessions', COALESCE(jsonb_array_length(v_form_sessions), 0),
        'payments', COALESCE(jsonb_array_length(v_payments), 0),
        'documents', COALESCE(jsonb_array_length(v_documents), 0),
        'audit_events', COALESCE(jsonb_array_length(v_audit_events), 0)
      )
    ),
    'GDPR Article 15 - Right of Access',
    'operational'
  );
  
  RETURN v_export;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Session Cleanup and Maintenance
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
  v_cleanup_count INTEGER;
BEGIN
  -- Update expired sessions
  UPDATE form_sessions
  SET status = 'expired'
  WHERE status = 'active'
  AND expires_at < NOW();
  
  GET DIAGNOSTICS v_cleanup_count = ROW_COUNT;
  
  -- Log cleanup operation
  INSERT INTO audit_events (
    event_type, entity_type, event_data, retention_category
  ) VALUES (
    'session_cleanup', 'system',
    jsonb_build_object(
      'expired_sessions_count', v_cleanup_count,
      'cleanup_timestamp', NOW()
    ),
    'operational'
  );
  
  RETURN v_cleanup_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. User Profile Creation Helper
CREATE OR REPLACE FUNCTION create_user_profile_v2(
  p_user_id UUID,
  p_date_of_birth DATE,
  p_phone TEXT DEFAULT NULL,
  p_address JSONB DEFAULT NULL,
  p_preferred_language TEXT DEFAULT 'de'
)
RETURNS JSONB AS $$
DECLARE
  v_profile_exists BOOLEAN;
BEGIN
  -- Check if profile already exists
  SELECT EXISTS(SELECT 1 FROM user_profiles_v2 WHERE id = p_user_id) INTO v_profile_exists;
  
  IF v_profile_exists THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Profile already exists'
    );
  END IF;
  
  -- Validate age (must be 18+)
  IF p_date_of_birth > CURRENT_DATE - INTERVAL '18 years' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Must be 18 years or older'
    );
  END IF;
  
  -- Insert new profile
  INSERT INTO user_profiles_v2 (
    id, date_of_birth, phone, 
    street_address, postal_code, city, canton,
    preferred_language, consent_given, consent_given_at
  ) VALUES (
    p_user_id, p_date_of_birth, p_phone,
    p_address->>'street_address',
    p_address->>'postal_code', 
    p_address->>'city',
    p_address->>'canton',
    p_preferred_language, true, NOW()
  );
  
  -- Log profile creation
  INSERT INTO audit_events (
    user_id, event_type, entity_type, entity_id, event_data,
    legal_basis, retention_category
  ) VALUES (
    p_user_id, 'user_profile_created', 'user_profile', p_user_id,
    jsonb_build_object(
      'preferred_language', p_preferred_language,
      'has_phone', p_phone IS NOT NULL,
      'has_address', p_address IS NOT NULL
    ),
    'GDPR Article 6(1)(b) - Contract performance',
    'operational'
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'user_id', p_user_id,
    'profile_created', true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create sequence for invoice numbers
CREATE SEQUENCE IF NOT EXISTS invoice_sequence START 1000;

-- Create scheduled task for session cleanup (runs daily)
-- Note: This would typically be set up as a cron job or pg_cron extension
CREATE OR REPLACE FUNCTION schedule_daily_cleanup()
RETURNS void AS $$
BEGIN
  -- This function would be called by a scheduler
  PERFORM cleanup_expired_sessions();
END;
$$ LANGUAGE plpgsql;

-- Insert initial audit event for business logic deployment
INSERT INTO audit_events (
  event_type, entity_type, event_data, legal_basis, retention_category
) VALUES (
  'business_logic_deployed', 'system',
  jsonb_build_object(
    'migration', '010_business_logic_functions.sql',
    'functions_created', 7,
    'features', jsonb_build_array(
      'eligibility_assessment',
      'secure_form_management',
      'pci_dss_payment_processing',
      'gdpr_data_export',
      'automated_maintenance'
    )
  ),
  'GDPR Article 6(1)(f) - Legitimate interests',
  'operational'
);