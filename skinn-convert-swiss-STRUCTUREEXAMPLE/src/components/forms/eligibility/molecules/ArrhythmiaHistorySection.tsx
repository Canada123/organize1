import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { MinimalTextarea } from '@/components/ui/minimal-textarea';

interface ArrhythmiaHistorySectionProps {
  priorArrhythmia?: boolean;
  arrhythmiaDescription?: string;
  onArrhythmiaChange: (value: boolean) => void;
  onDescriptionChange: (value: string) => void;
}

export const ArrhythmiaHistorySection: React.FC<ArrhythmiaHistorySectionProps> = ({
  priorArrhythmia,
  arrhythmiaDescription,
  onArrhythmiaChange,
  onDescriptionChange
}) => {
  return (
    <>
      <div className="space-y-3">
        <Label className="text-base font-ibm-plex-sans font-semibold text-[#004C96]">
          Have you been diagnosed with a heart rhythm problem or had a recent cardiac procedure?
        </Label>
        <RadioGroup 
          value={priorArrhythmia?.toString()} 
          onValueChange={(v) => onArrhythmiaChange(v === 'true')}
        >
          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="true" 
                id="arrhythmia-yes"
                className="border-[#004C96]/30 text-[#004C96]"
              />
              <Label 
                htmlFor="arrhythmia-yes"
                className="font-ibm-plex-sans text-base text-[#0D0D0D] cursor-pointer"
              >
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="false" 
                id="arrhythmia-no"
                className="border-[#004C96]/30 text-[#004C96]"
              />
              <Label 
                htmlFor="arrhythmia-no"
                className="font-ibm-plex-sans text-base text-[#0D0D0D] cursor-pointer"
              >
                No
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>
      
      {priorArrhythmia && (
        <MinimalTextarea
          id="arrhythmia-desc"
          label="Please provide details and date"
          value={arrhythmiaDescription || ''}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Brief description and date of diagnosis/procedure"
        />
      )}
    </>
  );
};