import React, { useState, useEffect } from 'react';
import { MinimalCard } from '@/components/ui/minimal-card';
import { InsuranceModelSelector } from '../components/InsuranceModelSelector';
import { ContraindicationScreening } from '../components/ContraindicationScreening';
import { SymptomSelector } from '../components/SymptomSelector';
import { FamilyHistoryQuestion } from '../components/FamilyHistoryQuestion';
import { EligibilityStatusAlert } from '../components/EligibilityStatusAlert';
import { EmergencyDialog } from '../components/EmergencyDialog';
import { StageHeader } from '../components/StageHeader';
import { StageFooter } from '../components/StageFooter';
import { Shield, Activity } from 'lucide-react';

interface EligibilityGateStageProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export const EligibilityGateStage: React.FC<EligibilityGateStageProps> = ({
  data,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [hasInsurance, setHasInsurance] = useState(data.hasInsurance ?? true);
  const [insuranceModel, setInsuranceModel] = useState(data.insuranceModel || '');
  const [symptoms, setSymptoms] = useState<string[]>(data.symptoms || []);
  const [familyHistory, setFamilyHistory] = useState(data.familyHistory || '');
  const [contraindications, setContraindications] = useState(data.contraindications || {});
  const [screeningComplete, setScreeningComplete] = useState(false);
  const [eligibilityStatus, setEligibilityStatus] = useState('');
  const [emergencyDialogOpen, setEmergencyDialogOpen] = useState(false);
  const [emergencySymptom, setEmergencySymptom] = useState('');
  
  // Check for emergency symptoms
  const checkEmergencySymptoms = (symptomList: string[]) => {
    const emergencySymptoms = [
      'Fainting or loss of consciousness',
      'Chest pain or discomfort'
    ];
    
    const emergency = symptomList.find(s => emergencySymptoms.includes(s));
    if (emergency) {
      setEmergencySymptom(emergency);
      setEmergencyDialogOpen(true);
      return true;
    }
    return false;
  };
  
  const handleSymptomToggle = (symptom: string) => {
    let newSymptoms: string[] = [];
    
    if (symptom === 'None of the above') {
      newSymptoms = ['None of the above'];
    } else {
      const filtered = symptoms.filter(s => s !== 'None of the above');
      if (symptoms.includes(symptom)) {
        newSymptoms = filtered.filter(s => s !== symptom);
      } else {
        newSymptoms = [...filtered, symptom];
        // Check for emergency symptoms when adding
        checkEmergencySymptoms([symptom]);
      }
    }
    
    setSymptoms(newSymptoms);
    
    // Auto-evaluate eligibility when symptoms change
    if (screeningComplete && !contraindications.pregnant && !contraindications.pacemaker && !contraindications.hospitalized) {
      evaluateEligibility(newSymptoms);
    }
  };
  
  const handleContraindicationComplete = (hasContra: boolean, details: any) => {
    setContraindications(details);
    setScreeningComplete(true);
    
    if (hasContra) {
      setEligibilityStatus('contraindicated');
      onUpdate({ 
        eligibilityStatus: 'contraindicated',
        contraindications: details,
        pathway: 'blocked'
      });
    } else {
      evaluateEligibility(symptoms);
    }
  };
  
  const evaluateEligibility = (currentSymptoms: string[] = symptoms) => {
    const hasSymptoms = currentSymptoms.length > 0 && !currentSymptoms.includes('None of the above');
    
    if (hasInsurance && hasSymptoms) {
      setEligibilityStatus('eligible-insured');
      onUpdate({
        eligibilityStatus: 'eligible-insured',
        pathway: 'insured',
        hasInsurance,
        insuranceModel,
        symptoms: currentSymptoms,
        familyHistory,
        contraindications
      });
    } else if (hasInsurance && !hasSymptoms) {
      setEligibilityStatus('screening-no-reimbursement');
      onUpdate({
        eligibilityStatus: 'screening-no-reimbursement',
        pathway: 'self-pay-option',
        hasInsurance,
        insuranceModel,
        symptoms: currentSymptoms,
        familyHistory,
        contraindications
      });
    } else {
      setEligibilityStatus('self-pay');
      onUpdate({
        eligibilityStatus: 'self-pay',
        pathway: 'self-pay',
        hasInsurance: false,
        symptoms: currentSymptoms,
        familyHistory,
        contraindications
      });
    }
  };
  
  const proceedToSelfPay = () => {
    onUpdate({ 
      pathway: 'self-pay', 
      insuranceModel: 'SelfPay',
      eligibilityStatus: 'self-pay'
    });
    onNext();
  };
  
  const handleCallEmergency = () => {
    window.location.href = 'tel:144'; // Swiss emergency number
  };
  
  const handleContinueAfterEmergency = () => {
    setEmergencyDialogOpen(false);
    // Allow continuation but mark as requiring medical review
    onUpdate({
      requiresMedicalReview: true,
      emergencySymptomNoted: emergencySymptom
    });
  };
  
  // Re-evaluate when insurance status changes
  useEffect(() => {
    if (screeningComplete && !contraindications.pregnant && !contraindications.pacemaker && !contraindications.hospitalized) {
      evaluateEligibility();
    }
  }, [hasInsurance, insuranceModel]);
  
  const canProceed = screeningComplete && 
    eligibilityStatus && 
    eligibilityStatus !== 'contraindicated' &&
    (hasInsurance ? insuranceModel : true) &&
    familyHistory; // Ensure family history is answered
  
  return (
    <>
      <MinimalCard variant="soft" padding="lg">
        <StageHeader
          title="Eligibility Assessment"
          description="Let's determine your eligibility for Holter monitoring"
        />
        
        {/* Trust signals */}
        <div className="flex items-center gap-4 mb-6 p-3 bg-blue-50 rounded-lg">
          <Shield className="h-5 w-5 text-blue-600" />
          <span className="text-sm text-blue-900">Swiss Healthcare Compliant • Medical Grade Assessment</span>
        </div>
        
        <div className="space-y-6">
          {/* Step 1: Insurance */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#004C96] text-white flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <h3 className="font-semibold text-[#004C96]">Insurance Coverage</h3>
            </div>
            <InsuranceModelSelector
              hasInsurance={hasInsurance}
              onInsuranceChange={setHasInsurance}
              model={insuranceModel}
              onModelChange={setInsuranceModel}
            />
          </div>
          
          {/* Step 2: Safety Screening */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#004C96] text-white flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <h3 className="font-semibold text-[#004C96]">Safety Screening</h3>
            </div>
            <ContraindicationScreening
              onScreeningComplete={handleContraindicationComplete}
            />
          </div>
          
          {/* Step 3: Symptoms - Only show if passed contraindication screening */}
          {screeningComplete && eligibilityStatus !== 'contraindicated' && (
            <div className="space-y-4 animate-slideIn">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#004C96] text-white flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <h3 className="font-semibold text-[#004C96]">Current Symptoms</h3>
              </div>
              <SymptomSelector
                symptoms={symptoms}
                selectedSymptoms={symptoms}
                onSymptomToggle={handleSymptomToggle}
              />
              
              {/* Emergency warning if applicable */}
              {symptoms.some(s => ['Fainting or loss of consciousness', 'Chest pain or discomfort'].includes(s)) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <Activity className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-900">Emergency symptoms detected</p>
                    <p className="text-sm text-red-800">These symptoms may require immediate medical attention</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Step 4: Family History - Only show if passed contraindication screening */}
          {screeningComplete && eligibilityStatus !== 'contraindicated' && (
            <div className="space-y-4 animate-slideIn">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#004C96] text-white flex items-center justify-center text-sm font-semibold">
                  4
                </div>
                <h3 className="font-semibold text-[#004C96]">Family History</h3>
              </div>
              <FamilyHistoryQuestion
                value={familyHistory}
                onChange={(value) => {
                  setFamilyHistory(value);
                  // Re-evaluate eligibility after family history is answered
                  if (symptoms.length > 0) {
                    evaluateEligibility();
                  }
                }}
              />
            </div>
          )}
          
          {/* Eligibility Status Alert */}
          {eligibilityStatus && (
            <div className="mt-6 animate-fadeIn">
              <EligibilityStatusAlert
                status={eligibilityStatus as any}
                onProceedSelfPay={proceedToSelfPay}
                onExit={() => window.location.href = '/'}
              />
            </div>
          )}
        </div>
        
        <StageFooter
          onBack={onBack}
          onNext={onNext}
          nextDisabled={!canProceed}
          showSave={true}
          onSave={() => {
            // Save current progress
            onUpdate({
              hasInsurance,
              insuranceModel,
              symptoms,
              familyHistory,
              contraindications,
              eligibilityStatus,
              screeningComplete
            });
  // Console statement removed by ESLint fix
          }}
        />
      </MinimalCard>
      
      {/* Emergency Dialog */}
      <EmergencyDialog
        open={emergencyDialogOpen}
        symptom={emergencySymptom}
        onClose={() => setEmergencyDialogOpen(false)}
        onCallEmergency={handleCallEmergency}
        onContinueAnyway={emergencySymptom.includes('Chest pain') ? undefined : handleContinueAfterEmergency}
      />
    </>
  );
};