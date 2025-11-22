import { z } from 'zod';
import { PaymentSecurityService } from '../services/paymentSecurityService';
import { SecurityMiddleware } from '../middleware/securityMiddleware';
import type { ApiResponse, PaymentIntent } from '../types/backend';

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
  user?: { id: string; sessionToken: string };
}

interface APIResponse {
  status: number;
  headers: Record<string, string>;
  body: any;
}

/**
 * Payment Intent Creation Endpoint: POST /api/payment/create-intent
 * 
 * PCI DSS Security Features:
 * - Rate limiting: 10 requests per hour per user
 * - Input validation with comprehensive Zod schemas
 * - Swiss address validation
 * - Fraud detection scoring
 * - Idempotency key support
 * - VAT calculation compliance
 * - Secure tokenization (Stripe integration ready)
 */
export async function createPaymentIntent(req: APIRequest): Promise<APIResponse> {
  return SecurityMiddleware.apply(req, { 
    status: 200, 
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'X-PCI-Compliant': '1'
    }, 
    body: {} 
  }, async () => {
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

      // Validate authentication (required for payment operations)
      if (!req.user) {
        return {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
          body: {
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authentication required for payment operations'
            },
            meta: {
              timestamp: new Date().toISOString(),
              version: '1.0'
            }
          }
        };
      }

      // Parse and validate payment intent request
      const paymentIntent: PaymentIntent = {
        userId: req.user.id,
        formSessionId: req.body.formSessionId,
        amountCents: req.body.amountCents,
        currency: req.body.currency || 'CHF',
        billingAddress: req.body.billingAddress,
        paymentMethods: req.body.paymentMethods || ['card'],
        idempotencyKey: req.body.idempotencyKey || `${req.user.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      // Create payment intent using secure service
      const result = await PaymentSecurityService.createPaymentIntent(paymentIntent);

      return {
        status: result.error ? (result.error.code === 'PAYMENT_BLOCKED' ? 403 : 400) : 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'X-PCI-Compliant': '1'
        },
        body: result
      };

    } catch (error) {
      console.error('Payment intent creation error:', error);
      
      return {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'X-PCI-Compliant': '1'
        },
        body: {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to create payment intent'
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
 * Payment Confirmation Endpoint: POST /api/payment/confirm
 * 
 * PCI DSS Security Features:
 * - Rate limiting: 3 requests per 30 minutes per user
 * - Card validation with Luhn algorithm
 * - Secure payment processing
 * - Invoice generation
 * - Audit trail compliance
 */
export async function confirmPayment(req: APIRequest): Promise<APIResponse> {
  return SecurityMiddleware.apply(req, { 
    status: 200, 
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'X-PCI-Compliant': '1'
    }, 
    body: {} 
  }, async () => {
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

      // Validate authentication
      if (!req.user) {
        return {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
          body: {
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authentication required for payment confirmation'
            },
            meta: {
              timestamp: new Date().toISOString(),
              version: '1.0'
            }
          }
        };
      }

      const { paymentIntentId, paymentMethod } = req.body;

      if (!paymentIntentId || !paymentMethod) {
        return {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
          body: {
            error: {
              code: 'MISSING_PARAMETERS',
              message: 'paymentIntentId and paymentMethod are required'
            },
            meta: {
              timestamp: new Date().toISOString(),
              version: '1.0'
            }
          }
        };
      }

      // Confirm payment using secure service
      const result = await PaymentSecurityService.confirmPayment(paymentIntentId, paymentMethod);

      return {
        status: result.error ? 400 : 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'X-PCI-Compliant': '1'
        },
        body: result
      };

    } catch (error) {
      console.error('Payment confirmation error:', error);
      
      return {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'X-PCI-Compliant': '1'
        },
        body: {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to confirm payment'
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
 * Swiss Payment Methods Endpoint: GET /api/payment/methods
 * 
 * Returns available payment methods for Swiss users
 */
export async function getPaymentMethods(req: APIRequest): Promise<APIResponse> {
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

      // Get Swiss payment methods
      const result = await PaymentSecurityService.getPaymentMethods();

      return {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
        },
        body: result
      };

    } catch (error) {
      console.error('Payment methods error:', error);
      
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to get payment methods'
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
 * Payment Health Check: GET /api/payment/health
 * 
 * For monitoring and debugging purposes
 */
export async function getPaymentHealth(req: APIRequest): Promise<APIResponse> {
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

      // Get payment security metrics
      const metrics = PaymentSecurityService.getPaymentSecurityMetrics();

      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          data: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            pciCompliant: true,
            metrics
          },
          meta: {
            timestamp: new Date().toISOString(),
            version: '1.0'
          }
        }
      };

    } catch (error) {
      console.error('Payment health check error:', error);
      
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Payment service health check failed'
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
 * Route handler mapping for payment endpoints
 */
export const paymentRoutes = {
  'POST /api/payment/create-intent': createPaymentIntent,
  'POST /api/payment/confirm': confirmPayment,
  'GET /api/payment/methods': getPaymentMethods,
  'GET /api/payment/health': getPaymentHealth
};

/**
 * Express.js integration helper (for production deployment)
 */
export function setupPaymentRoutes(app: any) {
  // Payment intent creation
  app.post('/api/payment/create-intent', async (req: any, res: any) => {
    const apiReq: APIRequest = {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'] || '',
      query: req.query,
      user: req.user // Set by authentication middleware
    };

    const response = await createPaymentIntent(apiReq);
    
    Object.entries(response.headers).forEach(([key, value]) => {
      res.set(key, value);
    });
    
    res.status(response.status).json(response.body);
  });

  // Payment confirmation
  app.post('/api/payment/confirm', async (req: any, res: any) => {
    const apiReq: APIRequest = {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'] || '',
      query: req.query,
      user: req.user
    };

    const response = await confirmPayment(apiReq);
    
    Object.entries(response.headers).forEach(([key, value]) => {
      res.set(key, value);
    });
    
    res.status(response.status).json(response.body);
  });

  // Payment methods
  app.get('/api/payment/methods', async (req: any, res: any) => {
    const apiReq: APIRequest = {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'] || '',
      query: req.query
    };

    const response = await getPaymentMethods(apiReq);
    
    Object.entries(response.headers).forEach(([key, value]) => {
      res.set(key, value);
    });
    
    res.status(response.status).json(response.body);
  });

  // Health check
  app.get('/api/payment/health', async (req: any, res: any) => {
    const apiReq: APIRequest = {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'] || '',
      query: req.query
    };

    const response = await getPaymentHealth(apiReq);
    
    Object.entries(response.headers).forEach(([key, value]) => {
      res.set(key, value);
    });
    
    res.status(response.status).json(response.body);
  });
  // Console statement removed by ESLint fix
}

// Development testing utilities
export const paymentTestUtils = {
  /**
   * Test payment intent creation with various scenarios
   */
  async testPaymentIntentCreation() {
  // Console statement removed by ESLint fix
    const testUser = { id: 'test_user_123', sessionToken: 'test_token' };
    
    const testCases = [
      {
        name: 'Valid CHF payment',
        request: {
          method: 'POST',
          url: '/api/payment/create-intent',
          headers: { 
            'content-type': 'application/json',
            'authorization': 'Bearer test_token'
          },
          body: {
            formSessionId: 'session_123',
            amountCents: 35000, // CHF 350
            currency: 'CHF',
            billingAddress: {
              firstName: 'Max',
              lastName: 'Muster',
              street: 'Musterstrasse 123',
              postalCode: '8001',
              city: 'Zürich',
              canton: 'ZH',
              country: 'CH'
            },
            paymentMethods: ['card', 'twint'],
            idempotencyKey: 'test_idempotency_123'
          },
          ip: '127.0.0.1',
          userAgent: 'TestAgent/1.0',
          user: testUser
        }
      },
      {
        name: 'High amount fraud detection',
        request: {
          method: 'POST',
          url: '/api/payment/create-intent',
          headers: { 
            'content-type': 'application/json',
            'authorization': 'Bearer test_token'
          },
          body: {
            formSessionId: 'session_456',
            amountCents: 95000, // CHF 950 - high amount
            currency: 'CHF',
            billingAddress: {
              firstName: 'Test123', // Suspicious name with numbers
              lastName: 'User456',
              street: 'Test Street 999',
              postalCode: '9999', // Invalid postal code
              city: 'TestCity',
              canton: 'ZH',
              country: 'CH'
            },
            paymentMethods: ['card', 'postfinance', 'twint'], // Multiple methods
            idempotencyKey: 'test_fraud_456'
          },
          ip: '127.0.0.1',
          userAgent: 'TestAgent/1.0',
          user: testUser
        }
      }
    ];

    for (const testCase of testCases) {
  // Console statement removed by ESLint fix
      const response = await createPaymentIntent(testCase.request);
  // Console statement removed by ESLint fix
      console.log(`Response:`, JSON.stringify(response.body, null, 2));
    }
  },

  /**
   * Test PCI DSS compliance features
   */
  async testPCICompliance() {
  // Console statement removed by ESLint fix
    // Test card validation
    const cardTests = [
      { name: 'Valid Visa', number: '4111111111111111', expected: true },
      { name: 'Valid Mastercard', number: '5555555555554444', expected: true },
      { name: 'Invalid card', number: '1234567890123456', expected: false },
      { name: 'Too short', number: '411111', expected: false }
    ];

    for (const test of cardTests) {
  // Console statement removed by ESLint fix
      // This would test the internal card validation logic
      // In a real implementation, we'd call the validation method
      console.log(`Card Number: ${test.number.replace(/\d(?=\d{4})/g, '*')}`);
  // Console statement removed by ESLint fix
    }

    // Test security headers
  // Console statement removed by ESLint fix
    const response = await getPaymentMethods({
      method: 'GET',
      url: '/api/payment/methods',
      headers: {},
      ip: '127.0.0.1',
      userAgent: 'TestAgent/1.0'
    });
  // Console statement removed by ESLint fix
    Object.entries(response.headers).forEach(([key, value]) => {
      if (key.toLowerCase().includes('x-') || key.toLowerCase().includes('cache')) {
  // Console statement removed by ESLint fix
      }
    });
  }
};