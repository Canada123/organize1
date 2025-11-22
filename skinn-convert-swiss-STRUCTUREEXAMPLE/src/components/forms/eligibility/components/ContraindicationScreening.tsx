import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface ContraindicationScreeningProps {
  onScreeningComplete: (hasContraindication: boolean, details: any) => void;
}

export const ContraindicationScreening: React.FC<ContraindicationScreeningProps> = ({
  onScreeningComplete,
}) => {
  const [pregnant, setPregnant] = React.useState<string>('');
  const [pacemaker, setPacemaker] = React.useState<string>('');
  const [hospitalized, setHospitalized] = React.useState<string>('');
  
  const hasContraindication = 
    pregnant === 'yes' || pacemaker === 'yes' || hospitalized === 'yes';
  
  React.useEffect(() => {
    if (pregnant && pacemaker && hospitalized) {
      onScreeningComplete(hasContraindication, {
        pregnant: pregnant === 'yes',
        pacemaker: pacemaker === 'yes',
        hospitalized: hospitalized === 'yes',
      });
    }
  }, [pregnant, pacemaker, hospitalized]);

  return (
    <div className="space-y-6">
      <h3 className="font-semibold">Safety Screening</h3>
      
      <div className="space-y-4">
        <RadioGroup value={pregnant} onValueChange={setPregnant}>
          <Label>Are you currently pregnant?</Label>
          <div className="flex space-x-4 mt-2">
            <div className="flex items-center">
              <RadioGroupItem value="yes" id="pregnant-yes" />
              <Label htmlFor="pregnant-yes" className="ml-2">Yes</Label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem value="no" id="pregnant-no" />
              <Label htmlFor="pregnant-no" className="ml-2">No</Label>
            </div>
          </div>
        </RadioGroup>

        <RadioGroup value={pacemaker} onValueChange={setPacemaker}>
          <Label>Do you have a pacemaker or ICD?</Label>
          <div className="flex space-x-4 mt-2">
            <div className="flex items-center">
              <RadioGroupItem value="yes" id="pacemaker-yes" />
              <Label htmlFor="pacemaker-yes" className="ml-2">Yes</Label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem value="no" id="pacemaker-no" />
              <Label htmlFor="pacemaker-no" className="ml-2">No</Label>
            </div>
          </div>
        </RadioGroup>

        <RadioGroup value={hospitalized} onValueChange={setHospitalized}>
          <Label>Hospitalized for cardiac condition in past 30 days?</Label>
          <div className="flex space-x-4 mt-2">
            <div className="flex items-center">
              <RadioGroupItem value="yes" id="hosp-yes" />
              <Label htmlFor="hosp-yes" className="ml-2">Yes</Label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem value="no" id="hosp-no" />
              <Label htmlFor="hosp-no" className="ml-2">No</Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      {hasContraindication && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Medical Review Required</AlertTitle>
          <AlertDescription>
            Based on your answers, please consult your GP or call emergency services.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};