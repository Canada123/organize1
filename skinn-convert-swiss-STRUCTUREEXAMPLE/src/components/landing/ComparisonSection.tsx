import React from 'react';
import { Check, X, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComparisonFeature {
  feature: string;
  skiin: boolean | 'partial';
  traditional: boolean | 'partial';
  tooltip?: string;
}

const comparisonData: ComparisonFeature[] = [
  {
    feature: "10-day continuous monitoring",
    skiin: true,
    traditional: false,
    tooltip: "Traditional Holter monitors typically last 24-48 hours"
  },
  {
    feature: "Comfortable for daily activities",
    skiin: true,
    traditional: false,
    tooltip: "SKIIN's textile design vs. bulky traditional monitors"
  },
  {
    feature: "Shower and sleep normally",
    skiin: true,
    traditional: false,
    tooltip: "Water-resistant design allows normal activities"
  },
  {
    feature: "Real-time symptom logging",
    skiin: true,
    traditional: 'partial',
    tooltip: "Limited symptom diary with traditional monitors"
  },
  {
    feature: "AI-powered analysis",
    skiin: true,
    traditional: false,
    tooltip: "Advanced algorithms detect subtle patterns"
  },
  {
    feature: "Full insurance coverage",
    skiin: true,
    traditional: true,
    tooltip: "Both covered by Swiss health insurance"
  },
  {
    feature: "Results within 48 hours",
    skiin: true,
    traditional: false,
    tooltip: "Traditional analysis can take 5-7 days"
  },
  {
    feature: "No wires or adhesives",
    skiin: true,
    traditional: false,
    tooltip: "Wireless textile vs. wired electrodes"
  },
  {
    feature: "Captures intermittent arrhythmias",
    skiin: true,
    traditional: 'partial',
    tooltip: "Extended monitoring catches more events"
  },
  {
    feature: "Medical-grade accuracy",
    skiin: true,
    traditional: true,
    tooltip: "Both meet clinical standards"
  }
];

const FeatureIcon: React.FC<{ value: boolean | 'partial' }> = ({ value }) => {
  if (value === true) {
    return <Check className="w-5 h-5 text-green-600" />;
  } else if (value === 'partial') {
    return <Minus className="w-5 h-5 text-yellow-600" />;
  } else {
    return <X className="w-5 h-5 text-red-500" />;
  }
};

export const ComparisonSection: React.FC = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Purple Background */}
      <div className="absolute inset-0 bg-lp-purple" />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255,255,255,.1) 10px,
            rgba(255,255,255,.1) 20px
          )`
        }} />
      </div>

      <div className="relative container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How SKIIN Compares
          </h2>
          <p className="text-lg text-lp-purple-light max-w-3xl mx-auto">
            See why leading cardiologists recommend SKIIN over traditional monitoring methods
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 bg-lp-purple-light/10">
              <div className="p-6">
                <h3 className="font-semibold text-lp-dark-blue text-lg">Features</h3>
              </div>
              <div className="p-6 text-center bg-lp-primary-blue/10">
                <img 
                  src="/assets/images/logos/skiin-logo.png" 
                  alt="SKIIN" 
                  className="h-8 mx-auto mb-2"
                />
                <h3 className="font-semibold text-lp-primary-blue">SKIIN Technology</h3>
              </div>
              <div className="p-6 text-center">
                <h3 className="font-semibold text-gray-600">Traditional Methods</h3>
                <p className="text-sm text-gray-500">Holter & Event Monitors</p>
              </div>
            </div>

            {/* Comparison Rows */}
            <div className="divide-y divide-gray-100">
              {comparisonData.map((item, index) => (
                <div 
                  key={index}
                  className="grid grid-cols-3 hover:bg-gray-50 transition-colors group"
                >
                  <div className="p-4 md:p-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm md:text-base text-lp-charcoal">
                        {item.feature}
                      </span>
                      {item.tooltip && (
                        <div className="relative group/tooltip">
                          <Info className="w-4 h-4 text-gray-400 cursor-help" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            {item.tooltip}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-4 md:p-6 text-center bg-lp-primary-blue/5 group-hover:bg-lp-primary-blue/10 transition-colors">
                    <FeatureIcon value={item.skiin} />
                  </div>
                  <div className="p-4 md:p-6 text-center">
                    <FeatureIcon value={item.traditional} />
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Row */}
            <div className="grid grid-cols-3 bg-gray-50 border-t-2 border-gray-200">
              <div className="p-6">
                <p className="font-semibold text-lp-dark-blue">Overall Score</p>
              </div>
              <div className="p-6 text-center bg-lp-primary-blue text-white">
                <div className="text-3xl font-bold">95%</div>
                <p className="text-sm opacity-90">Patient Satisfaction</p>
              </div>
              <div className="p-6 text-center">
                <div className="text-3xl font-bold text-gray-600">62%</div>
                <p className="text-sm text-gray-500">Patient Satisfaction</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <button className="px-8 py-4 bg-white text-lp-purple font-semibold rounded-lg hover:bg-lp-purple-light hover:text-white transition-colors shadow-lg">
            Switch to SKIIN Today
          </button>
          <p className="mt-4 text-sm text-lp-purple-light">
            Join thousands who've upgraded their heart monitoring experience
          </p>
        </div>
      </div>
    </section>
  );
};

// Fix missing import
const Info = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);