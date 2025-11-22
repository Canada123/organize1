import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Users, Award } from 'lucide-react';
import { ProgressiveSection } from '@/components/ui/progressive-section';
import { ContentSection } from '@/components/ui/content-section';
import { FeatureGrid } from '@/components/ui/feature-grid';
import { SwissHeritage } from '@/components/about/SwissHeritage';
import { LeadershipShowcase } from '@/components/about/LeadershipShowcase';
import { useTranslation } from '@/hooks/useTranslation';

const Company = () => {
  const t = useTranslation('about');
  const qualityFeatures = [
    {
      icon: Shield,
      title: t.company.qualityCompliance.features.medicalDevice.title,
      description: t.company.qualityCompliance.features.medicalDevice.description
    },
    {
      icon: Shield,
      title: t.company.qualityCompliance.features.dataProtection.title,
      description: t.company.qualityCompliance.features.dataProtection.description
    },
    {
      icon: Shield,
      title: t.company.qualityCompliance.features.culturalRespect.title,
      description: t.company.qualityCompliance.features.culturalRespect.description
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <ProgressiveSection className="py-20 md:py-30 bg-gradient-to-br from-primary/8 to-medical-teal/5">
          <div className="container-custom">
            <ContentSection
              title={t.company.hero.title}
              description={t.company.hero.description}
              align="center"
            />
          </div>
        </ProgressiveSection>

        {/* Mission Statement */}
        <ProgressiveSection className="py-20 md:py-30">
          <div className="container-custom">
            <ContentSection
              badge={t.company.mission.badge}
              title={t.company.mission.title}
              description={t.company.mission.description}
              icon={Heart}
              align="center"
            />
          </div>
        </ProgressiveSection>

        {/* Swiss Heritage Section */}
        <SwissHeritage />

        {/* Leadership Showcase */}
        <LeadershipShowcase />

        {/* Our Vision */}
        <ProgressiveSection className="py-20 md:py-30 bg-gradient-to-br from-background to-background-accent">
          <div className="container-custom">
            <ContentSection
              title={t.company.vision.title}
              description={t.company.vision.description}
              align="center"
            />
            <div className="mt-8 max-w-4xl mx-auto text-center space-y-6">
              <p className="text-lg text-muted-foreground">
                {t.company.vision.paragraph1}
              </p>
              <p className="text-lg text-muted-foreground">
                {t.company.vision.paragraph2}
              </p>
            </div>
          </div>
        </ProgressiveSection>

        {/* Quality and Compliance */}
        <ProgressiveSection className="py-20 md:py-30">
          <div className="container-custom">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t.company.qualityCompliance.title}</h2>
            <FeatureGrid
              features={qualityFeatures}
              variant="cards"
              columns={3}
            />
          </div>
        </ProgressiveSection>

        {/* Commitment */}
        <ProgressiveSection className="py-20 md:py-30 bg-background-secondary">
          <div className="container-custom">
            <ContentSection
              title={t.company.commitment.title}
              description={t.company.commitment.description}
              align="center"
            />
          </div>
        </ProgressiveSection>
      </main>
      <Footer />
    </div>
  );
};

export default Company;