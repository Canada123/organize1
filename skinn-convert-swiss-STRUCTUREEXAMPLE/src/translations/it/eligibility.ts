export const eligibilityIt = {
  title: "Verifica Copertura",
  subtitle: "Scopri in 4 semplici passi se SKIIN è coperto dalla tua assicurazione",
  step: "Passo",
  of: "di",
  
  // Step 1: Symptoms
  symptomsQuestion: "Hai qualcuno di questi sintomi?",
  symptoms: {
    palpitations: "Battito cardiaco accelerato o irregolare",
    dizziness: "Vertigini o svenimenti",
    chestPain: "Dolore al petto",
    shortness: "Mancanza di respiro con sforzo",
    none: "Nessun sintomo (assistenza preventiva)"
  },
  
  // Step 2: Risk Factors
  riskFactorsQuestion: "Hai qualche fattore di rischio?",
  riskFactors: {
    familyHistory: "Storia familiare di malattie cardiache",
    hypertension: "Pressione alta",
    diabetes: "Diabete",
    ageOver50: "Oltre i 50 anni",
    none: "Nessun fattore di rischio"
  },
  
  // Step 3: Insurance Model
  insuranceModelQuestion: "Quale modello assicurativo hai?",
  insuranceModels: {
    standard: "Standard (libera scelta del medico)",
    gpModel: "Modello medico di base",
    hmo: "HMO",
    telmed: "Telemedicina",
    unsure: "Non sicuro"
  },
  
  // Step 4: Insurer
  insurerQuestion: "Quale assicurazione sanitaria hai? (Opzionale)",
  insurerPlaceholder: "Seleziona compagnia assicurativa",
  insurerHelp: "Questa informazione ci aiuta a darti una guida specifica.",
  
  // Navigation
  back: "Indietro",
  next: "Avanti",
  showResult: "Mostra Risultato",
  
  // Results
  results: {
    covered: {
      title: "Ottimo! SKIIN è coperto",
      badge: "L'assicurazione di base copre",
      nextStepsTitle: "I tuoi prossimi passi:"
    },
    consultFirst: {
      title: "SKIIN è possibile - contatta prima il medico",
      badge: "Visita medica richiesta"
    },
    selfPay: {
      title: "SKIIN disponibile per assistenza preventiva",
      badge: "Opzione pagamento autonomo"
    }
  },
  
  // Next Steps
  nextSteps: {
    standard: {
      step1: "Parla con il tuo medico di base o cardiologo",
      step2: "Il medico prescrive il monitoraggio SKIIN",
      step3: "SKIIN è coperto dall'assicurazione di base",
      info: "Con assicurazione standard: Vai direttamente dal medico, nessuna restrizione"
    },
    gpModel: {
      step1: "Contatta prima il tuo medico di base",
      step2: "Il medico di base valuta e riferisce se necessario",
      step3: "SKIIN è coperto dopo il riferimento",
      info: "Modello medico di base: Prima dal medico di base, poi riferimento a SKIIN"
    },
    hmo: {
      step1: "Contatta il tuo centro HMO",
      step2: "Il medico HMO valuta e riferisce",
      step3: "SKIIN è coperto dopo approvazione HMO",
      info: "HMO: Prima contatta il centro HMO"
    },
    telmed: {
      step1: "Chiama la tua hotline Telemedicina",
      step2: "Il medico Telemed può prescrivere SKIIN direttamente",
      step3: "Perfetto per il monitoraggio remoto",
      info: "Telemedicina: Ideale per SKIIN - prescrizione remota possibile"
    },
    unsure: {
      step1: "Controlla il tuo modello assicurativo",
      step2: "Contattaci per consigli",
      step3: "Ti aiuteremo con l'approccio giusto"
    },
    selfPay: {
      step1: "SKIIN disponibile come screening preventivo",
      step2: "Costo: circa CHF 399 (pagamento autonomo)",
      step3: "Programma appuntamento consulta",
      info: "Senza sintomi/rischi: Solitamente pagamento autonomo, ma prevenzione preziosa"
    }
  },
  
  // CTAs
  bookConsultation: "Prenota Consulta",
  learnMore: "Scopri di Più",
  startNewCheck: "Inizia Nuovo Controllo"
};