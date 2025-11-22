import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Index from '@/pages/Index';
import Home2 from '@/pages/Home2';
import Home2Enhanced from '@/pages/Home2Enhanced';
import HomeV7 from '@/pages/HomeV7';
import LandingPageV2025 from '@/pages/LandingPageV2025';
import NotFound from '@/pages/NotFound';
import ComponentShowcase from '@/pages/ComponentShowcase';
import EligibilityTest from '@/pages/EligibilityTest';
import EligibilityFlow from '@/pages/EligibilityFlow';
import TestSupabase from '@/pages/TestSupabase';
import DoctorReferralUpload from '@/pages/DoctorReferralUpload';
import EligibilityTestDirect from '@/pages/EligibilityTestDirect';

// Solutions pages
import Solutions10DayHeartScreening from '@/pages/solutions/10DayHeartScreening';
import SolutionsTritest from '@/pages/solutions/Tritest';

// Partners pages
import PartnersOverview from '@/pages/partners/Overview';
import PartnersGPs from '@/pages/partners/GeneralPractitioners';
import PartnersCardiologists from '@/pages/partners/Cardiologists';
import PartnersTelemedicine from '@/pages/partners/Telemedicine';
import PartnersCorporate from '@/pages/partners/Corporate';

// How It Works pages
import HowItWorksOverview from '@/pages/how-it-works/Overview';
import HowItWorksProcess from '@/pages/how-it-works/Process';
import HowItWorksReimbursement from '@/pages/how-it-works/Reimbursement';
import HowItWorksTechnology from '@/pages/how-it-works/Technology';
import HowItWorksEvidence from '@/pages/how-it-works/Evidence';
import HowItWorksFAQ from '@/pages/how-it-works/FAQ';

// About Us pages - Fix: use Overview instead of missing AboutMyant
import AboutOverview from '@/pages/about/Overview';

// Partners Detail pages - Fix: Contact is in about directory
import Physicians from '@/pages/Physicians';
import Contact from '@/pages/about/Contact';

// Import the language context
import { useLanguage } from '@/contexts/LanguageContext';

const AppRouter: React.FC = () => {
  const location = useLocation();
  const { setLanguage } = useLanguage();

  useEffect(() => {
    const path = location.pathname;
    
    // Set language based on URL path prefix
    if (path.startsWith('/de')) {
      setLanguage('de');
    } else if (path.startsWith('/fr')) {
      setLanguage('fr');
    } else if (path.startsWith('/it')) {
      setLanguage('it');
    } else if (path !== '/' && !path.includes('/de/') && !path.includes('/fr/') && !path.includes('/it/')) {
      // For non-root English paths that don't contain language prefixes
      setLanguage('en');
    }
  }, [location.pathname, setLanguage]);

  return (
    <Routes>
      {/* English Routes */}
      <Route path="/" element={<LandingPageV2025 />} />
      <Route path="/original" element={<Home2 />} />
      <Route path="/home-old-archive" element={<Index />} />
      <Route path="/home-v7-archive" element={<HomeV7 />} />
      <Route path="/home2-enhanced-archive" element={<Home2Enhanced />} />
      <Route path="/component-showcase" element={<ComponentShowcase />} />
      <Route path="/eligibility-test" element={<EligibilityTest />} />
      <Route path="/eligibility" element={<EligibilityFlow />} />
      <Route path="/test-supabase" element={<TestSupabase />} />
      <Route path="/referral" element={<DoctorReferralUpload />} />
      <Route path="/eligibility-test-direct" element={<EligibilityTestDirect />} />
      
      {/* Solutions Routes */}
      <Route path="/solutions/10-day-heart-screening" element={<Solutions10DayHeartScreening />} />
      <Route path="/solutions/tritest" element={<SolutionsTritest />} />
      
      {/* Partners Routes */}
      <Route path="/partners" element={<PartnersOverview />} />
      <Route path="/partners/general-practitioners" element={<PartnersGPs />} />
      <Route path="/partners/cardiologists" element={<PartnersCardiologists />} />
      <Route path="/partners/telemedicine" element={<PartnersTelemedicine />} />
      <Route path="/partners/corporate" element={<PartnersCorporate />} />
      
      {/* How It Works Routes */}
      <Route path="/how-it-works" element={<HowItWorksOverview />} />
      <Route path="/how-it-works/process" element={<HowItWorksProcess />} />
      <Route path="/how-it-works/reimbursement" element={<HowItWorksReimbursement />} />
      <Route path="/how-it-works/technology" element={<HowItWorksTechnology />} />
      <Route path="/how-it-works/evidence" element={<HowItWorksEvidence />} />
      <Route path="/how-it-works/faq" element={<HowItWorksFAQ />} />
      
      {/* About Us Routes */}
      <Route path="/about" element={<AboutOverview />} />
      
      {/* Contact & Physicians */}
      <Route path="/physicians" element={<Physicians />} />
      <Route path="/contact" element={<Contact />} />

      {/* German Routes */}
      <Route path="/de" element={<LandingPageV2025 />} />
      <Route path="/de/loesungen/10-tage-herzscreening" element={<Solutions10DayHeartScreening />} />
      <Route path="/de/loesungen/tritest" element={<SolutionsTritest />} />
      <Route path="/de/partner" element={<PartnersOverview />} />
      <Route path="/de/partner/hausaerzte" element={<PartnersGPs />} />
      <Route path="/de/partner/kardiologen" element={<PartnersCardiologists />} />
      <Route path="/de/partner/telemedizin" element={<PartnersTelemedicine />} />
      <Route path="/de/partner/unternehmen" element={<PartnersCorporate />} />
      <Route path="/de/funktionsweise" element={<HowItWorksOverview />} />
      <Route path="/de/funktionsweise/prozess" element={<HowItWorksProcess />} />
      <Route path="/de/funktionsweise/erstattung" element={<HowItWorksReimbursement />} />
      <Route path="/de/funktionsweise/technologie" element={<HowItWorksTechnology />} />
      <Route path="/de/funktionsweise/evidenz" element={<HowItWorksEvidence />} />
      <Route path="/de/funktionsweise/faq" element={<HowItWorksFAQ />} />
      <Route path="/de/ueber-uns" element={<AboutOverview />} />
      <Route path="/de/aerzte" element={<Physicians />} />
      <Route path="/de/kontakt" element={<Contact />} />

      {/* French Routes */}
      <Route path="/fr" element={<LandingPageV2025 />} />
      <Route path="/fr/solutions/bilan-cardiaque-10-jours" element={<Solutions10DayHeartScreening />} />
      <Route path="/fr/solutions/tritest" element={<SolutionsTritest />} />
      <Route path="/fr/partenaires" element={<PartnersOverview />} />
      <Route path="/fr/partenaires/medecins-generalistes" element={<PartnersGPs />} />
      <Route path="/fr/partenaires/cardiologues" element={<PartnersCardiologists />} />
      <Route path="/fr/partenaires/telemedecine" element={<PartnersTelemedicine />} />
      <Route path="/fr/partenaires/entreprises" element={<PartnersCorporate />} />
      <Route path="/fr/fonctionnement" element={<HowItWorksOverview />} />
      <Route path="/fr/fonctionnement/processus" element={<HowItWorksProcess />} />
      <Route path="/fr/fonctionnement/remboursement" element={<HowItWorksReimbursement />} />
      <Route path="/fr/fonctionnement/technologie" element={<HowItWorksTechnology />} />
      <Route path="/fr/fonctionnement/evidence" element={<HowItWorksEvidence />} />
      <Route path="/fr/fonctionnement/faq" element={<HowItWorksFAQ />} />
      <Route path="/fr/a-propos" element={<AboutOverview />} />
      <Route path="/fr/medecins" element={<Physicians />} />
      <Route path="/fr/contact" element={<Contact />} />

      {/* Italian Routes */}
      <Route path="/it" element={<LandingPageV2025 />} />
      <Route path="/it/soluzioni/screening-cardiaco-10-giorni" element={<Solutions10DayHeartScreening />} />
      <Route path="/it/soluzioni/tritest" element={<SolutionsTritest />} />
      <Route path="/it/partner" element={<PartnersOverview />} />
      <Route path="/it/partner/medici-famiglia" element={<PartnersGPs />} />
      <Route path="/it/partner/cardiologi" element={<PartnersCardiologists />} />
      <Route path="/it/partner/telemedicina" element={<PartnersTelemedicine />} />
      <Route path="/it/partner/aziende" element={<PartnersCorporate />} />
      <Route path="/it/come-funziona" element={<HowItWorksOverview />} />
      <Route path="/it/come-funziona/processo" element={<HowItWorksProcess />} />
      <Route path="/it/come-funziona/rimborso" element={<HowItWorksReimbursement />} />
      <Route path="/it/come-funziona/tecnologia" element={<HowItWorksTechnology />} />
      <Route path="/it/come-funziona/evidenza" element={<HowItWorksEvidence />} />
      <Route path="/it/come-funziona/faq" element={<HowItWorksFAQ />} />
      <Route path="/it/chi-siamo" element={<AboutOverview />} />
      <Route path="/it/medici" element={<Physicians />} />
      <Route path="/it/contatti" element={<Contact />} />

      {/* Catch all and 404 - keep at the bottom */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;