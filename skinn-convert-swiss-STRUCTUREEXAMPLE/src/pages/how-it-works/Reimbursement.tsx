import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  CreditCard, 
  CheckCircle, 
  AlertCircle,
  Users,
  Building,
  Phone,
  Calculator,
  FileText,
  Stethoscope
} from 'lucide-react';

const Reimbursement = () => {
  const insuranceModels = [
    {
      id: "standard",
      title: "Standard Model",
      subtitle: "Free choice of doctor",
      icon: <CreditCard className="h-6 w-6 text-primary" />,
      coverage: "Fully Covered",
      process: "You can go directly through our service or via any doctor. No gatekeeper required - as long as a cardiologist or GP orders the Holter for a valid reason, your insurer will pay for it.",
      requirements: [
        "Valid medical indication (symptoms or risk factors)",
        "Physician prescription",
        "Subject to standard deductible and 10% co-pay"
      ]
    },
    {
      id: "gp",
      title: "GP Gatekeeper Model", 
      subtitle: "Hausarztmodell",
      icon: <Stethoscope className="h-6 w-6 text-primary" />,
      coverage: "Covered with GP Referral",
      process: "You must involve your GP first. Ask your GP for a referral to SKIIN or bring them our information so they can approve the test. Once the GP gives approval, the insurer will cover it.",
      requirements: [
        "GP referral or approval required",
        "Valid medical indication", 
        "Cannot bypass GP (coverage may be denied)"
      ]
    },
    {
      id: "hmo",
      title: "HMO Model",
      subtitle: "Health Maintenance Organization", 
      icon: <Building className="h-6 w-6 text-primary" />,
      coverage: "Covered via HMO Physician",
      process: "Similar to GP model - you must involve your HMO physician first. They will coordinate the SKIIN referral within their network protocols.",
      requirements: [
        "HMO physician coordination",
        "Follow HMO protocols",
        "Valid medical indication"
      ]
    },
    {
      id: "telmed",
      title: "Telmed Model", 
      subtitle: "Telemedicine first",
      icon: <Phone className="h-6 w-6 text-primary" />,
      coverage: "Covered via Telemedicine",
      process: "Call your telemedicine center first and tell them about your symptoms. They can refer you for a Holter test. We work with telemedicine providers for seamless integration.",
      requirements: [
        "Call telemedicine center first",
        "Follow Telmed procedure",
        "Valid medical indication"
      ]
    }
  ];

  const coverageCriteria = [
    {
      scenario: "With Symptoms",
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      status: "Covered",
      description: "Palpitations, dizziness, syncope, chest pain, or other cardiac symptoms",
      note: "Insurance covers diagnostic tests when medically indicated"
    },
    {
      scenario: "With Risk Factors",
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      status: "Covered", 
      description: "Known heart condition, family history, diabetes, hypertension, or other cardiovascular risk factors",
      note: "Monitoring for patients with established risk is considered medically necessary"
    },
    {
      scenario: "Preventive Screening",
      icon: <AlertCircle className="h-6 w-6 text-amber-500" />,
      status: "Usually Not Covered",
      description: "No symptoms and no risk factors - purely preventive wellness check",
      note: "Available as self-pay option (approximately CHF 400 for 10-day monitoring)"
    }
  ];

  const majorInsurers = [
    "CSS", "Helsana", "SWICA", "Sanitas", "Groupe Mutuel", "Concordia", "Sympany", "Visana"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-to-br from-primary/5 via-background to-primary/10">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4">
                <Shield className="h-4 w-4 mr-2" />
                Coverage & Reimbursement
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Understanding Your Coverage
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                SKIIN is covered by most Swiss insurance plans when medically prescribed. 
                Learn about your coverage options and what steps to follow for reimbursement.
              </p>
              <Button size="lg" className="text-lg">
                Check My Coverage
              </Button>
            </div>
          </div>
        </section>

        {/* Coverage Overview */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                When Is SKIIN Covered?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                SKIIN's 10-day Holter monitoring is generally covered by basic health insurance in Switzerland 
                when medically indicated and properly prescribed.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {coverageCriteria.map((criteria, index) => (
                <Card key={index} className="relative">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      {criteria.icon}
                      <div>
                        <h3 className="font-semibold text-foreground">{criteria.scenario}</h3>
                        <Badge variant={criteria.status === "Covered" ? "default" : "secondary"} className="text-xs">
                          {criteria.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-3">{criteria.description}</p>
                    <p className="text-sm text-muted-foreground italic">{criteria.note}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 p-6 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-start gap-4">
                <Shield className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Bottom Line</h3>
                  <p className="text-muted-foreground">
                    If you follow your insurance's protocol (GP or Telmed first if required) and a doctor orders SKIIN, 
                    your basic insurance will pay for it just like any other Holter ECG test.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Insurance Models */}
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Coverage by Insurance Model
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Different insurance models have different requirements. Choose your model to see the specific process.
              </p>
            </div>

            <Tabs defaultValue="standard" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                {insuranceModels.map((model) => (
                  <TabsTrigger key={model.id} value={model.id} className="text-xs sm:text-sm">
                    {model.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {insuranceModels.map((model) => (
                <TabsContent key={model.id} value={model.id}>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        {model.icon}
                        <div>
                          <CardTitle className="text-xl">{model.title}</CardTitle>
                          <p className="text-muted-foreground">{model.subtitle}</p>
                        </div>
                        <Badge variant="default" className="ml-auto">
                          {model.coverage}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {model.process}
                      </p>
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Requirements:</h4>
                        <ul className="space-y-2">
                          {model.requirements.map((req, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Self-Pay Option */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Self-Pay Option
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  If you don't meet criteria for insurance coverage (no symptoms, no risk factors) but want 
                  proactive heart health monitoring, SKIIN is available as a self-pay service.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calculator className="h-5 w-5 text-primary" />
                    <span>Approximate cost: CHF 400 for 10-day monitoring</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <span>Some supplemental insurances may reimburse preventive screenings</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>Same comprehensive analysis and medical review</span>
                  </div>
                </div>
              </div>
              <Card className="border-primary/20">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-4">What You Get</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">10-day continuous ECG monitoring</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">AI-powered analysis + cardiologist review</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Comprehensive medical report</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Device shipping & return included</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Medical consultation for results</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6">
                    Get Self-Pay Quote
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Supported Insurers */}
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Supported by All Major Swiss Insurers
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                SKIIN is recognized as a standard Holter diagnostic and can be billed through the same channels 
                as any other Holter test with all major Swiss insurance providers.
              </p>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {majorInsurers.map((insurer, index) => (
                <div key={index} className="text-lg font-medium text-muted-foreground">
                  {insurer}
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-4 p-6 bg-background rounded-lg border border-primary/20">
                <Users className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <h3 className="font-semibold text-foreground">Direct Billing</h3>
                  <p className="text-muted-foreground">
                    We can bill your insurer directly once we have the doctor's prescription - no upfront payment required
                  </p>
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

export default Reimbursement;