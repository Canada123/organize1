import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface SeveritySliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
}

export const SeveritySlider: React.FC<SeveritySliderProps> = ({
  label,
  value,
  onChange,
  min = 1,
  max = 10,
  minLabel = '1 - Minimal',
  maxLabel = '10 - Severe'
}) => {
  return (
    <div className="space-y-3">
      <Label className="text-base font-ibm-plex-sans font-semibold text-[#004C96]">
        {label}
      </Label>
      <Slider 
        min={min} 
        max={max} 
        step={1}
        value={[value || Math.floor((min + max) / 2)]}
        onValueChange={([v]) => onChange(v)}
        className="w-full"
      />
      <div className="flex justify-between text-sm font-ibm-plex-sans text-[#475259]">
        <span>{minLabel}</span>
        <span className="font-semibold text-[#004C96]">
          {value || Math.floor((min + max) / 2)}
        </span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
};