import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Heart,
  Package,
  BarChart3,
  Shield,
  ArrowRight
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * v7.2 Partner Corporate Section
 * Wellness program benefits and volume packages for corporate clients
 */
export function PartnerCorporateSection() {
  const t = useTranslation('partners');
  const corporate = t.corporate.wellness;

  const benefits = [
    {
      icon: Heart,
      title: corporate.benefits[0].title,
      description: corporate.benefits[0].description
    },
    {
      icon: TrendingUp,
      title: corporate.benefits[1].title,
      description: corporate.benefits[1].description
    },
    {
      icon: Shield,
      title: corporate.benefits[2].title,
      description: corporate.benefits[2].description
    },
    {
      icon: Users,
      title: corporate.benefits[3].title,
      description: corporate.benefits[3].description
    }
  ];

  const packages = [
    {
      name: corporate.packages[0].name,
      employees: corporate.packages[0].employees,
      features: corporate.packages[0].features,
      highlight: false
    },
    {
      name: corporate.packages[1].name,
      employees: corporate.packages[1].employees,
      features: corporate.packages[1].features,
      highlight: true
    },
    {
      name: corporate.packages[2].name,
      employees: corporate.packages[2].employees,
      features: corporate.packages[2].features,
      highlight: false
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {corporate.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {corporate.subtitle}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
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

        {/* Volume Packages */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">
            {corporate.volumeTitle}
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((pkg, index) => (
              <Card 
                key={index} 
                className={`relative ${pkg.highlight ? 'border-medical-teal shadow-lg' : ''}`}
              >
                {pkg.highlight && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-medical-teal text-white px-3 py-1 rounded-full text-sm">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-xl">{pkg.name}</CardTitle>
                  <CardDescription className="text-lg font-semibold">
                    {pkg.employees}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2">
                        <Package className="w-4 h-4 text-medical-teal shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full mt-6" 
                    variant={pkg.highlight ? "default" : "outline"}
                  >
                    Get Quote
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ROI Section */}
        <Card className="mb-12">
          <CardHeader className="text-center">
            <Building2 className="w-12 h-12 text-medical-teal mx-auto mb-4" />
            <CardTitle className="text-2xl">{corporate.roi.title}</CardTitle>
            <CardDescription className="text-base">
              {corporate.roi.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              {corporate.roi.metrics.map((metric, index) => (
                <div key={index}>
                  <div className="text-3xl font-bold text-medical-teal mb-2">
                    {metric.value}
                  </div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">{corporate.cta.title}</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">{corporate.cta.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="group">
              {corporate.cta.primaryButton}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline">
              {corporate.cta.secondaryButton}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}