import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

const steps: ProcessStep[] = [
  {
    number: "01",
    title: "Check Eligibility",
    description: "5-minute online assessment to confirm insurance coverage"
  },
  {
    number: "02",
    title: "Receive Your Kit",
    description: "SKIIN device delivered to your home within 2-3 days"
  },
  {
    number: "03",
    title: "Wear for 10 Days",
    description: "Live normally while SKIIN monitors your heart continuously"
  },
  {
    number: "04",
    title: "Get Your Results",
    description: "Comprehensive report reviewed by cardiologists in 48 hours"
  }
];

export const MinimalProcess: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#0D0D0D] mb-4">
            Four Simple Steps
          </h2>
          <p className="text-lg text-[#475259] max-w-2xl mx-auto">
            From eligibility check to results in just two weeks
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step Number */}
              <div className="text-5xl font-light text-[#004C96]/20 mb-4">
                {step.number}
              </div>
              
              {/* Step Content */}
              <h3 className="text-lg font-semibold text-[#0D0D0D] mb-2">
                {step.title}
              </h3>
              <p className="text-[#475259] text-sm">
                {step.description}
              </p>
              
              {/* Arrow connector (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 -right-4 text-[#004C96]/30">
                  <ArrowRight className="w-6 h-6" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};