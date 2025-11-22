import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ClipboardList, 
  Package, 
  Clock, 
  Activity, 
  FileText,
  CheckCircle,
  Stethoscope,
  Users,
  ArrowRight,
  Phone,
  Building,
  CreditCard
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useNavigate } from 'react-router-dom';

const Process = () => {
  const t = useTranslation('howItWorks');
  const navigate = useNavigate();
  const processSteps = [
    {
      number: t.process.steps.step1.number,
      title: t.process.steps.step1.title,
      icon: <ClipboardList className="h-8 w-8 text-primary" />,
      patient: t.process.steps.step1.patient,
      physician: t.process.steps.step1.physician,
      details: t.process.steps.step1.details
    },
    {
      number: t.process.steps.step2.number, 
      title: t.process.steps.step2.title,
      icon: <Package className="h-8 w-8 text-primary" />,
      patient: t.process.steps.step2.patient,
      physician: t.process.steps.step2.physician,
      details: t.process.steps.step2.details
    },
    {
      number: t.process.steps.step3.number,
      title: t.process.steps.step3.title, 
      icon: <Clock className="h-8 w-8 text-primary" />,
      patient: t.process.steps.step3.patient,
      physician: t.process.steps.step3.physician,
      details: t.process.steps.step3.details
    },
    {
      number: t.process.steps.step4.number,
      title: t.process.steps.step4.title,
      icon: <Activity className="h-8 w-8 text-primary" />,
      patient: t.process.steps.step4.patient,
      physician: t.process.steps.step4.physician,
      details: t.process.steps.step4.details
    },
    {
      number: t.process.steps.step5.number,
      title: t.process.steps.step5.title,
      icon: <FileText className="h-8 w-8 text-primary" />,
      patient: t.process.steps.step5.patient,
      physician: t.process.steps.step5.physician,
      details: t.process.steps.step5.details
    }
  ];

  const insurancePathways = [
    {
      model: t.process.insuranceModels.standard.model,
      icon: <CreditCard className="h-6 w-6 text-primary" />,
      description: t.process.insuranceModels.standard.description,
      process: t.process.insuranceModels.standard.process,
      note: t.process.insuranceModels.standard.note
    },
    {
      model: t.process.insuranceModels.gp.model, 
      icon: <Stethoscope className="h-6 w-6 text-primary" />,
      description: t.process.insuranceModels.gp.description,
      process: t.process.insuranceModels.gp.process, 
      note: t.process.insuranceModels.gp.note
    },
    {
      model: t.process.insuranceModels.hmo.model,
      icon: <Building className="h-6 w-6 text-primary" />,
      description: t.process.insuranceModels.hmo.description,
      process: t.process.insuranceModels.hmo.process,
      note: t.process.insuranceModels.hmo.note
    },
    {
      model: t.process.insuranceModels.telmed.model,
      icon: <Phone className="h-6 w-6 text-primary" />,
      description: t.process.insuranceModels.telmed.description,
      process: t.process.insuranceModels.telmed.process,
      note: t.process.insuranceModels.telmed.note
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-to-br from-primary/5 via-background to-primary/10">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4">
                <Users className="h-4 w-4 mr-2" />
                Process Guide
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                {t.process.hero.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {t.process.hero.subtitle}. {t.process.hero.description}
              </p>
              <Button size="lg" className="text-lg" onClick={() => navigate('/about/contact')}>
                {t.process.hero.cta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Step-by-Step Journey
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From prescription to results - understand what happens at each stage for both patients and healthcare providers.
              </p>
            </div>

            <Tabs defaultValue="patient" className="max-w-6xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="patient" className="text-lg">{t.process.patientView}</TabsTrigger>
                <TabsTrigger value="physician" className="text-lg">{t.process.physicianView}</TabsTrigger>
              </TabsList>

              <TabsContent value="patient" className="space-y-8">
                {processSteps.map((step, index) => (
                  <Card key={index} className="relative overflow-hidden">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0 w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl">
                          {step.number}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center gap-4 mb-4">
                            {step.icon}
                            <h3 className="text-2xl font-semibold text-foreground">{step.title}</h3>
                          </div>
                          <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                            {step.patient}
                          </p>
                          <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                            <p className="text-sm text-muted-foreground italic">
                              {step.details}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="physician" className="space-y-8">
                {processSteps.map((step, index) => (
                  <Card key={index} className="relative overflow-hidden">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0 w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl">
                          {step.number}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center gap-4 mb-4">
                            {step.icon}
                            <h3 className="text-2xl font-semibold text-foreground">{step.title}</h3>
                          </div>
                          <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                            {step.physician}
                          </p>
                          <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                            <p className="text-sm text-muted-foreground italic">
                              {step.details}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Insurance Pathways */}
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t.process.insuranceModels.title}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t.process.insuranceModels.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {insurancePathways.map((pathway, index) => (
                <Card key={index} className="border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      {pathway.icon}
                      <div>
                        <h3 className="font-semibold text-foreground">{pathway.model}</h3>
                        <p className="text-sm text-muted-foreground">{pathway.description}</p>
                      </div>
                    </div>
                    <div className="mb-4 p-3 bg-muted/50 rounded font-mono text-sm">
                      {pathway.process}
                    </div>
                    <p className="text-sm text-muted-foreground">{pathway.note}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-4 p-6 bg-background rounded-lg border border-primary/20">
                <CheckCircle className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <h3 className="font-semibold text-foreground">Bottom Line</h3>
                  <p className="text-muted-foreground">
                    If you follow your insurance's protocol and a doctor orders SKIIN, your basic insurance will cover it
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Process;