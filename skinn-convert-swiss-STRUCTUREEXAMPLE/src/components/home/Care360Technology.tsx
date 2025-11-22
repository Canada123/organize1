import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Home, Heart, Smartphone, Brain, FileCheck, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * Enhanced Care360 Technology component focused on home-based Holter study
 * Emphasizes the convenience and medical-grade quality of at-home monitoring
 */
export function Care360Technology() {
  const t = useTranslation('home');
  
  // Get translation data
  const homeHolter = t.care360HomeHolter || {};
  const processStepsData = homeHolter.processSteps || [];
  
  // Map icons to process steps
  const icons = [Home, Heart, Smartphone, Brain, FileCheck, Clock];
  
  const processSteps = processStepsData.map((step, index) => ({
    icon: icons[index] || Home,
    title: step.title || '',
    description: step.description || ''
  }));

  return (
    <section className="section-padding bg-gradient-to-b from-secondary/10 to-background relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-medical-teal rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-professional-teal rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <Badge className="mb-4" variant="outline">
            {homeHolter.badge || 'Home-Based Holter Study'}
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {homeHolter.title || 'Revolutionary Care360° Technology'}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            {homeHolter.subtitle || 'Experience the future of cardiac monitoring - comprehensive, comfortable, and completely from home'}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left: Process Steps Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {processSteps.slice(0, 4).map((step, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-medical-teal/20 to-professional-teal/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <step.icon className="w-6 h-6 text-medical-teal" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Right: Visual Showcase */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/assets/images/40ba1015-d4f2-4e38-a22e-d479e1c983f6.png"
                alt="Doctor consultation showing cardiac assessment"
                className="w-full h-auto"
                loading="lazy"
              />
              {/* Floating Badge */}
              <div className="absolute bottom-4 right-4">
                <Badge 
                  className="bg-gradient-to-r from-medical-teal to-professional-teal text-white px-4 py-2 text-sm font-semibold shadow-lg"
                >
                  {homeHolter.badge || 'Home-Based Holter Study'}
                </Badge>
              </div>
            </div>
            
            {/* Secondary Image - App Preview */}
            <div className="absolute -bottom-8 -left-8 w-48 rounded-xl overflow-hidden shadow-xl hidden lg:block">
              <img
                src="/assets/images/app-live-ecg.png"
                alt="SKIIN App real-time monitoring"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* How It Works Process Flow */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center mb-12">
            {homeHolter.processTitle || 'Your Complete Home Holter Study Process'}
          </h3>
          
          <div className="max-w-5xl mx-auto">
            {/* Process Steps - Visual Flow */}
            <div className="grid md:grid-cols-3 gap-8">
              {processSteps.slice(0, 3).map((step, index) => (
                <div key={index} className="relative">
                  {/* Connection Line */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 left-full w-8 h-0.5 bg-gradient-to-r from-medical-teal to-professional-teal z-0" />
                  )}
                  
                  <Card className="relative z-10 hover:shadow-lg transition-all hover:-translate-y-1">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-medical-teal/20 to-professional-teal/20 flex items-center justify-center">
                        <step.icon className="w-8 h-8 text-medical-teal" />
                      </div>
                      <h4 className="font-semibold mb-2">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            
            {/* Bottom Row */}
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              {processSteps.slice(3, 6).map((step, index) => (
                <div key={index} className="relative">
                  {/* Connection Line */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 left-full w-8 h-0.5 bg-gradient-to-r from-medical-teal to-professional-teal z-0" />
                  )}
                  
                  <Card className="relative z-10 hover:shadow-lg transition-all hover:-translate-y-1">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-medical-teal/20 to-professional-teal/20 flex items-center justify-center">
                        <step.icon className="w-8 h-8 text-medical-teal" />
                      </div>
                      <h4 className="font-semibold mb-2">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            {homeHolter.bottomText || 'Join the thousands who have already experienced the convenience and accuracy of home-based cardiac monitoring'}
          </p>
          <a 
            href="/eligibility" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-medical-teal to-professional-teal text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            {homeHolter.cta || 'Start Your Home-Based Holter Study'}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}