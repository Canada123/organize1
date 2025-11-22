import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, Award, BookOpen, Stethoscope, Brain } from 'lucide-react';

const MedicalBoard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="container-custom section-padding">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Team & Medical Advisors</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A multidisciplinary team of experts ensuring SKIIN meets real-world healthcare needs
            </p>
          </div>

          {/* Team Overview */}
          <Card className="mb-16">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-4">Multidisciplinary Excellence</h2>
              </div>
              <p className="text-lg leading-relaxed text-center max-w-4xl mx-auto mb-6">
                Behind SKIIN is a multidisciplinary team of experts in engineering, data science, 
                and healthcare – all working together to ensure the service meets real-world needs. 
                Our leadership includes seasoned professionals with backgrounds in cardiac care and 
                digital health.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="text-center">
                  <Heart className="h-8 w-8 text-myant-green mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Head of Medical Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Swiss-board-certified cardiologist guiding clinical practice integration
                  </p>
                </div>
                <div className="text-center">
                  <Brain className="h-8 w-8 text-myant-green mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Product Director</h3>
                  <p className="text-sm text-muted-foreground">
                    Biomedical engineering background, award-winning health tech solutions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Advisory Board */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Medical Advisory Board</h2>
            <p className="text-lg text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
              We are advised by an esteemed Medical Advisory Board of Swiss doctors and cardiology 
              experts who provide oversight, validate our clinical protocols, and ensure medical rigor.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-myant-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Stethoscope className="h-8 w-8 text-myant-green" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Dr. Markus Müller, MD</h3>
                      <Badge variant="outline" className="mb-3">Senior Cardiologist</Badge>
                      <p className="text-sm text-muted-foreground mb-3">Universitätsspital Zürich</p>
                      <p className="text-sm">
                        Consults on our arrhythmia detection algorithms and report formats, bringing 
                        extensive expertise in cardiac electrophysiology and clinical cardiology.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-myant-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="h-8 w-8 text-myant-green" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Dr. Sabine Keller, MD</h3>
                      <Badge variant="outline" className="mb-3">General Practitioner</Badge>
                      <p className="text-sm text-muted-foreground mb-3">Bern • 20+ years experience</p>
                      <p className="text-sm">
                        Advises on patient communications and SKIIN integration into GP workflows, 
                        ensuring our service meets primary care needs and expectations.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-secondary/30">
              <CardContent className="p-6 text-center">
                <Award className="h-8 w-8 text-myant-green mx-auto mb-3" />
                <p className="text-lg">
                  <strong>Local Expertise:</strong> Having local experts like Dr. Müller and Dr. Keller 
                  on our team means we design our service in line with Swiss healthcare realities – from 
                  insurance nuances to patient expectations. Their endorsements add an extra layer of 
                  trust when fellow physicians see that respected colleagues are involved in SKIIN.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Partner Network */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Partner Cardiologist Network</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-myant-green mx-auto mb-4" />
                  <h3 className="font-semibold mb-3">Active Interpreters</h3>
                  <p className="text-sm text-muted-foreground">
                    Network of partner cardiologists across Switzerland actively interpreting 
                    SKIIN reports and providing consultation
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Heart className="h-8 w-8 text-myant-green mx-auto mb-4" />
                  <h3 className="font-semibold mb-3">Collaborative Partners</h3>
                  <p className="text-sm text-muted-foreground">
                    Not just service providers but collaborators who give feedback on report 
                    quality and help refine analysis criteria
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <BookOpen className="h-8 w-8 text-myant-green mx-auto mb-4" />
                  <h3 className="font-semibold mb-3">Research Contributors</h3>
                  <p className="text-sm text-muted-foreground">
                    Occasionally publish case studies to contribute to medical knowledge and 
                    advance the field of extended cardiac monitoring
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Technology Team */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Technology Excellence</h2>
            <Card>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Development Team</h3>
                    <p className="text-muted-foreground mb-4">
                      Our development team includes data scientists specialized in AI for ECG analysis 
                      and hardware engineers who've pioneered textile sensor design.
                    </p>
                    <div className="flex items-center space-x-2 mb-4">
                      <Award className="h-5 w-5 text-myant-green" />
                      <span className="text-sm font-medium">CES 2025 Digital Health Award Winner</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Recognition for "Best Health Device" underscores our team's innovation and execution
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Brain className="h-6 w-6 text-myant-green" />
                      <span className="text-sm">AI/ML ECG Analysis Specialists</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Award className="h-6 w-6 text-myant-green" />
                      <span className="text-sm">Textile Sensor Design Engineers</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Heart className="h-6 w-6 text-myant-green" />
                      <span className="text-sm">Clinical Data Scientists</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="h-6 w-6 text-myant-green" />
                      <span className="text-sm">Cross-Disciplinary Collaboration</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Culture */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Our Culture</h2>
            <p className="text-lg max-w-4xl mx-auto">
              As proud as we are of technology accolades, we measure success ultimately by patient 
              outcomes and doctor satisfaction. Our team culture emphasizes cross-disciplinary 
              collaboration: engineers join meetings with physicians, support staff relay patient 
              stories to designers, and everyone remains aligned to the core objective of 
              <strong> saving lives through early detection</strong>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MedicalBoard;