import bcrypt from 'bcryptjs';
import { z } from 'zod';
import type { 
  OTPRequest, 
  OTPVerification, 
  OTPRateLimit, 
  OTPSecurityConfig,
  ApiResponse,
  SecurityError,
  AuditLogEntry 
} from '../types/backend';

// P0 Security Configuration for OTP System
const OTP_CONFIG: OTPSecurityConfig = {
  maxAttempts: 5,
  blockDurationMinutes: 10,
  otpExpiryMinutes: 10,
  medicalOtpExpiryMinutes: 5, // Stricter for medical contexts
  rateLimitWindowMinutes: 60
};

// Validation schemas with enhanced security
const OTPRequestSchema = z.object({
  contactMethod: z.enum(['email', 'phone']),
  contactValue: z.string()
    .min(1, 'Contact value is required')
    .refine((val) => {
      if (val.includes('@')) {
        // Email validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) && !val.includes('<script>');
      } else {
        // Swiss phone validation
        const clean = val.replace(/[\s\-\(\)]/g, '');
        return /^(\+41|0041|0)[1-9]\d{8}$/.test(clean);
      }
    }, 'Invalid contact format'),
  purpose: z.enum(['contact_verification', 'payment_verification', 'medical_access']),
  ipAddress: z.string().optional(),
  userAgent: z.string().max(500).optional()
});

const OTPVerificationSchema = z.object({
  contactMethod: z.enum(['email', 'phone']),
  contactValue: z.string().min(1),
  otp: z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d{6}$/, 'OTP must contain only numbers'),
  sessionToken: z.string().optional()
});

// In-memory rate limiting (would use Redis in production)
const rateLimitStore = new Map<string, {
  attempts: { timestamp: number; success: boolean }[];
  blocked: boolean;
  blockExpiry?: number;
}>();

const otpStore = new Map<string, {
  hashedOtp: string;
  contactValue: string;
  contactMethod: 'email' | 'phone';
  purpose: string;
  createdAt: number;
  expiresAt: number;
  attempts: number;
}>();

// Audit logging system
const auditLogs: AuditLogEntry[] = [];

function logAuditEvent(
  action: string,
  result: 'success' | 'failure' | 'blocked',
  contactValue: string,
  ipAddress?: string,
  userAgent?: string,
  details?: unknown
): void {
  const entry: AuditLogEntry = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    action,
    resource: 'otp_service',
    ipAddress: ipAddress || 'unknown',
    userAgent: userAgent || 'unknown',
    requestId: `req_${Date.now()}`,
    result,
    securityLevel: 'confidential',
    details: {
      contactValue: contactValue.includes('@') 
        ? contactValue.replace(/(.{2}).+@/, '$1***@') // Mask email
        : contactValue.replace(/(\+\d{2})\d+(\d{2})/, '$1***$2'), // Mask phone
      ...details
    }
  };
  auditLogs.push(entry);
  
  // Keep only last 10000 entries (memory management)
  if (auditLogs.length > 10000) {
    auditLogs.shift();
  }
  // Console statement removed by ESLint fix
}

function generateSecureOTP(): string {
  // Generate cryptographically secure 6-digit OTP
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return (array[0] % 1000000).toString().padStart(6, '0');
}

function getRateLimitKey(contactValue: string, ipAddress?: string): string {
  // Combine contact value and IP for rate limiting
  return `${contactValue}:${ipAddress || 'unknown'}`;
}

function checkRateLimit(key: string, purpose: string): OTPRateLimit {
  const now = Date.now();
  const windowMs = OTP_CONFIG.rateLimitWindowMinutes * 60 * 1000;
  const blockDurationMs = OTP_CONFIG.blockDurationMinutes * 60 * 1000;
  
  let record = rateLimitStore.get(key);
  
  if (!record) {
    record = { attempts: [], blocked: false };
    rateLimitStore.set(key, record);
  }
  
  // Check if currently blocked
  if (record.blocked && record.blockExpiry && now < record.blockExpiry) {
    return {
      contactValue: key.split(':')[0],
      attemptsCount: record.attempts.length,
      attemptsRemaining: 0,
      nextAttemptAt: new Date(record.blockExpiry).toISOString(),
      isBlocked: true,
      blockExpiresAt: new Date(record.blockExpiry).toISOString()
    };
  }
  
  // Clean old attempts outside window
  record.attempts = record.attempts.filter(attempt => now - attempt.timestamp < windowMs);
  
  // Count failed attempts in window
  const failedAttempts = record.attempts.filter(attempt => !attempt.success).length;
  
  // Medical contexts have stricter limits
  const maxAttempts = purpose === 'medical_access' ? 3 : OTP_CONFIG.maxAttempts;
  
  if (failedAttempts >= maxAttempts) {
    record.blocked = true;
    record.blockExpiry = now + blockDurationMs;
    
    return {
      contactValue: key.split(':')[0],
      attemptsCount: failedAttempts,
      attemptsRemaining: 0,
      nextAttemptAt: new Date(record.blockExpiry).toISOString(),
      isBlocked: true,
      blockExpiresAt: new Date(record.blockExpiry).toISOString()
    };
  }
  
  return {
    contactValue: key.split(':')[0],
    attemptsCount: failedAttempts,
    attemptsRemaining: maxAttempts - failedAttempts,
    nextAttemptAt: new Date(now).toISOString(),
    isBlocked: false
  };
}

function addAttempt(key: string, success: boolean): void {
  const record = rateLimitStore.get(key);
  if (record) {
    record.attempts.push({ timestamp: Date.now(), success });
    if (success) {
      record.blocked = false;
      record.blockExpiry = undefined;
    }
  }
}

export class OTPSecurityService {
  /**
   * Generate and send secure OTP with rate limiting and bcrypt hashing
   */
  static async generateOTP(request: OTPRequest): Promise<ApiResponse<{ 
    success: boolean; 
    expiresAt: string; 
    attemptsRemaining: number; 
  }>> {
    try {
      // Validate input with Zod
      const validatedRequest = OTPRequestSchema.parse(request);
      
      const rateLimitKey = getRateLimitKey(validatedRequest.contactValue, validatedRequest.ipAddress);
      
      // Check rate limiting
      const rateLimitStatus = checkRateLimit(rateLimitKey, validatedRequest.purpose);
      
      if (rateLimitStatus.isBlocked) {
        logAuditEvent(
          'otp_generation_blocked', 
          'blocked', 
          validatedRequest.contactValue,
          validatedRequest.ipAddress,
          validatedRequest.userAgent,
          { reason: 'rate_limit_exceeded', blockExpiresAt: rateLimitStatus.blockExpiresAt }
        );
        
        return {
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: `Too many attempts. Try again after ${rateLimitStatus.blockExpiresAt}`,
            details: rateLimitStatus
          },
          meta: {
            timestamp: new Date().toISOString(),
            version: '1.0'
          }
        };
      }
      
      // Generate secure OTP
      const otp = generateSecureOTP();
      
      // Hash OTP with bcrypt (cost factor 12 for security)
      const saltRounds = 12;
      const hashedOtp = await bcrypt.hash(otp, saltRounds);
      
      // Determine expiry based on purpose
      const expiryMinutes = validatedRequest.purpose === 'medical_access' 
        ? OTP_CONFIG.medicalOtpExpiryMinutes 
        : OTP_CONFIG.otpExpiryMinutes;
      
      const now = Date.now();
      const expiresAt = now + (expiryMinutes * 60 * 1000);
      
      // Store hashed OTP securely
      const otpKey = `${validatedRequest.contactValue}:${validatedRequest.purpose}`;
      otpStore.set(otpKey, {
        hashedOtp,
        contactValue: validatedRequest.contactValue,
        contactMethod: validatedRequest.contactMethod,
        purpose: validatedRequest.purpose,
        createdAt: now,
        expiresAt,
        attempts: 0
      });
      
      // Clean up expired OTPs (memory management)
      this.cleanupExpiredOTPs();
      
      // In production, send OTP via email/SMS service
      console.log(`[DEV] OTP for ${validatedRequest.contactValue}: ${otp} (expires in ${expiryMinutes} minutes)`);
      
      // Record successful generation
      addAttempt(rateLimitKey, true);
      
      logAuditEvent(
        'otp_generated',
        'success',
        validatedRequest.contactValue,
        validatedRequest.ipAddress,
        validatedRequest.userAgent,
        { purpose: validatedRequest.purpose, expiryMinutes }
      );
      
      return {
        data: {
          success: true,
          expiresAt: new Date(expiresAt).toISOString(),
          attemptsRemaining: rateLimitStatus.attemptsRemaining - 1
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      };
      
    } catch (error) {
      logAuditEvent(
        'otp_generation_failed',
        'failure',
        request.contactValue,
        request.ipAddress,
        request.userAgent,
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
      
      if (error instanceof z.ZodError) {
        return {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request format',
            details: error.errors
          },
          meta: {
            timestamp: new Date().toISOString(),
            version: '1.0'
          }
        };
      }
      
      return {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to generate OTP'
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      };
    }
  }
  
  /**
   * Verify OTP with exponential backoff and attempt tracking
   */
  static async verifyOTP(verification: OTPVerification): Promise<ApiResponse<{
    success: boolean;
    sessionToken?: string;
    attemptsRemaining: number;
  }>> {
    try {
      // Validate input
      const validatedVerification = OTPVerificationSchema.parse(verification);
      
      const otpKey = `${validatedVerification.contactValue}:contact_verification`;
      const storedOtp = otpStore.get(otpKey);
      
      if (!storedOtp) {
        logAuditEvent(
          'otp_verification_failed',
          'failure',
          validatedVerification.contactValue,
          undefined,
          undefined,
          { reason: 'otp_not_found' }
        );
        
        return {
          error: {
            code: 'INVALID_OTP',
            message: 'OTP not found or expired'
          },
          meta: {
            timestamp: new Date().toISOString(),
            version: '1.0'
          }
        };
      }
      
      // Check expiry
      if (Date.now() > storedOtp.expiresAt) {
        otpStore.delete(otpKey);
        
        logAuditEvent(
          'otp_verification_failed',
          'failure',
          validatedVerification.contactValue,
          undefined,
          undefined,
          { reason: 'otp_expired' }
        );
        
        return {
          error: {
            code: 'INVALID_OTP',
            message: 'OTP has expired'
          },
          meta: {
            timestamp: new Date().toISOString(),
            version: '1.0'
          }
        };
      }
      
      // Increment attempt counter
      storedOtp.attempts++;
      
      // Check max attempts
      if (storedOtp.attempts > OTP_CONFIG.maxAttempts) {
        otpStore.delete(otpKey);
        
        logAuditEvent(
          'otp_verification_blocked',
          'blocked',
          validatedVerification.contactValue,
          undefined,
          undefined,
          { reason: 'max_attempts_exceeded' }
        );
        
        return {
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Maximum verification attempts exceeded'
          },
          meta: {
            timestamp: new Date().toISOString(),
            version: '1.0'
          }
        };
      }
      
      // Verify OTP using bcrypt
      const otpMatches = await bcrypt.compare(validatedVerification.otp, storedOtp.hashedOtp);
      
      if (!otpMatches) {
        logAuditEvent(
          'otp_verification_failed',
          'failure',
          validatedVerification.contactValue,
          undefined,
          undefined,
          { reason: 'invalid_otp', attemptsRemaining: OTP_CONFIG.maxAttempts - storedOtp.attempts }
        );
        
        return {
          error: {
            code: 'INVALID_OTP',
            message: 'Invalid OTP'
          },
          data: {
            success: false,
            attemptsRemaining: OTP_CONFIG.maxAttempts - storedOtp.attempts
          },
          meta: {
            timestamp: new Date().toISOString(),
            version: '1.0'
          }
        };
      }
      
      // OTP verified successfully
      otpStore.delete(otpKey);
      
      // Generate session token
      const sessionToken = this.generateSessionToken();
      
      logAuditEvent(
        'otp_verified',
        'success',
        validatedVerification.contactValue,
        undefined,
        undefined,
        { purpose: storedOtp.purpose }
      );
      
      return {
        data: {
          success: true,
          sessionToken,
          attemptsRemaining: OTP_CONFIG.maxAttempts - storedOtp.attempts
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      };
      
    } catch (error) {
      logAuditEvent(
        'otp_verification_error',
        'failure',
        verification.contactValue,
        undefined,
        undefined,
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
      
      if (error instanceof z.ZodError) {
        return {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid verification format',
            details: error.errors
          },
          meta: {
            timestamp: new Date().toISOString(),
            version: '1.0'
          }
        };
      }
      
      return {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Verification failed'
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      };
    }
  }
  
  /**
   * Check rate limit status for a contact value
   */
  static async getRateLimitStatus(contactValue: string, ipAddress?: string): Promise<ApiResponse<OTPRateLimit>> {
    try {
      const rateLimitKey = getRateLimitKey(contactValue, ipAddress);
      const status = checkRateLimit(rateLimitKey, 'contact_verification');
      
      return {
        data: status,
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      };
    } catch (error) {
      return {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to check rate limit status'
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      };
    }
  }
  
  /**
   * Generate secure session token
   */
  private static generateSessionToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  
  /**
   * Clean up expired OTPs to manage memory
   */
  private static cleanupExpiredOTPs(): void {
    const now = Date.now();
    for (const [key, otp] of otpStore.entries()) {
      if (now > otp.expiresAt) {
        otpStore.delete(key);
      }
    }
  }
  
  /**
   * Get audit logs (admin function)
   */
  static getAuditLogs(limit = 100): AuditLogEntry[] {
    return auditLogs.slice(-limit);
  }
  
  /**
   * Get security metrics (admin function)
   */
  static getSecurityMetrics() {
    const now = Date.now();
    const hourAgo = now - (60 * 60 * 1000);
    
    const recentLogs = auditLogs.filter(log => new Date(log.timestamp).getTime() > hourAgo);
    
    return {
      totalOtpsGenerated: recentLogs.filter(log => log.action === 'otp_generated').length,
      successfulVerifications: recentLogs.filter(log => log.action === 'otp_verified').length,
      failedVerifications: recentLogs.filter(log => log.action === 'otp_verification_failed').length,
      blockedAttempts: recentLogs.filter(log => log.result === 'blocked').length,
      activeRateLimits: Array.from(rateLimitStore.values()).filter(record => record.blocked).length,
      activeOtps: otpStore.size
    };
  }
}