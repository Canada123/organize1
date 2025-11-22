import React from 'react';
import { EligibilityNextStepItem } from '../atoms/EligibilityNextStepItem';

interface EligibilityNextStepsListProps {
  steps: string[];
  title: string;
  className?: string;
}

export const EligibilityNextStepsList: React.FC<EligibilityNextStepsListProps> = ({
  steps,
  title,
  className = ''
}) => {
  return (
    <div className={className}>
      <h3 className="font-semibold text-lg mb-4">{title}</h3>
      <div className="space-y-3">
        {steps.map((step, index) => (
          <EligibilityNextStepItem
            key={index}
            step={step}
            stepNumber={index + 1}
          />
        ))}
      </div>
    </div>
  );
};