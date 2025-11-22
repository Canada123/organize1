import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { ProgressiveSection } from '@/components/ui/progressive-section';
import { ContentSection } from '@/components/ui/content-section';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <ProgressiveSection className="py-20 bg-gradient-primary text-white">
          <ContentSection
            title="Terms of Service"
            subtitle="Terms and Conditions"
            description="Please read these terms carefully before using our services"
            icon={FileText}
            iconClassName="text-white"
            center
            dark
          />
        </ProgressiveSection>

        <ProgressiveSection className="py-20">
          <div className="container-custom">
            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6">Terms of Service</h2>
                
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground mb-4">
                    Last updated: {new Date().toLocaleDateString()}
                  </p>
                  
                  <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h3>
                    <p className="text-muted-foreground mb-4">
                      By accessing and using SKIIN services, you accept and agree to be bound by the terms
                      and provision of this agreement.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">2. Use of Service</h3>
                    <p className="text-muted-foreground mb-4">
                      SKIIN provides cardiac monitoring services for medical purposes. You must use our
                      services in compliance with all applicable laws and regulations.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">3. Medical Disclaimer</h3>
                    <p className="text-muted-foreground mb-4">
                      Our services are not a substitute for professional medical advice, diagnosis, or
                      treatment. Always seek the advice of your physician or other qualified health provider.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">4. Limitation of Liability</h3>
                    <p className="text-muted-foreground mb-4">
                      SKIIN shall not be liable for any indirect, incidental, special, consequential, or
                      punitive damages resulting from your use of or inability to use the service.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">5. Contact Information</h3>
                    <p className="text-muted-foreground">
                      If you have any questions about these Terms, please contact us at:
                      <br />
                      Email: legal@myant.ca
                      <br />
                      Phone: +41 44 XXX XX XX
                    </p>
                  </section>

                  <p className="text-sm text-muted-foreground mt-8">
                    This is a placeholder terms of service. The complete terms will be provided
                    by the legal team before launch.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </ProgressiveSection>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;