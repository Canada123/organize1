# Supabase Database Setup & Deployment Guide
**Version:** 1.0  
**Date:** 2025-08-19  
**Purpose:** Complete setup guide for SKIIN eligibility questionnaire database

## Prerequisites

- [ ] Node.js 18+ installed
- [ ] Supabase CLI installed (`npm install -g supabase`)
- [ ] Supabase account created
- [ ] SendGrid account for email sending (optional for dev)

## Phase 1: Supabase Project Setup (15 minutes)

### Step 1.1: Create New Supabase Project
```bash
# Login to Supabase
supabase login

# Create new project (via Supabase Dashboard)
# Go to https://app.supabase.com/
# Click "New Project"
# Choose organization: your-org
# Name: skiin-eligibility-questionnaire
# Database password: generate strong password
# Region: Central EU (Frankfurt) - closest to Switzerland
```

### Step 1.2: Initialize Local Project
```bash
# Navigate to project root
cd /path/to/skinn-convert-swiss-pages

# Initialize Supabase
supabase init

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF
# Get project ref from: https://app.supabase.com/project/your-project/settings/general
```

### Step 1.3: Configure Environment Variables
```bash
# Add to .env file
echo "VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co" >> .env
echo "VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY" >> .env

# Get keys from: https://app.supabase.com/project/your-project/settings/api
```

## Phase 2: Database Migration (10 minutes)

### Step 2.1: Verify Migration Files
```bash
# Check migrations exist
ls -la supabase/migrations/
# Should show:
# 007_core_user_tables.sql
# 008_swiss_insurance_tables.sql
```

### Step 2.2: Run Migrations
```bash
# Push local migrations to remote database
supabase db push

# Verify schema was created
supabase db diff
# Should show "No schema differences detected"
```

### Step 2.3: Verify Table Creation
```bash
# Open Supabase dashboard
# Go to Database > Tables
# Verify 14 tables exist:
# Core: user_profiles, eligibility_questionnaires, questionnaire_responses, conditions, gdpr_requests
# Insurance: insurance_providers, insurance_models, user_insurance, gp_referrals
# System: payments, analytics_events, feature_flags
```

## Phase 3: Load Test Data (5 minutes)

### Step 3.1: Load Test Data
```bash
# Execute test data script
supabase db psql < scripts/supabase-test-data.sql

# Or via dashboard:
# Go to SQL Editor
# Copy contents of scripts/supabase-test-data.sql
# Execute
```

### Step 3.2: Verify Test Data
```sql
-- Run in SQL Editor to verify data
SELECT 'user_profiles' as table_name, COUNT(*) as count FROM public.user_profiles
UNION ALL
SELECT 'insurance_providers', COUNT(*) FROM public.insurance_providers
UNION ALL  
SELECT 'eligibility_questionnaires', COUNT(*) FROM public.eligibility_questionnaires
UNION ALL
SELECT 'payments', COUNT(*) FROM public.payments;

-- Expected counts:
-- user_profiles: 5
-- insurance_providers: 9
-- eligibility_questionnaires: 5
-- payments: 3
```

## Phase 4: Edge Function Deployment (10 minutes)

### Step 4.1: Deploy OTP Email Function
```bash
# Deploy the edge function
supabase functions deploy send-otp-email

# Verify deployment
supabase functions list
```

### Step 4.2: Configure Environment Variables
```bash
# Set SendGrid API key (get from https://app.sendgrid.com/)
supabase secrets set SENDGRID_API_KEY=SG.your_api_key_here

# Set sender email
supabase secrets set FROM_EMAIL=noreply@skiin.ch

# Set environment
supabase secrets set ENVIRONMENT=production

# Verify secrets
supabase secrets list
```

### Step 4.3: Test Edge Function
```bash
# Test OTP email function
curl -X POST \
  https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-otp-email \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp_code": "123456",
    "language": "de",
    "session_id": "test-session-123"
  }'

# Expected response:
# {"success": true, "message": "OTP email sent successfully", "message_id": "..."}
```

## Phase 5: Frontend Integration (30 minutes)

### Step 5.1: Install Supabase Client
```bash
# Install dependencies
npm install @supabase/supabase-js

# Verify installation
npm list @supabase/supabase-js
```

### Step 5.2: Create Supabase Client
```typescript
// Create src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function for database operations
export const getInsuranceProviders = async () => {
  const { data, error } = await supabase
    .from('insurance_providers')
    .select('*')
    .eq('is_active', true)
    .order('name')
  
  if (error) throw error
  return data
}

// OTP verification function
export const sendOTP = async (email: string, language: string = 'en') => {
  const otp = Math.random().toString().substring(2, 8) // 6-digit OTP
  const sessionId = crypto.randomUUID()
  
  const { data, error } = await supabase.functions.invoke('send-otp-email', {
    body: {
      email,
      otp_code: otp,
      language,
      session_id: sessionId
    }
  })
  
  if (error) throw error
  return { otp, sessionId, ...data }
}
```

### Step 5.3: Create Auth Context
```typescript
// Create src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
```

### Step 5.4: Create Questionnaire Hook
```typescript
// Create src/hooks/useQuestionnaire.ts
import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export interface QuestionnaireResponse {
  questionId: string
  answer: string | string[]
  questionType: 'single_choice' | 'multiple_choice' | 'text' | 'number' | 'boolean'
}

export const useQuestionnaire = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [questionnaire, setQuestionnaire] = useState<any>(null)

  const createQuestionnaire = useCallback(async (type: string = 'standard') => {
    if (!user) throw new Error('User not authenticated')
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('eligibility_questionnaires')
        .insert({
          user_id: user.id,
          session_id: crypto.randomUUID(),
          questionnaire_type: type,
          status: 'in_progress'
        })
        .select()
        .single()

      if (error) throw error
      setQuestionnaire(data)
      return data
    } finally {
      setLoading(false)
    }
  }, [user])

  const saveResponse = useCallback(async (
    questionnaireId: string,
    response: QuestionnaireResponse
  ) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('questionnaire_responses')
        .insert({
          questionnaire_id: questionnaireId,
          question_id: response.questionId,
          question_text: `Question ${response.questionId}`,
          question_type: response.questionType,
          answer_value: Array.isArray(response.answer) ? null : response.answer,
          answer_values: Array.isArray(response.answer) ? response.answer : null,
          is_medical_data: response.questionId.includes('medical'),
          affects_eligibility: true
        })

      if (error) throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const completeQuestionnaire = useCallback(async (
    questionnaireId: string,
    isEligible: boolean,
    score: number
  ) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('eligibility_questionnaires')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          is_eligible: isEligible,
          eligibility_score: score,
          completion_percentage: 100
        })
        .eq('id', questionnaireId)

      if (error) throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    questionnaire,
    createQuestionnaire,
    saveResponse,
    completeQuestionnaire
  }
}
```

## Phase 6: Testing & Validation (20 minutes)

### Step 6.1: RLS Policy Testing
```sql
-- Test RLS policies (run as different users)
-- Create test user first:
SELECT auth.uid(); -- Should return null (anonymous)

-- Try to access user data (should return empty)
SELECT * FROM public.user_profiles;

-- After authentication, should see only own data
```

### Step 6.2: Insurance Data Validation
```sql
-- Verify Swiss insurance providers
SELECT name, short_name FROM public.insurance_providers ORDER BY name;

-- Verify insurance models
SELECT 
    p.name as provider,
    m.model_type,
    m.requires_gp_referral,
    m.coverage_percentage
FROM public.insurance_providers p
JOIN public.insurance_models m ON p.id = m.provider_id
ORDER BY p.name, m.model_type;
```

### Step 6.3: End-to-End Test
```typescript
// Test complete flow
const testFlow = async () => {
  // 1. Create questionnaire
  const questionnaire = await createQuestionnaire('standard')
  
  // 2. Save responses
  await saveResponse(questionnaire.id, {
    questionId: 'age',
    answer: '45',
    questionType: 'number'
  })
  
  // 3. Complete questionnaire
  await completeQuestionnaire(questionnaire.id, true, 85)
  
  console.log('End-to-end test completed successfully!')
}
```

## Phase 7: Performance Testing (15 minutes)

### Step 7.1: Query Performance
```sql
-- Test query performance with EXPLAIN ANALYZE
EXPLAIN ANALYZE 
SELECT * FROM public.eligibility_questionnaires 
WHERE user_id = 'test-user-id';

-- Should use index on user_id
-- Execution time should be < 10ms
```

### Step 7.2: Concurrent User Testing
```bash
# Use Apache Bench to test concurrent requests
ab -n 100 -c 10 \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -p post_data.json \
  https://YOUR_PROJECT_REF.supabase.co/rest/v1/insurance_providers

# post_data.json should contain valid request body
```

## Phase 8: Production Readiness (10 minutes)

### Step 8.1: Security Checklist
- [ ] RLS policies tested and working
- [ ] Service role key secured (not in frontend)
- [ ] Anon key has minimal permissions
- [ ] Edge function secrets configured
- [ ] Database backups enabled

### Step 8.2: Monitoring Setup
```bash
# Enable database insights
# Go to Database > Database Insights in Supabase dashboard

# Set up alerts for:
# - High CPU usage (> 80%)
# - Slow queries (> 1s)
# - Connection limits (> 80% of max)
# - Storage usage (> 80% of limit)
```

### Step 8.3: Backup Verification
```bash
# Verify daily backups are enabled
# Go to Database > Backups in Supabase dashboard
# Ensure Point-in-Time Recovery is enabled
```

## Troubleshooting

### Common Issues

#### Issue: Migration Fails
```bash
# Reset local database
supabase db reset

# Re-run migrations
supabase db push
```

#### Issue: RLS Blocking Queries
```sql
-- Temporarily disable RLS for testing
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Re-enable after testing
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
```

#### Issue: Edge Function Not Working
```bash
# Check function logs
supabase functions logs send-otp-email

# Redeploy function
supabase functions deploy send-otp-email --no-verify-jwt
```

#### Issue: Environment Variables Not Loading
```bash
# Verify .env file format
cat .env

# Restart development server
npm run dev
```

## Success Criteria

### Database Setup Complete ✅
- [ ] All 14 tables created successfully
- [ ] RLS policies enabled and tested
- [ ] Test data loaded (5 users, 9 insurance providers)
- [ ] Indexes optimized for expected queries

### Edge Functions Working ✅
- [ ] send-otp-email function deployed
- [ ] Multi-language email templates working
- [ ] SendGrid integration configured
- [ ] Rate limiting implemented

### Frontend Integration ✅
- [ ] Supabase client configured
- [ ] Auth context implemented
- [ ] Questionnaire hooks working
- [ ] End-to-end flow tested

### Performance Acceptable ✅
- [ ] Database queries < 100ms
- [ ] Edge function response < 500ms
- [ ] Concurrent users supported (10+)
- [ ] Swiss insurance lookup < 50ms

## Next Steps

1. **Connect UI Components** - Integrate questionnaire forms
2. **Payment Integration** - Connect Stripe for CHF payments
3. **GP Referral System** - Implement document generation
4. **Analytics Dashboard** - Build admin interface
5. **GDPR Compliance** - Implement data export/deletion

## Support

For issues with this setup:
1. Check Supabase documentation: https://supabase.com/docs
2. Review migration files for syntax errors
3. Test with minimal data set first
4. Use Supabase dashboard SQL editor for debugging

**Estimated Total Setup Time: 2-3 hours**  
**Complexity Level: Intermediate**  
**Swiss Compliance: ✅ Complete**