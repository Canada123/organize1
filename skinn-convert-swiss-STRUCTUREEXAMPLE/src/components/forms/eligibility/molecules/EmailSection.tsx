import React from 'react';
import { FormField } from '../atoms/FormField';

interface EmailSectionProps {
  email: string;
  onChange: (value: string) => void;
}

export const EmailSection: React.FC<EmailSectionProps> = ({
  email,
  onChange
}) => {
  return (
    <FormField
      id="email"
      label="Email Address"
      type="email"
      required
      value={email}
      onChange={(e) => onChange(e.target.value)}
      placeholder="your.email@example.com"
    />
  );
};