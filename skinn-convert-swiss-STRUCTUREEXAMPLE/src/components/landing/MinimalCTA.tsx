import React from 'react';
import { MinimalButton } from '@/components/ui/minimal-button';
import { Check } from 'lucide-react';

export const MinimalCTA: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-[#004C96]">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6">
          Take Control of Your Heart Health Today
        </h2>
        <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
          Join thousands of Swiss families who trust SKIIN for continuous heart monitoring
        </p>
        
        {/* Benefits list */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10 text-white/90">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span>100% Insurance Covered</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span>No Referral Needed</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span>Results in 48 Hours</span>
          </div>
        </div>
        
        {/* CTA Button */}
        <MinimalButton 
          size="lg"
          className="bg-white text-[#004C96] hover:bg-[#EEE8E1] min-w-[250px]"
        >
          Start Your Free Heart Check
        </MinimalButton>
        
        <p className="mt-6 text-sm text-white/70">
          Takes only 5 minutes • No credit card required
        </p>
      </div>
    </section>
  );
};