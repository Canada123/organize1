import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from '@/components/ui/card';

/**
 * v7.2 Numbers Section - Key Metrics Display
 * Displays 4 key metrics in a responsive grid
 */
export function NumbersSection() {
  const t = useTranslation('home');
  const numbers = t.numbersSection;

  return (
    <section className="section-padding bg-background" data-testid="numbers-section">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {numbers.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {numbers.subtitle}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {numbers.metrics.map((metric, index) => (
            <Card key={index} className="text-center p-8 hover:shadow-lg transition-shadow" data-testid={`numbers-metric-${index + 1}`}>
              <div className="text-4xl md:text-5xl font-bold text-medical-teal mb-2">
                {metric.value}
              </div>
              <div className="text-lg font-semibold text-foreground mb-2">
                {metric.label}
              </div>
              <p className="text-sm text-muted-foreground">
                {metric.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}