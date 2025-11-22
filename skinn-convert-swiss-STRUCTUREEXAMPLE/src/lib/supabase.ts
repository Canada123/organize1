import { createClient } from '@supabase/supabase-js'

// Environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey)
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public'
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'skiin-switzerland-v2'
    }
  }
})

// Database types for v2.0 schema
export interface UserProfileV2 {
  id: string
  phone?: string
  date_of_birth: string
  street_address?: string
  postal_code?: string
  city?: string
  canton?: string
  consent_given: boolean
  consent_given_at?: string
  data_retention_until: string
  deletion_requested_at?: string
  otp_requests_count: number
  otp_requests_reset_at: string
  phone_verified: boolean
  email_verified: boolean
  health_insurance_number?: string
  preferred_language: 'de' | 'fr' | 'it' | 'en'
  emergency_contact?: { name?: string; phone?: string; relationship?: string }
  medical_data_classification: 'public' | 'confidential' | 'secret'
  created_at: string
  updated_at: string
}

export interface FormSession {
  id: string
  user_id: string
  form_data: Record<string, unknown>
  current_step: number
  total_steps: number
  completion_percentage: number
  status: 'active' | 'completed' | 'expired' | 'abandoned'
  eligibility_result?: { eligible: boolean; pathway: string; reason: string; score?: number }
  session_token?: string
  expires_at: string
  last_activity_at: string
  insurance_model?: 'standard' | 'flex' | 'hmo' | 'hausarzt' | 'telmed' | 'self_pay'
  gp_referral_required: boolean
  submitted_at?: string
  completion_time_seconds?: number
  recommendations?: string[]
  next_steps?: string[]
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  user_id: string
  form_session_id: string
  stripe_payment_intent_id: string
  stripe_session_id?: string
  idempotency_key: string
  amount_cents: number
  currency: string
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled'
  billing_address: { street?: string; city?: string; postalCode?: string; country?: string }
  vat_included: boolean
  vat_rate: number
  invoice_number?: string
  payment_method?: string
  processed_at?: string
  failure_reason?: string
  failure_code?: string
  last_four_digits?: string
  card_brand?: string
  card_exp_month?: number
  card_exp_year?: number
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  user_id: string
  form_session_id?: string
  filename: string
  file_path: string
  file_size_bytes?: number
  mime_type: string
  document_type: 'referral' | 'invoice' | 'report' | 'upload' | 'ecg' | 'prescription' | 'insurance_card'
  template_used?: string
  generation_parameters?: Record<string, unknown>
  patient_consent_required: boolean
  medical_data_classification: 'public' | 'confidential' | 'secret'
  retention_period_years: number
  is_public: boolean
  access_expires_at?: string
  download_count: number
  last_accessed_at?: string
  created_at: string
  updated_at: string
}

// v2.0 API Functions

// Create secure form session using database function
export const createSecureFormSession = async (
  userId: string,
  initialData: Record<string, unknown> = {},
  sessionType: string = 'eligibility_questionnaire'
): Promise<{success: boolean, sessionId?: string, sessionToken?: string, expiresAt?: string, error?: string}> => {
  if (!isSupabaseConfigured()) {
    // Mock implementation for development
    return {
      success: true,
      sessionId: `mock_session_${Date.now()}`,
      sessionToken: `mock_token_${Date.now()}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  }

  try {
    const { data, error } = await supabase.rpc('create_secure_form_session', {
      p_user_id: userId,
      p_initial_data: initialData,
      p_session_type: sessionType
    })

    if (error) {
      console.error('Error creating form session:', error)
      return { success: false, error: error.message }
    }

    const result = data[0]
    return {
      success: result.success,
      sessionId: result.session_id,
      sessionToken: result.session_token,
      expiresAt: result.expires_at,
      error: result.success ? undefined : 'Failed to create session'
    }
  } catch (error) {
    console.error('Database error:', error)
    return { success: false, error: 'Database connection error' }
  }
}

// Save form progress using database function
export const saveFormProgress = async (
  sessionId: string,
  step: number,
  formData: Record<string, unknown>,
  userId?: string
): Promise<{success: boolean, eligibilityResult?: any, error?: string}> => {
  if (!isSupabaseConfigured()) {
    // Mock implementation for development
  // Console statement removed by ESLint fix
    return { success: true }
  }

  try {
    const { data, error } = await supabase.rpc('save_form_progress_v2', {
      p_session_id: sessionId,
      p_step: step,
      p_data: formData,
      p_user_id: userId
    })

    if (error) {
      console.error('Error saving form progress:', error)
      return { success: false, error: error.message }
    }

    const result = data
    return {
      success: result.success,
      eligibilityResult: result.eligibility_result,
      error: result.success ? undefined : result.error
    }
  } catch (error) {
    console.error('Database error:', error)
    return { success: false, error: 'Database connection error' }
  }
}

// Get form session
export const getFormSession = async (sessionId: string): Promise<FormSession | null> => {
  if (!isSupabaseConfigured()) {
    // Mock session data
    return {
      id: sessionId,
      user_id: 'mock_user',
      form_data: {},
      current_step: 0,
      total_steps: 5,
      completion_percentage: 0,
      status: 'active',
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      last_activity_at: new Date().toISOString(),
      gp_referral_required: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as FormSession
  }

  try {
    const { data, error } = await supabase
      .from('form_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (error) {
      console.error('Error fetching form session:', error)
      return null
    }

    return data as FormSession
  } catch (error) {
    console.error('Database error:', error)
    return null
  }
}

// Create user profile with validation
export const createUserProfile = async (
  userId: string,
  dateOfBirth: string,
  phone?: string,
  address?: { street?: string; city?: string; postalCode?: string; canton?: string },
  preferredLanguage: 'de' | 'fr' | 'it' | 'en' = 'de'
): Promise<{success: boolean, error?: string}> => {
  if (!isSupabaseConfigured()) {
  // Console statement removed by ESLint fix
    return { success: true }
  }

  try {
    const { data, error } = await supabase.rpc('create_user_profile_v2', {
      p_user_id: userId,
      p_date_of_birth: dateOfBirth,
      p_phone: phone,
      p_address: address,
      p_preferred_language: preferredLanguage
    })

    if (error) {
      console.error('Error creating user profile:', error)
      return { success: false, error: error.message }
    }

    const result = data
    return {
      success: result.success,
      error: result.success ? undefined : result.error
    }
  } catch (error) {
    console.error('Database error:', error)
    return { success: false, error: 'Database connection error' }
  }
}

// Process payment securely using database function
export const processPaymentSecurely = async (
  userId: string,
  formSessionId: string,
  stripePaymentIntentId: string,
  amountCents: number,
  billingAddress: { street?: string; city?: string; postalCode?: string; country?: string },
  idempotencyKey: string
): Promise<{success: boolean, paymentId?: string, invoiceNumber?: string, amountBreakdown?: { total_cents: number; net_cents: number; vat_cents: number; vat_rate: number; currency: string }, error?: string}> => {
  if (!isSupabaseConfigured()) {
    // Mock payment processing
  // Console statement removed by ESLint fix
    return {
      success: true,
      paymentId: `mock_payment_${Date.now()}`,
      invoiceNumber: `SKIIN-${new Date().getFullYear()}-000001`,
      amountBreakdown: {
        total_cents: 35000,
        net_cents: 32507,
        vat_cents: 2493,
        vat_rate: 0.077,
        currency: 'CHF'
      }
    }
  }

  try {
    const { data, error } = await supabase.rpc('process_payment_securely', {
      p_user_id: userId,
      p_form_session_id: formSessionId,
      p_stripe_payment_intent_id: stripePaymentIntentId,
      p_amount_cents: amountCents,
      p_billing_address: billingAddress,
      p_idempotency_key: idempotencyKey
    })

    if (error) {
      console.error('Error processing payment:', error)
      return { success: false, error: error.message }
    }

    const result = data
    return {
      success: result.success,
      paymentId: result.payment_id,
      invoiceNumber: result.invoice_number,
      amountBreakdown: result.amount_breakdown,
      error: result.success ? undefined : result.error_message
    }
  } catch (error) {
    console.error('Payment error:', error)
    return { success: false, error: 'Payment processing error' }
  }
}

// Export user data for GDPR compliance
export const exportUserData = async (userId: string): Promise<{success: boolean, data?: unknown, error?: string}> => {
  if (!isSupabaseConfigured()) {
  // Console statement removed by ESLint fix
    return { 
      success: true, 
      data: { 
        export_metadata: { user_id: userId, export_date: new Date().toISOString() },
        user_profile: {},
        form_sessions: [],
        payments: [],
        documents: []
      }
    }
  }

  try {
    const { data, error } = await supabase.rpc('export_user_data_v2', {
      p_user_id: userId
    })

    if (error) {
      console.error('Error exporting user data:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Export error:', error)
    return { success: false, error: 'Data export error' }
  }
}

// Enhanced email validation function
const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  // Basic format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address format' };
  }

  // Check for common business domains that should be allowed
  const businessDomains = [
    'skiin.ch', 'myant.com', 'gmail.com', 'outlook.com', 'hotmail.com',
    'yahoo.com', 'icloud.com', 'protonmail.com', 'company.ch', 'admin.ch'
  ];
  
  const domain = email.split('@')[1]?.toLowerCase();
  
  // Allow all .ch domains (Swiss domains)
  if (domain?.endsWith('.ch')) {
    return { isValid: true };
  }
  
  // Allow common email providers and business domains
  if (businessDomains.some(bd => domain?.includes(bd.split('.')[0]))) {
    return { isValid: true };
  }
  
  // Block obvious test/invalid domains
  const blockedDomains = ['example.com', 'test.com', 'invalid.com', 'fake.com'];
  if (blockedDomains.includes(domain || '')) {
    return { isValid: false, error: 'Please use a real email address, not a test domain' };
  }
  
  return { isValid: true };
};

// Enhanced phone validation function
const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
  // Swiss phone number validation
  const swissPhoneRegex = /^(\+41|0041|0)[1-9]\d{8}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  if (!swissPhoneRegex.test(cleanPhone)) {
    return { 
      isValid: false, 
      error: 'Please enter a valid Swiss phone number (e.g., +41791234567)' 
    };
  }
  
  return { isValid: true };
};

// Authentication functions using Supabase Auth with enhanced validation
export const signInWithOTP = async (
  contactMethod: 'email' | 'phone',
  contactValue: string
): Promise<{success: boolean, error?: string, userFriendlyError?: string}> => {
  if (!isSupabaseConfigured()) {
  // Console statement removed by ESLint fix
    return { success: true }
  }

  // Enhanced validation before sending to Supabase
  if (contactMethod === 'email') {
    const validation = validateEmail(contactValue);
    if (!validation.isValid) {
      return { 
        success: false, 
        error: validation.error,
        userFriendlyError: validation.error
      };
    }
  } else {
    const validation = validatePhone(contactValue);
    if (!validation.isValid) {
      return { 
        success: false, 
        error: validation.error,
        userFriendlyError: validation.error
      };
    }
  }

  try {
    if (contactMethod === 'email') {
      const { error } = await supabase.auth.signInWithOtp({
        email: contactValue,
        options: {
          shouldCreateUser: true,
          data: {
            contact_method: 'email',
            source: 'skiin_eligibility_form'
          }
        }
      })
      
      if (error) {
        console.error('Error sending email OTP:', error)
        
        // Provide user-friendly error messages
        let userFriendlyError = 'Unable to send verification email';
        
        if (error.message.includes('email_address_invalid')) {
          userFriendlyError = 'This email address format is not supported. Please try a different email address or contact support.';
        } else if (error.message.includes('rate_limit')) {
          userFriendlyError = 'Too many verification attempts. Please wait a few minutes before trying again.';
        } else if (error.message.includes('network')) {
          userFriendlyError = 'Network connection issue. Please check your internet connection and try again.';
        }
        
        return { 
          success: false, 
          error: error.message,
          userFriendlyError
        }
      }
    } else {
      const { error } = await supabase.auth.signInWithOtp({
        phone: contactValue,
        options: {
          shouldCreateUser: true,
          data: {
            contact_method: 'phone',
            source: 'skiin_eligibility_form'
          }
        }
      })
      
      if (error) {
        console.error('Error sending phone OTP:', error)
        
        let userFriendlyError = 'Unable to send verification SMS';
        
        if (error.message.includes('phone_number_invalid')) {
          userFriendlyError = 'This phone number format is not supported. Please use a Swiss phone number format (+41791234567).';
        } else if (error.message.includes('rate_limit')) {
          userFriendlyError = 'Too many verification attempts. Please wait a few minutes before trying again.';
        }
        
        return { 
          success: false, 
          error: error.message,
          userFriendlyError
        }
      }
    }

    return { success: true }
  } catch (error) {
    console.error('OTP error:', error)
    return { 
      success: false, 
      error: 'Failed to send OTP',
      userFriendlyError: 'Unable to send verification code. Please try again or contact support if the issue persists.'
    }
  }
}

// Verify OTP and establish session
export const verifyOTP = async (
  contactMethod: 'email' | 'phone',
  contactValue: string,
  otp: string
): Promise<{success: boolean, userId?: string, error?: string}> => {
  if (!isSupabaseConfigured()) {
    // Mock verification (accepts 123456 as valid OTP)
    if (otp === '123456') {
      return { success: true, userId: `mock_user_${Date.now()}` }
    }
    return { success: false, error: 'Invalid OTP' }
  }

  try {
    const verifyOptions = contactMethod === 'email' 
      ? { email: contactValue, token: otp, type: 'email' as const }
      : { phone: contactValue, token: otp, type: 'sms' as const }

    const { data, error } = await supabase.auth.verifyOtp(verifyOptions)
    
    if (error) {
      console.error('Error verifying OTP:', error)
      return { success: false, error: error.message }
    }

    return { success: true, userId: data.user?.id }
  } catch (error) {
    console.error('Verification error:', error)
    return { success: false, error: 'OTP verification failed' }
  }
}

// Get current user session
export const getCurrentUser = async () => {
  if (!isSupabaseConfigured()) {
    return null
  }

  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Sign out user
export const signOut = async (): Promise<{success: boolean, error?: string}> => {
  if (!isSupabaseConfigured()) {
    return { success: true }
  }

  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Error signing out:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Sign out error:', error)
    return { success: false, error: 'Failed to sign out' }
  }
}

// Check eligibility using database function
export const checkEligibility = async (formData: Record<string, unknown>): Promise<{success: boolean, result?: unknown, error?: string}> => {
  if (!isSupabaseConfigured()) {
    // Mock eligibility result
    return {
      success: true,
      result: {
        eligible: true,
        pathway: 'reimbursed',
        reason: 'Mock eligibility assessment',
        eligibility_score: 75,
        next_steps: ['collect_gp_details']
      }
    }
  }

  try {
    const { data, error } = await supabase.rpc('check_eligibility_v2', {
      p_form_data: formData
    })

    if (error) {
      console.error('Error checking eligibility:', error)
      return { success: false, error: error.message }
    }

    return { success: true, result: data }
  } catch (error) {
    console.error('Eligibility check error:', error)
    return { success: false, error: 'Eligibility check failed' }
  }
}