import React from 'react';
import { FormField } from '../atoms/FormField';

interface DateOfBirthSectionProps {
  dateOfBirth: string;
  onChange: (value: string) => void;
  error?: string;
}

export const DateOfBirthSection: React.FC<DateOfBirthSectionProps> = ({
  dateOfBirth,
  onChange,
  error
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange(value);
  };

  return (
    <FormField
      id="dob"
      label="Date of Birth"
      type="date"
      required
      value={dateOfBirth}
      onChange={handleChange}
      max={new Date().toISOString().split('T')[0]}
      error={error}
    />
  );
};