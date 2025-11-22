import React from 'react';
import { ComparisonTable } from '@/components/ui/comparison-table';
import { ProgressiveSection } from '@/components/ui/progressive-section';
import { useTranslation } from '@/hooks/useTranslation';

export function EnhancedComparison() {
  const translations = useTranslation('home');
  
  const comparisonItems = [
    {
      feature: translations.comparison.features[0],
      competitors: false,
      skiin: true
    },
    {
      feature: translations.comparison.features[1],
      competitors: "Limited",
      skiin: true
    },
    {
      feature: translations.comparison.features[2],
      competitors: false,
      skiin: true
    },
    {
      feature: translations.comparison.features[3],
      competitors: false,
      skiin: true
    },
    {
      feature: translations.comparison.features[4],
      competitors: "Partial",
      skiin: true
    },
    {
      feature: translations.comparison.features[5],
      competitors: "Basic",
      skiin: true
    },
    {
      feature: translations.comparison.features[6],
      competitors: false,
      skiin: true
    }
  ];

  return (
    <ProgressiveSection className="py-20 md:py-30">
      <div className="container-custom">
        {/* Visual Comparison Graphic */}
        <div className="mb-12">
          <img
            src="/assets/images/product/visual-compar-skiin-medical-wearable.png"
            alt="SKIIN vs Traditional Medical Wearables Comparison"
            className="w-full max-w-5xl mx-auto h-auto rounded-xl shadow-lg"
            data-testid="comparison-visual"
          />
        </div>
        
        {/* Comparison Table */}
        <ComparisonTable
          title={translations.comparison.title}
          subtitle={translations.comparison.subtitle}
          items={comparisonItems}
          competitorLabel="Traditional Monitors"
          skiinLabel="SKIIN Technology"
        />
      </div>
    </ProgressiveSection>
  );
}