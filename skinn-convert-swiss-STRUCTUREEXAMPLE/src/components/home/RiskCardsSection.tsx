import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Activity, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RiskCardsSectionProps {
  className?: string;
}

/**
 * Risk Cards Section - v7.2 Requirement
 * Educates visitors about cardiac risks to motivate action
 */
export function RiskCardsSection({ className }: RiskCardsSectionProps) {
  const risks = [
    {
      icon: AlertCircle,
      title: "Silent Atrial Fibrillation",
      description: "Often asymptomatic but increases stroke risk five-fold",
      prevalence: "One in four adults over 40 are affected",
      detail: "Early detection through extended monitoring saves lives.",
      color: "text-red-600"
    },
    {
      icon: Activity,
      title: "Cardiac Arrhythmias",
      description: "Irregular heartbeats that can be life-threatening if undetected",
      prevalence: "Millions of adults live with undiagnosed arrhythmias",
      detail: "Continuous ECG monitoring uncovers these hidden events.",
      color: "text-orange-600"
    },
    {
      icon: Shield,
      title: "Heart Disease Prevention",
      description: "Early detection enables preventive treatment and lifestyle changes",
      prevalence: "Heart disease remains the leading cause of death worldwide",
      detail: "Proactive screening and management can reduce risk and improve longevity.",
      color: "text-medical-teal"
    }
  ];

  return (
    <section 
      className={cn("section-padding bg-gradient-to-b from-background to-secondary/5", className)}
      data-testid="risk-cards-section"
    >
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Know Your Heart Risk
          </h2>
          <p className="text-lg text-muted-foreground">
            Understanding your cardiovascular risk can save your life. Learn about the hidden threats that affect millions.
          </p>
        </div>

        {/* Risk Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {risks.map((risk, index) => {
            const Icon = risk.icon;
            return (
              <Card 
                key={index}
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                data-testid={`risk-card-${index + 1}`}
              >
                <CardContent className="p-6 space-y-4">
                  {/* Icon */}
                  <div className={cn("w-14 h-14 rounded-full bg-opacity-10 flex items-center justify-center", `bg-${risk.color}`)}>
                    <Icon className={cn("w-8 h-8", risk.color)} />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-semibold text-foreground">
                    {risk.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-muted-foreground">
                    {risk.description}
                  </p>
                  
                  {/* Prevalence */}
                  <p className="text-sm font-medium text-foreground/80 italic">
                    {risk.prevalence}
                  </p>
                  
                  {/* Detail */}
                  <p className="text-sm text-muted-foreground">
                    {risk.detail}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            Don't wait for symptoms. Extended monitoring can detect problems before they become life-threatening.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-muted-foreground">70% of arrhythmias are silent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-muted-foreground">Early detection saves lives</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}