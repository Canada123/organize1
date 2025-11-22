import React from 'react';
import { MinimalCard, MinimalCardContent } from '@/components/ui/minimal-card';
import { MinimalButton } from '@/components/ui/minimal-button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Download, Phone, Package, Calendar, Mail, Clock } from 'lucide-react';
import { SwissInsuranceModel } from '../components/InsuranceModelSelector';
import { StageHeader } from '../components/StageHeader';
import { NextStepsCard } from '../components/NextStepsCard';

interface CompletionStageProps {
  pathway: 'insured' | 'self-pay';
  insuranceModel?: SwissInsuranceModel;
  gpChoice?: 'own' | 'partner';
  email: string;
  onDownloadReferral?: () => void;
  onContactSupport?: () => void;
}

export const CompletionStage: React.FC<CompletionStageProps> = ({
  pathway,
  insuranceModel,
  gpChoice,
  email,
  onDownloadReferral,
  onContactSupport
}) => {
  const getNextSteps = () => {
    if (pathway === 'self-pay') {
      return [
        { icon: Package, text: 'Your Holter kit will be shipped within 2 business days' },
        { icon: Phone, text: 'You will receive SMS tracking updates' },
        { icon: CheckCircle, text: 'Follow the included instructions to apply the device' },
        { icon: Calendar, text: 'Wear the device for 24-48 hours as directed' }
      ];
    }

    if (insuranceModel === 'telmed') {
      return [
        { icon: Phone, text: 'Call your Telmed hotline for triage' },
        { icon: CheckCircle, text: 'Follow their instructions to obtain a referral' },
        { icon: Package, text: 'Kit ships after referral is received' },
        { icon: Calendar, text: 'Schedule your monitoring period' }
      ];
    }

    if (gpChoice === 'partner') {
      return [
        { icon: Calendar, text: 'Complete your Medgate teleconsultation' },
        { icon: CheckCircle, text: 'Referral will be generated automatically' },
        { icon: Package, text: 'Kit ships within 2 days of referral' },
        { icon: Phone, text: 'You will receive email confirmation' }
      ];
    }

    return [
      { icon: Download, text: 'Download your referral packet' },
      { icon: Calendar, text: 'Deliver it to your GP for signature' },
      { icon: CheckCircle, text: 'We receive the signed referral via HIN or fax' },
      { icon: Package, text: 'Your kit ships within 2 business days' }
    ];
  };

  const nextSteps = getNextSteps();
  const referenceNumber = Date.now().toString(36).toUpperCase();

  return (
    <MinimalCard variant="soft" padding="lg" className="w-full max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <StageHeader
          title="Application Complete!"
          description={`Thank you for completing your application`}
        />
      </div>

      <MinimalCardContent className="space-y-6">
        <Alert className="border-green-300 bg-green-50">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <AlertDescription className="text-green-800 font-ibm-plex-sans">
            A confirmation email has been sent to <strong>{email}</strong>
          </AlertDescription>
        </Alert>

        <NextStepsCard steps={nextSteps} />

        {gpChoice === 'own' && (
          <div className="space-y-3 bg-[#EEE8E1] rounded-lg p-6">
            <MinimalButton 
              onClick={onDownloadReferral}
              className="w-full"
              variant="primary"
              size="lg"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Referral Packet
            </MinimalButton>
            <p className="text-sm font-ibm-plex-sans text-[#475259] text-center">
              PDF includes cover letter, information sheet, and pre-filled referral form
            </p>
          </div>
        )}

        <div className="border-t border-[#004C96]/10 pt-6 space-y-4">
          <h4 className="font-ibm-plex-sans font-semibold text-[#004C96]">
            Need Help?
          </h4>
          <div className="space-y-3 bg-white rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-[#004C96]" />
              <span className="font-ibm-plex-sans text-[#0D0D0D]">
                support@skiin.ch
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-[#004C96]" />
              <span className="font-ibm-plex-sans text-[#0D0D0D]">
                +41 XX XXX XX XX
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-[#004C96]" />
              <span className="font-ibm-plex-sans text-[#0D0D0D]">
                Monday-Friday, 8:00-17:00 CET
              </span>
            </div>
          </div>
          
          <MinimalButton 
            onClick={onContactSupport}
            variant="secondary"
            className="w-full"
          >
            Contact Support
          </MinimalButton>
        </div>

        <div className="text-center pt-4 border-t border-[#004C96]/10">
          <p className="text-sm font-ibm-plex-sans text-[#475259]">
            Reference Number
          </p>
          <p className="text-lg font-ibm-plex-sans font-semibold text-[#004C96]">
            #{referenceNumber}
          </p>
        </div>
      </MinimalCardContent>
    </MinimalCard>
  );
};