import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Brain, Database, Award, Stethoscope, BarChart } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const Cardiologists = () => {
  const t = useTranslation('partners');
  const cardio = t.cardiologists;

  const diagnosticIcons = [Activity, Database, Brain];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-subtle">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6">
                {cardio.hero.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {cardio.hero.description}
              </p>
              <Button size="lg" className="mr-4">
                {cardio.hero.primaryCta}
              </Button>
              <Button variant="outline" size="lg">
                {cardio.hero.secondaryCta}
              </Button>
            </div>
          </div>
        </section>

        {/* Diagnostic Superiority */}
        <section className="py-16">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center mb-12">
              {cardio.diagnosticSuperiority.title}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cardio.diagnosticSuperiority.cards.map((card, index) => {
                const Icon = diagnosticIcons[index];
                return (
                  <Card key={index}>
                    <CardHeader>
                      <Icon className="h-10 w-10 text-primary mb-4" />
                      <CardTitle>{card.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {card.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Practice Integration */}
        <section className="py-16 bg-muted/30">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center mb-12">
              {cardio.practiceIntegration.title}
            </h2>
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
              {/* For Your Clinic */}
              <div>
                <h3 className="text-2xl font-semibold mb-6">{cardio.practiceIntegration.clinic.title}</h3>
                <div className="space-y-4">
                  {cardio.practiceIntegration.clinic.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                        <Stethoscope className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{feature.title}</h4>
                        <p className="text-muted-foreground text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* GP Referrals */}
              <div>
                <h3 className="text-2xl font-semibold mb-6">{cardio.practiceIntegration.referrals.title}</h3>
                <div className="space-y-4">
                  {cardio.practiceIntegration.referrals.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                        <BarChart className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{feature.title}</h4>
                        <p className="text-muted-foreground text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Clinical Evidence */}
        <section className="py-16">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                {cardio.clinicalEvidence.title}
              </h2>
              
              <Card className="mb-8">
                <CardHeader>
                  <Award className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>{cardio.clinicalEvidence.recognition.title}</CardTitle>
                  <CardDescription>
                    {cardio.clinicalEvidence.recognition.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {cardio.clinicalEvidence.recognition.awards.map((award, index) => (
                      <div key={index} className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">{award.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {award.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="bg-primary/5 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">{cardio.clinicalEvidence.caseStudy.title}</h3>
                <p className="text-muted-foreground">
                  <strong>Patient:</strong> {cardio.clinicalEvidence.caseStudy.patient}<br/>
                  <strong>24h Holter:</strong> {cardio.clinicalEvidence.caseStudy.holter24}<br/>
                  <strong>SKIIN 10-Day:</strong> {cardio.clinicalEvidence.caseStudy.skiin10}<br/>
                  <strong>Result:</strong> {cardio.clinicalEvidence.caseStudy.result}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Peer Testimonial */}
        <section className="py-16 bg-muted/30">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <blockquote className="text-xl italic mb-6">
                "{cardio.testimonial.quote}"
              </blockquote>
              <cite className="text-muted-foreground">
                {cardio.testimonial.author}, {cardio.testimonial.title}
              </cite>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container-custom text-center">
            <h2 className="text-4xl font-bold mb-6">
              {cardio.cta.title}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {cardio.cta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                {cardio.cta.primaryButton}
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                {cardio.cta.secondaryButton}
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Cardiologists;