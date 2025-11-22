import { z } from 'zod';
import type {
  EligibilityRequest,
  EligibilityResult,
  SwissInsuranceProvider,
  SwissInsuranceModel,
  SwissCanton,
  GPReferralPacket,
  ApiResponse,
  AuditLogEntry
} from '../types/backend';

// Swiss Healthcare Configuration
const HEALTHCARE_CONFIG = {
  minAge: 18,
  maxAge: 80,
  urgencyThresholds: {
    emergency: ['chest_pain', 'shortness_of_breath', 'syncope'],
    urgent: ['palpitations', 'dizziness', 'fatigue'],
    routine: []
  },
  contraindications: [
    'pacemaker',
    'pregnancy',
    'severe_heart_failure',
    'active_cardiac_surgery',
    'skin_allergies',
    'chronic_wound'
  ]
};

// Swiss Insurance Providers Database
const SWISS_INSURANCE_PROVIDERS: SwissInsuranceProvider[] = [
  {
    id: 'css',
    name: 'CSS Kranken-Versicherung AG',
    shortName: 'CSS',
    models: ['standard', 'flex', 'hmo', 'hausarzt'],
    requiresGPReferral: false,
    reimbursementRate: 0.90,
    contactInfo: {
      phone: '+41 58 277 11 11',
      website: 'https://www.css.ch',
      memberPortal: 'https://www.css.ch/de/meine-css.html'
    }
  },
  {
    id: 'helsana',
    name: 'Helsana Versicherungen AG',
    shortName: 'Helsana',
    models: ['standard', 'flex', 'hmo', 'telmed'],
    requiresGPReferral: true,
    reimbursementRate: 0.85,
    contactInfo: {
      phone: '+41 844 80 81 82',
      website: 'https://www.helsana.ch',
      memberPortal: 'https://www.helsana.ch/de/private/service/myHelsana.html'
    }
  },
  {
    id: 'swica',
    name: 'SWICA Krankenversicherung AG',
    shortName: 'SWICA',
    models: ['standard', 'hmo', 'hausarzt', 'telmed'],
    requiresGPReferral: true,
    reimbursementRate: 0.88,
    contactInfo: {
      phone: '+41 800 80 90 90',
      website: 'https://www.swica.ch',
      memberPortal: 'https://www.swica.ch/de-ch/private/service/myswica'
    }
  },
  {
    id: 'assura',
    name: 'Assura-Basis SA',
    shortName: 'Assura',
    models: ['standard', 'flex'],
    requiresGPReferral: false,
    reimbursementRate: 0.80,
    contactInfo: {
      phone: '+41 848 803 111',
      website: 'https://www.assura.ch',
      memberPortal: 'https://www.assura.ch/fr/espace-assure'
    }
  },
  {
    id: 'groupe_mutuel',
    name: 'Groupe Mutuel',
    shortName: 'Groupe Mutuel',
    models: ['standard', 'flex', 'hmo'],
    requiresGPReferral: false,
    reimbursementRate: 0.85,
    contactInfo: {
      phone: '+41 848 803 111',
      website: 'https://www.groupemutuel.ch',
      memberPortal: 'https://www.groupemutuel.ch/fr/espace-client'
    }
  },
  {
    id: 'atupri',
    name: 'Atupri Krankenversicherung AG',
    shortName: 'Atupri',
    models: ['standard', 'hausarzt', 'telmed'],
    requiresGPReferral: true,
    reimbursementRate: 0.87,
    contactInfo: {
      phone: '+41 848 867 867',
      website: 'https://www.atupri.ch',
      memberPortal: 'https://www.atupri.ch/de/service/myatupri'
    }
  },
  {
    id: 'concordia',
    name: 'Concordia Kranken- und Unfallversicherungen AG',
    shortName: 'Concordia',
    models: ['standard', 'flex', 'hmo', 'hausarzt'],
    requiresGPReferral: true,
    reimbursementRate: 0.86,
    contactInfo: {
      phone: '+41 844 250 250',
      website: 'https://www.concordia.ch',
      memberPortal: 'https://www.concordia.ch/de/private/service/myConcordia'
    }
  },
  {
    id: 'kpt',
    name: 'KPT/CPT Krankenversicherung AG',
    shortName: 'KPT',
    models: ['standard', 'hmo', 'telmed'],
    requiresGPReferral: true,
    reimbursementRate: 0.83,
    contactInfo: {
      phone: '+41 58 310 98 00',
      website: 'https://www.kpt.ch',
      memberPortal: 'https://www.kpt.ch/de/service/mykpt'
    }
  },
  {
    id: 'sanitas',
    name: 'Sanitas Krankenversicherung AG',
    shortName: 'Sanitas',
    models: ['standard', 'flex', 'hausarzt'],
    requiresGPReferral: false,
    reimbursementRate: 0.89,
    contactInfo: {
      phone: '+41 844 150 150',
      website: 'https://www.sanitas.com',
      memberPortal: 'https://www.sanitas.com/de/private/service/mysanitas.html'
    }
  }
];

// Cost calculation by canton (simplified - actual costs vary by many factors)
const SKIIN_COSTS_BY_CANTON: Record<SwissCanton, { baseCostCHF: number; insuranceCoverage: number }> = {
  'ZH': { baseCostCHF: 350, insuranceCoverage: 0.90 },
  'BE': { baseCostCHF: 340, insuranceCoverage: 0.88 },
  'GE': { baseCostCHF: 360, insuranceCoverage: 0.85 },
  'VD': { baseCostCHF: 355, insuranceCoverage: 0.87 },
  'AG': { baseCostCHF: 345, insuranceCoverage: 0.89 },
  'SG': { baseCostCHF: 330, insuranceCoverage: 0.90 },
  'LU': { baseCostCHF: 325, insuranceCoverage: 0.91 },
  'TI': { baseCostCHF: 340, insuranceCoverage: 0.88 },
  'VS': { baseCostCHF: 320, insuranceCoverage: 0.92 },
  'BL': { baseCostCHF: 350, insuranceCoverage: 0.89 },
  'BS': { baseCostCHF: 365, insuranceCoverage: 0.86 },
  'SO': { baseCostCHF: 335, insuranceCoverage: 0.90 },
  'TG': { baseCostCHF: 330, insuranceCoverage: 0.91 },
  'GR': { baseCostCHF: 325, insuranceCoverage: 0.92 },
  'FR': { baseCostCHF: 340, insuranceCoverage: 0.88 },
  'SH': { baseCostCHF: 345, insuranceCoverage: 0.89 },
  'NE': { baseCostCHF: 350, insuranceCoverage: 0.87 },
  'JU': { baseCostCHF: 335, insuranceCoverage: 0.90 },
  'ZG': { baseCostCHF: 360, insuranceCoverage: 0.85 },
  'SZ': { baseCostCHF: 340, insuranceCoverage: 0.88 },
  'OW': { baseCostCHF: 320, insuranceCoverage: 0.93 },
  'NW': { baseCostCHF: 325, insuranceCoverage: 0.92 },
  'GL': { baseCostCHF: 330, insuranceCoverage: 0.91 },
  'UR': { baseCostCHF: 315, insuranceCoverage: 0.94 },
  'AI': { baseCostCHF: 310, insuranceCoverage: 0.95 },
  'AR': { baseCostCHF: 325, insuranceCoverage: 0.92 }
};

// Validation schemas
const EligibilityRequestSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  sessionId: z.string().min(1, 'Session ID is required'),
  personalInfo: z.object({
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be in YYYY-MM-DD format'),
    canton: z.enum(Object.keys(SKIIN_COSTS_BY_CANTON) as [SwissCanton, ...SwissCanton[]]),
    insuranceProvider: z.string().min(1, 'Insurance provider is required'),
    insuranceModel: z.enum(['standard', 'flex', 'hmo', 'hausarzt', 'telmed']),
    insuranceNumber: z.string().optional()
  }),
  medicalInfo: z.object({
    hasCardiacSymptoms: z.boolean(),
    takesCardiacMedication: z.boolean(),
    hasCardiacHistory: z.boolean(),
    contraindications: z.array(z.string()),
    riskFactors: z.array(z.string())
  }),
  consentGiven: z.boolean(),
  dataProcessingConsent: z.boolean()
});

// Audit logging
const auditLogs: AuditLogEntry[] = [];

function logHealthcareAuditEvent(
  action: string,
  result: 'success' | 'failure' | 'blocked',
  userId: string,
  details?: unknown
): void {
  const entry: AuditLogEntry = {
    id: `healthcare_audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    userId,
    action,
    resource: 'healthcare_service',
    ipAddress: 'unknown',
    userAgent: 'unknown',
    requestId: `healthcare_req_${Date.now()}`,
    result,
    securityLevel: 'secret', // Medical data is highly sensitive
    details
  };
  
  auditLogs.push(entry);
  
  if (auditLogs.length > 10000) {
    auditLogs.shift();
  }
  
  // Healthcare audit logged
}

function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

function calculateEligibilityScore(request: EligibilityRequest): number {
  let score = 100; // Start with full eligibility
  
  // Age factor
  const age = calculateAge(request.personalInfo.dateOfBirth);
  if (age < HEALTHCARE_CONFIG.minAge) {
    score = 0; // Ineligible - too young
  } else if (age > HEALTHCARE_CONFIG.maxAge) {
    score -= 30; // Reduced eligibility - advanced age
  } else if (age > 65) {
    score -= 10; // Slight reduction for seniors
  }
  
  // Medical contraindications
  const hasContraindications = request.medicalInfo.contraindications.some(
    contra => HEALTHCARE_CONFIG.contraindications.includes(contra)
  );
  if (hasContraindications) {
    score = 0; // Ineligible due to contraindications
  }
  
  // Risk factors (increase eligibility if present)
  const riskFactorCount = request.medicalInfo.riskFactors.length;
  if (riskFactorCount > 0) {
    score += Math.min(riskFactorCount * 5, 20); // Bonus for having risk factors
  }
  
  // Cardiac symptoms and history increase eligibility
  if (request.medicalInfo.hasCardiacSymptoms) {
    score += 15;
  }
  if (request.medicalInfo.hasCardiacHistory) {
    score += 10;
  }
  if (request.medicalInfo.takesCardiacMedication) {
    score += 10;
  }
  
  return Math.max(0, Math.min(100, score));
}

function determineUrgencyLevel(request: EligibilityRequest): 'routine' | 'urgent' | 'emergency' {
  const symptoms = request.medicalInfo.riskFactors;
  
  // Emergency symptoms
  if (symptoms.some(symptom => HEALTHCARE_CONFIG.urgencyThresholds.emergency.includes(symptom))) {
    return 'emergency';
  }
  
  // Urgent symptoms
  if (symptoms.some(symptom => HEALTHCARE_CONFIG.urgencyThresholds.urgent.includes(symptom))) {
    return 'urgent';
  }
  
  // Combination factors for urgent classification
  if (request.medicalInfo.hasCardiacSymptoms && request.medicalInfo.hasCardiacHistory) {
    return 'urgent';
  }
  
  return 'routine';
}

function calculateCostEstimate(canton: SwissCanton, insuranceProvider: string): {
  insuranceCovered: number;
  patientResponsibility: number;
  deductibleApplies: boolean;
} {
  const cantonCosts = SKIIN_COSTS_BY_CANTON[canton];
  const provider = SWISS_INSURANCE_PROVIDERS.find(p => p.id === insuranceProvider || p.name === insuranceProvider);
  
  const baseCost = cantonCosts.baseCostCHF;
  const coverageRate = provider ? provider.reimbursementRate : cantonCosts.insuranceCoverage;
  
  const insuranceCovered = Math.round(baseCost * coverageRate);
  const patientResponsibility = baseCost - insuranceCovered;
  
  // Assume deductible applies for amounts over CHF 300
  const deductibleApplies = patientResponsibility > 50;
  
  return {
    insuranceCovered,
    patientResponsibility,
    deductibleApplies
  };
}

function requiresGPReferral(insuranceProvider: string, insuranceModel: SwissInsuranceModel): boolean {
  const provider = SWISS_INSURANCE_PROVIDERS.find(p => p.id === insuranceProvider || p.name === insuranceProvider);
  
  if (!provider) {
    return true; // Default to requiring referral for unknown providers
  }
  
  // HMO and Hausarzt models typically require GP referral
  if (['hmo', 'hausarzt'].includes(insuranceModel)) {
    return true;
  }
  
  // Telmed models typically require phone consultation first
  if (insuranceModel === 'telmed') {
    return true;
  }
  
  return provider.requiresGPReferral;
}

export class SwissHealthcareService {
  /**
   * Calculate eligibility for SKIIN heart monitoring
   */
  static async calculateEligibility(request: EligibilityRequest): Promise<ApiResponse<EligibilityResult>> {
    try {
      // Validate input
      const validatedRequest = EligibilityRequestSchema.parse(request);
      
      // Check consent requirements
      if (!validatedRequest.consentGiven || !validatedRequest.dataProcessingConsent) {
        logHealthcareAuditEvent(
          'eligibility_calculation_blocked',
          'blocked',
          validatedRequest.userId,
          { reason: 'missing_consent' }
        );
        
        return {
          error: {
            code: 'CONSENT_REQUIRED',
            message: 'Patient consent is required for eligibility calculation'
          },
          meta: {
            timestamp: new Date().toISOString(),
            version: '1.0'
          }
        };
      }
      
      // Calculate eligibility score
      const eligibilityScore = calculateEligibilityScore(validatedRequest);
      
      // Determine eligibility status
      let eligible = eligibilityScore >= 60;
      let pathway: EligibilityResult['pathway'] = 'ineligible';
      let reason = '';
      
      if (eligibilityScore === 0) {
        eligible = false;
        pathway = 'ineligible';
        reason = 'Medical contraindications or age restrictions prevent eligibility';
      } else if (eligibilityScore >= 80) {
        eligible = true;
        pathway = 'reimbursed';
        reason = 'High eligibility score - recommended for reimbursed pathway';
      } else if (eligibilityScore >= 60) {
        const gpReferralRequired = requiresGPReferral(
          validatedRequest.personalInfo.insuranceProvider,
          validatedRequest.personalInfo.insuranceModel
        );
        
        if (gpReferralRequired) {
          eligible = true;
          pathway = 'gp_referral_required';
          reason = 'Eligible with GP referral required';
        } else {
          eligible = true;
          pathway = 'reimbursed';
          reason = 'Eligible for direct reimbursed pathway';
        }
      } else {
        eligible = false;
        pathway = 'self_pay';
        reason = 'Eligibility score below threshold - self-pay option available';
      }
      
      // Determine urgency level
      const urgencyLevel = determineUrgencyLevel(validatedRequest);
      
      // Calculate cost estimate
      const costEstimate = calculateCostEstimate(
        validatedRequest.personalInfo.canton,
        validatedRequest.personalInfo.insuranceProvider
      );
      
      // Generate next steps
      const nextSteps = this.generateNextSteps(pathway, urgencyLevel, validatedRequest);
      
      // Find recommended provider
      const provider = SWISS_INSURANCE_PROVIDERS.find(
        p => p.id === validatedRequest.personalInfo.insuranceProvider || 
             p.name === validatedRequest.personalInfo.insuranceProvider
      );
      
      const result: EligibilityResult = {
        eligible,
        pathway,
        reason,
        eligibilityScore,
        nextSteps,
        estimatedCoverage: eligible ? costEstimate : undefined,
        gpReferralRequired: pathway === 'gp_referral_required',
        recommendedProvider: provider?.shortName,
        urgencyLevel
      };
      
      logHealthcareAuditEvent(
        'eligibility_calculated',
        'success',
        validatedRequest.userId,
        {
          eligibilityScore,
          pathway,
          urgencyLevel,
          estimatedCoverage: costEstimate,
          insuranceProvider: validatedRequest.personalInfo.insuranceProvider,
          canton: validatedRequest.personalInfo.canton
        }
      );
      
      return {
        data: result,
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      };
      
    } catch (error) {
      logHealthcareAuditEvent(
        'eligibility_calculation_error',
        'failure',
        request.userId,
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
      
      if (error instanceof z.ZodError) {
        return {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid eligibility request format',
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
          message: 'Failed to calculate eligibility'
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      };
    }
  }
  
  /**
   * Get Swiss insurance providers
   */
  static async getInsuranceProviders(): Promise<ApiResponse<{
    providers: SwissInsuranceProvider[];
  }>> {
    return {
      data: {
        providers: SWISS_INSURANCE_PROVIDERS
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    };
  }
  
  /**
   * Generate GP referral packet
   */
  static async generateGPReferralPacket(
    request: EligibilityRequest,
    patientContactInfo: {
      name: string;
      phone: string;
      email: string;
      address: {
        street: string;
        postalCode: string;
        city: string;
        canton: SwissCanton;
      };
    }
  ): Promise<ApiResponse<GPReferralPacket>> {
    try {
      const validatedRequest = EligibilityRequestSchema.parse(request);
      
      const urgencyLevel = determineUrgencyLevel(validatedRequest);
      
      const referralPacket: GPReferralPacket = {
        patientInfo: {
          name: patientContactInfo.name,
          dateOfBirth: validatedRequest.personalInfo.dateOfBirth,
          address: {
            firstName: patientContactInfo.name.split(' ')[0] || '',
            lastName: patientContactInfo.name.split(' ').slice(1).join(' ') || '',
            street: patientContactInfo.address.street,
            postalCode: patientContactInfo.address.postalCode,
            city: patientContactInfo.address.city,
            canton: patientContactInfo.address.canton,
            country: 'CH'
          },
          phone: patientContactInfo.phone,
          email: patientContactInfo.email,
          insuranceNumber: validatedRequest.personalInfo.insuranceNumber || 'Not provided',
          insuranceProvider: validatedRequest.personalInfo.insuranceProvider
        },
        medicalContext: {
          symptoms: validatedRequest.medicalInfo.riskFactors,
          riskFactors: validatedRequest.medicalInfo.riskFactors,
          currentMedications: validatedRequest.medicalInfo.takesCardiacMedication ? ['Cardiac medications (details to be provided)'] : [],
          medicalHistory: validatedRequest.medicalInfo.hasCardiacHistory ? ['Previous cardiac history'] : [],
          urgencyLevel
        },
        requestDetails: {
          requestedService: 'SKIIN Heart Monitoring',
          duration: '10 days',
          justification: this.generateJustification(validatedRequest, urgencyLevel),
          clinicalIndication: this.generateClinicalIndication(validatedRequest)
        },
        generatedAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days validity
        documentId: `SKIIN-REF-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      };
      
      logHealthcareAuditEvent(
        'gp_referral_generated',
        'success',
        validatedRequest.userId,
        {
          documentId: referralPacket.documentId,
          urgencyLevel,
          insuranceProvider: validatedRequest.personalInfo.insuranceProvider
        }
      );
      
      return {
        data: referralPacket,
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      };
      
    } catch (error) {
      logHealthcareAuditEvent(
        'gp_referral_error',
        'failure',
        request.userId,
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
      
      return {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to generate GP referral packet'
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      };
    }
  }
  
  /**
   * Generate next steps based on eligibility result
   */
  private static generateNextSteps(
    pathway: EligibilityResult['pathway'],
    urgencyLevel: 'routine' | 'urgent' | 'emergency',
    request: EligibilityRequest
  ): string[] {
    const steps: string[] = [];
    
    switch (pathway) {
      case 'reimbursed':
        steps.push('Complete registration process');
        steps.push('Schedule device delivery');
        if (urgencyLevel === 'urgent') {
          steps.push('Priority scheduling within 2-3 business days');
        } else {
          steps.push('Standard scheduling within 5-7 business days');
        }
        break;
        
      case 'gp_referral_required':
        steps.push('Download GP referral packet');
        steps.push('Schedule appointment with your general practitioner');
        steps.push('Present SKIIN monitoring request to your GP');
        steps.push('Return with signed referral to complete registration');
        if (urgencyLevel === 'urgent') {
          steps.push('Inform GP of urgent medical need');
        }
        break;
        
      case 'self_pay':
        steps.push('Review self-pay pricing (CHF 350)');
        steps.push('Complete payment process');
        steps.push('Schedule device delivery');
        steps.push('Consider discussing with insurance for potential reimbursement');
        break;
        
      case 'ineligible':
        steps.push('Consult with healthcare provider');
        steps.push('Consider alternative cardiac monitoring options');
        if (request.medicalInfo.contraindications.length > 0) {
          steps.push('Address contraindications with medical professional');
        }
        break;
    }
    
    if (urgencyLevel === 'emergency') {
      steps.unshift('URGENT: Contact emergency services if experiencing chest pain or severe symptoms');
    }
    
    return steps;
  }
  
  /**
   * Generate medical justification for GP referral
   */
  private static generateJustification(request: EligibilityRequest, urgencyLevel: string): string {
    const justifications: string[] = [];
    
    if (request.medicalInfo.hasCardiacSymptoms) {
      justifications.push('Patient reports cardiac symptoms requiring monitoring');
    }
    
    if (request.medicalInfo.hasCardiacHistory) {
      justifications.push('Previous cardiac history indicates need for ongoing monitoring');
    }
    
    if (request.medicalInfo.takesCardiacMedication) {
      justifications.push('Patient on cardiac medication requiring monitoring for effectiveness');
    }
    
    if (request.medicalInfo.riskFactors.length > 0) {
      justifications.push(`Multiple cardiovascular risk factors present: ${request.medicalInfo.riskFactors.join(', ')}`);
    }
    
    if (urgencyLevel === 'urgent') {
      justifications.push('Clinical presentation suggests urgent need for cardiac monitoring');
    }
    
    return justifications.length > 0 
      ? justifications.join('. ') + '.'
      : 'Preventive cardiac monitoring requested for cardiovascular risk assessment.';
  }
  
  /**
   * Generate clinical indication for GP referral
   */
  private static generateClinicalIndication(request: EligibilityRequest): string {
    const indications: string[] = ['Ambulatory cardiac monitoring'];
    
    if (request.medicalInfo.hasCardiacSymptoms) {
      indications.push('symptom correlation');
    }
    
    if (request.medicalInfo.hasCardiacHistory) {
      indications.push('disease progression monitoring');
    }
    
    if (request.medicalInfo.takesCardiacMedication) {
      indications.push('medication response assessment');
    }
    
    return indications.join(' - ');
  }
  
  /**
   * Get healthcare audit logs (admin function)
   */
  static getHealthcareAuditLogs(limit = 100): AuditLogEntry[] {
    return auditLogs.slice(-limit);
  }
  
  /**
   * Get healthcare service metrics (admin function)
   */
  static getHealthcareMetrics() {
    const now = Date.now();
    const hourAgo = now - (60 * 60 * 1000);
    
    const recentLogs = auditLogs.filter(log => new Date(log.timestamp).getTime() > hourAgo);
    
    const eligibilityCalculations = recentLogs.filter(log => log.action === 'eligibility_calculated');
    const averageScore = eligibilityCalculations.reduce((sum, log) => {
      const details = log.details as { eligibilityScore?: number } | undefined;
      return sum + (details?.eligibilityScore || 0);
    }, 0) / (eligibilityCalculations.length || 1);
    
    return {
      eligibilityCalculations: eligibilityCalculations.length,
      gpReferralsGenerated: recentLogs.filter(log => log.action === 'gp_referral_generated').length,
      averageEligibilityScore: Math.round(averageScore),
      pathwayDistribution: {
        reimbursed: eligibilityCalculations.filter((log) => {
          const details = log.details as { pathway?: string } | undefined;
          return details?.pathway === 'reimbursed';
        }).length,
        gpReferralRequired: eligibilityCalculations.filter((log) => {
          const details = log.details as { pathway?: string } | undefined;
          return details?.pathway === 'gp_referral_required';
        }).length,
        selfPay: eligibilityCalculations.filter((log) => {
          const details = log.details as { pathway?: string } | undefined;
          return details?.pathway === 'self_pay';
        }).length,
        ineligible: eligibilityCalculations.filter((log) => {
          const details = log.details as { pathway?: string } | undefined;
          return details?.pathway === 'ineligible';
        }).length
      },
      urgencyDistribution: {
        routine: eligibilityCalculations.filter((log) => {
          const details = log.details as { urgencyLevel?: string } | undefined;
          return details?.urgencyLevel === 'routine';
        }).length,
        urgent: eligibilityCalculations.filter((log) => {
          const details = log.details as { urgencyLevel?: string } | undefined;
          return details?.urgencyLevel === 'urgent';
        }).length,
        emergency: eligibilityCalculations.filter((log) => {
          const details = log.details as { urgencyLevel?: string } | undefined;
          return details?.urgencyLevel === 'emergency';
        }).length
      }
    };
  }
}