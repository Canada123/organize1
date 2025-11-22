import React from 'react';
import { MinimalCard, MinimalCardContent, MinimalCardTitle, MinimalCardDescription } from '@/components/ui/minimal-card';
import { Clock, Shield, UserCheck } from 'lucide-react';

interface FeatureType {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const features: FeatureType[] = [
  {
    title: "10-Day Monitoring",
    description: "Continuous tracking captures what single tests miss",
    icon: <Clock className="w-6 h-6 text-[#004C96]" strokeWidth={1.5} />,
  },
  {
    title: "Insurance Covered",
    description: "100% covered by Swiss health insurance",
    icon: <Shield className="w-6 h-6 text-[#004C96]" strokeWidth={1.5} />,
  },
  {
    title: "Doctor Reviewed",
    description: "Cardiologist analysis within 48 hours",
    icon: <UserCheck className="w-6 h-6 text-[#004C96]" strokeWidth={1.5} />,
  },
];

export const MinimalFeatures: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#0D0D0D] mb-4">
            Simple. Effective. Trusted.
          </h2>
          <p className="text-lg text-[#475259] max-w-2xl mx-auto">
            Everything you need for comprehensive heart monitoring
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <MinimalCard key={index} variant="default" className="group">
              <MinimalCardContent className="text-center pt-8">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 rounded-full bg-[#EEE8E1] group-hover:bg-[#004C96]/5 transition-colors duration-300">
                    {feature.icon}
                  </div>
                </div>
                <MinimalCardTitle className="mb-3">
                  {feature.title}
                </MinimalCardTitle>
                <MinimalCardDescription className="text-base">
                  {feature.description}
                </MinimalCardDescription>
              </MinimalCardContent>
            </MinimalCard>
          ))}
        </div>
      </div>
    </section>
  );
};