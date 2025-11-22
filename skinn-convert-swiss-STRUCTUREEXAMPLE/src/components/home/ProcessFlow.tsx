import React from 'react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { ProgressiveSection } from '@/components/ui/progressive-section';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { ChevronRight } from 'lucide-react';

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  image?: string;
}

export function ProcessFlow() {
  const translations = useTranslation('home');
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const steps: ProcessStep[] = [
    {
      number: translations.howItWorks.steps[0].number,
      title: translations.howItWorks.steps[0].title,
      description: translations.howItWorks.steps[0].description,
      image: "/assets/images/40ba1015-dfac-4b19-9548-8f3319ffe098.png"
    },
    {
      number: translations.howItWorks.steps[1].number,
      title: translations.howItWorks.steps[1].title,
      description: translations.howItWorks.steps[1].description,
      image: "/assets/images/product/wear-skiin-man-band-insert-pod.png"
    },
    {
      number: translations.howItWorks.steps[2].number,
      title: translations.howItWorks.steps[2].title,
      description: translations.howItWorks.steps[2].description,
      image: "/assets/images/32de0ca4-a556-4e60-bfaf-fc48bf4bd27c.png"
    },
    {
      number: translations.howItWorks.steps[3].number,
      title: translations.howItWorks.steps[3].title,
      description: translations.howItWorks.steps[3].description,
      image: "/assets/images/app-live-ecg.png"
    },
    {
      number: translations.howItWorks.steps[4].number,
      title: translations.howItWorks.steps[4].title,
      description: translations.howItWorks.steps[4].description,
      image: "/assets/images/doctor-patient.jpeg"
    }
  ];

  return (
    <ProgressiveSection className="py-20 md:py-30">
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="text-primary font-medium text-lg">
            {translations.howItWorks.tagline}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            {translations.howItWorks.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {translations.howItWorks.subtitle}
          </p>
        </div>

        <div ref={ref} className="relative">
          {/* Desktop Timeline */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2 z-0" />
          
          {/* Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-4 relative z-10">
            {steps.map((step, index) => (
              <div
                key={index}
                className={cn(
                  "group transition-all duration-700",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Step Card */}
                <div className="bg-background rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  {/* Image */}
                  <div className="aspect-[4/3] mb-6 overflow-hidden rounded-xl bg-background-secondary">
                    {step.image ? (
                      <img 
                        src={step.image} 
                        alt={step.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl font-bold text-primary/20">
                          {step.number}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold mb-4">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Desktop Arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-6 w-12 h-12 items-center justify-center z-20 -translate-y-1/2">
                    <ChevronRight className="w-6 h-6 text-primary" />
                  </div>
                )}
                
                {/* Mobile Connector */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4">
                    <div className="w-1 h-12 bg-gradient-to-b from-primary to-primary/20" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Manufacturing Excellence Section */}
        <div className="mt-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Advanced Myant Technology</h3>
            <p className="text-muted-foreground">
              Our smart textiles are manufactured using state-of-the-art knitting technology that seamlessly 
              integrates medical-grade sensors into comfortable fabric. Each SKIIN garment undergoes rigorous 
              quality control to ensure consistent performance and durability.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Precision Knitting</h4>
                <p className="text-sm text-muted-foreground">
                  Advanced circular knitting machines create seamless integration of conductive yarns
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Quality Tested</h4>
                <p className="text-sm text-muted-foreground">
                  Each garment is individually tested for signal quality and comfort
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/assets/images/smart-textile-knitting-electrodes.jpg"
              alt="Smart textile knitting electrodes"
              className="w-full h-auto rounded-lg shadow-md"
              data-testid="manufacturing-electrodes"
            />
            <img
              src="/assets/images/smart-textile-knitting-machine.jpg"
              alt="Smart textile knitting machine"
              className="w-full h-auto rounded-lg shadow-md"
              data-testid="manufacturing-machine"
            />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button className="btn-primary text-lg px-8 py-4">
            {translations.howItWorks.cta}
          </button>
        </div>
      </div>
    </ProgressiveSection>
  );
}