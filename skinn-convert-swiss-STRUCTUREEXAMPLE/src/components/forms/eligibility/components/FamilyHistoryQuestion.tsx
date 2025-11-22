import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface FamilyHistoryQuestionProps {
  value: string;
  onChange: (value: string) => void;
}

export const FamilyHistoryQuestion: React.FC<FamilyHistoryQuestionProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <Label className="text-base font-ibm-plex-sans font-semibold text-[#004C96] block">
        Has a close relative experienced sudden cardiac death or arrhythmia?
      </Label>
      <RadioGroup value={value} onValueChange={onChange}>
        <div className="flex space-x-8">
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="yes" 
              id="fh-yes"
              className="border-[#004C96]/30 text-[#004C96]"
            />
            <Label 
              htmlFor="fh-yes" 
              className="text-base font-ibm-plex-sans text-[#0D0D0D] cursor-pointer"
            >
              Yes
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="no" 
              id="fh-no"
              className="border-[#004C96]/30 text-[#004C96]"
            />
            <Label 
              htmlFor="fh-no" 
              className="text-base font-ibm-plex-sans text-[#0D0D0D] cursor-pointer"
            >
              No
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="unknown" 
              id="fh-unknown"
              className="border-[#004C96]/30 text-[#004C96]"
            />
            <Label 
              htmlFor="fh-unknown" 
              className="text-base font-ibm-plex-sans text-[#0D0D0D] cursor-pointer"
            >
              Unknown
            </Label>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};