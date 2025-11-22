import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SwissInsuranceModel } from '../components/InsuranceModelSelector';

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

export const InsuredReviewStage: React.FC<InsuredReviewStageProps> = ({
  insuranceModel,
  onStageComplete,
  onDownloadReferral,
  onBookTeleconsult
}) => {
  const [data, setData] = React.useState<InsuredReviewData>({
    consents: { truthfulness: false, emergency: false, dataProcessing: false }
  });

  const showGpChoice = insuranceModel === 'standard-flex';
  const requiresGp = insuranceModel === 'hmo-hausarzt' || data.gpChoice === 'own';
  const isTelmed = insuranceModel === 'telmed';

  const canSubmit = data.consents.truthfulness && 
                    data.consents.emergency && 
                    data.consents.dataProcessing &&
                    (!requiresGp || (data.gpName && data.practiceName && data.hinEmail));

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Review & Consents</CardTitle>
        <CardDescription>Confirm your insurance model and provide consent</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {showGpChoice && (
          <div className="space-y-4">
            <Label>Choose your referral option:</Label>
            <div className="space-y-2">
              <Button 
                variant={data.gpChoice === 'own' ? 'default' : 'outline'}
                onClick={() => setData({...data, gpChoice: 'own'})}
                className="w-full justify-start"
              >
                Use my own GP
              </Button>
              <Button 
                variant={data.gpChoice === 'partner' ? 'default' : 'outline'}
                onClick={() => setData({...data, gpChoice: 'partner'})}
                className="w-full justify-start"
              >
                Use partner GP (Medgate)
              </Button>
            </div>
          </div>
        )}

        {requiresGp && (
          <div className="space-y-4">
            <Label>GP Details</Label>
            <Input 
              placeholder="GP Name"
              value={data.gpName || ''}
              onChange={(e) => setData({...data, gpName: e.target.value})}
            />
            <Input 
              placeholder="Practice Name"
              value={data.practiceName || ''}
              onChange={(e) => setData({...data, practiceName: e.target.value})}
            />
            <Input 
              type="email"
              placeholder="HIN Email"
              value={data.hinEmail || ''}
              onChange={(e) => setData({...data, hinEmail: e.target.value})}
            />
            <Input 
              type="tel"
              placeholder="Phone Number"
              value={data.phoneNumber || ''}
              onChange={(e) => setData({...data, phoneNumber: e.target.value})}
            />
          </div>
        )}

        {data.gpChoice === 'partner' && (
          <Alert>
            <AlertDescription>
              Click below to book your teleconsultation with Medgate
            </AlertDescription>
            <Button onClick={onBookTeleconsult} className="mt-2">
              Book Teleconsultation
            </Button>
          </Alert>
        )}

        {isTelmed && (
          <Alert>
            <AlertDescription>
              Call your Telmed hotline for triage before obtaining specialist care.
              Your insurer will provide the hotline number and instructions.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <Label>Required Consents</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="truthfulness"
                checked={data.consents.truthfulness}
                onCheckedChange={(c) => setData({
                  ...data, 
                  consents: {...data.consents, truthfulness: !!c}
                })}
              />
              <Label htmlFor="truthfulness" className="text-sm">
                I confirm that the information provided is accurate and complete
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="emergency"
                checked={data.consents.emergency}
                onCheckedChange={(c) => setData({
                  ...data, 
                  consents: {...data.consents, emergency: !!c}
                })}
              />
              <Label htmlFor="emergency" className="text-sm">
                I understand that Holter monitoring does not replace emergency medical evaluation
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="dataProcessing"
                checked={data.consents.dataProcessing}
                onCheckedChange={(c) => setData({
                  ...data, 
                  consents: {...data.consents, dataProcessing: !!c}
                })}
              />
              <Label htmlFor="dataProcessing" className="text-sm">
                I agree to telemedicine services and the privacy policy
              </Label>
            </div>
          </div>
        </div>

        <Button 
          onClick={() => onStageComplete(data)}
          disabled={!canSubmit}
          className="w-full"
        >
          Submit
        </Button>
      </CardContent>
    </Card>
  );
};