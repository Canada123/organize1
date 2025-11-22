import React from 'react';
import { MinimalCard, MinimalCardContent } from '@/components/ui/minimal-card';
import { StageHeader } from '../components/StageHeader';
import { StageFooter } from '../components/StageFooter';
import { SymptomDetailsSection } from '../molecules/SymptomDetailsSection';
import { ArrhythmiaHistorySection } from '../molecules/ArrhythmiaHistorySection';
import { MedicationSection } from '../molecules/MedicationSection';

interface DetailedInfoStageProps {
  onStageComplete: (data: DetailedInfoData) => void;
  symptoms: string[];
  initialData?: Partial<DetailedInfoData>;
  onBack?: () => void;
}

export interface DetailedInfoData {
  symptomStartDate?: string;
  symptomFrequency?: 'daily' | 'weekly' | 'monthly' | 'sporadic';
  symptomSeverity?: number;
  priorArrhythmia?: boolean;
  arrhythmiaDescription?: string;
  medications?: string;
  fileUploads?: File[];
}

export const DetailedInfoStageRefactored: React.FC<DetailedInfoStageProps> = ({
  onStageComplete,
  symptoms,
  initialData = {},
  onBack
}) => {
  const [data, setData] = React.useState<DetailedInfoData>(initialData);
  const hasSymptoms = symptoms.length > 0 && !symptoms.includes('none');

  const handleContinue = () => {
    onStageComplete(data);
  };

  const updateData = <K extends keyof DetailedInfoData>(
    key: K, 
    value: DetailedInfoData[K]
  ) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <MinimalCard variant="soft" padding="lg" className="w-full max-w-3xl mx-auto">
      <StageHeader
        title="Detailed Medical Information"
        description="Please provide additional information to help us better understand your condition"
      />
      
      <MinimalCardContent className="space-y-6">
        {hasSymptoms && (
          <SymptomDetailsSection
            symptomStartDate={data.symptomStartDate}
            symptomFrequency={data.symptomFrequency}
            symptomSeverity={data.symptomSeverity}
            onDateChange={(date) => updateData('symptomStartDate', date)}
            onFrequencyChange={(freq) => updateData('symptomFrequency', freq)}
            onSeverityChange={(sev) => updateData('symptomSeverity', sev)}
          />
        )}
        
        <ArrhythmiaHistorySection
          priorArrhythmia={data.priorArrhythmia}
          arrhythmiaDescription={data.arrhythmiaDescription}
          onArrhythmiaChange={(value) => updateData('priorArrhythmia', value)}
          onDescriptionChange={(desc) => updateData('arrhythmiaDescription', desc)}
        />
        
        <MedicationSection
          medications={data.medications}
          onChange={(meds) => updateData('medications', meds)}
        />
      </MinimalCardContent>
      
      <StageFooter
        onBack={onBack}
        onNext={handleContinue}
        nextLabel="Continue"
      />
    </MinimalCard>
  );
};