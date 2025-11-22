import React from 'react';
import { MinimalTextarea } from '@/components/ui/minimal-textarea';

interface MedicationSectionProps {
  medications?: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export const MedicationSection: React.FC<MedicationSectionProps> = ({
  medications,
  onChange,
  label = "Please list any cardiac medications you are currently taking",
  placeholder = "Medication names and doses if available"
}) => {
  return (
    <MinimalTextarea
      id="medications"
      label={label}
      value={medications || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={4}
    />
  );
};