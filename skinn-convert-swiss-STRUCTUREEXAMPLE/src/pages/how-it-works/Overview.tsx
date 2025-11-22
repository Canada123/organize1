import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Smartphone, BarChart3, FileText, Shield, Users } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ConversionButton from '@/components/analytics/ConversionButton';

const HowItWorksOverview = () => {
  const sections = [
    {
      title: "The Process",
      description: "Step-by-step journey from prescription to results",
      icon: Heart,
      link: "/how-it-works/process",
      highlights: ["Simple prescription", "Direct delivery", "Continuous monitoring", "Expert analysis"]
    },
    {
      title: "Coverage & Reimbursement",
      description: "Understanding your insurance options in Switzerland",
      icon: Shield,
      link: "/how-it-works/reimbursement",
      highlights: ["Basic insurance covered", "All models supported", "No upfront costs", "Direct billing"]
    },
    {
      title: "Technology",
      description: "Advanced textile computing meets clinical excellence",
      icon: Smartphone,
      link: "/how-it-works/technology",
      highlights: ["Medical-grade sensors", "AI-powered analysis", "Secure data handling", "CE certified"]
    },
    {
      title: "Clinical Evidence",
      description: "Scientific validation and proven results",
      icon: BarChart3,
      link: "/how-it-works/evidence",
      highlights: ["94% compliance rate", "5x more detection", "Cardiologist reviewed", "Real case studies"]
    },
    {
      title: "FAQ",
      description: "Answers to common questions about SKIIN",
      icon: FileText,
      link: "/how-it-works/faq",
      highlights: ["Patient questions", "Physician queries", "Insurance details", "Technical support"]
    }
  ];

  const keyFeatures = [
    {
      icon: Heart,
      title: "Comfortable Monitoring",
      description: "Wear for up to 10 days without interrupting your daily life"
    },
    {
      icon: Smartphone,
      title: "Smart Technology",
      description: "AI-assisted analysis with cardiologist oversight"
    },
    {
      icon: Users,
      title: "Expert Care",
      description: "Swiss-licensed cardiologists review every report"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container-custom">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl font-bold mb-6">How SKIIN Works</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Simple, seamless cardiac monitoring that fits into your life. 
                From prescription to results, SKIIN makes extended ECG monitoring 
                effortless for both patients and healthcare providers.
              </p>
              <ConversionButton 
                variant="default" 
                size="lg"
                eventName="how_it_works_cta_click"
                className="mr-4"
              >
                Get Started Today
              </ConversionButton>
              <Button variant="outline" size="lg" asChild>
                <Link to="/how-it-works/process">
                  Learn the Process <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16">
          <div className="container-custom">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {keyFeatures.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Overview */}
        <section className="py-16 bg-muted/30">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Five Simple Steps</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our streamlined process ensures you get the cardiac monitoring you need with minimal hassle
              </p>
            </div>
            
            <div className="grid md:grid-cols-5 gap-6">
              {[
                { step: 1, title: "Prescription", desc: "Doctor orders SKIIN or use our eligibility check" },
                { step: 2, title: "Delivery", desc: "Device shipped directly to your home" },
                { step: 3, title: "Monitoring", desc: "Wear comfortably for up to 10 days" },
                { step: 4, title: "Analysis", desc: "AI + cardiologist review your data" },
                { step: 5, title: "Results", desc: "Comprehensive report to your doctor" }
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <Link to="/how-it-works/process">
                  View Detailed Process <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Detailed Sections */}
        <section className="py-16">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Learn More</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Dive deeper into specific aspects of SKIIN monitoring
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.map((section, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow group">
                  <CardHeader>
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <section.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {section.highlights.map((highlight, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-center">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                    <Button asChild variant="outline" className="w-full">
                      <Link to={section.link}>
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Insurance Quick Guide */}
        <section className="py-16 bg-muted/30">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Coverage Made Simple</h2>
              <p className="text-lg text-muted-foreground mb-8">
                SKIIN is covered by Swiss basic insurance when medically indicated. 
                The process varies slightly depending on your insurance model.
              </p>
              
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                {[
                  { model: "Standard", process: "Any doctor → SKIIN" },
                  { model: "GP Model", process: "Your GP → SKIIN" },
                  { model: "HMO", process: "HMO clinic → SKIIN" },
                  { model: "Telmed", process: "Call center → SKIIN" }
                ].map((item, index) => (
                  <div key={index} className="bg-background rounded-lg p-4 shadow-sm">
                    <div className="font-semibold text-primary mb-2">{item.model}</div>
                    <div className="text-sm text-muted-foreground">{item.process}</div>
                  </div>
                ))}
              </div>
              
              <Button asChild>
                <Link to="/how-it-works/reimbursement">
                  Check Your Coverage <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Whether you're a patient looking for answers or a healthcare provider 
              interested in offering SKIIN, we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ConversionButton 
                size="lg"
                eventName="how_it_works_bottom_cta"
              >
                Get SKIIN Monitoring
              </ConversionButton>
              <Button variant="outline" size="lg" asChild>
                <Link to="/physicians">For Healthcare Providers</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksOverview;