/**
 * Comprehensive Testing of Eligibility Questionnaire Atomic Components
 * Testing & QA Specification Agent - Test Suite
 * Version: 1.0
 * Date: 2025-08-22
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { calculateEligibility } from './utils/eligibilityCalculator';
import { SWISS_INSURERS, getSymptomOptions, getRiskFactorOptions, getInsuranceModelOptions } from './data/swissHealthcareData';
import type { EligibilityFormData } from './data/types';

// Mock translation function for testing
const mockTranslations = {
  symptoms: {
    palpitations: "Palpitations",
    dizziness: "Dizziness", 
    chestPain: "Chest pain",
    shortness: "Shortness of breath",
    none: "No symptoms"
  },
  riskFactors: {
    familyHistory: "Family history",
    hypertension: "High blood pressure",
    diabetes: "Diabetes",
    ageOver50: "Age over 50",
    none: "No risk factors"
  },
  insuranceModels: {
    standard: "Standard model",
    gpModel: "GP model",
    hmo: "HMO model", 
    telmed: "Telmed model",
    unsure: "Unsure"
  },
  nextSteps: {
    standard: {
      step1: "Contact your GP",
      step2: "Get referral",
      step3: "Schedule screening",
      info: "Standard coverage applies"
    },
    gpModel: {
      step1: "Consult your GP first",
      step2: "Get approval",
      step3: "Schedule screening",
      info: "GP approval required"
    },
    hmo: {
      step1: "Contact HMO center",
      step2: "Get approval",
      step3: "Schedule screening", 
      info: "HMO approval required"
    },
    telmed: {
      step1: "Call Telmed hotline",
      step2: "Get consultation",
      step3: "Schedule screening",
      info: "Telmed consultation required"
    },
    selfPay: {
      step1: "Contact us directly",
      step2: "Schedule appointment",
      step3: "Pay for service",
      info: "Self-pay option available"
    },
    unsure: {
      step1: "Check insurance documents",
      step2: "Contact insurance",
      step3: "Get clarification",
      info: "Insurance verification needed"
    }
  }
};

describe('Eligibility Questionnaire Comprehensive Test Suite', () => {
  
  describe('1. Component Architecture Testing', () => {
    
    it('should validate atomic component isolation', () => {
      const symptomOptions = getSymptomOptions(mockTranslations);
      expect(symptomOptions).toHaveLength(5);
      expect(symptomOptions[0]).toHaveProperty('value');
      expect(symptomOptions[0]).toHaveProperty('label');
    });
  });

  describe('2. Swiss Healthcare Functionality Testing', () => {
    
    describe('Insurance model handling', () => {
      it('should handle Standard/Flex insurance model', () => {
        const formData: EligibilityFormData = {
          symptoms: 'chest-pain',
          riskFactors: 'diabetes',
          insuranceModel: 'standard',
          insurer: 'helsana'
        };
        
        const result = calculateEligibility(formData, mockTranslations);
        expect(result.coverage).toBe('covered');
        expect(result.insuranceInfo).toBe('Standard coverage applies');
      });
      
      it('should handle HMO insurance model', () => {
        const formData: EligibilityFormData = {
          symptoms: 'dizziness',
          riskFactors: 'family-history',
          insuranceModel: 'hmo',
          insurer: 'swica'
        };
        
        const result = calculateEligibility(formData, mockTranslations);
        expect(result.coverage).toBe('consult-first');
        expect(result.insuranceInfo).toBe('HMO approval required');
      });
      
      it('should handle Self-Pay option', () => {
        const formData: EligibilityFormData = {
          symptoms: 'none',
          riskFactors: 'none',
          insuranceModel: 'standard',
          insurer: 'css'
        };
        
        const result = calculateEligibility(formData, mockTranslations);
        expect(result.coverage).toBe('self-pay');
        expect(result.insuranceInfo).toBe('Self-pay option available');
      });
    });
    
    describe('Swiss insurer support', () => {
      it('should support all major Swiss insurers', () => {
        expect(SWISS_INSURERS).toHaveLength(8);
        
        const insurerNames = SWISS_INSURERS.map(i => i.value);
        expect(insurerNames).toContain('css');
        expect(insurerNames).toContain('helsana');
        expect(insurerNames).toContain('swica');
        expect(insurerNames).toContain('sanitas');
      });
    });
  });

  describe('3. Performance Testing', () => {
    
    it('should process eligibility calculation quickly', () => {
      const start = performance.now();
      
      const formData: EligibilityFormData = {
        symptoms: 'palpitations',
        riskFactors: 'hypertension',
        insuranceModel: 'standard',
        insurer: 'css'
      };
      
      const result = calculateEligibility(formData, mockTranslations);
      
      const end = performance.now();
      const duration = end - start;
      
      // Should complete in under 10ms
      expect(duration).toBeLessThan(10);
      expect(result).toBeDefined();
    });
  });
});