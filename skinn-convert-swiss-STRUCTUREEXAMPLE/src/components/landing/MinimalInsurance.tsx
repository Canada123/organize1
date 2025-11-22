import React from 'react';
import { MinimalCard, MinimalCardContent } from '@/components/ui/minimal-card';
import { Check } from 'lucide-react';

const insuranceProviders = [
  { name: "SWICA", coverage: "100%" },
  { name: "CSS", coverage: "100%" },
  { name: "Helsana", coverage: "100%" },
  { name: "Concordia", coverage: "100%" },
  { name: "Sanitas", coverage: "100%" },
  { name: "Groupe Mutuel", coverage: "100%" },
  { name: "Assura", coverage: "100%" },
  { name: "Visana", coverage: "100%" },
  { name: "Atupri", coverage: "100%" }
];

export const MinimalInsurance: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-[#EEE8E1]">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#0D0D0D] mb-4">
            Covered by Swiss Insurance
          </h2>
          <p className="text-lg text-[#475259] max-w-2xl mx-auto">
            Your health insurance covers the full cost of SKIIN monitoring
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Insurance Providers Grid */}
          <div>
            <h3 className="text-xl font-semibold text-[#0D0D0D] mb-6">
              Accepted Insurance Partners
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {insuranceProviders.map((provider, index) => (
                <div key={index} className="text-center">
                  <div className="bg-white rounded-lg p-4 border border-[#004C96]/10">
                    <p className="text-sm font-medium text-[#0D0D0D]">{provider.name}</p>
                    <p className="text-xs text-[#004C96] mt-1">{provider.coverage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Coverage Benefits */}
          <MinimalCard variant="default">
            <MinimalCardContent className="p-8">
              <h3 className="text-xl font-semibold text-[#0D0D0D] mb-6">
                What's Included in Your Coverage
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#0D0D0D]">Full Device Cost</p>
                    <p className="text-sm text-[#475259]">SKIIN monitoring device and kit</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#0D0D0D]">Professional Analysis</p>
                    <p className="text-sm text-[#475259]">Cardiologist review and report</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#0D0D0D]">Direct Billing</p>
                    <p className="text-sm text-[#475259]">We handle insurance claims for you</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#0D0D0D]">No Referral Required</p>
                    <p className="text-sm text-[#475259]">Start directly with eligibility check</p>
                  </div>
                </div>
              </div>
            </MinimalCardContent>
          </MinimalCard>
        </div>
      </div>
    </section>
  );
};