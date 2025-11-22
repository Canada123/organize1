import React from 'react';
import { StepNumber } from '../atoms/StepNumber';
import { ContraindicationScreening } from '../components/ContraindicationScreening';

interface SafetyStepProps {
  onScreeningComplete: (hasContraindications: boolean, details: any) => void;
}

export const SafetyStep: React.FC<SafetyStepProps> = ({
  onScreeningComplete
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <StepNumber number={2} />
        <h3 className="font-semibold text-[#004C96]">Safety Screening</h3>
      </div>
      <ContraindicationScreening
        onScreeningComplete={onScreeningComplete}
      />
    </div>
  );
};