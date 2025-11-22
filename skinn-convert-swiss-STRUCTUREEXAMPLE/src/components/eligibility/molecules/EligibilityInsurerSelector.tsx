import React from 'react';
import { MinimalSelect } from '@/components/ui/minimal-select';
import { SelectOption } from '../data/types';

interface EligibilityInsurerSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  title: string;
  placeholder: string;
  helpText?: string;
  className?: string;
}

export const EligibilityInsurerSelector: React.FC<EligibilityInsurerSelectorProps> = ({
  value,
  onChange,
  options,
  title,
  placeholder,
  helpText,
  className = ''
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <h3 className="text-xl font-semibold">{title}</h3>
      <MinimalSelect
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        options={options}
      />
      {helpText && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
};