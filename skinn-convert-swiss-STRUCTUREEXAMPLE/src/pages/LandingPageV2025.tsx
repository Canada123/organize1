import React, { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { HeroV2025 } from '@/components/landing/HeroV2025';
import { FullScreenQuote } from '@/components/landing/FullScreenQuote';
import { SwissHealthInsurance } from '@/components/landing/SwissHealthInsurance';
import { InsuranceCoverageFlow } from '@/components/landing/InsuranceCoverageFlow';
import { ComfortSection } from '@/components/landing/ComfortSection';
import { TestimonialsV2 } from '@/components/landing/TestimonialsV2';
import { TestimonialScrollCarousel } from '@/components/ui/testimonial-scroll-carousel';
import { ClinicalEvidenceViz } from '@/components/landing/ClinicalEvidenceViz';
import { ClinicalEvidenceStats } from '@/components/landing/ClinicalEvidenceStats';
import { ComparisonSection } from '@/components/landing/ComparisonSection';
import { HowSKIINCompares } from '@/components/landing/HowSKIINCompares';
import { TimelineProcess } from '@/components/landing/TimelineProcess';
import { MedicalAdvisors } from '@/components/home/MedicalAdvisors';
import FullScreenVideo from '@/components/ui/FullScreenVideo';
import { ProcessFlow } from '@/components/home/ProcessFlow';
import { HowSKIINWorks } from '@/components/landing/HowSKIINWorks';
import { HowSKIINWorksV2 } from '@/components/landing/HowSKIINWorksV2';
import { JourneyTimeline } from '@/components/landing/JourneyTimeline';
import { useTheme } from '@/contexts/ThemeContext';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { InteractiveBenefitCard } from '@/components/ui/InteractiveBenefitCard';
import { SmartButton } from '@/components/ui/SmartButton';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { ScrollToTop } from '@/components/ui/ScrollToTop';

const LandingPageV2025: React.FC = () => {
  const { setTheme } = useTheme();
  const [showNavbar, setShowNavbar] = React.useState(false);

  useEffect(() => {
    // Use the S&W Design theme for consistent styling
    setTheme('sw-design');
    
    // Show navbar after 1.5 seconds (same as hero rest content)
    const timer = setTimeout(() => {
      setShowNavbar(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [setTheme]);

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollProgress />
      <ScrollToTop />
      <div style={{ opacity: showNavbar ? 1 : 0, transition: 'opacity 0.8s ease-out' }}>
        <Navbar />
      </div>
      <main className="flex-grow">
        {/* Hero Section with Two-Line Headline */}
        <HeroV2025 />
        
        {/* Full Screen Quote with Mother-Daughter Image */}
        <FullScreenQuote />
        
        {/* Comfort Section */}
        <AnimatedSection animation="fadeIn" delay={0.2}>
          <ComfortSection />
        </AnimatedSection>

        {/* Swiss Health Insurance Coverage */}
        <AnimatedSection animation="fadeUp" delay={0.2}>
          <SwissHealthInsurance />
        </AnimatedSection>

        {/* Benefits Summary Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <AnimatedSection animation="fadeUp" delay={0.1}>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Why Swiss Families Choose SKIIN
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Medical-grade heart monitoring that fits seamlessly into your daily life
                </p>
              </div>
            </AnimatedSection>
          
          {/* Quick benefit cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <InteractiveBenefitCard
              icon="10"
              title="Days of Monitoring"
              description="Continuous tracking catches what 24-hour tests miss"
              delay={0.3}
            />
            <InteractiveBenefitCard
              icon="48h"
              title="Fast Results"
              description="Get your comprehensive report in just 2 days"
              delay={0.4}
            />
            <InteractiveBenefitCard
              icon="0.-"
              title="Fully Covered"
              description="Swiss insurance covers 100% of costs"
              delay={0.5}
            />
          </div>
        </div>
        </section>

        {/* Full Screen Video Divider */}
        <FullScreenVideo
          src="/assets/videos/Myant-EU-video-70-percent-of-arrythmia-are-silent.mp4"
          thumbnail="/assets/images/25b8354d-c321-4439-8a41-5dcafe49836e.png"
          title="Silent Arrhythmias"
        />


        {/* Clinical Evidence - New Stats Design */}
        <AnimatedSection animation="fadeUp" delay={0.2}>
          <ClinicalEvidenceStats />
        </AnimatedSection>

        {/* Medical Advisors - Trusted by Leading Cardiologists */}
        <section className="py-20 bg-muted/30">
          <AnimatedSection animation="fadeUp" delay={0.2} stagger>
            <MedicalAdvisors />
          </AnimatedSection>
        </section>

        {/* Testimonials - Horizontal Scroll Carousel */}
        <TestimonialScrollCarousel className="mt-20" />

        {/* Full Screen Video - Before Testimonials */}
        <FullScreenVideo
          src="/assets/videos/Myant-EU-cardiac-health-assesement-at-home.mp4"
          thumbnail="/assets/images/40ba1015-dfac-4b19-9548-8f3319ffe098.png"
          title="Heart Assessment at Home"
        />

        {/* How SKIIN Works - New 5-Step Visual Style */}
        <AnimatedSection animation="fadeUp" delay={0.2}>
          <HowSKIINWorksV2 />
        </AnimatedSection>

        {/* Comparison Section with Purple Background */}
        <AnimatedSection animation="fadeIn" delay={0.2}>
          <HowSKIINCompares />
        </AnimatedSection>

        {/* Timeline Process */}
        <AnimatedSection animation="fadeUp" delay={0.2}>
          <TimelineProcess />
        </AnimatedSection>

        {/* Journey Timeline - Clear Path from Start to Finish */}
        <AnimatedSection animation="scale" delay={0.3}>
          <JourneyTimeline />
        </AnimatedSection>

        {/* Final CTA Section */}
        <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <AnimatedSection animation="fadeUp" delay={0.2}>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Take Control of Your Heart Health Today
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of Swiss families who've discovered peace of mind with SKIIN
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <SmartButton
                  variant="primary"
                  size="lg"
                  className="shadow-lg"
                >
                  Start Your Free Heart Check
                </SmartButton>
                <SmartButton
                  variant="outline"
                  size="lg"
                >
                  Talk to Your Doctor
                </SmartButton>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                No commitment required • Results in 48 hours • 100% insurance coverage
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPageV2025;