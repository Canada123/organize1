import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';

interface TelmedAlertProps {
  type: 'telmed' | 'partner';
  onAction?: () => void;
}

export const TelmedAlert: React.FC<TelmedAlertProps> = ({ type, onAction }) => {
  if (type === 'telmed') {
    return (
      <Alert className="border-[#004C96]/20 bg-[#004C96]/5">
        <Phone className="h-4 w-4 text-[#004C96]" />
        <AlertDescription>
          <strong>Telmed Model Instructions:</strong><br />
          Call your Telmed hotline for triage before obtaining specialist care.
          Your insurer will provide the hotline number and instructions.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-green-200 bg-green-50">
      <AlertDescription className="space-y-2">
        <p>Click below to book your teleconsultation with Medgate</p>
        {onAction && (
          <Button onClick={onAction} className="mt-2 bg-[#004C96] hover:bg-[#004C96]/90">
            Book Teleconsultation
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};