import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/contexts/LanguageContext';

const InsuranceSection = () => {
  const { language } = useLanguage();
  const t = useTranslation('home');

  const getCoverageCheckPath = () => {
    if (language === 'de') return '/de/wie-es-funktioniert/kostenerstattung';
    if (language === 'fr') return '/fr/comment-ca-marche/remboursement';
    return '/how-it-works/reimbursement';
  };

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.insurance.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t.insurance.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {t.insurance.models.map((model, index) => (
            <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">{model.icon}</div>
                <h3 className="font-semibold text-foreground mb-3">{model.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {model.description}
                </p>
              </CardContent>
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" asChild>
            <Link to={getCoverageCheckPath()}>
              {t.insurance.cta}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InsuranceSection;