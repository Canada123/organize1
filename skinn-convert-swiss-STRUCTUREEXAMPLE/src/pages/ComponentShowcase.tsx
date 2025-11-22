import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ProgressiveSection } from '@/components/ui/progressive-section';
import { ProgressiveCard } from '@/components/ui/progressive-card';
import { ImageSection } from '@/components/ui/image-section';
import { TeamMember } from '@/components/ui/team-member';
import { FeatureGrid } from '@/components/ui/feature-grid';
import { StatCard } from '@/components/ui/stat-card';
import { ContentSection } from '@/components/ui/content-section';
import { ScrollRevealStatistic } from '@/components/ui/scroll-reveal-statistic';
import { ComparisonTable } from '@/components/ui/comparison-table';
import { 
  Heart, Shield, Monitor, Award, Users, Activity, 
  BarChart3, Zap, Globe, Lock, CheckCircle, Clock 
} from 'lucide-react';
import { ThemeTest } from '@/components/test/ThemeTest';

const ComponentShowcase = () => {
  const features = [
    {
      title: "Continuous Monitoring",
      description: "24/7 heart rhythm tracking with real-time alerts for immediate action",
      icon: Monitor
    },
    {
      title: "Clinical Accuracy",
      description: "Medical-grade ECG monitoring with 98.6% accuracy validated by studies",
      icon: Heart
    },
    {
      title: "Full Coverage",
      description: "100% covered by Swiss health insurance providers",
      icon: Shield
    }
  ];

  const stats = [
    { value: "98.6%", label: "Detection Accuracy", icon: Activity },
    { value: "10", label: "Days Monitoring", icon: Clock },
    { value: "100%", label: "Insurance Coverage", icon: Shield },
    { value: "24/7", label: "Real-Time Analysis", icon: Monitor }
  ];

  const teamMembers = [
    {
      name: "Vincent Martinez",
      title: "CEO Nanoleq / Head of Europe",
      description: "Leading SKIIN's expansion across Switzerland, Germany, and Austria",
      image: "/assets/images/team/vincent-martinez-official-headshot.jpg"
    },
    {
      name: "Pablo Doerig",
      title: "COO Europe",
      description: "Orchestrating operations across European markets",
      image: "/assets/images/team/Pablo-Doerig.jpeg"
    }
  ];

  const comparisonItems = [
    { feature: "10-Day Continuous Monitoring", competitors: false, skiin: true },
    { feature: "Real-Time Symptom Logging", competitors: "Limited", skiin: true },
    { feature: "AI-Powered Analysis", competitors: false, skiin: true },
    { feature: "Full Insurance Coverage", competitors: "Partial", skiin: true }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        {/* Hero */}
        <ProgressiveSection className="py-20 md:py-30 bg-gradient-to-br from-primary/8 to-medical-teal/5">
          <div className="container mx-auto px-6">
            <ContentSection
              badge="Component Library"
              title="Design System Components"
              titleHighlight="Modern"
              subtitle="Reusable components following our progressive design system"
              description="This page showcases all the reusable components created for the SKIIN Switzerland website, demonstrating proper usage and variations."
              align="center"
              primaryCta={{
                text: "View Documentation",
                href: "/docs/design-system"
              }}
            />
          </div>
        </ProgressiveSection>

        {/* Progressive Cards */}
        <ProgressiveSection className="py-20 md:py-30">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Progressive Cards</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <ProgressiveCard
                title="With Icon"
                description="A card component with an icon, hover effects, and progressive reveal animation"
                icon={Heart}
                delay={0}
              />
              <ProgressiveCard
                title="With Image"
                description="Cards can display images with automatic hover zoom effects"
                image="/assets/images/32de0ca4-a556-4e60-bfaf-fc48bf4bd27c.png"
                delay={150}
              />
              <ProgressiveCard
                title="With Link"
                description="Cards can be clickable with a learn more link and arrow animation"
                icon={Shield}
                href="/solutions"
                delay={300}
              />
            </div>
          </div>
        </ProgressiveSection>

        {/* Feature Grid */}
        <ProgressiveSection className="py-20 md:py-30 bg-background-secondary">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-4">Feature Grid</h2>
            <p className="text-center text-muted-foreground mb-12">Multiple layout options for feature lists</p>
            
            <div className="space-y-20">
              <div>
                <h3 className="text-xl font-semibold mb-8 text-center">Card Variant</h3>
                <FeatureGrid features={features} variant="cards" columns={3} />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-8 text-center">Minimal Variant</h3>
                <FeatureGrid features={features} variant="minimal" columns={3} />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-8 text-center">Centered Variant</h3>
                <FeatureGrid features={features} variant="centered" columns={3} />
              </div>
            </div>
          </div>
        </ProgressiveSection>

        {/* Statistics */}
        <ProgressiveSection className="py-20 md:py-30">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Statistics Components</h2>
            
            <div className="space-y-20">
              {/* Large Statistics */}
              <div>
                <h3 className="text-xl font-semibold mb-8 text-center">Large Animated Statistics</h3>
                <div className="grid md:grid-cols-4 gap-12">
                  <ScrollRevealStatistic value="95%" label="Success Rate" description="Industry-leading outcomes" delay={0} />
                  <ScrollRevealStatistic value="50K" label="Patients Served" description="Across Europe" delay={150} />
                  <ScrollRevealStatistic value="10" label="Days Monitoring" description="Continuous tracking" delay={300} />
                  <ScrollRevealStatistic value="24/7" label="Support" description="Always available" delay={450} />
                </div>
              </div>

              {/* Stat Cards */}
              <div>
                <h3 className="text-xl font-semibold mb-8 text-center">Stat Card Variants</h3>
                <div className="grid md:grid-cols-4 gap-8">
                  {stats.map((stat, index) => (
                    <StatCard
                      key={index}
                      value={stat.value}
                      label={stat.label}
                      icon={stat.icon}
                      delay={index * 150}
                    />
                  ))}
                </div>
              </div>

              {/* Compact Stats */}
              <div>
                <h3 className="text-xl font-semibold mb-8 text-center">Compact Stats</h3>
                <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                  {stats.slice(0, 2).map((stat, index) => (
                    <StatCard
                      key={index}
                      value={stat.value}
                      label={stat.label}
                      icon={stat.icon}
                      variant="compact"
                      delay={index * 150}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ProgressiveSection>

        {/* Team Members */}
        <ProgressiveSection className="py-20 md:py-30 bg-background-secondary">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Team Member Components</h2>
            
            <div className="space-y-20">
              {/* Card Variant */}
              <div>
                <h3 className="text-xl font-semibold mb-8 text-center">Card Variant</h3>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {teamMembers.map((member, index) => (
                    <TeamMember
                      key={index}
                      {...member}
                      variant="card"
                      delay={index * 150}
                    />
                  ))}
                </div>
              </div>

              {/* Inline Variant */}
              <div>
                <h3 className="text-xl font-semibold mb-8 text-center">Inline Variant</h3>
                <div className="space-y-12 max-w-4xl mx-auto">
                  {teamMembers.map((member, index) => (
                    <TeamMember
                      key={index}
                      {...member}
                      variant="inline"
                      delay={index * 150}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ProgressiveSection>

        {/* Image Section */}
        <ProgressiveSection className="py-20 md:py-30">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Image Section Component</h2>
            
            <div className="space-y-16">
              <ImageSection
                src="/assets/images/mvcp/consultation-mvcp.jpg"
                alt="MVCP Consultation"
                caption="Healthcare professionals using the Myant Virtual Clinic Portal"
                position="center"
                aspectRatio="16:9"
              />
              
              <div className="grid md:grid-cols-2 gap-8">
                <ImageSection
                  src="/assets/images/team/Team-CH.jpg"
                  alt="Swiss Founders"
                  position="left"
                  aspectRatio="4:3"
                />
                <ImageSection
                  src="/assets/images/app-live-ecg.png"
                  alt="SKIIN App"
                  position="right"
                  aspectRatio="square"
                />
              </div>
            </div>
          </div>
        </ProgressiveSection>

        {/* Comparison Table */}
        <ProgressiveSection className="py-20 md:py-30 bg-background-secondary">
          <div className="container mx-auto px-6">
            <ComparisonTable
              title="How SKIIN Compares"
              subtitle="See why healthcare professionals choose SKIIN for cardiac monitoring"
              items={comparisonItems}
              competitorLabel="Traditional Methods"
              skiinLabel="SKIIN Technology"
            />
          </div>
        </ProgressiveSection>

        {/* Theme Test Section */}
        <ProgressiveSection className="py-20 md:py-30 bg-gradient-lp-cream">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-8">Theme & Color System Test</h2>
            <ThemeTest />
          </div>
        </ProgressiveSection>

        {/* Content Section Variations */}
        <ProgressiveSection className="py-20 md:py-30">
          <div className="container mx-auto px-6 space-y-20">
            <ContentSection
              badge="Example"
              title="with Image on Right"
              titleHighlight="Content Section"
              description="This demonstrates a content section with an image positioned on the right side. The content animates in from the left while the image scales in."
              bullets={[
                "Progressive reveal animations",
                "Flexible image positioning",
                "Support for CTAs and badges"
              ]}
              primaryCta={{ text: "Learn More", href: "#" }}
              image={{
                src: "/assets/images/5b7bbf12-0524-43d2-8e0d-6bbc2064d4f3.png",
                alt: "Insurance Coverage",
                position: "right"
              }}
            />

            <ContentSection
              title="Content"
              titleHighlight="Centered"
              subtitle="With icon and dual CTAs"
              description="Content sections can be centered with icons and multiple call-to-action buttons for maximum flexibility."
              align="center"
              icon={Globe}
              primaryCta={{ text: "Get Started", href: "#" }}
              secondaryCta={{ text: "Learn More", href: "#" }}
            />
          </div>
        </ProgressiveSection>
      </main>
      <Footer />
    </div>
  );
};

export default ComponentShowcase;