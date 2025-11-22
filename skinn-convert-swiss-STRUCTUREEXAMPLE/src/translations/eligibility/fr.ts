export const eligibilityFr = {
  title: "Vérifier la couverture",
  subtitle: "Découvrez en 4 étapes simples si SKIIN est couvert par votre assurance",
  step: "Étape",
  of: "sur",
  
  // Step 1: Symptoms
  symptomsQuestion: "Avez-vous l'un de ces symptômes?",
  symptoms: {
    palpitations: "Battements cardiaques rapides ou irréguliers",
    dizziness: "Vertiges ou évanouissements",
    chestPain: "Douleurs thoraciques",
    shortness: "Essoufflement à l'effort",
    none: "Aucun symptôme (soins préventifs)"
  },
  
  // Step 2: Risk Factors
  riskFactorsQuestion: "Avez-vous des facteurs de risque?",
  riskFactors: {
    familyHistory: "Antécédents familiaux de maladies cardiaques",
    hypertension: "Hypertension artérielle",
    diabetes: "Diabète",
    ageOver50: "Plus de 50 ans",
    none: "Aucun facteur de risque"
  },
  
  // Step 3: Insurance Model
  insuranceModelQuestion: "Quel modèle d'assurance avez-vous?",
  insuranceModels: {
    standard: "Standard (libre choix du médecin)",
    gpModel: "Modèle médecin de famille",
    hmo: "HMO",
    telmed: "Télémédecine",
    unsure: "Incertain"
  },
  
  // Step 4: Insurer
  insurerQuestion: "Quelle est votre assurance maladie? (Optionnel)",
  insurerPlaceholder: "Sélectionner la compagnie d'assurance",
  insurerHelp: "Cette information nous aide à vous donner des conseils spécifiques.",
  
  // Navigation
  back: "Retour",
  next: "Suivant",
  showResult: "Afficher le résultat",
  
  // Results
  results: {
    covered: {
      title: "Excellent! SKIIN est couvert",
      badge: "Assurance de base couvre",
      nextStepsTitle: "Vos prochaines étapes:"
    },
    consultFirst: {
      title: "SKIIN est possible - contactez d'abord un médecin",
      badge: "Visite médicale requise"
    },
    selfPay: {
      title: "SKIIN disponible pour les soins préventifs",
      badge: "Option auto-payée"
    }
  },
  
  // Next Steps
  nextSteps: {
    standard: {
      step1: "Parlez à votre médecin généraliste ou cardiologue",
      step2: "Le médecin prescrit la surveillance SKIIN",
      step3: "SKIIN est couvert par l'assurance de base",
      info: "Avec assurance standard: Allez directement chez le médecin, sans restrictions"
    },
    gpModel: {
      step1: "Contactez d'abord votre médecin de famille",
      step2: "Le médecin évalue et réfère si nécessaire",
      step3: "SKIIN est couvert après référence",
      info: "Modèle médecin de famille: D'abord chez le médecin, puis référence à SKIIN"
    },
    hmo: {
      step1: "Contactez votre centre HMO",
      step2: "Le médecin HMO évalue et réfère",
      step3: "SKIIN est couvert après approbation HMO",
      info: "HMO: Contactez d'abord le centre HMO"
    },
    telmed: {
      step1: "Appelez votre hotline de télémédecine",
      step2: "Le médecin télémédecine peut prescrire SKIIN directement",
      step3: "Parfait pour la surveillance à distance",
      info: "Télémédecine: Idéal pour SKIIN - prescription à distance possible"
    },
    unsure: {
      step1: "Vérifiez votre modèle d'assurance",
      step2: "Contactez-nous pour des conseils",
      step3: "Nous vous aiderons avec la bonne approche"
    },
    selfPay: {
      step1: "SKIIN disponible comme dépistage préventif",
      step2: "Coût: env. CHF 399 (auto-payé)",
      step3: "Planifier un rendez-vous de consultation",
      info: "Sans symptômes/risques: Généralement auto-payé, mais prévention précieuse"
    }
  },
  
  // CTAs
  bookConsultation: "Réserver une consultation",
  learnMore: "En savoir plus",
  startNewCheck: "Commencer un nouveau contrôle"
};