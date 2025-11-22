import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  Monitor, 
  Stethoscope, 
  Clock, 
  Users, 
  Shield, 
  Smartphone,
  CheckCircle,
  ArrowRight,
  Phone,
  Network
} from 'lucide-react';

const Telemedicine = () => {
  const telemedFeatures = [
    {
      icon: <Monitor className="h-8 w-8 text-primary" />,
      title: "Remote Prescription",
      description: "Offer advanced cardiac monitoring to your callers without any physical appointment. SKIIN can be prescribed and delivered straight to the patient after your teleconsultation."
    },
    {
      icon: <Stethoscope className="h-8 w-8 text-primary" />,
      title: "Triage Support", 
      description: "Before sending a patient to a cardiologist or ER for palpitations, deploy SKIIN for two weeks to gather data. Save unnecessary in-person visits while ensuring proper care."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Scalability",
      description: "No need for physical clinics or device inventory. SKIIN handles device logistics, tech support, and retrieval. Your team simply receives digital results."
    }
  ];

  const telmedBenefits = [
    {
      title: "Telmed Model Compliance",
      description: "SKIIN meets all requirements of Telmed insurance models. When a telemedicine doctor orders it, it counts as the required referral for coverage."
    },
    {
      title: "Swiss Licensing",
      description: "SKIIN results are interpreted by Swiss-licensed cardiologists. Your physicians can also interpret the data - we provide flexible options."
    },
    {
      title: "Workflow Integration",
      description: "Our platform can integrate with your telehealth IT systems via API or secure email for sending results and updates."
    }
  ];

  const useCaseSteps = [
    {
      step: "1",
      title: "Patient Call",
      description: "Patient on Telmed plan calls with occasional dizziness"
    },
    {
      step: "2", 
      title: "SKIIN Order",
      description: "Tele-doctor orders SKIIN instead of immediate referral"
    },
    {
      step: "3",
      title: "Monitoring",
      description: "Patient receives device at home, wears for 10 days"
    },
    {
      step: "4",
      title: "Results",
      description: "Telemed team receives detailed ECG report showing intermittent AV-block"
    },
    {
      step: "5",
      title: "Follow-up",
      description: "Telemed doctor arranges immediate cardiology follow-up with data"
    }
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
                <Phone className="h-4 w-4 mr-2" />
                Telemedicine Partners
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Extend Your Telehealth Capabilities
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                SKIIN is designed for telemedicine. Offer advanced cardiac monitoring to your patients 
                without any physical appointment - prescribed and delivered straight to the patient after your teleconsultation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg">
                  Partner with SKIIN
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg">
                  Integration Discussion
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Telehealth Alignment */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Perfect for Telehealth Providers
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                SKIIN extends your reach, allowing you to manage cardiac cases end-to-end without losing patients to external referrals.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {telemedFeatures.map((feature, index) => (
                <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="mb-6">{feature.icon}</div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Telmed Compatibility */}
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Telmed Model Compatible
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                SKIIN seamlessly integrates with Telmed insurance requirements, keeping patients within your pathway.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {telmedBenefits.map((benefit, index) => (
                <Card key={index} className="border-primary/20">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-primary" />
                      <CardTitle className="text-lg">{benefit.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 p-6 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-start gap-4">
                <Shield className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Insurance Compliance</h3>
                  <p className="text-muted-foreground">
                    As long as a Swiss-licensed telemedicine physician prescribes the Holter, it fulfills insurance referral requirements. 
                    The test is reimbursable just like any other specialist referral, keeping patients under the Telmed pathway.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Case Scenario */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Real-World Use Case
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                See how SKIIN transforms telemedicine cardiac care with a typical patient scenario.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-primary/20 hidden md:block" />
                
                <div className="space-y-8">
                  {useCaseSteps.map((step, index) => (
                    <div key={index} className="relative flex items-start gap-6">
                      <div className="flex-shrink-0 w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg z-10">
                        {step.step}
                      </div>
                      <div className="flex-grow pt-2">
                        <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">Outcome</h3>
                    <p className="text-green-700 dark:text-green-400">
                      If SKIIN report had been normal, the telemed doctor could have reassured the patient without any in-person visit. 
                      With the detected AV-block, proper specialist care was arranged with supporting data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Integration Options */}
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Flexible Integration Options
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Network className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">System Integration</h3>
                      <p className="text-muted-foreground">
                        API integration with your telehealth platform for seamless ordering and result delivery.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Stethoscope className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Interpretation Choices</h3>
                      <p className="text-muted-foreground">
                        Use our cardiology network or forward data to your affiliated cardiologists - whichever fits your model.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Fast Deployment</h3>
                      <p className="text-muted-foreground">
                        No device inventory needed at your end. We handle all logistics, support, and device management.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-background p-8 rounded-lg border">
                <h3 className="text-xl font-semibold text-foreground mb-4">Ready to Integrate?</h3>
                <p className="text-muted-foreground mb-6">
                  Contact our partnerships team to set up SKIIN for your telemedicine patients and discuss integration options.
                </p>
                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    Schedule Integration Planning
                  </Button>
                  <Button variant="outline" className="w-full">
                    Request Partnership Info
                  </Button>
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

export default Telemedicine;