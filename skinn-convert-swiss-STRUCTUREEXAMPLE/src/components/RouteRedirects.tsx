import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Component to handle redirects from old URLs to new v7.2 compliant URLs
 */
export const RouteRedirects = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Define redirect mappings
    const redirects: Record<string, string> = {
      // German redirects
      '/de/loesungen/10-tage-herzueberwachung': '/de/loesungen/10-tage-herzscreening',
      
      // French redirects
      '/fr/solutions/depistage-cardiaque-10-jours': '/fr/solutions/bilan-cardiaque-10-jours',
      
      // Italian redirects
      '/it/soluzioni/monitoraggio-cardiaco-10-giorni': '/it/soluzioni/screening-cardiaco-10-giorni',
    };

    // Check if current path needs redirect
    const currentPath = location.pathname;
    const redirectTo = redirects[currentPath];

    if (redirectTo) {
      // Perform 301 redirect (permanent)
      navigate(redirectTo, { replace: true });
    }
  }, [location.pathname, navigate]);

  return null;
};