import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, CheckCircle } from 'lucide-react';
import { ProgressiveSection } from '@/components/ui/progressive-section';
import { ContentSection } from '@/components/ui/content-section';
import { useTranslation } from '@/hooks/useTranslation';

const Privacy = () => {
  const t = useTranslation('legal').privacy;
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <ProgressiveSection className="py-20 bg-gradient-primary text-white">
          <ContentSection
            title={t.title}
            subtitle="Your Privacy Matters to Us"
            description="Learn how SKIIN protects and manages your personal health information"
            icon={Shield}
            iconClassName="text-white"
            center
            dark
          />
        </ProgressiveSection>

        <ProgressiveSection className="py-20">
          <div className="container-custom">
            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6">{t.title}</h2>
                
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground mb-6">
                    {t.lastUpdated}: {new Date().toLocaleDateString()}
                  </p>
                  
                  {/* Introduction */}
                  <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">{t.sections.introduction.title}</h3>
                    <p className="text-muted-foreground">
                      {t.sections.introduction.content}
                    </p>
                  </section>

                  {/* Data Collection */}
                  <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">{t.sections.dataCollection.title}</h3>
                    <p className="text-muted-foreground mb-4">
                      {t.sections.dataCollection.subtitle}
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      {t.sections.dataCollection.items.map((item, index) => (
                        <li key={index} className="text-muted-foreground">{item}</li>
                      ))}
                    </ul>
                  </section>

                  {/* Data Usage */}
                  <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">{t.sections.dataUsage.title}</h3>
                    <p className="text-muted-foreground mb-4">
                      {t.sections.dataUsage.content}
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      {t.sections.dataUsage.items.map((item, index) => (
                        <li key={index} className="text-muted-foreground">{item}</li>
                      ))}
                    </ul>
                  </section>

                  {/* Data Protection */}
                  <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">{t.sections.dataProtection.title}</h3>
                    <p className="text-muted-foreground">
                      {t.sections.dataProtection.content}
                    </p>
                  </section>

                  {/* Data Sharing */}
                  <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">{t.sections.dataSharing.title}</h3>
                    <p className="text-muted-foreground mb-4">
                      {t.sections.dataSharing.content}
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      {t.sections.dataSharing.items.map((item, index) => (
                        <li key={index} className="text-muted-foreground">{item}</li>
                      ))}
                    </ul>
                  </section>

                  {/* Your Rights */}
                  <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">{t.sections.yourRights.title}</h3>
                    <p className="text-muted-foreground mb-4">
                      {t.sections.yourRights.content}
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      {t.sections.yourRights.items.map((item, index) => (
                        <li key={index} className="text-muted-foreground">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Contact */}
                  <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">{t.sections.contact.title}</h3>
                    <p className="text-muted-foreground mb-4">
                      {t.sections.contact.content}
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-muted-foreground">
                        Email: <a href={`mailto:${t.sections.contact.email}`} className="text-primary hover:underline">{t.sections.contact.email}</a>
                      </p>
                      <p className="text-muted-foreground">
                        {t.sections.contact.address}
                      </p>
                    </div>
                  </section>
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

export default Privacy;