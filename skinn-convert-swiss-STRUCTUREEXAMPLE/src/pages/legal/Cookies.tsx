import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Cookie } from 'lucide-react';
import { ProgressiveSection } from '@/components/ui/progressive-section';
import { ContentSection } from '@/components/ui/content-section';

const Cookies = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <ProgressiveSection className="py-20 bg-gradient-primary text-white">
          <ContentSection
            title="Cookie Policy"
            subtitle="How We Use Cookies"
            description="Understanding how SKIIN uses cookies to improve your experience"
            icon={Cookie}
            iconClassName="text-white"
            center
            dark
          />
        </ProgressiveSection>

        <ProgressiveSection className="py-20">
          <div className="container-custom">
            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6">Cookie Policy</h2>
                
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground mb-4">
                    Last updated: {new Date().toLocaleDateString()}
                  </p>
                  
                  <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">1. What Are Cookies</h3>
                    <p className="text-muted-foreground mb-4">
                      Cookies are small text files that are placed on your device when you visit our website.
                      They help us provide you with a better experience by remembering your preferences.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">2. How We Use Cookies</h3>
                    <p className="text-muted-foreground mb-4">
                      We use cookies for the following purposes:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground mb-4">
                      <li>To remember your language preferences</li>
                      <li>To understand how you use our website</li>
                      <li>To improve our services and user experience</li>
                      <li>To provide personalized content</li>
                    </ul>
                  </section>

                  <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">3. Types of Cookies We Use</h3>
                    <ul className="list-disc list-inside text-muted-foreground mb-4">
                      <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                      <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                      <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                    </ul>
                  </section>

                  <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">4. Managing Cookies</h3>
                    <p className="text-muted-foreground mb-4">
                      You can control and/or delete cookies as you wish. You can delete all cookies that are
                      already on your computer and you can set most browsers to prevent them from being placed.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">5. Contact Us</h3>
                    <p className="text-muted-foreground">
                      If you have any questions about our Cookie Policy, please contact us at:
                      <br />
                      Email: privacy@myant.ca
                      <br />
                      Phone: +41 44 XXX XX XX
                    </p>
                  </section>

                  <p className="text-sm text-muted-foreground mt-8">
                    This is a placeholder cookie policy. The complete policy will be provided
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

export default Cookies;