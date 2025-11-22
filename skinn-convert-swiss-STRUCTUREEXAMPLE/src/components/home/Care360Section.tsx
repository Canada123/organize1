import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { CheckCircle } from 'lucide-react';

/**
 * v7.2 Care360 Section - Technology Overview
 * Split layout with image and bullet points
 */
export function Care360Section() {
  const t = useTranslation('home');
  const care360 = t.care360Section;

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {care360.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {care360.subtitle}
          </p>
        </div>

        {/* Split Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {care360.description}
            </p>
            
            {/* Bullet Points */}
            <ul className="space-y-4">
              {care360.features.map((feature, index) => (
                <li key={index} className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-medical-teal shrink-0 mt-0.5" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="pt-4">
              <a 
                href="/how-it-works/technology" 
                className="inline-flex items-center gap-2 text-medical-teal hover:text-medical-teal/80 font-medium transition-colors"
              >
                {care360.cta}
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          {/* Right: Image/Placeholder */}
          <div className="relative">
            <div className="aspect-[4/3] bg-gradient-to-br from-medical-teal/10 to-medical-teal/5 rounded-lg flex items-center justify-center">
              {/* Placeholder for product collage image */}
              <div className="text-center p-8">
                <p className="text-muted-foreground text-sm">
                  {care360.imagePlaceholder || "[SKIIN Product Collage]"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}