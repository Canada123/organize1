// Backend API Types for SKIIN Switzerland Marketing Website
// Security-focused types for P0 security fixes implementation

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    timestamp: string;
    version: string;
    requestId?: string;
  };
}

// OTP Security Types
export interface OTPRequest {
  contactMethod: 'email' | 'phone';
  contactValue: string;
  purpose: 'contact_verification' | 'payment_verification' | 'medical_access';
  ipAddress?: string;
  userAgent?: string;
}

export interface OTPVerification {
  contactMethod: 'email' | 'phone';
  contactValue: string;
  otp: string;
  sessionToken?: string;
}

export interface OTPRateLimit {
  contactValue: string;
  attemptsCount: number;
  attemptsRemaining: number;
  nextAttemptAt: string;
  isBlocked: boolean;
  blockExpiresAt?: string;
}

export interface OTPSecurityConfig {
  maxAttempts: number;
  blockDurationMinutes: number;
  otpExpiryMinutes: number;
  medicalOtpExpiryMinutes: number; // Shorter for medical contexts
  rateLimitWindowMinutes: number;
}

// Payment Security Types
export interface PaymentIntent {
  userId: string;
  formSessionId: string;
  amountCents: number;
  currency: 'CHF';
  billingAddress: SwissBillingAddress;
  paymentMethods: ('card' | 'postfinance' | 'twint')[];
  idempotencyKey: string;
}

export interface SwissBillingAddress {
  firstName: string;
  lastName: string;
  street: string;
  houseNumber?: string;
  postalCode: string;
  city: string;
  canton: SwissCanton;
  country: 'CH';
}

export interface PaymentSecurityValidation {
  cardNumberMasked: string;
  expiryMonth: number;
  expiryYear: number;
  cvvValidated: boolean;
  billingAddressVerified: boolean;
  fraudScore: number; // 0-100, lower is safer
  pciComplianceFlags: {
    tlsEncrypted: boolean;
    tokenized: boolean;
    cvvNotStored: boolean;
    auditTrailComplete: boolean;
  };
}

// Swiss Healthcare Types
export interface SwissInsuranceProvider {
  id: string;
  name: string;
  shortName: string;
  models: SwissInsuranceModel[];
  requiresGPReferral: boolean;
  reimbursementRate: number; // 0.0 to 1.0
  contactInfo: {
    phone: string;
    website: string;
    memberPortal?: string;
  };
}

export type SwissInsuranceModel = 'standard' | 'flex' | 'hmo' | 'hausarzt' | 'telmed';

export type SwissCanton = 
  | 'AG' | 'AI' | 'AR' | 'BE' | 'BL' | 'BS' | 'FR' | 'GE' | 'GL' 
  | 'GR' | 'JU' | 'LU' | 'NE' | 'NW' | 'OW' | 'SG' | 'SH' | 'SO' 
  | 'SZ' | 'TG' | 'TI' | 'UR' | 'VD' | 'VS' | 'ZG' | 'ZH';

export interface EligibilityRequest {
  userId: string;
  sessionId: string;
  personalInfo: {
    dateOfBirth: string;
    canton: SwissCanton;
    insuranceProvider: string;
    insuranceModel: SwissInsuranceModel;
    insuranceNumber?: string;
  };
  medicalInfo: {
    hasCardiacSymptoms: boolean;
    takesCardiacMedication: boolean;
    hasCardiacHistory: boolean;
    contraindications: string[];
    riskFactors: string[];
  };
  consentGiven: boolean;
  dataProcessingConsent: boolean;
}

export interface EligibilityResult {
  eligible: boolean;
  pathway: 'reimbursed' | 'self_pay' | 'gp_referral_required' | 'ineligible';
  reason: string;
  eligibilityScore: number; // 0-100
  nextSteps: string[];
  estimatedCoverage?: {
    insuranceCovered: number; // CHF
    patientResponsibility: number; // CHF
    deductibleApplies: boolean;
  };
  gpReferralRequired: boolean;
  recommendedProvider?: string;
  urgencyLevel: 'routine' | 'urgent' | 'emergency';
}

// Authentication & Session Types
export interface SecureSession {
  sessionId: string;
  userId: string;
  sessionToken: string;
  expiresAt: string;
  createdAt: string;
  lastActivityAt: string;
  ipAddress: string;
  userAgent: string;
  securityFlags: {
    otpVerified: boolean;
    medicalConsentGiven: boolean;
    paymentAuthorized: boolean;
    dataRetentionAccepted: boolean;
  };
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  requestId: string;
  result: 'success' | 'failure' | 'blocked';
  securityLevel: 'public' | 'confidential' | 'secret';
  details?: unknown;
}

// Business Logic Types
export interface GPReferralPacket {
  patientInfo: {
    name: string;
    dateOfBirth: string;
    address: SwissBillingAddress;
    phone: string;
    email: string;
    insuranceNumber: string;
    insuranceProvider: string;
  };
  medicalContext: {
    symptoms: string[];
    riskFactors: string[];
    currentMedications: string[];
    medicalHistory: string[];
    urgencyLevel: 'routine' | 'urgent' | 'emergency';
  };
  requestDetails: {
    requestedService: 'SKIIN Heart Monitoring';
    duration: '10 days';
    justification: string;
    clinicalIndication: string;
  };
  generatedAt: string;
  validUntil: string;
  documentId: string;
}

// Error Types
export interface SecurityError {
  code: 'RATE_LIMIT_EXCEEDED' | 'INVALID_OTP' | 'SESSION_EXPIRED' | 'UNAUTHORIZED' | 'PCI_VIOLATION';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  remediation: string;
  blockDuration?: number;
}

export interface ValidationError {
  field: string;
  code: string;
  message: string;
  value?: unknown;
}

// API Endpoint Schemas
export interface OTPGenerateEndpoint {
  path: '/api/otp/generate';
  method: 'POST';
  body: OTPRequest;
  response: ApiResponse<{ 
    success: boolean; 
    expiresAt: string; 
    attemptsRemaining: number; 
  }>;
  security: {
    rateLimit: '5 requests per 10 minutes per IP';
    authentication: 'none';
    validation: 'Zod schema';
  };
}

export interface PaymentCreateIntentEndpoint {
  path: '/api/payment/create-intent';
  method: 'POST';
  body: PaymentIntent;
  response: ApiResponse<{
    clientSecret: string;
    paymentIntentId: string;
    amountBreakdown: {
      subtotal: number;
      vat: number;
      total: number;
    };
  }>;
  security: {
    rateLimit: '10 requests per hour per user';
    authentication: 'Bearer token required';
    validation: 'PCI DSS compliant';
  };
}

export interface EligibilityCalculateEndpoint {
  path: '/api/eligibility/calculate';
  method: 'POST';
  body: EligibilityRequest;
  response: ApiResponse<EligibilityResult>;
  security: {
    rateLimit: '20 requests per hour per user';
    authentication: 'Bearer token required';
    validation: 'Swiss healthcare compliance';
  };
}

// Configuration Types
export interface SecurityConfig {
  otp: OTPSecurityConfig;
  session: {
    tokenLength: number;
    expiryHours: number;
    renewalThreshold: number;
  };
  rateLimit: {
    global: number;
    perEndpoint: Record<string, number>;
    perUser: Record<string, number>;
  };
  encryption: {
    algorithm: 'AES-256-GCM';
    keyRotationDays: number;
  };
  audit: {
    retentionDays: number;
    compressionAfterDays: number;
  };
}

export interface SwissComplianceConfig {
  dataRetention: {
    medicalDataYears: number;
    personalDataYears: number;
    auditLogYears: number;
  };
  gdpr: {
    consentRequired: boolean;
    rightToErasure: boolean;
    dataPortability: boolean;
  };
  medical: {
    deviceClassification: 'Class IIa';
    regulatoryBody: 'Swissmedic';
    qualityStandard: 'ISO 13485';
  };
}