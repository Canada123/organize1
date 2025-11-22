import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ConsentsData {
  truthfulness: boolean;
  emergency: boolean;
  dataProcessing: boolean;
}

interface ConsentCheckboxesProps {
  consents: ConsentsData;
  onConsentChange: (key: keyof ConsentsData, value: boolean) => void;
}

const consentItems = [
  {
    id: 'truthfulness',
    label: 'I confirm that the information provided is accurate and complete'
  },
  {
    id: 'emergency',
    label: 'I understand that Holter monitoring does not replace emergency medical evaluation'
  },
  {
    id: 'dataProcessing',
    label: 'I agree to telemedicine services and the privacy policy'
  }
];

export const ConsentCheckboxes: React.FC<ConsentCheckboxesProps> = ({
  consents,
  onConsentChange
}) => {
  return (
    <div className="space-y-4">
      <Label className="text-base font-ibm-plex-sans font-semibold text-[#004C96]">
        Required Consents
      </Label>
      <div className="space-y-3">
        {consentItems.map(item => (
          <div key={item.id} className="flex items-start space-x-2">
            <Checkbox 
              id={item.id}
              checked={consents[item.id as keyof ConsentsData]}
              onCheckedChange={(checked) => 
                onConsentChange(item.id as keyof ConsentsData, !!checked)
              }
              className="mt-1"
            />
            <Label htmlFor={item.id} className="text-sm cursor-pointer">
              {item.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};