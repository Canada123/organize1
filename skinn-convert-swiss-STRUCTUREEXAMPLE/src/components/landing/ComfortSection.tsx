import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  "10-day clinical-grade ECG with real-time AI analysis",
  "Swiss cardiologist-reviewed results",
  "Comfortable garment with seamless data sharing",
  "Actionable insights integrated into existing workflows"
];

export const ComfortSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="container mx-auto px-6 py-16 md:py-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-stretch">
          {/* Left Content */}
          <div className="flex-1 space-y-6">
            {/* Category */}
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/60 font-medium">
              SMARTER HEART MONITORING
            </p>
            
            {/* Headline & Description */}
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Comfort meets<br />
                clinical-grade<br />
                accuracy.
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
                Our 360° system delivers continuous heart monitoring with AI-powered analysis—offering accurate, cardiologist-validated insights. With the comfort of everyday clothing, it makes advanced cardiac care accessible from home.
              </p>
            </div>
          </div>

          {/* Right Side - Image Container */}
          <div className="flex-1 relative lg:min-h-[500px]">
            {/* Background shape */}
            <div className="absolute -inset-4 bg-[#F5F1ED] rounded-3xl" />
            
            {/* Image Container */}
            <div className="relative h-full flex items-center justify-center">
              <img
                src="/assets/images/woman-wearing-skiin-vertical.jpeg"
                alt="Woman wearing SKIIN device comfortably"
                className="relative z-10 w-full max-w-[400px] h-auto rounded-2xl object-cover"
                loading="lazy"
              />
              
              {/* Feature List Card - positioned on right edge */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 bg-white rounded-2xl p-6 shadow-2xl w-[320px] z-20">
                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-lp-primary-blue/10 flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-lp-primary-blue" />
                      </div>
                      <span className="text-sm text-foreground/80 leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};