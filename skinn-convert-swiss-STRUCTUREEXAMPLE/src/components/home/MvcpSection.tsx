import React from 'react';
import { ProgressiveSection } from '@/components/ui/progressive-section';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Monitor, 
  Database, 
  Users, 
  Activity,
  BarChart3,
  Shield,
  ArrowRight
} from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';

function MvcpSection() {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  const features = [
    {
      icon: Monitor,
      title: "Real-Time ECG Review",
      description: "Review patient ECG strips with symptom annotations instantly"
    },
    {
      icon: Database,
      title: "Patient Data Management",
      description: "Centralized dashboard for all your cardiac monitoring studies"
    },
    {
      icon: Users,
      title: "Collaborative Care",
      description: "Share findings with specialists and coordinate treatment plans"
    },
    {
      icon: Activity,
      title: "AI-Powered Analysis",
      description: "Advanced algorithms help identify arrhythmias and patterns"
    }
  ];

  return (
    <ProgressiveSection className="py-20 md:py-30 bg-primary text-primary-foreground" dark>
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div ref={ref} className="space-y-8">
            <div className={cn(
              "transition-all duration-1000",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            )}>
              <span className="text-primary font-medium text-lg">
                For Healthcare Professionals
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                Myant Virtual Clinic Portal (MVCP)
              </h2>
              <p className="text-xl text-primary-foreground/80 leading-relaxed">
                Empower your practice with our comprehensive cardiac monitoring platform. 
                Manage studies, review ECG data, and collaborate with your care team - all in one secure portal.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start space-x-4 transition-all duration-700",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  )}
                  style={{ transitionDelay: `${200 + index * 100}ms` }}
                >
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-primary-foreground/60">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className={cn(
              "transition-all duration-1000",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )} style={{ transitionDelay: "600ms" }}>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Request Portal Access
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Screenshots */}
          <div className="grid gap-6">
            <Card className={cn(
              "overflow-hidden bg-primary-foreground/10 border-primary-foreground/20 transition-all duration-1000",
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            )} style={{ transitionDelay: "300ms" }}>
              <CardContent className="p-0">
                <img 
                  src="/assets/images/mvcp/consultation-mvcp.jpg"
                  alt="MVCP Consultation View"
                  className="w-full h-auto"
                />
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-2 gap-6">
              <Card className={cn(
                "overflow-hidden bg-primary-foreground/10 border-primary-foreground/20 transition-all duration-1000",
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              )} style={{ transitionDelay: "400ms" }}>
                <CardContent className="p-0">
                  <img 
                    src="/assets/images/mvcp/MVCP 2025-06-24 at 10.37.54.png"
                    alt="ECG Review Interface"
                    className="w-full h-auto"
                  />
                </CardContent>
              </Card>
              
              <Card className={cn(
                "overflow-hidden bg-primary-foreground/10 border-primary-foreground/20 transition-all duration-1000",
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              )} style={{ transitionDelay: "500ms" }}>
                <CardContent className="p-0">
                  <img 
                    src="/assets/images/mvcp/MVCP 2025-06-24 at 10.36.25.png"
                    alt="MVCP Dashboard"
                    className="w-full h-auto"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className={cn(
          "mt-16 pt-16 border-t border-gray-800 transition-all duration-1000",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )} style={{ transitionDelay: "700ms" }}>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <p className="font-semibold">HIPAA Compliant</p>
                <p className="text-sm text-primary-foreground/60">Enterprise Security</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-primary" />
              <div>
                <p className="font-semibold">500+ Clinics</p>
                <p className="text-sm text-primary-foreground/60">Trusted Nationwide</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <p className="font-semibold">50,000+ Studies</p>
                <p className="text-sm text-primary-foreground/60">Managed Monthly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProgressiveSection>
  );
}

export default MvcpSection;