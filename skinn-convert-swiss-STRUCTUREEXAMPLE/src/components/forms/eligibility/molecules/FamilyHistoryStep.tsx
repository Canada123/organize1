import React from 'react';
import { StepNumber } from '../atoms/StepNumber';
import { FamilyHistoryQuestion } from '../components/FamilyHistoryQuestion';

interface FamilyHistoryStepProps {
  value: string;
  onChange: (value: string) => void;
}

export const FamilyHistoryStep: React.FC<FamilyHistoryStepProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="space-y-4 animate-slideIn">
      <div className="flex items-center gap-2">
        <StepNumber number={4} />
        <h3 className="font-semibold text-[#004C96]">Family History</h3>
      </div>
      <FamilyHistoryQuestion
        value={value}
        onChange={onChange}
      />
    </div>
  );
};