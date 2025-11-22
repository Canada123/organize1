import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Smartphone, Cloud, Brain, Heart, FileText } from 'lucide-react';

/**
 * v7.2 Tech Carousel - Data Flow Visualization
 * Shows the journey from sensor to report
 */
export function TechCarousel() {
  const t = useTranslation('home');
  const carousel = t.techCarousel;

  // Icon mapping
  const iconMap = {
    sensor: Heart,
    app: Smartphone,
    cloud: Cloud,
    ai: Brain,
    report: FileText
  };

  return (
    <section className="section-padding bg-gradient-to-b from-secondary/5 to-background" data-testid="tech-carousel-section">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {carousel.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {carousel.subtitle}
          </p>
        </div>

        {/* Carousel */}
        <Carousel className="max-w-5xl mx-auto">
          <CarouselContent>
            {carousel.steps.map((step, index) => {
              const Icon = iconMap[step.icon as keyof typeof iconMap] || Heart;
              return (
                <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/3" data-testid={`tech-carousel-step-${index + 1}`}>
                  <Card className="h-full">
                    <CardContent className="p-6 text-center">
                      {/* Step Number */}
                      <div className="text-sm text-muted-foreground mb-4">
                        Step {index + 1}
                      </div>
                      
                      {/* Icon */}
                      <div className="w-16 h-16 rounded-full bg-medical-teal/10 flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-medical-teal" />
                      </div>
                      
                      {/* Content */}
                      <h3 className="font-semibold text-lg mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>

        {/* Mobile Flow (visible on small screens) */}
        <div className="md:hidden space-y-4 mt-8">
          {carousel.steps.map((step, index) => {
            const Icon = iconMap[step.icon as keyof typeof iconMap] || Heart;
            return (
              <div key={index} className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-medical-teal/10 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-medical-teal" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}