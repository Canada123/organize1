import React from 'react';
import { StepNumber } from '../atoms/StepNumber';
import { InsuranceModelSelector } from '../components/InsuranceModelSelector';

interface InsuranceStepProps {
  hasInsurance: boolean;
  insuranceModel: string;
  onInsuranceChange: (hasInsurance: boolean) => void;
  onModelChange: (model: string) => void;
}

export const InsuranceStep: React.FC<InsuranceStepProps> = ({
  hasInsurance,
  insuranceModel,
  onInsuranceChange,
  onModelChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <StepNumber number={1} />
        <h3 className="font-semibold text-[#004C96]">Insurance Coverage</h3>
      </div>
      <InsuranceModelSelector
        hasInsurance={hasInsurance}
        onInsuranceChange={onInsuranceChange}
        model={insuranceModel}
        onModelChange={onModelChange}
      />
    </div>
  );
};