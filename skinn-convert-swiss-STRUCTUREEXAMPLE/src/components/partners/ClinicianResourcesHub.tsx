import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Download, 
  BookOpen, 
  Calculator,
  Shield,
  Stethoscope,
  Video,
  HelpCircle
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * v7.2 Clinician Resources Hub
 * Downloadable materials, billing guides, and clinical protocols
 */
export function ClinicianResourcesHub() {
  const t = useTranslation('partners');
  const resources = t.resources;

  const resourceCategories = [
    {
      title: resources.categories.clinicalProtocols.title,
      description: resources.categories.clinicalProtocols.description,
      icon: Stethoscope,
      items: resources.categories.clinicalProtocols.items,
      colorClass: "text-medical-teal",
      bgClass: "bg-medical-teal/10"
    },
    {
      title: resources.categories.billingGuides.title,
      description: resources.categories.billingGuides.description,
      icon: Calculator,
      items: resources.categories.billingGuides.items,
      colorClass: "text-primary",
      bgClass: "bg-primary/10"
    },
    {
      title: resources.categories.patientMaterials.title,
      description: resources.categories.patientMaterials.description,
      icon: BookOpen,
      items: resources.categories.patientMaterials.items,
      colorClass: "text-accent",
      bgClass: "bg-accent/10"
    },
    {
      title: resources.categories.training.title,
      description: resources.categories.training.description,
      icon: Video,
      items: resources.categories.training.items,
      colorClass: "text-accent",
      bgClass: "bg-accent/10"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-secondary/5">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {resources.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {resources.subtitle}
          </p>
        </div>

        {/* Resource Categories Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {resourceCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg ${category.bgClass} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${category.colorClass}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{item.name}</span>
                          {item.badge && (
                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <Button size="sm" variant="ghost" className="h-8">
                          <Download className="w-4 h-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Access Section */}
        <Card className="mb-12">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{resources.quickAccess.title}</CardTitle>
            <CardDescription>{resources.quickAccess.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {resources.quickAccess.items.map((item, index) => {
                const icons = [Shield, Calculator, HelpCircle, FileText];
                const Icon = icons[index] || FileText;
                return (
                  <Button key={index} variant="outline" className="h-auto flex-col gap-2 p-4">
                    <Icon className="w-6 h-6 text-medical-teal" />
                    <span className="text-sm font-medium">{item.title}</span>
                    <span className="text-xs text-muted-foreground">{item.format}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Support Section */}
        <div className="bg-muted/30 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">{resources.support.title}</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {resources.support.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button>
              {resources.support.primaryButton}
            </Button>
            <Button variant="outline">
              {resources.support.secondaryButton}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}