import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressiveSection } from '@/components/ui/progressive-section';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';
import { Award, Building2, Users, Microscope } from 'lucide-react';

export function SwissHeritage() {
  const t = useTranslation('about');
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  const highlights = [
    {
      icon: Building2,
      title: t.overview.swissHeritage.highlights[0].title,
      description: t.overview.swissHeritage.highlights[0].description
    },
    {
      icon: Award,
      title: t.overview.swissHeritage.highlights[1].title,
      description: t.overview.swissHeritage.highlights[1].description
    },
    {
      icon: Users,
      title: t.overview.swissHeritage.highlights[2].title,
      description: t.overview.swissHeritage.highlights[2].description
    },
    {
      icon: Microscope,
      title: t.overview.swissHeritage.highlights[3].title,
      description: t.overview.swissHeritage.highlights[3].description
    }
  ];

  return (
    <ProgressiveSection className="py-20 md:py-30 bg-gradient-to-br from-swiss-red/5 to-swiss-silver/5">
      <div className="container-custom">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-swiss-red text-swiss-red">
            {t.overview.swissHeritage.badge}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t.overview.swissHeritage.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t.overview.swissHeritage.description}
          </p>
        </div>

        <div ref={ref} className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Story Content */}
          <div className={cn(
            "space-y-6 transition-all duration-1000",
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          )}>
            <h3 className="text-3xl font-bold">{t.overview.swissHeritage.ethTitle}</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t.overview.swissHeritage.ethDescription1}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t.overview.swissHeritage.ethDescription2}
            </p>
            
            {/* Highlights Grid */}
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {highlights.map((highlight, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start space-x-3 transition-all duration-700",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  )}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  <div className="w-10 h-10 bg-swiss-red/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <highlight.icon className="w-5 h-5 text-swiss-red" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{highlight.title}</h4>
                    <p className="text-sm text-muted-foreground">{highlight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leadership Photo */}
          <div className={cn(
            "transition-all duration-1000",
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )} style={{ transitionDelay: "400ms" }}>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <img 
                  src="/assets/images/team/Team-CH.jpg"
                  alt={t.overview.swissHeritage.imageAlt}
                  className="w-full h-auto"
                />
              </CardContent>
            </Card>
            <p className="text-center text-sm text-muted-foreground mt-4">
              {t.overview.swissHeritage.imageAlt}
            </p>
          </div>
        </div>

        {/* Swiss Cross Symbol */}
        <div className="flex justify-center my-16">
          <div className="w-24 h-24 bg-swiss-red rounded-lg flex items-center justify-center">
            <div className="w-16 h-16 relative">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-4 bg-white"></div>
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4 bg-white"></div>
            </div>
          </div>
        </div>

        {/* Location Emphasis */}
        <div className={cn(
          "text-center transition-all duration-1000",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )} style={{ transitionDelay: "600ms" }}>
          <h3 className="text-2xl font-bold mb-4">{t.overview.swissHeritage.zurichTitle}</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.overview.swissHeritage.zurichDescription}
          </p>
        </div>
      </div>
    </ProgressiveSection>
  );
}