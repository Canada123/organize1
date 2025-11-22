-- ==========================================
-- SUPABASE TEST DATA CREATION SCRIPT
-- ==========================================
-- VERSION: 1.0
-- CREATED: 2025-08-19
-- PURPOSE: Create comprehensive test data for eligibility questionnaire system
-- USAGE: Run after migrations 007 and 008 are applied
-- ==========================================

-- ==========================================
-- 1. TEST USER PROFILES
-- ==========================================

-- Test users across different Swiss cantons
INSERT INTO public.user_profiles (
    id, email, phone, first_name, last_name, date_of_birth, gender,
    street_address, city, postal_code, canton, language_preference,
    marketing_consent, data_processing_consent, consent_timestamp
) VALUES 
    -- Zurich user (German-speaking)
    ('00000000-1111-2222-3333-444444444441', 'test.zurich@example.com', '+41 44 123 45 67', 'Hans', 'Müller', '1975-03-15', 'male',
     'Bahnhofstrasse 123', 'Zürich', '8001', 'ZH', 'de', true, true, NOW()),
    
    -- Geneva user (French-speaking)
    ('00000000-1111-2222-3333-444444444442', 'test.geneva@example.com', '+41 22 987 65 43', 'Marie', 'Dubois', '1982-07-22', 'female',
     'Rue du Rhône 45', 'Genève', '1204', 'GE', 'fr', false, true, NOW()),
    
    -- Ticino user (Italian-speaking)
    ('00000000-1111-2222-3333-444444444443', 'test.lugano@example.com', '+41 91 555 12 34', 'Marco', 'Rossi', '1968-11-08', 'male',
     'Via Nassa 12', 'Lugano', '6900', 'TI', 'it', true, true, NOW()),
    
    -- Bern user (German-speaking)
    ('00000000-1111-2222-3333-444444444444', 'test.bern@example.com', '+41 31 321 54 76', 'Anna', 'Schneider', '1990-01-12', 'female',
     'Kramgasse 8', 'Bern', '3011', 'BE', 'de', true, true, NOW()),
    
    -- Basel user (English-speaking expat)
    ('00000000-1111-2222-3333-444444444445', 'test.basel@example.com', '+41 61 789 01 23', 'John', 'Smith', '1985-09-30', 'male',
     'Freie Strasse 25', 'Basel', '4001', 'BS', 'en', false, true, NOW());

-- ==========================================
-- 2. USER INSURANCE CONFIGURATIONS
-- ==========================================

-- Get insurance provider and model IDs for test data
DO $$
DECLARE
    css_id UUID;
    helsana_id UUID;
    swica_id UUID;
    css_standard_id UUID;
    css_hmo_id UUID;
    helsana_hausarzt_id UUID;
    swica_telmed_id UUID;
BEGIN
    -- Get provider IDs
    SELECT id INTO css_id FROM public.insurance_providers WHERE short_name = 'CSS';
    SELECT id INTO helsana_id FROM public.insurance_providers WHERE short_name = 'HELS';
    SELECT id INTO swica_id FROM public.insurance_providers WHERE short_name = 'SWIC';
    
    -- Get model IDs
    SELECT id INTO css_standard_id FROM public.insurance_models WHERE provider_id = css_id AND model_type = 'standard';
    SELECT id INTO css_hmo_id FROM public.insurance_models WHERE provider_id = css_id AND model_type = 'hmo';
    SELECT id INTO helsana_hausarzt_id FROM public.insurance_models WHERE provider_id = helsana_id AND model_type = 'hausarzt';
    SELECT id INTO swica_telmed_id FROM public.insurance_models WHERE provider_id = swica_id AND model_type = 'telmed';
    
    -- Insert user insurance records
    INSERT INTO public.user_insurance (
        id, user_id, provider_id, model_id, insurance_number, deductible_amount,
        current_year_expenses, deductible_met, is_verified, verification_date,
        verification_method, is_active, valid_from, valid_until
    ) VALUES 
        -- Hans Müller: CSS Standard with low deductible
        (uuid_generate_v4(), '00000000-1111-2222-3333-444444444441', css_id, css_standard_id, 
         '80756123456789', 500, 120.50, false, true, NOW() - INTERVAL '30 days', 'api', true, '2024-01-01', '2024-12-31'),
        
        -- Marie Dubois: CSS HMO with high deductible
        (uuid_generate_v4(), '00000000-1111-2222-3333-444444444442', css_id, css_hmo_id,
         '80756987654321', 2500, 3100.00, true, true, NOW() - INTERVAL '15 days', 'document', true, '2024-01-01', '2024-12-31'),
        
        -- Marco Rossi: Helsana Hausarzt model
        (uuid_generate_v4(), '00000000-1111-2222-3333-444444444443', helsana_id, helsana_hausarzt_id,
         '80757456123789', 1000, 850.25, false, true, NOW() - INTERVAL '7 days', 'manual', true, '2024-01-01', '2024-12-31'),
        
        -- Anna Schneider: SWICA Telmed model  
        (uuid_generate_v4(), '00000000-1111-2222-3333-444444444444', swica_id, swica_telmed_id,
         '80758321654987', 1500, 0.00, false, false, NULL, NULL, true, '2024-01-01', '2024-12-31'),
        
        -- John Smith: Unverified insurance
        (uuid_generate_v4(), '00000000-1111-2222-3333-444444444445', css_id, css_standard_id,
         '80759999888777', 300, 25.00, false, false, NULL, NULL, true, '2024-01-01', '2024-12-31');
END $$;

-- ==========================================
-- 3. ELIGIBILITY QUESTIONNAIRES  
-- ==========================================

-- Create test questionnaires with different statuses
INSERT INTO public.eligibility_questionnaires (
    id, user_id, session_id, version, questionnaire_type, status,
    current_step, total_steps, completion_percentage, is_eligible,
    eligibility_score, risk_level, recommendation, started_at, completed_at,
    time_spent_seconds, source, referral_code
) VALUES 
    -- Completed eligible questionnaire
    (uuid_generate_v4(), '00000000-1111-2222-3333-444444444441', uuid_generate_v4(), '1.0', 'standard', 'completed',
     5, 5, 100, true, 85, 'medium', 'Eligible for 10-day monitoring', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '12 minutes',
     720, 'website', 'HEART2024'),
    
    -- Completed ineligible questionnaire 
    (uuid_generate_v4(), '00000000-1111-2222-3333-444444444442', uuid_generate_v4(), '1.0', 'standard', 'completed',
     5, 5, 100, false, 25, 'high', 'Requires GP consultation first', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '8 minutes',
     480, 'social_media', NULL),
    
    -- In progress questionnaire
    (uuid_generate_v4(), '00000000-1111-2222-3333-444444444443', uuid_generate_v4(), '1.0', 'comprehensive', 'in_progress',
     3, 7, 43, NULL, NULL, NULL, NULL, NOW() - INTERVAL '30 minutes', NULL,
     1800, 'google_ads', 'PROMO50'),
    
    -- Abandoned questionnaire
    (uuid_generate_v4(), '00000000-1111-2222-3333-444444444444', uuid_generate_v4(), '1.0', 'quick', 'abandoned',
     2, 3, 67, NULL, NULL, NULL, NULL, NOW() - INTERVAL '3 hours', NULL,
     300, 'referral', NULL),
    
    -- Recently started questionnaire
    (uuid_generate_v4(), '00000000-1111-2222-3333-444444444445', uuid_generate_v4(), '1.0', 'standard', 'in_progress',
     1, 5, 20, NULL, NULL, NULL, NULL, NOW() - INTERVAL '5 minutes', NULL,
     300, 'direct', NULL);

-- ==========================================
-- 4. QUESTIONNAIRE RESPONSES
-- ==========================================

-- Get questionnaire IDs for responses
DO $$
DECLARE
    q1_id UUID; -- Hans's completed questionnaire
    q2_id UUID; -- Marie's completed questionnaire
    q3_id UUID; -- Marco's in-progress questionnaire
BEGIN
    -- Get questionnaire IDs
    SELECT id INTO q1_id FROM public.eligibility_questionnaires WHERE user_id = '00000000-1111-2222-3333-444444444441' AND status = 'completed';
    SELECT id INTO q2_id FROM public.eligibility_questionnaires WHERE user_id = '00000000-1111-2222-3333-444444444442' AND status = 'completed';
    SELECT id INTO q3_id FROM public.eligibility_questionnaires WHERE user_id = '00000000-1111-2222-3333-444444444443' AND status = 'in_progress';
    
    -- Responses for Hans's eligible questionnaire
    INSERT INTO public.questionnaire_responses (
        questionnaire_id, question_id, question_text, question_type, question_category,
        answer_value, answer_values, is_medical_data, affects_eligibility, weight_factor,
        answered_at, time_to_answer_seconds
    ) VALUES 
        (q1_id, 'age', 'What is your age?', 'number', 'demographics', '49', NULL, false, true, 1.0, NOW() - INTERVAL '2 days', 5),
        (q1_id, 'symptoms', 'Do you experience any heart symptoms?', 'multiple_choice', 'medical', NULL, ARRAY['palpitations', 'chest_discomfort'], true, true, 2.0, NOW() - INTERVAL '2 days' + INTERVAL '1 minute', 15),
        (q1_id, 'medications', 'Are you taking any heart medications?', 'boolean', 'medical', 'false', NULL, true, true, 1.5, NOW() - INTERVAL '2 days' + INTERVAL '2 minutes', 8),
        (q1_id, 'family_history', 'Family history of heart disease?', 'single_choice', 'medical', 'parent', NULL, true, true, 1.2, NOW() - INTERVAL '2 days' + INTERVAL '3 minutes', 12),
        (q1_id, 'consent', 'Do you consent to data processing?', 'boolean', 'legal', 'true', NULL, false, false, 1.0, NOW() - INTERVAL '2 days' + INTERVAL '4 minutes', 3);
    
    -- Responses for Marie's ineligible questionnaire
    INSERT INTO public.questionnaire_responses (
        questionnaire_id, question_id, question_text, question_type, question_category,
        answer_value, answer_values, is_medical_data, affects_eligibility, weight_factor,
        answered_at, time_to_answer_seconds
    ) VALUES 
        (q2_id, 'age', 'What is your age?', 'number', 'demographics', '42', NULL, false, true, 1.0, NOW() - INTERVAL '1 day', 4),
        (q2_id, 'symptoms', 'Do you experience any heart symptoms?', 'multiple_choice', 'medical', NULL, ARRAY['chest_pain', 'shortness_of_breath', 'fainting'], true, true, 2.0, NOW() - INTERVAL '1 day' + INTERVAL '1 minute', 20),
        (q2_id, 'medications', 'Are you taking any heart medications?', 'boolean', 'medical', 'true', NULL, true, true, 1.5, NOW() - INTERVAL '1 day' + INTERVAL '2 minutes', 6),
        (q2_id, 'recent_surgery', 'Recent cardiac surgery?', 'boolean', 'medical', 'true', NULL, true, true, 3.0, NOW() - INTERVAL '1 day' + INTERVAL '3 minutes', 10),
        (q2_id, 'consent', 'Do you consent to data processing?', 'boolean', 'legal', 'true', NULL, false, false, 1.0, NOW() - INTERVAL '1 day' + INTERVAL '4 minutes', 2);
    
    -- Partial responses for Marco's in-progress questionnaire
    INSERT INTO public.questionnaire_responses (
        questionnaire_id, question_id, question_text, question_type, question_category,
        answer_value, answer_values, is_medical_data, affects_eligibility, weight_factor,
        answered_at, time_to_answer_seconds
    ) VALUES 
        (q3_id, 'age', 'What is your age?', 'number', 'demographics', '56', NULL, false, true, 1.0, NOW() - INTERVAL '25 minutes', 3),
        (q3_id, 'symptoms', 'Do you experience any heart symptoms?', 'multiple_choice', 'medical', NULL, ARRAY['none'], true, true, 2.0, NOW() - INTERVAL '20 minutes', 18),
        (q3_id, 'medications', 'Are you taking any heart medications?', 'boolean', 'medical', 'false', NULL, true, true, 1.5, NOW() - INTERVAL '15 minutes', 7);
END $$;

-- ==========================================
-- 5. MEDICAL CONDITIONS
-- ==========================================

-- Add conditions for users who reported them
INSERT INTO public.conditions (
    user_id, condition_name, condition_category, icd10_code, severity,
    onset_date, is_chronic, is_controlled, affects_eligibility,
    contraindication_level, requires_gp_clearance, under_treatment,
    medications, treating_physician
) VALUES 
    -- Hans: Mild hypertension
    ('00000000-1111-2222-3333-444444444441', 'Essential Hypertension', 'cardiovascular', 'I10', 'mild',
     '2020-03-15', true, true, false, 'none', false, true,
     ARRAY['lisinopril 10mg'], 'Dr. Weber, Kardiologie Zürich'),
    
    -- Marie: Recent cardiac surgery
    ('00000000-1111-2222-3333-444444444442', 'Status Post Cardiac Surgery', 'cardiovascular', 'Z95.1', 'moderate',
     '2024-06-15', false, true, true, 'relative', true, true,
     ARRAY['metoprolol 50mg', 'atorvastatin 20mg'], 'Dr. Martin, HUG Cardiologie'),
    
    -- Marie: Atrial fibrillation
    ('00000000-1111-2222-3333-444444444442', 'Atrial Fibrillation', 'cardiovascular', 'I48.1', 'moderate',
     '2023-11-20', true, true, true, 'relative', true, true,
     ARRAY['apixaban 5mg'], 'Dr. Martin, HUG Cardiologie');

-- ==========================================
-- 6. GP REFERRALS
-- ==========================================

-- Create GP referrals for users requiring them
INSERT INTO public.gp_referrals (
    user_id, gp_name, gp_practice, gp_email, gp_phone,
    referral_type, referral_reason, clinical_summary,
    symptoms, risk_factors, medications, relevant_history,
    status, created_at, expires_at
) VALUES 
    -- Marie needs GP clearance due to recent surgery
    ('00000000-1111-2222-3333-444444444442', 'Dr. Jean Martin', 'HUG Cardiologie',
     'j.martin@hug.ch', '+41 22 372 72 00', 'holter_monitoring',
     'Post-surgical cardiac monitoring clearance', 'Patient 3 months post CABG, stable condition',
     ARRAY['chest_pain', 'shortness_of_breath'], ARRAY['recent_surgery', 'family_history'],
     ARRAY['metoprolol 50mg', 'atorvastatin 20mg'], 'CABG performed June 2024, no complications',
     'sent', NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days'),
    
    -- Pending referral for another user
    ('00000000-1111-2222-3333-444444444443', 'Dr. Franco Rossi', 'Cardiocentro Lugano',
     'f.rossi@cardiocentro.org', '+41 91 805 31 11', 'consultation',
     'Risk assessment for home monitoring', 'Asymptomatic patient requesting screening',
     ARRAY['none'], ARRAY['age_over_50', 'family_history'], ARRAY[], 'No significant cardiac history',
     'draft', NOW() - INTERVAL '1 hour', NOW() + INTERVAL '29 days');

-- ==========================================
-- 7. PAYMENTS
-- ==========================================

-- Create payment records for different scenarios
INSERT INTO public.payments (
    user_id, amount_chf, payment_method, package_type, package_price_chf,
    discount_amount_chf, discount_code, stripe_payment_intent_id,
    stripe_customer_id, status, created_at, paid_at,
    insurance_coverage_amount, patient_responsibility_amount
) VALUES 
    -- Hans: Successful payment for 10-day package
    ('00000000-1111-2222-3333-444444444441', 450.00, 'credit_card', '10_day', 500.00,
     50.00, 'HEART2024', 'pi_test_1234567890', 'cus_test_hans123', 'succeeded',
     NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '30 seconds',
     400.00, 50.00),
    
    -- Marie: Pending payment with insurance pre-approval
    ('00000000-1111-2222-3333-444444444442', 100.00, 'insurance', '5_day', 300.00,
     0.00, NULL, 'pi_test_2345678901', 'cus_test_marie456', 'pending',
     NOW() - INTERVAL '1 day', NULL, 200.00, 100.00),
    
    -- Failed payment attempt
    ('00000000-1111-2222-3333-444444444444', 200.00, 'credit_card', '3_day', 200.00,
     0.00, NULL, 'pi_test_3456789012', 'cus_test_anna789', 'failed',
     NOW() - INTERVAL '3 hours', NULL, 0.00, 200.00);

-- ==========================================
-- 8. ANALYTICS EVENTS
-- ==========================================

-- Create analytics events for conversion tracking
INSERT INTO public.analytics_events (
    user_id, session_id, event_type, event_category, event_action,
    event_label, page_url, utm_source, utm_medium, utm_campaign,
    device_type, browser, country, region, properties
) VALUES 
    -- Hans's successful conversion journey
    ('00000000-1111-2222-3333-444444444441', uuid_generate_v4(), 'page_view', 'navigation', 'landing_page', 'hero', 'https://skiin.ch/', 'google', 'cpc', 'heart_screening_2024', 'desktop', 'chrome', 'Switzerland', 'Zurich', '{"page_load_time": 1.2}'),
    ('00000000-1111-2222-3333-444444444441', uuid_generate_v4(), 'questionnaire_start', 'engagement', 'start', 'eligibility_form', 'https://skiin.ch/eligibility', 'google', 'cpc', 'heart_screening_2024', 'desktop', 'chrome', 'Switzerland', 'Zurich', '{"form_version": "1.0"}'),
    ('00000000-1111-2222-3333-444444444441', uuid_generate_v4(), 'questionnaire_complete', 'conversion', 'complete', 'eligible', 'https://skiin.ch/eligibility', 'google', 'cpc', 'heart_screening_2024', 'desktop', 'chrome', 'Switzerland', 'Zurich', '{"score": 85, "time_spent": 720}'),
    ('00000000-1111-2222-3333-444444444441', uuid_generate_v4(), 'payment_success', 'conversion', 'purchase', '10_day_package', 'https://skiin.ch/payment', 'google', 'cpc', 'heart_screening_2024', 'desktop', 'chrome', 'Switzerland', 'Zurich', '{"amount": 450.00, "currency": "CHF"}'),
    
    -- Marie's journey with GP referral
    ('00000000-1111-2222-3333-444444444442', uuid_generate_v4(), 'questionnaire_complete', 'conversion', 'complete', 'requires_referral', 'https://skiin.ch/eligibility', 'facebook', 'social', 'awareness_campaign', 'mobile', 'safari', 'Switzerland', 'Geneva', '{"score": 25, "risk_level": "high"}'),
    ('00000000-1111-2222-3333-444444444442', uuid_generate_v4(), 'gp_referral_generated', 'engagement', 'referral', 'automatic', 'https://skiin.ch/referral', 'facebook', 'social', 'awareness_campaign', 'mobile', 'safari', 'Switzerland', 'Geneva', '{"gp_practice": "HUG Cardiologie"}'),
    
    -- Anonymous user who abandoned
    (NULL, uuid_generate_v4(), 'questionnaire_abandon', 'engagement', 'abandon', 'step_2', 'https://skiin.ch/eligibility', 'direct', 'none', NULL, 'mobile', 'firefox', 'Switzerland', 'Bern', '{"completion_percentage": 67, "time_spent": 300}');

-- ==========================================
-- 9. GDPR REQUESTS
-- ==========================================

-- Create sample GDPR requests
INSERT INTO public.gdpr_requests (
    user_id, request_type, request_reason, status, requested_at,
    acknowledged_at, due_date, request_ip, verification_method,
    verified, export_format
) VALUES 
    -- Data access request
    ('00000000-1111-2222-3333-444444444443', 'access', 'I want to see all my personal data',
     'processing', NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days',
     NOW() + INTERVAL '25 days', '192.168.1.100', 'email_verification', true, 'json'),
    
    -- Data deletion request  
    ('00000000-1111-2222-3333-444444444445', 'deletion', 'I want to delete my account and all data',
     'pending', NOW() - INTERVAL '2 days', NULL, NOW() + INTERVAL '28 days',
     '10.0.0.1', NULL, false, NULL);

-- ==========================================
-- 10. FEATURE FLAGS UPDATES
-- ==========================================

-- Update feature flags for testing
UPDATE public.feature_flags 
SET is_enabled = true, rollout_percentage = 100
WHERE flag_name IN ('enable_otp_verification', 'enable_gp_referrals', 'enable_file_uploads');

UPDATE public.feature_flags 
SET is_enabled = false, rollout_percentage = 0
WHERE flag_name IN ('enable_stripe_payments', 'enable_insurance_api');

-- ==========================================
-- VERIFICATION QUERIES
-- ==========================================

-- These queries can be used to verify test data was created correctly:

/*
-- Count records by table
SELECT 'user_profiles' as table_name, COUNT(*) as count FROM public.user_profiles
UNION ALL
SELECT 'user_insurance', COUNT(*) FROM public.user_insurance
UNION ALL  
SELECT 'eligibility_questionnaires', COUNT(*) FROM public.eligibility_questionnaires
UNION ALL
SELECT 'questionnaire_responses', COUNT(*) FROM public.questionnaire_responses
UNION ALL
SELECT 'conditions', COUNT(*) FROM public.conditions
UNION ALL
SELECT 'gp_referrals', COUNT(*) FROM public.gp_referrals
UNION ALL
SELECT 'payments', COUNT(*) FROM public.payments
UNION ALL
SELECT 'analytics_events', COUNT(*) FROM public.analytics_events
UNION ALL
SELECT 'gdpr_requests', COUNT(*) FROM public.gdpr_requests;

-- Check Swiss insurance setup
SELECT p.name, COUNT(m.id) as model_count
FROM public.insurance_providers p
LEFT JOIN public.insurance_models m ON p.id = m.provider_id
GROUP BY p.name
ORDER BY p.name;

-- Check user questionnaire status
SELECT 
    up.first_name || ' ' || up.last_name as user_name,
    up.canton,
    eq.status,
    eq.eligibility_score,
    eq.risk_level
FROM public.user_profiles up
LEFT JOIN public.eligibility_questionnaires eq ON up.id = eq.user_id
ORDER BY up.canton;
*/

-- Test data creation complete!
-- Total test records created:
-- - 5 user profiles across 5 cantons
-- - 5 insurance configurations (4 different models)
-- - 5 questionnaires (various statuses)
-- - 13 questionnaire responses
-- - 3 medical conditions
-- - 2 GP referrals  
-- - 3 payment records
-- - 7 analytics events
-- - 2 GDPR requests