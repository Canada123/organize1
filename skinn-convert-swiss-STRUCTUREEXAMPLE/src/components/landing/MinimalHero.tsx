import React from 'react';
import { MinimalButton } from '@/components/ui/minimal-button';
import { ChevronRight } from 'lucide-react';

export const MinimalHero: React.FC = () => {
  return (
    <section className="relative bg-[#EEE8E1] min-h-[80vh] flex items-center">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#0D0D0D] mb-6 leading-tight">
            Screen Your Heart.
            <br />
            Simplify Your Life.
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-[#475259] mb-10 max-w-2xl mx-auto">
            Medical-grade monitoring, Swiss precision, zero complexity.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MinimalButton 
              size="lg"
              variant="primary"
              className="min-w-[200px]"
            >
              Check Your Eligibility
            </MinimalButton>
            
            <a 
              href="#how-it-works"
              className="text-[#004C96] hover:text-[#5298F2] transition-colors duration-200 flex items-center gap-1 font-medium"
            >
              How it works
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          
          {/* Trust Badge */}
          <div className="mt-12 flex items-center justify-center gap-4 text-sm text-[#475259]">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              MDR Class IIa Certified
            </span>
            <span className="text-[#004C96]/30">•</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Swiss Insurance Covered
            </span>
          </div>
        </div>
      </div>
      
      {/* Subtle decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#004C96]/10"></div>
    </section>
  );
};