import React, { useState } from 'react';
import { Shield, Cpu, Smartphone, Battery, Zap, Lock, Award, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

const Technology = () => {
  const techSpecs = [
    {
      category: "ECG Specifications",
      specs: [
        { label: "Lead Configuration", value: "Single-lead ECG with 3 textile electrodes" },
        { label: "Sampling Rate", value: "500 Hz medical-grade resolution" },
        { label: "Signal Quality", value: "Equivalent to traditional Holter monitors" },
        { label: "Recording Duration", value: "Up to 10 days continuous monitoring" },
        { label: "Data Storage", value: "Over 1.5 million heartbeats captured" }
      ]
    },
    {
      category: "Device Hardware",
      specs: [
        { label: "Form Factor", value: "Textile chest band + reusable sensor pod" },
        { label: "Weight", value: "Lightweight, unobtrusive design" },
        { label: "Water Resistance", value: "IP67 rated (shower-safe when removed)" },
        { label: "Battery Life", value: "2+ days per charge cycle" },
        { label: "Charging Time", value: "Fast charging in under 2 hours" }
      ]
    },
    {
      category: "Data & Security",
      specs: [
        { label: "Encryption", value: "End-to-end AES-256 encryption" },
        { label: "Storage", value: "Swiss/EU compliant cloud infrastructure" },
        { label: "Compliance", value: "GDPR, Swiss DSG, HIPAA equivalent" },
        { label: "Access Control", value: "Multi-factor authentication" },
        { label: "Data Retention", value: "Configurable retention policies" }
      ]
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Medical-Grade Accuracy",
      description: "Clinical validation studies show 99% agreement with traditional Holter monitors for rhythm detection",
      details: [
        "Validated against 12-lead ECG systems",
        "High sensitivity for arrhythmia detection",
        "Minimal false positive rates",
        "Continuous quality monitoring"
      ]
    },
    {
      icon: Cpu,
      title: "AI-Powered Analysis",
      description: "Advanced algorithms trained on millions of heartbeats to detect arrhythmias with precision",
      details: [
        "Machine learning algorithms for pattern recognition",
        "Real-time artifact detection and filtering",
        "Automated event flagging and classification",
        "Continuous algorithm improvement and updates"
      ]
    },
    {
      icon: Smartphone,
      title: "Seamless Connectivity",
      description: "Bluetooth sync with mobile app for effortless data transmission and patient monitoring",
      details: [
        "iOS and Android app compatibility",
        "Offline data storage capability",
        "Automatic sync when in range",
        "Real-time connectivity status"
      ]
    },
    {
      icon: Battery,
      title: "Extended Battery Life",
      description: "Optimized power management ensures continuous monitoring throughout the prescribed period",
      details: [
        "2+ days continuous operation",
        "Smart power management",
        "Quick charging capability",
        "Low battery notifications"
      ]
    },
    {
      icon: Zap,
      title: "Comfortable Design",
      description: "Textile-integrated electrodes eliminate traditional adhesive patches and wires",
      details: [
        "Dry electrode technology",
        "No skin preparation required",
        "Breathable, stretchable fabric",
        "Hypoallergenic materials"
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      description: "Swiss-grade data protection with end-to-end encryption and compliance with healthcare standards",
      details: [
        "ISO 27001 certified infrastructure",
        "Swiss data residency options",
        "Audit trails and access logging",
        "Regular security assessments"
      ]
    }
  ];

  const certifications = [
    { name: "CE Mark", description: "Class IIa Medical Device (EU MDR)" },
    { name: "ISO 13485", description: "Medical Device Quality Management" },
    { name: "ISO 27001", description: "Information Security Management" },
    { name: "Swissmedic", description: "Swiss Medical Device Registration" }
  ];

  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container-custom">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl font-bold mb-6">SKIIN Technology</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Advanced textile computing meets clinical excellence. Discover the innovative 
                technology that makes comfortable, clinical-grade cardiac monitoring possible.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {certifications.map((cert, index) => (
                  <Badge key={index} variant="outline" className="px-3 py-1">
                    <Award className="h-3 w-3 mr-1" />
                    {cert.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Technology Features */}
        <section className="py-16">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Revolutionary Features</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                SKIIN combines cutting-edge technology with proven medical science 
                to deliver superior cardiac monitoring
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className="cursor-pointer transition-all hover:shadow-lg"
                  onClick={() => setExpandedFeature(expandedFeature === index ? null : index)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      {expandedFeature === index ? 
                        <ChevronUp className="h-5 w-5 text-muted-foreground" /> : 
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      }
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  {expandedFeature === index && (
                    <CardContent>
                      <ul className="space-y-2">
                        {feature.details.map((detail, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Specifications */}
        <section className="py-16 bg-muted/30">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Technical Specifications</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Detailed technical information for healthcare professionals and technical evaluators
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {techSpecs.map((category, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="bg-background rounded-lg px-6">
                    <AccordionTrigger className="text-lg font-semibold">
                      {category.category}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-4">
                        {category.specs.map((spec, idx) => (
                          <div key={idx} className="flex justify-between py-2 border-b border-muted last:border-0">
                            <span className="font-medium text-muted-foreground">{spec.label}</span>
                            <span className="text-right max-w-xs">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* How It Works Process */}
        <section className="py-16">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Data Flow & Analysis</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From heartbeat capture to clinical report - how SKIIN processes your cardiac data
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  {
                    step: 1,
                    title: "Capture",
                    description: "Textile electrodes capture ECG signals continuously",
                    icon: "💓"
                  },
                  {
                    step: 2,
                    title: "Process",
                    description: "On-device signal conditioning and artifact removal",
                    icon: "⚡"
                  },
                  {
                    step: 3,
                    title: "Transmit",
                    description: "Encrypted data transmission to secure cloud",
                    icon: "📡"
                  },
                  {
                    step: 4,
                    title: "Analyze",
                    description: "AI algorithms detect events, cardiologist reviews",
                    icon: "🧠"
                  }
                ].map((item) => (
                  <div key={item.step} className="text-center">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                      {item.icon}
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Regulatory Compliance */}
        <section className="py-16 bg-muted/30">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Regulatory Compliance</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                SKIIN meets the highest standards for medical device safety, 
                efficacy, and data protection
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {certifications.map((cert, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{cert.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{cert.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 max-w-3xl mx-auto bg-background rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Safety & Biocompatibility</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Materials Safety</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Hypoallergenic textile materials</li>
                    <li>• Biocompatibility tested (ISO 10993)</li>
                    <li>• Latex-free construction</li>
                    <li>• Dermatologically tested</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Electrical Safety</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• IEC 60601-1 compliant</li>
                    <li>• Low voltage operation (&lt;5V)</li>
                    <li>• Galvanic isolation</li>
                    <li>• EMC tested and certified</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Future Technology */}
        <section className="py-16">
          <div className="container-custom text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">The Future of Wearable Health</h2>
              <p className="text-lg text-muted-foreground mb-8">
                SKIIN's textile computing platform is designed for expansion. 
                Soon, the same comfortable garment will monitor additional vital signs 
                including blood pressure and sleep apnea detection.
              </p>
              <Button size="lg" variant="outline">
                Learn About Tritest
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Technology;