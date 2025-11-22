import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HomePageTabs from '@/components/home/HomePageTabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, 
  Shield, 
  Monitor, 
  Award, 
  CheckCircle, 
  Clock, 
  Smartphone,
  Activity,
  Users,
  Star,
  ArrowRight,
  Play
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useThemeContent } from '@/hooks/useThemeContent';
import { useTheme } from '@/contexts/ThemeContext';
import VideoSection from '@/components/home/VideoSection';
import { ProcessFlow } from '@/components/home/ProcessFlow';
// import MvcpSection from '@/components/home/MvcpSection'; // Removed from homepage per v7.2 requirements
import { EnhancedComparison } from '@/components/home/EnhancedComparison';
import { StatisticsShowcase } from '@/components/home/StatisticsShowcase';
import { ProgressiveSection } from '@/components/ui/progressive-section';
import { ProductSection } from '@/components/home/ProductSection';
import { NumbersSection } from '@/components/home/NumbersSection';
import { TechCarousel } from '@/components/home/TechCarousel';
import { MedicalAdvisors } from '@/components/home/MedicalAdvisors';
import { EnhancedTestimonials } from '@/components/home/EnhancedTestimonials';
import { EnhancedFAQ } from '@/components/home/EnhancedFAQ';
import { ComfortShowcase } from '@/components/home/ComfortShowcase';
import { MVCPPreview } from '@/components/home/MVCPPreview';
import { RiskCardsSection } from '@/components/home/RiskCardsSection';
import { InsuranceCoverageSection } from '@/components/home/InsuranceCoverageSection';
import { PricingSection } from '@/components/home/PricingSection';
import { TestimonialsSlider } from '@/components/home/TestimonialsSlider';
import { CEOQuote } from '@/components/home/CEOQuote';
import { Care360Vision } from '@/components/home/Care360Vision';
import FullScreenVideo from '@/components/ui/FullScreenVideo';
import { SKIINAdvantage } from '@/components/home/SKIINAdvantage';
import { Care360Technology } from '@/components/home/Care360Technology';

/**
 * Enhanced Home-2 page utilizing marketing assets and comprehensive content
 */
const Home2 = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setTheme } = useTheme();
  const tHome = useTranslation('home');
  const t = useTranslation('home2');
  const themeContent = useThemeContent();
  const lang = 'en'; // Get from context or route params as needed
  
  // Copy variant support
  const [copyVariant, setCopyVariant] = useState<'default' | 'original'>('default');
  const [variant, setVariant] = useState<'A' | 'B' | 'C'>('A'); // Legacy A/B testing support
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Use the Original theme for classic medical-blue styling
    setTheme('original');
  }, [setTheme]);
  
  useEffect(() => {
    // Ensure content is loaded
    if (tHome && t) {
      setIsLoading(false);
    }
  }, [tHome, t]);
  
  useEffect(() => {
    // Check URL parameter for copy variant
    const urlCopyVariant = searchParams.get('copy');
    if (urlCopyVariant === 'original') {
      setCopyVariant('original');
    }
    
    // Check URL parameter for legacy A/B variant
    const urlVariant = searchParams.get('variant')?.toUpperCase() as 'A' | 'B' | 'C';
    if (urlVariant && ['A', 'B', 'C'].includes(urlVariant)) {
      setVariant(urlVariant);
    }
  }, [searchParams]);
  
  // Get hero content based on copy variant
  const heroVariant = tHome?.hero?.variants?.[copyVariant] || tHome?.hero?.variants?.default;
  
  // Legacy variant support for backward compatibility
  const variantKey = `variant${variant}` as 'variantA' | 'variantB' | 'variantC';
  const heroContent = tHome?.hero?.[variantKey] || tHome?.hero?.variantA;

  // Show loading state if translations not ready
  if (isLoading || !tHome || !t) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show variant selector if 'test' parameter is in URL
  const showVariantSelector = searchParams.get('test') === 'true';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HomePageTabs />
      
      {/* Variant Selector for Testing (hidden by default) */}
      {showVariantSelector && (
        <div className="fixed top-40 right-4 z-50 bg-background border rounded-lg shadow-lg p-4 space-y-2">
          <p className="text-sm font-semibold mb-2">Copy Variant:</p>
          <div className="space-y-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="copyVariant"
                value="default"
                checked={copyVariant === 'default'}
                onChange={() => setCopyVariant('default')}
                className="w-4 h-4"
              />
              <span className="text-sm">Default (Silent Issues)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="copyVariant"
                value="original"
                checked={copyVariant === 'original'}
                onChange={() => setCopyVariant('original')}
                className="w-4 h-4"
              />
              <span className="text-sm">Original (Live Younger)</span>
            </label>
          </div>
        </div>
      )}
      
      <main className="flex-grow pt-32">
        {/* Hero Section - Dual Split Layout */}
        <section className="relative min-h-[80vh] lg:min-h-[90vh] overflow-hidden bg-gradient-to-b from-background to-muted/5" data-testid="hero-section">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full py-8 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12 h-full">
              
              {/* Mobile: Image First (stacked) */}
              <div className="lg:hidden relative h-[50vh] -mx-4 sm:-mx-6">
                <img
                  src="/assets/images/Father-daughter.png"
                  alt="Father and daughter sharing a warm moment outdoors"
                  className="w-full h-full object-cover object-[center_30%]"
                  loading="eager"
                />
                {/* Mobile gradient overlay for bottom text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                
                {/* Mobile Product Badge Overlay */}
                <div className="absolute bottom-4 right-4 w-24">
                  <Card className="p-2 backdrop-blur-md bg-background/90 shadow-xl border-0">
                    <CardContent className="p-0">
                      <img
                        src="/assets/images/woman-wear-skiin.png"
                        alt="SKIIN heart monitoring device - comfortable wearable technology"
                        className="w-full"
                        loading="lazy"
                      />
                    </CardContent>
                  </Card>
                </div>
                
              </div>

              {/* Left Column: Content */}
              <div className="flex flex-col justify-center">
                <div className="rounded-2xl border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm p-6 lg:p-8 space-y-6 lg:space-y-8 text-center lg:text-left animate-fadeIn">
                  {/* Trust Badge */}
                  <div className="animate-fadeInUp animation-delay-100">
                  <Badge 
                    variant="outline" 
                    className="text-xs sm:text-sm font-medium px-3 py-1 border-accent/30 text-accent bg-accent/5 backdrop-blur-sm"
                    data-testid="hero-badge"
                  >
                    {heroVariant?.badge || "Certified Medical Device • Myant Technology"}
                  </Badge>
                </div>

                {/* Headlines with Enhanced Hierarchy */}
                <div className="space-y-4">
                  <h1 
                    className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-foreground leading-tight animate-fadeInUp animation-delay-200"
                    data-testid="hero-headline"
                    style={{ lineHeight: '1.1' }}
                  >
                    {heroVariant?.headline || "Live Younger, Longer."}
                  </h1>
                  
                  <p 
                    className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold animate-fadeInUp animation-delay-300 bg-gradient-to-r from-accent to-accent-foreground bg-clip-text text-transparent"
                    data-testid="hero-subheadline"
                  >
                    {heroVariant?.subheadline || "Screen Smarter, from Home"}
                  </p>
                  
                  {heroVariant?.aboveCta && (
                    <p 
                      className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed mt-8 animate-fadeInUp animation-delay-400"
                      data-testid="hero-emotional-subheadline"
                    >
                      {heroVariant.aboveCta}
                    </p>
                  )}
                </div>

                {/* CTAs */}
                <div className="space-y-4 pt-4 animate-fadeInUp animation-delay-500">
                  {/* Eligibility Text */}
                  {heroVariant?.eligibilityText && (
                    <p className="text-sm lg:text-base text-muted-foreground text-center lg:text-left">
                      {heroVariant.eligibilityText}
                    </p>
                  )}
                  
                  {/* Primary CTA */}
                  <div className="flex justify-center lg:justify-start">
                    <Button 
                      size="lg" 
                      variant="default"
                      onClick={() => navigate(`/${lang}/eligibility`)}
                      className="w-full sm:w-auto text-base lg:text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 active:scale-100"
                      data-testid="hero-cta-primary"
                      aria-label="Start your free heart health eligibility check"
                    >
                      {heroVariant?.ctaPrimary || "Start Your Free Heart Check"}
                    </Button>
                  </div>
                  
                  {/* Secondary CTA - Separated on its own line */}
                  <div className="flex justify-center lg:justify-start">
                    <Link 
                      to={`/${lang}/how-it-works/faq`}
                      className="text-sm lg:text-base text-muted-foreground hover:text-accent transition-all duration-300 inline-flex items-center gap-2 font-medium group"
                      data-testid="hero-cta-secondary"
                    >
                      <span>{heroVariant?.ctaSecondary || "Questions? Read our FAQ"}</span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </Link>
                  </div>
                </div>
                </div>
              </div>

              {/* Right Column: Visual (Desktop Only) */}
              <div className="hidden lg:flex relative items-center justify-center">
                <div className="relative w-full h-full max-h-[800px]">
                  {/* Main Image */}
                  <img
                    src="/assets/images/Father-daughter.png"
                    alt="Father and daughter sharing a warm moment outdoors"
                    className="w-full h-full object-cover object-center rounded-2xl shadow-2xl"
                    loading="eager"
                  />
                  
                  {/* Product Badge Overlay - Bottom Right */}
                  <div className="absolute bottom-8 right-8 w-40 transform hover:scale-105 transition-all duration-300 animate-fadeIn animation-delay-600">
                    <Card className="p-4 backdrop-blur-md bg-background/95 shadow-2xl border-0 hover:shadow-3xl transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-0 space-y-2">
                        <img
                          src="/assets/images/woman-wear-skiin.png"
                          alt="Woman wearing SKIIN - comfortable heart monitoring device"
                          className="w-full"
                          loading="lazy"
                        />
                        <div className="text-center">
                          <p className="text-xs font-medium text-muted-foreground">10-Day Monitoring</p>
                          <p className="text-sm font-bold text-accent">Gold Standard</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  

                </div>
              </div>
            </div>
          </div>

          {/* Trust Bar - Below Hero */}
          <div className="border-t bg-muted/30 backdrop-blur-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-wrap justify-center items-center gap-4 lg:gap-8 text-xs sm:text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Badge variant="outline" className="h-5">MDR</Badge>
                  <span>Class IIa Certified</span>
                </span>
                <Separator orientation="vertical" className="h-4 hidden sm:block" />
                <span>Swissmedic Registered</span>
                <Separator orientation="vertical" className="h-4 hidden sm:block" />
                <span>ISO 13485 Quality</span>
                <Separator orientation="vertical" className="h-4 hidden lg:block" />
                <span>Swiss Data Protection</span>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {tHome.statistics.title}
              </h2>
              <p className="text-xl text-muted-foreground">
                {tHome.statistics.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {tHome.statistics.cards.map((stat, index) => {
                // Map visual assets to statistics
                const images = [
                  "/assets/images/25b8354d-c321-4439-8a41-5dcafe49836e.png", // 70%
                  "/assets/images/b74365b1-b855-4522-a9d7-f05b3e2ee15e.png", // 20-30%
                  "/assets/images/4ad65a99-4268-46c4-986f-d04c9ac055f4.png"  // 66% vs 9%
                ];
                
                return (
                  <Card key={index} className="text-center p-8 hover:shadow-lg transition-all hover:-translate-y-2 will-change-transform">
                    <CardContent className="space-y-4">
                      <div className="relative mb-4">
                        <img
                          src={images[index]}
                          alt={stat.label}
                          className="w-full h-auto rounded-xl"
                          loading="lazy"
                        />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-primary">{stat.value}</h3>
                        <p className="text-base text-foreground font-medium">{stat.label}</p>
                        <p className="text-sm text-muted-foreground italic">{stat.footnote}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <div className="text-center mt-8">
              <p className="text-sm text-muted-foreground">{tHome.statistics.footnote}</p>
              <Button variant="link" className="mt-2" onClick={() => navigate('/how-it-works/evidence')}>
                {tHome.statistics.evidenceLink} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Video Education Section with Full Screen Experience */}
        <FullScreenVideo
          src="/assets/videos/Myant-EU-video-70-percent-of-arrythmia-are-silent.mp4"
          thumbnail="/assets/images/25b8354d-c321-4439-8a41-5dcafe49836e.png"
          title="70% of Arrhythmias are Silent"
        />
        
        {/* Removed side-by-side VideoSection per requirements */}

        {/* Statistics Showcase */}
        <div className="bg-background border-y border-border/20">
          <StatisticsShowcase />
        </div>

        {/* Medical Advisors Showcase - Moved Higher */}
        <div className="bg-gradient-to-b from-muted/30 to-muted/10">
          <MedicalAdvisors />
        </div>

        {/* SKIIN Advantage Section - Replacing redundant product sections */}
        <div className="bg-background">
          <SKIINAdvantage />
        </div>

        {/* Numbers Section - Key Metrics */}
        <div className="bg-gradient-to-b from-background to-muted/20 border-y border-border/10">
          <NumbersSection />
        </div>

        {/* Clinical Evidence Section */}
        <section className="py-20 bg-muted/40">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {tHome.clinicallyProvenTech.title}
              </h2>
              <p className="text-xl text-muted-foreground">
                {tHome.clinicallyProvenTech.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {tHome.clinicallyProvenTech.trustMarkers.map((item, index) => (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-all hover:-translate-y-2 will-change-transform">
                  <CardContent className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button onClick={() => navigate('/how-it-works/evidence')}>
                {tHome.clinicallyProvenTech.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Comfort Showcase - Commented out as it's now part of SKIINAdvantage */}
        {/* <div className="bg-background">
          <ComfortShowcase />
        </div> */}


        {/* Care360 Technology Section - Enhanced */}
        <div className="bg-muted/50">
          <Care360Technology />
        </div>

        {/* Full Screen How It Works Video */}
        <FullScreenVideo
          src="/assets/videos/Myant-EU-cardiac-health-assesement-at-home.mp4"
          thumbnail="/assets/images/40ba1015-dfac-4b19-9548-8f3319ffe098.png"
          title="Cardiac Health Assessment at Home"
        />
        
        {/* Enhanced 5-Step Process Flow */}
        <div className="bg-muted/30">
          <ProcessFlow />
        </div>

        {/* Tech Carousel - Commented out as technology is covered in Care360Technology */}
        {/* <div className="bg-background">
          <TechCarousel />
        </div> */}

        {/* Enhanced Comparison */}
        <div className="bg-muted/20">
          <EnhancedComparison />
        </div>

        {/* Risk Cards Section - v7.2 Requirement */}
        <div className="bg-background">
          <RiskCardsSection />
        </div>

        {/* Insurance Coverage Section - v7.2 Split */}
        <div className="bg-muted/30">
          <InsuranceCoverageSection />
        </div>

        {/* Pricing Section - v7.2 Split */}
        <div className="bg-background">
          <PricingSection />
        </div>

        {/* MVCP Preview Section - Removed per compliance requirements */}
        {/* <MVCPPreview /> */}

        {/* Enhanced Testimonials Slider */}
        <div className="bg-muted/20">
          <TestimonialsSlider />
        </div>

        {/* Enhanced FAQ Section */}
        <div className="bg-background">
          <EnhancedFAQ />
        </div>

        {/* Full Screen Future Vision Video */}
        <FullScreenVideo
          src="/assets/videos/Myant-EU-cardiac-health-assesement-at-home.mp4"
          thumbnail="/assets/images/6e47298b-0a4d-4e21-92ed-0b25c0e34c4c.png"
          title="The Future of Heart Health"
        />

        {/* Care360 Vision - Coming Soon Features */}
        <div className="bg-background">
          <Care360Vision />
        </div>

        {/* CEO Quote */}
        <section className="py-12 md:py-16 bg-muted/20">
          <div className="container-custom">
            <CEOQuote />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-3xl lg:text-4xl font-bold">
                {t.cta.title}
              </h2>
              <p className="text-xl opacity-90">
                {t.cta.subtitle}
              </p>
              <p className="text-lg opacity-80">
                {t.cta.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="px-8 py-4 text-lg"
                  onClick={() => navigate('/about/contact')}
                  aria-label="Contact us for more information"
                >
                  {tHome.hero.cta.primary}
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8 py-4 text-lg"
                  onClick={() => navigate('/how-it-works/faq')}
                  aria-label="View frequently asked questions"
                >
                  {tHome.hero.cta.tertiary}
                </Button>
              </div>
              
              {/* Trust indicators */}
              <div className="mt-12 flex flex-wrap justify-center items-center gap-8 opacity-80">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-sm">94% Compliance Rate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span className="text-sm">500+ Patients Benefited</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm">MDR Class IIa Certified</span>
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

export default Home2;