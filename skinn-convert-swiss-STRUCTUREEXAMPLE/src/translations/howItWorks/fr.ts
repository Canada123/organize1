export const howItWorksTranslations = {
  overview: {
    hero: {
      title: "Comment fonctionne SKIIN",
      subtitle: "Surveillance cardiaque simple et transparente",
      description: "De la prescription aux résultats, SKIIN rend la surveillance cardiaque sans effort pour les patients et les prestataires.",
      cta: "Commencer"
    }
  },
  process: {
    hero: {
      title: "Le processus SKIIN",
      subtitle: "Six étapes simples pour de meilleurs soins cardiaques",
      description: "Notre processus rationalisé garantit que les patients obtiennent la surveillance dont ils ont besoin avec un minimum de tracas.",
      cta: "Découvrir le processus"
    },
    steps: {
      step1: {
        title: "Étape 1 : Recevoir une prescription",
        patient: "Votre médecin prescrit SKIIN pour surveiller vos symptômes cardiaques. Les prescriptions peuvent être émises par des médecins généralistes, des cardiologues ou des services de télémédecine.",
        physician: "Identifiez les patients présentant des palpitations, des syncopes, un risque de fibrillation auriculaire ou d'autres symptômes d'arythmie. Prescrivez SKIIN pour 1 à 10 jours de surveillance.",
        details: "La prescription peut être soumise électroniquement, par fax ou via notre portail médecin. Assurez-vous que toutes les informations du patient et les indications cliniques sont incluses."
      },
      step2: {
        title: "Étape 2 : Livraison",
        patient: "SKIIN est livré à votre domicile dans les 24 à 48 heures. Le kit comprend tout ce dont vous avez besoin : vêtements intelligents à votre taille, gateway préchargée et instructions simples.",
        physician: "Aucune configuration en clinique requise. Expédition directe au domicile du patient. La gateway se synchronise automatiquement avec la commande du patient.",
        details: "Chaque kit est stérilisé et contrôlé qualité. La gateway est préconfigurée et nécessite uniquement d'être branchée. Plusieurs tailles disponibles selon les mesures du patient."
      },
      step3: {
        title: "Étape 3 : Porter",
        patient: "Portez simplement SKIIN comme un vêtement normal. Portez-le 24h/24 et 7j/7 pendant la période de surveillance prescrite. Vous pouvez dormir, travailler et poursuivre vos activités quotidiennes normalement.",
        physician: "Les patients atteignent des taux de conformité de 95%+. Pas d'électrodes ni de fils signifie une meilleure qualité des données. La surveillance continue capture les arythmies intermittentes.",
        details: "Le vêtement est lavable en machine et peut être retiré brièvement pour la douche si nécessaire. Les capteurs sont intégrés dans le tissu et ne nécessitent pas de contact direct avec la peau via des adhésifs."
      },
      step4: {
        title: "Étape 4 : Surveiller",
        patient: "La gateway collecte automatiquement vos données cardiaques. Vous n'avez rien à faire - poursuivez simplement votre routine habituelle. En option : utilisez l'application pour enregistrer les symptômes.",
        physician: "Données en temps réel disponibles via un portail sécurisé. Les algorithmes IA signalent les anomalies potentielles. ECG complet disponible si nécessaire.",
        details: "Le système enregistre en continu un ECG 3 canaux à 250Hz. Les données sont cryptées et transmises en toute sécurité vers nos serveurs suisses. La suppression des artefacts garantit des signaux propres."
      },
      step5: {
        title: "Étape 5 : Retour",
        patient: "À la fin de votre période de surveillance, renvoyez SKIIN en utilisant l'étiquette prépayée. Aucun nettoyage requis - nous nous occupons de tout.",
        physician: "Le processus de retour déclenche la génération automatique du rapport. L'ensemble de données complet est disponible pour examen. Peut prolonger la surveillance si nécessaire.",
        details: "Taux de retour moyen >98%. L'expédition prépayée facilite le retour pour les patients. Les vêtements sont nettoyés et reconditionnés professionnellement."
      },
      step6: {
        title: "Étape 6 : Résultats",
        patient: "Votre médecin reçoit un rapport complet et discutera des résultats avec vous. Si des problèmes urgents sont détectés, la notification est accélérée.",
        physician: "Recevez un rapport détaillé via un portail sécurisé. Examinez les résultats et assurez le suivi avec le patient. ECG complet disponible si nécessaire.",
        details: "Les rapports comprennent un aperçu des résultats, toute arythmie détectée avec horodatage, les tendances de fréquence cardiaque et les interprétations cliniques."
      }
    },
    patientView: "Vue patient",
    physicianView: "Vue médecin",
    details: "Détails",
    insuranceModels: {
      title: "Voies de couverture d'assurance",
      subtitle: "SKIIN fonctionne avec tous les modèles d'assurance suisses",
      standard: {
        model: "Assurance standard",
        description: "Libre choix du médecin",
        process: "Patient → Cardiologue ou Télémed → SKIIN → Résultats au médecin",
        note: "Aucun médecin référent requis - accès direct aux spécialistes"
      },
      gp: {
        model: "Modèle médecin de famille",
        description: "Médecin référent requis",
        process: "Patient → Approbation du médecin → SKIIN → Résultats au médecin + cardiologue",
        note: "Vous devez d'abord impliquer votre médecin de famille pour la couverture d'assurance"
      },
      hmo: {
        model: "HMO",
        description: "Coordination clinique HMO",
        process: "Patient → Clinique HMO → SKIIN → Résultats à HMO + cardiologue",
        note: "Coordonner par l'intermédiaire de votre médecin HMO"
      },
      telmed: {
        model: "Telmed",
        description: "Télémédecine d'abord",
        process: "Patient → Appeler Telemed → SKIIN → Résultats à Telemed + cardiologue",
        note: "Appelez d'abord votre centre de télémédecine comme requis"
      }
    },
    whySimple: {
      title: "Pourquoi SKIIN est si simple",
      items: [
        "Pas de fils ou d'électrodes à attacher",
        "Aucune restriction de style de vie pendant la surveillance",
        "Aucun journal quotidien requis (enregistrement optionnel des symptômes)",
        "Aucune visite de technicien nécessaire",
        "Aucune préparation cutanée spéciale"
      ]
    },
    getStarted: {
      title: "Prêt à commencer ?",
      description: "Si vous avez des symptômes ou des facteurs de risque de troubles du rythme cardiaque, la surveillance SKIIN pourrait fournir les réponses dont vous avez besoin.",
      cta: "Vérifier l'éligibilité"
    }
  },
  reimbursement: {
    hero: {
      title: "Couverture et remboursement",
      subtitle: "Comprendre vos options d'assurance",
      description: "SKIIN est couvert par la plupart des régimes d'assurance suisses lorsqu'il est prescrit médicalement. Découvrez vos options de couverture.",
      cta: "Vérifier la couverture"
    }
  },
  technology: {
    hero: {
      title: "Technologie SKIIN",
      subtitle: "L'informatique textile avancée rencontre l'excellence clinique",
      description: "Découvrez la technologie innovante qui rend possible une surveillance cardiaque confortable de qualité clinique.",
      cta: "Explorer la technologie"
    }
  },
  evidence: {
    hero: {
      title: "Preuves cliniques",
      subtitle: "Résultats prouvés dans des contextes réels",
      description: "Validation scientifique et études cliniques démontrant l'efficacité et la fiabilité de SKIIN.",
      cta: "Voir les preuves"
    }
  },
  faq: {
    hero: {
      title: "Questions fréquemment posées",
      subtitle: "Obtenez des réponses aux questions courantes",
      description: "Tout ce que vous devez savoir sur la surveillance SKIIN, de la configuration aux résultats.",
      cta: "Parcourir la FAQ"
    }
  }
};