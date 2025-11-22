import React, { useState } from 'react';
import { MinimalCard } from '@/components/ui/minimal-card';
import { EmailSection } from '../molecules/EmailSection';
import { DateOfBirthSection } from '../molecules/DateOfBirthSection';
import { EmailVerificationSection } from '../molecules/EmailVerificationSection';
import { StageHeader } from '../components/StageHeader';
import { StageFooter } from '../components/StageFooter';
import { authService } from '@/services/authService';

interface ContactAccountStageProps {
  initialData?: {
    email?: string;
    dateOfBirth?: string;
    emailVerified?: boolean;
  };
  onStageComplete: (data: any) => void;
  onEmailVerified: (email: string, verified: boolean) => void;
}

export const ContactAccountStage: React.FC<ContactAccountStageProps> = ({
  initialData = {},
  onStageComplete,
  onEmailVerified,
}) => {
  const [email, setEmail] = useState(initialData.email || '');
  const [dob, setDob] = useState(initialData.dateOfBirth || '');
  const [emailVerified, setEmailVerified] = useState(initialData.emailVerified || false);
  const [ageError, setAgeError] = useState('');
  
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };
  
  const handleDobChange = (value: string) => {
    setDob(value);
    const age = calculateAge(value);
    if (age < 18) {
      setAgeError('You must be at least 18 years old');
    } else {
      setAgeError('');
    }
  };
  
  const handleSendOTP = async (email: string) => {
    /* ===== DEVELOPMENT BYPASS - TEMPORARY =====
     * TO REVERT: Remove lines 54-57 (the if block below)
     * REASON: OTP email service not configured in development
     * PRODUCTION: This bypass MUST be removed - the authService is correctly configured
     * TEST WITH: Use email containing 'test@' and OTP code '123456'
     * =========================================== */
    // Development bypass: Allow test emails to skip real OTP
    if (import.meta.env.DEV && email.includes('test@')) {
  // Console statement removed by ESLint fix
      return;
    }
    
    // PRODUCTION CODE - Correctly configured, DO NOT modify
    const result = await authService.sendOTP(email);
    if (!result.success) {
      throw new Error(result.error || 'Failed to send OTP');
    }
  };
  
  const handleVerifyOTP = async (code: string) => {
    /* ===== DEVELOPMENT BYPASS - TEMPORARY =====
     * TO REVERT: Remove lines 72-75 (the if block below)
     * REASON: Allows testing without actual email delivery
     * PRODUCTION: This bypass MUST be removed - the authService verification works correctly
     * TEST WITH: Use OTP code '123456' for any test@ email
     * =========================================== */
    // Development bypass: Accept "123456" as valid OTP for test emails
    if (import.meta.env.DEV && email.includes('test@') && code === '123456') {
  // Console statement removed by ESLint fix
      return true;
    }
    
    // PRODUCTION CODE - Correctly configured, DO NOT modify
    const result = await authService.verifyOTP(email, code);
    return result.success;
  };
  
  const handleEmailVerified = () => {
    setEmailVerified(true);
    onEmailVerified(email, true);
  };
  
  const canProceed = email && dob && !ageError && emailVerified;
  
  const handleContinue = () => {
    if (canProceed) {
      onStageComplete({
        email,
        dateOfBirth: dob,
        emailVerified
      });
    }
  };
  
  return (
    <MinimalCard variant="soft" padding="lg">
      <StageHeader
        title="Contact & Account"
        description="We'll create a secure account to save your progress"
      />
      
      <div className="space-y-6">
        <EmailSection
          email={email}
          onChange={setEmail}
        />
        
        <EmailVerificationSection
          email={email}
          emailVerified={emailVerified}
          onVerified={handleEmailVerified}
          onSendOTP={handleSendOTP}
          onVerifyOTP={handleVerifyOTP}
        />
        
        <DateOfBirthSection
          dateOfBirth={dob}
          onChange={handleDobChange}
          error={ageError}
        />
      </div>
      
      <StageFooter
        onNext={handleContinue}
        nextDisabled={!canProceed}
        showSave={true}
        onSave={() => console.log('Save for later')}
      />
    </MinimalCard>
  );
};