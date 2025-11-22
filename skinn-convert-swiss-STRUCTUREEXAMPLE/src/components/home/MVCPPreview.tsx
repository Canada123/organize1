import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Shield, Users, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MVCPPreviewProps {
  className?: string;
}

/**
 * MVCP Preview Component for Landing Page
 * Shows key features of the Myant Virtual Clinic Portal
 */
export function MVCPPreview({ className }: MVCPPreviewProps) {
  const features = [
    {
      icon: BarChart3,
      title: "Real-time Patient Monitoring",
      description: "View live ECG data and AI-flagged events as they happen"
    },
    {
      icon: Shield,
      title: "GDPR Compliant Platform",
      description: "Swiss data protection standards with end-to-end encryption"
    },
    {
      icon: Users,
      title: "Collaborative Care",
      description: "Connect GPs, cardiologists, and patients seamlessly"
    }
  ];

  return (
    <section 
      className={cn("section-padding bg-gradient-to-b from-secondary/5 to-background", className)}
      data-testid="mvcp-preview-section"
    >
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-6">
            <Badge variant="outline" className="bg-medical-teal/10 text-medical-teal border-medical-teal/20">
              For Healthcare Professionals
            </Badge>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Powerful Portal for Clinical Excellence
            </h2>
            
            <p className="text-lg text-muted-foreground">
              The Myant Virtual Clinic Portal (MVCP) empowers healthcare professionals with real-time 
              patient data, AI-powered insights, and streamlined workflows for superior cardiac care.
            </p>

            {/* Key Features */}
            <div className="space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex gap-4">
                    <div className="p-2 rounded-lg bg-medical-teal/10 text-medical-teal h-fit">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="default" 
                onClick={() => window.location.href = '/partners/general-practitioners'}
                data-testid="mvcp-learn-more"
              >
                Learn More for GPs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/partners/cardiologists'}
                data-testid="mvcp-cardiologists"
              >
                For Cardiologists
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>500+ Practices</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>10,000+ Studies</span>
              </div>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img 
                  src="/assets/images/mvcp/MVCP 2025-06-24 at 10.37.54.png"
                  alt="MVCP Dashboard View"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </Card>
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img 
                  src="/assets/images/mvcp/consultation-mvcp.jpg"
                  alt="Doctor using MVCP during consultation"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </Card>
            </div>
            <div className="space-y-4 mt-8">
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img 
                  src="/assets/images/mvcp/MVCP 2025-06-24 at 10.36.25.png"
                  alt="MVCP Patient Management"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </Card>
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img 
                  src="/assets/images/reports/medicalgorythmic-example-report-screenshot-1.png"
                  alt="AI-powered ECG analysis report"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}