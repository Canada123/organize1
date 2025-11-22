import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Heart, Calendar, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Care360VisionProps {
  className?: string;
}

/**
 * Care360 Vision Component - v7.2 Requirement
 * Shows upcoming features and future vision for SKIIN
 */
export function Care360Vision({ className }: Care360VisionProps) {
  const comingSoonFeatures = [
    {
      icon: Heart,
      title: "Virtual Cardiometabolic Assessments",
      description: "Comprehensive evaluations from the comfort of home",
      timeline: "Coming 2026"
    },
    {
      icon: Activity,
      title: "Ambulatory Blood Pressure Monitoring (ABPM)",
      description: "The reference standard for diagnosing hypertension, measuring blood pressure every 15-30 minutes during the day",
      timeline: "Early 2026"
    },
    {
      icon: Calendar,
      title: "Sleep Analysis & Apnoea Detection",
      description: "Complete Silent Triad monitoring in one comfortable solution",
      timeline: "Q2 2026"
    },
    {
      icon: Users,
      title: "Virtual Wellness Programmes",
      description: "Subscription-based packages supporting long-term heart and metabolic health",
      timeline: "Mid 2026"
    }
  ];

  return (
    <section 
      className={cn("section-padding bg-gradient-to-b from-secondary/5 to-background", className)}
      data-testid="care360-vision-section"
    >
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <Badge variant="outline" className="mb-4 bg-medical-teal/10 text-medical-teal border-medical-teal/20">
            Coming Soon
          </Badge>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Care360 is Just the Beginning
          </h2>
          
          <p className="text-lg text-muted-foreground">
            Care360 is our commitment to continuous innovation. Coming soon, we will expand beyond heart screening 
            to offer a full suite of virtual cardiometabolic assessments and personalised wellness programmes.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {comingSoonFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="hover:shadow-lg transition-all duration-300 border-dashed"
                data-testid={`vision-feature-${index + 1}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="p-3 rounded-lg bg-medical-teal/10 text-medical-teal">
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {feature.title}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {feature.timeline}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <p className="text-muted-foreground mb-6">
            Be the first to know when these innovative features launch.
          </p>
          
          <Button 
            size="lg"
            variant="default"
            onClick={() => window.location.href = '/vision'}
            data-testid="vision-waitlist-cta"
          >
            Join the Waitlist
          </Button>
          
          {/* Trust Indicator */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>500+ healthcare professionals already on the waitlist</span>
          </div>
        </div>
      </div>
    </section>
  );
}