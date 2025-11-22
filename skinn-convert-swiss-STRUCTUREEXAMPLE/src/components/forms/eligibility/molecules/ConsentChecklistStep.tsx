import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StepNumber } from '../atoms/StepNumber';
import { CheckCircle } from 'lucide-react';

interface ConsentChecklistStepProps {
  consents: {
    truthfulness: boolean;
    emergency: boolean;
    dataProcessing: boolean;
  };
  onConsentChange: (field: string, value: boolean) => void;
  paymentSuccess?: boolean;
}

export const ConsentChecklistStep: React.FC<ConsentChecklistStepProps> = ({
  consents,
  onConsentChange,
  paymentSuccess = false
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <StepNumber number={4} />
        <h3 className="font-semibold text-[#004C96]">Final Consents</h3>
      </div>
      
      {paymentSuccess && (
        <Alert className="border-green-500 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-900">
            Payment successful! Please provide your consent to complete the order.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-3">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="truthfulness"
            checked={consents.truthfulness}
            onCheckedChange={(checked) => onConsentChange('truthfulness', !!checked)}
            className="mt-1"
          />
          <Label htmlFor="truthfulness" className="text-sm leading-relaxed cursor-pointer">
            I confirm that the information provided is accurate and complete
          </Label>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox
            id="emergency"
            checked={consents.emergency}
            onCheckedChange={(checked) => onConsentChange('emergency', !!checked)}
            className="mt-1"
          />
          <Label htmlFor="emergency" className="text-sm leading-relaxed cursor-pointer">
            I understand that Holter monitoring does not replace emergency medical evaluation
          </Label>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox
            id="dataProcessing"
            checked={consents.dataProcessing}
            onCheckedChange={(checked) => onConsentChange('dataProcessing', !!checked)}
            className="mt-1"
          />
          <Label htmlFor="dataProcessing" className="text-sm leading-relaxed cursor-pointer">
            I agree to telemedicine services and the privacy policy
          </Label>
        </div>
      </div>
    </div>
  );
};