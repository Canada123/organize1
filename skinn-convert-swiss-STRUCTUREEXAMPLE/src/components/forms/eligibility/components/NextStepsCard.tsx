import React from 'react';
import { MinimalCard, MinimalCardContent } from '@/components/ui/minimal-card';
import { LucideIcon } from 'lucide-react';

interface NextStep {
  icon: LucideIcon;
  text: string;
}

interface NextStepsCardProps {
  steps: NextStep[];
  title?: string;
}

export const NextStepsCard: React.FC<NextStepsCardProps> = ({ 
  steps,
  title = "Next Steps"
}) => {
  return (
    <MinimalCard variant="elevated">
      <MinimalCardContent className="space-y-4">
        <h3 className="text-lg font-ibm-plex-sans font-bold text-[#004C96]">
          {title}
        </h3>
        <div className="space-y-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#EEE8E1] flex items-center justify-center">
                  <Icon className="h-5 w-5 text-[#004C96]" />
                </div>
                <p className="text-base font-ibm-plex-sans text-[#0D0D0D] pt-2">
                  {step.text}
                </p>
              </div>
            );
          })}
        </div>
      </MinimalCardContent>
    </MinimalCard>
  );
};