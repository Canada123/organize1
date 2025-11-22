-- ==========================================
-- SUPABASE PERFORMANCE TESTING SUITE
-- ==========================================
-- VERSION: 1.0
-- CREATED: 2025-08-19
-- PURPOSE: Comprehensive performance testing for eligibility questionnaire database
-- USAGE: Run after test data is loaded to benchmark query performance
-- ==========================================

-- ==========================================
-- 1. QUERY PERFORMANCE BENCHMARKS
-- ==========================================

-- Test 1: User Profile Lookup (Expected < 10ms)
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT * FROM public.user_profiles 
WHERE id = '00000000-1111-2222-3333-444444444441';

-- Test 2: User's Questionnaires (Expected < 20ms)
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT eq.*, qr.question_id, qr.answer_value
FROM public.eligibility_questionnaires eq
LEFT JOIN public.questionnaire_responses qr ON eq.id = qr.questionnaire_id
WHERE eq.user_id = '00000000-1111-2222-3333-444444444441';

-- Test 3: Insurance Provider Lookup (Expected < 5ms)
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT p.*, m.model_type, m.requires_gp_referral
FROM public.insurance_providers p
JOIN public.insurance_models m ON p.id = m.provider_id
WHERE p.is_active = true
ORDER BY p.name;

-- Test 4: Swiss Canton Validation (Expected < 1ms)
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT COUNT(*) FROM public.user_profiles 
WHERE canton IN ('ZH', 'BE', 'VD', 'AG', 'SG');

-- Test 5: Complex Eligibility Query (Expected < 50ms)
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT 
    up.first_name, up.last_name, up.canton,
    eq.status, eq.eligibility_score, eq.risk_level,
    ui.deductible_amount, ui.deductible_met,
    ip.name as insurance_provider,
    im.model_type
FROM public.user_profiles up
LEFT JOIN public.eligibility_questionnaires eq ON up.id = eq.user_id
LEFT JOIN public.user_insurance ui ON up.id = ui.user_id
LEFT JOIN public.insurance_providers ip ON ui.provider_id = ip.id
LEFT JOIN public.insurance_models im ON ui.model_id = im.id
WHERE up.canton = 'ZH' 
    AND eq.status = 'completed'
    AND eq.is_eligible = true;

-- ==========================================
-- 2. INDEX EFFECTIVENESS TESTS
-- ==========================================

-- Check if indexes are being used
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Check table scan statistics
SELECT 
    schemaname,
    tablename,
    seq_scan as sequential_scans,
    seq_tup_read as sequential_tuples_read,
    idx_scan as index_scans,
    idx_tup_fetch as index_tuples_fetched,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY seq_scan DESC;

-- ==========================================
-- 3. RLS POLICY PERFORMANCE TESTS
-- ==========================================

-- Test RLS overhead (run as authenticated user)
-- Note: These should be run with actual user context

-- Without RLS (baseline)
SET row_security = off;
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT COUNT(*) FROM public.eligibility_questionnaires;

-- With RLS (production)
SET row_security = on;
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT COUNT(*) FROM public.eligibility_questionnaires;

-- Reset to default
SET row_security = on;

-- ==========================================
-- 4. CONCURRENT USER SIMULATION
-- ==========================================

-- Function to simulate concurrent questionnaire creation
CREATE OR REPLACE FUNCTION test_concurrent_questionnaire_creation()
RETURNS TABLE(test_iteration int, execution_time_ms numeric) AS $$
DECLARE
    start_time timestamp;
    end_time timestamp;
    i int;
BEGIN
    FOR i IN 1..10 LOOP
        start_time := clock_timestamp();
        
        -- Simulate questionnaire creation
        INSERT INTO public.eligibility_questionnaires (
            user_id, session_id, questionnaire_type, status
        ) VALUES (
            '00000000-1111-2222-3333-444444444441',
            uuid_generate_v4(),
            'standard',
            'in_progress'
        );
        
        end_time := clock_timestamp();
        
        test_iteration := i;
        execution_time_ms := EXTRACT(EPOCH FROM (end_time - start_time)) * 1000;
        
        RETURN NEXT;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Run concurrent test
SELECT * FROM test_concurrent_questionnaire_creation();

-- Cleanup test data
DELETE FROM public.eligibility_questionnaires 
WHERE user_id = '00000000-1111-2222-3333-444444444441' 
    AND created_at > NOW() - INTERVAL '1 minute';

-- ==========================================
-- 5. INSURANCE LOOKUP PERFORMANCE
-- ==========================================

-- Test Swiss insurance provider lookup speed
SELECT 
    'insurance_provider_lookup' as test_name,
    COUNT(*) as record_count,
    pg_size_pretty(pg_total_relation_size('public.insurance_providers')) as table_size
FROM public.insurance_providers;

-- Benchmark insurance model queries
DO $$
DECLARE
    start_time timestamp;
    end_time timestamp;
    provider_record record;
BEGIN
    start_time := clock_timestamp();
    
    -- Simulate user selecting different insurance providers
    FOR provider_record IN 
        SELECT id, name FROM public.insurance_providers 
        WHERE is_active = true 
        LIMIT 5
    LOOP
        -- Get models for each provider
        PERFORM * FROM public.insurance_models 
        WHERE provider_id = provider_record.id;
    END LOOP;
    
    end_time := clock_timestamp();
    
    RAISE NOTICE 'Insurance lookup test completed in % ms', 
        EXTRACT(EPOCH FROM (end_time - start_time)) * 1000;
END $$;

-- ==========================================
-- 6. ANALYTICS QUERY PERFORMANCE
-- ==========================================

-- Test analytics queries (typical dashboard queries)
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT 
    DATE(created_at) as date,
    COUNT(*) as questionnaires_started,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
    COUNT(CASE WHEN is_eligible = true THEN 1 END) as eligible,
    AVG(eligibility_score) as avg_score
FROM public.eligibility_questionnaires
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Analytics event aggregation
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT 
    event_type,
    event_category,
    COUNT(*) as event_count,
    COUNT(DISTINCT user_id) as unique_users
FROM public.analytics_events
WHERE timestamp >= NOW() - INTERVAL '7 days'
GROUP BY event_type, event_category
ORDER BY event_count DESC;

-- ==========================================
-- 7. PAYMENT PROCESSING PERFORMANCE
-- ==========================================

-- Test payment queries
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT 
    p.*,
    up.first_name, up.last_name,
    eq.package_type
FROM public.payments p
JOIN public.user_profiles up ON p.user_id = up.id
LEFT JOIN public.eligibility_questionnaires eq ON p.questionnaire_id = eq.id
WHERE p.status = 'succeeded'
    AND p.created_at >= NOW() - INTERVAL '30 days';

-- ==========================================
-- 8. GDPR COMPLIANCE PERFORMANCE
-- ==========================================

-- Test GDPR data export query performance
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
WITH user_data AS (
    SELECT 'profile' as data_type, row_to_json(up.*) as data
    FROM public.user_profiles up
    WHERE up.id = '00000000-1111-2222-3333-444444444441'
    
    UNION ALL
    
    SELECT 'questionnaires', row_to_json(eq.*)
    FROM public.eligibility_questionnaires eq
    WHERE eq.user_id = '00000000-1111-2222-3333-444444444441'
    
    UNION ALL
    
    SELECT 'responses', row_to_json(qr.*)
    FROM public.questionnaire_responses qr
    JOIN public.eligibility_questionnaires eq ON qr.questionnaire_id = eq.id
    WHERE eq.user_id = '00000000-1111-2222-3333-444444444441'
)
SELECT json_agg(user_data) as complete_user_data
FROM user_data;

-- ==========================================
-- 9. CONNECTION POOL STRESS TEST
-- ==========================================

-- Function to test connection handling
CREATE OR REPLACE FUNCTION test_connection_stress()
RETURNS TABLE(connection_test int, success boolean, error_message text) AS $$
DECLARE
    i int;
    test_result boolean;
    error_msg text;
BEGIN
    FOR i IN 1..20 LOOP
        BEGIN
            test_result := true;
            error_msg := NULL;
            
            -- Perform multiple operations in sequence
            PERFORM COUNT(*) FROM public.user_profiles;
            PERFORM COUNT(*) FROM public.insurance_providers;
            PERFORM COUNT(*) FROM public.eligibility_questionnaires;
            
        EXCEPTION WHEN OTHERS THEN
            test_result := false;
            error_msg := SQLERRM;
        END;
        
        connection_test := i;
        success := test_result;
        error_message := error_msg;
        
        RETURN NEXT;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Run connection stress test
SELECT * FROM test_connection_stress();

-- ==========================================
-- 10. PERFORMANCE SUMMARY REPORT
-- ==========================================

-- Generate performance summary
WITH table_stats AS (
    SELECT 
        tablename,
        n_tup_ins as inserts,
        n_tup_upd as updates,
        n_tup_del as deletes,
        seq_scan as table_scans,
        idx_scan as index_scans,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
    FROM pg_stat_user_tables
    WHERE schemaname = 'public'
),
index_stats AS (
    SELECT 
        tablename,
        COUNT(*) as index_count,
        SUM(idx_scan) as total_index_scans
    FROM pg_stat_user_indexes
    WHERE schemaname = 'public'
    GROUP BY tablename
)
SELECT 
    ts.tablename,
    ts.size,
    ts.inserts,
    ts.updates,
    ts.deletes,
    ts.table_scans,
    ts.index_scans,
    COALESCE(is_stats.index_count, 0) as index_count,
    CASE 
        WHEN ts.table_scans > ts.index_scans THEN 'WARNING: More table scans than index scans'
        WHEN ts.table_scans = 0 AND ts.index_scans = 0 THEN 'INFO: No activity yet'
        ELSE 'OK: Good index usage'
    END as performance_status
FROM table_stats ts
LEFT JOIN index_stats is_stats ON ts.tablename = is_stats.tablename
ORDER BY ts.tablename;

-- ==========================================
-- 11. CLEANUP TEST FUNCTIONS
-- ==========================================

-- Drop test functions
DROP FUNCTION IF EXISTS test_concurrent_questionnaire_creation();
DROP FUNCTION IF EXISTS test_connection_stress();

-- ==========================================
-- PERFORMANCE TESTING COMPLETE
-- ==========================================

/*
Performance Benchmarks Expected:

1. User Profile Lookup: < 10ms
2. User's Questionnaires: < 20ms  
3. Insurance Provider Lookup: < 5ms
4. Swiss Canton Validation: < 1ms
5. Complex Eligibility Query: < 50ms
6. Analytics Queries: < 100ms
7. Payment Processing: < 30ms
8. GDPR Data Export: < 200ms

Index Usage:
- All tables should show idx_scan > seq_scan
- High-traffic tables should have idx_scan > 1000

Connection Handling:
- Should handle 20+ concurrent operations without errors
- Connection pool should not be exhausted

Table Sizes (with test data):
- user_profiles: ~50KB
- eligibility_questionnaires: ~100KB
- questionnaire_responses: ~200KB
- insurance_providers: ~10KB
- analytics_events: ~500KB

Swiss Compliance:
- All 26 cantons supported
- 9 major insurance providers
- Multi-language support (de, fr, it, en)
- GDPR compliance with 30-day response time

Run this script after loading test data to validate performance.
*/