import { useState, useEffect } from 'react';

interface EligibilityData {
  hasInsurance: boolean;
  insuranceModel: string;
  symptoms: string[];
  familyHistory: string;
  contraindications: any;
  eligibilityStatus: string;
  pathway: string;
  requiresMedicalReview?: boolean;
  emergencySymptomNoted?: string;
}

export const useEligibilityLogic = (initialData: Partial<EligibilityData> = {}) => {
  const [data, setData] = useState<EligibilityData>({
    hasInsurance: initialData.hasInsurance ?? true,
    insuranceModel: initialData.insuranceModel || '',
    symptoms: initialData.symptoms || [],
    familyHistory: initialData.familyHistory || '',
    contraindications: initialData.contraindications || {},
    eligibilityStatus: '',
    pathway: ''
  });

  const emergencySymptoms = [
    'Fainting or loss of consciousness',
    'Chest pain or discomfort'
  ];

  const checkEmergencySymptoms = (symptomList: string[]) => {
    return symptomList.find(s => emergencySymptoms.includes(s));
  };

  const evaluateEligibility = (currentSymptoms: string[] = data.symptoms) => {
    const hasSymptoms = currentSymptoms.length > 0 && 
      !currentSymptoms.includes('None of the above');
    
    let status = '';
    let pathway = '';
    
    if (data.hasInsurance && hasSymptoms) {
      status = 'eligible-insured';
      pathway = 'insured';
    } else if (data.hasInsurance && !hasSymptoms) {
      status = 'screening-no-reimbursement';
      pathway = 'self-pay-option';
    } else {
      status = 'self-pay';
      pathway = 'self-pay';
    }
    
    setData(prev => ({ ...prev, eligibilityStatus: status, pathway }));
    return { status, pathway };
  };

  const updateData = (updates: Partial<EligibilityData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  return {
    data,
    emergencySymptoms,
    checkEmergencySymptoms,
    evaluateEligibility,
    updateData
  };
};