
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HomePageTabs from '@/components/home/HomePageTabs';
import HeroSection from '@/components/home/HeroSection';
import ProblemSolutionSection from '@/components/home/ProblemSolutionSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import ComparisonSection from '@/components/home/ComparisonSection';
import InsuranceSection from '@/components/home/InsuranceSection';
import CtaSection from '@/components/home/CtaSection';
import FaqSection from '@/components/home/FaqSection';
import ContactSection from '@/components/home/ContactSection';
import { SectionDivider, SectionDividerPresets } from '@/components/ui/section-divider';

/**
 * Home page composed of multiple marketing sections. Each section uses the
 * translation hooks so text is rendered in the currently selected language.
 */
const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HomePageTabs />
      <main className="flex-grow">
        <HeroSection />
        
        <SectionDivider variant="wave" color="var(--secondary)" />
        <ProblemSolutionSection />
        
        <SectionDivider variant="gradient" />
        <FeaturesSection />
        
        <SectionDivider variant="angle" color="var(--muted)" />
        <HowItWorksSection />
        
        <SectionDivider variant="curve" color="var(--secondary)" />
        <TestimonialsSection />
        
        <SectionDivider variant="dots" />
        <ComparisonSection />
        
        <SectionDivider variant="geometric" color="var(--muted)" />
        <InsuranceSection />
        
        <SectionDivider variant="wave" color="var(--primary)" flipY />
        <CtaSection />
        
        <FaqSection />
        
        <SectionDivider variant="gradient" />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
