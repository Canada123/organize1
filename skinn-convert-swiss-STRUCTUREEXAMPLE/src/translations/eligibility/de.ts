export const eligibilityDe = {
  title: "Kostenübernahme prüfen",
  subtitle: "Finden Sie in 4 einfachen Schritten heraus, ob SKIIN von Ihrer Versicherung übernommen wird",
  step: "Schritt",
  of: "von",
  
  // Step 1: Symptoms
  symptomsQuestion: "Haben Sie eines dieser Symptome?",
  symptoms: {
    palpitations: "Herzrasen oder unregelmäßiger Herzschlag",
    dizziness: "Schwindel oder Ohnmacht",
    chestPain: "Brustschmerzen",
    shortness: "Atemnot bei Anstrengung",
    none: "Keine Symptome (Vorsorge)"
  },
  
  // Step 2: Risk Factors
  riskFactorsQuestion: "Haben Sie Risikofaktoren?",
  riskFactors: {
    familyHistory: "Familiengeschichte von Herzerkrankungen",
    hypertension: "Bluthochdruck",
    diabetes: "Diabetes",
    ageOver50: "Über 50 Jahre alt",
    none: "Keine Risikofaktoren"
  },
  
  // Step 3: Insurance Model
  insuranceModelQuestion: "Welches Versicherungsmodell haben Sie?",
  insuranceModels: {
    standard: "Standard (freie Arztwahl)",
    gpModel: "Hausarztmodell",
    hmo: "HMO",
    telmed: "Telmed",
    unsure: "Unsicher"
  },
  
  // Step 4: Insurer
  insurerQuestion: "Bei welcher Krankenkasse sind Sie versichert? (Optional)",
  insurerPlaceholder: "Krankenkasse wählen",
  insurerHelp: "Diese Information hilft uns, spezifische Hinweise zu geben.",
  
  // Navigation
  back: "Zurück",
  next: "Weiter",
  showResult: "Ergebnis anzeigen",
  
  // Results
  results: {
    covered: {
      title: "Sehr gut! SKIIN wird übernommen",
      badge: "Grundversicherung übernimmt",
      nextStepsTitle: "Ihre nächsten Schritte:"
    },
    consultFirst: {
      title: "SKIIN ist möglich - Arzt zuerst kontaktieren",
      badge: "Arztbesuch erforderlich"
    },
    selfPay: {
      title: "SKIIN als Vorsorge verfügbar",
      badge: "Selbstzahler-Option"
    }
  },
  
  // Next Steps
  nextSteps: {
    standard: {
      step1: "Sprechen Sie mit Ihrem Hausarzt oder Kardiologen",
      step2: "Arzt verschreibt SKIIN-Überwachung",
      step3: "SKIIN wird von der Grundversicherung übernommen",
      info: "Bei Standard-Versicherung: Direkt zum Arzt, keine Einschränkungen"
    },
    gpModel: {
      step1: "Kontaktieren Sie zuerst Ihren Hausarzt",
      step2: "Hausarzt beurteilt und überweist bei Bedarf",
      step3: "SKIIN wird nach Überweisung übernommen",
      info: "Hausarztmodell: Zuerst zum GP, dann Überweisung zu SKIIN"
    },
    hmo: {
      step1: "Wenden Sie sich an Ihr HMO-Zentrum",
      step2: "HMO-Arzt beurteilt und überweist",
      step3: "SKIIN wird nach HMO-Genehmigung übernommen",
      info: "HMO: Zuerst HMO-Zentrum kontaktieren"
    },
    telmed: {
      step1: "Rufen Sie Ihre Telmed-Hotline an",
      step2: "Telmed-Arzt kann SKIIN direkt verschreiben",
      step3: "Perfekt für Remote-Überwachung",
      info: "Telmed: Ideal für SKIIN - Remote-Verschreibung möglich"
    },
    unsure: {
      step1: "Prüfen Sie Ihr Versicherungsmodell",
      step2: "Kontaktieren Sie uns für Beratung",
      step3: "Wir helfen beim richtigen Vorgehen"
    },
    selfPay: {
      step1: "SKIIN als Vorsorge-Screening verfügbar",
      step2: "Kosten: ca. CHF 399 (Selbstzahler)",
      step3: "Termin für Beratung vereinbaren",
      info: "Ohne Symptome/Risiken: Meist Selbstzahler, aber wertvolle Vorsorge"
    }
  },
  
  // CTAs
  bookConsultation: "Beratungstermin buchen",
  learnMore: "Mehr erfahren",
  startNewCheck: "Neue Prüfung starten"
};