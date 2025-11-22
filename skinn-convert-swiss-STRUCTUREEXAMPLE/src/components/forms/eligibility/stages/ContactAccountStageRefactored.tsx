import React, { useState } from 'react';
import { MinimalCard } from '@/components/ui/minimal-card';
import { NameSection } from '../molecules/NameSection';
import { EmailSection } from '../molecules/EmailSection';
import { DateOfBirthSection } from '../molecules/DateOfBirthSection';
import { EmailVerificationSection } from '../molecules/EmailVerificationSection';
import { StageHeader } from '../components/StageHeader';
import { StageFooter } from '../components/StageFooter';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface ContactAccountData {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  emailVerified: boolean;
}

interface ContactAccountStageRefactoredProps {
  initialData?: Partial<ContactAccountData>;
  onStageComplete: (data: ContactAccountData) => void;
  onEmailVerified: (email: string, verified: boolean) => void;
  onSaveForLater?: () => void;
}

export const ContactAccountStageRefactored: React.FC<ContactAccountStageRefactoredProps> = ({
  initialData = {},
  onStageComplete,
  onEmailVerified,
  onSaveForLater
}) => {
  const [data, setData] = useState<ContactAccountData>({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    email: initialData.email || '',
    dateOfBirth: initialData.dateOfBirth || '',
    emailVerified: initialData.emailVerified || false
  });
  
  const [ageError, setAgeError] = useState('');
  
  const calculateAge = (birthDate: string): number | null => {
    // Early exit for empty values
    if (!birthDate || birthDate.trim() === '') {
      return null;
    }
    
    const today = new Date();
    const birth = new Date(birthDate);
    
    // Check for Invalid Date - THIS IS THE KEY FIX
    if (isNaN(birth.getTime())) {
      return null;
    }
    
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    // Sanity check for impossible ages
    if (age < 0 || age > 150) {
      return null;
    }
    
    return age;
  };
  
  const handleDateOfBirthChange = (value: string) => {
    setData(prev => ({ ...prev, dateOfBirth: value }));
    
    // Handle empty value
    if (!value || value.trim() === '') {
      setAgeError('');
      return;
    }
    
    const age = calculateAge(value);
    
    if (age === null) {
      setAgeError('Please enter a valid date of birth');
    } else if (age < 18) {
      setAgeError('You must be at least 18 years old to proceed');
    } else if (age > 120) {
      setAgeError('Please enter a valid date of birth');
    } else {
      setAgeError('');
    }
  };
  
  const handleSendOTP = async (email: string) => {
    // Development bypass for testing
    if (import.meta.env.DEV && email.includes('test@')) {
  // Console statement removed by ESLint fix
      return;
    }
    
    const result = await authService.sendOTP(email);
    if (!result.success) {
      throw new Error(result.error || 'Failed to send OTP');
    }
  };
  
  const handleVerifyOTP = async (code: string): Promise<boolean> => {
    // Development bypass for testing
    if (import.meta.env.DEV && data.email.includes('test@') && code === '123456') {
  // Console statement removed by ESLint fix
      return true;
    }
    
    const result = await authService.verifyOTP(data.email, code);
    return result.success;
  };
  
  const handleEmailVerified = () => {
    setData(prev => ({ ...prev, emailVerified: true }));
    onEmailVerified(data.email, true);
  };
  
  const canProceed = 
    data.firstName && 
    data.lastName && 
    data.email && 
    data.dateOfBirth && 
    !ageError && 
    data.emailVerified;
  
  const handleContinue = () => {
    if (canProceed) {
      onStageComplete(data);
    }
  };
  
  const handleSave = () => {
    if (onSaveForLater) {
      // Store current data in localStorage for later retrieval
      localStorage.setItem('eligibility_draft', JSON.stringify(data));
      onSaveForLater();
    }
  };
  
  return (
    <MinimalCard variant="soft" padding="lg">
      <StageHeader
        title="Contact & Account Creation"
        description="Let's start by creating your secure account"
      />
      
      <div className="space-y-6">
        {/* Name Fields */}
        <NameSection
          firstName={data.firstName}
          lastName={data.lastName}
          onFirstNameChange={(value) => setData(prev => ({ ...prev, firstName: value }))}
          onLastNameChange={(value) => setData(prev => ({ ...prev, lastName: value }))}
        />
        
        {/* Email Field */}
        <EmailSection
          email={data.email}
          onChange={(value) => setData(prev => ({ ...prev, email: value }))}
        />
        
        {/* Email Verification */}
        <EmailVerificationSection
          email={data.email}
          emailVerified={data.emailVerified}
          onVerified={handleEmailVerified}
          onSendOTP={handleSendOTP}
          onVerifyOTP={handleVerifyOTP}
        />
        
        {/* Date of Birth */}
        <DateOfBirthSection
          dateOfBirth={data.dateOfBirth}
          onChange={handleDateOfBirthChange}
          error={ageError}
        />
        
        {/* Save & Continue Later Option */}
        {onSaveForLater && (
          <div className="flex items-center justify-center pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save & Continue Later
            </Button>
          </div>
        )}
      </div>
      
      <StageFooter
        onNext={handleContinue}
        nextDisabled={!canProceed}
        nextLabel="Continue"
        showBack={false}
      />
    </MinimalCard>
  );
};