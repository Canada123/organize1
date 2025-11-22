import { EligibilityFormData, EligibilityResult } from '../data/types';

export const calculateEligibility = (
  formData: EligibilityFormData, 
  t: any
): EligibilityResult => {
  const hasSymptoms = formData.symptoms !== 'none';
  const hasRiskFactors = formData.riskFactors !== 'none';
  
  if (hasSymptoms || hasRiskFactors) {
    // Eligible for coverage
    let coverage: 'covered' | 'self-pay' | 'consult-first' = 'covered';
    let nextSteps: string[] = [];
    let insuranceInfo = '';

    switch (formData.insuranceModel) {
      case 'standard':
        nextSteps = [
          t.nextSteps.standard.step1,
          t.nextSteps.standard.step2, 
          t.nextSteps.standard.step3
        ];
        insuranceInfo = t.nextSteps.standard.info;
        break;
      case 'gp-model':
        coverage = 'consult-first';
        nextSteps = [
          t.nextSteps.gpModel.step1,
          t.nextSteps.gpModel.step2,
          t.nextSteps.gpModel.step3
        ];
        insuranceInfo = t.nextSteps.gpModel.info;
        break;
      case 'hmo':
        coverage = 'consult-first';
        nextSteps = [
          t.nextSteps.hmo.step1,
          t.nextSteps.hmo.step2,
          t.nextSteps.hmo.step3
        ];
        insuranceInfo = t.nextSteps.hmo.info;
        break;
      case 'telmed':
        nextSteps = [
          t.nextSteps.telmed.step1,
          t.nextSteps.telmed.step2,
          t.nextSteps.telmed.step3
        ];
        insuranceInfo = t.nextSteps.telmed.info;
        break;
      default:
        nextSteps = [
          t.nextSteps.unsure.step1,
          t.nextSteps.unsure.step2,
          t.nextSteps.unsure.step3
        ];
    }

    return {
      eligible: true,
      coverage,
      nextSteps,
      insuranceInfo
    };
  } else {
    // No symptoms or risk factors - likely self-pay
    return {
      eligible: true,
      coverage: 'self-pay',
      nextSteps: [
        t.nextSteps.selfPay.step1,
        t.nextSteps.selfPay.step2,
        t.nextSteps.selfPay.step3
      ],
      insuranceInfo: t.nextSteps.selfPay.info
    };
  }
};