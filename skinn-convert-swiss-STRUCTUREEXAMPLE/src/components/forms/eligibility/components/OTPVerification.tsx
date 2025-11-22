import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface OTPVerificationProps {
  email?: string;
  phone?: string;
  onVerified: () => void;
  onSendOTP: (target: string) => Promise<void>;
  onVerifyOTP: (code: string) => Promise<boolean>;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  phone,
  onVerified,
  onSendOTP,
  onVerifyOTP,
}) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const target = email || phone || '';

  const handleSend = async () => {
    setLoading(true);
    setError('');
    try {
      await onSendOTP(target);
      setSent(true);
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    }
    setLoading(false);
  };

  const handleVerify = async () => {
    setLoading(true);
    const valid = await onVerifyOTP(otp);
    if (valid) onVerified();
    else setError('Invalid OTP. Please try again.');
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      {!sent ? (
        <Button onClick={handleSend} disabled={loading}>
          Send OTP to {target}
        </Button>
      ) : (
        <>
          <Input
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
          />
          <Button onClick={handleVerify} disabled={loading || otp.length !== 6}>
            Verify OTP
          </Button>
        </>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};