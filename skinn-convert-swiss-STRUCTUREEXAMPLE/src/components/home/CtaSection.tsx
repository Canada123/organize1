
import React from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";

const CtaSection = () => {
  const translations = useTranslation('home');
  
  return (
    <section className="section-padding bg-gradient-cta text-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {translations.cta.title}
            </h2>
            <p className="text-lg opacity-90 mb-8">
              {translations.cta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-secondary">
                {translations.cta.buttons.requestInfo}
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                {translations.cta.buttons.scheduleDemo}
              </Button>
            </div>
          </div>
          
          <div className="rounded-xl overflow-hidden relative">
            <img 
              src="/assets/images/32de0ca4-a556-4e60-bfaf-fc48bf4bd27c.png" 
              alt="SKIIN Smart Garment close-up" 
              className="w-full h-auto object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="bg-white rounded-full p-1">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-medical-teal">
                    <path d="M14 6.5L10 10.5L8 8.5L2 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 10.5V6.5H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-white">
                  {translations.cta.statistic}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
