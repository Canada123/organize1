import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SwissInsuranceModel } from '../components/InsuranceModelSelector';
import { GPChoiceSection } from '../molecules/GPChoiceSection';
import { GPDetailsForm } from '../molecules/GPDetailsForm';
import { ConsentCheckboxes } from '../molecules/ConsentCheckboxes';
import { TelmedAlert } from '../atoms/TelmedAlert';
import { ReferralQRCode } from '../atoms/ReferralQRCode';
import { Download } from 'lucide-react';

interface InsuredReviewStageProps {
  insuranceModel: SwissInsuranceModel;
  onStageComplete: (data: InsuredReviewData) => void;
  onDownloadReferral?: () => void;
  onBookTeleconsult?: () => void;
}

export interface InsuredReviewData {
  gpChoice?: 'own' | 'partner';
  gpName?: string;
  practiceName?: string;
  hinEmail?: string;
  phoneNumber?: string;
  consents: {
    truthfulness: boolean;
    emergency: boolean;
    dataProcessing: boolean;
  };
}

export const InsuredReviewStageRefactored: React.FC<InsuredReviewStageProps> = ({
  insuranceModel,
  onStageComplete,
  onDownloadReferral,
  onBookTeleconsult
}) => {
  const [data, setData] = React.useState<InsuredReviewData>({
    consents: { truthfulness: false, emergency: false, dataProcessing: false }
  });
  
  // Generate a sample referral code (in production, this would come from backend)
  const [referralCode] = React.useState(() => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const code = 
      letters.charAt(Math.floor(Math.random() * 26)) +
      letters.charAt(Math.floor(Math.random() * 26)) +
      letters.charAt(Math.floor(Math.random() * 26)) +
      numbers.charAt(Math.floor(Math.random() * 10)) +
      numbers.charAt(Math.floor(Math.random() * 10)) +
      numbers.charAt(Math.floor(Math.random() * 10));
    return code;
  });

  const showGpChoice = insuranceModel === 'standard-flex';
  const requiresGp = insuranceModel === 'hmo-hausarzt' || data.gpChoice === 'own';
  const isTelmed = insuranceModel === 'telmed';
  const isPartner = data.gpChoice === 'partner';

  const canSubmit = data.consents.truthfulness && 
                    data.consents.emergency && 
                    data.consents.dataProcessing &&
                    (!requiresGp || (data.gpName && data.practiceName && data.hinEmail));

  const updateData = <K extends keyof InsuredReviewData>(
    key: K, 
    value: InsuredReviewData[K]
  ) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const updateConsent = (key: keyof typeof data.consents, value: boolean) => {
    setData(prev => ({
      ...prev,
      consents: { ...prev.consents, [key]: value }
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Review & Consents</CardTitle>
        <CardDescription>Confirm your insurance model and provide consent</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {showGpChoice && (
          <GPChoiceSection
            gpChoice={data.gpChoice}
            onChoiceChange={(choice) => updateData('gpChoice', choice)}
          />
        )}

        {requiresGp && (
          <>
            <GPDetailsForm
              gpName={data.gpName}
              practiceName={data.practiceName}
              hinEmail={data.hinEmail}
              phoneNumber={data.phoneNumber}
              onGPNameChange={(value) => updateData('gpName', value)}
              onPracticeNameChange={(value) => updateData('practiceName', value)}
              onHINEmailChange={(value) => updateData('hinEmail', value)}
              onPhoneNumberChange={(value) => updateData('phoneNumber', value)}
            />
            
            {/* Display QR code for GP referral */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">GP Referral Code</h3>
              <ReferralQRCode 
                referralCode={referralCode}
                patientName={data.gpName}
              />
              {onDownloadReferral && (
                <Button 
                  onClick={onDownloadReferral}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Referral Packet
                </Button>
              )}
            </div>
          </>
        )}

        {isPartner && (
          <TelmedAlert type="partner" onAction={onBookTeleconsult} />
        )}

        {isTelmed && (
          <TelmedAlert type="telmed" />
        )}

        <ConsentCheckboxes
          consents={data.consents}
          onConsentChange={updateConsent}
        />

        <Button 
          onClick={() => onStageComplete(data)}
          disabled={!canSubmit}
          className="w-full bg-[#004C96] hover:bg-[#004C96]/90"
        >
          Submit Application
        </Button>
      </CardContent>
    </Card>
  );
};