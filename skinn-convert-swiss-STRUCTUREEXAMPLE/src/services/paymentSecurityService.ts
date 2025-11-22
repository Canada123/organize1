import { z } from 'zod';
import type {
  PaymentIntent,
  SwissBillingAddress,
  PaymentSecurityValidation,
  SwissCanton,
  ApiResponse,
  AuditLogEntry
} from '../types/backend';

// PCI DSS Compliance Configuration
const PCI_CONFIG = {
  minTlsVersion: '1.2',
  tokenExpiry: 15 * 60 * 1000, // 15 minutes
  maxPaymentAttempts: 3,
  fraudScoreThreshold: 75, // Block payments above this score
  allowedCurrencies: ['CHF'],
  vatRate: 0.077, // Swiss VAT rate 7.7%
  maxAmountCents: 100000 // CHF 1000 max
};

// Swiss cantons for validation
const SWISS_CANTONS: SwissCanton[] = [
  'AG', 'AI', 'AR', 'BE', 'BL', 'BS', 'FR', 'GE', 'GL', 
  'GR', 'JU', 'LU', 'NE', 'NW', 'OW', 'SG', 'SH', 'SO', 
  'SZ', 'TG', 'TI', 'UR', 'VD', 'VS', 'ZG', 'ZH'
];

// Swiss postal code validation
const swissPostalCodes = new Map<string, string[]>([
  ['ZH', ['8000', '8001', '8002', '8003', '8004', '8005', '8006', '8008', '8032', '8037', '8038', '8041', '8044', '8045', '8046', '8047', '8048', '8049', '8050', '8051', '8052', '8053', '8055', '8057', '8064', '8103', '8125', '8134', '8142', '8143', '8152', '8153', '8154', '8155', '8156', '8157', '8158', '8159', '8162', '8165', '8166', '8172', '8173', '8174', '8175', '8180', '8181', '8182', '8184', '8185', '8187', '8188', '8192', '8193', '8194', '8195', '8196', '8197', '8200', '8201', '8202', '8203', '8204', '8205', '8207', '8208', '8212', '8213', '8214', '8215', '8216', '8217', '8218', '8219', '8220', '8222', '8223', '8224', '8225', '8226', '8902', '8903', '8904', '8905', '8906']],
  ['BE', ['3000', '3001', '3003', '3004', '3005', '3006', '3007', '3008', '3009', '3010', '3011', '3012', '3013', '3014', '3015', '3018', '3019', '3020', '3021', '3022', '3023', '3024', '3025', '3027', '3028', '3029', '3030', '3031', '3032', '3033', '3034', '3035', '3036', '3037', '3038', '3039', '3040', '3041', '3042', '3043', '3044', '3045', '3046', '3047', '3048', '3049', '3050', '3051', '3052', '3053', '3054', '3055', '3056', '3057', '3058', '3063', '3065', '3066', '3067', '3068', '3073', '3074', '3075', '3076', '3077', '3078', '3079', '3082', '3083', '3084', '3085', '3086', '3087', '3088', '3089', '3090', '3091', '3092', '3093', '3094', '3095', '3096', '3097', '3098', '3099']],
  ['GE', ['1200', '1201', '1202', '1203', '1204', '1205', '1206', '1207', '1208', '1209', '1211', '1212', '1213', '1214', '1215', '1216', '1217', '1218', '1219', '1220', '1221', '1222', '1223', '1224', '1225', '1227', '1228', '1231', '1232', '1233', '1234', '1236', '1237', '1238', '1239', '1240', '1241', '1242', '1243', '1244', '1245', '1246', '1247', '1248', '1249', '1251', '1252', '1253', '1254', '1255', '1256', '1257', '1258', '1260', '1261', '1262', '1263', '1264', '1265', '1266', '1267', '1268', '1270', '1271', '1272', '1273', '1274', '1275', '1276', '1277', '1278', '1279', '1280', '1281', '1283', '1284', '1285', '1286', '1287', '1288', '1290', '1291', '1292', '1293', '1294', '1295', '1296', '1297', '1298', '1299']],
  // Add more cantons as needed
]);

// Validation schemas with PCI DSS requirements
const SwissBillingAddressSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-ZäöüÄÖÜ\s\-']+$/, 'Invalid characters in first name'),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-ZäöüÄÖÜ\s\-']+$/, 'Invalid characters in last name'),
  street: z.string()
    .min(3, 'Street address must be at least 3 characters')
    .max(100, 'Street address must be less than 100 characters'),
  houseNumber: z.string().optional(),
  postalCode: z.string()
    .length(4, 'Swiss postal code must be exactly 4 digits')
    .regex(/^\d{4}$/, 'Postal code must contain only numbers'),
  city: z.string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must be less than 50 characters')
    .regex(/^[a-zA-ZäöüÄÖÜ\s\-']+$/, 'Invalid characters in city name'),
  canton: z.enum(SWISS_CANTONS as [SwissCanton, ...SwissCanton[]]),
  country: z.literal('CH')
});

const PaymentIntentSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  formSessionId: z.string().min(1, 'Form session ID is required'),
  amountCents: z.number()
    .min(100, 'Minimum payment amount is CHF 1.00')
    .max(PCI_CONFIG.maxAmountCents, `Maximum payment amount is CHF ${PCI_CONFIG.maxAmountCents / 100}`),
  currency: z.literal('CHF'),
  billingAddress: SwissBillingAddressSchema,
  paymentMethods: z.array(z.enum(['card', 'postfinance', 'twint'])).min(1, 'At least one payment method required'),
  idempotencyKey: z.string().min(16, 'Idempotency key must be at least 16 characters')
});

// In-memory stores (would use encrypted database in production)
const paymentIntentStore = new Map<string, {
  intent: PaymentIntent;
  clientSecret: string;
  status: 'created' | 'processing' | 'succeeded' | 'failed';
  createdAt: number;
  expiresAt: number;
  attempts: number;
}>();

const auditLogs: AuditLogEntry[] = [];

function logPaymentAuditEvent(
  action: string,
  result: 'success' | 'failure' | 'blocked',
  userId: string,
  details?: unknown
): void {
  const entry: AuditLogEntry = {
    id: `payment_audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    userId,
    action,
    resource: 'payment_service',
    ipAddress: 'unknown', // Would be passed from request context
    userAgent: 'unknown', // Would be passed from request context
    requestId: `payment_req_${Date.now()}`,
    result,
    securityLevel: 'secret', // Payment data is highly sensitive
    details
  };
  
  auditLogs.push(entry);
  
  // Keep only last 10000 entries
  if (auditLogs.length > 10000) {
    auditLogs.shift();
  }
  // Console statement removed by ESLint fix
}

function generateClientSecret(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return 'pi_' + Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

function calculateVAT(amountCents: number): { net: number; vat: number; total: number } {
  const net = Math.round(amountCents / (1 + PCI_CONFIG.vatRate));
  const vat = amountCents - net;
  return {
    net,
    vat,
    total: amountCents
  };
}

function validateSwissAddress(address: SwissBillingAddress): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validate postal code for canton (simplified validation)
  const cantonPostalCodes = swissPostalCodes.get(address.canton);
  if (cantonPostalCodes && !cantonPostalCodes.some(code => address.postalCode.startsWith(code.substring(0, 2)))) {
    errors.push(`Postal code ${address.postalCode} does not match canton ${address.canton}`);
  }
  
  // Additional Swiss-specific validation
  if (!address.street.match(/^[a-zA-ZäöüÄÖÜ0-9\s\-'.]+$/)) {
    errors.push('Street address contains invalid characters for Swiss addresses');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

function calculateFraudScore(intent: PaymentIntent): number {
  let score = 0;
  
  // Basic fraud detection (would use sophisticated ML in production)
  
  // High amount risk
  if (intent.amountCents > 50000) { // > CHF 500
    score += 20;
  }
  
  // Multiple payment methods requested (could indicate testing)
  if (intent.paymentMethods.length > 2) {
    score += 15;
  }
  
  // Address validation
  const addressValidation = validateSwissAddress(intent.billingAddress);
  if (!addressValidation.valid) {
    score += 30;
  }
  
  // Name-address mismatch detection (simplified)
  const hasNumericName = /\d/.test(intent.billingAddress.firstName + intent.billingAddress.lastName);
  if (hasNumericName) {
    score += 25;
  }
  
  // Check for suspicious patterns
  if (intent.billingAddress.street.toLowerCase().includes('test')) {
    score += 40;
  }
  
  return Math.min(score, 100);
}

export class PaymentSecurityService {
  /**
   * Create secure payment intent with PCI DSS compliance
   */
  static async createPaymentIntent(intent: PaymentIntent): Promise<ApiResponse<{
    clientSecret: string;
    paymentIntentId: string;
    amountBreakdown: {
      subtotal: number;
      vat: number;
      total: number;
    };
  }>> {
    try {
      // Validate input with comprehensive Zod schema
      const validatedIntent = PaymentIntentSchema.parse(intent);
      
      // Additional Swiss address validation
      const addressValidation = validateSwissAddress(validatedIntent.billingAddress);
      if (!addressValidation.valid) {
        logPaymentAuditEvent(
          'payment_intent_rejected',
          'failure',
          validatedIntent.userId,
          { reason: 'invalid_address', errors: addressValidation.errors }
        );
        
        return {
          error: {
            code: 'INVALID_ADDRESS',
            message: 'Invalid Swiss billing address',
            details: addressValidation.errors
          },
          meta: {
            timestamp: new Date().toISOString(),
            version: '1.0'
          }
        };
      }
      
      // Fraud detection
      const fraudScore = calculateFraudScore(validatedIntent);
      if (fraudScore > PCI_CONFIG.fraudScoreThreshold) {
        logPaymentAuditEvent(
          'payment_intent_blocked',
          'blocked',
          validatedIntent.userId,
          { reason: 'high_fraud_score', score: fraudScore }
        );
        
        return {
          error: {
            code: 'PAYMENT_BLOCKED',
            message: 'Payment blocked for security reasons',
            details: { fraudScore }
          },
          meta: {
            timestamp: new Date().toISOString(),
            version: '1.0'
          }
        };
      }
      
      // Check for duplicate idempotency key
      const existingIntent = Array.from(paymentIntentStore.values())
        .find(stored => stored.intent.idempotencyKey === validatedIntent.idempotencyKey);
      
      if (existingIntent) {
        // Return existing intent for idempotent request
        const vatBreakdown = calculateVAT(existingIntent.intent.amountCents);
        
        logPaymentAuditEvent(
          'payment_intent_duplicate',
          'success',
          validatedIntent.userId,
          { idempotencyKey: validatedIntent.idempotencyKey }
        );
        
        return {
          data: {
            clientSecret: existingIntent.clientSecret,
            paymentIntentId: Object.keys(paymentIntentStore).find(key => paymentIntentStore.get(key) === existingIntent) || '',
            amountBreakdown: {
              subtotal: vatBreakdown.net,
              vat: vatBreakdown.vat,
              total: vatBreakdown.total
            }
          },
          meta: {
            timestamp: new Date().toISOString(),
            version: '1.0'
          }
        };
      }
      
      // Generate secure payment intent ID and client secret
      const paymentIntentId = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const clientSecret = generateClientSecret();
      
      // Calculate VAT breakdown
      const vatBreakdown = calculateVAT(validatedIntent.amountCents);
      
      // Store payment intent securely
      const now = Date.now();
      const expiresAt = now + PCI_CONFIG.tokenExpiry;
      
      paymentIntentStore.set(paymentIntentId, {
        intent: validatedIntent,
        clientSecret,
        status: 'created',
        createdAt: now,
        expiresAt,
        attempts: 0
      });
      
      // Clean up expired intents
      this.cleanupExpiredIntents();
      
      logPaymentAuditEvent(
        'payment_intent_created',
        'success',
        validatedIntent.userId,
        {
          paymentIntentId,
          amountCents: validatedIntent.amountCents,
          currency: validatedIntent.currency,
          paymentMethods: validatedIntent.paymentMethods,
          fraudScore,
          vatBreakdown
        }
      );
      
      // In production, this would interface with Stripe API
  // Console statement removed by ESLint fix
      return {
        data: {
          clientSecret,
          paymentIntentId,
          amountBreakdown: {
            subtotal: vatBreakdown.net,
            vat: vatBreakdown.vat,
            total: vatBreakdown.total
          }
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      };
      
    } catch (error) {
      logPaymentAuditEvent(
        'payment_intent_error',
        'failure',
        intent.userId,
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
      
      if (error instanceof z.ZodError) {
        return {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid payment intent format',
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
          message: 'Failed to create payment intent'
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      };
    }
  }
  
  /**
   * Confirm payment with PCI DSS security validation
   */
  static async confirmPayment(
    paymentIntentId: string,
    paymentMethod: {
      type: 'card' | 'postfinance' | 'twint';
      card?: {
        number: string; // Would be tokenized in production
        expiryMonth: number;
        expiryYear: number;
        cvc: string; // Would never be stored
      };
    }
  ): Promise<ApiResponse<{
    success: boolean;
    paymentId: string;
    invoiceNumber: string;
    amountBreakdown: any;
  }>> {
    try {
      const storedIntent = paymentIntentStore.get(paymentIntentId);
      
      if (!storedIntent) {
        return {
          error: {
            code: 'PAYMENT_NOT_FOUND',
            message: 'Payment intent not found or expired'
          },
          meta: {
            timestamp: new Date().toISOString(),
            version: '1.0'
          }
        };
      }
      
      // Check expiry
      if (Date.now() > storedIntent.expiresAt) {
        paymentIntentStore.delete(paymentIntentId);
        
        logPaymentAuditEvent(
          'payment_confirmation_failed',
          'failure',
          storedIntent.intent.userId,
          { reason: 'payment_intent_expired', paymentIntentId }
        );
        
        return {
          error: {
            code: 'PAYMENT_EXPIRED',
            message: 'Payment intent has expired'
          },
          meta: {
            timestamp: new Date().toISOString(),
            version: '1.0'
          }
        };
      }
      
      // Check attempt limit
      storedIntent.attempts++;
      if (storedIntent.attempts > PCI_CONFIG.maxPaymentAttempts) {
        paymentIntentStore.delete(paymentIntentId);
        
        logPaymentAuditEvent(
          'payment_confirmation_blocked',
          'blocked',
          storedIntent.intent.userId,
          { reason: 'max_attempts_exceeded', paymentIntentId }
        );
        
        return {
          error: {
            code: 'MAX_ATTEMPTS_EXCEEDED',
            message: 'Maximum payment attempts exceeded'
          },
          meta: {
            timestamp: new Date().toISOString(),
            version: '1.0'
          }
        };
      }
      
      // Validate payment method
      if (!storedIntent.intent.paymentMethods.includes(paymentMethod.type)) {
        logPaymentAuditEvent(
          'payment_confirmation_failed',
          'failure',
          storedIntent.intent.userId,
          { reason: 'invalid_payment_method', paymentIntentId, attemptedMethod: paymentMethod.type }
        );
        
        return {
          error: {
            code: 'INVALID_PAYMENT_METHOD',
            message: 'Payment method not allowed for this intent'
          },
          meta: {
            timestamp: new Date().toISOString(),
            version: '1.0'
          }
        };
      }
      
      // PCI DSS validation for card payments
      if (paymentMethod.type === 'card' && paymentMethod.card) {
        const cardValidation = this.validateCard(paymentMethod.card);
        if (!cardValidation.valid) {
          logPaymentAuditEvent(
            'payment_confirmation_failed',
            'failure',
            storedIntent.intent.userId,
            { reason: 'invalid_card', errors: cardValidation.errors, paymentIntentId }
          );
          
          return {
            error: {
              code: 'INVALID_CARD',
              message: 'Invalid card details',
              details: cardValidation.errors
            },
            meta: {
              timestamp: new Date().toISOString(),
              version: '1.0'
            }
          };
        }
      }
      
      // Simulate payment processing (would use Stripe in production)
      const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const invoiceNumber = `SKIIN-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`;
      
      // Update intent status
      storedIntent.status = 'succeeded';
      
      const vatBreakdown = calculateVAT(storedIntent.intent.amountCents);
      
      logPaymentAuditEvent(
        'payment_confirmed',
        'success',
        storedIntent.intent.userId,
        {
          paymentIntentId,
          paymentId,
          invoiceNumber,
          amountCents: storedIntent.intent.amountCents,
          paymentMethod: paymentMethod.type,
          vatBreakdown
        }
      );
      
      // In production, would trigger email receipt and update database
  // Console statement removed by ESLint fix
      return {
        data: {
          success: true,
          paymentId,
          invoiceNumber,
          amountBreakdown: vatBreakdown
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      };
      
    } catch (error) {
      logPaymentAuditEvent(
        'payment_confirmation_error',
        'failure',
        'unknown',
        { error: error instanceof Error ? error.message : 'Unknown error', paymentIntentId }
      );
      
      return {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Payment confirmation failed'
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      };
    }
  }
  
  /**
   * Get supported Swiss payment methods
   */
  static async getPaymentMethods(): Promise<ApiResponse<{
    methods: Array<{
      type: 'card' | 'postfinance' | 'twint';
      name: string;
      description: string;
      fees: string;
      processingTime: string;
    }>;
  }>> {
    return {
      data: {
        methods: [
          {
            type: 'card',
            name: 'Credit/Debit Card',
            description: 'Visa, Mastercard, American Express',
            fees: 'No additional fees',
            processingTime: 'Instant'
          },
          {
            type: 'postfinance',
            name: 'PostFinance',
            description: 'Swiss PostFinance payment',
            fees: 'No additional fees',
            processingTime: '1-2 business days'
          },
          {
            type: 'twint',
            name: 'TWINT',
            description: 'Swiss mobile payment',
            fees: 'No additional fees',
            processingTime: 'Instant'
          }
        ]
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    };
  }
  
  /**
   * Validate card details for PCI DSS compliance
   */
  private static validateCard(card: {
    number: string;
    expiryMonth: number;
    expiryYear: number;
    cvc: string;
  }): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Basic Luhn algorithm check (simplified)
    if (!this.luhnCheck(card.number.replace(/\s/g, ''))) {
      errors.push('Invalid card number');
    }
    
    // Expiry validation
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    if (card.expiryYear < currentYear || 
        (card.expiryYear === currentYear && card.expiryMonth < currentMonth)) {
      errors.push('Card has expired');
    }
    
    if (card.expiryMonth < 1 || card.expiryMonth > 12) {
      errors.push('Invalid expiry month');
    }
    
    // CVC validation
    if (!/^\d{3,4}$/.test(card.cvc)) {
      errors.push('Invalid CVC');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Luhn algorithm for card number validation
   */
  private static luhnCheck(cardNumber: string): boolean {
    let sum = 0;
    let alternate = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let n = parseInt(cardNumber.charAt(i), 10);
      
      if (alternate) {
        n *= 2;
        if (n > 9) {
          n = (n % 10) + 1;
        }
      }
      
      sum += n;
      alternate = !alternate;
    }
    
    return (sum % 10) === 0;
  }
  
  /**
   * Clean up expired payment intents
   */
  private static cleanupExpiredIntents(): void {
    const now = Date.now();
    for (const [key, intent] of paymentIntentStore.entries()) {
      if (now > intent.expiresAt) {
        paymentIntentStore.delete(key);
      }
    }
  }
  
  /**
   * Get payment audit logs (admin function)
   */
  static getPaymentAuditLogs(limit = 100): AuditLogEntry[] {
    return auditLogs.slice(-limit);
  }
  
  /**
   * Get payment security metrics (admin function)
   */
  static getPaymentSecurityMetrics() {
    const now = Date.now();
    const hourAgo = now - (60 * 60 * 1000);
    
    const recentLogs = auditLogs.filter(log => new Date(log.timestamp).getTime() > hourAgo);
    
    return {
      paymentIntentsCreated: recentLogs.filter(log => log.action === 'payment_intent_created').length,
      paymentsConfirmed: recentLogs.filter(log => log.action === 'payment_confirmed').length,
      paymentsFailed: recentLogs.filter(log => log.action === 'payment_confirmation_failed').length,
      blockedPayments: recentLogs.filter(log => log.result === 'blocked').length,
      activePaymentIntents: paymentIntentStore.size,
      averageFraudScore: this.calculateAverageFraudScore()
    };
  }
  
  /**
   * Calculate average fraud score for monitoring
   */
  private static calculateAverageFraudScore(): number {
    const intents = Array.from(paymentIntentStore.values());
    if (intents.length === 0) return 0;
    
    const totalScore = intents.reduce((sum, intent) => {
      return sum + calculateFraudScore(intent.intent);
    }, 0);
    
    return Math.round(totalScore / intents.length);
  }
}