import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { SelectOption } from '../data/types';

interface EligibilityRiskFactorSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  title: string;
  className?: string;
}

export const EligibilityRiskFactorSelector: React.FC<EligibilityRiskFactorSelectorProps> = ({
  value,
  onChange,
  options,
  title,
  className = ''
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <h3 className="text-xl font-semibold">{title}</h3>
      <RadioGroup value={value} onValueChange={onChange}>
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={option.value} />
            <Label htmlFor={option.value} className="cursor-pointer">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};