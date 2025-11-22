import { z } from 'zod';
import { OTPSecurityService } from '../services/otpSecurityService';
import { SecurityMiddleware } from '../middleware/securityMiddleware';
import type { ApiResponse, OTPRequest, OTPVerification, OTPRateLimit } from '../types/backend';

// Request/Response types for API routes
interface APIRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: any;
  ip: string;
  userAgent: string;
  params?: Record<string, string>;
  query?: Record<string, string>;
}

interface APIResponse {
  status: number;
  headers: Record<string, string>;
  body: any;
}

/**
 * OTP Generation Endpoint: POST /api/otp/generate
 * 
 * Security Features:
 * - Rate limiting: 5 requests per 10 minutes per IP
 * - Input validation with Zod schemas
 * - bcrypt hashing for OTP storage
 * - IP-based tracking and blocking
 * - Comprehensive audit logging
 */
export async function generateOTP(req: APIRequest): Promise<APIResponse> {
  return SecurityMiddleware.apply(req, { status: 200, headers: {}, body: {} }, async () => {
    try {
      // Validate request method
      if (req.method !== 'POST') {
        return {
          status: 405,
          headers: { 'Allow': 'POST' },
          body: {
            error: {
              code: 'METHOD_NOT_ALLOWED',
              message: 'Only POST method is allowed'
            },
            meta: {
              timestamp: new Date().toISOString(),
              version: '1.0'
            }
          }
        };
      }

      // Parse and validate request body
      const otpRequest: OTPRequest = {
        contactMethod: req.body.contactMethod,
        contactValue: req.body.contactValue,
        purpose: req.body.purpose || 'contact_verification',
        ipAddress: req.ip,
        userAgent: req.userAgent
      };

      // Generate OTP using secure service
      const result = await OTPSecurityService.generateOTP(otpRequest);

      return {
        status: result.error ? 400 : 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        },
        body: result
      };

    } catch (error) {
      console.error('OTP generation error:', error);
      
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to generate OTP'
          },
          meta: {
            timestamp: new Date().toISOString(),
            version: '1.0'
          }
        }
      };
    }
  });
}

/**
 * OTP Verification Endpoint: POST /api/otp/verify
 * 
 * Security Features:
 * - Rate limiting: 10 attempts per 10 minutes per IP
 * - bcrypt comparison for OTP verification
 * - Exponential backoff for failed attempts
 * - Session token generation on success
 * - Attempt tracking and blocking
 */
export async function verifyOTP(req: APIRequest): Promise<APIResponse> {
  return SecurityMiddleware.apply(req, { status: 200, headers: {}, body: {} }, async () => {
    try {
      // Validate request method
      if (req.method !== 'POST') {
        return {
          status: 405,
          headers: { 'Allow': 'POST' },
          body: {
            error: {
              code: 'METHOD_NOT_ALLOWED',
              message: 'Only POST method is allowed'
            },
            meta: {
              timestamp: new Date().toISOString(),
              version: '1.0'
            }
          }
        };
      }

      // Parse and validate request body
      const verification: OTPVerification = {
        contactMethod: req.body.contactMethod,
        contactValue: req.body.contactValue,
        otp: req.body.otp,
        sessionToken: req.body.sessionToken
      };

      // Verify OTP using secure service
      const result = await OTPSecurityService.verifyOTP(verification);

      // Create secure session on successful verification
      if (result.data?.success && result.data.sessionToken) {
        const session = SecurityMiddleware.createSession(
          `user_${Date.now()}`, // Would be actual user ID from database
          req.ip,
          req.userAgent
        );

        // Update response with session information
        if (result.data) {
          result.data.sessionToken = session.sessionToken;
        }

        return {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': `skiin_session=${session.sessionToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`
          },
          body: result
        };
      }

      return {
        status: result.error ? (result.error.code === 'RATE_LIMIT_EXCEEDED' ? 429 : 400) : 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        },
        body: result
      };

    } catch (error) {
      console.error('OTP verification error:', error);
      
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to verify OTP'
          },
          meta: {
            timestamp: new Date().toISOString(),
            version: '1.0'
          }
        }
      };
    }
  });
}

/**
 * OTP Status Endpoint: GET /api/otp/status
 * 
 * Security Features:
 * - Rate limit status checking
 * - IP-based tracking
 * - No sensitive information exposure
 */
export async function getOTPStatus(req: APIRequest): Promise<APIResponse> {
  return SecurityMiddleware.apply(req, { status: 200, headers: {}, body: {} }, async () => {
    try {
      // Validate request method
      if (req.method !== 'GET') {
        return {
          status: 405,
          headers: { 'Allow': 'GET' },
          body: {
            error: {
              code: 'METHOD_NOT_ALLOWED',
              message: 'Only GET method is allowed'
            },
            meta: {
              timestamp: new Date().toISOString(),
              version: '1.0'
            }
          }
        };
      }

      // Get contact value from query parameters
      const contactValue = req.query?.contactValue;
      
      if (!contactValue) {
        return {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
          body: {
            error: {
              code: 'MISSING_PARAMETER',
              message: 'contactValue parameter is required'
            },
            meta: {
              timestamp: new Date().toISOString(),
              version: '1.0'
            }
          }
        };
      }

      // Get rate limit status
      const result = await OTPSecurityService.getRateLimitStatus(contactValue, req.ip);

      return {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        },
        body: result
      };

    } catch (error) {
      console.error('OTP status error:', error);
      
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to get OTP status'
          },
          meta: {
            timestamp: new Date().toISOString(),
            version: '1.0'
          }
        }
      };
    }
  });
}

/**
 * OTP Service Health Check: GET /api/otp/health
 * 
 * For monitoring and debugging purposes
 */
export async function getOTPHealth(req: APIRequest): Promise<APIResponse> {
  return SecurityMiddleware.apply(req, { status: 200, headers: {}, body: {} }, async () => {
    try {
      if (req.method !== 'GET') {
        return {
          status: 405,
          headers: { 'Allow': 'GET' },
          body: {
            error: {
              code: 'METHOD_NOT_ALLOWED',
              message: 'Only GET method is allowed'
            }
          }
        };
      }

      // Get security metrics
      const metrics = OTPSecurityService.getSecurityMetrics();

      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          data: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            metrics
          },
          meta: {
            timestamp: new Date().toISOString(),
            version: '1.0'
          }
        }
      };

    } catch (error) {
      console.error('OTP health check error:', error);
      
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'OTP service health check failed'
          },
          meta: {
            timestamp: new Date().toISOString(),
            version: '1.0'
          }
        }
      };
    }
  });
}

/**
 * Route handler mapping for OTP endpoints
 */
export const otpRoutes = {
  'POST /api/otp/generate': generateOTP,
  'POST /api/otp/verify': verifyOTP,
  'GET /api/otp/status': getOTPStatus,
  'GET /api/otp/health': getOTPHealth
};

/**
 * Express.js integration helper (for production deployment)
 */
export function setupOTPRoutes(app: any) {
  // Express.js route setup
  app.post('/api/otp/generate', async (req: any, res: any) => {
    const apiReq: APIRequest = {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'] || '',
      query: req.query
    };

    const response = await generateOTP(apiReq);
    
    Object.entries(response.headers).forEach(([key, value]) => {
      res.set(key, value);
    });
    
    res.status(response.status).json(response.body);
  });

  app.post('/api/otp/verify', async (req: any, res: any) => {
    const apiReq: APIRequest = {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'] || '',
      query: req.query
    };

    const response = await verifyOTP(apiReq);
    
    Object.entries(response.headers).forEach(([key, value]) => {
      res.set(key, value);
    });
    
    res.status(response.status).json(response.body);
  });

  app.get('/api/otp/status', async (req: any, res: any) => {
    const apiReq: APIRequest = {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'] || '',
      query: req.query
    };

    const response = await getOTPStatus(apiReq);
    
    Object.entries(response.headers).forEach(([key, value]) => {
      res.set(key, value);
    });
    
    res.status(response.status).json(response.body);
  });

  app.get('/api/otp/health', async (req: any, res: any) => {
    const apiReq: APIRequest = {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'] || '',
      query: req.query
    };

    const response = await getOTPHealth(apiReq);
    
    Object.entries(response.headers).forEach(([key, value]) => {
      res.set(key, value);
    });
    
    res.status(response.status).json(response.body);
  });
  // Console statement removed by ESLint fix
}

// Development testing utilities
export const otpTestUtils = {
  /**
   * Test OTP generation with various scenarios
   */
  async testOTPGeneration() {
  // Console statement removed by ESLint fix
    const testCases = [
      {
        name: 'Valid email OTP',
        request: {
          method: 'POST',
          url: '/api/otp/generate',
          headers: { 'content-type': 'application/json' },
          body: {
            contactMethod: 'email',
            contactValue: 'test@skiin.ch',
            purpose: 'contact_verification'
          },
          ip: '127.0.0.1',
          userAgent: 'TestAgent/1.0'
        }
      },
      {
        name: 'Valid Swiss phone OTP',
        request: {
          method: 'POST',
          url: '/api/otp/generate',
          headers: { 'content-type': 'application/json' },
          body: {
            contactMethod: 'phone',
            contactValue: '+41791234567',
            purpose: 'contact_verification'
          },
          ip: '127.0.0.1',
          userAgent: 'TestAgent/1.0'
        }
      },
      {
        name: 'Invalid email format',
        request: {
          method: 'POST',
          url: '/api/otp/generate',
          headers: { 'content-type': 'application/json' },
          body: {
            contactMethod: 'email',
            contactValue: 'invalid-email',
            purpose: 'contact_verification'
          },
          ip: '127.0.0.1',
          userAgent: 'TestAgent/1.0'
        }
      }
    ];

    for (const testCase of testCases) {
  // Console statement removed by ESLint fix
      const response = await generateOTP(testCase.request);
  // Console statement removed by ESLint fix
      console.log(`Response:`, JSON.stringify(response.body, null, 2));
    }
  },

  /**
   * Test rate limiting behavior
   */
  async testRateLimiting() {
  // Console statement removed by ESLint fix
    const request = {
      method: 'POST',
      url: '/api/otp/generate',
      headers: { 'content-type': 'application/json' },
      body: {
        contactMethod: 'email',
        contactValue: 'rate-limit-test@skiin.ch',
        purpose: 'contact_verification'
      },
      ip: '192.168.1.100',
      userAgent: 'RateLimitTest/1.0'
    };

    // Send 7 requests to trigger rate limiting (limit is 5)
    for (let i = 1; i <= 7; i++) {
  // Console statement removed by ESLint fix
      const response = await generateOTP(request);
  // Console statement removed by ESLint fix
      if (response.status === 429) {
  // Console statement removed by ESLint fix
  // Console statement removed by ESLint fix
        break;
      }
    }
  }
};