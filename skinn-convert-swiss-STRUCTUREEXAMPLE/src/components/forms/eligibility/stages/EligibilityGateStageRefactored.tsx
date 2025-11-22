import React, { useState, useEffect } from 'react';
import { MinimalCard } from '@/components/ui/minimal-card';
import { StageHeader } from '../components/StageHeader';
import { StageFooter } from '../components/StageFooter';
import { EligibilityStatusAlert } from '../components/EligibilityStatusAlert';
import { EmergencyDialog } from '../components/EmergencyDialog';

// Atomic components
import { TrustBadge } from '../atoms/TrustBadge';

// Molecules
import { InsuranceStep } from '../molecules/InsuranceStep';
import { SafetyStep } from '../molecules/SafetyStep';
import { SymptomsStep } from '../molecules/SymptomsStep';
import { FamilyHistoryStep } from '../molecules/FamilyHistoryStep';

// Business logic hook
import { useEligibilityLogic } from '../hooks/useEligibilityLogic';

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
  const {
    data: eligibilityData,
    emergencySymptoms,
    checkEmergencySymptoms,
    evaluateEligibility,
    updateData
  } = useEligibilityLogic(data);

  const [screeningComplete, setScreeningComplete] = useState(false);
  const [emergencyDialogOpen, setEmergencyDialogOpen] = useState(false);
  const [emergencySymptom, setEmergencySymptom] = useState('');

  const handleSymptomToggle = (symptom: string) => {
    let newSymptoms: string[] = [];
    
    if (symptom === 'None of the above') {
      newSymptoms = ['None of the above'];
    } else {
      const filtered = eligibilityData.symptoms.filter(s => s !== 'None of the above');
      if (eligibilityData.symptoms.includes(symptom)) {
        newSymptoms = filtered.filter(s => s !== symptom);
      } else {
        newSymptoms = [...filtered, symptom];
        const emergency = checkEmergencySymptoms([symptom]);
        if (emergency) {
          setEmergencySymptom(emergency);
          setEmergencyDialogOpen(true);
        }
      }
    }
    
    updateData({ symptoms: newSymptoms });
    
    if (screeningComplete && !eligibilityData.contraindications.pregnant && 
        !eligibilityData.contraindications.pacemaker && 
        !eligibilityData.contraindications.hospitalized) {
      evaluateEligibility(newSymptoms);
    }
  };

  const handleContraindicationComplete = (hasContra: boolean, details: any) => {
    updateData({ contraindications: details });
    setScreeningComplete(true);
    
    if (hasContra) {
      updateData({ 
        eligibilityStatus: 'contraindicated',
        pathway: 'blocked'
      });
      onUpdate({ 
        eligibilityStatus: 'contraindicated',
        contraindications: details,
        pathway: 'blocked'
      });
    } else {
      evaluateEligibility();
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
    window.location.href = 'tel:144';
  };

  const handleContinueAfterEmergency = () => {
    setEmergencyDialogOpen(false);
    updateData({
      requiresMedicalReview: true,
      emergencySymptomNoted: emergencySymptom
    });
    onUpdate({
      requiresMedicalReview: true,
      emergencySymptomNoted: emergencySymptom
    });
  };

  useEffect(() => {
    if (screeningComplete && !eligibilityData.contraindications.pregnant && 
        !eligibilityData.contraindications.pacemaker && 
        !eligibilityData.contraindications.hospitalized) {
      evaluateEligibility();
    }
  }, [eligibilityData.hasInsurance, eligibilityData.insuranceModel]);

  useEffect(() => {
    onUpdate(eligibilityData);
  }, [eligibilityData]);

  const canProceed = screeningComplete && 
    eligibilityData.eligibilityStatus && 
    eligibilityData.eligibilityStatus !== 'contraindicated' &&
    (eligibilityData.hasInsurance ? eligibilityData.insuranceModel : true) &&
    eligibilityData.familyHistory;

  return (
    <>
      <MinimalCard variant="soft" padding="lg">
        <StageHeader
          title="Eligibility Assessment"
          description="Let's determine your eligibility for Holter monitoring"
        />
        
        <TrustBadge className="mb-6" />
        
        <div className="space-y-6">
          <InsuranceStep
            hasInsurance={eligibilityData.hasInsurance}
            insuranceModel={eligibilityData.insuranceModel}
            onInsuranceChange={(value) => updateData({ hasInsurance: value })}
            onModelChange={(value) => updateData({ insuranceModel: value })}
          />
          
          <SafetyStep
            onScreeningComplete={handleContraindicationComplete}
          />
          
          {screeningComplete && eligibilityData.eligibilityStatus !== 'contraindicated' && (
            <>
              <SymptomsStep
                symptoms={eligibilityData.symptoms}
                onSymptomToggle={handleSymptomToggle}
                showEmergencyWarning={true}
              />
              
              <FamilyHistoryStep
                value={eligibilityData.familyHistory}
                onChange={(value) => {
                  updateData({ familyHistory: value });
                  if (eligibilityData.symptoms.length > 0) {
                    evaluateEligibility();
                  }
                }}
              />
            </>
          )}
          
          {eligibilityData.eligibilityStatus && (
            <div className="mt-6 animate-fadeIn">
              <EligibilityStatusAlert
                status={eligibilityData.eligibilityStatus as any}
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
            onUpdate({
              ...eligibilityData,
              screeningComplete
            });
  // Console statement removed by ESLint fix
          }}
        />
      </MinimalCard>
      
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