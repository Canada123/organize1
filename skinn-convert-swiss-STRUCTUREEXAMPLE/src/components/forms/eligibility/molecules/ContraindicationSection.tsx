import React from 'react';
import { ContraindicationScreening } from '../components/ContraindicationScreening';

interface ContraindicationSectionProps {
  contraindications: string[];
  onComplete: (contraindications: string[]) => void;
}

export const ContraindicationSection: React.FC<ContraindicationSectionProps> = ({
  contraindications,
  onComplete
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">
        Medical History Screening
      </h3>
      <p className="text-sm text-muted-foreground">
        Please answer these important health questions
      </p>
      <ContraindicationScreening
        initialContraindications={contraindications}
        onComplete={onComplete}
      />
    </div>
  );
};