import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { EligibilityFormData, EligibilityResult } from '../data/types';

interface EligibilityState {
  currentStep: number;
  formData: EligibilityFormData;
  result: EligibilityResult | null;
}

type EligibilityAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'UPDATE_FORM_DATA'; payload: Partial<EligibilityFormData> }
  | { type: 'SET_RESULT'; payload: EligibilityResult }
  | { type: 'RESET_FORM' };

const initialState: EligibilityState = {
  currentStep: 0, // Start at Step 0: Contact & Account
  formData: {
    // Step 0: Contact & Account
    email: '',
    dateOfBirth: '',
    emailVerified: false,
    age: undefined,
    
    // Step 1: Eligibility Gate
    hasInsurance: true,
    insuranceModel: '',
    contraindications: {
      pregnant: false,
      pacemaker: false,
      recentHospitalization: false
    },
    symptoms: [],
    familyHistory: '',
    pathway: undefined,
    eligibilityStatus: undefined,
    
    // Step 2: Detailed Information
    detailedInfo: {
      symptomStartDate: '',
      symptomFrequency: '',
      symptomSeverity: 5,
      priorArrhythmia: false,
      arrhythmiaDescription: '',
      medications: ''
    },
    riskFactors: '',
    
    // Step 3: Review/Payment
    insurer: '',
    reviewData: undefined,
    selfPayData: undefined
  },
  result: null
};

const eligibilityReducer = (
  state: EligibilityState, 
  action: EligibilityAction
): EligibilityState => {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'UPDATE_FORM_DATA':
      return { 
        ...state, 
        formData: { ...state.formData, ...action.payload } 
      };
    case 'SET_RESULT':
      return { ...state, result: action.payload };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
};

const EligibilityContext = createContext<{
  state: EligibilityState;
  dispatch: React.Dispatch<EligibilityAction>;
} | null>(null);

export const EligibilityProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(eligibilityReducer, initialState);
  
  return (
    <EligibilityContext.Provider value={{ state, dispatch }}>
      {children}
    </EligibilityContext.Provider>
  );
};

export const useEligibility = () => {
  const context = useContext(EligibilityContext);
  if (!context) {
    throw new Error('useEligibility must be used within EligibilityProvider');
  }
  return context;
};