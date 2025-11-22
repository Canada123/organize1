import React from 'react';
import { Shield } from 'lucide-react';

interface EligibilityInsuranceInfoProps {
  insuranceInfo: string;
  className?: string;
}

export const EligibilityInsuranceInfo: React.FC<EligibilityInsuranceInfoProps> = ({
  insuranceInfo,
  className = ''
}) => {
  return (
    <div className={`bg-muted/30 p-4 rounded-lg ${className}`}>
      <div className="flex items-start space-x-3">
        <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-sm text-foreground">{insuranceInfo}</p>
      </div>
    </div>
  );
};