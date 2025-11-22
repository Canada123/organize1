import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Clock, Shield, Activity, CheckCircle, ArrowRight, Shirt } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProgressiveSection } from '@/components/ui/progressive-section';
import { ContentSection } from '@/components/ui/content-section';
import { FeatureGrid } from '@/components/ui/feature-grid';
import { ComparisonTable } from '@/components/ui/comparison-table';
import { ProcessFlow } from '@/components/home/ProcessFlow';
import { StatCard } from '@/components/ui/stat-card';

const Solutions10DayHeartScreening = () => {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "10-Day Heart Screening",
      subtitle: "Clinical-grade heart rhythm monitoring from the comfort of home",
      description: "SKIIN's 10-day heart screening service combines breakthrough textile technology with clinical expertise to deliver the most comprehensive cardiac monitoring solution available.",
      
      hero: {
        statTitle: "Detection Rate",
        statValue: "3x Higher",
        statDesc: "vs 24h Holter"
      },
      
      features: {
        title: "Why Choose SKIIN's 10-Day Heart Screening?",
        items: [
          {
            icon: Clock,
            title: "Extended Monitoring",
            description: "10 continuous days of ECG data capture intermittent arrhythmias that shorter monitoring periods miss"
          },
          {
            icon: Heart,
            title: "Textile Comfort",
            description: "Soft, breathable chest band with invisible sensors - no wires, adhesives, or skin irritation"
          },
          {
            icon: Activity,
            title: "AI-Powered Analysis",
            description: "Advanced algorithms detect arrhythmias in real-time, reviewed by certified cardiologists"
          },
          {
            icon: Shield,
            title: "Clinical Validation",
            description: "CE-marked medical device with accuracy validated against traditional Holter monitors"
          }
        ]
      },
      
      comparison: {
        title: "SKIIN vs Traditional Holter",
        skiin: "SKIIN 10-Day",
        traditional: "24h Holter",
        features: [
          { feature: "Monitoring Duration", skiin: "Up to 10 days", traditional: "24-48 hours" },
          { feature: "Comfort", skiin: "Textile, wire-free", traditional: "Wires & adhesives" },
          { feature: "Daily Activities", skiin: "Normal life", traditional: "Restricted" },
          { feature: "Detection Rate", skiin: "Higher", traditional: "Limited" },
          { feature: "Patient Compliance", skiin: "97%", traditional: "65%" }
        ]
      },
      
      process: {
        title: "How It Works",
        steps: [
          "Doctor prescribes SKIIN",
          "Device delivered to home",
          "Wear for up to 10 days",
          "Automatic data upload",
          "Cardiologist review",
          "Report to your doctor"
        ]
      },
      
      cta: {
        title: "Ready for Advanced Heart Monitoring?",
        description: "Experience the next generation of cardiac monitoring with SKIIN's 10-day heart screening service.",
        button: "Check Eligibility"
      }
    },
    de: {
      title: "10-Tage Herzüberwachung",
      subtitle: "Klinisch-präzise Herzrhythmus-Überwachung bequem von zu Hause",
      description: "SKIINs 10-Tage Herzüberwachungsservice kombiniert innovative Textiltechnologie mit klinischer Expertise für die umfassendste verfügbare Herzüberwachungslösung.",
      
      hero: {
        statTitle: "Entdeckungsrate",
        statValue: "3x höher",
        statDesc: "vs 24h Holter"
      },
      
      features: {
        title: "Warum SKIINs 10-Tage Herzüberwachung wählen?",
        items: [
          {
            icon: Clock,
            title: "Erweiterte Überwachung",
            description: "10 kontinuierliche Tage EKG-Daten erfassen intermittierende Arrhythmien, die kürzere Überwachungszeiten verpassen"
          },
          {
            icon: Heart,
            title: "Textiler Komfort",
            description: "Weiches, atmungsaktives Brustband mit unsichtbaren Sensoren - keine Kabel, Pflaster oder Hautreizungen"
          },
          {
            icon: Activity,
            title: "KI-gestützte Analyse",
            description: "Fortschrittliche Algorithmen erkennen Arrhythmien in Echtzeit, überprüft von zertifizierten Kardiologen"
          },
          {
            icon: Shield,
            title: "Klinische Validierung",
            description: "CE-zertifiziertes Medizinprodukt mit validierter Genauigkeit gegenüber traditionellen Holter-Monitoren"
          }
        ]
      },
      
      comparison: {
        title: "SKIIN vs Traditioneller Holter",
        skiin: "SKIIN 10-Tage",
        traditional: "24h Holter",
        features: [
          { feature: "Überwachungsdauer", skiin: "Bis zu 10 Tage", traditional: "24-48 Stunden" },
          { feature: "Komfort", skiin: "Textil, kabelfrei", traditional: "Kabel & Pflaster" },
          { feature: "Tägliche Aktivitäten", skiin: "Normales Leben", traditional: "Eingeschränkt" },
          { feature: "Entdeckungsrate", skiin: "Höher", traditional: "Begrenzt" },
          { feature: "Patientencompliance", skiin: "97%", traditional: "65%" }
        ]
      },
      
      process: {
        title: "So funktioniert es",
        steps: [
          "Arzt verschreibt SKIIN",
          "Gerät nach Hause geliefert",
          "Bis zu 10 Tage tragen",
          "Automatischer Datenupload",
          "Kardiologen-Überprüfung",
          "Bericht an Ihren Arzt"
        ]
      },
      
      cta: {
        title: "Bereit für fortschrittliche Herzüberwachung?",
        description: "Erleben Sie die nächste Generation der Herzüberwachung mit SKIINs 10-Tage Herzüberwachungsservice.",
        button: "Berechtigung prüfen"
      }
    },
    fr: {
      title: "Dépistage Cardiaque 10 Jours",
      subtitle: "Surveillance du rythme cardiaque de qualité clinique depuis chez vous",
      description: "Le service de dépistage cardiaque 10 jours de SKIIN combine une technologie textile révolutionnaire avec une expertise clinique pour offrir la solution de surveillance cardiaque la plus complète disponible.",
      
      hero: {
        statTitle: "Taux de détection",
        statValue: "3x plus élevé",
        statDesc: "vs Holter 24h"
      },
      
      features: {
        title: "Pourquoi choisir le dépistage cardiaque 10 jours de SKIIN?",
        items: [
          {
            icon: Clock,
            title: "Surveillance prolongée",
            description: "10 jours continus de données ECG capturent les arythmies intermittentes que les courtes périodes manquent"
          },
          {
            icon: Heart,
            title: "Confort textile",
            description: "Bande thoracique douce et respirante avec capteurs invisibles - pas de fils, adhésifs ou irritation cutanée"
          },
          {
            icon: Activity,
            title: "Analyse par IA",
            description: "Algorithmes avancés détectent les arythmies en temps réel, examinées par des cardiologues certifiés"
          },
          {
            icon: Shield,
            title: "Validation clinique",
            description: "Dispositif médical marqué CE avec précision validée contre les moniteurs Holter traditionnels"
          }
        ]
      },
      
      comparison: {
        title: "SKIIN vs Holter traditionnel",
        skiin: "SKIIN 10 jours",
        traditional: "Holter 24h",
        features: [
          { feature: "Durée de surveillance", skiin: "Jusqu'à 10 jours", traditional: "24-48 heures" },
          { feature: "Confort", skiin: "Textile, sans fil", traditional: "Fils et adhésifs" },
          { feature: "Activités quotidiennes", skiin: "Vie normale", traditional: "Restreinte" },
          { feature: "Taux de détection", skiin: "Plus élevé", traditional: "Limité" },
          { feature: "Compliance patient", skiin: "97%", traditional: "65%" }
        ]
      },
      
      process: {
        title: "Comment ça marche",
        steps: [
          "Le médecin prescrit SKIIN",
          "Appareil livré à domicile",
          "Porter jusqu'à 10 jours",
          "Upload automatique des données",
          "Examen par cardiologue",
          "Rapport à votre médecin"
        ]
      },
      
      cta: {
        title: "Prêt pour une surveillance cardiaque avancée?",
        description: "Découvrez la nouvelle génération de surveillance cardiaque avec le service de dépistage cardiaque 10 jours de SKIIN.",
        button: "Vérifier l'éligibilité"
      }
    },
    
    it: {
      title: "Screening Cardiaco 10 Giorni",
      subtitle: "Monitoraggio del ritmo cardiaco di qualità clinica da casa",
      description: "Il servizio di screening cardiaco di 10 giorni di SKIIN combina la tecnologia tessile rivoluzionaria con l'esperienza clinica per offrire la soluzione di monitoraggio cardiaco più completa disponibile.",
      
      
      hero: {
        statValue: "3x",
        statTitle: "Tasso di Rilevazione Maggiore", 
        statDesc: "Rispetto al monitoraggio Holter di 24-48 ore"
      },
      
      features: {
        title: "Perché scegliere lo screening SKIIN di 10 giorni?",
        items: [
          {
            icon: Clock,
            title: "Monitoraggio esteso",
            description: "Fino a 10 giorni di monitoraggio continuo del ritmo cardiaco per catturare eventi rari che test più brevi perdono"
          },
          {
            icon: Shirt,
            title: "Tecnologia indossabile",
            description: "Tessuto senza fili, morbido che è come una seconda pelle - rimovibile per le docce"
          },
          {
            icon: Activity,
            title: "Analisi IA",
            description: "Algoritmi avanzati rilevano aritmie in tempo reale, esaminati da cardiologi certificati"
          },
          {
            icon: Shield,
            title: "Validazione clinica",
            description: "Dispositivo medico marcato CE con precisione convalidata rispetto ai monitor Holter tradizionali"
          }
        ]
      },
      
      comparison: {
        title: "SKIIN vs Holter tradizionale",
        skiin: "SKIIN 10 giorni",
        traditional: "Holter 24h",
        features: [
          { feature: "Durata del monitoraggio", skiin: "Fino a 10 giorni", traditional: "24-48 ore" },
          { feature: "Comfort", skiin: "Tessile, senza fili", traditional: "Fili e adesivi" },
          { feature: "Attività quotidiane", skiin: "Vita normale", traditional: "Limitata" },
          { feature: "Tasso di rilevamento", skiin: "Più alto", traditional: "Limitato" },
          { feature: "Compliance del paziente", skiin: "97%", traditional: "65%" }
        ]
      },
      
      process: {
        title: "Come funziona",
        steps: [
          "Il medico prescrive SKIIN",
          "Dispositivo consegnato a casa",
          "Indossare fino a 10 giorni",
          "Caricamento automatico dei dati",
          "Revisione del cardiologo",
          "Rapporto al medico"
        ]
      },
      
      cta: {
        title: "Pronto per il monitoraggio cardiaco avanzato?",
        description: "Sperimenta la prossima generazione di monitoraggio cardiaco con il servizio di screening cardiaco di 10 giorni di SKIIN.",
        button: "Verifica l'idoneità"
      }
    }
  };

  const t = content[language] || content.en;

  const getEligibilityPath = () => {
    if (language === 'de') return '/de/wie-es-funktioniert';
    if (language === 'fr') return '/fr/comment-ca-marche';
    if (language === 'it') return '/it/come-funziona';
    return '/how-it-works';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <ProgressiveSection className="py-20 md:py-32 bg-gradient-to-br from-primary/8 to-medical-teal/5 pt-24">
          <div className="container-custom">
            <ContentSection
              badge="CE Certified Medical Device"
              badgeVariant="secondary"
              title={t.title}
              subtitle={t.subtitle}
              description={t.description}
              primaryCta={{
                text: t.cta.button,
                href: getEligibilityPath()
              }}
              image={{
                src: "/assets/images/32de0ca4-a556-4e60-bfaf-fc48bf4bd27c.png",
                alt: "Person wearing SKIIN 10-Day Heart Screening monitor",
                position: "right"
              }}
            />
            <div className="mt-12 max-w-sm mx-auto">
              <StatCard
                value={t.hero.statValue}
                label={t.hero.statTitle}
                description={t.hero.statDesc}
                variant="large"
                icon={Activity}
              />
            </div>
          </div>
        </ProgressiveSection>

        {/* Features Section */}
        <ProgressiveSection className="py-20 md:py-30">
          <div className="container-custom">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              {t.features.title}
            </h2>
            <FeatureGrid
              features={t.features.items}
              variant="cards"
              columns={4}
            />
          </div>
        </ProgressiveSection>

        {/* Comparison Section */}
        <ProgressiveSection className="py-20 md:py-30 bg-background-secondary">
          <div className="container-custom">
            <ComparisonTable
              title={t.comparison.title}
              items={t.comparison.features.map(item => ({
                feature: item.feature,
                competitors: item.traditional,
                skiin: item.skiin
              }))}
              competitorLabel={t.comparison.traditional}
              skiinLabel={t.comparison.skiin}
            />
          </div>
        </ProgressiveSection>

        {/* Process Section */}
        <ProgressiveSection className="py-20 md:py-30">
          <div className="container-custom">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              {t.process.title}
            </h2>
            <ProcessFlow />
          </div>
        </ProgressiveSection>

        {/* CTA Section */}
        <ProgressiveSection className="py-20 md:py-30 bg-primary text-primary-foreground" dark>
          <div className="container-custom">
            <ContentSection
              title={t.cta.title}
              description={t.cta.description}
              align="center"
              primaryCta={{
                text: t.cta.button,
                href: getEligibilityPath(),
                variant: "outline"
              }}
              className="text-primary-foreground"
            />
          </div>
        </ProgressiveSection>
      </main>
      <Footer />
    </div>
  );
};

export default Solutions10DayHeartScreening;