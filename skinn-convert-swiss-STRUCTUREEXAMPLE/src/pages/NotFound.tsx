
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useTranslation } from "@/hooks/useTranslation";

/**
 * Fallback page displayed when no route matches. Logs the invalid path for
 * debugging and provides a link back to the homepage.
 */
const NotFound = () => {
  const location = useLocation();
  const t = useTranslation('notFound');

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-6xl md:text-8xl font-bold text-primary mb-4">{t.title}</h1>
          <p className="text-2xl md:text-3xl font-medium text-foreground mb-6">{t.heading}</p>
          <p className="text-muted-foreground max-w-md mx-auto mb-4">
            {t.description}
          </p>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            {t.suggestion}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/80">
              <Link to="/">{t.actions.returnHome}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/about/contact">{t.actions.contactUs}</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-8">
            {t.helpText}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
