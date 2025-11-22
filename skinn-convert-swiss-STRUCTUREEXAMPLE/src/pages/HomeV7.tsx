import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HomePageTabs from '@/components/home/HomePageTabs';
import HeroSection from '@/components/home/HeroSection';
import { StatisticsShowcase } from '@/components/home/StatisticsShowcase';
import ProblemSolutionSection from '@/components/home/ProblemSolutionSection';
import { ProductSection } from '@/components/home/ProductSection';
import { NumbersSection } from '@/components/home/NumbersSection';
import { ClinicallyProvenTechSection } from '@/components/home/ClinicallyProvenTechSection';
import { Care360Technology } from '@/components/home/Care360Technology';
import { SKIINAdvantage } from '@/components/home/SKIINAdvantage';
import { ProcessFlow } from '@/components/home/ProcessFlow';
import { ComfortShowcase } from '@/components/home/ComfortShowcase';
import InsuranceSection from '@/components/home/InsuranceSection';
import CtaSection from '@/components/home/CtaSection';
import FaqSection from '@/components/home/FaqSection';
import ContactSection from '@/components/home/ContactSection';
import { SectionDivider, SectionDividerPresets } from '@/components/ui/section-divider';

/**
 * Version 7.2 homepage with all the new components
 * This page implements the comprehensive v7.2 copy and design updates
 */
const HomeV7 = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HomePageTabs />
      <main className="flex-grow">
        {/* Hero with A/B variants and emotional messaging */}
        <HeroSection />
        
        <SectionDivider variant="wave" color="var(--secondary)" />
        {/* Statistics: 70%, 20-30%, 66% vs 9% */}
        <StatisticsShowcase />
        
        <SectionDivider variant="gradient" />
        {/* Silent Triad: ECG + ABPM + Sleep */}
        <ProblemSolutionSection />
        
        <SectionDivider variant="angle" color="var(--muted)" />
        {/* 8 benefit cards in 2x4 grid */}
        <ProductSection />
        
        <SectionDivider variant="wave" color="var(--secondary)" flipY />
        {/* Consolidated SKIIN Advantage section */}
        <SKIINAdvantage />
        
        <SectionDivider variant="dots" />
        {/* 4 key metrics */}
        <NumbersSection />
        
        <SectionDivider variant="geometric" color="var(--muted)" />
        {/* Clinical evidence and trust markers */}
        <ClinicallyProvenTechSection />
        
        <SectionDivider variant="gradient" />
        {/* Enhanced Care360 Technology - Home-based Holter */}
        <Care360Technology />
        
        <SectionDivider variant="angle" color="var(--primary)" />
        {/* 5-step process with AI & cardiologist mention */}
        <ProcessFlow />
        
        <SectionDivider variant="curve" color="var(--muted)" flipY />
        {/* Insurance coverage information */}
        <InsuranceSection />
        
        <SectionDivider variant="wave" color="var(--primary)" flipY />
        {/* Call-to-action section */}
        <CtaSection />
        
        <FaqSection />
        
        <SectionDivider variant="gradient" />
        {/* Contact form */}
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomeV7;