// Swiss Healthcare Eligibility Types
export interface EligibilityResult {
  eligible: boolean;
  coverage: 'covered' | 'self-pay' | 'consult-first';
  nextSteps: string[];
  insuranceInfo?: string;
}

export interface EligibilityFormData {
  // Step 0: Contact & Account
  email: string;
  dateOfBirth: string;
  emailVerified: boolean;
  age?: number;
  
  // Step 1: Eligibility Gate
  hasInsurance: boolean;
  insuranceModel: string;
  contraindications: {
    pregnant?: boolean;
    pacemaker?: boolean;
    recentHospitalization?: boolean;
  };
  symptoms: string | string[];
  familyHistory: string;
  pathway?: 'insured' | 'self-pay';
  eligibilityStatus?: any;
  
  // Step 2: Detailed Information
  detailedInfo?: {
    symptomStartDate?: string;
    symptomFrequency?: string;
    symptomSeverity?: number;
    priorArrhythmia?: boolean;
    arrhythmiaDescription?: string;
    medications?: string;
  };
  riskFactors: string;
  
  // Step 3: Review/Payment
  insurer: string;
  reviewData?: {
    gpChoice?: 'own' | 'partner';
    gpName?: string;
    practiceName?: string;
    hinEmail?: string;
    phoneNumber?: string;
    consents: {
      truthfulness: boolean;
      emergency: boolean;
      dataProcessing: boolean;
    };
  };
  selfPayData?: {
    phoneNumber: string;
    phoneVerified: boolean;
    shippingAddress: {
      street: string;
      postalCode: string;
      city: string;
      country: string;
    };
    payment: any;
    consents: {
      truthfulness: boolean;
      emergency: boolean;
      dataProcessing: boolean;
    };
  };
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface EligibilityStep {
  number: number;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
}