import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MinimalButton } from "@/components/ui/minimal-button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CopyVariantSelector } from "@/components/ui/copy-variant-selector";
import { useCopyVariant } from "@/contexts/CopyVariantContext";

import MyantLogo from "@/components/ui/MyantLogo";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { currentVariant, setVariant } = useCopyVariant();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Get localized paths based on the current path and target language
  const getLocalizedPath = (targetLang) => {
    const currentPath = location.pathname;
    
    // Root path is special case
    if (currentPath === '/' || currentPath === '/de' || currentPath === '/fr' || currentPath === '/it') {
      return targetLang === 'en' ? '/' : `/${targetLang}`;
    }
    
    // Handle the new route structure
    const pathMappings = {
      // Solutions
      '/solutions/10-day-heart-screening': { de: '/de/loesungen/10-tage-herzscreening', fr: '/fr/solutions/bilan-cardiaque-10-jours', it: '/it/soluzioni/screening-cardiaco-10-giorni' },
      '/solutions/tritest': { de: '/de/loesungen/tritest', fr: '/fr/solutions/tritest', it: '/it/soluzioni/tritest' },
      
      // Partners
      '/partners': { de: '/de/partner', fr: '/fr/partenaires', it: '/it/partner' },
      '/partners/general-practitioners': { de: '/de/partner/hausaerzte', fr: '/fr/partenaires/medecins-generalistes', it: '/it/partner/medici-famiglia' },
      '/partners/cardiologists': { de: '/de/partner/kardiologen', fr: '/fr/partenaires/cardiologues', it: '/it/partner/cardiologi' },
      '/partners/telemedicine': { de: '/de/partner/telemedizin', fr: '/fr/partenaires/telemedecine', it: '/it/partner/telemedicina' },
      '/partners/corporate': { de: '/de/partner/unternehmen', fr: '/fr/partenaires/entreprises', it: '/it/partner/aziende' },
      
      // How It Works
      '/how-it-works': { de: '/de/wie-es-funktioniert', fr: '/fr/comment-ca-marche', it: '/it/come-funziona' },
      '/how-it-works/process': { de: '/de/wie-es-funktioniert/prozess', fr: '/fr/comment-ca-marche/processus', it: '/it/come-funziona/processo' },
      '/how-it-works/reimbursement': { de: '/de/wie-es-funktioniert/kostenerstattung', fr: '/fr/comment-ca-marche/remboursement', it: '/it/come-funziona/rimborso' },
      '/how-it-works/technology': { de: '/de/wie-es-funktioniert/technologie', fr: '/fr/comment-ca-marche/technologie', it: '/it/come-funziona/tecnologia' },
      '/how-it-works/evidence': { de: '/de/wie-es-funktioniert/evidenz', fr: '/fr/comment-ca-marche/evidence', it: '/it/come-funziona/evidenza' },
      '/how-it-works/faq': { de: '/de/wie-es-funktioniert/faq', fr: '/fr/comment-ca-marche/faq', it: '/it/come-funziona/faq' },
      
      // About
      '/about': { de: '/de/ueber-uns', fr: '/fr/a-propos', it: '/it/chi-siamo' },
      '/about/company': { de: '/de/ueber-uns/unternehmen', fr: '/fr/a-propos/entreprise', it: '/it/chi-siamo/azienda' },
      '/about/medical-board': { de: '/de/ueber-uns/beirat', fr: '/fr/a-propos/conseil-medical', it: '/it/chi-siamo/comitato-medico' },
      '/about/blog': { de: '/de/ueber-uns/blog', fr: '/fr/a-propos/blog', it: '/it/chi-siamo/blog' },
      '/about/testimonials': { de: '/de/ueber-uns/erfahrungsberichte', fr: '/fr/a-propos/temoignages', it: '/it/chi-siamo/testimonianze' },
      '/about/compliance': { de: '/de/ueber-uns/compliance', fr: '/fr/a-propos/conformite', it: '/it/chi-siamo/conformita' },
      '/about/contact': { de: '/de/ueber-uns/kontakt', fr: '/fr/a-propos/contact', it: '/it/chi-siamo/contatti' }
    };
    
    // Find the mapping for current path
    const mapping = pathMappings[currentPath];
    if (mapping && mapping[targetLang]) {
      return mapping[targetLang];
    }
    
    // Default fallback
    return targetLang === 'en' ? currentPath.replace(/^\/de\/|^\/fr\/|^\/it\//, '/') : `/${targetLang}${currentPath}`;
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    const newPath = getLocalizedPath(lang);
    navigate(newPath);
  };

  // Navigation structure based on new architecture
  const getNavigationItems = () => {
    const basePrefix = language === 'en' ? '' : `/${language}`;
    
    const labels = {
      en: {
        home: "Home",
        solutions: "Solutions",
        partners: "Partners", 
        howItWorks: "How It Works",
        about: "About Us"
      },
      de: {
        home: "Startseite",
        solutions: "Lösungen",
        partners: "Partner",
        howItWorks: "Wie es funktioniert", 
        about: "Über uns"
      },
      fr: {
        home: "Accueil",
        solutions: "Solutions",
        partners: "Partenaires",
        howItWorks: "Comment ça marche",
        about: "À propos"
      },
      it: {
        home: "Home",
        solutions: "Soluzioni",
        partners: "Partner",
        howItWorks: "Come funziona",
        about: "Chi siamo"
      }
    };

    const solutionsItems = {
      en: [
        { label: "10-Day Heart Screening", path: "/solutions/10-day-heart-screening" },
        { label: "SKIIN 3X Tritest", path: "/solutions/tritest" }
      ],
      de: [
        { label: "10-Tage Herzscreening", path: "/de/loesungen/10-tage-herzscreening" },
        { label: "SKIIN 3X Tritest", path: "/de/loesungen/tritest" }
      ],
      fr: [
        { label: "Bilan Cardiaque 10 Jours", path: "/fr/solutions/bilan-cardiaque-10-jours" },
        { label: "SKIIN 3X Tritest", path: "/fr/solutions/tritest" }
      ],
      it: [
        { label: "Screening Cardiaco 10 Giorni", path: "/it/soluzioni/screening-cardiaco-10-giorni" },
        { label: "SKIIN 3X Screening™", path: "/it/soluzioni/tritest" }
      ]
    };

    const partnersItems = {
      en: [
        { label: "General Practitioners", path: "/partners/general-practitioners" },
        { label: "Cardiologists", path: "/partners/cardiologists" },
        { label: "Telemedicine", path: "/partners/telemedicine" },
        { label: "Corporate/Insurers", path: "/partners/corporate" }
      ],
      de: [
        { label: "Hausärzte", path: "/de/partner/hausaerzte" },
        { label: "Kardiologen", path: "/de/partner/kardiologen" },
        { label: "Telemedizin", path: "/de/partner/telemedizin" },
        { label: "Unternehmen", path: "/de/partner/unternehmen" }
      ],
      fr: [
        { label: "Médecins Généralistes", path: "/fr/partenaires/medecins-generalistes" },
        { label: "Cardiologues", path: "/fr/partenaires/cardiologues" },
        { label: "Télémédecine", path: "/fr/partenaires/telemedecine" },
        { label: "Entreprises", path: "/fr/partenaires/entreprises" }
      ],
      it: [
        { label: "Medici di Base", path: "/it/partner/medici-famiglia" },
        { label: "Cardiologi", path: "/it/partner/cardiologi" },
        { label: "Telemedicina", path: "/it/partner/telemedicina" },
        { label: "Aziende", path: "/it/partner/aziende" }
      ]
    };

    return {
      labels: labels[language],
      home: language === 'en' ? '/' : `/${language}`,
      solutions: solutionsItems[language],
      partners: partnersItems[language],
      howItWorks: language === 'en' ? '/how-it-works' : language === 'de' ? '/de/wie-es-funktioniert' : language === 'fr' ? '/fr/comment-ca-marche' : '/it/come-funziona',
      about: language === 'en' ? '/about' : language === 'de' ? '/de/ueber-uns' : language === 'fr' ? '/fr/a-propos' : '/it/chi-siamo'
    };
  };

  const nav = getNavigationItems();

  const languages = [
    { code: "en", label: "EN" },
    { code: "de", label: "DE" },
    { code: "fr", label: "FR" },
    { code: "it", label: "IT" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <Link to={language === 'en' ? '/' : `/${language}`} className="flex items-center" onClick={closeMobileMenu}>
            <span className="sr-only">SKIIN</span>
            <MyantLogo className="h-10" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {/* Home */}
            <Link
              to={nav.home}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {nav.labels.home}
            </Link>

            {/* Solutions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-foreground hover:text-primary transition-colors font-medium">
                {nav.labels.solutions}
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-background shadow-lg border-border min-w-[240px]">
                {nav.solutions.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} className="w-full px-4 py-2 hover:bg-muted cursor-pointer">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Partners Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-foreground hover:text-primary transition-colors font-medium">
                {nav.labels.partners}
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-background shadow-lg border-border min-w-[240px]">
                {nav.partners.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} className="w-full px-4 py-2 hover:bg-muted cursor-pointer">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* How It Works */}
            <Link
              to={nav.howItWorks}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {nav.labels.howItWorks}
            </Link>

            {/* About Us */}
            <Link
              to={nav.about}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {nav.labels.about}
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-2">
            <CopyVariantSelector 
              currentVariant={currentVariant}
              onVariantChange={setVariant}
            />
            <div className="flex border border-lp-primary-blue rounded-full px-1 py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`px-2 py-1 rounded-full text-sm transition-all ${
                    language === lang.code
                      ? "bg-lp-primary-blue text-white"
                      : "text-lp-primary-blue hover:bg-lp-primary-blue/10"
                  }`}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  {lang.label}
                </button>
              ))}
            </div>
            <Link to={language === 'en' ? '/about/contact' : language === 'de' ? '/de/ueber-uns/kontakt' : language === 'fr' ? '/fr/a-propos/contact' : '/it/chi-siamo/contatti'}>
              <MinimalButton size="md" variant="primary">
                {language === 'en' ? 'Contact Us' : language === 'de' ? 'Kontakt' : language === 'fr' ? 'Contactez-nous' : 'Contattaci'}
              </MinimalButton>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 bg-white z-40 transform transition-transform ease-in-out duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ top: "60px" }}
      >
        <div className="container-custom py-8">
          <nav className="flex flex-col space-y-4">
            {/* Mobile Home */}
            <Link
              to={nav.home}
              className="text-foreground text-lg py-2 hover:text-primary font-medium"
              onClick={closeMobileMenu}
            >
              {nav.labels.home}
            </Link>

            {/* Mobile Solutions */}
            <div className="space-y-2">
              <div className="text-foreground text-lg py-2 font-medium">{nav.labels.solutions}</div>
              {nav.solutions.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-muted-foreground text-base py-1 pl-4 hover:text-primary block"
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Partners */}
            <div className="space-y-2">
              <div className="text-foreground text-lg py-2 font-medium">{nav.labels.partners}</div>
              {nav.partners.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-muted-foreground text-base py-1 pl-4 hover:text-primary block"
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <Link
              to={nav.howItWorks}
              className="text-foreground text-lg py-2 hover:text-primary"
              onClick={closeMobileMenu}
            >
              {nav.labels.howItWorks}
            </Link>

            <Link
              to={nav.about}
              className="text-foreground text-lg py-2 hover:text-primary"
              onClick={closeMobileMenu}
            >
              {nav.labels.about}
            </Link>

            <div className="pt-4">
              <div className="flex border border-lp-primary-blue rounded-full px-1 py-1 self-start mb-4">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      language === lang.code
                        ? "bg-lp-primary-blue text-white"
                        : "text-lp-primary-blue hover:bg-lp-primary-blue/10"
                    }`}
                    onClick={() => handleLanguageChange(lang.code)}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
              <Link to={language === 'en' ? '/about/contact' : language === 'de' ? '/de/ueber-uns/kontakt' : language === 'fr' ? '/fr/a-propos/contact' : '/it/chi-siamo/contatti'} onClick={closeMobileMenu}>
                <MinimalButton className="w-full" size="lg" variant="primary">
                  {language === 'en' ? 'Contact Us' : language === 'de' ? 'Kontakt' : language === 'fr' ? 'Contactez-nous' : 'Contattaci'}
                </MinimalButton>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;