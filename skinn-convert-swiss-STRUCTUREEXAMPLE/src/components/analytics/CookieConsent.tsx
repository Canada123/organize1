
import React, { useState, useEffect } from 'react';
import { 
  acceptAllCookies, 
  acceptNecessaryCookies, 
  getConsentPreferences,
  hasConsentChoice,
  updateConsentPreferences,
  type ConsentPreferences
} from '@/lib/consentManager';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface CookieConsentProps {
  onConsentChange?: (preferences: ConsentPreferences) => void;
}

/**
 * Manages cookie consent UI and persistence. Displays a banner and preference
 * dialog allowing users to accept all, necessary only or granular categories.
 */
export default function CookieConsent({ onConsentChange }: CookieConsentProps) {
  const t = useTranslation('ui');
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const hasChoice = hasConsentChoice();
    
    if (!hasChoice) {
      // Show banner on first visit
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      // Load saved preferences
      const savedPreferences = getConsentPreferences();
      if (savedPreferences) {
        setPreferences(savedPreferences);
        // Notify parent component about existing preferences
        if (onConsentChange) onConsentChange(savedPreferences);
      }
    }
  }, []); // Remove onConsentChange dependency to prevent infinite re-renders

  const handleAcceptAll = () => {
    acceptAllCookies();
    setPreferences({
      necessary: true,
      analytics: true,
      marketing: true,
    });
    setShowBanner(false);
    setShowPreferences(false);
    if (onConsentChange) onConsentChange({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  };

  const handleAcceptNecessary = () => {
    acceptNecessaryCookies();
    setPreferences({
      necessary: true,
      analytics: false,
      marketing: false,
    });
    setShowBanner(false);
    setShowPreferences(false);
    if (onConsentChange) onConsentChange({
      necessary: true,
      analytics: false,
      marketing: false,
    });
  };

  const handleSavePreferences = () => {
    updateConsentPreferences(preferences);
    setShowBanner(false);
    setShowPreferences(false);
    if (onConsentChange) onConsentChange(preferences);
  };

  const handleToggleCategory = (category: keyof ConsentPreferences) => {
    if (category === 'necessary') return; // Cannot disable necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  if (!showBanner && !showPreferences) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowPreferences(true)}
          className="bg-white text-xs"
        >
          {t.cookies.preferences}
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Cookie Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t shadow-lg">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">{t.cookies.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t.cookies.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setShowPreferences(true)}>
                  {t.cookies.preferences}
                </Button>
                <Button variant="outline" onClick={handleAcceptNecessary}>
                  {t.cookies.necessaryOnly}
                </Button>
                <Button onClick={handleAcceptAll}>
                  {t.cookies.acceptAll}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Preferences Dialog */}
      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t.cookies.preferencesTitle}</DialogTitle>
            <DialogDescription>
              {t.cookies.preferencesDescription}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="necessary" 
                checked={preferences.necessary} 
                disabled={true}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="necessary" className="font-medium">
                  {t.cookies.necessary} <span className="text-sm text-muted-foreground">(Always active)</span>
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t.cookies.necessaryDescription}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="analytics" 
                checked={preferences.analytics}
                onCheckedChange={() => handleToggleCategory('analytics')}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="analytics" className="font-medium">
                  {t.cookies.analytics}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t.cookies.analyticsDescription}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="marketing" 
                checked={preferences.marketing}
                onCheckedChange={() => handleToggleCategory('marketing')}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="marketing" className="font-medium">
                  {t.cookies.marketing}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t.cookies.marketingDescription}
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleAcceptNecessary}>
              {t.cookies.necessaryOnly}
            </Button>
            <Button onClick={handleAcceptAll}>
              {t.cookies.acceptAll}
            </Button>
            <Button onClick={handleSavePreferences}>
              {t.buttons.save} {t.cookies.preferences}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
