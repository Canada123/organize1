import React from 'react';
import { MinimalButton } from '@/components/ui/minimal-button';
import { ArrowRight } from 'lucide-react';
import { EligibilitySymptomSelector } from '../molecules/EligibilitySymptomSelector';
import { EligibilityRiskFactorSelector } from '../molecules/EligibilityRiskFactorSelector';
import { EligibilityInsurerSelector } from '../molecules/EligibilityInsurerSelector';
import { SelectOption } from '../data/types';

interface EligibilityFormStepProps {
  step: number;
  formData: Record<string, unknown>;
  onFormDataChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
  options: {
    symptoms: SelectOption[];
    riskFactors: SelectOption[];
    insuranceModels: SelectOption[];
    insurers: SelectOption[];
  };
  translations: any;
  isNextDisabled: boolean;
}

export const EligibilityFormStep: React.FC<EligibilityFormStepProps> = ({
  step,
  formData,
  onFormDataChange,
  onNext,
  onBack,
  options,
  translations: t,
  isNextDisabled
}) => {
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <EligibilitySymptomSelector
            value={formData.symptoms}
            onChange={(value) => onFormDataChange({...formData, symptoms: value})}
            options={options.symptoms}
            title={t.symptomsQuestion}
          />
        );
      case 2:
        return (
          <EligibilityRiskFactorSelector
            value={formData.riskFactors}
            onChange={(value) => onFormDataChange({...formData, riskFactors: value})}
            options={options.riskFactors}
            title={t.riskFactorsQuestion}
          />
        );
      case 3:
        return (
          <EligibilitySymptomSelector
            value={formData.insuranceModel}
            onChange={(value) => onFormDataChange({...formData, insuranceModel: value})}
            options={options.insuranceModels}
            title={t.insuranceModelQuestion}
          />
        );
      case 4:
        return (
          <EligibilityInsurerSelector
            value={formData.insurer}
            onChange={(value) => onFormDataChange({...formData, insurer: value})}
            options={options.insurers}
            title={t.insurerQuestion}
            placeholder={t.insurerPlaceholder}
            helpText={t.insurerHelp}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {renderStepContent()}
      <div className="flex justify-between pt-8">
        <MinimalButton 
          variant="secondary" 
          onClick={onBack}
          disabled={step === 1}
        >
          {t.back}
        </MinimalButton>
        <MinimalButton 
          variant="primary"
          onClick={onNext}
          disabled={isNextDisabled}
        >
          {step === 4 ? t.showResult : t.next}
          <ArrowRight className="w-4 h-4 ml-2" />
        </MinimalButton>
      </div>
    </>
  );
};