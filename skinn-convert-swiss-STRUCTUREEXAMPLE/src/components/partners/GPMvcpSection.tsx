import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Monitor, 
  Database, 
  Users, 
  Activity,
  BarChart3,
  Shield,
  Clock,
  FileText,
  ArrowRight
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * v7.2 MVCP Section for GP Page
 * Myant Virtual Clinic Portal features specifically for General Practitioners
 */
export function GPMvcpSection() {
  const t = useTranslation('partners');
  const mvcp = t.gp.mvcp;

  const features = [
    {
      icon: Monitor,
      title: mvcp.features[0].title,
      description: mvcp.features[0].description
    },
    {
      icon: Database,
      title: mvcp.features[1].title,
      description: mvcp.features[1].description
    },
    {
      icon: Users,
      title: mvcp.features[2].title,
      description: mvcp.features[2].description
    },
    {
      icon: Activity,
      title: mvcp.features[3].title,
      description: mvcp.features[3].description
    },
    {
      icon: Clock,
      title: mvcp.features[4].title,
      description: mvcp.features[4].description
    },
    {
      icon: FileText,
      title: mvcp.features[5].title,
      description: mvcp.features[5].description
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-secondary/5">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {mvcp.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {mvcp.subtitle}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-12">
          {/* Left: Overview Card */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-2xl">{mvcp.overview.title}</CardTitle>
              <CardDescription className="text-base">
                {mvcp.overview.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{mvcp.overview.details}</p>
              
              {/* Key Benefits */}
              <div className="space-y-2 pt-4">
                <h4 className="font-semibold">{mvcp.overview.benefitsTitle}</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {mvcp.overview.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Right: Features Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="bg-card p-4 rounded-lg border">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-medical-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-medical-teal" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Compliance */}
        <Card className="mb-12">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center justify-around gap-8">
              <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8 text-medical-teal" />
                <div>
                  <p className="font-semibold">{mvcp.security.gdpr.title}</p>
                  <p className="text-sm text-muted-foreground">{mvcp.security.gdpr.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-8 h-8 text-medical-teal" />
                <div>
                  <p className="font-semibold">{mvcp.security.practices.title}</p>
                  <p className="text-sm text-muted-foreground">{mvcp.security.practices.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-medical-teal" />
                <div>
                  <p className="font-semibold">{mvcp.security.adoption.title}</p>
                  <p className="text-sm text-muted-foreground">{mvcp.security.adoption.description}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">{mvcp.cta.title}</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">{mvcp.cta.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="group">
              {mvcp.cta.primaryButton}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline">
              {mvcp.cta.secondaryButton}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}