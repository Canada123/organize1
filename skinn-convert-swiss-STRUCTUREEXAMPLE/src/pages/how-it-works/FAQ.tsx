import React, { useState } from 'react';
import { Search, User, Stethoscope, CreditCard, Settings } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const patientFAQs = [
    {
      category: "Getting Started",
      icon: User,
      questions: [
        {
          question: "Is SKIIN covered by my insurance?",
          answer: "Yes, SKIIN is generally covered by Swiss basic health insurance when medically indicated (prescribed by a doctor due to symptoms or risk factors). Coverage depends on your insurance model: Standard model allows direct access, while GP model, HMO, and Telmed require going through your designated healthcare provider first."
        },
        {
          question: "How do I get a SKIIN monitor?",
          answer: "You can get SKIIN through your doctor's prescription or by using our eligibility checker. We'll help coordinate with a physician if needed. The process varies by insurance model - standard insurance allows direct access, while GP/HMO/Telmed models require going through your designated provider first."
        },
        {
          question: "How long does it take to receive the device?",
          answer: "Once ordered, the SKIIN kit is typically shipped within 1-2 business days and arrives via Swiss Post. Emergency orders can be expedited. You'll receive tracking information to monitor delivery status."
        }
      ]
    },
    {
      category: "Using the Device",
      icon: Settings,
      questions: [
        {
          question: "Can I shower or bathe with SKIIN?",
          answer: "The garment is water-resistant, but you should remove the sensor pod before showering. Simply unsnap the pod (takes seconds), shower normally, then reattach it immediately after. The textile band dries quickly. Do not swim or submerge the device."
        },
        {
          question: "Is it comfortable to sleep in?",
          answer: "Yes, SKIIN is designed for 24/7 wear including sleep. The band is soft with no wires or hard components. The sensor pod is low-profile and won't disturb your sleep position. Most users report forgetting they're wearing it."
        },
        {
          question: "Can I exercise with SKIIN?",
          answer: "Yes, moderate exercise is encouraged as it provides valuable heart rhythm data during activity. The device is sweat-resistant and designed to stay in place during movement. For very intense exercise, there may be some motion artifacts, but our analysis can filter these out."
        },
        {
          question: "Do I need to shave my chest or use gel?",
          answer: "No messy gels are needed with SKIIN's dry electrodes. If you have very thick chest hair, light trimming might improve contact, but it's usually not necessary. The textile electrodes are designed to maintain good contact through the fabric."
        },
        {
          question: "What if I feel symptoms while wearing it?",
          answer: "If you experience symptoms like palpitations or dizziness, note the time and press the event marker in the app if available. This helps correlate symptoms with heart rhythm data. For severe symptoms like chest pain or fainting, seek immediate medical attention - SKIIN is not an emergency monitoring device."
        }
      ]
    },
    {
      category: "During Monitoring",
      icon: Settings,
      questions: [
        {
          question: "Do I need to stay near my phone?",
          answer: "No, the sensor pod can store data when your phone isn't nearby. We recommend keeping your phone within Bluetooth range (about 10 meters) a few times daily to sync data. The device will automatically upload stored data when reconnected."
        },
        {
          question: "What if the device stops working?",
          answer: "Our 24/7 support team is available if you experience any issues. Common solutions include recharging the device, checking the app connection, or adjusting the band fit. We can provide remote troubleshooting or send a replacement device if needed."
        },
        {
          question: "How often do I need to charge it?",
          answer: "The sensor pod typically needs charging every 2 days. Many users charge it during their daily shower when the pod is removed. Charging takes about 2 hours, and you'll receive low battery notifications through the app."
        },
        {
          question: "Can I travel with SKIIN?",
          answer: "Yes, you can travel normally with SKIIN. Carry the charging cable and ensure you have data/WiFi for app syncing. For international travel, inform our support team so we can assist with any connectivity issues. The device is safe for airport security."
        }
      ]
    },
    {
      category: "Results & Follow-up",
      icon: Settings,
      questions: [
        {
          question: "When will I get my results?",
          answer: "Results are typically available within 24-48 hours after returning the device. Your doctor will receive the comprehensive report first and will contact you to discuss the findings. You can also receive a copy for your records."
        },
        {
          question: "What if something urgent is found?",
          answer: "While SKIIN is not real-time monitoring, if our analysis detects potentially serious arrhythmias, we expedite the review and immediately contact your referring physician. For life-threatening symptoms during monitoring, always seek emergency care immediately."
        },
        {
          question: "How do I return the device?",
          answer: "Use the pre-paid return envelope or box included in your kit. Simply pack the sensor pod and band, seal the package, and drop it at any Swiss Post location. Return shipping is free and already addressed to our processing center."
        },
        {
          question: "What if my results are normal but I still have symptoms?",
          answer: "Normal SKIIN results mean no significant arrhythmias were detected during the monitoring period. Your doctor may recommend other tests, repeat monitoring in the future, or explore other causes for your symptoms. Some arrhythmias are very intermittent."
        }
      ]
    }
  ];

  const physicianFAQs = [
    {
      category: "Ordering & Prescription",
      icon: Stethoscope,
      questions: [
        {
          question: "How do I prescribe SKIIN for my patient?",
          answer: "You can order SKIIN through our physician portal, by calling our medical liaison team, or using our standard prescription form. Simply provide patient details, indication, and monitoring duration. We handle device logistics and patient coordination."
        },
        {
          question: "What are the medical indications for 10-day monitoring?",
          answer: "Extended monitoring is indicated for intermittent symptoms (palpitations, syncope, presyncope), arrhythmia screening in high-risk patients, post-ablation monitoring, cryptogenic stroke workup, and evaluation of antiarrhythmic therapy effectiveness."
        },
        {
          question: "Do I need special training to offer SKIIN?",
          answer: "No special training is required. We provide orientation materials and can arrange a brief demo of the physician portal. Patient education and device fitting instructions are provided, though many physicians let us handle direct-to-patient delivery and support."
        },
        {
          question: "Can I keep SKIIN devices in my office?",
          answer: "Yes, we can provide clinic inventory for immediate patient dispensing. Alternatively, we offer direct-to-patient shipping which eliminates inventory management. Most practices prefer the shipping model for convenience."
        }
      ]
    },
    {
      category: "Clinical Workflow",
      icon: Settings,
      questions: [
        {
          question: "How is SKIIN billed and reimbursed?",
          answer: "SKIIN is billed using standard TARMED codes for Holter monitoring. We can bill insurers directly with your prescription, or you can bill through your practice. The technical and interpretation components are covered like any standard Holter test."
        },
        {
          question: "Who interprets the SKIIN reports?",
          answer: "Every SKIIN report is reviewed by a Swiss-licensed cardiologist. You can choose to have our network cardiologist interpret the study, or if you prefer, we can provide the raw data for your own interpretation. We offer flexibility to match your practice model."
        },
        {
          question: "What's included in the SKIIN report?",
          answer: "Reports include rhythm summary, arrhythmia burden, heart rate trends, significant event strips, clinical correlation, and recommendations. Full disclosure data is available if you want to review specific segments. Reports are delivered via secure portal or direct integration with your EMR."
        },
        {
          question: "How quickly can I get results?",
          answer: "Standard turnaround is 24-48 hours after device return. For urgent cases, we can expedite analysis. Preliminary findings can be available sooner if needed for clinical decision-making."
        }
      ]
    },
    {
      category: "Technical & Integration",
      icon: Settings,
      questions: [
        {
          question: "Can SKIIN integrate with my EMR system?",
          answer: "We provide reports in PDF format compatible with all EMR systems. For practices with specific integration needs, we can discuss HL7 feeds or API connections. Our goal is seamless workflow integration."
        },
        {
          question: "What arrhythmias can SKIIN detect?",
          answer: "SKIIN detects all major arrhythmias including atrial fibrillation/flutter, bradycardias (sinus pauses, AV blocks), tachycardias (SVT, VT), PVC burden, and other rhythm abnormalities. It's optimized for rhythm analysis rather than ischemia detection."
        },
        {
          question: "How does SKIIN handle artifacts and noise?",
          answer: "Our AI algorithms are trained to distinguish true cardiac signals from artifacts. The snug textile fit reduces motion artifacts compared to traditional Holters. Human reviewers verify all findings to ensure clinical accuracy."
        },
        {
          question: "Can patients with pacemakers use SKIIN?",
          answer: "Yes, SKIIN works with pacemakers and ICDs. The system will record paced rhythms and can still detect breakthrough arrhythmias like atrial fibrillation. Reports will note the presence of pacing and interpret findings accordingly."
        }
      ]
    },
    {
      category: "Practice Management",
      icon: CreditCard,
      questions: [
        {
          question: "What are the costs to my practice?",
          answer: "There are no upfront costs or fees to your practice. SKIIN is reimbursed through insurance billing just like traditional Holters. We handle device logistics, patient support, and analysis - reducing your administrative burden."
        },
        {
          question: "How do I track my patients using SKIIN?",
          answer: "Our physician portal provides real-time status updates on all your SKIIN patients: device shipped, monitoring in progress, analysis complete, etc. You'll receive notifications at key milestones and can access reports immediately when available."
        },
        {
          question: "What support do you provide to my patients?",
          answer: "We provide comprehensive patient support including device instructions, 24/7 technical support, app troubleshooting, and return logistics. This reduces calls to your office and ensures successful monitoring completion."
        },
        {
          question: "Can I see the raw ECG data if needed?",
          answer: "Absolutely. While we provide comprehensive interpreted reports, full disclosure ECG data is available through our secure portal. You can review any time segment or specific events as needed for your clinical assessment."
        }
      ]
    }
  ];

  const allFAQs = [...patientFAQs, ...physicianFAQs];

  const filteredFAQs = allFAQs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container-custom">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl font-bold mb-6">Frequently Asked Questions</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Get answers to common questions about SKIIN monitoring. 
                Everything you need to know from setup to results.
              </p>
              
              {/* Search */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16">
          <div className="container-custom">
            <Tabs defaultValue="patients" className="max-w-6xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="patients" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  For Patients
                </TabsTrigger>
                <TabsTrigger value="physicians" className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  For Healthcare Providers
                </TabsTrigger>
              </TabsList>

              <TabsContent value="patients">
                <div className="space-y-6">
                  {filteredFAQs.filter(category => 
                    patientFAQs.some(patientCat => patientCat.category === category.category)
                  ).map((category, categoryIndex) => (
                    <div key={categoryIndex}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-primary/10 w-8 h-8 rounded-lg flex items-center justify-center">
                          <category.icon className="h-5 w-5 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold">{category.category}</h2>
                        <Badge variant="outline">{category.questions.length}</Badge>
                      </div>
                      
                      <Accordion type="single" collapsible className="space-y-2">
                        {category.questions.map((faq, index) => (
                          <AccordionItem 
                            key={index} 
                            value={`patient-${categoryIndex}-${index}`}
                            className="bg-background rounded-lg px-6 border"
                          >
                            <AccordionTrigger className="text-left font-medium">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="physicians">
                <div className="space-y-6">
                  {filteredFAQs.filter(category => 
                    physicianFAQs.some(physicianCat => physicianCat.category === category.category)
                  ).map((category, categoryIndex) => (
                    <div key={categoryIndex}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-primary/10 w-8 h-8 rounded-lg flex items-center justify-center">
                          <category.icon className="h-5 w-5 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold">{category.category}</h2>
                        <Badge variant="outline">{category.questions.length}</Badge>
                      </div>
                      
                      <Accordion type="single" collapsible className="space-y-2">
                        {category.questions.map((faq, index) => (
                          <AccordionItem 
                            key={index} 
                            value={`physician-${categoryIndex}-${index}`}
                            className="bg-background rounded-lg px-6 border"
                          >
                            <AccordionTrigger className="text-left font-medium">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Quick Contact */}
            <div className="mt-16 bg-muted/30 rounded-lg p-8 text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
              <p className="text-muted-foreground mb-6">
                Our support team is available 24/7 to help with any questions 
                about SKIIN monitoring, device setup, or technical issues.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Phone:</span>
                  <span>0800-754-462</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Email:</span>
                  <span>support@skiin.ch</span>
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

export default FAQ;