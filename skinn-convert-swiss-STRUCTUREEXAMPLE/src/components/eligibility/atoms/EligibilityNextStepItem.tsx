import React from 'react';

interface EligibilityNextStepItemProps {
  step: string;
  stepNumber: number;
  className?: string;
}

export const EligibilityNextStepItem: React.FC<EligibilityNextStepItemProps> = ({
  step,
  stepNumber,
  className = ''
}) => {
  return (
    <div className={`flex items-start space-x-3 ${className}`}>
      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
        {stepNumber}
      </div>
      <p className="text-foreground">{step}</p>
    </div>
  );
};