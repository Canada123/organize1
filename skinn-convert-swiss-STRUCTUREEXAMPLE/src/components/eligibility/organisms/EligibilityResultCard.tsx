import React from 'react';
import { MinimalCard, MinimalCardContent, MinimalCardHeader, MinimalCardTitle } from '@/components/ui/minimal-card';
import { MinimalButton } from '@/components/ui/minimal-button';
import { ArrowRight } from 'lucide-react';
import { EligibilityResultIcon } from '../molecules/EligibilityResultIcon';
import { EligibilityResultBadge } from '../atoms/EligibilityResultBadge';
import { EligibilityNextStepsList } from '../molecules/EligibilityNextStepsList';
import { EligibilityInsuranceInfo } from '../molecules/EligibilityInsuranceInfo';
import { EligibilityResult } from '../data/types';

interface EligibilityResultCardProps {
  result: EligibilityResult;
  onRestart: () => void;
  translations: any;
  className?: string;
}

export const EligibilityResultCard: React.FC<EligibilityResultCardProps> = ({
  result,
  onRestart,
  translations: t,
  className = ''
}) => {
  const getResultTexts = () => {
    switch (result.coverage) {
      case 'covered':
        return { title: t.results.covered.title, badge: t.results.covered.badge };
      case 'consult-first':
        return { title: t.results.consultFirst.title, badge: t.results.consultFirst.badge };
      case 'self-pay':
      default:
        return { title: t.results.selfPay.title, badge: t.results.selfPay.badge };
    }
  };

  const { title, badge } = getResultTexts();

  return (
    <MinimalCard className={`max-w-4xl mx-auto ${className}`} variant="default">
      <MinimalCardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <EligibilityResultIcon coverage={result.coverage} size={16} />
        </div>
        <MinimalCardTitle className="text-3xl mb-4">{title}</MinimalCardTitle>
        <EligibilityResultBadge coverage={result.coverage} text={badge} />
      </MinimalCardHeader>
      <MinimalCardContent>
        <div className="space-y-6">
          <EligibilityNextStepsList
            steps={result.nextSteps}
            title={t.results.covered.nextStepsTitle}
          />
          
          {result.insuranceInfo && (
            <EligibilityInsuranceInfo insuranceInfo={result.insuranceInfo} />
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <MinimalButton size="lg" variant="primary">
              {result.coverage === 'self-pay' ? t.bookConsultation : t.learnMore}
              <ArrowRight className="w-5 h-5 ml-2" />
            </MinimalButton>
            <MinimalButton size="lg" variant="secondary" onClick={onRestart}>
              {t.startNewCheck}
            </MinimalButton>
          </div>
        </div>
      </MinimalCardContent>
    </MinimalCard>
  );
};