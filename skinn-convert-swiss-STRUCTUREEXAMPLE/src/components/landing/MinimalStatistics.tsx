import React from 'react';

interface StatType {
  value: string;
  label: string;
  description: string;
}

const stats: StatType[] = [
  {
    value: "70%",
    label: "Silent AFib Episodes",
    description: "Detected only through continuous monitoring"
  },
  {
    value: "10x",
    label: "More Effective",
    description: "Than single-day ECG tests"
  },
  {
    value: "48h",
    label: "Fast Results",
    description: "Cardiologist-reviewed comprehensive report"
  },
  {
    value: "100%",
    label: "Insurance Coverage",
    description: "Covered by Swiss health insurance"
  }
];

export const MinimalStatistics: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-[#EEE8E1]">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#0D0D0D] mb-4">
            The Numbers Speak for Themselves
          </h2>
          <p className="text-lg text-[#475259] max-w-2xl mx-auto">
            Clinical evidence supporting continuous heart monitoring
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-light text-[#004C96] mb-2">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-[#0D0D0D] mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-[#475259]">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};