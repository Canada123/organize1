import React, { useState } from 'react';
import { FileCheck, Upload, CheckCircle2, Activity, ChevronRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface InsuranceStep {
  id: number;
  icon: React.ElementType;
  title: string;
  description: string;
  details: string;
}

const steps: InsuranceStep[] = [
  {
    id: 1,
    icon: FileCheck,
    title: "Check Eligibility",
    description: "Quick online assessment to verify insurance coverage",
    details: "Answer a few simple questions about your symptoms and medical history. Our system instantly verifies your eligibility with Swiss insurance providers."
  },
  {
    id: 2,
    icon: Upload,
    title: "Submit Documentation",
    description: "Upload prescription and insurance details",
    details: "Securely upload your doctor's prescription and insurance card. Our HIPAA-compliant system ensures your data is protected throughout the process."
  },
  {
    id: 3,
    icon: CheckCircle2,
    title: "Get Approval",
    description: "Receive confirmation within 24 hours",
    details: "Our team processes your request and coordinates with your insurance provider. You'll receive approval confirmation via email and SMS."
  },
  {
    id: 4,
    icon: Activity,
    title: "Start Monitoring",
    description: "Begin your heart screening journey",
    details: "Your SKIIN device is shipped directly to your home. Setup takes just 5 minutes with our guided app experience."
  }
];

export const InsuranceCoverageFlow: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <div className="w-full">
      {/* Desktop Version */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-12 left-0 right-0 h-1 bg-gray-200">
            <div className="h-full bg-gradient-lp-timeline" style={{ width: '100%' }} />
          </div>

          {/* Steps */}
          <div className="relative grid grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === step.id;
              const isHovered = hoveredStep === step.id;

              return (
                <div
                  key={step.id}
                  className="relative group cursor-pointer"
                  onMouseEnter={() => setHoveredStep(step.id)}
                  onMouseLeave={() => setHoveredStep(null)}
                  onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
                >
                  {/* Step Circle */}
                  <div className="relative z-10 mx-auto w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <div className={cn(
                      "w-20 h-20 rounded-full flex items-center justify-center transition-colors duration-300",
                      isActive || isHovered ? "bg-lp-primary-blue" : "bg-gray-100"
                    )}>
                      <Icon className={cn(
                        "w-10 h-10 transition-colors duration-300",
                        isActive || isHovered ? "text-white" : "text-lp-dark-blue"
                      )} />
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="mt-6 text-center">
                    <h3 className="text-lg font-semibold text-lp-dark-blue mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-lp-charcoal">
                      {step.description}
                    </p>

                    {/* Info Icon */}
                    <div className="mt-3 flex justify-center">
                      <Info className={cn(
                        "w-5 h-5 transition-all duration-300",
                        isActive || isHovered ? "text-lp-primary-blue scale-110" : "text-gray-400"
                      )} />
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isActive && (
                    <div className="absolute top-full left-0 right-0 mt-4 p-4 bg-white rounded-lg shadow-xl z-20 animate-fadeIn">
                      <p className="text-sm text-lp-charcoal">{step.details}</p>
                    </div>
                  )}

                  {/* Connector Arrow */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-12 -right-4 transform translate-x-1/2 text-lp-primary-blue opacity-50">
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Version - Accordion */}
      <div className="md:hidden space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = activeStep === step.id;

          return (
            <div
              key={step.id}
              className={cn(
                "border rounded-lg overflow-hidden transition-all duration-300",
                isActive ? "border-lp-primary-blue shadow-lg" : "border-gray-200"
              )}
            >
              <button
                onClick={() => setActiveStep(isActive ? null : step.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                    isActive ? "bg-lp-primary-blue" : "bg-gray-100"
                  )}>
                    <Icon className={cn(
                      "w-6 h-6",
                      isActive ? "text-white" : "text-lp-dark-blue"
                    )} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lp-dark-blue">{step.title}</h3>
                    <p className="text-sm text-lp-charcoal">{step.description}</p>
                  </div>
                </div>
                <ChevronRight className={cn(
                  "w-5 h-5 text-gray-400 transition-transform duration-300",
                  isActive && "rotate-90"
                )} />
              </button>

              {isActive && (
                <div className="px-4 pb-4 animate-fadeIn">
                  <div className="ml-16 text-sm text-lp-charcoal">
                    {step.details}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA Section */}
      <div className="mt-12 text-center">
        <Button 
          size="lg"
          className="bg-lp-primary-blue hover:bg-lp-dark-blue text-white px-8 py-3"
        >
          Check Your Coverage
        </Button>
        <p className="mt-3 text-sm text-lp-charcoal">
          Takes only 2 minutes • No commitment required
        </p>
      </div>
    </div>
  );
};