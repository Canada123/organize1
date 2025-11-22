export const eligibilityEn = {
  title: "Check Coverage",
  subtitle: "Find out in 4 simple steps if SKIIN is covered by your insurance",
  step: "Step",
  of: "of",
  
  // Step 1: Symptoms
  symptomsQuestion: "Do you have any of these symptoms?",
  symptoms: {
    palpitations: "Racing or irregular heartbeat",
    dizziness: "Dizziness or fainting",
    chestPain: "Chest pain",
    shortness: "Shortness of breath with exertion",
    none: "No symptoms (preventive care)"
  },
  
  // Step 2: Risk Factors
  riskFactorsQuestion: "Do you have any risk factors?",
  riskFactors: {
    familyHistory: "Family history of heart disease",
    hypertension: "High blood pressure",
    diabetes: "Diabetes",
    ageOver50: "Over 50 years old",
    none: "No risk factors"
  },
  
  // Step 3: Insurance Model
  insuranceModelQuestion: "Which insurance model do you have?",
  insuranceModels: {
    standard: "Standard (free choice of doctor)",
    gpModel: "GP model",
    hmo: "HMO",
    telmed: "Telemedicine",
    unsure: "Unsure"
  },
  
  // Step 4: Insurer
  insurerQuestion: "Which health insurance do you have? (Optional)",
  insurerPlaceholder: "Select insurance company",
  insurerHelp: "This information helps us give you specific guidance.",
  
  // Navigation
  back: "Back",
  next: "Next",
  showResult: "Show Result",
  
  // Results
  results: {
    covered: {
      title: "Great! SKIIN is covered",
      badge: "Basic insurance covers",
      nextStepsTitle: "Your next steps:"
    },
    consultFirst: {
      title: "SKIIN is possible - contact doctor first",
      badge: "Doctor visit required"
    },
    selfPay: {
      title: "SKIIN available for preventive care",
      badge: "Self-pay option"
    }
  },
  
  // Next Steps
  nextSteps: {
    standard: {
      step1: "Talk to your GP or cardiologist",
      step2: "Doctor prescribes SKIIN monitoring",
      step3: "SKIIN is covered by basic insurance",
      info: "With standard insurance: Go directly to doctor, no restrictions"
    },
    gpModel: {
      step1: "Contact your GP first",
      step2: "GP evaluates and refers if needed",
      step3: "SKIIN is covered after referral",
      info: "GP model: First to GP, then referral to SKIIN"
    },
    hmo: {
      step1: "Contact your HMO center",
      step2: "HMO doctor evaluates and refers",
      step3: "SKIIN is covered after HMO approval",
      info: "HMO: First contact HMO center"
    },
    telmed: {
      step1: "Call your Telemedicine hotline",
      step2: "Telemed doctor can prescribe SKIIN directly",
      step3: "Perfect for remote monitoring",
      info: "Telemedicine: Ideal for SKIIN - remote prescription possible"
    },
    unsure: {
      step1: "Check your insurance model",
      step2: "Contact us for advice",
      step3: "We'll help with the right approach"
    },
    selfPay: {
      step1: "SKIIN available as preventive screening",
      step2: "Cost: approx. CHF 399 (self-pay)",
      step3: "Schedule consultation appointment",
      info: "Without symptoms/risks: Usually self-pay, but valuable prevention"
    }
  },
  
  // CTAs
  bookConsultation: "Book Consultation",
  learnMore: "Learn More",
  startNewCheck: "Start New Check"
};