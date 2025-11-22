import React from 'react';
import { Calendar, CheckCircle, LucideIcon } from 'lucide-react';

interface NextStepItem {
  icon: LucideIcon;
  text: string;
}

interface NextStepsGridProps {
  steps: NextStepItem[];
  textColor?: string;
}

export const NextStepsGrid: React.FC<NextStepsGridProps> = ({ 
  steps, 
  textColor = 'text-green-800' 
}) => {
  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-green-900">Next Steps:</h4>
      <div className="grid md:grid-cols-2 gap-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className={`flex items-center gap-2 text-sm ${textColor}`}>
              <Icon className="h-4 w-4" />
              {step.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Default next steps for eligible status
export const defaultEligibleSteps: NextStepItem[] = [
  { icon: Calendar, text: 'Complete remaining assessment questions' },
  { icon: CheckCircle, text: 'Insurance pre-authorization (handled for you)' }
];