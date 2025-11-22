import { z } from 'zod';
import { SwissHealthcareService } from '../services/swissHealthcareService';
import { SecurityMiddleware } from '../middleware/securityMiddleware';
import type { ApiResponse, EligibilityRequest, EligibilityResult } from '../types/backend';

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
 * Eligibility Calculation Endpoint: POST /api/eligibility/calculate
 * 
 * Swiss Healthcare Compliance Features:
 * - Rate limiting: 20 requests per hour per user
 * - Swiss insurance model validation
 * - GDPR consent verification
 * - Medical data classification
 * - Canton-specific cost calculation
 * - GP referral requirement assessment
 * - Contraindication screening
 * - Urgency level determination
 */
export async function calculateEligibility(req: APIRequest): Promise<APIResponse> {
  return SecurityMiddleware.apply(req, { 
    status: 200, 
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Medical-Data-Classification': 'secret'
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

      // Validate authentication (required for medical operations)
      if (!req.user) {
        return {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
          body: {
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authentication required for eligibility calculation'
            },
            meta: {
              timestamp: new Date().toISOString(),
              version: '1.0'
            }
          }
        };
      }

      // Parse and validate eligibility request
      const eligibilityRequest: EligibilityRequest = {
        userId: req.user.id,
        sessionId: req.body.sessionId,
        personalInfo: {
          dateOfBirth: req.body.personalInfo?.dateOfBirth,
          canton: req.body.personalInfo?.canton,
          insuranceProvider: req.body.personalInfo?.insuranceProvider,
          insuranceModel: req.body.personalInfo?.insuranceModel,
          insuranceNumber: req.body.personalInfo?.insuranceNumber
        },
        medicalInfo: {
          hasCardiacSymptoms: req.body.medicalInfo?.hasCardiacSymptoms || false,
          takesCardiacMedication: req.body.medicalInfo?.takesCardiacMedication || false,
          hasCardiacHistory: req.body.medicalInfo?.hasCardiacHistory || false,
          contraindications: req.body.medicalInfo?.contraindications || [],
          riskFactors: req.body.medicalInfo?.riskFactors || []
        },
        consentGiven: req.body.consentGiven || false,
        dataProcessingConsent: req.body.dataProcessingConsent || false
      };

      // Calculate eligibility using Swiss healthcare service
      const result = await SwissHealthcareService.calculateEligibility(eligibilityRequest);

      return {
        status: result.error ? (result.error.code === 'CONSENT_REQUIRED' ? 403 : 400) : 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'X-Medical-Data-Classification': 'secret'
        },
        body: result
      };

    } catch (error) {
      console.error('Eligibility calculation error:', error);
      
      return {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'X-Medical-Data-Classification': 'secret'
        },
        body: {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to calculate eligibility'
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
 * Form Submission Endpoint: POST /api/eligibility/submit
 * 
 * Handles complete eligibility form submission with next steps
 */
export async function submitEligibilityForm(req: APIRequest): Promise<APIResponse> {
  return SecurityMiddleware.apply(req, { 
    status: 200, 
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Medical-Data-Classification': 'secret'
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
              message: 'Authentication required for form submission'
            },
            meta: {
              timestamp: new Date().toISOString(),
              version: '1.0'
            }
          }
        };
      }

      const { eligibilityRequest, patientContactInfo } = req.body;

      if (!eligibilityRequest || !patientContactInfo) {
        return {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
          body: {
            error: {
              code: 'MISSING_PARAMETERS',
              message: 'eligibilityRequest and patientContactInfo are required'
            },
            meta: {
              timestamp: new Date().toISOString(),
              version: '1.0'
            }
          }
        };
      }

      // First calculate eligibility
      const eligibilityResult = await SwissHealthcareService.calculateEligibility(eligibilityRequest);

      if (eligibilityResult.error) {
        return {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'X-Medical-Data-Classification': 'secret'
          },
          body: eligibilityResult
        };
      }

      // Generate GP referral packet if required
      let gpReferralPacket = null;
      if (eligibilityResult.data?.gpReferralRequired) {
        const referralResult = await SwissHealthcareService.generateGPReferralPacket(
          eligibilityRequest,
          patientContactInfo
        );

        if (referralResult.data) {
          gpReferralPacket = referralResult.data;
        }
      }

      // Return complete submission result
      return {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'X-Medical-Data-Classification': 'secret'
        },
        body: {
          data: {
            submissionId: `SUB_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            eligibilityResult: eligibilityResult.data,
            gpReferralPacket,
            nextSteps: eligibilityResult.data?.nextSteps || [],
            estimatedTimeframe: this.getEstimatedTimeframe(eligibilityResult.data?.pathway),
            contactInformation: this.getContactInformation(eligibilityResult.data?.pathway)
          },
          meta: {
            timestamp: new Date().toISOString(),
            version: '1.0'
          }
        }
      };

    } catch (error) {
      console.error('Form submission error:', error);
      
      return {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'X-Medical-Data-Classification': 'secret'
        },
        body: {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to submit eligibility form'
          },
          meta: {
            timestamp: new Date().toISOString(),
            version: '1.0'
          }
        }
      };
    }
  });

  // Helper method to get estimated timeframe
  function getEstimatedTimeframe(pathway?: string): string {
    switch (pathway) {
      case 'reimbursed':
        return '5-7 business days for device delivery';
      case 'gp_referral_required':
        return '2-3 weeks (including GP appointment)';
      case 'self_pay':
        return '2-3 business days after payment confirmation';
      default:
        return 'Please contact support for more information';
    }
  }

  // Helper method to get contact information
  function getContactInformation(pathway?: string): any {
    return {
      phone: '+41 44 123 45 67',
      email: 'support@skiin.ch',
      website: 'https://www.skiin.ch/support',
      hours: 'Monday-Friday, 8:00-17:00 CET',
      emergency: pathway === 'emergency' ? '+41 144 (Emergency Services)' : undefined
    };
  }
}

/**
 * Application Status Endpoint: GET /api/eligibility/status/:sessionId
 * 
 * Check the status of an eligibility application
 */
export async function getApplicationStatus(req: APIRequest): Promise<APIResponse> {
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

      const sessionId = req.params?.sessionId;

      if (!sessionId) {
        return {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
          body: {
            error: {
              code: 'MISSING_PARAMETER',
              message: 'sessionId parameter is required'
            },
            meta: {
              timestamp: new Date().toISOString(),
              version: '1.0'
            }
          }
        };
      }

      // In a real implementation, this would query the database
      // For now, return a mock status
      const mockStatus = {
        sessionId,
        status: 'completed',
        submissionDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        currentStep: 'eligibility_calculated',
        progress: 100,
        eligibilityResult: {
          eligible: true,
          pathway: 'reimbursed',
          estimatedCoverage: {
            insuranceCovered: 315,
            patientResponsibility: 35,
            deductibleApplies: true
          }
        }
      };

      return {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'private, max-age=300' // Cache for 5 minutes
        },
        body: {
          data: mockStatus,
          meta: {
            timestamp: new Date().toISOString(),
            version: '1.0'
          }
        }
      };

    } catch (error) {
      console.error('Application status error:', error);
      
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to get application status'
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
 * Swiss Insurance Providers Endpoint: GET /api/eligibility/insurance-providers
 * 
 * Returns list of supported Swiss insurance providers
 */
export async function getInsuranceProviders(req: APIRequest): Promise<APIResponse> {
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

      // Get Swiss insurance providers
      const result = await SwissHealthcareService.getInsuranceProviders();

      return {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
        },
        body: result
      };

    } catch (error) {
      console.error('Insurance providers error:', error);
      
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to get insurance providers'
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
 * Healthcare Health Check: GET /api/eligibility/health
 * 
 * For monitoring and debugging purposes
 */
export async function getHealthcareHealth(req: APIRequest): Promise<APIResponse> {
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

      // Get healthcare service metrics
      const metrics = SwissHealthcareService.getHealthcareMetrics();

      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          data: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            swissCompliant: true,
            gdprCompliant: true,
            metrics
          },
          meta: {
            timestamp: new Date().toISOString(),
            version: '1.0'
          }
        }
      };

    } catch (error) {
      console.error('Healthcare health check error:', error);
      
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Healthcare service health check failed'
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
 * Route handler mapping for eligibility endpoints
 */
export const eligibilityRoutes = {
  'POST /api/eligibility/calculate': calculateEligibility,
  'POST /api/eligibility/submit': submitEligibilityForm,
  'GET /api/eligibility/status/:sessionId': getApplicationStatus,
  'GET /api/eligibility/insurance-providers': getInsuranceProviders,
  'GET /api/eligibility/health': getHealthcareHealth
};

/**
 * Express.js integration helper (for production deployment)
 */
export function setupEligibilityRoutes(app: any) {
  // Eligibility calculation
  app.post('/api/eligibility/calculate', async (req: any, res: any) => {
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

    const response = await calculateEligibility(apiReq);
    
    Object.entries(response.headers).forEach(([key, value]) => {
      res.set(key, value);
    });
    
    res.status(response.status).json(response.body);
  });

  // Form submission
  app.post('/api/eligibility/submit', async (req: any, res: any) => {
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

    const response = await submitEligibilityForm(apiReq);
    
    Object.entries(response.headers).forEach(([key, value]) => {
      res.set(key, value);
    });
    
    res.status(response.status).json(response.body);
  });

  // Application status
  app.get('/api/eligibility/status/:sessionId', async (req: any, res: any) => {
    const apiReq: APIRequest = {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'] || '',
      query: req.query,
      params: req.params
    };

    const response = await getApplicationStatus(apiReq);
    
    Object.entries(response.headers).forEach(([key, value]) => {
      res.set(key, value);
    });
    
    res.status(response.status).json(response.body);
  });

  // Insurance providers
  app.get('/api/eligibility/insurance-providers', async (req: any, res: any) => {
    const apiReq: APIRequest = {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'] || '',
      query: req.query
    };

    const response = await getInsuranceProviders(apiReq);
    
    Object.entries(response.headers).forEach(([key, value]) => {
      res.set(key, value);
    });
    
    res.status(response.status).json(response.body);
  });

  // Health check
  app.get('/api/eligibility/health', async (req: any, res: any) => {
    const apiReq: APIRequest = {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'] || '',
      query: req.query
    };

    const response = await getHealthcareHealth(apiReq);
    
    Object.entries(response.headers).forEach(([key, value]) => {
      res.set(key, value);
    });
    
    res.status(response.status).json(response.body);
  });
  // Console statement removed by ESLint fix
}

// Development testing utilities
export const eligibilityTestUtils = {
  /**
   * Test eligibility calculation with various scenarios
   */
  async testEligibilityCalculation() {
  // Console statement removed by ESLint fix
    const testUser = { id: 'test_user_456', sessionToken: 'test_token_456' };
    
    const testCases = [
      {
        name: 'High eligibility - young adult with symptoms',
        request: {
          method: 'POST',
          url: '/api/eligibility/calculate',
          headers: { 
            'content-type': 'application/json',
            'authorization': 'Bearer test_token_456'
          },
          body: {
            sessionId: 'session_789',
            personalInfo: {
              dateOfBirth: '1990-01-15',
              canton: 'ZH',
              insuranceProvider: 'css',
              insuranceModel: 'standard'
            },
            medicalInfo: {
              hasCardiacSymptoms: true,
              takesCardiacMedication: false,
              hasCardiacHistory: false,
              contraindications: [],
              riskFactors: ['hypertension', 'family_history']
            },
            consentGiven: true,
            dataProcessingConsent: true
          },
          ip: '127.0.0.1',
          userAgent: 'TestAgent/1.0',
          user: testUser
        }
      },
      {
        name: 'Contraindication - ineligible',
        request: {
          method: 'POST',
          url: '/api/eligibility/calculate',
          headers: { 
            'content-type': 'application/json',
            'authorization': 'Bearer test_token_456'
          },
          body: {
            sessionId: 'session_abc',
            personalInfo: {
              dateOfBirth: '1985-06-20',
              canton: 'GE',
              insuranceProvider: 'helsana',
              insuranceModel: 'hmo'
            },
            medicalInfo: {
              hasCardiacSymptoms: false,
              takesCardiacMedication: false,
              hasCardiacHistory: false,
              contraindications: ['pacemaker'], // Contraindication
              riskFactors: []
            },
            consentGiven: true,
            dataProcessingConsent: true
          },
          ip: '127.0.0.1',
          userAgent: 'TestAgent/1.0',
          user: testUser
        }
      }
    ];

    for (const testCase of testCases) {
  // Console statement removed by ESLint fix
      const response = await calculateEligibility(testCase.request);
  // Console statement removed by ESLint fix
      console.log(`Response:`, JSON.stringify(response.body, null, 2));
    }
  },

  /**
   * Test Swiss healthcare compliance features
   */
  async testSwissCompliance() {
  // Console statement removed by ESLint fix
    // Test insurance providers
  // Console statement removed by ESLint fix
    const providersResponse = await getInsuranceProviders({
      method: 'GET',
      url: '/api/eligibility/insurance-providers',
      headers: {},
      ip: '127.0.0.1',
      userAgent: 'TestAgent/1.0'
    });
  // Console statement removed by ESLint fix
    if (providersResponse.body.data?.providers) {
  // Console statement removed by ESLint fix
      providersResponse.body.data.providers.slice(0, 3).forEach((provider: any) => {
        console.log(`  - ${provider.name} (${provider.shortName}): ${provider.models.join(', ')}`);
      });
    }

    // Test healthcare metrics
  // Console statement removed by ESLint fix
    const healthResponse = await getHealthcareHealth({
      method: 'GET',
      url: '/api/eligibility/health',
      headers: {},
      ip: '127.0.0.1',
      userAgent: 'TestAgent/1.0'
    });
  // Console statement removed by ESLint fix
    if (healthResponse.body.data?.metrics) {
  // Console statement removed by ESLint fix
      Object.entries(healthResponse.body.data.metrics).forEach(([key, value]) => {
  // Console statement removed by ESLint fix
      });
    }
  }
};