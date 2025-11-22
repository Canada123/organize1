import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EligibilityChecker from '@/components/home/EligibilityChecker';
import { MinimalOTPVerification } from '@/components/auth/MinimalOTPVerification';
import { MinimalInsuranceSelector } from '@/components/forms/MinimalInsuranceSelector';
import { MinimalPaymentForm } from '@/components/forms/MinimalPaymentForm';
import { MinimalCard, MinimalCardContent, MinimalCardHeader, MinimalCardTitle } from '@/components/ui/minimal-card';
import { MinimalButton } from '@/components/ui/minimal-button';

const EligibilityTest: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<'eligibility' | 'otp' | 'insurance' | 'payment'>('eligibility');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  const handleOTPVerify = (otp: string) => {
  // Console statement removed by ESLint fix
    alert(`OTP ${otp} verified successfully!`);
  };

  const handleOTPResend = () => {
  // Console statement removed by ESLint fix
    alert('New OTP sent!');
  };

  const handlePaymentSubmit = (data: any) => {
  // Console statement removed by ESLint fix
    alert('Payment processing... (mocked)');
  };

  const ComponentSelector = () => (
    <div className="bg-gray-50 p-6 border-b">
      <div className="container-custom">
        <h1 className="text-2xl font-bold text-[#0D0D0D] mb-4">
          Eligibility Questionnaire Component Testing
        </h1>
        <p className="text-[#475259] mb-6">
          Select a component to test visual rendering, functionality, and accessibility
        </p>
        <div className="flex flex-wrap gap-3">
          <MinimalButton
            variant={activeComponent === 'eligibility' ? 'primary' : 'secondary'}
            onClick={() => setActiveComponent('eligibility')}
          >
            Eligibility Checker
          </MinimalButton>
          <MinimalButton
            variant={activeComponent === 'otp' ? 'primary' : 'secondary'}
            onClick={() => setActiveComponent('otp')}
          >
            OTP Verification
          </MinimalButton>
          <MinimalButton
            variant={activeComponent === 'insurance' ? 'primary' : 'secondary'}
            onClick={() => setActiveComponent('insurance')}
          >
            Insurance Selector
          </MinimalButton>
          <MinimalButton
            variant={activeComponent === 'payment' ? 'primary' : 'secondary'}
            onClick={() => setActiveComponent('payment')}
          >
            Payment Form
          </MinimalButton>
        </div>
      </div>
    </div>
  );

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'eligibility':
        return (
          <div>
            <div className="container-custom py-8">
              <MinimalCard variant="soft" className="mb-6">
                <MinimalCardHeader>
                  <MinimalCardTitle>EligibilityChecker Component</MinimalCardTitle>
                </MinimalCardHeader>
                <MinimalCardContent>
                  <p className="text-[#475259]">
                    Multi-step form with Swiss insurance integration. Tests form navigation, 
                    validation, and eligibility calculation logic with mocked data.
                  </p>
                </MinimalCardContent>
              </MinimalCard>
            </div>
            <EligibilityChecker />
          </div>
        );
      
      case 'otp':
        return (
          <div className="py-8">
            <div className="container-custom mb-6">
              <MinimalCard variant="soft">
                <MinimalCardHeader>
                  <MinimalCardTitle>OTP Verification Component</MinimalCardTitle>
                </MinimalCardHeader>
                <MinimalCardContent>
                  <p className="text-[#475259]">
                    6-digit OTP input with auto-focus, paste support, and resend timer. 
                    Tests input validation and user experience flows.
                  </p>
                </MinimalCardContent>
              </MinimalCard>
            </div>
            <MinimalOTPVerification
              contactMethod="email"
              contactValue="test@example.com"
              onVerify={handleOTPVerify}
              onResend={handleOTPResend}
              onBack={() => setActiveComponent('eligibility')}
            />
          </div>
        );
      
      case 'insurance':
        return (
          <div className="py-8">
            <div className="container-custom">
              <MinimalCard variant="soft" className="mb-6">
                <MinimalCardHeader>
                  <MinimalCardTitle>Insurance Selector Component</MinimalCardTitle>
                </MinimalCardHeader>
                <MinimalCardContent>
                  <p className="text-[#475259]">
                    Swiss insurance provider and model selection with 9 major insurers. 
                    Tests search functionality and Swiss healthcare integration.
                  </p>
                </MinimalCardContent>
              </MinimalCard>
              
              <MinimalInsuranceSelector
                selectedProvider={selectedProvider}
                selectedModel={selectedModel}
                onProviderChange={setSelectedProvider}
                onModelChange={setSelectedModel}
              />
            </div>
          </div>
        );
      
      case 'payment':
        return (
          <div className="py-8">
            <div className="container-custom">
              <MinimalCard variant="soft" className="mb-6">
                <MinimalCardHeader>
                  <MinimalCardTitle>Payment Form Component</MinimalCardTitle>
                </MinimalCardHeader>
                <MinimalCardContent>
                  <p className="text-[#475259]">
                    Secure payment form with card validation, Swiss CHF currency, 
                    and PCI compliance features. Tests form validation and security.
                  </p>
                </MinimalCardContent>
              </MinimalCard>
              
              <MinimalPaymentForm
                amount={299}
                currency="CHF"
                onSubmit={handlePaymentSubmit}
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <ComponentSelector />
      <main className="flex-grow">
        {renderActiveComponent()}
      </main>
      <Footer />
    </div>
  );
};

export default EligibilityTest;