import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, Heart, Shield, Users, FileText } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { GPMvcpSection } from '@/components/partners/GPMvcpSection';

const GeneralPractitioners = () => {
  const t = useTranslation('partners');
  const gp = t.gp;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-subtle">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6">
                {gp.hero.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {gp.hero.description}
              </p>
              <Button size="lg" className="mr-4">
                Request Demo
              </Button>
              <Button variant="outline" size="lg">
                Join GP Network
              </Button>
            </div>
          </div>
        </section>

        {/* Clinical Benefits */}
        <section className="py-16">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center mb-12">
              Clinical Benefits for Your Practice
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Heart className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Higher Diagnostic Yield</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    10-day ECG captures arrhythmias that standard 24-hour Holter monitoring would miss. 
                    Extended monitoring leads to more accurate diagnoses and better patient outcomes.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>94% Patient Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Patients wear the device more consistently because it's comfortable and unobtrusive. 
                    You receive complete 10-day data instead of fragmented recordings.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <FileText className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Streamlined Workflow</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Simple integration: You identify the patient, we handle delivery, training, and data collection. 
                    You receive a comprehensive cardiology-reviewed report.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* MVCP Section - New Addition per v7.2 */}
        <GPMvcpSection />

        {/* How It Works for GPs */}
        <section className="py-16 bg-muted/30">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center mb-12">
              How It Works for Your Practice
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Identify Patient</h3>
                    <p className="text-muted-foreground">
                      You identify a patient with suspected arrhythmia, palpitations, or other cardiac concerns.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">SKIIN Referral</h3>
                    <p className="text-muted-foreground">
                      Refer via our online portal (MVCP) or paper form - as simple as a standard Holter prescription.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">We Handle Everything</h3>
                    <p className="text-muted-foreground">
                      We deliver the device to the patient, provide training, and collect the data. No burden on your practice.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Comprehensive Report</h3>
                    <p className="text-muted-foreground">
                      You receive a detailed, cardiologist-reviewed report via MVCP for your patient records.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reimbursement */}
        <section className="py-16">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Billing & Reimbursement
              </h2>
              
              <Card>
                <CardHeader>
                  <Shield className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Simple Billing Process</CardTitle>
                  <CardDescription>
                    Use standard TARMED codes for Holter ECG prescriptions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="font-semibold mb-2">TARMED 70.0010</p>
                    <p className="text-sm text-muted-foreground">
                      For prescribing extended ECG monitoring
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="font-semibold mb-2">Follow-up Consultation</p>
                    <p className="text-sm text-muted-foreground">
                      Standard consultation billing for discussing results
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The SKIIN service itself is billed through the patient's health insurance. 
                    No additional administrative burden for your practice.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-16 bg-muted/30">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <blockquote className="text-xl italic mb-6">
                "SKIIN has transformed our cardiac care capabilities. We can now offer comprehensive monitoring 
                without referring every patient to a cardiologist. The MVCP portal makes management seamless, 
                and the reports are exceptionally detailed. We detected atrial fibrillation in a patient 
                that a standard 24-hour test would have certainly missed."
              </blockquote>
              <cite className="text-muted-foreground">
                Dr. Sarah Meyer, GP in Zurich
              </cite>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container-custom text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Offer SKIIN to Your Patients?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Schedule a 15-minute call with our medical director to learn more
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Schedule Demo
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Join GP Network
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default GeneralPractitioners;