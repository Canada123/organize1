
import { useLanguage } from "@/contexts/LanguageContext";

type RouteKeys = 'home' | 'physicians' | 'patients' | 'about' | 'contact';

/**
 * Utility to get localized route paths
 * This centralizes route translations and ensures consistency
 */
export const useRouteTranslations = () => {
  const { language } = useLanguage();
  
  /**
   * Returns the appropriate route path based on current language
   * @param routeKey - Key of the route to translate
   * @returns Translated route path including language prefix if needed
   */
  const getRoutePath = (routeKey: RouteKeys): string => {
    // Routes organized by language
    const routes = {
      en: {
        home: '/',
        physicians: '/physicians',
        patients: '/patients',
        about: '/about',
        contact: '/contact'
      },
      de: {
        home: '/de',
        physicians: '/de/arzt',
        patients: '/de/patienten',
        about: '/de/uber-uns',
        contact: '/de/kontakt'
      },
      fr: {
        home: '/fr',
        physicians: '/fr/medecin',
        patients: '/fr/patients',
        about: '/fr/a-propos',
        contact: '/fr/contact'
      },
      it: {
        home: '/it',
        physicians: '/it/medici',
        patients: '/it/pazienti',
        about: '/it/chi-siamo',
        contact: '/it/contatto'
      }
    };
    
    // Return the appropriate path based on current language
    return routes[language][routeKey];
  };
  
  return { getRoutePath };
};
