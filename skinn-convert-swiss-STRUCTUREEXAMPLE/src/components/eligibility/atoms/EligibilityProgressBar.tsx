import React from 'react';

interface EligibilityProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export const EligibilityProgressBar: React.FC<EligibilityProgressBarProps> = ({
  currentStep,
  totalSteps,
  className = ''
}) => {
  // Fix: currentStep is 0-based, so add 1 for display and calculation
  const displayStep = currentStep + 1;
  const progress = Math.round((displayStep / totalSteps) * 100);
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-muted-foreground">
          Step {displayStep} of {totalSteps}
        </span>
        <span className="text-sm text-muted-foreground">{progress}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};