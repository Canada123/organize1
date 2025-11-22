import React, { useState, useRef, useEffect } from 'react';
import { MinimalCard, MinimalCardContent, MinimalCardHeader, MinimalCardTitle } from '@/components/ui/minimal-card';
import { MinimalButton } from '@/components/ui/minimal-button';
import { Mail, Phone, ArrowLeft, Shield } from 'lucide-react';

interface MinimalOTPVerificationProps {
  contactMethod: 'email' | 'phone';
  contactValue: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  onBack?: () => void;
  isLoading?: boolean;
}

export const MinimalOTPVerification: React.FC<MinimalOTPVerificationProps> = ({
  contactMethod,
  contactValue,
  onVerify,
  onResend,
  onBack,
  isLoading = false
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    // Resend timer countdown
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when complete
    if (newOtp.every(digit => digit) && newOtp.length === 6) {
      handleSubmit(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
      setOtp(newOtp);
      
      // Focus appropriate input
      const nextEmptyIndex = newOtp.findIndex(digit => !digit);
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else {
        inputRefs.current[5]?.focus();
        handleSubmit(newOtp.join(''));
      }
    }
  };

  const handleSubmit = (otpString?: string) => {
    const code = otpString || otp.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    onVerify(code);
  };

  const handleResend = () => {
    if (canResend) {
      onResend();
      setResendTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const maskedContact = contactMethod === 'email' 
    ? contactValue.replace(/(.{2})(.*)(@.*)/, '$1***$3')
    : contactValue.replace(/(\d{3})(\d*)(\d{3})/, '$1***$3');

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#EEE8E1]/20">
      <MinimalCard className="max-w-md w-full" variant="default">
        <MinimalCardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#004C96]/10 rounded-full flex items-center justify-center">
              {contactMethod === 'email' ? (
                <Mail className="w-8 h-8 text-[#004C96]" />
              ) : (
                <Phone className="w-8 h-8 text-[#004C96]" />
              )}
            </div>
          </div>
          <MinimalCardTitle className="text-2xl text-[#0D0D0D]">
            Verify Your {contactMethod === 'email' ? 'Email' : 'Phone'}
          </MinimalCardTitle>
          <p className="text-[#475259] mt-2">
            We've sent a 6-digit code to <span className="font-medium">{maskedContact}</span>
          </p>
        </MinimalCardHeader>

        <MinimalCardContent className="space-y-6">
          {/* OTP Input Fields */}
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={`
                  w-12 h-14 text-center text-xl font-semibold
                  border-2 rounded-lg transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-[#004C96]/20
                  ${digit ? 'border-[#004C96] bg-[#004C96]/5' : 'border-[#475259]/20'}
                  ${error ? 'border-red-500' : ''}
                `}
                disabled={isLoading}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          {/* Security Message */}
          <div className="flex items-start gap-2 p-3 bg-[#004C96]/5 rounded-lg">
            <Shield className="w-4 h-4 text-[#004C96] mt-0.5 flex-shrink-0" />
            <p className="text-xs text-[#475259]">
              This code helps us verify your identity and keep your health data secure. 
              It will expire in 10 minutes.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <MinimalButton
              variant="primary"
              className="w-full"
              onClick={() => handleSubmit()}
              disabled={isLoading || otp.some(digit => !digit)}
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </MinimalButton>

            <div className="flex items-center justify-between">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center gap-1 text-sm text-[#475259] hover:text-[#004C96] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              )}

              <button
                onClick={handleResend}
                disabled={!canResend}
                className={`
                  text-sm transition-colors
                  ${canResend 
                    ? 'text-[#004C96] hover:text-[#5298F2] cursor-pointer' 
                    : 'text-[#475259]/50 cursor-not-allowed'}
                `}
              >
                {canResend 
                  ? 'Resend Code' 
                  : `Resend in ${resendTimer}s`}
              </button>
            </div>
          </div>

          {/* Additional Help */}
          <div className="pt-4 border-t border-[#475259]/10">
            <p className="text-xs text-[#475259] text-center">
              Didn't receive the code? Check your spam folder or{' '}
              <a href="#" className="text-[#004C96] hover:text-[#5298F2]">
                contact support
              </a>
            </p>
          </div>
        </MinimalCardContent>
      </MinimalCard>
    </div>
  );
};

export default MinimalOTPVerification;