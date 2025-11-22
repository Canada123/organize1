import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DoctorQuote from '@/components/physicians/DoctorQuote';
import TestimonialCard from '@/components/physicians/TestimonialCard';
import { Heart, MapPin, Phone, Users, Stethoscope, Video } from 'lucide-react';

const Testimonials = () => {
  const patientStories = [
    {
      quote: "I wore SKIIN for two weeks and it found what a year of tests had missed. The band was so comfortable I forget it was there. On day 11 it recorded an episode of atrial fibrillation. Thanks to that, my doctor put me on the right medication. I feel like SKIIN possibly saved my life by catching my arrhythmia early.",
      name: "Maria",
      title: "58, Zürich",
      image: "/assets/images/1f227914-01f4-49cb-9a48-3f39976b4898.png"
    },
    {
      quote: "I called my telemedicine center and they referred me to SKIIN. Within days I got the device at home. It was easy to use – I even wore it while biking. The report found some heart pauses at night. I'm grateful we found out in a non-invasive way instead of in an emergency.",
      name: "Thomas",
      title: "62, Bern (Telmed Plan)",
      image: "/assets/images/21284932-ea0e-4aef-b6ba-99d0199e8fa2.png"
    },
    {
      quote: "Je voulais juste vérifier, pour être rassurée. SKIIN was very reassuring. The results were normal, thankfully, and now I have that baseline record of my heart. The team also taught me a lot about my heart rhythm. C'était simple et efficace.",
      name: "Sabine",
      title: "45, Genève (Self-Pay Screening)",
      image: "/assets/images/2c470df9-6b84-48a2-b3f4-d958760f8b36.png"
    }
  ];

  const physicianTestimonials = [
    {
      quote: "SKIIN has become an indispensable tool in my practice. For patients with elusive palpitations, it offers a convenient solution – they no longer need to queue for a hospital Holter appointment. The diagnostic yield has improved; I've identified cases of AFib and even high-grade AV block that I doubt we would have caught otherwise. What I appreciate as a GP is that SKIIN handles the technical workload: they provide a clear report signed by a cardiologist, which I can then discuss with my patient. It integrates perfectly – it's Holter monitoring upgraded for the 21st century.",
      name: "Dr. Peter Reinhardt",
      title: "General Practitioner, Luzern",
      image: "/assets/images/32de0ca4-a556-4e60-bfaf-fc48bf4bd27c.png"
    },
    {
      quote: "Initially, I was skeptical of any new wearable ECG. But SKIIN has truly proven itself. The ECG data quality is on par with traditional Holters, and the extended duration means we catch arrhythmias that a 24h monitor misses. I had a patient with cryptogenic stroke – the 10-day SKIIN finally caught an AFib episode on day 7, confirming the need for anticoagulation. The device's patient acceptance is high; they find it comfortable, which means compliance is excellent (over 90% wear time). As a cardiologist, I also value that I can log into the portal to examine any raw ECG strip if I want. SKIIN has enhanced our diagnostic process and I foresee extended monitoring becoming a new standard of care for certain patients.",
      name: "Dr. Simone Dubois",
      title: "Cardiologist, CHUV Lausanne",
      image: "/assets/images/40ba1015-dfac-4b19-9548-8f3319ffe098.png"
    }
  ];

  const telemedicineTestimonial = {
    quote: "For our telemedicine service, SKIIN has been a game-changer. We can manage patients with palpitations end-to-end. I recently had a patient call with episodes of tachycardia. I arranged SKIIN for him through our system; we got results showing an SVT which we then managed with a specialist. The patient never had to visit a clinic physically until ablation – we coordinated everything remotely. It's efficient for us and satisfying for the patient. Plus, it keeps us compliant with Telmed model rules while offering advanced care.",
    name: "Dr. Andreas Keller",
    title: "Telemedicine Provider",
    image: "/assets/images/72de88b6-6f7b-4e58-abb2-dc50a762a353.png"
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="container-custom section-padding">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Patient Stories & Doctor Testimonials</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Nothing speaks to the efficacy of SKIIN better than the voices of those who use it
            </p>
          </div>

          {/* Patient Stories Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <Heart className="h-12 w-12 text-myant-green mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Patient Stories</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We've helped many individuals across Switzerland take charge of their heart health. 
                Here are some of their experiences:
              </p>
            </div>

            <div className="space-y-8">
              {patientStories.map((story, index) => (
                <DoctorQuote
                  key={index}
                  quote={story.quote}
                  name={story.name}
                  title={story.title}
                  image={story.image}
                />
              ))}
            </div>

            <Card className="mt-8 bg-secondary/30">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  <strong>Privacy Note:</strong> We always obtain patient consent for sharing their stories, 
                  and in some cases change names or details to protect privacy. The genuine gratitude and 
                  relief in these voices underscore why we do what we do.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Physician Endorsements Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <Stethoscope className="h-12 w-12 text-myant-green mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Physician Endorsements</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Swiss healthcare professionals have voiced their support for SKIIN after seeing 
                the impact on their practice:
              </p>
            </div>

            <div className="space-y-8 mb-12">
              {physicianTestimonials.map((testimonial, index) => (
                <DoctorQuote
                  key={index}
                  quote={testimonial.quote}
                  name={testimonial.name}
                  title={testimonial.title}
                  image={testimonial.image}
                />
              ))}
            </div>

            {/* Key Benefits Highlighted */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-myant-green mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Improved Patient Care</h3>
                  <p className="text-sm text-muted-foreground">
                    Better diagnostic yield and convenient access for patients
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Heart className="h-8 w-8 text-myant-green mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Enhanced Detection</h3>
                  <p className="text-sm text-muted-foreground">
                    Catching arrhythmias that shorter monitoring periods miss
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Stethoscope className="h-8 w-8 text-myant-green mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Workflow Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Seamless integration into existing clinical workflows
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Telemedicine Testimonial */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <Video className="h-12 w-12 text-myant-green mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Telemedicine Success</h2>
            </div>
            
            <DoctorQuote
              quote={telemedicineTestimonial.quote}
              name={telemedicineTestimonial.name}
              title={telemedicineTestimonial.title}
              image={telemedicineTestimonial.image}
            />
          </div>

          {/* Impact Statistics */}
          <Card className="mb-16">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-center mb-8">Real-World Impact</h2>
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-myant-green mb-2">90%+</div>
                  <p className="text-sm text-muted-foreground">Patient Compliance Rate</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-myant-green mb-2">7x</div>
                  <p className="text-sm text-muted-foreground">Higher Detection vs 24h Holter</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-myant-green mb-2">100%</div>
                  <p className="text-sm text-muted-foreground">Physician Satisfaction</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-myant-green mb-2">500+</div>
                  <p className="text-sm text-muted-foreground">Patients Monitored</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Future Plans */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Expanding Our Stories</h2>
            <p className="text-lg max-w-4xl mx-auto mb-8">
              We continuously collect and share new testimonials as we receive them. Our future 
              plans include short video testimonials – 2-minute videos with patients describing 
              their experience and doctors speaking about critical findings that SKIIN helped identify.
            </p>
            <div className="flex justify-center space-x-4">
              <Badge variant="outline" className="text-base px-4 py-2">
                <Video className="h-4 w-4 mr-2" />
                Video Testimonials Coming Soon
              </Badge>
              <Badge variant="outline" className="text-base px-4 py-2">
                <MapPin className="h-4 w-4 mr-2" />
                Stories from All Swiss Cantons
              </Badge>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Testimonials;