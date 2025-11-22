import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { ProductBenefit } from './ProductBenefit';
import { ProductBenefitAccordion } from './ProductBenefitAccordion';
import { 
  Clock, 
  Zap, 
  Share2, 
  Heart, 
  Brain, 
  Timer, 
  Award, 
  Shield 
} from 'lucide-react';

/**
 * v7.2 Product Section - 8 Benefits
 * Displays SKIIN's key benefits in a responsive grid with interactive hover states
 */
export function ProductSection() {
  const t = useTranslation('home');
  const product = t.productSection;
  const [isMobile, setIsMobile] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Icon mapping for each benefit
  const benefitIcons = [
    Clock,    // Extended monitoring
    Zap,      // Fast start
    Share2,   // Seamless referrals
    Heart,    // Comfortable band
    Brain,    // AI-powered
    Timer,    // Fast turnaround
    Award,    // Proven technology
    Shield    // Health Canada licensed
  ];

  return (
    <section className="section-padding bg-gradient-to-b from-background via-secondary/3 to-background relative overflow-hidden" data-testid="product-section">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-medical-teal rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-professional-teal rounded-full blur-3xl" />
      </div>
      
      <div className="container-custom relative z-10">
        {/* Section Header - More compact */}
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-foreground">
            {product.title}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            {product.subtitle}
          </p>
        </div>

        {/* Benefits Grid - Desktop with hover, Mobile with accordion */}
        {isMobile ? (
          <div className="space-y-3 mb-10">
            {product.benefits.map((benefit, index) => {
              const Icon = benefitIcons[index];
              return (
                <ProductBenefitAccordion
                  key={index}
                  icon={Icon}
                  title={benefit.title}
                  description={benefit.description}
                  index={index}
                  isOpen={openAccordion === index}
                  onToggle={() => setOpenAccordion(openAccordion === index ? null : index)}
                />
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6 mb-10">
            {product.benefits.map((benefit, index) => {
              const Icon = benefitIcons[index];
              return (
                <ProductBenefit
                  key={index}
                  icon={Icon}
                  title={benefit.title}
                  description={benefit.description}
                  index={index}
                />
              );
            })}
          </div>
        )}

        {/* Closing Statement - Subtle styling */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm md:text-base text-muted-foreground/80 italic">
            {product.closing}
          </p>
        </div>

        {/* Visual Assets Integration - Compact Product Showcase */}
        <div className="mt-12 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <div className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <img 
                src="/assets/images/product/skiin-your-second-skin.png" 
                alt="SKIIN - Your Second Skin"
                className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                data-testid="product-image-second-skin"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-3 left-3 text-white">
                  <p className="text-sm font-semibold">Soft as Your Second Skin</p>
                  <p className="text-xs opacity-90">Medical-grade comfort</p>
                </div>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <img 
                src="/assets/images/product/wear-skiin-man-band-insert-pod.png" 
                alt="Easy to use - Insert pod into SKIIN band"
                className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                data-testid="product-image-easy-setup"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-3 left-3 text-white">
                  <p className="text-sm font-semibold">Simple Setup</p>
                  <p className="text-xs opacity-90">Insert pod and start</p>
                </div>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <img 
                src="/assets/images/product/smart-textile-knitting-electrodes.jpg" 
                alt="Smart textile technology with knitted electrodes"
                className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                data-testid="product-image-technology"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-3 left-3 text-white">
                  <p className="text-sm font-semibold">Medical Grade Quality</p>
                  <p className="text-xs opacity-90">Knitted electrodes</p>
                </div>
              </div>
            </div>
          </div>

          {/* App Preview - Floating Card */}
          <div className="mt-8 flex justify-center">
            <div className="relative group">
              <img 
                src="/assets/images/app-live-ecg.png" 
                alt="SKIIN App showing live ECG monitoring"
                className="rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-300 max-w-sm"
                loading="lazy"
                data-testid="product-image-app"
              />
              <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-medical-teal to-professional-teal text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg group-hover:scale-105 transition-transform duration-300">
                Real-time ECG Monitoring
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}