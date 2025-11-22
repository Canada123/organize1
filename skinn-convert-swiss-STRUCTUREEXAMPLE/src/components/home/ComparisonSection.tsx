
import React from "react";
import { Check, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const ComparisonSection = () => {
  const translations = useTranslation('home');
  
  const comparisonData = [
    {
      feature: translations.comparison.features[0],
      skiin: true,
      holter: false,
      event: false,
    },
    {
      feature: translations.comparison.features[1],
      skiin: true,
      holter: false,
      event: true,
    },
    {
      feature: translations.comparison.features[2],
      skiin: true,
      holter: false,
      event: false,
    },
    {
      feature: translations.comparison.features[3],
      skiin: true,
      holter: false,
      event: false,
    },
    {
      feature: translations.comparison.features[4],
      skiin: true,
      holter: false,
      event: true,
    },
    {
      feature: translations.comparison.features[5],
      skiin: true,
      holter: false,
      event: true,
    },
    {
      feature: translations.comparison.features[6],
      skiin: true,
      holter: false,
      event: false,
    },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-medium">{translations.comparison.tagline}</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            {translations.comparison.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {translations.comparison.subtitle}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-secondary/30 text-foreground">
                <th className="py-4 px-6 text-left w-1/3">{translations.comparison.columns.feature}</th>
                <th className="py-4 px-6 text-center">
                  <span className="font-bold text-primary">{translations.comparison.columns.skiin}</span>
                  <br />
                  <span className="text-sm font-normal">{translations.comparison.columns.skiinSubtitle}</span>
                </th>
                <th className="py-4 px-6 text-center">
                  <span className="font-bold">{translations.comparison.columns.holter}</span>
                  <br />
                  <span className="text-sm font-normal">{translations.comparison.columns.holterSubtitle}</span>
                </th>
                <th className="py-4 px-6 text-center">
                  <span className="font-bold">{translations.comparison.columns.event}</span>
                  <br />
                  <span className="text-sm font-normal">{translations.comparison.columns.eventSubtitle}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-muted/20"}
                >
                  <td className="py-4 px-6 border-t">{row.feature}</td>
                  <td className="py-4 px-6 text-center border-t">
                    {row.skiin ? (
                      <Check className="inline-block text-green-500 w-5 h-5" />
                    ) : (
                      <X className="inline-block text-red-500 w-5 h-5" />
                    )}
                  </td>
                  <td className="py-4 px-6 text-center border-t">
                    {row.holter ? (
                      <Check className="inline-block text-green-500 w-5 h-5" />
                    ) : (
                      <X className="inline-block text-red-500 w-5 h-5" />
                    )}
                  </td>
                  <td className="py-4 px-6 text-center border-t">
                    {row.event ? (
                      <Check className="inline-block text-green-500 w-5 h-5" />
                    ) : (
                      <X className="inline-block text-red-500 w-5 h-5" />
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

export default ComparisonSection;
