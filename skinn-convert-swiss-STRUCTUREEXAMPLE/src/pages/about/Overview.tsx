import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, Award, BookOpen, Shield, Phone, ArrowRight, Building2, Microscope, LinkedinIcon } from 'lucide-react';
import { ProgressiveSection } from '@/components/ui/progressive-section';
import { ContentSection } from '@/components/ui/content-section';
import { FeatureGrid } from '@/components/ui/feature-grid';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

const AboutOverview = () => {
  const t = useTranslation('about');
  const [swissRef, isSwissVisible] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });
  const [leadershipRef, isLeadershipVisible] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  const getIconComponent = (iconName: string) => {
    const icons = {
      Heart,
      Users,
      Award,
      BookOpen,
      Shield,
      Phone,
      Building2,
      Microscope
    };
    return icons[iconName as keyof typeof icons] || Heart;
  };

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
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <ProgressiveSection className="py-20 md:py-30 bg-gradient-to-br from-primary/8 to-medical-teal/5">
          <div className="container-custom">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.overview.hero.title}</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                {t.overview.hero.description}
              </p>
              <Badge variant="outline" className="text-lg px-6 py-2">
                {t.overview.hero.badge}
              </Badge>
            </div>
          </div>
        </ProgressiveSection>

        {/* Swiss Excellence, Global Impact Section */}
        <ProgressiveSection className="py-20 md:py-30 bg-gradient-to-br from-swiss-red/5 to-swiss-silver/5">
          <div className="container-custom">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 border-swiss-red text-swiss-red">
                {t.overview.swissHeritage.badge}
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {t.overview.swissHeritage.title}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t.overview.swissHeritage.description}
              </p>
            </div>

            <div ref={swissRef} className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              {/* Story Content */}
              <div className={cn(
                "space-y-6 transition-all duration-1000",
                isSwissVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
              )}>
                <h3 className="text-3xl font-bold">{t.overview.swissHeritage.ethTitle}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t.overview.swissHeritage.ethDescription1}
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t.overview.swissHeritage.ethDescription2}
                </p>
                
                {/* Highlights Grid */}
                <div className="grid sm:grid-cols-2 gap-4 mt-8">
                  {t.overview.swissHeritage.highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-start space-x-3 transition-all duration-700",
                        isSwissVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                      )}
                      style={{ transitionDelay: `${300 + index * 100}ms` }}
                    >
                      <div className="w-10 h-10 bg-swiss-red/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        {index === 0 && <Building2 className="w-5 h-5 text-swiss-red" />}
                        {index === 1 && <Award className="w-5 h-5 text-swiss-red" />}
                        {index === 2 && <Users className="w-5 h-5 text-swiss-red" />}
                        {index === 3 && <Microscope className="w-5 h-5 text-swiss-red" />}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{highlight.title}</h4>
                        <p className="text-sm text-muted-foreground">{highlight.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leadership Photo */}
              <div className={cn(
                "transition-all duration-1000",
                isSwissVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              )} style={{ transitionDelay: "400ms" }}>
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <img 
                      src="/assets/images/team/Team-CH.jpg"
                      alt={t.overview.swissHeritage.imageAlt}
                      className="w-full h-auto"
                    />
                  </CardContent>
                </Card>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  {t.overview.swissHeritage.imageAlt}
                </p>
              </div>
            </div>

            {/* Swiss Cross Symbol */}
            <div className="flex justify-center my-16">
              <div className="w-24 h-24 bg-swiss-red rounded-lg flex items-center justify-center">
                <div className="w-16 h-16 relative">
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-4 bg-white"></div>
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4 bg-white"></div>
                </div>
              </div>
            </div>

            {/* Location Emphasis */}
            <div className={cn(
              "text-center transition-all duration-1000",
              isSwissVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )} style={{ transitionDelay: "600ms" }}>
              <h3 className="text-2xl font-bold mb-4">{t.overview.swissHeritage.zurichTitle}</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t.overview.swissHeritage.zurichDescription}
              </p>
            </div>
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

        {/* Leadership Showcase */}
        <ProgressiveSection className="py-20 md:py-30">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {t.overview.leadership.title}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t.overview.leadership.description}
              </p>
            </div>

            <div ref={leadershipRef} className="grid md:grid-cols-2 gap-8 mb-16">
              {t.overview.leadership.leaders.map((leader, index) => (
                <Card
                  key={index}
                  className={cn(
                    "overflow-hidden hover:shadow-lg transition-all duration-700",
                    isLeadershipVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  )}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3">
                        <img 
                          src={leader.image}
                          alt={leader.name}
                          className="w-full h-64 md:h-full object-cover"
                        />
                      </div>
                      <div className="p-6 md:w-2/3">
                        <h3 className="text-2xl font-bold mb-2">{leader.name}</h3>
                        <p className="text-primary font-medium mb-4">{leader.title}</p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          {leader.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Team Photo */}
            <div className={cn(
              "transition-all duration-1000",
              isLeadershipVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            )} style={{ transitionDelay: "600ms" }}>
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <img 
                    src="/assets/images/team/Myant-Team.png"
                    alt={t.overview.leadership.teamPhotoAlt}
                    className="w-full h-auto"
                  />
                </CardContent>
              </Card>
              <p className="text-center text-lg text-muted-foreground mt-6">
                {t.overview.leadership.teamPhotoCaption}
              </p>
            </div>
          </div>
        </ProgressiveSection>

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

        {/* About Sections Grid */}
        <div className="container-custom section-padding">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Explore Our Story</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {t.overview.sections.map((section, index) => {
                const IconComponent = getIconComponent(section.icon);
                return (
                  <Card key={index} className="h-full hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className="flex items-center space-x-3 mb-4">
                        <IconComponent className="h-8 w-8 text-myant-green" />
                        <h3 className="text-xl font-semibold">{section.title}</h3>
                      </div>
                      <p className="text-muted-foreground mb-4 flex-grow">{section.description}</p>
                      <div className="space-y-3 mb-4">
                        {section.highlights.map((highlight, highlightIndex) => (
                          <div key={highlightIndex} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-myant-green rounded-full"></div>
                            <span className="text-sm text-muted-foreground">{highlight}</span>
                          </div>
                        ))}
                      </div>
                      <Link to={section.link}>
                        <Button variant="outline" className="w-full group-hover:bg-myant-green group-hover:text-white transition-colors">
                          Learn More
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <Card className="mb-16">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-center mb-8">{t.overview.stats.title}</h2>
              <div className="grid md:grid-cols-4 gap-6 text-center">
                {t.overview.stats.items.map((item, index) => (
                  <div key={index}>
                    <div className="text-3xl font-bold text-myant-green mb-2">{item.value}</div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Awards & Recognition */}
          <Card className="mb-16 bg-secondary/30">
            <CardContent className="p-8 text-center">
              <Award className="h-12 w-12 text-myant-green mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">{t.overview.awards.title}</h2>
              <p className="text-lg text-muted-foreground mb-6">
                {t.overview.awards.description}
              </p>
              <Badge variant="outline" className="text-lg px-6 py-2">
                {t.overview.awards.badge}
              </Badge>
            </CardContent>
          </Card>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">{t.overview.values.title}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {t.overview.values.items.map((value, index) => {
                const IconComponent = getIconComponent(value.icon);
                return (
                  <Card key={index}>
                    <CardContent className="p-6 text-center">
                      <IconComponent className="h-8 w-8 text-myant-green mx-auto mb-4" />
                      <h3 className="font-semibold mb-3">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">{t.overview.cta.title}</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
              {t.overview.cta.description}
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/about/contact">
                <Button size="lg">
                  <Phone className="h-5 w-5 mr-2" />
                  {t.overview.cta.contactButton}
                </Button>
              </Link>
              <Link to="/about/blog">
                <Button variant="outline" size="lg">
                  <BookOpen className="h-5 w-5 mr-2" />
                  {t.overview.cta.blogButton}
                </Button>
              </Link>
            </div>
          </div>
        </div>

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

export default AboutOverview;