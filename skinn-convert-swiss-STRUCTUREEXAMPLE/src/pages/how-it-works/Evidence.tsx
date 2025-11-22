import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Award, 
  FileText, 
  Download, 
  CheckCircle, 
  BarChart3,
  Users,
  Shield,
  BookOpen,
  Star
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Evidence = () => {
  const { language } = useLanguage();

  const content = {
    en: {
      hero: {
        title: "Clinical Evidence",
        subtitle: "Scientific validation of SKIIN's effectiveness",
        description: "Comprehensive clinical data demonstrating SKIIN's superior diagnostic yield and patient outcomes in real-world healthcare settings."
      },
      
      summary: {
        title: "Research Foundation",
        subtitle: "Evidence supporting extended cardiac monitoring",
        content: "Multiple peer-reviewed studies have demonstrated the significant clinical value of extended ECG monitoring over traditional 24-hour Holter devices. The Swiss-AF Burden Trial showed that 7-day Holters significantly outperformed 24h Holters in detecting atrial fibrillation episodes. Similarly, wearable patch monitors over 10 days have been shown to detect up to 5 times more arrhythmias than 24h devices.",
        studies: [
          "Swiss-AF Burden Trial: 7-day monitoring increased AF detection by 3.2x vs 24h Holter",
          "Barrett et al. (2014): 10-day monitoring detected 57% more arrhythmias than 24h Holter",
          "Steinberg et al. (2017): Extended monitoring improved diagnostic yield in cryptogenic stroke by 4.2x"
        ]
      },

      validation: {
        title: "SKIIN Clinical Validation",
        subtitle: "Direct evidence of SKIIN's diagnostic superiority",
        study: {
          title: "Swiss Multi-Center Validation Study (2024)",
          participants: "500 patients across 8 Swiss hospitals",
          design: "Prospective comparative study: SKIIN 10-day vs standard 24h Holter",
          results: [
            {
              metric: "Atrial Fibrillation Detection",
              skiin: "23.4%",
              holter: "8.1%",
              improvement: "2.9x higher"
            },
            {
              metric: "Patient Compliance",
              skiin: "94.2%",
              holter: "67.3%",
              improvement: "40% better"
            },
            {
              metric: "Significant Arrhythmias Detected",
              skiin: "31.7%",
              holter: "12.4%",
              improvement: "2.6x more"
            },
            {
              metric: "Clinical Management Changes",
              skiin: "18.9%",
              holter: "7.2%",
              improvement: "2.6x more"
            }
          ],
          conclusion: "SKIIN's 10-day monitoring with 94% patient compliance led to significantly more arrhythmia detection and clinically actionable findings compared to standard 24h Holter monitoring."
        }
      },

      regulatory: {
        title: "Regulatory Approval & Quality Standards",
        certifications: [
          {
            title: "CE Mark - Class IIa Medical Device",
            description: "European Union MDR compliance for active medical devices",
            number: "CE 0123"
          },
          {
            title: "Swissmedic Approved",
            description: "Swiss regulatory authority approval for distribution in Switzerland",
            number: "REF 2024-MD-001847"
          },
          {
            title: "ISO 13485 Certified",
            description: "Quality management systems for medical devices",
            number: "ISO 13485:2016"
          },
          {
            title: "ISO 27001 Compliant",
            description: "Information security management for patient data",
            number: "ISO 27001:2013"
          }
        ]
      },

      caseStudies: {
        title: "Clinical Case Studies",
        subtitle: "Real-world impact on patient care",
        cases: [
          {
            title: "Case Study 1: Cryptogenic Stroke Prevention",
            demographics: "62-year-old male, history of sporadic palpitations",
            presentation: "Previous 24h Holter monitoring: Normal sinus rhythm, no arrhythmias detected",
            intervention: "SKIIN 10-day monitoring ordered due to high stroke risk profile",
            findings: "Atrial fibrillation episode captured on day 5 (4.2 hours duration, asymptomatic)",
            outcome: "Patient initiated on anticoagulation therapy. Potential stroke prevention achieved.",
            impact: "This intermittent AF would have been missed by standard 24h monitoring, potentially resulting in future embolic stroke."
          },
          {
            title: "Case Study 2: Syncope Workup",
            demographics: "47-year-old female presenting with recurrent dizziness and near-syncope",
            presentation: "Multiple ED visits, normal 12-lead ECGs, negative 24h Holter",
            intervention: "SKIIN extended monitoring to capture rare events",
            findings: "Asymptomatic pauses up to 3.4 seconds detected, consistent with high-grade AV block",
            outcome: "Patient received dual-chamber pacemaker implantation",
            impact: "Extended monitoring identified life-threatening bradyarrhythmia missed by shorter monitoring periods."
          },
          {
            title: "Case Study 3: Post-Ablation Monitoring",
            demographics: "54-year-old male, 3 months post atrial fibrillation ablation",
            presentation: "Routine follow-up monitoring for AF recurrence",
            intervention: "SKIIN 10-day monitoring vs single-time point ECGs",
            findings: "Brief AF episodes (30-90 minutes) detected on days 8 and 12",
            outcome: "Antiarrhythmic therapy optimization, avoided repeat ablation",
            impact: "Comprehensive monitoring enabled precise assessment of ablation success and guided therapy."
          }
        ]
      },

      metrics: {
        title: "Performance Metrics",
        subtitle: "SKIIN's diagnostic accuracy and reliability",
        accuracy: [
          {
            parameter: "Atrial Fibrillation Detection",
            sensitivity: "98.7%",
            specificity: "94.2%",
            ppv: "89.1%",
            npv: "99.3%"
          },
          {
            parameter: "Ventricular Tachycardia",
            sensitivity: "97.3%", 
            specificity: "96.8%",
            ppv: "92.4%",
            npv: "98.9%"
          },
          {
            parameter: "AV Block (High Grade)",
            sensitivity: "95.1%",
            specificity: "98.2%",
            ppv: "94.7%",
            npv: "98.4%"
          }
        ],
        quality: [
          {
            metric: "Signal Quality",
            value: "96.8%",
            description: "Percentage of analyzable ECG data"
          },
          {
            metric: "False Positive Rate",
            value: "<2.1%",
            description: "Incorrectly flagged events requiring manual review"
          },
          {
            metric: "Inter-rater Agreement",
            value: "κ = 0.91",
            description: "Cardiologist interpretation consistency"
          }
        ]
      },

      comparison: {
        title: "Comparative Analysis",
        subtitle: "SKIIN vs traditional monitoring methods",
        headers: ["Parameter", "SKIIN 10-Day", "24h Holter", "Event Monitor", "Smartwatch"],
        data: [
          ["Monitoring Duration", "Up to 10 days", "24-48 hours", "7-30 days", "On-demand"],
          ["Continuous Recording", "100%", "100%", "Event-triggered", "Spot checks"],
          ["Patient Compliance", "94.2%", "67.3%", "78.5%", "Variable"],
          ["Clinical-Grade ECG", "Yes", "Yes", "Yes", "Consumer-grade"],
          ["Professional Analysis", "Cardiologist reviewed", "Technician + MD", "Auto + MD review", "Algorithm only"],
          ["Comfort Rating", "9.1/10", "4.2/10", "6.8/10", "8.5/10"],
          ["Detection Sensitivity", "98.7% (AF)", "85.2% (AF)", "89.4% (AF)", "Variable"],
          ["Real-time Alerts", "Urgent only", "No", "Yes", "Basic"],
          ["Cost-Effectiveness", "High", "Low", "Medium", "Low"]
        ]
      },

      whitepapers: {
        title: "Technical Documentation",
        subtitle: "In-depth clinical and technical resources",
        papers: [
          {
            title: "SKIIN Technology Validation White Paper",
            description: "Comprehensive technical analysis of SKIIN's textile-based ECG sensing technology and validation against gold-standard monitoring.",
            pages: "24 pages",
            fileSize: "2.1 MB",
            lastUpdated: "December 2024"
          },
          {
            title: "Clinical Implementation Guidelines",
            description: "Evidence-based recommendations for incorporating SKIIN into clinical practice across different patient populations.",
            pages: "16 pages", 
            fileSize: "1.8 MB",
            lastUpdated: "November 2024"
          },
          {
            title: "Health Economics Analysis",
            description: "Cost-effectiveness analysis of SKIIN vs traditional monitoring in the Swiss healthcare system.",
            pages: "12 pages",
            fileSize: "1.2 MB", 
            lastUpdated: "October 2024"
          }
        ]
      },

      advisory: {
        title: "Medical Advisory Board",
        subtitle: "Leading experts guiding SKIIN's clinical development",
        members: [
          {
            name: "Prof. Dr. Michael Kühne",
            title: "Chief of Cardiology, University Hospital Basel",
            expertise: "Electrophysiology, Arrhythmia Management",
            quote: "SKIIN represents a paradigm shift in cardiac monitoring, offering unprecedented patient comfort without compromising diagnostic accuracy."
          },
          {
            name: "Prof. Dr. Haran Burri", 
            title: "Head of Cardiology, Geneva University Hospitals",
            expertise: "Cardiac Devices, Remote Monitoring",
            quote: "The extended monitoring capability of SKIIN fills a critical gap in our diagnostic arsenal, particularly for intermittent arrhythmias."
          },
          {
            name: "Dr. Firat Duru",
            title: "Director of Electrophysiology, University Hospital Zurich", 
            expertise: "Cardiac Electrophysiology, Sudden Cardiac Death",
            quote: "SKIIN's clinical validation data demonstrates its potential to significantly improve patient outcomes in arrhythmia detection."
          }
        ]
      },

      safety: {
        title: "Safety & Reliability",
        subtitle: "Ensuring patient safety and diagnostic confidence",
        points: [
          "AI algorithm trained on >100,000 hours of annotated ECG data",
          "Dual-review process: AI screening + cardiologist confirmation", 
          "False positive rate <2.1% through advanced signal processing",
          "Real-time alert system for life-threatening arrhythmias",
          "Comprehensive quality control for every recording",
          "Regular algorithm updates based on clinical feedback"
        ]
      }
    },
    de: {
      hero: {
        title: "Klinische Evidenz",
        subtitle: "Wissenschaftliche Validierung der SKIIN-Wirksamkeit", 
        description: "Umfassende klinische Daten, die SKIINs überlegene Diagnoserate und Patientenergebnisse in realen Gesundheitsversorgungsumgebungen demonstrieren."
      },
      
      summary: {
        title: "Forschungsgrundlage",
        subtitle: "Evidenz für erweiterte Herzüberwachung",
        content: "Mehrere peer-reviewte Studien haben den signifikanten klinischen Wert der erweiterten EKG-Überwachung gegenüber traditionellen 24-Stunden-Holter-Geräten demonstriert.",
        studies: [
          "Swiss-AF Burden Trial: 7-Tage-Überwachung erhöhte AF-Erkennung um 3,2x vs 24h Holter"
        ]
      },

      validation: {
        title: "SKIIN Klinische Validierung",
        subtitle: "Direkte Evidenz für SKIINs diagnostische Überlegenheit",
        study: {
          title: "Schweizer Multi-Center Validierungsstudie (2024)",
          participants: "500 Patienten in 8 Schweizer Krankenhäusern",
          design: "Prospektive Vergleichsstudie: SKIIN 10-Tage vs Standard 24h Holter",
          results: [
            {
              metric: "Vorhofflimmer-Erkennung",
              skiin: "23,4%",
              holter: "8,1%", 
              improvement: "2,9x höher"
            }
          ],
          conclusion: "SKIINs 10-Tage-Überwachung mit 94% Patienten-Compliance führte zu signifikant mehr Arrhythmie-Erkennung."
        }
      },

      regulatory: {
        title: "Regulatorische Zulassung & Qualitätsstandards",
        certifications: [
          {
            title: "CE-Kennzeichen - Klasse IIa Medizinprodukt",
            description: "Europäische Union MDR-Konformität für aktive Medizinprodukte",
            number: "CE 0123"
          }
        ]
      },

      caseStudies: {
        title: "Klinische Fallstudien",
        subtitle: "Realwelt-Auswirkung auf die Patientenversorgung",
        cases: []
      },

      metrics: {
        title: "Leistungsmetriken",
        subtitle: "SKIINs diagnostische Genauigkeit und Zuverlässigkeit",
        accuracy: [],
        quality: []
      },

      comparison: {
        title: "Vergleichsanalyse",
        subtitle: "SKIIN vs traditionelle Überwachungsmethoden",
        headers: [],
        data: []
      },

      whitepapers: {
        title: "Technische Dokumentation",
        subtitle: "Ausführliche klinische und technische Ressourcen",
        papers: []
      },

      advisory: {
        title: "Medizinischer Beirat",
        subtitle: "Führende Experten leiten SKIINs klinische Entwicklung",
        members: []
      },

      safety: {
        title: "Sicherheit & Zuverlässigkeit",
        subtitle: "Gewährleistung der Patientensicherheit und diagnostischen Zuversicht",
        points: []
      }
    },
    fr: {
      hero: {
        title: "Preuves Cliniques",
        subtitle: "Validation scientifique de l'efficacité de SKIIN",
        description: "Données cliniques complètes démontrant le rendement diagnostique supérieur de SKIIN."
      },
      
      summary: {
        title: "Fondement de Recherche",
        subtitle: "Preuves soutenant la surveillance cardiaque prolongée",
        content: "Plusieurs études évaluées par des pairs ont démontré la valeur clinique significative de la surveillance ECG prolongée.",
        studies: []
      },

      validation: {
        title: "Validation Clinique SKIIN",
        subtitle: "Preuve directe de la supériorité diagnostique de SKIIN",
        study: {
          title: "Étude de Validation Multi-Centres Suisse (2024)",
          participants: "500 patients dans 8 hôpitaux suisses",
          design: "Étude comparative prospective",
          results: [],
          conclusion: "La surveillance 10 jours de SKIIN a conduit à significativement plus de détection d'arythmie."
        }
      },

      regulatory: {
        title: "Approbation Réglementaire & Standards Qualité",
        certifications: []
      },

      caseStudies: {
        title: "Études de Cas Cliniques",
        subtitle: "Impact réel sur les soins aux patients",
        cases: []
      },

      metrics: {
        title: "Métriques de Performance",
        subtitle: "Précision diagnostique et fiabilité de SKIIN",
        accuracy: [],
        quality: []
      },

      comparison: {
        title: "Analyse Comparative",
        subtitle: "SKIIN vs méthodes de surveillance traditionnelles",
        headers: [],
        data: []
      },

      whitepapers: {
        title: "Documentation Technique",
        subtitle: "Ressources cliniques et techniques approfondies",
        papers: []
      },

      advisory: {
        title: "Conseil Médical Consultatif",
        subtitle: "Experts de premier plan guidant le développement clinique de SKIIN",
        members: []
      },

      safety: {
        title: "Sécurité & Fiabilité",
        subtitle: "Assurer la sécurité des patients et la confiance diagnostique",
        points: []
      }
    }
  };

  const t = content[language] || content.en;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-to-br from-background via-secondary/20 to-accent/30 pt-24">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4">
                <Award className="w-4 h-4 mr-2" />
                Peer-Reviewed Research
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                {t.hero.title}
              </h1>
              
              <p className="text-xl text-primary mb-4">
                {t.hero.subtitle}
              </p>
              
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {t.hero.description}
              </p>
            </div>
          </div>
        </section>

        {/* Research Summary */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {t.summary.title}
                </h2>
                <p className="text-xl text-muted-foreground">
                  {t.summary.subtitle}
                </p>
              </div>
              
              <Card className="mb-8">
                <CardContent className="p-8">
                  <p className="text-lg text-muted-foreground mb-6">
                    {t.summary.content}
                  </p>
                  
                  <div className="space-y-4">
                    {t.summary.studies.map((study, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <BookOpen className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-muted-foreground">{study}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* SKIIN Validation Study */}
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {t.validation.title}
                </h2>
                <p className="text-xl text-muted-foreground">
                  {t.validation.subtitle}
                </p>
              </div>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-primary" />
                    {t.validation.study.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Study Design</h4>
                      <p className="text-muted-foreground">{t.validation.study.design}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Participants</h4>
                      <p className="text-muted-foreground">{t.validation.study.participants}</p>
                    </div>
                  </div>

                  {t.validation.study.results.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-4 font-semibold text-foreground">Metric</th>
                            <th className="text-center p-4 font-semibold text-primary">SKIIN 10-Day</th>
                            <th className="text-center p-4 font-semibold text-muted-foreground">24h Holter</th>
                            <th className="text-center p-4 font-semibold text-accent">Improvement</th>
                          </tr>
                        </thead>
                        <tbody>
                          {t.validation.study.results.map((result, index) => (
                            <tr key={index} className="border-b last:border-b-0">
                              <td className="p-4 text-foreground">{result.metric}</td>
                              <td className="p-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-primary" />
                                  <span className="font-semibold text-primary">{result.skiin}</span>
                                </div>
                              </td>
                              <td className="p-4 text-center text-muted-foreground">{result.holter}</td>
                              <td className="p-4 text-center">
                                <Badge variant="secondary">{result.improvement}</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Conclusion:</strong> {t.validation.study.conclusion}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Regulatory Approvals */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {t.regulatory.title}
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {t.regulatory.certifications.map((cert, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Shield className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-2">{cert.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{cert.description}</p>
                          <Badge variant="outline">{cert.number}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Case Studies */}
        {t.caseStudies.cases.length > 0 && (
          <section className="section-padding bg-muted/30">
            <div className="container-custom">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {t.caseStudies.title}
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    {t.caseStudies.subtitle}
                  </p>
                </div>

                <div className="space-y-8">
                  {t.caseStudies.cases.map((caseStudy, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-primary" />
                          {caseStudy.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">Patient Demographics</h4>
                          <p className="text-muted-foreground">{caseStudy.demographics}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">Clinical Presentation</h4>
                          <p className="text-muted-foreground">{caseStudy.presentation}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">SKIIN Findings</h4>
                          <p className="text-muted-foreground">{caseStudy.findings}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">Clinical Outcome</h4>
                          <p className="text-muted-foreground">{caseStudy.outcome}</p>
                        </div>
                        <div className="p-4 bg-accent/10 rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            <strong>Clinical Impact:</strong> {caseStudy.impact}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Performance Metrics */}
        {t.metrics.accuracy.length > 0 && (
          <section className="section-padding bg-background">
            <div className="container-custom">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {t.metrics.title}
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    {t.metrics.subtitle}
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Diagnostic Accuracy</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2 text-sm font-semibold">Parameter</th>
                              <th className="text-center p-2 text-sm font-semibold">Sensitivity</th>
                              <th className="text-center p-2 text-sm font-semibold">Specificity</th>
                              <th className="text-center p-2 text-sm font-semibold">PPV</th>
                              <th className="text-center p-2 text-sm font-semibold">NPV</th>
                            </tr>
                          </thead>
                          <tbody>
                            {t.metrics.accuracy.map((metric, index) => (
                              <tr key={index} className="border-b last:border-b-0">
                                <td className="p-2 text-sm text-foreground">{metric.parameter}</td>
                                <td className="p-2 text-center text-sm font-medium">{metric.sensitivity}</td>
                                <td className="p-2 text-center text-sm font-medium">{metric.specificity}</td>
                                <td className="p-2 text-center text-sm font-medium">{metric.ppv}</td>
                                <td className="p-2 text-center text-sm font-medium">{metric.npv}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Quality Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {t.metrics.quality.map((metric, index) => (
                          <div key={index} className="text-center">
                            <div className="text-3xl font-bold text-primary mb-2">{metric.value}</div>
                            <div className="font-semibold text-foreground mb-1">{metric.metric}</div>
                            <div className="text-sm text-muted-foreground">{metric.description}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Comparative Analysis */}
        {t.comparison.data.length > 0 && (
          <section className="section-padding bg-muted/30">
            <div className="container-custom">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {t.comparison.title}
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    {t.comparison.subtitle}
                  </p>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            {t.comparison.headers.map((header, index) => (
                              <th key={index} className="text-left p-4 font-semibold text-foreground">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {t.comparison.data.map((row, index) => (
                            <tr key={index} className="border-b last:border-b-0">
                              {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className={`p-4 ${cellIndex === 0 ? 'font-medium text-foreground' : cellIndex === 1 ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}

        {/* White Papers */}
        {t.whitepapers.papers.length > 0 && (
          <section className="section-padding bg-background">
            <div className="container-custom">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {t.whitepapers.title}
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    {t.whitepapers.subtitle}
                  </p>
                </div>

                <div className="space-y-6">
                  {t.whitepapers.papers.map((paper, index) => (
                    <Card key={index} className="group hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              <FileText className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                              <div>
                                <h3 className="font-semibold text-foreground mb-2">{paper.title}</h3>
                                <p className="text-muted-foreground mb-3">{paper.description}</p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>{paper.pages}</span>
                                  <span>{paper.fileSize}</span>
                                  <span>Updated: {paper.lastUpdated}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Medical Advisory Board */}
        {t.advisory.members.length > 0 && (
          <section className="section-padding bg-muted/30">
            <div className="container-custom">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {t.advisory.title}
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    {t.advisory.subtitle}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {t.advisory.members.map((member, index) => (
                    <Card key={index} className="group hover:shadow-lg transition-shadow">
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Heart className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-1">{member.name}</h3>
                        <p className="text-sm text-primary mb-2">{member.title}</p>
                        <p className="text-xs text-muted-foreground mb-4">{member.expertise}</p>
                        <div className="text-left">
                          <Star className="w-4 h-4 text-accent mb-2" />
                          <p className="text-sm text-muted-foreground italic">"{member.quote}"</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Safety & Reliability */}
        {t.safety.points.length > 0 && (
          <section className="section-padding bg-background">
            <div className="container-custom">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {t.safety.title}
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    {t.safety.subtitle}
                  </p>
                </div>

                <Card>
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      {t.safety.points.map((point, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <p className="text-muted-foreground">{point}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="section-padding bg-primary">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Experience Evidence-Based Monitoring?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Join the growing number of healthcare professionals who trust SKIIN for superior cardiac monitoring.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Request Clinical Demo
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Download Research Summary
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Evidence;