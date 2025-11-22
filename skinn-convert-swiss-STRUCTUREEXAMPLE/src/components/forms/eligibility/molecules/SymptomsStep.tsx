import React from 'react';
import { StepNumber } from '../atoms/StepNumber';
import { EmergencyWarning } from '../atoms/EmergencyWarning';
import { SymptomSelector } from '../components/SymptomSelector';

interface SymptomsStepProps {
  symptoms: string[];
  onSymptomToggle: (symptom: string) => void;
  showEmergencyWarning: boolean;
}

export const SymptomsStep: React.FC<SymptomsStepProps> = ({
  symptoms,
  onSymptomToggle,
  showEmergencyWarning
}) => {
  const emergencySymptoms = ['Fainting or loss of consciousness', 'Chest pain or discomfort'];
  const hasEmergency = symptoms.some(s => emergencySymptoms.includes(s));

  return (
    <div className="space-y-4 animate-slideIn">
      <div className="flex items-center gap-2">
        <StepNumber number={3} />
        <h3 className="font-semibold text-[#004C96]">Current Symptoms</h3>
      </div>
      <SymptomSelector
        symptoms={symptoms}
        selectedSymptoms={symptoms}
        onSymptomToggle={onSymptomToggle}
      />
      {hasEmergency && showEmergencyWarning && <EmergencyWarning />}
    </div>
  );
};