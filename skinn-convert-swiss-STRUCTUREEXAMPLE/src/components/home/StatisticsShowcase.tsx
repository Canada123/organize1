import React from 'react';
import { ProgressiveSection } from '@/components/ui/progressive-section';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouteTranslations } from '@/utils/routeTranslations';
import { Link } from 'react-router-dom';
import { StatisticsCard } from './StatisticsCard';
import { AlertCircle, Activity, Target } from 'lucide-react';

/**
 * v7.2 Evidence-based Statistics Section
 * Displays clinical evidence with proper citations
 */
export function StatisticsShowcase() {
  const { language } = useLanguage();
  const translations = useTranslation('home');
  const { getRoutePath } = useRouteTranslations();
  
  const stats = translations.statistics;

  return (
    <ProgressiveSection className="py-20 md:py-24 bg-gradient-to-br from-background to-secondary/10" data-testid="statistics-showcase-section">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {stats.title}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            {stats.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {stats.cards.map((stat, index) => {
            // Add icons for each statistic
            const icons = [
              <AlertCircle className="w-12 h-12" />, // Silent AF
              <Activity className="w-12 h-12" />,     // Stroke risk
              <Target className="w-12 h-12" />        // Detection rate
            ];
            
            return (
              <StatisticsCard
                key={index}
                index={index}
                value={stat.value}
                label={stat.label}
                footnote={stat.footnote}
                icon={icons[index]}
              />
            );
          })}
        </div>

        {/* Clinical Evidence Footnote */}
        <div className="text-center">
          <p className="text-base text-muted-foreground mb-4">
            {stats.footnote}
          </p>
          <Link 
            to={getRoutePath('/how-it-works/clinical-evidence', language)}
            className="text-trust-blue hover:text-trust-blue-dark underline underline-offset-4 font-medium"
          >
            {stats.evidenceLink} →
          </Link>
        </div>
      </div>
    </ProgressiveSection>
  );
}