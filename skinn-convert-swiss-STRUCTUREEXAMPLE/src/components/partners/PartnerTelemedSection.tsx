import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Wifi, 
  Cloud, 
  Shield, 
  Zap,
  Code2,
  Users,
  BarChart3,
  ArrowRight
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * v7.2 Partner Telemed Section
 * Remote monitoring benefits and API integration for telemedicine providers
 */
export function PartnerTelemedSection() {
  const t = useTranslation('partners');
  const telemed = t.telemedicine.integration;

  const benefits = [
    {
      icon: Wifi,
      title: telemed.benefits[0].title,
      description: telemed.benefits[0].description
    },
    {
      icon: Cloud,
      title: telemed.benefits[1].title,
      description: telemed.benefits[1].description
    },
    {
      icon: Shield,
      title: telemed.benefits[2].title,
      description: telemed.benefits[2].description
    },
    {
      icon: Zap,
      title: telemed.benefits[3].title,
      description: telemed.benefits[3].description
    }
  ];

  const apiFeatures = [
    {
      icon: Code2,
      title: telemed.api.features[0].title,
      description: telemed.api.features[0].description
    },
    {
      icon: BarChart3,
      title: telemed.api.features[1].title,
      description: telemed.api.features[1].description
    },
    {
      icon: Users,
      title: telemed.api.features[2].title,
      description: telemed.api.features[2].description
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {telemed.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {telemed.subtitle}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-medical-teal/10 rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-medical-teal" />
                </div>
                <CardTitle className="text-lg">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* API Integration Section */}
        <Card className="mb-12">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{telemed.api.title}</CardTitle>
            <CardDescription className="text-base">
              {telemed.api.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {apiFeatures.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-medical-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-medical-teal" />
                  </div>
                  <h4 className="font-semibold mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Integration Process */}
        <div className="bg-muted/30 rounded-lg p-8 mb-12">
          <h3 className="text-2xl font-bold mb-6 text-center">{telemed.process.title}</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {telemed.process.steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  {index + 1}
                </div>
                <h4 className="font-semibold mb-2">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">{telemed.cta.title}</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">{telemed.cta.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="group">
              {telemed.cta.primaryButton}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline">
              {telemed.cta.secondaryButton}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}