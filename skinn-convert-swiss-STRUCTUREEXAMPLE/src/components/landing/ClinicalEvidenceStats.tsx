import React from 'react';
import { cn } from '@/lib/utils';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

interface ClinicalEvidenceStatsProps {
  className?: string;
}

export const ClinicalEvidenceStats: React.FC<ClinicalEvidenceStatsProps> = ({ className }) => {
  const stats = [
    {
      value: 66,
      unit: '%',
      label: 'Detection Rate',
      description: 'SKIIN detects arrhythmias in 10 days vs 9% for 24-hour ECG'
    },
    {
      value: 70,
      unit: '%',
      label: 'Silent Arrhythmias',
      description: 'Have no symptoms at all'
    },
    {
      value: 240,
      unit: 'x',
      label: 'More Monitoring',
      description: 'Than traditional 24-hour tests'
    }
  ];

  return (
    <section className={cn("relative overflow-hidden", className)}>
      {/* Full width blue background */}
      <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2B5BA8] text-white">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Clinical Evidence
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Extended monitoring reveals what short tests miss
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center"
              >
                <div className="text-5xl md:text-6xl font-bold mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.unit} duration={2} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{stat.label}</h3>
                <p className="text-sm opacity-80 leading-relaxed">{stat.description}</p>
              </div>
            ))}
          </div>

          {/* Source citation */}
          <p className="text-xs opacity-60 mt-8 text-center">
            Source: Myant Clinical Studies 2021-2024
          </p>
        </div>
      </div>
    </section>
  );
};