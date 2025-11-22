import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, FileText, Eye, Lock, Users, Award, Phone, Mail } from 'lucide-react';

const Compliance = () => {
  const complianceAreas = [
    {
      icon: Shield,
      title: "Privacy Policy",
      description: "How we collect, use, store, and protect personal data in compliance with Swiss FADP and EU GDPR",
      highlights: ["Swiss Data Protection Act compliance", "GDPR compliance", "Encryption & access controls", "Cookie management"]
    },
    {
      icon: FileText,
      title: "Terms of Use",
      description: "Conditions for using our website and services, including user responsibilities and limitations",
      highlights: ["Medical disclaimer", "Intellectual property rights", "User responsibilities", "Swiss law governance"]
    },
    {
      icon: Lock,
      title: "Medical Disclaimer",
      description: "Important information about SKIIN as a medical device and its proper medical context",
      highlights: ["Professional medical guidance required", "Emergency procedures", "Not a substitute for consultation", "Individual results may vary"]
    },
    {
      icon: Award,
      title: "Regulatory Notices",
      description: "Medical device certifications and regulatory compliance information",
      highlights: ["CE Class IIa certification", "Swissmedic registration", "ISO 13485 quality standards", "ISO 27001 security"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="container-custom section-padding">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Compliance & Legal</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We prioritize transparency and compliance in every aspect of our service
            </p>
          </div>

          {/* Trust Statement */}
          <Card className="mb-16 bg-secondary/30">
            <CardContent className="p-8 text-center">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Your Trust, Our Priority</h2>
              <p className="text-lg max-w-4xl mx-auto">
                By maintaining these policies and notices, we ensure that SKIIN operates with full 
                transparency and integrity. Users can trust that there are no hidden catches: data 
                isn't misused, costs are communicated, and their rights are respected.
              </p>
            </CardContent>
          </Card>

          {/* Compliance Areas */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Legal Framework</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {complianceAreas.map((area, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-4">
                      <area.icon className="h-8 w-8 text-myant-green" />
                      <CardTitle className="text-xl">{area.title}</CardTitle>
                    </div>
                    <p className="text-muted-foreground">{area.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Key Points:</h4>
                      {area.highlights.map((highlight, highlightIndex) => (
                        <div key={highlightIndex} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-myant-green rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-muted-foreground">{highlight}</span>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      View Full Document
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Regulatory Certifications */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Regulatory Certifications</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="h-8 w-8 text-myant-green mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">CE Class IIa</h3>
                  <p className="text-sm text-muted-foreground">EU Medical Device Regulation</p>
                  <Badge variant="outline" className="mt-2">Certified</Badge>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Shield className="h-8 w-8 text-myant-green mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Swissmedic</h3>
                  <p className="text-sm text-muted-foreground">Swiss Medical Device Registration</p>
                  <Badge variant="outline" className="mt-2">Registered</Badge>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="h-8 w-8 text-myant-green mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">ISO 13485</h3>
                  <p className="text-sm text-muted-foreground">Medical Device Quality Management</p>
                  <Badge variant="outline" className="mt-2">Certified</Badge>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Lock className="h-8 w-8 text-myant-green mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">ISO 27001</h3>
                  <p className="text-sm text-muted-foreground">Information Security Management</p>
                  <Badge variant="outline" className="mt-2">Compliant</Badge>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Data Protection Details */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Lock className="h-8 w-8 text-myant-green mr-3" />
                Data Protection & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4">Your Rights</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start space-x-2">
                      <Eye className="h-4 w-4 mt-0.5 text-myant-green flex-shrink-0" />
                      <span>Access your personal data</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <FileText className="h-4 w-4 mt-0.5 text-myant-green flex-shrink-0" />
                      <span>Request correction or deletion</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Shield className="h-4 w-4 mt-0.5 text-myant-green flex-shrink-0" />
                      <span>Data portability rights</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Lock className="h-4 w-4 mt-0.5 text-myant-green flex-shrink-0" />
                      <span>Consent withdrawal</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Our Protections</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start space-x-2">
                      <Lock className="h-4 w-4 mt-0.5 text-myant-green flex-shrink-0" />
                      <span>End-to-end encryption</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Users className="h-4 w-4 mt-0.5 text-myant-green flex-shrink-0" />
                      <span>Role-based access controls</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Shield className="h-4 w-4 mt-0.5 text-myant-green flex-shrink-0" />
                      <span>Swiss/EU data storage</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Award className="h-4 w-4 mt-0.5 text-myant-green flex-shrink-0" />
                      <span>Regular security audits</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impressum/Legal Notice */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="text-2xl">Impressum (Legal Notice)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4">Company Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>SKIIN Switzerland – Myant AG</strong></p>
                    <p>Bahnhofstrasse 123</p>
                    <p>8001 Zürich, Switzerland</p>
                    <p>CHE-XXX.XXX.XXX</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-myant-green" />
                      <span className="text-sm">support@skiin.ch</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-myant-green" />
                      <span className="text-sm">0800-SKIIN-CH (0800-754-262)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accessibility */}
          <Card className="mb-16">
            <CardContent className="p-8">
              <div className="text-center">
                <Users className="h-12 w-12 text-myant-green mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Accessibility & Inclusion</h2>
                <p className="text-lg text-muted-foreground mb-6 max-w-3xl mx-auto">
                  Our website is designed to be usable by people with disabilities. We use 
                  high-contrast text options, all images have alt text, and the site can be 
                  navigated via keyboard for those using assistive technology.
                </p>
                <Badge variant="outline" className="text-base px-4 py-2">WCAG 2.1 AA Compliant</Badge>
                <p className="text-sm text-muted-foreground mt-4">
                  If you encounter any accessibility barriers, please contact us and we will address them.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cookie Policy */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Cookie Management</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Shield className="h-8 w-8 text-myant-green mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Essential Cookies</h3>
                  <p className="text-sm text-muted-foreground">Required for site functionality</p>
                  <Badge variant="default" className="mt-2">Always Active</Badge>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Eye className="h-8 w-8 text-myant-green mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Analytics Cookies</h3>
                  <p className="text-sm text-muted-foreground">Anonymous usage statistics</p>
                  <Badge variant="outline" className="mt-2">Optional</Badge>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-myant-green mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Your Control</h3>
                  <p className="text-sm text-muted-foreground">Manage preferences anytime</p>
                  <Button variant="outline" size="sm" className="mt-2">Cookie Settings</Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact for Legal Matters */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Legal Questions?</h2>
            <p className="text-lg max-w-4xl mx-auto mb-8">
              If you have any questions about our legal policies, compliance measures, or need 
              clarification on any aspect of our service, please don't hesitate to contact our 
              legal and compliance team.
            </p>
            <div className="flex justify-center space-x-4">
              <Button size="lg">
                <Mail className="h-5 w-5 mr-2" />
                Contact Legal Team
              </Button>
              <Button variant="outline" size="lg">
                <FileText className="h-5 w-5 mr-2" />
                Download All Policies
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Compliance;