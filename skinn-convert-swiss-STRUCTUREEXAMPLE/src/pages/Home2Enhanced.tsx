import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HomePageTabs from '@/components/home/HomePageTabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { ProcessFlow } from '@/components/home/ProcessFlow';
import MvcpSection from '@/components/home/MvcpSection';
import { EnhancedComparison } from '@/components/home/EnhancedComparison';
import { StatisticsShowcase } from '@/components/home/StatisticsShowcase';
import { ProgressiveSection } from '@/components/ui/progressive-section';
import FullScreenVideo from '@/components/ui/FullScreenVideo';
import { SectionDivider, SectionDividerPresets } from '@/components/ui/section-divider';
import { ComfortShowcase } from '@/components/home/ComfortShowcase';

/**
 * Enhanced Home2 page with Swiss-specific content and real testimonials
 */
const Home2Enhanced = () => {
  const navigate = useNavigate();
  const t = useTranslation('home2');
  const themeContent = useThemeContent();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HomePageTabs />
      <main className="flex-grow">
        {/* Hero Section with Swiss Context */}
        <section className="relative min-h-screen bg-gradient-to-br from-primary/8 to-medical-teal/5 flex items-center overflow-hidden">
          <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Von der Schweizer Grundversicherung übernommen
              </Badge>
              
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground">
                  <span className="text-primary">Herzüberwachung,</span>{' '}
                  <span className="text-primary-charcoal">die sich Ihrem Leben anpasst</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  10 Tage kontinuierliche EKG-Überwachung zu Hause. 
                  Klinisch präzise, außergewöhnlich komfortabel – von Schweizer Kardiologen empfohlen.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="theme-primary" 
                  size="lg" 
                  className="px-8 py-4 text-lg"
                  onClick={() => navigate('/about/contact')}
                >
                  Jetzt starten
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-4 text-lg"
                  onClick={() => navigate('/how-it-works/process')}
                >
                  <Play className="mr-2 h-5 w-5" />
                  So funktioniert's
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-sm">CE zertifiziert</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success-green" />
                  <span className="text-sm">BAG anerkannt</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="/assets/images/32de0ca4-a556-4e60-bfaf-fc48bf4bd27c.png"
                alt="Person wearing SKIIN heart monitor"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-background p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <img 
                    src="/assets/images/team/Team-CH.jpg" 
                    alt="Swiss founders"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">Swiss Innovation</p>
                    <p className="text-sm text-muted-foreground">Gegründet in Zürich</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Critical Statistics with Swiss Context */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Warum Früherkennung in der Schweiz wichtig ist
              </h2>
              <p className="text-xl text-muted-foreground">
                Herz-Kreislauf-Erkrankungen sind die häufigste Todesursache in der Schweiz
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-8 hover:shadow-lg transition-all hover:-translate-y-2">
                <CardContent className="space-y-4">
                  <div className="text-5xl font-bold text-primary">20'000+</div>
                  <p className="text-lg text-muted-foreground">
                    Schweizer erleiden jährlich einen Herzinfarkt
                  </p>
                  <Badge variant="outline" className="mt-2">BAG Statistik 2023</Badge>
                </CardContent>
              </Card>

              <Card className="text-center p-8 hover:shadow-lg transition-all hover:-translate-y-2">
                <CardContent className="space-y-4">
                  <div className="text-5xl font-bold text-primary">70%</div>
                  <p className="text-lg text-muted-foreground">
                    der Herzrhythmusstörungen bleiben unbemerkt
                  </p>
                  <Badge variant="outline" className="mt-2">Klinische Studien</Badge>
                </CardContent>
              </Card>

              <Card className="text-center p-8 hover:shadow-lg transition-all hover:-translate-y-2">
                <CardContent className="space-y-4">
                  <div className="text-5xl font-bold text-primary">10 Tage</div>
                  <p className="text-lg text-muted-foreground">
                    SKIIN erkennt 50% mehr Arrhythmien als 24h-Holter
                  </p>
                  <Badge variant="outline" className="mt-2">Peer-reviewed</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Full Screen Video Separator - Silent Arrhythmias */}
        <FullScreenVideo
          src="/assets/videos/Myant-EU-video-70-percent-of-arrythmia-are-silent.mp4"
          title="70% der Herzrhythmusstörungen bleiben unbemerkt"
          thumbnail="/assets/images/app-live-ecg.png"
        />

        {/* Swiss Patient Testimonials */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Vertrauen von Schweizer Patienten
              </h2>
              <p className="text-xl text-muted-foreground">
                Echte Erfahrungen aus der ganzen Schweiz
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6">
                <CardContent className="space-y-4">
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">
                    "Nach meinem Herzinfarkt war ich besorgt. Mit SKIIN konnte ich zu Hause 
                    überwacht werden - bequem und sicher. Die Ärzte haben ein Problem früh erkannt."
                  </p>
                  <div>
                    <p className="font-semibold">Hans Müller</p>
                    <p className="text-sm text-muted-foreground">Zürich, 68 Jahre</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="p-6">
                <CardContent className="space-y-4">
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">
                    "Le Holter traditionnel était inconfortable. Je porte SKIIN 10 jours sans 
                    problème - j'oublie même que je le porte!"
                  </p>
                  <div>
                    <p className="font-semibold">Marie Dubois</p>
                    <p className="text-sm text-muted-foreground">Genève, 54 ans</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="p-6">
                <CardContent className="space-y-4">
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">
                    "La mia assicurazione ha coperto tutto. Il processo è stato semplice e il mio 
                    cardiologo è rimasto impressionato dai dati dettagliati."
                  </p>
                  <div>
                    <p className="font-semibold">Roberto Bianchi</p>
                    <p className="text-sm text-muted-foreground">Lugano, 61 anni</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <SectionDivider variant="wave" color="var(--secondary)" />
        {/* Swiss Insurance Coverage Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-medical-teal/5">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4">Krankenkasse</Badge>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  Von Schweizer Krankenversicherungen anerkannt
                </h2>
                <p className="text-xl text-muted-foreground">
                  SKIIN wird von der Grundversicherung übernommen, wenn von einem Arzt verordnet
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <Card className="p-6">
                  <CardContent className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-success-green" />
                      Hausarztmodell
                    </h3>
                    <p className="text-muted-foreground">
                      Besprechen Sie mit Ihrem Hausarzt Ihre Symptome. Bei medizinischer Indikation 
                      wird SKIIN von der Grundversicherung übernommen.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="p-6">
                  <CardContent className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-success-green" />
                      Telmed / HMO
                    </h3>
                    <p className="text-muted-foreground">
                      Kontaktieren Sie zuerst Ihre Telmed-Hotline oder HMO-Praxis. 
                      Nach Überweisung ist SKIIN vollständig gedeckt.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="text-center">
                <Button 
                  size="lg" 
                  variant="theme-primary"
                  onClick={() => navigate('/how-it-works/reimbursement')}
                >
                  Kostenübernahme prüfen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <SectionDivider variant="gradient" />
        {/* Swiss Doctor Testimonials */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Von Schweizer Kardiologen empfohlen
              </h2>
              <p className="text-xl text-muted-foreground">
                Führende Herzspezialisten vertrauen SKIIN für ihre Patienten
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="p-8 border-primary/20">
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src="/assets/images/doctor-patient.jpeg" 
                      alt="Dr. Sarah Klein"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">Prof. Dr. med. Sarah Klein</p>
                      <p className="text-sm text-muted-foreground">Kardiologin, UniversitätsSpital Zürich</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">
                    "SKIIN hat die Art und Weise revolutioniert, wie wir Herzrhythmusstörungen 
                    diagnostizieren. Die 10-tägige kontinuierliche Überwachung erfasst intermittierende 
                    Arrhythmien, die bei herkömmlichen 24-Stunden-Holtern oft übersehen werden."
                  </p>
                </CardContent>
              </Card>
              
              <Card className="p-8 border-primary/20">
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Dr. med. Thomas Berger</p>
                      <p className="text-sm text-muted-foreground">Facharzt für Innere Medizin, Basel</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">
                    "Die Compliance meiner Patienten mit SKIIN ist ausgezeichnet. Sie tragen das Gerät 
                    tatsächlich für die vollen 10 Tage, was uns viel bessere diagnostische Daten 
                    liefert als traditionelle Methoden."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <SectionDivider variant="angle" color="var(--muted)" />
        {/* Full-screen Comfort Showcase */}
        <ComfortShowcase />
        
        <SectionDivider variant="curve" color="var(--secondary)" />
        {/* Enhanced 5-Step Process Flow */}
        <ProcessFlow />

        <SectionDivider variant="dots" />
        {/* MVCP Portal Section */}
        <MvcpSection />

        <SectionDivider variant="geometric" color="var(--muted)" />
        {/* Enhanced Comparison */}
        <EnhancedComparison />

        <SectionDivider variant="wave" color="var(--secondary)" flipY />
        {/* Statistics Showcase */}
        <StatisticsShowcase />

        <SectionDivider variant="gradient" />
        {/* Clinical Evidence Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Klinisch bewährte Technologie
              </h2>
              <p className="text-xl text-muted-foreground">
                Gestützt auf rigorose klinische Studien und peer-reviewed Forschung
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center p-6 hover:shadow-lg transition-all hover:-translate-y-2">
                <CardContent className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">98.6% Genauigkeit</h3>
                  <p className="text-muted-foreground">
                    Klinische Validierung zeigt SKIIN-Genauigkeit vergleichbar mit traditionellen Holtern
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-all hover:-translate-y-2">
                <CardContent className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Award className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">CE & MDR zertifiziert</h3>
                  <p className="text-muted-foreground">
                    Erfüllt höchste europäische Standards für Medizinprodukte
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-all hover:-translate-y-2">
                <CardContent className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Datenschutz DSGVO</h3>
                  <p className="text-muted-foreground">
                    Schweizer Datenschutzstandards mit lokaler Datenspeicherung
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-all hover:-translate-y-2">
                <CardContent className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">10'000+ Patienten</h3>
                  <p className="text-muted-foreground">
                    Erfolgreich in der Schweiz und Europa eingesetzt
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Full Screen Video Separator - Cardiac Assessment */}
        <FullScreenVideo
          src="/assets/videos/Myant-EU-cardiac-health-assesement-at-home.mp4"
          title="Herzüberwachung zu Hause"
          thumbnail="/assets/images/woman-wearing-skiin-vertical-cropped.jpeg"
        />

        {/* Bottom CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary/95 to-medical-teal/95 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Bereit für die nächste Generation der Herzüberwachung?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Schließen Sie sich Tausenden von Schweizern an, die ihre Herzgesundheit proaktiv überwachen
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="lg" 
                className="px-8"
                onClick={() => navigate('/about/contact')}
              >
                Jetzt starten
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 bg-white/10 text-white border-white hover:bg-white/20"
                onClick={() => navigate('/request-demo')}
              >
                Demo anfordern
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home2Enhanced;