import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface OTPRequest {
  email: string;
  action: 'send' | 'verify';
  token?: string;
  clientIP?: string;
  userAgent?: string;
}

interface RateLimitRecord {
  email: string;
  ip_address: string;
  attempt_count: number;
  last_attempt: string;
  blocked_until?: string;
}

serve(async (req) => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email, action, token, clientIP, userAgent }: OTPRequest = await req.json()
    
    // Get client IP from headers if not provided
    const realIP = clientIP || req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    
    console.log(`OTP Security Handler: ${action} request for ${email} from IP ${realIP}`)

    // Check rate limiting for both email and IP
    const rateLimitCheck = await checkRateLimit(supabase, email, realIP)
    if (!rateLimitCheck.allowed) {
      return new Response(
        JSON.stringify({ 
          error: rateLimitCheck.message,
          blocked_until: rateLimitCheck.blockedUntil,
          retry_after: rateLimitCheck.retryAfter
        }),
        { 
          status: 429,
          headers: { 
            'Content-Type': 'application/json',
            'Retry-After': rateLimitCheck.retryAfter?.toString() || '60',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }

    if (action === 'send') {
      // Enhanced email validation before sending OTP
      const emailValidation = validateEmailDomain(email)
      if (!emailValidation.isValid) {
        await recordFailedAttempt(supabase, email, realIP, 'invalid_email')
        return new Response(
          JSON.stringify({ error: emailValidation.error }),
          { 
            status: 400,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          }
        )
      }

      // Send OTP using Supabase Auth
      const { error } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email,
        options: {
          data: {
            source: 'eligibility_form',
            ip_address: realIP,
            user_agent: userAgent || 'unknown'
          }
        }
      })

      if (error) {
        await recordFailedAttempt(supabase, email, realIP, 'send_failed')
        console.error('Failed to send OTP:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to send verification code' }),
          { 
            status: 500,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          }
        )
      }

      // Record successful attempt
      await recordSuccessfulAttempt(supabase, email, realIP, 'otp_sent')
      
      return new Response(
        JSON.stringify({ success: true, message: 'Verification code sent' }),
        { 
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )

    } else if (action === 'verify') {
      if (!token) {
        await recordFailedAttempt(supabase, email, realIP, 'missing_token')
        return new Response(
          JSON.stringify({ error: 'Verification code is required' }),
          { 
            status: 400,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          }
        )
      }

      // Verify OTP
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email'
      })

      if (error) {
        await recordFailedAttempt(supabase, email, realIP, 'verify_failed')
        console.error('Failed to verify OTP:', error)
        return new Response(
          JSON.stringify({ error: 'Invalid or expired verification code' }),
          { 
            status: 400,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          }
        )
      }

      // Record successful verification
      await recordSuccessfulAttempt(supabase, email, realIP, 'otp_verified')
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          user: data.user,
          session: data.session 
        }),
        { 
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { 
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

  } catch (error) {
    console.error('OTP Security Handler Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
})

/**
 * Enhanced email domain validation
 */
function validateEmailDomain(email: string): { isValid: boolean; error?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' }
  }

  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) {
    return { isValid: false, error: 'Please enter a valid email address' }
  }

  // Allow all .ch domains (Swiss domains)
  if (domain.endsWith('.ch')) {
    return { isValid: true }
  }

  // Block obvious test domains
  const blockedDomains = ['example.com', 'test.com', 'invalid.com', 'fake.com']
  if (blockedDomains.includes(domain)) {
    return { 
      isValid: false, 
      error: 'Test email domains are not allowed. Please use your real email address.' 
    }
  }

  // Allow common business domains
  const commonDomains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com',
    'protonmail.com', 'aol.com', 'live.com', 'msn.com',
    'skiin.ch', 'myant.com' // Business domains
  ]
  
  if (commonDomains.includes(domain)) {
    return { isValid: true }
  }

  // Allow other domains but with warning
  return { isValid: true }
}

/**
 * Check rate limiting for both email and IP address
 */
async function checkRateLimit(supabase: any, email: string, ipAddress: string) {
  const now = new Date()
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)

  // Check email-based rate limiting (5 attempts per 5 minutes)
  const { data: emailAttempts } = await supabase
    .from('otp_rate_limits')
    .select('*')
    .eq('email', email)
    .gte('last_attempt', fiveMinutesAgo.toISOString())

  // Check IP-based rate limiting (10 attempts per 5 minutes across all emails)
  const { data: ipAttempts } = await supabase
    .from('otp_rate_limits')
    .select('*')
    .eq('ip_address', ipAddress)
    .gte('last_attempt', fiveMinutesAgo.toISOString())

  const emailCount = emailAttempts?.length || 0
  const ipCount = ipAttempts?.length || 0

  // Check if currently blocked
  const { data: blocked } = await supabase
    .from('otp_rate_limits')
    .select('*')
    .or(`email.eq.${email},ip_address.eq.${ipAddress}`)
    .not('blocked_until', 'is', null)
    .gte('blocked_until', now.toISOString())

  if (blocked && blocked.length > 0) {
    const blockedUntil = new Date(blocked[0].blocked_until)
    const retryAfter = Math.ceil((blockedUntil.getTime() - now.getTime()) / 1000)
    
    return {
      allowed: false,
      message: `Too many attempts. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`,
      blockedUntil: blocked[0].blocked_until,
      retryAfter
    }
  }

  // Email rate limit: 5 attempts per 5 minutes
  if (emailCount >= 5) {
    const blockUntil = new Date(now.getTime() + 10 * 60 * 1000) // Block for 10 minutes
    await blockEmailOrIP(supabase, email, ipAddress, blockUntil, 'email_rate_limit')
    
    return {
      allowed: false,
      message: 'Too many attempts for this email address. Please try again in 10 minutes.',
      blockedUntil: blockUntil.toISOString(),
      retryAfter: 600
    }
  }

  // IP rate limit: 10 attempts per 5 minutes
  if (ipCount >= 10) {
    const blockUntil = new Date(now.getTime() + 15 * 60 * 1000) // Block for 15 minutes
    await blockEmailOrIP(supabase, email, ipAddress, blockUntil, 'ip_rate_limit')
    
    return {
      allowed: false,
      message: 'Too many attempts from this location. Please try again in 15 minutes.',
      blockedUntil: blockUntil.toISOString(),
      retryAfter: 900
    }
  }

  return { allowed: true }
}

/**
 * Record failed attempt with exponential backoff
 */
async function recordFailedAttempt(supabase: any, email: string, ipAddress: string, reason: string) {
  const now = new Date()
  
  // Get recent attempts to calculate exponential backoff
  const { data: recentAttempts } = await supabase
    .from('otp_rate_limits')
    .select('*')
    .eq('email', email)
    .eq('ip_address', ipAddress)
    .gte('last_attempt', new Date(now.getTime() - 60 * 60 * 1000).toISOString()) // Last hour
    .order('last_attempt', { ascending: false })

  const attemptCount = (recentAttempts?.length || 0) + 1
  
  // Exponential backoff: 1min, 2min, 4min, 8min, 16min, then 30min max
  const backoffMinutes = Math.min(Math.pow(2, attemptCount - 1), 30)
  const blockedUntil = attemptCount > 3 ? new Date(now.getTime() + backoffMinutes * 60 * 1000) : null

  await supabase
    .from('otp_rate_limits')
    .insert({
      email,
      ip_address: ipAddress,
      attempt_count: attemptCount,
      last_attempt: now.toISOString(),
      blocked_until: blockedUntil?.toISOString(),
      reason,
      success: false
    })

  console.log(`Failed attempt ${attemptCount} for ${email} from ${ipAddress}. Reason: ${reason}`)
}

/**
 * Record successful attempt
 */
async function recordSuccessfulAttempt(supabase: any, email: string, ipAddress: string, action: string) {
  await supabase
    .from('otp_rate_limits')
    .insert({
      email,
      ip_address: ipAddress,
      attempt_count: 1,
      last_attempt: new Date().toISOString(),
      reason: action,
      success: true
    })

  console.log(`Successful ${action} for ${email} from ${ipAddress}`)
}

/**
 * Block email or IP for a specific duration
 */
async function blockEmailOrIP(supabase: any, email: string, ipAddress: string, blockUntil: Date, reason: string) {
  await supabase
    .from('otp_rate_limits')
    .insert({
      email,
      ip_address: ipAddress,
      attempt_count: 0,
      last_attempt: new Date().toISOString(),
      blocked_until: blockUntil.toISOString(),
      reason,
      success: false
    })

  console.log(`Blocked ${email}/${ipAddress} until ${blockUntil.toISOString()}. Reason: ${reason}`)
}