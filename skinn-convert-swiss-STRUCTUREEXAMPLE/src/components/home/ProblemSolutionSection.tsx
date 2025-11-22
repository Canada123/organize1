import React from 'react';
import { AlertTriangle, Heart, Activity, Moon, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouteTranslations } from '@/utils/routeTranslations';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

/**
 * v7.2 Problem & Solution Section with Silent Triad narrative
 * Explains the three hidden threats and SKIIN's comprehensive solution
 */
const ProblemSolutionSection = () => {
  const { language } = useLanguage();
  const t = useTranslation('home');
  const { getRoutePath } = useRouteTranslations();
  
  const ps = t.problemSolution;
  
  // Icon mapping for Silent Triad
  const iconMap = {
    'ecg': Activity,
    'blood-pressure': Heart,
    'sleep': Moon
  };

  return (
    <section className="section-padding bg-gradient-to-b from-background to-secondary/5">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {ps.title}
          </h2>
        </div>

        {/* Problem & Solution Narrative */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Problem */}
          <div className="space-y-6">
            <div className="bg-destructive/5 border-2 border-destructive/20 rounded-lg p-8">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-destructive flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {ps.problem.title}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {ps.problem.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Solution */}
          <div className="space-y-6">
            <div className="bg-medical-teal/5 border-2 border-medical-teal/20 rounded-lg p-8">
              <div className="flex items-start gap-4">
                <Heart className="w-8 h-8 text-medical-teal flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {ps.solution.title}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {ps.solution.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Silent Triad Cards */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-center mb-8">{ps.silentTriad.title}</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {ps.silentTriad.items.map((item, index) => {
              const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Heart;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-medical-teal/10 flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-medical-teal" />
                    </div>
                    <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTAs */}
        <div className="text-center space-y-4">
          <Link to={getRoutePath('/assessment', language)}>
            <Button size="lg" variant="medical" className="px-8">
              <Heart className="w-5 h-5 mr-2" />
              {ps.cta}
            </Button>
          </Link>
          
          <div>
            <Link 
              to={getRoutePath('/solutions/silent-triad', language)}
              className="text-trust-blue hover:text-trust-blue-dark underline-offset-4 hover:underline inline-flex items-center gap-1"
            >
              {ps.linkText} {ps.comingSoon}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;