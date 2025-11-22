import React from 'react';
import { FormField } from '../atoms/FormField';

interface NameSectionProps {
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
}

export const NameSection: React.FC<NameSectionProps> = ({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        id="firstName"
        label="First Name"
        type="text"
        required
        value={firstName}
        onChange={(e) => onFirstNameChange(e.target.value)}
        placeholder="Enter your first name"
      />
      
      <FormField
        id="lastName"
        label="Last Name"
        type="text"
        required
        value={lastName}
        onChange={(e) => onLastNameChange(e.target.value)}
        placeholder="Enter your last name"
      />
    </div>
  );
};