export const homeTranslations = {
  hero: {
    badge: "Certificato MDR Classe IIa • Registrato Swissmedic",
    // Copy Variants for Testing
    variants: {
      // Default - New user-specified copy
      default: {
        badge: "La Sua salute è importante — per più di Lei solo",
        headline: "La maggior parte dei problemi cardiaci è silenziosa",
        subheadline: "Screening più intelligente, viva più a lungo",
        aboveCta: "Rilevi i problemi cardiaci silenziosi prima che rubino momenti preziosi. Protegga Se stesso e coloro che La amano.",
        eligibilityText: "Si prenda 5 minuti per verificare la Sua idoneità",
        ctaPrimary: "Inizi il Suo controllo cardiaco gratuito",
        ctaSecondary: "Domande? Legga le nostre FAQ →"
      },
      // Original - Legacy dual-split copy
      original: {
        badge: "Dispositivo Medico Certificato • Tecnologia Myant",
        headline: "Viva più giovane, più a lungo.",
        subheadline: "Screening più intelligente, da casa",
        aboveCta: "Rilevi i problemi cardiaci silenziosi prima che rubino momenti preziosi. Protegga Se stesso e coloro che La amano.",
        eligibilityText: "Si prenda 5 minuti per verificare la Sua idoneità",
        ctaPrimary: "Inizi il Suo controllo cardiaco gratuito",
        ctaSecondary: "Domande? Legga le nostre FAQ →"
      },
      // Legacy variants for backward compatibility
      variantA: {
        headline: "Le Malattie Cardiache Sono il Killer #1 — Quando È Stato Il Suo Ultimo Controllo Cardiaco?",
        subheadline: "Il 70% delle aritmie non mostra sintomi. Se non rilevate, possono causare ictus o insufficienza cardiaca. Ora può controllare il Suo cuore — in sicurezza, facilmente, da casa.",
        emotionalSubheadline: "La longevità significa più compleanni — per Lei, e per coloro che La amano di più. Inizi a proteggere il Suo cuore oggi."
      },
      variantB: {
        headline: "Viva Più a Lungo. Screening Più Intelligente. Da Casa.",
        subheadline: "I monitor cardiaci tradizionali sono scomodi e perdono fino al 91% dei ritmi irregolari. L'indumento morbido di SKIIN monitora continuamente per 10 giorni — catturando quello che altri perdono.",
        emotionalSubheadline: "Aggiunga anni alla Sua vita, e vita ai Suoi anni. Lo screening cardiaco confortevole è finalmente qui."
      },
      variantC: {
        headline: "Il Suo Cuore. La Sua Famiglia. Il Suo Controllo.",
        subheadline: "Ogni aritmia non rilevata è un rischio per Lei — e una preoccupazione per coloro che La amano. Prenda il controllo con uno screening cardiaco confortevole e completo da casa.",
        emotionalSubheadline: "Perché il Suo cuore batte per più di Lei solo. Lo protegga per Se stesso e per coloro che hanno bisogno di Lei."
      }
    },
    // Varianti di test A/B for backward compatibility
    variantA: {
      headline: "Le Malattie Cardiache Sono il Killer #1 — Quando È Stato Il Suo Ultimo Controllo Cardiaco?",
      subheadline: "Il 70% delle aritmie non mostra sintomi. Se non rilevate, possono causare ictus o insufficienza cardiaca. Ora può controllare il Suo cuore — in sicurezza, facilmente, da casa.",
      emotionalSubheadline: "La longevità significa più compleanni — per Lei, e per coloro che La amano di più. Inizi a proteggere il Suo cuore oggi."
    },
    variantB: {
      headline: "Viva Più a Lungo. Screening Più Intelligente. Da Casa.",
      subheadline: "I monitor cardiaci tradizionali sono scomodi e perdono fino al 91% dei ritmi irregolari. L'indumento morbido di SKIIN monitora continuamente per 10 giorni — catturando quello che altri perdono.",
      emotionalSubheadline: "Aggiunga anni alla Sua vita, e vita ai Suoi anni. Lo screening cardiaco confortevole è finalmente qui."
    },
    variantC: {
      headline: "Il Suo Cuore. La Sua Famiglia. Il Suo Controllo.",
      subheadline: "Ogni aritmia non rilevata è un rischio per Lei — e una preoccupazione per coloro che La amano. Prenda il controllo con uno screening cardiaco confortevole e completo da casa.",
      emotionalSubheadline: "Perché il Suo cuore batte per più di Lei solo. Lo protegga per Se stesso e per coloro che hanno bisogno di Lei."
    },
    // CTA comuni per tutte le varianti
    cta: {
      primary: "Inizi la Sua valutazione gratuita",
      secondary: "Verifichi la copertura assicurativa",
      tertiary: "Domande? Legga le nostre FAQ →"
    },
    // Proposte di valore aggiornate a 10 giorni
    valueProps: {
      comfort: "Nessun filo, nessun cerotto – 10 giorni di utilizzo confortevole",
      insurance: "Coperto dall'assicurazione di base",
      lifestyle: "Compatibile con lo stile di vita – lavori, si lavi, dorma"
    },
    // Legacy keys for compatibility
    title: "Monitoraggio Cardiaco Continuo",
    titleHighlight: "Senza Compromessi sul Comfort",
    description: "I Tessuti Intelligenti SKIIN stanno rivoluzionando il modo in cui monitoriamo e gestiamo la salute del cuore, fornendo ECG di grado clinico senza fili, adesivi o fastidi.",
    buttons: {
      forPatients: "Per i Pazienti",
      forPhysicians: "Per i Medici"
    },
    certification: "Dispositivo medico certificato, testato clinicamente e validato",
    testimonial: {
      quote: "Finalmente, un monitoraggio cardiaco che i miei pazienti vogliono davvero indossare!",
      author: "Dr.ssa Sarah Klein, Cardiologa"
    }
  },
  // v7.2 Evidence-based Statistics
  statistics: {
    title: "Le prove cliniche mostrano che il monitoraggio esteso funziona",
    subtitle: "Le condizioni cardiache silenziose sono più comuni di quanto pensi - e il monitoraggio esteso cattura ciò che i test più brevi perdono.",
    cards: [
      {
        value: "70%",
        label: "degli episodi di fibrillazione atriale si verificano senza sintomi",
        footnote: "La FA silenziosa può portare a ictus se non rilevata"
      },
      {
        value: "20-30%",
        label: "degli ictus ischemici sono attribuiti alla fibrillazione atriale",
        footnote: "La rilevazione precoce può prevenire eventi mortali"
      },
      {
        value: "66% vs 9%",
        label: "Tasso di rilevamento con monitoraggio esteso vs Holter 24 ore",
        footnote: "Il monitoraggio di 10 giorni cattura 7x più aritmie"
      }
    ],
    footnote: "Le prove cliniche mostrano che il monitoraggio esteso rileva significativamente più aritmie rispetto ai test tradizionali di 24 ore",
    evidenceLink: "Visualizza le prove cliniche"
  },
  // v7.2 Product Section - 8 Benefits
  productSection: {
    title: "Perché SKIIN è leader nel monitoraggio cardiaco",
    subtitle: "Otto modi in cui SKIIN trasforma il monitoraggio della salute cardiaca per risultati migliori",
    benefits: [
      {
        title: "Screening cardiaco esteso per approfondimenti più profondi",
        description: "Sostituisci i test brevi di 24-48 ore con il monitoraggio esteso (tipicamente 10 giorni) per catturare aritmie sfuggenti."
      },
      {
        title: "Tempi di attesa ridotti e rilevamento precoce",
        description: "Spedizione rapida e configurazione nello stesso giorno significano che inizi rapidamente il monitoraggio."
      },
      {
        title: "Referenze rapide e senza problemi",
        description: "Il nostro flusso di lavoro digitale collega te, il tuo medico di base e gli specialisti senza logistica complicata."
      },
      {
        title: "Fascia tessile SKIIN confortevole",
        description: "Una fascia morbida e senza adesivi viene spedita direttamente a casa tua."
      },
      {
        title: "Precisione alimentata dall'IA",
        description: "I dati vengono elaborati da software avanzati addestrati su milioni di ECG."
      },
      {
        title: "Tempi di risposta rapidi",
        description: "La maggior parte dei risultati viene restituita entro 24-48 ore dal completamento dello studio."
      },
      {
        title: "Tecnologia comprovata",
        description: "Migliaia di studi sono stati completati utilizzando la piattaforma SKIIN."
      },
      {
        title: "Licenziato da Health Canada",
        description: "Oltre alla certificazione MDR Classe IIa e alla registrazione Swissmedic."
      }
    ],
    closing: "I dati fluiscono in modo sicuro dall'app SKIIN al nostro cloud certificato ISO/IEC 27001."
  },
  // v7.2 Numbers Section - Key Metrics
  numbersSection: {
    title: "SKIIN in numeri",
    subtitle: "Tecnologia comprovata che offre risultati reali per la cura cardiaca",
    metrics: [
      {
        value: "95%",
        label: "Precisione di rilevamento",
        description: "I nostri algoritmi IA rilevano le aritmie con precisione clinica"
      },
      {
        value: "10 Giorni",
        label: "Monitoraggio continuo",
        description: "Il monitoraggio esteso cattura ritmi irregolari che i test di 24 ore perdono"
      },
      {
        value: "100%",
        label: "Copertura assicurativa",
        description: "Completamente coperto dall'assicurazione di base svizzera quando prescritto medicalmente"
      },
      {
        value: "24/7",
        label: "Analisi in tempo reale",
        description: "La trasmissione continua dei dati consente un intervento tempestivo quando necessario"
      }
    ]
  },
  // v7.2 Clinically Proven Technology Section
  clinicallyProvenTech: {
    title: "Tecnologia clinicamente provata",
    subtitle: "Supportata da rigorosi studi clinici e fidata dai principali cardiologi",
    trustMarkers: [
      {
        title: "Tasso di accuratezza del 98,6%",
        description: "La convalida clinica mostra che SKIIN eguaglia l'accuratezza del monitor Holter tradizionale"
      },
      {
        title: "Ricerca pubblicata",
        description: "La nostra tecnologia è stata convalidata in diversi studi sottoposti a revisione paritaria"
      },
      {
        title: "Certificato MDR Classe IIa e CE",
        description: "SKIIN soddisfa i più alti standard europei per i dispositivi medici"
      },
      {
        title: "Approvato dai cardiologi",
        description: "Raccomandato dai principali cardiologi svizzeri ed elettrofisiologi"
      }
    ],
    cta: "Visualizza le prove cliniche"
  },
  // v7.2 Care360 Section - Technology Overview
  care360Section: {
    title: "Tecnologia rivoluzionaria Myant Care360",
    subtitle: "Sperimenta il futuro del monitoraggio della salute cardiaca",
    description: "Il nostro rivoluzionario sistema di monitoraggio a 360° combina la cattura continua dei dati con l'analisi alimentata dall'IA.",
    features: [
      "Monitoraggio continuo di 10 giorni con ECG di grado clinico",
      "Analisi IA in tempo reale dei modelli di ritmo cardiaco",
      "Convalida da parte di cardiologi svizzeri di tutti i risultati",
      "Accuratezza di grado medico in un indumento confortevole",
      "Trasmissione dati senza interruzioni al tuo team sanitario",
      "Rapporti completi con informazioni attuabili",
      "Integrazione con i flussi di lavoro sanitari esistenti"
    ],
    cta: "Scopri di più sulla nostra tecnologia"
  },
  // v7.2 Tech Carousel - Data Flow
  techCarousel: {
    title: "Dal sensore alla soluzione",
    subtitle: "Scopri come SKIIN trasforma i tuoi dati cardiaci in informazioni attuabili",
    steps: [
      {
        title: "Rilevamento continuo",
        description: "I sensori ECG di grado medico incorporati nel tessuto morbido monitorano continuamente il tuo ritmo cardiaco",
        icon: "sensor"
      },
      {
        title: "App SKIIN",
        description: "I dati vengono trasmessi in modo sicuro tramite Bluetooth al tuo smartphone per il monitoraggio in tempo reale",
        icon: "app"
      },
      {
        title: "Cloud sicuro",
        description: "L'infrastruttura certificata ISO/IEC 27001 garantisce che i tuoi dati siano protetti e conformi",
        icon: "cloud"
      },
      {
        title: "Analisi IA",
        description: "Algoritmi avanzati addestrati su milioni di ECG rilevano irregolarità con precisione del 95%",
        icon: "ai"
      },
      {
        title: "Revisione del cardiologo",
        description: "I cardiologi svizzeri convalidano i risultati e creano raccomandazioni personalizzate",
        icon: "report"
      }
    ]
  },
  // Studio Holter domiciliare - Tecnologia Care360
  care360HomeHolter: {
    badge: "Studio Holter domiciliare",
    title: "Tecnologia Care360° rivoluzionaria",
    subtitle: "Scopri il futuro del monitoraggio cardiaco - completo, confortevole e completamente da casa",
    processTitle: "Il tuo processo completo di studio Holter domiciliare",
    processSteps: [
      {
        title: "Ordina il tuo kit da casa",
        description: "Semplice controllo di idoneità e ordinazione online. Il tuo kit di monitoraggio cardiaco arriva a casa tua entro 2-3 giorni lavorativi."
      },
      {
        title: "Indossa il comodo indumento SKIIN",
        description: "Indossa la fascia tessile morbida - niente adesivi, niente fili. Indossala continuamente fino a 10 giorni, anche sotto la doccia."
      },
      {
        title: "Caricamento automatico dei dati",
        description: "Il dispositivo SKIIN sincronizza automaticamente i tuoi dati cardiaci sul nostro cloud svizzero sicuro. Nessun intervento manuale necessario."
      },
      {
        title: "Analisi IA + Revisione del cardiologo",
        description: "Algoritmi avanzati analizzano milioni di battiti cardiaci, poi i cardiologi svizzeri convalidano ogni risultato per accuratezza."
      },
      {
        title: "Ricevi il tuo rapporto medico",
        description: "Ottieni il tuo rapporto cardiaco completo entro 48 ore. Risultati chiari con raccomandazioni concrete da specialisti."
      },
      {
        title: "Coordinamento delle cure di follow-up",
        description: "Se necessario, ti mettiamo in contatto con cardiologi per le cure di follow-up. I tuoi dati sono condivisi in modo sicuro con il tuo team sanitario."
      }
    ],
    bottomText: "Unisciti alle migliaia di persone che hanno già sperimentato la comodità e l'accuratezza del monitoraggio cardiaco domiciliare",
    cta: "Inizia il tuo studio Holter domiciliare"
  },
  // Home-2 Specific Content
  home2: {
    hero: {
      badge: "Certificato dall'Ufficio Federale della Sanità Pubblica (BAG)",
      title: "Vivi più a lungo, più giovane.",
      subtitle: "Salute del cuore rivoluzionaria attraverso il monitoraggio di 10 giorni potenziato dall'IA",
      cta: "Inizia Ora",
      bookAssessment: "Prenota Valutazione"
    },
    stats: {
      title: "Perché la Rilevazione Precoce è Critica",
      subtitle: "Le malattie cardiache sono la principale causa di morte nel mondo. La rilevazione precoce salva vite.",
      items: [
        { number: "70%", text: "dei disturbi del ritmo cardiaco passano inosservati" },
        { number: "30%", text: "delle persone con fibrillazione atriale subisce un ictus" },
        { number: "50%", text: "più disturbi del ritmo cardiaco rilevati con il monitoraggio di 10 giorni" }
      ]
    },
    clinicalEvidence: {
      title: "Tecnologia Clinicamente Provata",
      subtitle: "Supportata da studi clinici rigorosi e ricerca sottoposta a revisione paritaria",
      items: [
        {
          title: "Tasso di Accuratezza del 98,6%",
          description: "La validazione clinica mostra che SKIIN eguaglia l'accuratezza del monitor Holter tradizionale fornendo comfort superiore"
        },
        {
          title: "Ricerca Pubblicata",
          description: "La nostra tecnologia è stata validata in molteplici studi sottoposti a revisione paritaria e trial clinici"
        },
        {
          title: "Certificato FDA e CE",
          description: "SKIIN soddisfa i più alti standard per dispositivi medici per sicurezza ed efficacia"
        },
        {
          title: "Approvato dai Cardiologi",
          description: "Raccomandato dai principali cardiologi svizzeri ed elettrofisiologi"
        }
      ]
    },
    features: {
      title: "Misurato dall'IA, Valutato dal Cardiologo",
      subtitle: "Completamente coperto dall'assicurazione sanitaria svizzera",
      items: [
        {
          title: "Monitoraggio Confortevole",
          description: "Esegui un ECG Holter comodamente da casa con il nostro dispositivo SKIIN"
        },
        {
          title: "Analisi IA",
          description: "Algoritmi di IA avanzati analizzano continuamente i dati del tuo ritmo cardiaco"
        },
        {
          title: "Competenza Cardiologica",
          description: "I cardiologi svizzeri valutano i tuoi risultati e creano rapporti dettagliati"
        },
        {
          title: "Copertura Assicurativa",
          description: "Riconosciuto e completamente coperto dai fornitori di assicurazione svizzeri"
        }
      ]
    },
    technology: {
      title: "Tecnologia Rivoluzionaria Myant Care360",
      subtitle: "Sperimenta il futuro del monitoraggio della salute cardiaca",
      description: "Il nostro innovativo sistema di monitoraggio 360° combina la cattura continua dei dati con l'analisi potenziata dall'IA per un'assistenza cardiaca senza precedenti.",
      features: [
        "Monitoraggio continuo di 10 giorni",
        "Analisi IA in tempo reale",
        "Validazione del cardiologo svizzero",
        "Accuratezza di grado medico",
        "Trasmissione dati senza interruzioni"
      ]
    },
    patientJourney: {
      title: "Il Tuo Percorso di Salute Cardiaca",
      subtitle: "Dalla valutazione alla tranquillità in 5 semplici passi",
      steps: [
        { 
          number: "1", 
          title: "Completa la Valutazione", 
          description: "Compila il nostro modulo completo di auto-riferimento per determinare se SKIIN è giusto per te",
          duration: "5 minuti"
        },
        { 
          number: "2", 
          title: "Ricevi il Tuo Dispositivo", 
          description: "Consegniamo il kit SKIIN Holter ECG direttamente alla tua porta con istruzioni dettagliate",
          duration: "24-48 ore"
        },
        { 
          number: "3", 
          title: "Inizia il Monitoraggio", 
          description: "Indossa il comodo dispositivo SKIIN per 10 giorni mentre vivi la tua vita normale",
          duration: "10 giorni"
        },
        { 
          number: "4", 
          title: "Analisi dei Dati", 
          description: "I nostri sistemi IA e cardiologi svizzeri analizzano i tuoi dati cardiaci completi",
          duration: "3-5 giorni"
        },
        { 
          number: "5", 
          title: "Ottieni i Tuoi Risultati", 
          description: "Ricevi un rapporto dettagliato sulla salute cardiaca con raccomandazioni personalizzate",
          duration: "Stesso giorno"
        }
      ]
    },
    insurance: {
      title: "Copertura Assicurativa Completa",
      subtitle: "SKIIN è riconosciuto e coperto dall'assicurazione sanitaria svizzera quando prescritto medicalmente",
      description: "Naviga il sistema sanitario svizzero con fiducia. Il nostro team aiuta a garantire una copertura adeguata per le tue esigenze di monitoraggio cardiaco.",
      benefits: [
        "Coperto dall'assicurazione di base quando prescritto",
        "Nessun costo a carico del paziente per pazienti qualificati",
        "Supporto rimborso incluso",
        "Fatturazione diretta disponibile"
      ]
    },
    riskAssessment: {
      title: "Conosci il Tuo Rischio Cardiaco",
      subtitle: "Comprendere il tuo rischio cardiovascolare può salvarti la vita",
      risks: [
        {
          title: "Fibrillazione Atriale Silente",
          description: "Spesso asintomatica ma aumenta il rischio di ictus di 5 volte",
          prevalence: "Colpisce 1 adulto su 4 oltre i 40 anni"
        },
        {
          title: "Aritmie Cardiache",
          description: "Battiti cardiaci irregolari che possono essere pericolosi per la vita se non rilevati",
          prevalence: "2,7 milioni di americani vivono con AFib"
        },
        {
          title: "Prevenzione Malattie Cardiache",
          description: "La rilevazione precoce consente trattamento preventivo e cambiamenti nello stile di vita",
          prevalence: "Principale causa di morte nel mondo"
        }
      ]
    },
    cta: {
      title: "Inizia il Tuo Percorso di Salute Cardiaca Oggi",
      subtitle: "Unisciti a migliaia di pazienti svizzeri che già beneficiano del monitoraggio cardiaco avanzato",
      description: "Prendi il controllo della tua salute cardiaca con la soluzione di monitoraggio più confortevole e completa disponibile.",
      primaryButton: "Inizia Ora",
      secondaryButton: "Prenota Consulenza Gratuita"
    }
  },
  features: {
    title: "Un Nuovo Standard nel Monitoraggio Cardiaco",
    subtitle: "SKIIN combina l'innovativa informatica tessile con l'expertise clinica per fornire un'assistenza cardiaca senza paragoni",
    items: [
      {
        title: "ECG Continuo",
        description: "Monitoraggio ECG di grado clinico fino a 10 giorni senza interruzioni"
      },
      {
        title: "Design Confortevole",
        description: "Tessuto morbido e traspirante con sensori invisibili – nessun filo o adesivo"
      },
      {
        title: "Rilevazione Aritmie",
        description: "Algoritmi avanzati per rilevare e allertare su battiti cardiaci irregolari"
      },
      {
        title: "Analisi Tempo Reale",
        description: "Trasmissione istantanea dei dati ai medici per intervento tempestivo"
      },
      {
        title: "Usabilità Quotidiana",
        description: "Lavabile, riutilizzabile e progettato per essere parte della vita quotidiana"
      },
      {
        title: "Connesso al Dottore",
        description: "Perfettamente integrato con flussi di lavoro clinici e sistemi EHR"
      }
    ]
  },
  howItWorks: {
    tagline: "Processo Semplice",
    title: "Come Funziona SKIIN",
    subtitle: "Progettato per integrarsi perfettamente nella tua vita fornendo monitoraggio cardiaco di grado clinico",
    steps: [
      {
        number: "01",
        title: "Riferimento",
        description: "Ottieni un riferimento dal tuo medico o inizia con il nostro controllo di idoneità"
      },
      {
        number: "02",
        title: "Consegna",
        description: "Ricevi il tuo kit SKIIN consegnato direttamente a casa tua"
      },
      {
        number: "03",
        title: "Indossa",
        description: "Indossa il comodo dispositivo SKIIN fino a 10 giorni"
      },
      {
        number: "04",
        title: "Monitora",
        description: "I dati vengono registrati e analizzati continuamente da IA e cardiologi"
      },
      {
        number: "05",
        title: "Risultati",
        description: "Ricevi il tuo rapporto dettagliato e discuti con il tuo medico"
      }
    ],
    cta: "Scopri di Più sul Processo"
  },
  testimonials: {
    tagline: "Testimonianze",
    title: "Fidato da Medici e Pazienti",
    subtitle: "Ascolta dai fornitori di assistenza sanitaria e pazienti che hanno sperimentato i benefici di SKIIN",
    items: [
      {
        quote: "SKIIN ha trasformato come monitoro i miei pazienti con aritmie. I dati continui mi danno fiducia nelle mie diagnosi, e i pazienti continuano davvero a indossarlo.",
        name: "Dr. Michael Rodriguez",
        title: "Cardiologo, Centro Cardiaco Svizzero"
      },
      {
        quote: "Come qualcuno che ha bisogno di monitoraggio cardiaco regolare, SKIIN è stato rivoluzionario. Dimentico di indossare un dispositivo medico - è come intimo normale ma mi tiene connesso al mio medico.",
        name: "Maria Schmidt",
        title: "Paziente con Fibrillazione Atriale"
      },
      {
        quote: "La qualità dei dati che riceviamo dai tessuti SKIIN è eccezionale. Il monitoraggio continuo ci ha aiutato a rilevare modelli che sarebbero stati persi con il monitoraggio Holter tradizionale.",
        name: "Dr.ssa Sophia Levine",
        title: "Elettrofisiologa"
      }
    ]
  },
  comparison: {
    tagline: "Confronto",
    title: "Come SKIIN si Confronta",
    subtitle: "Vedi come i Tessuti Intelligenti SKIIN si confrontano con le soluzioni tradizionali di monitoraggio cardiaco",
    columns: {
      feature: "Funzionalità",
      skiin: "SKIIN",
      skiinSubtitle: "Tessuto Intelligente",
      holter: "Monitor Holter",
      holterSubtitle: "Tradizionale",
      event: "Monitor Evento",
      eventSubtitle: "Basato su Cerotto"
    },
    features: [
      "Monitoraggio Continuo",
      "Periodo di Utilizzo di 10 Giorni",
      "Nessun Adesivo o Filo",
      "Lavabile e Riutilizzabile",
      "Trasmissione Dati Tempo Reale",
      "Rilevazione Aritmie Potenziata da IA",
      "Comfort Paziente per Utilizzo a Lungo Termine"
    ]
  },
  cta: {
    title: "Pronto a trasformare il monitoraggio cardiaco?",
    description: "Che tu sia un fornitore di assistenza sanitaria che cerca di offrire migliore assistenza cardiaca o un paziente che cerca una soluzione di monitoraggio più confortevole, SKIIN è pronto per te.",
    buttons: {
      requestInfo: "Richiedi Informazioni",
      scheduleDemo: "Programma una Demo"
    },
    statistic: "Tasso di soddisfazione paziente del 97%"
  },
  problemSolution: {
    title: "La Triade Silenziosa: Tre Minacce Nascoste per il Suo Cuore",
    problem: {
      title: "Il Problema",
      description: "Molte condizioni cardiache si nascondono silenziosamente. Fino al 70% delle aritmie non presenta sintomi. Un singolo test di 24 ore offre solo un'istantanea breve, lasciandoLa in attesa e preoccupato. I monitor tradizionali sono scomodi e interrompono la vita quotidiana."
    },
    solution: {
      title: "La Soluzione",
      description: "SKIIN offre un monitoraggio continuo della salute cardiaca da casa. Il nostro Screening Cardiaco di 10 Giorni cattura i ritmi irregolari che i test di 24 ore perdono. L'indumento morbido e senza fili è come una seconda pelle—resistente all'acqua, lavabile e rimovibile per le docce. Combinando ECG, pressione sanguigna e analisi del sonno, monitoriamo la Triade Silenziosa (aritmia, ipertensione e apnea del sonno) che spesso passa inosservata."
    },
    silentTriad: {
      title: "La Triade Silenziosa",
      items: [
        {
          title: "Rilevamento Aritmie",
          icon: "ecg",
          description: "Il monitoraggio ECG continuo cattura i ritmi cardiaci irregolari che appaiono sporadicamente"
        },
        {
          title: "Monitoraggio Pressione Sanguigna",
          icon: "blood-pressure",
          description: "L'ABPM rivela l'ipertensione mascherata e i pericolosi pattern notturni"
        },
        {
          title: "Analisi del Sonno",
          icon: "sleep",
          description: "Identifica l'apnea del sonno che aumenta il rischio di aritmia dal 53% al 92%"
        }
      ]
    },
    cta: "Inizi la Sua Valutazione Gratuita",
    linkText: "Scopra lo Screening SKIIN 3X™",
    comingSoon: "(Prossimamente)",
    problems: {
      title: "Problemi Holter Tradizionale",
      items: [
        {
          title: "Fili e cerotti scomodi",
          description: "Fili ingombranti e cerotti adesivi irritanti interrompono la vita quotidiana"
        },
        {
          title: "Durata di monitoraggio breve", 
          description: "24-48 ore spesso perdono aritmie intermittenti"
        },
        {
          title: "Interruzioni dello stile di vita",
          description: "Nessuna doccia, sport o attività normali possibili"
        }
      ]
    },
    solutions: {
      title: "Soluzioni SKIIN",
      items: [
        {
          title: "Comfort tessile senza fili",
          description: "Fascia in tessuto morbido con sensori invisibili - discreto e confortevole"
        },
        {
          title: "Monitoraggio continuo di 10 giorni",
          description: "Tasso di rilevazione più alto per disturbi rari del ritmo cardiaco"
        },
        {
          title: "Continua a vivere normalmente",
          description: "Lavora, dormi, fai la doccia - SKIIN si adatta alla tua vita"
        }
      ]
    }
  },
  insurance: {
    title: "Copertura della Tua Assicurazione Sanitaria",
    subtitle: "SKIIN è coperto dall'assicurazione di base quando prescritto medicalmente",
    models: [
      {
        title: "Modello Medico di Base",
        description: "Consulta il tuo medico di famiglia per un riferimento SKIIN. Una volta prescritto medicalmente, è coperto dall'assicurazione di base.",
        icon: "👨‍⚕️"
      },
      {
        title: "Modello HMO", 
        description: "Visita prima il tuo studio HMO per una valutazione. Quando approvato, SKIIN è completamente coperto.",
        icon: "🏥"
      },
      {
        title: "Modello Telmed",
        description: "Chiama prima la tua hotline di telemedicina. Una volta approvato dal tele-dottore, SKIIN è coperto.",
        icon: "📞"
      },
      {
        title: "Pagamento Autonomo",
        description: "Per screening preventivo senza sintomi. Prezzi trasparenti disponibili.",
        icon: "💳"
      }
    ],
    cta: "Verifica Copertura"
  },
  faq: {
    tagline: "FAQ",
    title: "Domande Frequenti",
    subtitle: "Trova risposte alle domande comuni sui Tessuti Intelligenti SKIIN",
    items: [
      {
        question: "Quanto sono accurati i dati ECG di SKIIN?",
        answer: "I Tessuti Intelligenti SKIIN forniscono dati ECG di grado clinico con accuratezza comparabile ai monitor Holter tradizionali. La nostra tecnologia è stata validata in studi clinici e soddisfa i requisiti normativi per dispositivi medici."
      },
      {
        question: "Per quanto tempo i pazienti possono indossare i tessuti SKIIN?",
        answer: "I Tessuti Intelligenti SKIIN possono essere indossati fino a 10 giorni consecutivi, fornendo monitoraggio cardiaco esteso. I tessuti sono progettati per essere abbastanza confortevoli per l'utilizzo giorno e notte, permettendo un monitoraggio veramente continuo."
      },
      {
        question: "I tessuti SKIIN sono coperti dall'assicurazione?",
        answer: "Molti fornitori di assicurazione e sistemi sanitari coprono SKIIN come soluzione di monitoraggio cardiaco. La copertura varia per paese e fornitore. Possiamo aiutare a verificare la copertura per la tua situazione specifica attraverso il nostro team di supporto rimborsi."
      },
      {
        question: "Come ottengono i pazienti i Tessuti Intelligenti SKIIN?",
        answer: "I Tessuti Intelligenti SKIIN richiedono una prescrizione da un fornitore di assistenza sanitaria. Una volta prescritto, il kit SKIIN viene consegnato direttamente a casa del paziente con semplici istruzioni per l'uso e la cura."
      },
      {
        question: "SKIIN può rilevare tutti i tipi di aritmie?",
        answer: "SKIIN è progettato per rilevare una vasta gamma di aritmie cardiache, inclusa fibrillazione atriale, bradicardia, tachicardia e altre. I nostri algoritmi IA analizzano continuamente i dati ECG per identificare modelli irregolari e allertare i fornitori di assistenza sanitaria quando necessario."
      },
      {
        question: "Come sono protetti i dati del paziente?",
        answer: "SKIIN prende la sicurezza dei dati seriamente. Tutti i dati del paziente sono criptati sia in transito che a riposo. I nostri sistemi sono conformi a GDPR, HIPAA e altre normative regionali di protezione dati per garantire la privacy del paziente."
      }
    ]
  },
  contact: {
    tagline: "Mettiti in Contatto",
    title: "Contattaci",
    description: "Hai domande su SKIIN o vuoi sapere come può beneficiarti o alla tua pratica? Compila il modulo e il nostro team ti ricontatterà presto.",
    contactInfo: {
      email: {
        title: "Email",
        content: "info@myant-health.com"
      },
      phone: {
        title: "Telefono",
        content: "+41 44 123 45 67"
      },
      address: {
        title: "Indirizzo",
        content: "Bahnhofstrasse 100, 8001 Zurigo, Svizzera"
      }
    },
    form: {
      name: "Nome",
      namePlaceholder: "Il tuo nome completo",
      email: "Email",
      emailPlaceholder: "tua.email@esempio.com",
      phone: "Numero di Telefono",
      phonePlaceholder: "+41 XX XXX XX XX",
      role: "Io sono:",
      rolePlaceholder: "Seleziona il tuo ruolo",
      roleOptions: {
        patient: "Paziente",
        physician: "Medico",
        healthcareAdmin: "Amministratore Sanitario",
        other: "Altro"
      },
      message: "Messaggio",
      messagePlaceholder: "Come possiamo aiutarti?",
      consent: "Acconsento a SKIIN di processare i miei dati per contattarmi riguardo alla mia richiesta. Vedi la nostra",
      privacyPolicy: "Informativa sulla Privacy",
      submit: "Invia Messaggio",
      submitting: "Invio in corso...",
      successTitle: "Richiesta inviata",
      successDescription: "Ti ricontatteremo entro 24 ore."
    }
  },
  footer: {
    tagline: "Pionieri del monitoraggio cardiaco continuo basato su tessuti per migliori risultati sanitari.",
    sections: {
      patients: {
        title: "Per i Pazienti",
        links: {
          main: "Tessuti Intelligenti SKIIN",
          testimonials: "Storie dei Pazienti",
          faq: "FAQ",
          support: "Ottieni Supporto"
        }
      },
      physicians: {
        title: "Per i Medici",
        links: {
          main: "Soluzioni Cliniche",
          research: "Studi Clinici",
          resources: "Risorse",
          support: "Supporto Fornitori Sanitari",
          requestDemo: "Richiedi Demo"
        }
      },
      company: {
        title: "Azienda",
        links: {
          about: "Chi Siamo",
          team: "Il Nostro Team",
          careers: "Carriere",
          contact: "Contatto",
          support: "Supporto Tecnico"
        }
      }
    },
    legal: {
      privacy: "Informativa Privacy",
      terms: "Termini d'Uso",
      cookies: "Politica Cookie",
      rights: "Tutti i diritti riservati."
    }
  }
};