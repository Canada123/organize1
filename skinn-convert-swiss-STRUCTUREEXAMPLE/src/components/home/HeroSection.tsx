
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useRouteTranslations } from "@/utils/routeTranslations";
import { Heart, Shield, CheckCircle, ArrowRight } from "lucide-react";

/**
 * HeroSection component - Phase 2 Landing Page Redesign
 * Implements v7.2 copy with cleaner, modern design inspired by health tech leaders
 */
const HeroSection = () => {
  const { language } = useLanguage();
  const translations = useTranslation('home');
  const { getRoutePath } = useRouteTranslations();
  
  // Use v7.2 default variant copy
  const heroContent = translations.hero.variants?.default || {
    badge: "Your health matters — to more than just you",
    headline: "Most Heart Issues are silent",
    subheadline: "Screen Smarter, Live Younger, Longer",
    aboveCta: "Take 5 minutes to check your eligibility for our reinvented heart screening experience, from home.",
    ctaPrimary: "Start your free heart check",
    ctaSecondary: "Questions? Read our FAQ →"
  };

  return (
    <div className="relative min-h-[85vh] md:min-h-[90vh] bg-background overflow-hidden">
      {/* Dual-split hero layout inspired by modern health tech */}
      <div className="container-custom relative z-10 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full min-h-[85vh] md:min-h-[90vh]">
          
          {/* Left Column - Content */}
          <div className="flex flex-col justify-center py-16 md:py-24 lg:pr-16">
            <div className="space-y-6 max-w-xl">
              {/* Emotional Badge */}
              <Badge variant="outline" className="bg-white/90 backdrop-blur-sm border-medical-teal/20 text-medical-teal px-5 py-2.5 text-sm font-medium">
                {heroContent.badge}
              </Badge>

              {/* Headlines with improved typography */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-foreground">
                  {heroContent.headline}
                </h1>
                <p className="text-xl md:text-2xl font-medium text-medical-teal">
                  {heroContent.subheadline}
                </p>
              </div>

              {/* Above CTA text */}
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {heroContent.aboveCta}
              </p>

              {/* Simplified CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to={getRoutePath('/assessment', language)}>
                  <Button 
                    size="lg" 
                    variant="medical" 
                    className="group px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
                  >
                    <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    {heroContent.ctaPrimary}
                  </Button>
                </Link>
                
                <Link 
                  to={getRoutePath('/how-it-works/faq', language)}
                  className="text-trust-blue hover:text-trust-blue-dark font-medium underline-offset-4 hover:underline inline-flex items-center gap-1.5 self-center transition-colors"
                >
                  {heroContent.ctaSecondary}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Value Propositions - Refined */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-muted/20">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-medical-teal flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    {translations.hero.valueProps.comfort}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-medical-teal flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    {translations.hero.valueProps.insurance}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-medical-teal flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    {translations.hero.valueProps.lifestyle}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual with Product Overlay */}
          <div className="relative flex items-center justify-center lg:justify-end">
            {/* Background Image */}
            <div className="absolute inset-0 lg:right-[-50%] lg:left-[-20%]">
              <img
                src="/assets/images/Father-daughter.png"
                alt="Father and daughter embracing - protect what matters most"
                className="w-full h-full object-cover object-center"
              />
              {/* Subtle gradient overlay for better text contrast on mobile */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent lg:bg-gradient-to-l lg:from-background/60 lg:via-transparent lg:to-transparent"></div>
            </div>

            {/* Product Overlay - Positioned elegantly */}
            <div className="relative z-10 mt-8 lg:mt-0 lg:mr-16">
              <div className="relative animate-float">
                <img
                  src="/assets/images/woman-wear-skiin.png"
                  alt="Woman wearing SKIIN heart monitoring device"
                  className="w-full max-w-[320px] lg:max-w-[400px] h-auto drop-shadow-2xl"
                />
                
                {/* Single elegant stats card */}
                <Card className="absolute -bottom-4 -right-4 lg:-right-8 bg-white/95 backdrop-blur-md shadow-xl border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-3xl font-bold text-medical-teal">{translations.hero.statsCards.monitoring.value}</div>
                        <div className="text-sm text-muted-foreground">Days of Continuous</div>
                        <div className="text-sm text-muted-foreground">Heart Monitoring</div>
                      </div>
                      <div className="w-px h-12 bg-muted/30"></div>
                      <div>
                        <div className="text-3xl font-bold text-trust-blue">{translations.hero.statsCards.detection.value}</div>
                        <div className="text-sm text-muted-foreground">Better Detection</div>
                        <div className="text-sm text-muted-foreground">Than 24hr Tests</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simplified Trust Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/5 backdrop-blur-sm border-t border-white/10">
        <div className="container-custom py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              <strong className="text-medical-teal">{translations.hero.socialProof.patients}</strong>
              {' '}{translations.hero.socialProof.patientsText}
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-trust-blue" />
                MDR Class IIa Certified
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-medical-teal" />
                {translations.hero.socialProof.compliance} {translations.hero.socialProof.complianceText}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;