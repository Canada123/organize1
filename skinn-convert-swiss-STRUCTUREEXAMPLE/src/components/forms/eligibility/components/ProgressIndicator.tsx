import React from 'react';
import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  steps,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Mobile Progress Bar */}
      <div className="block md:hidden mb-4">
        <div className="flex items-center justify-between text-sm text-[#475259] mb-2">
          <span>Step {currentStep + 1} of {totalSteps}</span>
          <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-[#004C96] h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
        <p className="text-sm text-[#004C96] font-medium mt-2">
          {steps[currentStep]}
        </p>
      </div>

      {/* Desktop Step Indicator */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const isUpcoming = index > currentStep;

            return (
              <React.Fragment key={stepNumber}>
                <div className="flex flex-col items-center">
                  {/* Step Circle */}
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                    ${isCompleted 
                      ? 'bg-green-600 text-white' 
                      : isActive 
                      ? 'bg-[#004C96] text-white ring-4 ring-[#004C96]/20' 
                      : 'bg-gray-200 text-gray-500'
                    }
                  `}>
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      stepNumber
                    )}
                  </div>
                  
                  {/* Step Label */}
                  <div className="mt-3 text-center max-w-[120px]">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-[#004C96]' : 
                      isCompleted ? 'text-green-700' : 
                      'text-gray-500'
                    }`}>
                      {step}
                    </p>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-4">
                    <div className={`h-0.5 transition-all duration-500 ${
                      index < currentStep ? 'bg-green-400' : 'bg-gray-200'
                    }`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};