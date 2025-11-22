
export const homeTranslations = {
  hero: {
    badge: "MDR Class IIa Certified • Swissmedic Registered",
    // Copy Variants for Testing
    variants: {
      // Default - New user-specified copy
      default: {
        badge: "Your health matters — to more than just you",
        headline: "Most Heart Issues are silent",
        subheadline: "Screen Smarter, Live Longer",
        aboveCta: "Detect silent heart issues before they steal precious moments. Protect yourself and those who love you.",
        eligibilityText: "Take 5 minutes to check your eligibility",
        ctaPrimary: "Start your free heart check",
        ctaSecondary: "Questions? Read our FAQ →"
      },
      // Variant A - Original dual-split copy
      original: {
        badge: "Certified Medical Device • Myant Technology",
        headline: "Live Younger, Longer.",
        subheadline: "Screen Smarter, from Home",
        aboveCta: "Detect silent heart issues before they steal precious moments. Protect yourself and those who love you.",
        eligibilityText: "Take 5 minutes to check your eligibility",
        ctaPrimary: "Start Your Free Heart Check",
        ctaSecondary: "Questions? Read our FAQ →"
      },
      // Legacy variants for backward compatibility
      variantA: {
        headline: "Heart Disease Is the #1 Killer — When Was Your Last Heart Check?",
        subheadline: "70% of arrhythmias show no symptoms. Left undetected, they can cause strokes or heart failure. Now you can screen your heart — safely, easily, from home.",
        emotionalSubheadline: "Longevity means more birthdays — for you, and for those who love you most. Start protecting your heart today."
      },
      variantB: {
        headline: "Live Longer. Screen Smarter. From Home.",
        subheadline: "Traditional heart monitors are uncomfortable and miss up to 91% of irregular rhythms. SKIIN's soft garment monitors continuously for 10 days — catching what others miss.",
        emotionalSubheadline: "Add years to your life, and life to your years. Comfortable cardiac screening is finally here."
      },
      variantC: {
        headline: "Your Heart. Your Family. Your Control.",
        subheadline: "Every undetected arrhythmia is a risk to you — and a worry for those who love you. Take control with comfortable, comprehensive cardiac screening from home.",
        emotionalSubheadline: "Because your heart beats for more than just you. Protect it for yourself and those who need you most."
      }
    },
    // Legacy A/B Testing Variants for backward compatibility
    variantA: {
      headline: "Heart Disease Is the #1 Killer — When Was Your Last Heart Check?",
      subheadline: "70% of arrhythmias show no symptoms. Left undetected, they can cause strokes or heart failure. Now you can screen your heart — safely, easily, from home.",
      emotionalSubheadline: "Longevity means more birthdays — for you, and for those who love you most. Start protecting your heart today."
    },
    variantB: {
      headline: "Live Longer. Screen Smarter. From Home.",
      subheadline: "Traditional heart monitors are uncomfortable and miss up to 91% of irregular rhythms. SKIIN's soft garment monitors continuously for 10 days — catching what others miss.",
      emotionalSubheadline: "Add years to your life, and life to your years. Comfortable cardiac screening is finally here."
    },
    variantC: {
      headline: "Your Heart. Your Family. Your Control.",
      subheadline: "Every undetected arrhythmia is a risk to you — and a worry for those who love you. Take control with comfortable, comprehensive cardiac screening from home.",
      emotionalSubheadline: "Because your heart beats for more than just you. Protect it for yourself and those who need you most."
    },
    // Common CTAs for all variants
    cta: {
      primary: "Start Your Free Assessment",
      secondary: "Check Insurance Coverage",
      tertiary: "Questions? Read our FAQ →"
    },
    // Value props updated to 10-day
    valueProps: {
      comfort: "No wires, no patches – 10 days of comfortable wear",
      insurance: "Covered by basic insurance",
      lifestyle: "Wear at home, live your life"
    },
    // Social proof updated
    socialProof: {
      patients: "500+ Patients",
      patientsText: "have already benefited from SKIIN",
      compliance: "94% Compliance",
      complianceText: "Rate"
    },
    // Stats cards updated
    statsCards: {
      monitoring: {
        value: "10",
        label: "Days Monitoring"
      },
      detection: {
        value: "66%",
        label: "Better Detection"
      }
    }
  },
  // v7.2 Evidence-based Statistics
  statistics: {
    title: "Clinical Evidence Shows Extended Monitoring Works",
    subtitle: "Silent heart conditions are more common than you think — and extended monitoring catches what shorter tests miss.",
    cards: [
      {
        value: "70%",
        label: "of atrial fibrillation episodes occur without symptoms",
        footnote: "Silent AF can lead to strokes if undetected"
      },
      {
        value: "20-30%",
        label: "of ischaemic strokes are attributed to atrial fibrillation",
        footnote: "Early detection can prevent life-threatening events"
      },
      {
        value: "66% vs 9%",
        label: "Detection rate with extended monitoring vs a 24-hour Holter",
        footnote: "10-day monitoring catches 7x more arrhythmias"
      }
    ],
    footnote: "Clinical evidence shows that extended monitoring detects significantly more arrhythmias than traditional 24-hour tests",
    evidenceLink: "View Clinical Evidence"
  },
  // v7.2 Product Section - 8 Benefits
  productSection: {
    title: "Why SKIIN Leads in Cardiac Monitoring",
    subtitle: "Eight ways SKIIN transforms heart health monitoring for better outcomes",
    benefits: [
      {
        title: "Extended Heart Screening for Deeper Insight",
        description: "Replace short, 24–48-hour tests with extended monitoring (typically 10 days) to catch elusive arrhythmias. Continuous ECG recording provides a richer dataset, enabling cardiologists to detect intermittent events that would otherwise be missed."
      },
      {
        title: "Shortened Wait Times & Earlier Detection",
        description: "Rapid shipping and same-day setup mean you begin monitoring quickly. Early detection of arrhythmias and hypertension allows for timely intervention and reduces the risk of stroke or heart failure."
      },
      {
        title: "Swift, Seamless Referrals",
        description: "Our digital workflow connects you, your GP and specialists without complicated logistics. Referral forms and report sharing are integrated into the MVCP, enabling cardiologists to receive data promptly and act on critical findings."
      },
      {
        title: "Comfortable Textile-Based SKIIN Band",
        description: "A soft, adhesive-free band is shipped directly to your home. It feels like everyday clothing, is water-resistant and hypoallergenic, and can be removed briefly for showers or exercise. This improves compliance and user experience."
      },
      {
        title: "AI-Powered Precision",
        description: "Data are processed by advanced software trained on millions of ECGs. MediCalgorithmics' DeepRhythm Platform combines convolutional neural networks and transformer models to flag irregular events with high accuracy and generates clear, concise reports that include arrhythmia classification, heart-rate variability and event timelines."
      },
      {
        title: "Fast Turnaround",
        description: "Most results are returned within 24–48 hours after study completion. Cardiologists review AI-flagged events and provide personalised recommendations, ensuring you receive actionable insights quickly."
      },
      {
        title: "Proven Technology",
        description: "Thousands of studies have been completed using SKIIN's platform, trusted by leading clinics and dozens of respected cardiologists. The system delivers medical-grade accuracy while maintaining comfort and convenience."
      },
      {
        title: "Health Canada Licensed",
        description: "In addition to MDR Class IIa certification and Swissmedic registration, SKIIN technology is licensed by Health Canada, meeting rigorous North American medical standards."
      }
    ],
    closing: "Data flows securely from the SKIIN app to our ISO/IEC 27001-certified cloud, where AI and Swiss cardiologists work together to deliver clear, actionable reports."
  },
  // v7.2 Numbers Section - Key Metrics
  numbersSection: {
    title: "SKIIN by the Numbers",
    subtitle: "Proven technology delivering real results for cardiac care",
    metrics: [
      {
        value: "95%",
        label: "Detection Accuracy",
        description: "Our AI algorithms detect arrhythmias with clinical-grade precision"
      },
      {
        value: "10 Days",
        label: "Continuous Monitoring",
        description: "Extended monitoring catches irregular rhythms that 24-hour tests miss"
      },
      {
        value: "100%",
        label: "Insurance Coverage",
        description: "Fully covered by Swiss basic insurance when medically prescribed"
      },
      {
        value: "24/7",
        label: "Real-Time Analysis",
        description: "Continuous data transmission enables timely intervention when needed"
      }
    ]
  },
  // v7.2 Clinically Proven Technology Section
  clinicallyProvenTech: {
    title: "Clinically Proven Technology",
    subtitle: "Backed by rigorous clinical studies and trusted by leading cardiologists",
    trustMarkers: [
      {
        title: "98.6% Accuracy Rate",
        description: "Clinical validation shows SKIIN matches traditional Holter monitor accuracy while providing superior comfort and extended monitoring"
      },
      {
        title: "Published Research",
        description: "Our technology has been validated in multiple peer-reviewed studies published in leading cardiovascular journals"
      },
      {
        title: "MDR Class IIa & CE Certified",
        description: "SKIIN meets the highest European medical device standards for safety, efficacy, and quality management"
      },
      {
        title: "Cardiologist Endorsed",
        description: "Recommended by leading Swiss cardiologists and electrophysiologists for comprehensive cardiac assessment"
      }
    ],
    cta: "View Clinical Evidence"
  },
  // v7.2 Care360 Section - Technology Overview
  care360Section: {
    title: "Revolutionary Myant Care360 Technology",
    subtitle: "Experience the future of heart health monitoring",
    description: "Our breakthrough 360° monitoring system combines continuous data capture with AI-powered analysis for unprecedented cardiac care. The SKIIN platform delivers medical-grade accuracy while maintaining the comfort of everyday clothing.",
    features: [
      "10-day continuous monitoring with clinical-grade ECG",
      "Real-time AI analysis of heart rhythm patterns",
      "Swiss cardiologist validation of all findings",
      "Medical-grade accuracy in a comfortable garment",
      "Seamless data transmission to your healthcare team",
      "Comprehensive reports with actionable insights",
      "Integration with existing healthcare workflows"
    ],
    cta: "Learn More About Our Technology",
    imagePlaceholder: "[SKIIN Product Collage - Device, App, Portal]"
  },
  // Home Holter Study - Care360 Technology
  care360HomeHolter: {
    badge: "Home-Based Holter Study",
    title: "Revolutionary Care360° Technology",
    subtitle: "Experience the future of cardiac monitoring - comprehensive, comfortable, and completely from home",
    processTitle: "Your Complete Home Holter Study Process",
    processSteps: [
      {
        title: "Order Your Kit from Home",
        description: "Simple online eligibility check and ordering. Your cardiac monitoring kit arrives at your door within 2-3 business days."
      },
      {
        title: "Wear the Comfortable SKIIN Garment",
        description: "Put on the soft textile band - no adhesives, no wires. Wear it continuously for up to 10 days, even in the shower."
      },
      {
        title: "Automatic Data Upload",
        description: "The SKIIN device automatically syncs your heart data to our secure Swiss cloud. No manual intervention needed."
      },
      {
        title: "AI Analysis + Cardiologist Review",
        description: "Advanced algorithms analyze millions of heartbeats, then Swiss cardiologists validate every finding for accuracy."
      },
      {
        title: "Receive Your Medical Report",
        description: "Get your comprehensive cardiac report within 48 hours. Clear results with actionable recommendations from specialists."
      },
      {
        title: "Follow-up Care Coordination",
        description: "If needed, we connect you with cardiologists for follow-up care. Your data is securely shared with your healthcare team."
      }
    ],
    bottomText: "Join the thousands who have already experienced the convenience and accuracy of home-based cardiac monitoring",
    cta: "Start Your Home-Based Holter Study"
  },
  // v7.2 Tech Carousel - Data Flow
  techCarousel: {
    title: "From Sensor to Solution",
    subtitle: "See how SKIIN transforms your heart data into actionable insights",
    steps: [
      {
        title: "Continuous Sensing",
        description: "Medical-grade ECG sensors embedded in soft textile continuously monitor your heart rhythm",
        icon: "sensor"
      },
      {
        title: "SKIIN App",
        description: "Data transmits securely via Bluetooth to your smartphone for real-time monitoring",
        icon: "app"
      },
      {
        title: "Secure Cloud",
        description: "ISO/IEC 27001-certified infrastructure ensures your data is protected and compliant",
        icon: "cloud"
      },
      {
        title: "AI Analysis",
        description: "Advanced algorithms trained on millions of ECGs detect irregularities with 95% accuracy",
        icon: "ai"
      },
      {
        title: "Cardiologist Review",
        description: "Swiss cardiologists validate findings and create personalized recommendations",
        icon: "report"
      }
    ]
  },
  // Home-2 Specific Content
  home2: {
    hero: {
      badge: "Certified by the Federal Office of Public Health (BAG)",
      title: "Live longer, younger.",
      subtitle: "Revolutionary heart health through AI-powered 10-day monitoring",
      cta: "Get Started Now",
      bookAssessment: "Book Assessment"
    },
    stats: {
      title: "Why Early Detection is Critical",
      subtitle: "Heart disease is the leading cause of death worldwide. Early detection saves lives.",
      items: [
        { number: "70%", text: "of heart rhythm disorders go unnoticed" },
        { number: "30%", text: "of people with atrial fibrillation suffer a stroke" },
        { number: "50%", text: "more heart rhythm disorders detected with 10-day monitoring" }
      ]
    },
    clinicalEvidence: {
      title: "Clinically Proven Technology",
      subtitle: "Backed by rigorous clinical studies and peer-reviewed research",
      items: [
        {
          title: "98.6% Accuracy Rate",
          description: "Clinical validation shows SKIIN matches traditional Holter monitor accuracy while providing superior comfort"
        },
        {
          title: "Published Research",
          description: "Our technology has been validated in multiple peer-reviewed studies and clinical trials"
        },
        {
          title: "FDA & CE Certified",
          description: "SKIIN meets the highest medical device standards for safety and efficacy"
        },
        {
          title: "Cardiologist Endorsed",
          description: "Recommended by leading Swiss cardiologists and electrophysiologists"
        }
      ]
    },
    features: {
      title: "AI-Measured, Cardiologist-Evaluated",
      subtitle: "Fully covered by Swiss health insurance",
      items: [
        {
          title: "Comfortable Monitoring",
          description: "Perform a Holter ECG comfortably from home with our SKIIN device"
        },
        {
          title: "AI Analysis",
          description: "Advanced AI algorithms continuously analyze your heart rhythm data"
        },
        {
          title: "Cardiology Expertise",
          description: "Swiss cardiologists evaluate your results and create detailed reports"
        },
        {
          title: "Insurance Coverage",
          description: "Recognized and fully covered by Swiss insurance providers"
        }
      ]
    },
    technology: {
      title: "Revolutionary Myant Care360 Technology",
      subtitle: "Experience the future of heart health monitoring",
      description: "Our breakthrough 360° monitoring system combines continuous data capture with AI-powered analysis for unprecedented cardiac care.",
      features: [
        "10-day continuous monitoring",
        "Real-time AI analysis",
        "Swiss cardiologist validation",
        "Medical-grade accuracy",
        "Seamless data transmission"
      ]
    },
    patientJourney: {
      title: "Your Heart Health Journey",
      subtitle: "From assessment to peace of mind in 5 simple steps",
      steps: [
        { 
          number: "1", 
          title: "Complete Assessment", 
          description: "Fill out our comprehensive self-referral form to determine if SKIIN is right for you",
          duration: "5 minutes"
        },
        { 
          number: "2", 
          title: "Receive Your Device", 
          description: "We deliver the SKIIN Holter ECG kit directly to your door with detailed instructions",
          duration: "24-48 hours"
        },
        { 
          number: "3", 
          title: "Start Monitoring", 
          description: "Wear the comfortable SKIIN device for 10 days while living your normal life",
          duration: "10 days"
        },
        { 
          number: "4", 
          title: "Data Analysis", 
          description: "Our AI systems and Swiss cardiologists analyze your comprehensive heart data",
          duration: "3-5 days"
        },
        { 
          number: "5", 
          title: "Get Your Results", 
          description: "Receive a detailed cardiac health report with personalized recommendations",
          duration: "Same day"
        }
      ]
    },
    insurance: {
      title: "Comprehensive Insurance Coverage",
      subtitle: "SKIIN is recognized and covered by Swiss health insurance when medically prescribed",
      description: "Navigate the Swiss healthcare system with confidence. Our team helps ensure proper coverage for your cardiac monitoring needs.",
      benefits: [
        "Covered by basic insurance when prescribed",
        "No out-of-pocket costs for qualifying patients",
        "Reimbursement support included",
        "Direct billing available"
      ]
    },
    riskAssessment: {
      title: "Know Your Heart Risk",
      subtitle: "Understanding your cardiovascular risk can save your life",
      risks: [
        {
          title: "Silent Atrial Fibrillation",
          description: "Often asymptomatic but increases stroke risk by 5x",
          prevalence: "Affects 1 in 4 adults over 40"
        },
        {
          title: "Cardiac Arrhythmias",
          description: "Irregular heartbeats that can be life-threatening if undetected",
          prevalence: "2.7 million Americans live with AFib"
        },
        {
          title: "Heart Disease Prevention",
          description: "Early detection enables preventive treatment and lifestyle changes",
          prevalence: "Leading cause of death worldwide"
        }
      ]
    },
    cta: {
      title: "Take Control of Your Heart Health Today",
      subtitle: "Join thousands of Swiss patients already benefiting from advanced cardiac monitoring",
      description: "Take control of your heart health with the most comfortable and comprehensive monitoring solution available.",
      primaryButton: "Get Started Now",
      secondaryButton: "Book Free Consultation"
    }
  },
  features: {
    title: "A New Standard in Cardiac Monitoring",
    subtitle: "SKIIN combines breakthrough textile computing with clinical expertise to deliver unparalleled cardiac care",
    items: [
      {
        title: "Continuous ECG",
        description: "Clinical-grade ECG monitoring for up to 10 days without interruption"
      },
      {
        title: "Comfortable Design",
        description: "Soft, breathable fabric with invisible sensors – no wires or adhesives"
      },
      {
        title: "Arrhythmia Detection",
        description: "Advanced algorithms to detect and alert on irregular heartbeats"
      },
      {
        title: "Real-time Analysis",
        description: "Instant data transmission to physicians for timely intervention"
      },
      {
        title: "Everyday Usability",
        description: "Washable, reusable, and designed to be part of daily life"
      },
      {
        title: "Doctor Connected",
        description: "Seamlessly integrated with clinical workflows and EHR systems"
      }
    ]
  },
  howItWorks: {
    tagline: "Simple Process",
    title: "How SKIIN Works",
    subtitle: "Designed to fit seamlessly into your life while providing clinical-grade cardiac monitoring",
    steps: [
      {
        number: "01",
        title: "Referral",
        description: "Get a referral from your doctor or start with our eligibility check"
      },
      {
        number: "02",
        title: "Delivery",
        description: "Receive your SKIIN kit delivered directly to your home"
      },
      {
        number: "03",
        title: "Wear",
        description: "Wear the comfortable SKIIN device for up to 10 days - easily removable for showers"
      },
      {
        number: "04",
        title: "AI Analysis & Cardiologist Review",
        description: "Advanced AI algorithms detect irregularities, validated by Swiss cardiologists for accuracy"
      },
      {
        number: "05",
        title: "Results",
        description: "Receive your detailed report within 48 hours and discuss with your doctor"
      }
    ],
    cta: "Learn More About the Process"
  },
  testimonials: {
    tagline: "Testimonials",
    title: "Trusted by Doctors and Patients",
    subtitle: "Hear from healthcare providers and patients who have experienced the benefits of SKIIN",
    items: [
      {
        quote: "After years of awkward Holter monitors, I forgot I was wearing SKIIN. Ten days went by, and my cardiologist finally found the arrhythmia that caused my dizziness.",
        name: "The Holter Veteran",
        title: "Patient, Basel"
      },
      {
        quote: "My father never complains, so I ordered SKIIN for him. The assessment was free, and the report uncovered high blood pressure at night. We changed his medication before anything serious happened.",
        name: "A Daughter's Gift",
        title: "Caregiver, Zurich"
      },
      {
        quote: "Adhesive patches always irritated my skin. SKIIN's soft band was a relief. I wore it through daily life—even during yoga—and the report reassured me.",
        name: "Sensitive Skin & Peace of Mind",
        title: "Patient, Geneva"
      }
    ]
  },
  comparison: {
    tagline: "Comparison",
    title: "How SKIIN Compares",
    subtitle: "See how SKIIN Smart Garments compare to traditional cardiac monitoring solutions",
    columns: {
      feature: "Feature",
      skiin: "SKIIN",
      skiinSubtitle: "Smart Garment",
      holter: "Holter Monitor",
      holterSubtitle: "Traditional",
      event: "Event Monitor",
      eventSubtitle: "Patch-based"
    },
    features: [
      "Continuous Monitoring",
      "10-Day Wear Period",
      "No Adhesives or Wires",
      "Washable & Reusable",
      "Real-time Data Transmission",
      "AI-powered Arrhythmia Detection",
      "Patient Comfort for Long-term Wear"
    ]
  },
  cta: {
    title: "Ready to transform cardiac monitoring?",
    description: "Whether you're a healthcare provider looking to offer better cardiac care or a patient seeking a more comfortable monitoring solution, SKIIN is ready for you.",
    buttons: {
      requestInfo: "Request Information",
      scheduleDemo: "Schedule a Demo"
    },
    statistic: "97% patient satisfaction rate"
  },
  problemSolution: {
    title: "The Silent Triad: Three Hidden Threats to Your Heart",
    problem: {
      title: "The Problem",
      description: "Many heart conditions hide quietly. Up to 70% of arrhythmias have no symptoms. A single 24-hour test offers only a brief snapshot, leaving you waiting and wondering. Traditional monitors are uncomfortable and disrupt daily life."
    },
    solution: {
      title: "The Solution",
      description: "SKIIN offers continuous heart-health monitoring from home. Our 10-Day Heart Screening catches irregular rhythms that 24-hour tests miss. The soft, wire-free garment feels like a second skin—water-resistant, washable and removable for showers. By combining ECG, blood pressure and sleep analysis, we monitor the Silent Triad (arrhythmia, hypertension and sleep apnoea) that often goes unnoticed."
    },
    silentTriad: {
      title: "The Silent Triad",
      items: [
        {
          title: "Arrhythmia Detection",
          icon: "ecg",
          description: "Continuous ECG monitoring catches irregular heart rhythms that appear sporadically"
        },
        {
          title: "Blood Pressure Monitoring", 
          icon: "blood-pressure",
          description: "ABPM reveals masked hypertension and dangerous nocturnal patterns"
        },
        {
          title: "Sleep Analysis",
          icon: "sleep",
          description: "Identifies sleep apnoea which increases arrhythmia risk from 53% to 92%"
        }
      ]
    },
    cta: "Start Your Free Assessment",
    linkText: "Learn about SKIIN 3X Screening™",
    comingSoon: "(Coming Soon)"
  },
  insurance: {
    title: "Coverage by Your Health Insurance",
    subtitle: "SKIIN is covered by basic insurance when medically prescribed",
    models: [
      {
        title: "GP Model",
        description: "Consult your family doctor for a SKIIN referral. Once medically prescribed, it's covered by basic insurance.",
        icon: "👨‍⚕️"
      },
      {
        title: "HMO Model", 
        description: "Visit your HMO practice first for evaluation. When approved, SKIIN is fully covered.",
        icon: "🏥"
      },
      {
        title: "Telmed Model",
        description: "Call your telemedicine hotline first. Once approved by the tele-doctor, SKIIN is covered.",
        icon: "📞"
      },
      {
        title: "Self-Pay",
        description: "For preventive screening without symptoms. Transparent pricing available.",
        icon: "💳"
      }
    ],
    cta: "Check Coverage"
  },
  faq: {
    tagline: "FAQ",
    title: "Frequently Asked Questions",
    subtitle: "Find answers to common questions about SKIIN Smart Garments",
    items: [
      {
        question: "How accurate is the ECG data from SKIIN?",
        answer: "SKIIN Smart Garments provide clinical-grade ECG data with accuracy comparable to traditional Holter monitors. Our technology has been validated in clinical studies and meets medical device regulatory requirements."
      },
      {
        question: "How long can patients wear SKIIN garments?",
        answer: "SKIIN Smart Garments can be worn for up to 10 consecutive days, providing extended cardiac monitoring. The garments are designed to be comfortable enough for day and night wear, allowing for truly continuous monitoring."
      },
      {
        question: "Are SKIIN garments covered by insurance?",
        answer: "Many insurance providers and healthcare systems cover SKIIN as a cardiac monitoring solution. Coverage varies by country and provider. We can help verify coverage for your specific situation through our reimbursement support team."
      },
      {
        question: "How do patients get SKIIN Smart Garments?",
        answer: "SKIIN Smart Garments require a prescription from a healthcare provider. Once prescribed, the SKIIN kit is delivered directly to the patient's home with simple instructions for use and care."
      },
      {
        question: "Can SKIIN detect all types of arrhythmias?",
        answer: "SKIIN is designed to detect a wide range of cardiac arrhythmias, including atrial fibrillation, bradycardia, tachycardia, and others. Our AI algorithms continuously analyze the ECG data to identify irregular patterns and alert healthcare providers when necessary."
      },
      {
        question: "How is patient data protected?",
        answer: "SKIIN takes data security seriously. All patient data is encrypted both in transit and at rest. Our systems comply with GDPR, HIPAA, and other regional data protection regulations to ensure patient privacy."
      }
    ]
  },
  contact: {
    tagline: "Get In Touch",
    title: "Contact Us",
    description: "Have questions about SKIIN or want to learn how it can benefit you or your practice? Fill out the form and our team will get back to you shortly.",
    contactInfo: {
      email: {
        title: "Email",
        content: "info@myant-health.com"
      },
      phone: {
        title: "Phone",
        content: "+41 44 123 45 67"
      },
      address: {
        title: "Address",
        content: "Bahnhofstrasse 100, 8001 Zürich, Switzerland"
      }
    },
    form: {
      name: "Name",
      namePlaceholder: "Your full name",
      email: "Email",
      emailPlaceholder: "your.email@example.com",
      phone: "Phone Number",
      phonePlaceholder: "+41 XX XXX XX XX",
      role: "I am a:",
      rolePlaceholder: "Select your role",
      roleOptions: {
        patient: "Patient",
        physician: "Physician",
        healthcareAdmin: "Healthcare Administrator",
        other: "Other"
      },
      message: "Message",
      messagePlaceholder: "How can we help you?",
      consent: "I consent to SKIIN processing my data to contact me regarding my inquiry. See our",
      privacyPolicy: "Privacy Policy",
      submit: "Send Message",
      submitting: "Submitting...",
      successTitle: "Request submitted",
      successDescription: "We'll get back to you within 24 hours."
    }
  },
  footer: {
    tagline: "Pioneering garment-based continuous cardiac monitoring for better health outcomes.",
    sections: {
      patients: {
        title: "For Patients",
        links: {
          main: "SKIIN Smart Garments",
          testimonials: "Patient Stories",
          faq: "FAQ",
          support: "Get Support"
        }
      },
      physicians: {
        title: "For Physicians",
        links: {
          main: "Clinical Solutions",
          research: "Clinical Studies",
          resources: "Resources",
          support: "Healthcare Provider Support",
          requestDemo: "Request Demo"
        }
      },
      company: {
        title: "Company",
        links: {
          about: "About Us",
          team: "Our Team",
          careers: "Careers",
          contact: "Contact",
          support: "Technical Support"
        }
      }
    },
    legal: {
      privacy: "Privacy Policy",
      terms: "Terms of Use",
      cookies: "Cookie Policy",
      rights: "All rights reserved."
    }
  }
};
