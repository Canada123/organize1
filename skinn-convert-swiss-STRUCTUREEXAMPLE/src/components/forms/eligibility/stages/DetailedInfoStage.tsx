import React from 'react';
import { MinimalCard, MinimalCardContent } from '@/components/ui/minimal-card';
import { MinimalInput } from '@/components/ui/minimal-input';
import { MinimalSelect } from '@/components/ui/minimal-select';
import { MinimalTextarea } from '@/components/ui/minimal-textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { StageHeader } from '../components/StageHeader';
import { StageFooter } from '../components/StageFooter';

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

const frequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'sporadic', label: 'Sporadic' },
];

export const DetailedInfoStage: React.FC<DetailedInfoStageProps> = ({
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

  return (
    <MinimalCard variant="soft" padding="lg" className="w-full max-w-3xl mx-auto">
      <StageHeader
        title="Detailed Medical Information"
        description="Please provide additional information to help us better understand your condition"
      />
      
      <MinimalCardContent className="space-y-6">
        {hasSymptoms && (
          <>
            <MinimalInput
              id="symptom-start"
              type="date"
              label="When did your symptoms begin?"
              value={data.symptomStartDate || ''}
              onChange={(e) => setData({...data, symptomStartDate: e.target.value})}
              max={new Date().toISOString().split('T')[0]}
            />
            
            <MinimalSelect
              label="How frequently do you experience symptoms?"
              value={data.symptomFrequency}
              onChange={(v) => setData({...data, symptomFrequency: v as any})}
              options={frequencyOptions}
              placeholder="Select frequency"
            />
            
            <div className="space-y-3">
              <Label className="text-base font-ibm-plex-sans font-semibold text-[#004C96]">
                How severe are your symptoms? (1-10)
              </Label>
              <Slider 
                id="severity"
                min={1} 
                max={10} 
                step={1}
                value={[data.symptomSeverity || 5]}
                onValueChange={([v]) => setData({...data, symptomSeverity: v})}
                className="w-full"
              />
              <div className="flex justify-between text-sm font-ibm-plex-sans text-[#475259]">
                <span>1 - Minimal</span>
                <span className="font-semibold text-[#004C96]">
                  {data.symptomSeverity || 5}
                </span>
                <span>10 - Severe</span>
              </div>
            </div>
          </>
        )}
        
        <div className="space-y-3">
          <Label className="text-base font-ibm-plex-sans font-semibold text-[#004C96]">
            Have you been diagnosed with a heart rhythm problem or had a recent cardiac procedure?
          </Label>
          <RadioGroup 
            value={data.priorArrhythmia?.toString()} 
            onValueChange={(v) => setData({...data, priorArrhythmia: v === 'true'})}
          >
            <div className="flex space-x-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="true" 
                  id="arrhythmia-yes"
                  className="border-[#004C96]/30 text-[#004C96]"
                />
                <Label 
                  htmlFor="arrhythmia-yes"
                  className="font-ibm-plex-sans text-base text-[#0D0D0D] cursor-pointer"
                >
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="false" 
                  id="arrhythmia-no"
                  className="border-[#004C96]/30 text-[#004C96]"
                />
                <Label 
                  htmlFor="arrhythmia-no"
                  className="font-ibm-plex-sans text-base text-[#0D0D0D] cursor-pointer"
                >
                  No
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>
        
        {data.priorArrhythmia && (
          <MinimalTextarea
            id="arrhythmia-desc"
            label="Please provide details and date"
            value={data.arrhythmiaDescription || ''}
            onChange={(e) => setData({...data, arrhythmiaDescription: e.target.value})}
            placeholder="Brief description and date of diagnosis/procedure"
          />
        )}
        
        <MinimalTextarea
          id="medications"
          label="Please list any cardiac medications you are currently taking"
          value={data.medications || ''}
          onChange={(e) => setData({...data, medications: e.target.value})}
          placeholder="Medication names and doses if available"
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