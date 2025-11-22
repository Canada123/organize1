import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Heart, Activity, Moon, ArrowRight, Calendar, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import TriTestReport from '@/components/tritest/TriTestReport';

const SolutionsTritest = () => {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const content = {
    en: {
      badge: "Coming Q1 2026",
      title: "SKIIN 3X Screening™",
      subtitle: "One System, Three Screenings",
      description: "The only home-based wearable that screens for the top 3 silent health risks in one comprehensive test: arrhythmia, hypertension, and sleep apnea.",
      
      hero: {
        statTitle: "First of its Kind",
        statValue: "3-in-1",
        statDesc: "Cardiac + BP + Sleep"
      },
      
      triad: {
        title: "The Silent Triad",
        subtitle: "Three interconnected health risks, one comprehensive solution",
        items: [
          {
            icon: Heart,
            title: "Arrhythmia Detection",
            description: "10-day continuous ECG monitoring for heart rhythm irregularities",
            current: "Available now"
          },
          {
            icon: Activity,
            title: "Blood Pressure Monitoring", 
            description: "24-hour ambulatory blood pressure monitoring across multiple days",
            current: "Coming 2026"
          },
          {
            icon: Moon,
            title: "Sleep Apnea Screening",
            description: "Overnight respiratory monitoring to detect sleep apnea episodes",
            current: "Coming 2026"
          }
        ]
      },
      
      whyMatters: {
        title: "Why the 3X Screening Matters",
        points: [
          "Heart disease, hypertension, and sleep apnea are interconnected",
          "Usually tested separately, causing delays in diagnosis",
          "SKIIN 3X provides holistic cardiovascular health insight",
          "Early detection of all three saves lives and reduces costs"
        ]
      },
      
      waitlist: {
        title: "Be First in Line",
        description: "Register your interest in SKIIN 3X Screening. We'll notify you when it becomes available and offer early access.",
        placeholder: "Enter your email address",
        button: "Join Waitlist",
        success: "Thanks! You're on the waitlist for SKIIN 3X Screening.",
        privacy: "We respect your privacy and will only contact you about SKIIN 3X updates."
      },
      
      timeline: {
        title: "Development Timeline", 
        current: "Current: Heart rhythm monitoring available",
        q1: "Q1 2026: Full 3X screening launch (pending regulatory approval)",
        beta: "Late 2025: Limited beta testing program"
      }
    },
    de: {
      badge: "Kommt Q1 2026",
      title: "SKIIN 3X Screening™",
      subtitle: "Ein System, drei Untersuchungen",
      description: "Das einzige heimbasierte Wearable, das die 3 wichtigsten stillen Gesundheitsrisiken in einem umfassenden Test screent: Arrhythmie, Bluthochdruck und Schlafapnoe.",
      
      hero: {
        statTitle: "Weltweit Erstes",
        statValue: "3-in-1",
        statDesc: "Herz + BP + Schlaf"
      },
      
      triad: {
        title: "Die stille Triade",
        subtitle: "Drei miteinander verbundene Gesundheitsrisiken, eine umfassende Lösung",
        items: [
          {
            icon: Heart,
            title: "Arrhythmie-Erkennung",
            description: "10-tägige kontinuierliche EKG-Überwachung für Herzrhythmusstörungen",
            current: "Jetzt verfügbar"
          },
          {
            icon: Activity,
            title: "Blutdrucküberwachung",
            description: "24-Stunden-Langzeit-Blutdruckmessung über mehrere Tage",
            current: "Kommt 2026"
          },
          {
            icon: Moon,
            title: "Schlafapnoe-Screening",
            description: "Nächtliche Atemüberwachung zur Erkennung von Schlafapnoe-Episoden",
            current: "Kommt 2026"
          }
        ]
      },
      
      whyMatters: {
        title: "Warum das 3X Screening wichtig ist",
        points: [
          "Herzkrankheiten, Bluthochdruck und Schlafapnoe sind miteinander verbunden",
          "Normalerweise getrennt getestet, was Diagnosen verzögert",
          "SKIIN 3X bietet ganzheitliche kardiovaskuläre Gesundheitseinsicht",
          "Früherkennung aller drei rettet Leben und reduziert Kosten"
        ]
      },
      
      waitlist: {
        title: "Seien Sie zuerst dabei",
        description: "Registrieren Sie Ihr Interesse am SKIIN 3X Screening. Wir benachrichtigen Sie, wenn es verfügbar wird und bieten Frühzugang.",
        placeholder: "E-Mail-Adresse eingeben",
        button: "Zur Warteliste",
        success: "Danke! Sie stehen auf der Warteliste für SKIIN 3X Screening.",
        privacy: "Wir respektieren Ihre Privatsphäre und kontaktieren Sie nur über SKIIN 3X Updates."
      },
      
      timeline: {
        title: "Entwicklungsplan",
        current: "Aktuell: Herzrhythmus-Überwachung verfügbar",
        q1: "Q1 2026: Vollständiger 3X Screening Start (vorbehaltlich behördlicher Genehmigung)",
        beta: "Ende 2025: Begrenztes Beta-Test-Programm"
      }
    },
    fr: {
      badge: "Arrive T1 2026",
      title: "SKIIN 3X Screening™",
      subtitle: "Un système, trois dépistages",
      description: "Le seul appareil portable à domicile qui dépiste les 3 principaux risques de santé silencieux en un test complet : arythmie, hypertension et apnée du sommeil.",
      
      hero: {
        statTitle: "Premier au monde",
        statValue: "3-en-1",
        statDesc: "Cardiaque + TA + Sommeil"
      },
      
      triad: {
        title: "La triade silencieuse",
        subtitle: "Trois risques de santé interconnectés, une solution complète",
        items: [
          {
            icon: Heart,
            title: "Détection d'arythmie",
            description: "Surveillance ECG continue de 10 jours pour les irrégularités du rythme cardiaque",
            current: "Disponible maintenant"
          },
          {
            icon: Activity,
            title: "Surveillance de la pression artérielle",
            description: "Surveillance ambulatoire de la pression artérielle 24h sur plusieurs jours",
            current: "Arrive en 2026"
          },
          {
            icon: Moon,
            title: "Dépistage de l'apnée du sommeil",
            description: "Surveillance respiratoire nocturne pour détecter les épisodes d'apnée du sommeil",
            current: "Arrive en 2026"
          }
        ]
      },
      
      whyMatters: {
        title: "Pourquoi le dépistage 3X est important",
        points: [
          "Les maladies cardiaques, l'hypertension et l'apnée du sommeil sont interconnectées",
          "Habituellement testées séparément, causant des retards de diagnostic",
          "SKIIN 3X fournit une vision holistique de la santé cardiovasculaire", 
          "La détection précoce des trois sauve des vies et réduit les coûts"
        ]
      },
      
      waitlist: {
        title: "Soyez le premier",
        description: "Enregistrez votre intérêt pour le SKIIN 3X Screening. Nous vous notifierons quand il sera disponible et offrirons un accès anticipé.",
        placeholder: "Entrez votre adresse email",
        button: "Rejoindre la liste",
        success: "Merci! Vous êtes sur la liste d'attente pour SKIIN 3X Screening.",
        privacy: "Nous respectons votre vie privée et ne vous contacterons que pour les mises à jour SKIIN 3X."
      },
      
      timeline: {
        title: "Calendrier de développement",
        current: "Actuel: Surveillance du rythme cardiaque disponible",
        q1: "T1 2026: Lancement complet du dépistage 3X (en attente d'approbation réglementaire)",
        beta: "Fin 2025: Programme de test bêta limité"
      }
    },
    it: {
      badge: "Disponibile T1 2026",
      title: "SKIIN 3X Screening™",
      subtitle: "Un sistema, tre screening",
      description: "L'unico dispositivo indossabile domestico che esegue lo screening dei 3 principali rischi per la salute silenziosi in un test completo: aritmia, ipertensione e apnea notturna.",
      
      hero: {
        statTitle: "Primo nel suo genere",
        statValue: "3-in-1",
        statDesc: "Cardiaco + PA + Sonno"
      },
      
      triad: {
        title: "La Triade Silenziosa",
        subtitle: "Tre rischi per la salute interconnessi, una soluzione completa",
        items: [
          {
            icon: Heart,
            title: "Rilevamento Aritmie",
            description: "Monitoraggio ECG continuo di 10 giorni per irregolarità del ritmo cardiaco",
            current: "Disponibile ora"
          },
          {
            icon: Activity,
            title: "Monitoraggio Pressione Arteriosa",
            description: "Monitoraggio ambulatoriale della pressione arteriosa 24 ore su più giorni",
            current: "Disponibile 2026"
          },
          {
            icon: Moon,
            title: "Screening Apnea Notturna",
            description: "Monitoraggio respiratorio notturno per rilevare episodi di apnea notturna",
            current: "Disponibile 2026"
          }
        ]
      },
      
      whyMatters: {
        title: "Perché lo Screening 3X è Importante",
        points: [
          "Malattie cardiache, ipertensione e apnea notturna sono interconnesse",
          "Solitamente testate separatamente, causando ritardi nella diagnosi",
          "SKIIN 3X fornisce una visione olistica della salute cardiovascolare",
          "La diagnosi precoce di tutte e tre salva vite e riduce i costi"
        ]
      },
      
      waitlist: {
        title: "Sia il Primo in Lista",
        description: "Registri il Suo interesse per SKIIN 3X Screening. La avviseremo quando sarà disponibile e offriremo accesso anticipato.",
        placeholder: "Inserisca il suo indirizzo email",
        button: "Unisciti alla Lista",
        success: "Grazie! È nella lista d'attesa per SKIIN 3X Screening.",
        privacy: "Rispettiamo la Sua privacy e La contatteremo solo per aggiornamenti SKIIN 3X."
      },
      
      timeline: {
        title: "Cronologia di Sviluppo",
        current: "Attuale: Monitoraggio del ritmo cardiaco disponibile",
        q1: "T1 2026: Lancio completo dello screening 3X (in attesa di approvazione normativa)",
        beta: "Fine 2025: Programma di test beta limitato"
      }
    }
  };

  const t = content[language] || content.en;

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Here you would integrate with your CRM/email service
      setIsSubmitted(true);
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-to-br from-background via-secondary/20 to-accent/30 pt-24">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge variant="secondary" className="w-fit">
                  <Calendar className="w-4 h-4 mr-2" />
                  {t.badge}
                </Badge>
                
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  {t.title}
                </h1>
                
                <p className="text-xl text-primary">
                  {t.subtitle}
                </p>
                
                <p className="text-muted-foreground">
                  {t.description}
                </p>
              </div>
              
              <div className="relative">
                <Card className="p-8 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{t.hero.statValue}</div>
                  <div className="text-sm text-muted-foreground mb-1">{t.hero.statTitle}</div>
                  <div className="text-xs text-muted-foreground">{t.hero.statDesc}</div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* The Silent Triad */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t.triad.title}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t.triad.subtitle}
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {t.triad.items.map((item, index) => {
                const IconComponent = item.icon;
                const isAvailable = index === 0;
                return (
                  <Card key={index} className={`group hover:shadow-lg transition-shadow ${!isAvailable ? 'opacity-75' : ''}`}>
                    <CardContent className="p-6 text-center">
                      <IconComponent className={`w-12 h-12 mx-auto mb-4 ${isAvailable ? 'text-primary' : 'text-muted-foreground'}`} />
                      <Badge variant={isAvailable ? "default" : "secondary"} className="mb-4">
                        {item.current}
                      </Badge>
                      <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why It Matters */}
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  {t.whyMatters.title}
                </h2>
                <div className="space-y-4">
                  {t.whyMatters.points.map((point, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <ArrowRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-muted-foreground">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <Card className="p-8">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <Heart className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-2xl text-muted-foreground">+</div>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <Activity className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-2xl text-muted-foreground">+</div>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <Moon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Comprehensive health screening in one device
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Example Report Section */}
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Example Report Preview
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                See what your comprehensive health insights report will look like. This interactive example 
                shows both patient-friendly and clinical views of the results you'll receive.
              </p>
            </div>
            
            <div className="max-w-none">
              <Card className="p-6 bg-background">
                <div className="text-center mb-6">
                  <Badge variant="secondary" className="mb-4">
                    Interactive Example Report
                  </Badge>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    SKIIN Tritest Report Sample
                  </h3>
                  <p className="text-muted-foreground">
                    Toggle between patient and clinical views to see how your results will be presented
                  </p>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-3 text-center text-sm text-muted-foreground">
                    This is a demonstration report with sample data for preview purposes
                  </div>
                  <div className="max-h-[800px] overflow-y-auto">
                    <TriTestReport />
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <Button size="lg" className="mr-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    Get Your Real Report
                  </Button>
                  <Button variant="outline" size="lg">
                    Learn More About Results
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Waitlist Section */}
        <section className="section-padding bg-primary">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                {t.waitlist.title}
              </h2>
              <p className="text-xl text-primary-foreground/90 mb-8">
                {t.waitlist.description}
              </p>
              
              {!isSubmitted ? (
                <form onSubmit={handleWaitlistSubmit} className="flex gap-4 max-w-md mx-auto mb-4">
                  <Input
                    type="email"
                    placeholder={t.waitlist.placeholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white"
                  />
                  <Button type="submit" variant="secondary">
                    <Mail className="w-4 h-4 mr-2" />
                    {t.waitlist.button}
                  </Button>
                </form>
              ) : (
                <div className="bg-primary-foreground/10 text-primary-foreground p-6 rounded-lg mb-4">
                  <p className="text-lg font-medium">{t.waitlist.success}</p>
                </div>
              )}
              
              <p className="text-sm text-primary-foreground/70">
                {t.waitlist.privacy}
              </p>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              {t.timeline.title}
            </h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 bg-primary rounded-full flex-shrink-0"></div>
                  <p className="text-foreground">{t.timeline.current}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 bg-muted-foreground rounded-full flex-shrink-0"></div>
                  <p className="text-muted-foreground">{t.timeline.beta}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 bg-accent rounded-full flex-shrink-0"></div>
                  <p className="text-foreground font-medium">{t.timeline.q1}</p>
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

export default SolutionsTritest;