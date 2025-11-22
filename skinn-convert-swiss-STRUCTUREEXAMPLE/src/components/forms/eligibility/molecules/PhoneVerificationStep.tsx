import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OTPVerification } from '../components/OTPVerification';
import { StepNumber } from '../atoms/StepNumber';

interface PhoneVerificationStepProps {
  phoneNumber: string;
  phoneVerified: boolean;
  onPhoneChange: (phone: string) => void;
  onVerificationComplete: (verified: boolean) => void;
  onResendOTP: () => void;
}

export const PhoneVerificationStep: React.FC<PhoneVerificationStepProps> = ({
  phoneNumber,
  phoneVerified,
  onPhoneChange,
  onVerificationComplete,
  onResendOTP
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <StepNumber number={1} />
        <h3 className="font-semibold text-[#004C96]">Phone Verification</h3>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number (for SMS tracking updates)</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+41 XX XXX XX XX"
          value={phoneNumber}
          onChange={(e) => onPhoneChange(e.target.value)}
          disabled={phoneVerified}
        />
      </div>
      
      {phoneNumber && !phoneVerified && (
        <OTPVerification
          phone={phoneNumber}
          onVerificationComplete={onVerificationComplete}
          onResendOTP={onResendOTP}
        />
      )}
      
      {phoneVerified && (
        <p className="text-sm text-green-600">✓ Phone number verified</p>
      )}
    </div>
  );
};