import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface GPChoiceSectionProps {
  gpChoice?: 'own' | 'partner';
  onChoiceChange: (choice: 'own' | 'partner') => void;
}

export const GPChoiceSection: React.FC<GPChoiceSectionProps> = ({
  gpChoice,
  onChoiceChange
}) => {
  return (
    <div className="space-y-4">
      <Label className="text-base font-ibm-plex-sans font-semibold text-[#004C96]">
        Choose your referral option:
      </Label>
      <div className="space-y-2">
        <Button 
          variant={gpChoice === 'own' ? 'default' : 'outline'}
          onClick={() => onChoiceChange('own')}
          className="w-full justify-start"
        >
          Use my own GP
        </Button>
        <Button 
          variant={gpChoice === 'partner' ? 'default' : 'outline'}
          onClick={() => onChoiceChange('partner')}
          className="w-full justify-start"
        >
          Use partner GP (Medgate)
        </Button>
      </div>
    </div>
  );
};