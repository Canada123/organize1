import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

/**
 * v7.2 Clinically Proven Technology Section
 * Displays 4 trust markers in a responsive grid
 */
export function ClinicallyProvenTechSection() {
  const t = useTranslation('home');
  const tech = t.clinicallyProvenTech;

  return (
    <section className="section-padding bg-gradient-to-b from-background to-secondary/5" data-testid="clinically-proven-tech-section">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {tech.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {tech.subtitle}
          </p>
        </div>

        {/* Trust Markers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tech.trustMarkers.map((marker, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-lg transition-all duration-300"
              data-testid={`trust-marker-${index + 1}`}
            >
              <CardContent className="p-6">
                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-medical-teal/10 flex items-center justify-center mb-4 group-hover:bg-medical-teal/20 transition-colors">
                  <CheckCircle2 className="w-6 h-6 text-medical-teal" />
                </div>
                
                {/* Content */}
                <h3 className="font-semibold text-lg mb-3 text-foreground">
                  {marker.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {marker.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a 
            href="/how-it-works/clinical-evidence" 
            className="inline-flex items-center gap-2 text-medical-teal hover:text-medical-teal/80 font-medium transition-colors"
          >
            {tech.cta}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}