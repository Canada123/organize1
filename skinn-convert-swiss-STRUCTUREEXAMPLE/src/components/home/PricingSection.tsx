import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PricingSectionProps {
  className?: string;
}

/**
 * Pricing Section - v7.2 Requirement
 * Self-pay pricing table with 3/5/10-day options
 */
export function PricingSection({ className }: PricingSectionProps) {
  const pricingTiers = [
    {
      duration: "3-Day Screening",
      price: "149",
      description: "Quick heart check to detect immediate issues",
      features: [
        "3 days of continuous monitoring",
        "AI-powered analysis",
        "Cardiologist review",
        "Digital report"
      ],
      recommended: false
    },
    {
      duration: "5-Day Screening",
      price: "249",
      description: "Comprehensive monitoring to catch intermittent arrhythmias",
      features: [
        "5 days of continuous monitoring",
        "Extended data collection",
        "AI-powered analysis",
        "Cardiologist review",
        "Detailed digital report"
      ],
      recommended: false
    },
    {
      duration: "10-Day Screening",
      price: "349",
      description: "Gold standard – Maximum detection rate and longest monitoring window",
      features: [
        "10 days of continuous monitoring",
        "Highest arrhythmia detection rate",
        "Comprehensive AI analysis",
        "Priority cardiologist review",
        "Detailed report with recommendations",
        "Follow-up consultation available"
      ],
      recommended: true
    }
  ];

  return (
    <section 
      className={cn("section-padding bg-gradient-to-b from-secondary/5 to-background", className)}
      data-testid="pricing-section"
    >
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Self-Pay Pricing Options
          </h2>
          <p className="text-lg text-muted-foreground mb-4">
            For individuals who wish to self-screen without a prescription
          </p>
          <p className="text-base text-muted-foreground">
            If you have <strong>no symptoms but still want to be checked</strong>, the <strong>10-Day Screening</strong> offers 
            the most comprehensive insight and the highest detection rate. Extended monitoring catches 
            intermittent arrhythmias that may go unnoticed in shorter tests.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <Card 
              key={index}
              className={cn(
                "relative hover:shadow-lg transition-all duration-300",
                tier.recommended && "border-medical-teal shadow-md scale-105"
              )}
              data-testid={`pricing-tier-${index + 1}`}
            >
              {tier.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-medical-teal text-white px-4 py-1 flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    Gold Standard
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <h3 className="text-xl font-semibold mb-2">{tier.duration}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-sm text-muted-foreground">CHF</span>
                  <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{tier.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {tier.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-medical-teal mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant={tier.recommended ? "default" : "outline"}
                  className="w-full"
                  onClick={() => window.location.href = '/about/contact'}
                >
                  {tier.recommended ? "Choose Gold Standard" : "Select Plan"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground mb-4">
            All plans include the SKIIN monitoring device, mobile app access, and secure data storage.
          </p>
          <p className="text-sm font-medium text-foreground">
            Questions about pricing? Our team is here to help you choose the right option.
          </p>
        </div>
      </div>
    </section>
  );
}