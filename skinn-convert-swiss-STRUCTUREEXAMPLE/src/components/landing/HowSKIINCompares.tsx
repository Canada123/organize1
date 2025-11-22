import React from 'react';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface HowSKIINComparesProps {
  className?: string;
}

export const HowSKIINCompares: React.FC<HowSKIINComparesProps> = ({ className }) => {
  const features = [
    {
      feature: 'Continuous Monitoring',
      traditional: false,
      skiin: true
    },
    {
      feature: '10-Day Wear Period',
      traditional: 'Limited',
      skiin: true
    },
    {
      feature: 'No Adhesives or Wires',
      traditional: false,
      skiin: true
    },
    {
      feature: 'Washable & Reusable',
      traditional: false,
      skiin: true
    },
    {
      feature: 'Real-time Data Transmission',
      traditional: 'Partial',
      skiin: true
    },
    {
      feature: 'AI-powered Arrhythmia Detection',
      traditional: 'Basic',
      skiin: 'Advanced'
    },
    {
      feature: 'Patient Comfort for Long-term Wear',
      traditional: false,
      skiin: true
    }
  ];

  return (
    <section className={cn("relative overflow-hidden", className)}>
      {/* Full width purple background */}
      <div className="bg-[#5549A6] text-white py-20">
        <div className="container mx-auto px-6">
          {/* White logo - using text for now, replace with actual logo */}
          <div className="flex justify-center mb-12">
            <img 
              src="/Myant-official-logo-white.svg" 
              alt="Myant" 
              className="h-12 w-auto"
            />
          </div>

          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wider opacity-80 mb-4">
              HOW SKIIN COMPARES
            </p>
            <h2 className="text-4xl md:text-5xl font-bold">
              Comfort, clarity, care - in one.
            </h2>
          </div>

          {/* Comparison Table */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-3 gap-4 p-6 border-b border-white/20">
                <div className="text-sm uppercase tracking-wider opacity-70">
                  FEATURES
                </div>
                <div className="text-center text-sm uppercase tracking-wider opacity-70">
                  TRADITIONAL MONITORS
                </div>
                <div className="text-center text-sm uppercase tracking-wider opacity-70">
                  SKIIN TECHNOLOGY
                </div>
              </div>

              {/* Table Body */}
              {features.map((item, index) => (
                <div 
                  key={index} 
                  className="grid grid-cols-3 gap-4 p-6 border-b border-white/10 last:border-0"
                >
                  <div className="text-sm font-medium">
                    {item.feature}
                  </div>
                  <div className="text-center">
                    {item.traditional === true ? (
                      <Check className="w-5 h-5 mx-auto text-green-400" />
                    ) : item.traditional === false ? (
                      <X className="w-5 h-5 mx-auto text-red-400" />
                    ) : (
                      <span className="text-sm opacity-70">{item.traditional}</span>
                    )}
                  </div>
                  <div className="text-center">
                    {item.skiin === true ? (
                      <Check className="w-5 h-5 mx-auto text-green-400" />
                    ) : item.skiin === false ? (
                      <X className="w-5 h-5 mx-auto text-red-400" />
                    ) : (
                      <span className="text-sm text-green-400 font-medium">{item.skiin}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};