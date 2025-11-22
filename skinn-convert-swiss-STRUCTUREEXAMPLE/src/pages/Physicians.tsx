import React, { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from "@/components/ui/button";
import { Check, Download, ArrowRight, Stethoscope, Heart, Clock, Layers, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ConversionButton from "@/components/analytics/ConversionButton";
import TrustBadges from '@/components/physicians/TrustBadges';
import TestimonialCard from '@/components/physicians/TestimonialCard';
import DoctorQuote from '@/components/physicians/DoctorQuote';
import BenefitItem from '@/components/physicians/BenefitItem';
import Citation from '@/components/physicians/Citation';
import { trackEvent } from '@/lib/analytics';
import { useTranslation } from '@/hooks/useTranslation';
import { physiciansContent as enContent } from '@/translations/physicians/en';
import { physiciansContent as deContent } from '@/translations/physicians/de';
import { physiciansContent as frContent } from '@/translations/physicians/fr';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProgressiveSection } from '@/components/ui/progressive-section';
import { FeatureGrid } from '@/components/ui/feature-grid';
import { ContentSection } from '@/components/ui/content-section';
import MvcpSection from '@/components/home/MvcpSection';

/**
 * Landing page targeted at physicians. Includes marketing sections, analytics
 * tracking and dynamic translations based on user language.
 */
const Physicians = () => {
  const content = useTranslation(enContent, deContent, frContent);
  const { language } = useLanguage();

  // Track page view for enhanced analytics
  useEffect(() => {
    trackEvent('physician_page_view', {
      page: 'physicians',
      source: document.referrer,
      language
    });
  }, [language]);

  // Benefits for physicians
  const benefits = [
    {
      icon: Stethoscope,
      title: content.benefits.items[0].title,
      description: content.benefits.items[0].description
    },
    {
      icon: Heart,
      title: content.benefits.items[1].title,
      description: content.benefits.items[1].description
    },
    {
      icon: Clock,
      title: content.benefits.items[2].title,
      description: content.benefits.items[2].description
    },
    {
      icon: Layers,
      title: content.benefits.items[3].title,
      description: content.benefits.items[3].description
    },
    {
      icon: ShieldCheck,
      title: content.benefits.items[4].title,
      description: content.benefits.items[4].description
    }
  ];

  // Steps for how it works
  const steps = content.howItWorks.steps;

  // Testimonials
  const testimonials = content.testimonials.items;

  // Clinical evidence citations
  const citations = content.citations;

  // Handler for tracking trial kit requests
  const handleTrialRequest = () => {
    trackEvent('physician_trial_request', {
      source: 'physicians_page',
      section: 'hero',
      language
    });
  };

  // Handler for tracking patient referrals
  const handlePatientReferral = () => {
    trackEvent('physician_patient_referral', {
      source: 'physicians_page',
      section: 'hero',
      language
    });
  };

  const cmoBio = content.cmoBio;

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{content.meta.title}</title>
        <meta name="description" content={content.meta.description} />
        <meta name="keywords" content="at-home heart monitoring, 3-day ECG, Holter alternative, remote diagnostics, cardiac monitoring, ECG monitoring for physicians" />
        <link rel="canonical" href={`https://myant-health.com${language === 'en' ? '/physicians' : language === 'de' ? '/de/arzt' : '/fr/medecin'}`} />
        <meta property="og:title" content={content.meta.title} />
        <meta property="og:description" content={content.meta.description} />
        <meta property="og:type" content="website" />
        {/* Multilingual support */}
        <link rel="alternate" hrefLang="en" href="https://myant-health.com/physicians" />
        <link rel="alternate" hrefLang="de" href="https://myant-health.com/de/arzt" />
        <link rel="alternate" hrefLang="fr" href="https://myant-health.com/fr/medecin" />
        <link rel="alternate" hrefLang="x-default" href="https://myant-health.com/physicians" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <ProgressiveSection className="pt-32 pb-20 bg-gradient-to-br from-primary/8 to-medical-teal/5 relative overflow-hidden">
          {/* ECG line background decoration */}
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 1200 600" preserveAspectRatio="none">
              <path d="M0,100 L100,100 L150,20 L200,180 L250,100 L300,100 L350,100 L400,100 L450,20 L500,180 L550,100 L600,100 L650,100 L700,100 L750,20 L800,180 L850,100 L900,100 L950,100 L1000,100 L1050,20 L1100,180 L1150,100 L1200,100" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="1200"
                    strokeDashoffset="1200"
                    className="text-medical-teal">
                <animate attributeName="stroke-dashoffset" 
                         from="1200" 
                         to="0" 
                         dur="3s" 
                         begin="0s" 
                         fill="freeze" />
              </path>
            </svg>
          </div>
          
          <div className="container-custom relative z-10">
            <ContentSection
              title={content.hero.title.replace(/<br\s*\/?>/gi, ' ')}
              subtitle={content.hero.subtitle}
              description={`${content.hero.description} ${citations[0].text}`}
              primaryCta={{
                text: content.hero.primaryCta,
                href: "https://meetings-eu1.hubspot.com/peter-wood"
              }}
              secondaryCta={{
                text: content.hero.tertiaryCta,
                href: "https://myant-care360.com"
              }}
              image={{
                src: "/assets/images/32de0ca4-a556-4e60-bfaf-fc48bf4bd27c.png",
                alt: "Doctor consulting with patient about SKIIN at-home cardiac monitoring solution",
                position: "right"
              }}
            />
          </div>
        </ProgressiveSection>

        {/* Benefits Section */}
        <ProgressiveSection className="py-20 md:py-30">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="text-primary font-medium">For Medical Professionals</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
                {content.benefits.title}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {content.benefits.subtitle}
                <Citation id="2" text={citations[1].text} />
              </p>
            </div>

            <FeatureGrid
              features={benefits}
              variant="cards"
              columns={2}
            />
          </div>
        </ProgressiveSection>

        {/* About Section */}
        <ProgressiveSection className="py-20 md:py-30 bg-background-secondary">
          <div className="container-custom">
            <ContentSection
              badge="Who We Are"
              title={content.about.title}
              description={`${content.about.description1}\n\n${content.about.description2}`}
              image={{
                src: "/assets/images/40ba1015-dfac-4b19-9548-8f3319ffe098.png",
                alt: "SKIIN Smart Garment with embedded sensors for continuous cardiac monitoring",
                position: "left"
              }}
            />
            <div className="mt-12 max-w-2xl mx-auto">
              <TrustBadges />
              <div className="mt-8">
                <DoctorQuote 
                  quote={cmoBio.quote}
                  name={cmoBio.name}
                  title={cmoBio.title}
                  image="/assets/images/72de88b6-6f7b-4e58-abb2-dc50a762a353.png" 
                />
              </div>
            </div>
          </div>
        </ProgressiveSection>

        {/* MVCP Section */}
        <MvcpSection />

        {/* How It Works */}
        <ProgressiveSection className="py-20 md:py-30">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="text-primary font-medium">Simple Process</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
                {content.howItWorks.title}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {content.howItWorks.subtitle}
                <Citation id="3" text={citations[2].text} />
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {steps.map((step, index) => (
                <div 
                  key={index} 
                  className="relative group opacity-0 animate-in fade-in slide-in-from-bottom-8 duration-700"
                  style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="mb-6 h-20 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
                    <span className="text-4xl font-bold text-primary">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                  
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 -right-4 w-8 h-2 bg-primary/20"></div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <Download className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{content.howItWorks.sampleReport.title}</h4>
                    <p className="text-muted-foreground">{content.howItWorks.sampleReport.description}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary/10 transition-all duration-300"
                  onClick={() => {
                    trackEvent('sample_report_download', {
                      source: 'physicians_page',
                      language
                    });
                  }}
                >
                  {content.howItWorks.sampleReport.buttonText}
                </Button>
              </div>
            </div>
          </div>
        </ProgressiveSection>

        {/* Testimonials */}
        <ProgressiveSection className="py-20 md:py-30 bg-gradient-to-b from-background to-background-accent">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="text-primary font-medium">Testimonials</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
                {content.testimonials.title}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {content.testimonials.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="opacity-0 animate-in fade-in slide-in-from-bottom-8 duration-700"
                  style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
                >
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
          </div>
        </ProgressiveSection>

        {/* CTA Section */}
        <ProgressiveSection className="py-20 md:py-30 bg-primary text-primary-foreground" dark>
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {content.cta.title}
              </h2>
              <p className="text-xl mb-8 opacity-90">
                {content.cta.description}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <ConversionButton 
                  size="lg" 
                  className="bg-background text-primary hover:bg-background/90"
                  eventName="try_skiin_free_click"
                  eventParams={{source: "physician_page", section: "footer_cta", language}}
                  conversionId="AW-XXXXXXXXXX"
                  conversionLabel="physician_trial_request"
                  href="https://meetings-eu1.hubspot.com/peter-wood"
                  external={true}
                >
                  {content.cta.primaryButton} <ArrowRight className="ml-2 h-5 w-5" />
                </ConversionButton>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={() => {
                    trackEvent('contact_medical_team', {
                      source: 'physicians_page',
                      section: 'footer_cta',
                      language
                    });
                  }}
                >
                  {content.cta.secondaryButton}
                </Button>
                
                <ConversionButton 
                  size="lg" 
                  variant="outline" 
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                  eventName="refer_patient_holter_footer"
                  eventParams={{source: "physician_page", section: "footer_cta", language}}
                  href="https://myant-care360.com"
                  external={true}
                >
                  {content.cta.tertiaryButton}
                </ConversionButton>
              </div>
              <p className="text-sm mt-6 opacity-80">
                {content.cta.note}
              </p>
            </div>
          </div>
        </ProgressiveSection>
        
        {/* Regulatory Footer */}
        <div className="bg-background py-6 border-t border-border">
          <div className="container-custom">
            <div className="text-xs text-muted-foreground">
              <p>{content.footer.copyright}</p>
              <p className="mt-1">{content.footer.disclaimer}</p>
              <p className="mt-1">
                <span className="font-medium">References: </span>
                {citations.map((citation, index) => (
                  <span key={index} className="mr-4">[{citation.id}] {citation.text}</span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Physicians;
