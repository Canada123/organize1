import React from 'react';
import { MinimalInput } from '@/components/ui/minimal-input';
import { MinimalSelect } from '@/components/ui/minimal-select';
import { SeveritySlider } from '../atoms/SeveritySlider';

interface SymptomDetailsSectionProps {
  symptomStartDate?: string;
  symptomFrequency?: 'daily' | 'weekly' | 'monthly' | 'sporadic';
  symptomSeverity?: number;
  onDateChange: (date: string) => void;
  onFrequencyChange: (frequency: 'daily' | 'weekly' | 'monthly' | 'sporadic') => void;
  onSeverityChange: (severity: number) => void;
}

const frequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'sporadic', label: 'Sporadic' },
];

export const SymptomDetailsSection: React.FC<SymptomDetailsSectionProps> = ({
  symptomStartDate,
  symptomFrequency,
  symptomSeverity,
  onDateChange,
  onFrequencyChange,
  onSeverityChange
}) => {
  return (
    <>
      <MinimalInput
        id="symptom-start"
        type="date"
        label="When did your symptoms begin?"
        value={symptomStartDate || ''}
        onChange={(e) => onDateChange(e.target.value)}
        max={new Date().toISOString().split('T')[0]}
      />
      
      <MinimalSelect
        label="How frequently do you experience symptoms?"
        value={symptomFrequency}
        onChange={(v) => onFrequencyChange(v as any)}
        options={frequencyOptions}
        placeholder="Select frequency"
      />
      
      <SeveritySlider
        label="How severe are your symptoms? (1-10)"
        value={symptomSeverity || 5}
        onChange={onSeverityChange}
      />
    </>
  );
};