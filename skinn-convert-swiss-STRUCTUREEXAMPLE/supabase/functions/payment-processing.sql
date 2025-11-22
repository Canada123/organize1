-- ==========================================
-- PAYMENT PROCESSING FUNCTIONS (STRIPE INTEGRATION)
-- ==========================================
-- VERSION: 1.0
-- CREATED: 2025-08-19
-- PURPOSE: Secure payment processing functions for self-pay users
--          with Stripe integration and Swiss payment compliance
-- ==========================================

-- ==========================================
-- 1. PAYMENT INTENT CREATION
-- ==========================================

-- Create payment intent for self-pay user
CREATE OR REPLACE FUNCTION public.create_payment_intent(
    session_token_input UUID,
    package_type_input TEXT,
    currency_input TEXT DEFAULT 'CHF'
)
RETURNS TABLE(
    success BOOLEAN,
    payment_intent_id TEXT,
    client_secret TEXT,
    amount_cents INTEGER,
    currency TEXT,
    message TEXT
) AS $$
DECLARE
    session_record RECORD;
    user_record RECORD;
    package_price INTEGER;
    payment_record RECORD;
    stripe_customer_id TEXT;
    new_payment_id UUID;
BEGIN
    -- Validate package type and get price
    CASE package_type_input
        WHEN '3_day' THEN package_price := 12000; -- 120.00 CHF
        WHEN '5_day' THEN package_price := 15000; -- 150.00 CHF  
        WHEN '10_day' THEN package_price := 18000; -- 180.00 CHF
        ELSE 
            RETURN QUERY SELECT FALSE, NULL::TEXT, NULL::TEXT, 0, currency_input, 'Invalid package type';
            RETURN;
    END CASE;
    
    -- Validate currency (Swiss law compliance)
    IF currency_input != 'CHF' THEN
        RETURN QUERY SELECT FALSE, NULL::TEXT, NULL::TEXT, 0, currency_input, 'Only CHF currency is supported';
        RETURN;
    END IF;
    
    -- Get session
    SELECT * INTO session_record
    FROM public.questionnaire_sessions
    WHERE session_token = session_token_input
    AND status = 'in_progress'
    AND expires_at > NOW();
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, NULL::TEXT, NULL::TEXT, 0, currency_input, 'Session not found or expired';
        RETURN;
    END IF;
    
    -- Get user profile
    SELECT * INTO user_record
    FROM public.user_profiles
    WHERE id = session_record.user_id;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, NULL::TEXT, NULL::TEXT, 0, currency_input, 'User profile required for payment';
        RETURN;
    END IF;
    
    -- Check if payment already exists for this session
    SELECT * INTO payment_record
    FROM public.payment_transactions
    WHERE session_id = session_record.id
    AND status IN ('pending', 'processing')
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF FOUND THEN
        RETURN QUERY SELECT 
            FALSE, 
            payment_record.stripe_payment_intent_id, 
            NULL::TEXT, 
            payment_record.amount_cents, 
            payment_record.currency,
            'Payment already in progress for this session';
        RETURN;
    END IF;
    
    -- Check if user has insurance (should use insurance path instead)
    IF EXISTS (SELECT 1 FROM public.user_insurance WHERE user_id = session_record.user_id) THEN
        RETURN QUERY SELECT FALSE, NULL::TEXT, NULL::TEXT, 0, currency_input, 'Insurance coverage detected. Please use insurance pathway';
        RETURN;
    END IF;
    
    -- Create payment record first (will be updated with Stripe data)
    new_payment_id := uuid_generate_v4();
    
    INSERT INTO public.payment_transactions (
        id, session_id, user_id, amount_cents, currency, 
        payment_type, package_type, package_price_cents, status
    ) VALUES (
        new_payment_id, session_record.id, session_record.user_id, 
        package_price, currency_input, 'self_pay', package_type_input, 
        package_price, 'pending'
    );
    
    -- TODO: Integration with Stripe API
    -- This would create a PaymentIntent via Stripe API
    -- For now, we'll simulate the response
    
    /*
    EXAMPLE STRIPE INTEGRATION:
    
    POST https://api.stripe.com/v1/payment_intents
    {
        "amount": package_price,
        "currency": "chf",
        "customer": stripe_customer_id,
        "metadata": {
            "session_id": session_record.id,
            "user_id": session_record.user_id,
            "package_type": package_type_input
        },
        "payment_method_types": ["card", "twint", "postfinance_card"],
        "setup_future_usage": "off_session"
    }
    */
    
    -- For development, create mock Stripe data
    stripe_customer_id := 'cus_mock_' || substr(session_record.user_id::text, 1, 8);
    
    -- Update payment record with mock Stripe data
    UPDATE public.payment_transactions
    SET 
        stripe_payment_intent_id = 'pi_mock_' || substr(new_payment_id::text, 1, 16),
        stripe_customer_id = stripe_customer_id,
        updated_at = NOW()
    WHERE id = new_payment_id;
    
    -- Log payment intent creation
    PERFORM public.create_audit_log(
        'payment_intent_created',
        'payment_transactions',
        new_payment_id,
        NULL,
        jsonb_build_object(
            'amount_cents', package_price,
            'package_type', package_type_input,
            'currency', currency_input
        )
    );
    
    RETURN QUERY SELECT 
        TRUE, 
        'pi_mock_' || substr(new_payment_id::text, 1, 16),
        'pi_mock_' || substr(new_payment_id::text, 1, 16) || '_secret_mock',
        package_price,
        currency_input,
        'Payment intent created successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 2. PAYMENT CONFIRMATION & WEBHOOK HANDLING
-- ==========================================

-- Handle Stripe webhook events (payment confirmation)
CREATE OR REPLACE FUNCTION public.handle_stripe_webhook(
    event_type TEXT,
    payment_intent_id TEXT,
    payment_method_id TEXT DEFAULT NULL,
    customer_id TEXT DEFAULT NULL,
    status TEXT DEFAULT NULL,
    failure_reason TEXT DEFAULT NULL
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT,
    session_id UUID,
    user_id UUID
) AS $$
DECLARE
    payment_record RECORD;
    session_record RECORD;
    new_status TEXT;
BEGIN
    -- Find payment record
    SELECT * INTO payment_record
    FROM public.payment_transactions
    WHERE stripe_payment_intent_id = payment_intent_id;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, 'Payment not found', NULL::UUID, NULL::UUID;
        RETURN;
    END IF;
    
    -- Get session
    SELECT * INTO session_record
    FROM public.questionnaire_sessions
    WHERE id = payment_record.session_id;
    
    -- Handle different webhook events
    CASE event_type
        WHEN 'payment_intent.succeeded' THEN
            new_status := 'succeeded';
            
            UPDATE public.payment_transactions
            SET 
                status = 'succeeded',
                stripe_payment_method_id = payment_method_id,
                paid_at = NOW(),
                updated_at = NOW()
            WHERE id = payment_record.id;
            
            -- Mark session as ready to proceed (payment completed)
            UPDATE public.questionnaire_sessions
            SET last_activity = NOW()
            WHERE id = payment_record.session_id;
            
            -- Log successful payment
            PERFORM public.create_audit_log(
                'payment_succeeded',
                'payment_transactions',
                payment_record.id,
                to_jsonb(payment_record),
                jsonb_build_object('status', 'succeeded', 'paid_at', NOW())
            );
            
        WHEN 'payment_intent.payment_failed' THEN
            new_status := 'failed';
            
            UPDATE public.payment_transactions
            SET 
                status = 'failed',
                failure_reason = failure_reason,
                updated_at = NOW()
            WHERE id = payment_record.id;
            
            -- Log failed payment
            PERFORM public.create_audit_log(
                'payment_failed',
                'payment_transactions',
                payment_record.id,
                to_jsonb(payment_record),
                jsonb_build_object('status', 'failed', 'failure_reason', failure_reason)
            );
            
        WHEN 'payment_intent.canceled' THEN
            new_status := 'canceled';
            
            UPDATE public.payment_transactions
            SET 
                status = 'canceled',
                updated_at = NOW()
            WHERE id = payment_record.id;
            
            -- Log canceled payment
            PERFORM public.create_audit_log(
                'payment_canceled',
                'payment_transactions',
                payment_record.id,
                to_jsonb(payment_record),
                jsonb_build_object('status', 'canceled')
            );
            
        WHEN 'payment_intent.processing' THEN
            new_status := 'processing';
            
            UPDATE public.payment_transactions
            SET 
                status = 'processing',
                updated_at = NOW()
            WHERE id = payment_record.id;
            
        ELSE
            RETURN QUERY SELECT FALSE, 'Unhandled webhook event type', payment_record.session_id, payment_record.user_id;
            RETURN;
    END CASE;
    
    RETURN QUERY SELECT TRUE, 'Webhook processed successfully', payment_record.session_id, payment_record.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 3. PAYMENT STATUS & VALIDATION
-- ==========================================

-- Get payment status for a session
CREATE OR REPLACE FUNCTION public.get_payment_status(
    session_token_input UUID
)
RETURNS TABLE(
    payment_required BOOLEAN,
    payment_status TEXT,
    payment_intent_id TEXT,
    amount_cents INTEGER,
    currency TEXT,
    package_type TEXT,
    created_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    failure_reason TEXT
) AS $$
DECLARE
    session_record RECORD;
    payment_record RECORD;
    has_insurance BOOLEAN := FALSE;
BEGIN
    -- Get session
    SELECT * INTO session_record
    FROM public.questionnaire_sessions
    WHERE session_token = session_token_input
    AND status IN ('in_progress', 'completed');
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, 'session_not_found', NULL::TEXT, 0, 'CHF', NULL::TEXT, NULL::TIMESTAMPTZ, NULL::TIMESTAMPTZ, 'Session not found';
        RETURN;
    END IF;
    
    -- Check if user has insurance
    IF session_record.user_id IS NOT NULL THEN
        SELECT EXISTS(SELECT 1 FROM public.user_insurance WHERE user_id = session_record.user_id) INTO has_insurance;
    END IF;
    
    -- If user has insurance, payment is not required
    IF has_insurance THEN
        RETURN QUERY SELECT FALSE, 'insurance_covered', NULL::TEXT, 0, 'CHF', NULL::TEXT, NULL::TIMESTAMPTZ, NULL::TIMESTAMPTZ, NULL::TEXT;
        RETURN;
    END IF;
    
    -- Get payment record
    SELECT * INTO payment_record
    FROM public.payment_transactions
    WHERE session_id = session_record.id
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT TRUE, 'no_payment_started', NULL::TEXT, 0, 'CHF', NULL::TEXT, NULL::TIMESTAMPTZ, NULL::TIMESTAMPTZ, NULL::TEXT;
        RETURN;
    END IF;
    
    RETURN QUERY SELECT 
        payment_record.status NOT IN ('succeeded', 'refunded'),
        payment_record.status,
        payment_record.stripe_payment_intent_id,
        payment_record.amount_cents,
        payment_record.currency,
        payment_record.package_type,
        payment_record.created_at,
        payment_record.paid_at,
        payment_record.failure_reason;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Validate payment before proceeding to next stage
CREATE OR REPLACE FUNCTION public.validate_payment_for_progression(
    session_token_input UUID
)
RETURNS TABLE(
    can_proceed BOOLEAN,
    reason TEXT,
    payment_status TEXT
) AS $$
DECLARE
    session_record RECORD;
    payment_record RECORD;
    insurance_record RECORD;
BEGIN
    -- Get session
    SELECT * INTO session_record
    FROM public.questionnaire_sessions
    WHERE session_token = session_token_input
    AND status = 'in_progress';
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, 'Session not found or not active', 'unknown';
        RETURN;
    END IF;
    
    -- Check insurance first
    IF session_record.user_id IS NOT NULL THEN
        SELECT * INTO insurance_record
        FROM public.user_insurance
        WHERE user_id = session_record.user_id
        AND verification_status = 'verified';
        
        IF FOUND THEN
            RETURN QUERY SELECT TRUE, 'Insurance coverage verified', 'insurance_covered';
            RETURN;
        END IF;
    END IF;
    
    -- Check payment status
    SELECT * INTO payment_record
    FROM public.payment_transactions
    WHERE session_id = session_record.id
    AND status = 'succeeded'
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF FOUND THEN
        RETURN QUERY SELECT TRUE, 'Payment completed successfully', 'succeeded';
        RETURN;
    END IF;
    
    -- Check for pending/processing payment
    SELECT * INTO payment_record
    FROM public.payment_transactions
    WHERE session_id = session_record.id
    AND status IN ('pending', 'processing')
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF FOUND THEN
        RETURN QUERY SELECT FALSE, 'Payment is still processing', payment_record.status;
        RETURN;
    END IF;
    
    -- No valid payment or insurance
    RETURN QUERY SELECT FALSE, 'Payment required to proceed', 'payment_required';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 4. REFUND PROCESSING
-- ==========================================

-- Initiate refund for a payment
CREATE OR REPLACE FUNCTION public.initiate_refund(
    payment_id UUID,
    refund_reason TEXT,
    refund_amount_cents INTEGER DEFAULT NULL -- NULL for full refund
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT,
    refund_id TEXT,
    refund_amount INTEGER
) AS $$
DECLARE
    payment_record RECORD;
    actual_refund_amount INTEGER;
    mock_refund_id TEXT;
BEGIN
    -- Get payment record
    SELECT * INTO payment_record
    FROM public.payment_transactions
    WHERE id = payment_id
    AND status = 'succeeded';
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, 'Payment not found or not eligible for refund', NULL::TEXT, 0;
        RETURN;
    END IF;
    
    -- Calculate refund amount
    IF refund_amount_cents IS NULL THEN
        actual_refund_amount := payment_record.amount_cents;
    ELSE
        actual_refund_amount := LEAST(refund_amount_cents, payment_record.amount_cents);
    END IF;
    
    -- TODO: Integration with Stripe Refund API
    -- This would create a refund via Stripe API
    
    /*
    EXAMPLE STRIPE REFUND:
    
    POST https://api.stripe.com/v1/refunds
    {
        "payment_intent": payment_record.stripe_payment_intent_id,
        "amount": actual_refund_amount,
        "reason": refund_reason,
        "metadata": {
            "original_payment_id": payment_id,
            "refund_reason": refund_reason
        }
    }
    */
    
    -- For development, create mock refund
    mock_refund_id := 're_mock_' || substr(payment_id::text, 1, 16);
    
    -- Update payment record
    UPDATE public.payment_transactions
    SET 
        status = 'refunded',
        refunded_at = NOW(),
        updated_at = NOW()
    WHERE id = payment_id;
    
    -- Log refund
    PERFORM public.create_audit_log(
        'refund_initiated',
        'payment_transactions',
        payment_id,
        to_jsonb(payment_record),
        jsonb_build_object(
            'refund_amount', actual_refund_amount,
            'refund_reason', refund_reason,
            'refund_id', mock_refund_id
        )
    );
    
    RETURN QUERY SELECT TRUE, 'Refund initiated successfully', mock_refund_id, actual_refund_amount;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 5. PAYMENT ANALYTICS & REPORTING
-- ==========================================

-- Get payment statistics
CREATE OR REPLACE FUNCTION public.get_payment_statistics(
    start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
    total_attempts BIGINT,
    successful_payments BIGINT,
    failed_payments BIGINT,
    canceled_payments BIGINT,
    refunded_payments BIGINT,
    total_revenue_cents BIGINT,
    avg_payment_amount_cents NUMERIC,
    success_rate DECIMAL,
    package_breakdown JSONB
) AS $$
DECLARE
    package_stats JSONB;
BEGIN
    -- Calculate package type breakdown
    SELECT jsonb_object_agg(
        package_type,
        jsonb_build_object(
            'count', count,
            'revenue_cents', revenue
        )
    ) INTO package_stats
    FROM (
        SELECT 
            package_type,
            COUNT(*) as count,
            SUM(amount_cents) FILTER (WHERE status = 'succeeded') as revenue
        FROM public.payment_transactions
        WHERE created_at::DATE BETWEEN start_date AND end_date
        GROUP BY package_type
    ) pkg;
    
    -- Return main statistics
    RETURN QUERY
    SELECT 
        COUNT(*) as total_attempts,
        COUNT(*) FILTER (WHERE status = 'succeeded') as successful,
        COUNT(*) FILTER (WHERE status = 'failed') as failed,
        COUNT(*) FILTER (WHERE status = 'canceled') as canceled,
        COUNT(*) FILTER (WHERE status = 'refunded') as refunded,
        COALESCE(SUM(amount_cents) FILTER (WHERE status = 'succeeded'), 0) as revenue,
        ROUND(AVG(amount_cents) FILTER (WHERE status = 'succeeded'), 2) as avg_amount,
        CASE 
            WHEN COUNT(*) > 0 THEN 
                ROUND((COUNT(*) FILTER (WHERE status = 'succeeded')::DECIMAL / COUNT(*)::DECIMAL) * 100, 2)
            ELSE 0
        END as success_rate,
        COALESCE(package_stats, '{}'::JSONB) as package_breakdown
    FROM public.payment_transactions
    WHERE created_at::DATE BETWEEN start_date AND end_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get payment history for a user
CREATE OR REPLACE FUNCTION public.get_user_payment_history(
    user_uuid UUID DEFAULT auth.uid()
)
RETURNS TABLE(
    payment_id UUID,
    amount_cents INTEGER,
    currency TEXT,
    package_type TEXT,
    status TEXT,
    created_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    failure_reason TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pt.id,
        pt.amount_cents,
        pt.currency,
        pt.package_type,
        pt.status,
        pt.created_at,
        pt.paid_at,
        pt.failure_reason
    FROM public.payment_transactions pt
    WHERE pt.user_id = user_uuid
    ORDER BY pt.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 6. SWISS PAYMENT COMPLIANCE
-- ==========================================

-- Validate Swiss payment compliance
CREATE OR REPLACE FUNCTION public.validate_swiss_payment_compliance(
    amount_cents INTEGER,
    currency TEXT,
    customer_country TEXT DEFAULT 'CH'
)
RETURNS TABLE(
    is_compliant BOOLEAN,
    compliance_notes TEXT[],
    required_disclosures TEXT[]
) AS $$
DECLARE
    notes TEXT[] := ARRAY[]::TEXT[];
    disclosures TEXT[] := ARRAY[]::TEXT[];
    compliant BOOLEAN := TRUE;
BEGIN
    -- Currency validation
    IF currency != 'CHF' THEN
        compliant := FALSE;
        notes := array_append(notes, 'Only CHF currency accepted for Swiss customers');
    END IF;
    
    -- Amount validation (minimum 50 CHF, maximum 500 CHF for medical services)
    IF amount_cents < 5000 THEN -- 50 CHF
        compliant := FALSE;
        notes := array_append(notes, 'Minimum payment amount is 50 CHF');
    END IF;
    
    IF amount_cents > 50000 THEN -- 500 CHF
        compliant := FALSE;
        notes := array_append(notes, 'Maximum payment amount is 500 CHF for medical services');
    END IF;
    
    -- Swiss customer requirements
    IF customer_country = 'CH' THEN
        disclosures := array_append(disclosures, 'Payment processing complies with Swiss Data Protection Act');
        disclosures := array_append(disclosures, 'Medical service payments may be tax deductible');
        disclosures := array_append(disclosures, '14-day cooling-off period applies per Swiss Consumer Protection Act');
    END IF;
    
    -- Medical service specific requirements
    disclosures := array_append(disclosures, 'This is payment for a medical screening service');
    disclosures := array_append(disclosures, 'Service is provided by licensed healthcare professionals');
    
    RETURN QUERY SELECT compliant, notes, disclosures;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- COMMENTS FOR DOCUMENTATION
-- ==========================================

COMMENT ON FUNCTION public.create_payment_intent(UUID, TEXT, TEXT) IS 
'Creates Stripe payment intent for self-pay users with Swiss compliance validation';

COMMENT ON FUNCTION public.handle_stripe_webhook(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) IS 
'Processes Stripe webhook events to update payment status and trigger business logic';

COMMENT ON FUNCTION public.get_payment_status(UUID) IS 
'Returns current payment status and requirements for a questionnaire session';

COMMENT ON FUNCTION public.validate_payment_for_progression(UUID) IS 
'Validates payment or insurance coverage before allowing progression to next stage';

COMMENT ON FUNCTION public.initiate_refund(UUID, TEXT, INTEGER) IS 
'Initiates refund process through Stripe API with audit logging';

COMMENT ON FUNCTION public.get_payment_statistics(DATE, DATE) IS 
'Provides payment analytics and revenue reporting for specified date range';

COMMENT ON FUNCTION public.validate_swiss_payment_compliance(INTEGER, TEXT, TEXT) IS 
'Validates payment compliance with Swiss regulations and consumer protection laws';