import React from 'react';
import { Check, X } from 'lucide-react';

interface ComparisonRow {
  feature: string;
  skiin: boolean | string;
  traditional: boolean | string;
}

const comparisons: ComparisonRow[] = [
  {
    feature: "Monitoring Duration",
    skiin: "10 days continuous",
    traditional: "24-48 hours"
  },
  {
    feature: "Detection Rate",
    skiin: true,
    traditional: false
  },
  {
    feature: "Comfort & Wearability",
    skiin: true,
    traditional: false
  },
  {
    feature: "Shower & Exercise",
    skiin: true,
    traditional: false
  },
  {
    feature: "Insurance Coverage",
    skiin: true,
    traditional: true
  },
  {
    feature: "Results Turnaround",
    skiin: "48 hours",
    traditional: "1-2 weeks"
  },
  {
    feature: "AI-Powered Analysis",
    skiin: true,
    traditional: false
  },
  {
    feature: "At-Home Convenience",
    skiin: true,
    traditional: false
  }
];

export const MinimalComparison: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#0D0D0D] mb-4">
            Why SKIIN is Different
          </h2>
          <p className="text-lg text-[#475259] max-w-2xl mx-auto">
            Compare continuous monitoring with traditional methods
          </p>
        </div>
        
        <div className="bg-white border border-[#004C96]/10 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#004C96]/10">
                <th className="text-left p-6 text-[#475259] font-medium">Feature</th>
                <th className="p-6 text-center">
                  <div className="text-[#004C96] font-semibold">SKIIN</div>
                  <div className="text-xs text-[#475259] mt-1">10-Day Monitoring</div>
                </th>
                <th className="p-6 text-center">
                  <div className="text-[#475259] font-semibold">Traditional</div>
                  <div className="text-xs text-[#475259] mt-1">Holter/ECG</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row, index) => (
                <tr key={index} className="border-b border-[#004C96]/5 last:border-0">
                  <td className="p-6 text-[#475259]">{row.feature}</td>
                  <td className="p-6 text-center">
                    {typeof row.skiin === 'boolean' ? (
                      row.skiin ? (
                        <Check className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      )
                    ) : (
                      <span className="text-[#004C96] font-medium">{row.skiin}</span>
                    )}
                  </td>
                  <td className="p-6 text-center">
                    {typeof row.traditional === 'boolean' ? (
                      row.traditional ? (
                        <Check className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      )
                    ) : (
                      <span className="text-[#475259]">{row.traditional}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};