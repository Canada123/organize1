import React from 'react';
import { CompactSymptomSelector } from '../atoms/CompactSymptomSelector';

interface SymptomSectionProps {
  symptoms: Array<{ id: string; label: string; isEmergency?: boolean }>;
  selectedSymptoms: string[];
  onSymptomToggle: (symptomId: string) => void;
}

export const SymptomSection: React.FC<SymptomSectionProps> = ({
  symptoms,
  selectedSymptoms,
  onSymptomToggle
}) => {
  const hasEmergencySymptom = selectedSymptoms.some(
    id => symptoms.find(s => s.id === id)?.isEmergency
  );

  return (
    <div className="space-y-4">
      <CompactSymptomSelector
        symptoms={symptoms}
        selectedSymptoms={selectedSymptoms}
        onSymptomToggle={onSymptomToggle}
      />
      
      {hasEmergencySymptom && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-medium">
            ⚠️ You've selected symptoms that may require immediate medical attention
          </p>
        </div>
      )}
    </div>
  );
};