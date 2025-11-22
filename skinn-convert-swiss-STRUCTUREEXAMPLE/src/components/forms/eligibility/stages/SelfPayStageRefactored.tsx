import React, { useState } from 'react';
import { MinimalCard } from '@/components/ui/minimal-card';
import { Button } from '@/components/ui/button';
import { StageHeader } from '../components/StageHeader';
import { StageFooter } from '../components/StageFooter';

// Molecules
import { PhoneVerificationStep } from '../molecules/PhoneVerificationStep';
import { ShippingAddressStep } from '../molecules/ShippingAddressStep';
import { PaymentFormStep } from '../molecules/PaymentFormStep';
import { ConsentChecklistStep } from '../molecules/ConsentChecklistStep';

interface SelfPayStageProps {
  email: string;
  onStageComplete: (data: SelfPayData) => void;
  onProcessPayment: (paymentData: PaymentData) => Promise<boolean>;
  onBack?: () => void;
}

export interface SelfPayData {
  phoneNumber: string;
  phoneVerified: boolean;
  shippingAddress: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
  payment: PaymentData;
  consents: {
    truthfulness: boolean;
    emergency: boolean;
    dataProcessing: boolean;
  };
}

export interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

export const SelfPayStage: React.FC<SelfPayStageProps> = ({
  email,
  onStageComplete,
  onProcessPayment,
  onBack
}) => {
  const [data, setData] = useState<SelfPayData>({
    phoneNumber: '',
    phoneVerified: false,
    shippingAddress: { 
      street: '', 
      postalCode: '', 
      city: '', 
      country: 'Switzerland' 
    },
    payment: { 
      cardNumber: '', 
      expiryDate: '', 
      cvv: '', 
      cardholderName: '' 
    },
    consents: { 
      truthfulness: false, 
      emergency: false, 
      dataProcessing: false 
    }
  });

  const [currentStep, setCurrentStep] = useState<'phone' | 'address' | 'payment' | 'consents'>('phone');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePhoneChange = (phone: string) => {
    setData(prev => ({ ...prev, phoneNumber: phone }));
  };

  const handleVerificationComplete = (verified: boolean) => {
    setData(prev => ({ ...prev, phoneVerified: verified }));
    if (verified) {
      setCurrentStep('address');
    }
  };

  const handleAddressChange = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      shippingAddress: { ...prev.shippingAddress, [field]: value }
    }));
  };

  const handlePaymentChange = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      payment: { ...prev.payment, [field]: value }
    }));
  };

  const handleConsentChange = (field: string, value: boolean) => {
    setData(prev => ({
      ...prev,
      consents: { ...prev.consents, [field]: value }
    }));
  };

  const handleProcessPayment = async () => {
    setPaymentProcessing(true);
    try {
      const success = await onProcessPayment(data.payment);
      setPaymentSuccess(success);
      if (success) {
        setCurrentStep('consents');
      }
    } finally {
      setPaymentProcessing(false);
    }
  };

  const canProceedToPayment = data.phoneVerified &&
    data.shippingAddress.street &&
    data.shippingAddress.postalCode &&
    data.shippingAddress.city;

  const canProceedToConsents = data.payment.cardNumber &&
    data.payment.expiryDate &&
    data.payment.cvv &&
    data.payment.cardholderName;

  const canSubmit = paymentSuccess &&
    data.consents.truthfulness &&
    data.consents.emergency &&
    data.consents.dataProcessing;

  const handleNext = () => {
    if (currentStep === 'phone' && data.phoneVerified) {
      setCurrentStep('address');
    } else if (currentStep === 'address' && canProceedToPayment) {
      setCurrentStep('payment');
    } else if (currentStep === 'payment' && canProceedToConsents) {
      handleProcessPayment();
    } else if (currentStep === 'consents' && canSubmit) {
      onStageComplete(data);
    }
  };

  const handleStepBack = () => {
    if (currentStep === 'address') setCurrentStep('phone');
    else if (currentStep === 'payment') setCurrentStep('address');
    else if (currentStep === 'consents' && !paymentSuccess) setCurrentStep('payment');
    else if (onBack) onBack();
  };

  const getNextButtonText = () => {
    if (currentStep === 'phone') return data.phoneVerified ? 'Continue to Address' : 'Verify Phone First';
    if (currentStep === 'address') return 'Continue to Payment';
    if (currentStep === 'payment') return paymentProcessing ? 'Processing...' : 'Process Payment';
    if (currentStep === 'consents') return 'Complete Order';
    return 'Continue';
  };

  const getNextButtonDisabled = () => {
    if (currentStep === 'phone') return !data.phoneVerified;
    if (currentStep === 'address') return !canProceedToPayment;
    if (currentStep === 'payment') return !canProceedToConsents || paymentProcessing;
    if (currentStep === 'consents') return !canSubmit;
    return false;
  };

  return (
    <MinimalCard variant="soft" padding="lg">
      <StageHeader
        title="Self-Pay Checkout"
        description="Complete your purchase and provide shipping details"
      />

      <div className="space-y-6">
        {currentStep === 'phone' && (
          <PhoneVerificationStep
            phoneNumber={data.phoneNumber}
            phoneVerified={data.phoneVerified}
            onPhoneChange={handlePhoneChange}
            onVerificationComplete={handleVerificationComplete}
            onResendOTP={() => console.log('Resending OTP')}
          />
        )}

        {currentStep === 'address' && (
          <ShippingAddressStep
            address={data.shippingAddress}
            onAddressChange={handleAddressChange}
          />
        )}

        {currentStep === 'payment' && (
          <PaymentFormStep
            payment={data.payment}
            onPaymentChange={handlePaymentChange}
            totalAmount="CHF 499.00"
          />
        )}

        {currentStep === 'consents' && (
          <ConsentChecklistStep
            consents={data.consents}
            onConsentChange={handleConsentChange}
            paymentSuccess={paymentSuccess}
          />
        )}
      </div>

      <StageFooter
        onBack={handleStepBack}
        onNext={handleNext}
        nextLabel={getNextButtonText()}
        nextDisabled={getNextButtonDisabled()}
        showSave={true}
        onSave={() => {
  // Console statement removed by ESLint fix
        }}
      />
    </MinimalCard>
  );
};