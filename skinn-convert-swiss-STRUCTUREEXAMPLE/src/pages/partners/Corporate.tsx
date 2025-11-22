import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  Building2, 
  Heart, 
  TrendingUp, 
  Users, 
  Shield, 
  BarChart3,
  CheckCircle,
  ArrowRight,
  Target,
  Clock,
  Award,
  Database
} from 'lucide-react';

const Corporate = () => {
  const populationBenefits = [
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Early Detection",
      description: "Silent heart conditions can lead to serious events if undetected. SKIIN screenings help catch issues early, potentially preventing costly medical emergencies and time off work."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: "Cost Reduction", 
      description: "Early detection means early intervention, often far less costly than emergency care. Reduce downstream claims by catching arrhythmias and other conditions earlier."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Employee Wellness",
      description: "Demonstrate commitment to employee wellbeing with state-of-the-art heart health monitoring. Non-disruptive screening that employees can complete while working."
    }
  ];

  const corporateSolutions = [
    {
      title: "Executive Health Programs",
      description: "Provide SKIIN screenings to all executives over 50 as part of comprehensive executive health assessments.",
      icon: <Award className="h-6 w-6 text-primary" />
    },
    {
      title: "Employee Wellness Initiatives", 
      description: "Integrate SKIIN into broader wellness programs for high-risk employees or those with family history of heart disease.",
      icon: <Heart className="h-6 w-6 text-primary" />
    },
    {
      title: "Pilot Programs",
      description: "Start with targeted screenings for specific departments or risk groups to demonstrate value before company-wide rollout.",
      icon: <Target className="h-6 w-6 text-primary" />
    }
  ];

  const implementationModels = [
    {
      model: "Pilot Program",
      description: "100-employee screening initiative to demonstrate value and refine processes",
      features: ["Targeted high-risk groups", "Baseline health metrics", "ROI measurement", "Scalability assessment"]
    },
    {
      model: "Department-Wide",
      description: "Deploy across specific departments with higher cardiovascular risk profiles",
      features: ["Executive teams", "Field workers", "High-stress roles", "Age-based criteria"]
    },
    {
      model: "Company-Wide",
      description: "Comprehensive heart health screening as part of annual health assessments",
      features: ["All eligible employees", "Regular screening cycles", "Trend analysis", "Preventive care integration"]
    }
  ];

  const successMetrics = [
    { metric: "Early Detection Rate", value: "15-20%", description: "Of screened individuals show actionable findings" },
    { metric: "Employee Satisfaction", value: "94%", description: "Compliance rate due to comfortable wearable design" },
    { metric: "Cost Avoidance", value: "3-5x ROI", description: "Potential savings from prevented acute cardiac events" },
    { metric: "Productivity Impact", value: "Minimal", description: "Screening completed during normal work activities" }
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
                <Building2 className="h-4 w-4 mr-2" />
                Corporate Solutions
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Workplace Heart Health Innovation
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Transform your employee wellness program with advanced cardiac screening. 
                SKIIN provides non-invasive, workplace-friendly heart monitoring that helps detect issues early 
                while employees continue their normal work activities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg">
                  Discuss Partnership
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg">
                  Start a Pilot Program
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Population Health Benefits */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Population Health Benefits
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Proactive cardiac screening delivers measurable value for both employee health and organizational outcomes.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {populationBenefits.map((benefit, index) => (
                <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="mb-6">{benefit.icon}</div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">{benefit.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </CardContent>
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Corporate Solutions */}
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Tailored Corporate Solutions
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Flexible implementation options designed to fit your organization's specific needs and wellness objectives.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {corporateSolutions.map((solution, index) => (
                <Card key={index} className="border-primary/20">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      {solution.icon}
                      <CardTitle className="text-lg">{solution.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{solution.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-primary/5 rounded-lg border border-primary/20 p-8">
              <div className="flex items-start gap-4">
                <Database className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Custom Deployment & Support</h3>
                  <p className="text-muted-foreground mb-4">
                    Our team handles end-to-end deployment: education, device distribution, data collection, and results reporting, 
                    all under privacy-compliant protocols. We can customize reporting for corporate wellness metrics without violating individual privacy.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Multilingual support (DE/FR/EN)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Privacy-compliant data handling</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Aggregate health insights</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Platform integration options</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Models */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Implementation Models
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Choose the approach that best fits your organization's size, culture, and wellness goals.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {implementationModels.map((model, index) => (
                <Card key={index} className="relative">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-primary">{model.model}</CardTitle>
                    <p className="text-muted-foreground text-sm">{model.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {model.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Success Metrics */}
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Expected Outcomes
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Measurable impact on employee health and organizational wellness metrics.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {successMetrics.map((item, index) => (
                <Card key={index} className="text-center border-primary/20">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-primary mb-2">{item.value}</div>
                    <h3 className="font-semibold text-foreground mb-2">{item.metric}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-4 p-6 bg-background rounded-lg border border-primary/20">
                <BarChart3 className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <h3 className="font-semibold text-foreground">ROI Measurement</h3>
                  <p className="text-muted-foreground text-sm">
                    We help you measure the impact through analytics and health outcome tracking
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Ready to Transform Your Workplace Wellness?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Contact us to design a heart health program tailored for your organization. 
                Start with a pilot program or discuss company-wide implementation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg">
                  Contact Partnerships Team
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg">
                  Download Partnership Info
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Corporate;