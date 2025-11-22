import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Users, FileText, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface InsuranceCoverageSectionProps {
  className?: string;
}

/**
 * Insurance Coverage Section - v7.2 Requirement
 * Explains Swiss insurance coverage and pathways
 */
export function InsuranceCoverageSection({ className }: InsuranceCoverageSectionProps) {
  const pathways = [
    {
      icon: Users,
      title: "Standard (Free Choice)",
      description: "Visit any doctor for referral. Full coverage with basic insurance when medically prescribed."
    },
    {
      icon: FileText,
      title: "GP Model (Hausarztmodell)",
      description: "Consult your family doctor first. GPs bill for consultation and setup, cardiologists for reporting."
    },
    {
      icon: Users,
      title: "HMO Model",
      description: "Visit your HMO practice for evaluation. When approved, SKIIN is fully covered."
    },
    {
      icon: CreditCard,
      title: "Telmed Model",
      description: "Call your telemedicine hotline first. Once approved by the tele-doctor, coverage is guaranteed."
    }
  ];

  const benefits = [
    "Covered by basic insurance when prescribed",
    "No out-of-pocket costs for qualifying patients",
    "Reimbursement support included",
    "Direct billing available"
  ];

  return (
    <section 
      className={cn("section-padding bg-background", className)}
      data-testid="insurance-coverage-section"
    >
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Comprehensive Insurance Coverage
          </h2>
          <p className="text-lg text-muted-foreground">
            SKIIN is recognized and fully covered by basic Swiss health insurance when medically prescribed
          </p>
        </div>

        {/* Key Benefits */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="p-8 bg-gradient-to-br from-medical-teal/5 to-transparent border-medical-teal/20">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Coverage Benefits</h3>
                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-medical-teal mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">How It Works</h3>
                <p className="text-muted-foreground mb-4">
                  The monitoring kit and analysis are reimbursed under mandatory health insurance, 
                  with no out-of-pocket costs for qualifying patients. Our team assists with paperwork 
                  and reimbursement claims, ensuring a smooth process.
                </p>
                <p className="text-sm text-muted-foreground">
                  We simplify payment by invoicing insurers directly, so patients don't need to pay upfront.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Four Pathways */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-center mb-8">Four Pathways to Coverage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pathways.map((pathway, index) => {
              const Icon = pathway.icon;
              return (
                <Card 
                  key={index}
                  className="hover:shadow-md transition-shadow"
                  data-testid={`insurance-pathway-${index + 1}`}
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-medical-teal/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-medical-teal" />
                    </div>
                    <h4 className="font-semibold mb-2">{pathway.title}</h4>
                    <p className="text-sm text-muted-foreground">{pathway.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Billing Note */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-sm text-muted-foreground mb-6">
            <span className="font-medium">Note:</span> GPs bill only for consultation and patient onboarding (equipment setup), 
            while cardiologists bill for interpretation and reporting. This ensures transparent and fair billing practices.
          </p>
          
          {/* CTA */}
          <Button 
            size="lg" 
            variant="default"
            onClick={() => window.location.href = '/how-it-works/reimbursement'}
            data-testid="check-coverage-cta"
          >
            Check Your Coverage
          </Button>
        </div>
      </div>
    </section>
  );
}