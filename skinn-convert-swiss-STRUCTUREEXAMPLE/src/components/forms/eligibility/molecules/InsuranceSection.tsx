import React from 'react';
import { SwissInsuranceSelector } from '../atoms/SwissInsuranceSelector';

interface InsuranceSectionProps {
  hasInsurance: boolean;
  insuranceModel: string;
  onInsuranceChange: (hasInsurance: boolean) => void;
  onModelChange: (model: string) => void;
}

export const InsuranceSection: React.FC<InsuranceSectionProps> = ({
  hasInsurance,
  insuranceModel,
  onInsuranceChange,
  onModelChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Insurance Information</h3>
      <SwissInsuranceSelector
        hasInsurance={hasInsurance}
        model={insuranceModel}
        onInsuranceChange={onInsuranceChange}
        onModelChange={onModelChange}
      />
    </div>
  );
};