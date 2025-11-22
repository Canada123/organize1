import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GPDetailsFormProps {
  gpName?: string;
  practiceName?: string;
  hinEmail?: string;
  phoneNumber?: string;
  onGPNameChange: (value: string) => void;
  onPracticeNameChange: (value: string) => void;
  onHINEmailChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
}

export const GPDetailsForm: React.FC<GPDetailsFormProps> = ({
  gpName,
  practiceName,
  hinEmail,
  phoneNumber,
  onGPNameChange,
  onPracticeNameChange,
  onHINEmailChange,
  onPhoneNumberChange
}) => {
  return (
    <div className="space-y-4">
      <Label className="text-base font-ibm-plex-sans font-semibold text-[#004C96]">
        GP Details
      </Label>
      <Input 
        placeholder="GP Name"
        value={gpName || ''}
        onChange={(e) => onGPNameChange(e.target.value)}
      />
      <Input 
        placeholder="Practice Name"
        value={practiceName || ''}
        onChange={(e) => onPracticeNameChange(e.target.value)}
      />
      <Input 
        type="email"
        placeholder="HIN Email (e.g., doctor@clinic.hin.ch)"
        value={hinEmail || ''}
        onChange={(e) => onHINEmailChange(e.target.value)}
        pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]*\.hin\.ch$"
      />
      <Input 
        type="tel"
        placeholder="Phone Number"
        value={phoneNumber || ''}
        onChange={(e) => onPhoneNumberChange(e.target.value)}
      />
    </div>
  );
};