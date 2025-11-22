import React from 'react';
import { OTPVerification } from '../components/OTPVerification';
import { AlertBox } from '../atoms/AlertBox';
import { CheckCircle } from 'lucide-react';

interface EmailVerificationSectionProps {
  email: string;
  emailVerified: boolean;
  onVerified: () => void;
  onSendOTP: (email: string) => Promise<void>;
  onVerifyOTP: (code: string) => Promise<boolean>;
}

export const EmailVerificationSection: React.FC<EmailVerificationSectionProps> = ({
  email,
  emailVerified,
  onVerified,
  onSendOTP,
  onVerifyOTP
}) => {
  return (
    <>
      {email && !emailVerified && (
        <OTPVerification
          email={email}
          onVerified={onVerified}
          onSendOTP={onSendOTP}
          onVerifyOTP={onVerifyOTP}
        />
      )}
      
      {emailVerified && (
        <AlertBox
          type="success"
          icon={CheckCircle}
          message="Email verified successfully"
        />
      )}
    </>
  );
};