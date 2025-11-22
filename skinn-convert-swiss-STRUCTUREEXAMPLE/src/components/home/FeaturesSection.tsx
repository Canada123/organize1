
import React from "react";
import { Heart, Clock, Activity, Shield, Flower, Link } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

/**
 * FeaturesSection component for the homepage
 * Uses the translation system to display content in the appropriate language
 */
const FeaturesSection = () => {
  const translations = useTranslation('home');
  
  // Icons for each feature
  const featureIcons = [
    <Heart className="w-6 h-6 text-primary" />,
    <Shield className="w-6 h-6 text-primary" />,
    <Activity className="w-6 h-6 text-primary" />,
    <Clock className="w-6 h-6 text-primary" />,
    <Flower className="w-6 h-6 text-primary" />,
    <Link className="w-6 h-6 text-primary" />
  ];

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {translations.features.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {translations.features.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {translations.features.items.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-secondary/50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                {featureIcons[index]}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
