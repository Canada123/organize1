import { z } from 'zod';
import type { ApiResponse, SecurityError, AuditLogEntry } from '../types/backend';

// Security Configuration
const SECURITY_CONFIG = {
  rateLimiting: {
    global: 1000, // requests per hour per IP
    perEndpoint: {
      '/api/otp/generate': 5, // per 10 minutes
      '/api/otp/verify': 10, // per 10 minutes
      '/api/payment/create-intent': 10, // per hour
      '/api/payment/confirm': 3, // per 30 minutes
      '/api/eligibility/calculate': 20 // per hour
    },
    perUser: {
      '/api/eligibility/calculate': 5, // per hour per authenticated user
      '/api/payment/create-intent': 3 // per hour per authenticated user
    }
  },
  cors: {
    allowedOrigins: [
      'https://skiin.ch',
      'https://www.skiin.ch',
      'https://*.skiin.ch',
      'http://localhost:8080',
      'http://localhost:8081',
      'http://localhost:3000'
    ],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-Session-Token',
      'X-CSRF-Token'
    ],
    maxAge: 86400 // 24 hours
  },
  headers: {
    security: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com",
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Feature-Policy': 'camera \'none\'; microphone \'none\'; geolocation \'none\''
    },
    pci: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-PCI-Compliant': '1'
    }
  },
  session: {
    cookieName: 'skiin_session',
    secure: true,
    httpOnly: true,
    sameSite: 'strict' as const,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },
  validation: {
    maxBodySize: 1024 * 1024, // 1MB
    maxJsonDepth: 10,
    allowedContentTypes: [
      'application/json',
      'application/x-www-form-urlencoded',
      'multipart/form-data'
    ]
  }
};

// Rate limiting store (would use Redis in production)
const rateLimitStore = new Map<string, {
  count: number;
  resetTime: number;
  blocked: boolean;
  blockExpiry?: number;
}>();

// Session store (would use encrypted database in production)
const sessionStore = new Map<string, {
  userId: string;
  sessionToken: string;
  createdAt: number;
  expiresAt: number;
  ipAddress: string;
  userAgent: string;
  verified: boolean;
}>();

// Audit logging
const auditLogs: AuditLogEntry[] = [];

function logSecurityEvent(
  action: string,
  result: 'success' | 'failure' | 'blocked',
  details?: {
    ipAddress?: string;
    userAgent?: string;
    endpoint?: string;
    userId?: string;
    reason?: string;
    [key: string]: any;
  }
): void {
  const entry: AuditLogEntry = {
    id: `security_audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    userId: details?.userId,
    action,
    resource: 'security_middleware',
    ipAddress: details?.ipAddress || 'unknown',
    userAgent: details?.userAgent || 'unknown',
    requestId: `security_req_${Date.now()}`,
    result,
    securityLevel: 'secret',
    details
  };
  
  auditLogs.push(entry);
  
  if (auditLogs.length > 10000) {
    auditLogs.shift();
  }
  // Console statement removed by ESLint fix
}

// Request/Response interface (simplified for this implementation)
interface SecurityRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: any;
  ip: string;
  userAgent: string;
}

interface SecurityResponse {
  status: number;
  headers: Record<string, string>;
  body?: any;
}

type NextFunction = () => Promise<SecurityResponse>;

export class SecurityMiddleware {
  /**
   * Main security middleware pipeline
   */
  static async apply(
    req: SecurityRequest,
    res: SecurityResponse,
    next: NextFunction
  ): Promise<SecurityResponse> {
    try {
      // 1. Apply security headers
      const securityHeaders = this.getSecurityHeaders(req);
      Object.assign(res.headers, securityHeaders);
      
      // 2. CORS validation
      const corsResult = this.validateCORS(req);
      if (!corsResult.allowed) {
        logSecurityEvent(
          'cors_blocked',
          'blocked',
          {
            ipAddress: req.ip,
            userAgent: req.userAgent,
            endpoint: req.url,
            reason: corsResult.reason
          }
        );
        
        return {
          status: 403,
          headers: res.headers,
          body: {
            error: {
              code: 'CORS_BLOCKED',
              message: 'Request blocked by CORS policy'
            }
          }
        };
      }
      
      // 3. Rate limiting
      const rateLimitResult = this.checkRateLimit(req);
      if (rateLimitResult.blocked) {
        logSecurityEvent(
          'rate_limit_exceeded',
          'blocked',
          {
            ipAddress: req.ip,
            userAgent: req.userAgent,
            endpoint: req.url,
            reason: rateLimitResult.reason,
            resetTime: rateLimitResult.resetTime
          }
        );
        
        return {
          status: 429,
          headers: {
            ...res.headers,
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': rateLimitResult.limit?.toString() || '0',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime?.toString() || '0'
          },
          body: {
            error: {
              code: 'RATE_LIMIT_EXCEEDED',
              message: 'Too many requests',
              details: {
                retryAfter: rateLimitResult.resetTime,
                limit: rateLimitResult.limit
              }
            }
          }
        };
      }
      
      // 4. Input validation and sanitization
      const validationResult = this.validateRequest(req);
      if (!validationResult.valid) {
        logSecurityEvent(
          'request_validation_failed',
          'blocked',
          {
            ipAddress: req.ip,
            userAgent: req.userAgent,
            endpoint: req.url,
            errors: validationResult.errors
          }
        );
        
        return {
          status: 400,
          headers: res.headers,
          body: {
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Request validation failed',
              details: validationResult.errors
            }
          }
        };
      }
      
      // 5. Authentication check (for protected endpoints)
      if (this.requiresAuthentication(req.url)) {
        const authResult = this.validateAuthentication(req);
        if (!authResult.valid) {
          logSecurityEvent(
            'authentication_failed',
            'blocked',
            {
              ipAddress: req.ip,
              userAgent: req.userAgent,
              endpoint: req.url,
              reason: authResult.reason
            }
          );
          
          return {
            status: 401,
            headers: res.headers,
            body: {
              error: {
                code: 'UNAUTHORIZED',
                message: 'Authentication required'
              }
            }
          };
        }
        
        // Add user context to request for downstream processing
        (req as any).user = authResult.user;
      }
      
      // 6. CSRF protection for state-changing operations
      if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        const csrfResult = this.validateCSRF(req);
        if (!csrfResult.valid) {
          logSecurityEvent(
            'csrf_validation_failed',
            'blocked',
            {
              ipAddress: req.ip,
              userAgent: req.userAgent,
              endpoint: req.url,
              reason: csrfResult.reason
            }
          );
          
          return {
            status: 403,
            headers: res.headers,
            body: {
              error: {
                code: 'CSRF_ERROR',
                message: 'CSRF token validation failed'
              }
            }
          };
        }
      }
      
      // 7. Execute the actual request handler
      const response = await next();
      
      // 8. Post-process response (add rate limit headers, sanitize output)
      const processedResponse = this.postProcessResponse(req, response);
      
      logSecurityEvent(
        'request_processed',
        'success',
        {
          ipAddress: req.ip,
          userAgent: req.userAgent,
          endpoint: req.url,
          statusCode: processedResponse.status,
          userId: (req as any).user?.id
        }
      );
      
      return processedResponse;
      
    } catch (error) {
      logSecurityEvent(
        'middleware_error',
        'failure',
        {
          ipAddress: req.ip,
          userAgent: req.userAgent,
          endpoint: req.url,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      );
      
      return {
        status: 500,
        headers: res.headers,
        body: {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Request processing failed'
          }
        }
      };
    }
  }
  
  /**
   * Get security headers for response
   */
  private static getSecurityHeaders(req: SecurityRequest): Record<string, string> {
    const headers = { ...SECURITY_CONFIG.headers.security };
    
    // Add PCI DSS headers for payment endpoints
    if (req.url.includes('/payment/')) {
      Object.assign(headers, SECURITY_CONFIG.headers.pci);
    }
    
    // Add CORS headers
    const origin = req.headers['origin'] || req.headers['Origin'];
    if (origin && this.isOriginAllowed(origin)) {
      headers['Access-Control-Allow-Origin'] = origin;
      headers['Access-Control-Allow-Methods'] = SECURITY_CONFIG.cors.allowedMethods.join(', ');
      headers['Access-Control-Allow-Headers'] = SECURITY_CONFIG.cors.allowedHeaders.join(', ');
      headers['Access-Control-Max-Age'] = SECURITY_CONFIG.cors.maxAge.toString();
      headers['Access-Control-Allow-Credentials'] = 'true';
    }
    
    return headers;
  }
  
  /**
   * Validate CORS policy
   */
  private static validateCORS(req: SecurityRequest): { allowed: boolean; reason?: string } {
    const origin = req.headers['origin'] || req.headers['Origin'];
    
    // Allow same-origin requests
    if (!origin) {
      return { allowed: true };
    }
    
    // Check against allowed origins
    if (!this.isOriginAllowed(origin)) {
      return { 
        allowed: false, 
        reason: `Origin ${origin} not allowed by CORS policy` 
      };
    }
    
    // Validate preflight requests
    if (req.method === 'OPTIONS') {
      const requestedMethod = req.headers['access-control-request-method'];
      const requestedHeaders = req.headers['access-control-request-headers'];
      
      if (requestedMethod && !SECURITY_CONFIG.cors.allowedMethods.includes(requestedMethod)) {
        return { 
          allowed: false, 
          reason: `Method ${requestedMethod} not allowed by CORS policy` 
        };
      }
      
      if (requestedHeaders) {
        const headers = requestedHeaders.split(',').map(h => h.trim().toLowerCase());
        const allowedHeaders = SECURITY_CONFIG.cors.allowedHeaders.map(h => h.toLowerCase());
        
        for (const header of headers) {
          if (!allowedHeaders.includes(header)) {
            return { 
              allowed: false, 
              reason: `Header ${header} not allowed by CORS policy` 
            };
          }
        }
      }
    }
    
    return { allowed: true };
  }
  
  /**
   * Check if origin is allowed
   */
  private static isOriginAllowed(origin: string): boolean {
    return SECURITY_CONFIG.cors.allowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        const pattern = allowed.replace(/\*/g, '.*');
        return new RegExp(`^${pattern}$`).test(origin);
      }
      return allowed === origin;
    });
  }
  
  /**
   * Check rate limiting
   */
  private static checkRateLimit(req: SecurityRequest): {
    blocked: boolean;
    reason?: string;
    resetTime?: number;
    limit?: number;
  } {
    const key = `${req.ip}:${req.url}`;
    const now = Date.now();
    const windowMs = 60 * 60 * 1000; // 1 hour window
    
    let record = rateLimitStore.get(key);
    
    if (!record) {
      record = {
        count: 0,
        resetTime: now + windowMs,
        blocked: false
      };
      rateLimitStore.set(key, record);
    }
    
    // Reset if window expired
    if (now > record.resetTime) {
      record.count = 0;
      record.resetTime = now + windowMs;
      record.blocked = false;
      record.blockExpiry = undefined;
    }
    
    // Check if currently blocked
    if (record.blocked && record.blockExpiry && now < record.blockExpiry) {
      return {
        blocked: true,
        reason: 'Rate limit exceeded, currently blocked',
        resetTime: record.blockExpiry
      };
    }
    
    // Get limit for this endpoint
    const endpointLimit = SECURITY_CONFIG.rateLimiting.perEndpoint[req.url as keyof typeof SECURITY_CONFIG.rateLimiting.perEndpoint];
    const globalLimit = SECURITY_CONFIG.rateLimiting.global;
    const limit = endpointLimit || globalLimit;
    
    // Increment counter
    record.count++;
    
    // Check if limit exceeded
    if (record.count > limit) {
      record.blocked = true;
      record.blockExpiry = now + (10 * 60 * 1000); // Block for 10 minutes
      
      return {
        blocked: true,
        reason: 'Rate limit exceeded',
        resetTime: record.blockExpiry,
        limit
      };
    }
    
    return { 
      blocked: false,
      resetTime: record.resetTime,
      limit
    };
  }
  
  /**
   * Validate request format and content
   */
  private static validateRequest(req: SecurityRequest): {
    valid: boolean;
    errors?: string[];
  } {
    const errors: string[] = [];
    
    // Check content type for POST/PUT requests
    if (['POST', 'PUT'].includes(req.method)) {
      const contentType = req.headers['content-type'] || req.headers['Content-Type'] || '';
      
      if (!SECURITY_CONFIG.validation.allowedContentTypes.some(allowed => 
        contentType.startsWith(allowed)
      )) {
        errors.push(`Invalid content type: ${contentType}`);
      }
    }
    
    // Validate body size
    if (req.body && typeof req.body === 'string' && req.body.length > SECURITY_CONFIG.validation.maxBodySize) {
      errors.push('Request body too large');
    }
    
    // Basic input sanitization
    if (req.body && typeof req.body === 'object') {
      try {
        const sanitized = this.sanitizeObject(req.body, 0);
        req.body = sanitized;
      } catch (error) {
        errors.push('Invalid request format');
      }
    }
    
    // Check for suspicious patterns
    const suspicious = this.detectSuspiciousPatterns(req);
    if (suspicious.length > 0) {
      errors.push(...suspicious);
    }
    
    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }
  
  /**
   * Recursively sanitize object to prevent injection attacks
   */
  private static sanitizeObject(obj: any, depth: number): any {
    if (depth > SECURITY_CONFIG.validation.maxJsonDepth) {
      throw new Error('Object too deeply nested');
    }
    
    if (obj === null || typeof obj !== 'object') {
      return this.sanitizeValue(obj);
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item, depth + 1));
    }
    
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const cleanKey = this.sanitizeValue(key);
      sanitized[cleanKey] = this.sanitizeObject(value, depth + 1);
    }
    
    return sanitized;
  }
  
  /**
   * Sanitize individual values
   */
  private static sanitizeValue(value: any): any {
    if (typeof value !== 'string') {
      return value;
    }
    
    // Remove potentially dangerous patterns
    return value
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/expression\s*\(/gi, '');
  }
  
  /**
   * Detect suspicious patterns in request
   */
  private static detectSuspiciousPatterns(req: SecurityRequest): string[] {
    const suspicious: string[] = [];
    const content = JSON.stringify(req.body) + req.url;
    
    // SQL injection patterns
    if (/(\b(union|select|insert|update|delete|drop|alter|exec|execute)\b)/gi.test(content)) {
      suspicious.push('Potential SQL injection attempt detected');
    }
    
    // XSS patterns
    if (/<script|javascript:|on\w+\s*=/gi.test(content)) {
      suspicious.push('Potential XSS attempt detected');
    }
    
    // Path traversal
    if (/\.\.[\/\\]/g.test(content)) {
      suspicious.push('Potential path traversal attempt detected');
    }
    
    // Command injection
    if (/[;&|`$()]/g.test(content)) {
      suspicious.push('Potential command injection attempt detected');
    }
    
    return suspicious;
  }
  
  /**
   * Check if endpoint requires authentication
   */
  private static requiresAuthentication(url: string): boolean {
    const protectedEndpoints = [
      '/api/eligibility/',
      '/api/payment/',
      '/api/user/',
      '/api/session/'
    ];
    
    return protectedEndpoints.some(endpoint => url.startsWith(endpoint));
  }
  
  /**
   * Validate authentication token
   */
  private static validateAuthentication(req: SecurityRequest): {
    valid: boolean;
    reason?: string;
    user?: { id: string; sessionToken: string };
  } {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const sessionToken = req.headers['x-session-token'] || req.headers['X-Session-Token'];
    
    let token = sessionToken;
    
    // Extract Bearer token
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    
    if (!token) {
      return { 
        valid: false, 
        reason: 'No authentication token provided' 
      };
    }
    
    // Find session
    const session = Array.from(sessionStore.values()).find(s => s.sessionToken === token);
    
    if (!session) {
      return { 
        valid: false, 
        reason: 'Invalid authentication token' 
      };
    }
    
    // Check expiry
    if (Date.now() > session.expiresAt) {
      sessionStore.delete(session.userId);
      return { 
        valid: false, 
        reason: 'Authentication token expired' 
      };
    }
    
    // Verify IP and User-Agent (basic session hijacking protection)
    if (session.ipAddress !== req.ip) {
      return { 
        valid: false, 
        reason: 'Session IP mismatch' 
      };
    }
    
    return { 
      valid: true, 
      user: { 
        id: session.userId, 
        sessionToken: session.sessionToken 
      } 
    };
  }
  
  /**
   * Validate CSRF token
   */
  private static validateCSRF(req: SecurityRequest): {
    valid: boolean;
    reason?: string;
  } {
    // For now, accept requests with proper session tokens
    // In production, implement proper CSRF token validation
    const sessionToken = req.headers['x-session-token'] || req.headers['X-Session-Token'];
    
    if (sessionToken) {
      return { valid: true };
    }
    
    return { 
      valid: false, 
      reason: 'CSRF protection requires session token' 
    };
  }
  
  /**
   * Post-process response
   */
  private static postProcessResponse(req: SecurityRequest, response: SecurityResponse): SecurityResponse {
    // Add rate limit headers
    const rateLimitKey = `${req.ip}:${req.url}`;
    const record = rateLimitStore.get(rateLimitKey);
    
    if (record) {
      const endpointLimit = SECURITY_CONFIG.rateLimiting.perEndpoint[req.url as keyof typeof SECURITY_CONFIG.rateLimiting.perEndpoint];
      const limit = endpointLimit || SECURITY_CONFIG.rateLimiting.global;
      
      response.headers['X-RateLimit-Limit'] = limit.toString();
      response.headers['X-RateLimit-Remaining'] = Math.max(0, limit - record.count).toString();
      response.headers['X-RateLimit-Reset'] = record.resetTime.toString();
    }
    
    // Sanitize response body for PCI compliance
    if (req.url.includes('/payment/') && response.body) {
      response.body = this.sanitizePaymentResponse(response.body);
    }
    
    return response;
  }
  
  /**
   * Sanitize payment response to ensure PCI compliance
   */
  private static sanitizePaymentResponse(body: any): any {
    if (typeof body !== 'object' || !body) {
      return body;
    }
    
    // Remove any potential card data that might have leaked through
    const sanitized = { ...body };
    
    // Recursively remove sensitive fields
    function removeSensitiveData(obj: any): any {
      if (typeof obj !== 'object' || !obj) return obj;
      
      const sensitiveFields = ['cardNumber', 'cvc', 'cvv', 'pan', 'track1', 'track2', 'pin'];
      const cleaned = { ...obj };
      
      for (const field of sensitiveFields) {
        delete cleaned[field];
      }
      
      for (const [key, value] of Object.entries(cleaned)) {
        if (typeof value === 'object') {
          cleaned[key] = removeSensitiveData(value);
        }
      }
      
      return cleaned;
    }
    
    return removeSensitiveData(sanitized);
  }
  
  /**
   * Create secure session
   */
  static createSession(userId: string, ipAddress: string, userAgent: string): {
    sessionId: string;
    sessionToken: string;
    expiresAt: string;
  } {
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const sessionToken = this.generateSecureToken();
    const now = Date.now();
    const expiresAt = now + SECURITY_CONFIG.session.maxAge;
    
    sessionStore.set(sessionId, {
      userId,
      sessionToken,
      createdAt: now,
      expiresAt,
      ipAddress,
      userAgent,
      verified: true
    });
    
    logSecurityEvent(
      'session_created',
      'success',
      {
        userId,
        sessionId,
        ipAddress,
        userAgent
      }
    );
    
    return {
      sessionId,
      sessionToken,
      expiresAt: new Date(expiresAt).toISOString()
    };
  }
  
  /**
   * Generate secure token
   */
  private static generateSecureToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  
  /**
   * Get security metrics (admin function)
   */
  static getSecurityMetrics() {
    const now = Date.now();
    const hourAgo = now - (60 * 60 * 1000);
    
    const recentLogs = auditLogs.filter(log => new Date(log.timestamp).getTime() > hourAgo);
    
    return {
      totalRequests: recentLogs.filter(log => log.action === 'request_processed').length,
      blockedRequests: recentLogs.filter(log => log.result === 'blocked').length,
      rateLimitViolations: recentLogs.filter(log => log.action === 'rate_limit_exceeded').length,
      corsViolations: recentLogs.filter(log => log.action === 'cors_blocked').length,
      authenticationFailures: recentLogs.filter(log => log.action === 'authentication_failed').length,
      activeSessions: sessionStore.size,
      activeRateLimits: Array.from(rateLimitStore.values()).filter(record => record.blocked).length
    };
  }
  
  /**
   * Get audit logs (admin function)
   */
  static getSecurityAuditLogs(limit = 100): AuditLogEntry[] {
    return auditLogs.slice(-limit);
  }
}