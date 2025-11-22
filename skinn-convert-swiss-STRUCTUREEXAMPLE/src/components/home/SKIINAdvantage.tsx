import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { CheckCircle, Zap, Heart, Shield, Brain, Timer, Award, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * Consolidated SKIIN Advantage component showcasing technology, benefits, and comfort
 * with modern visual design using images instead of icons
 */
export function SKIINAdvantage() {
  const t = useTranslation('home');
  
  // Define the consolidated advantages
  const advantages = [
    {
      title: "Revolutionary Myant Technology",
      description: "Advanced textile computing meets medical precision. Our patented smart garments seamlessly integrate sensors into soft, breathable fabric.",
      image: "/assets/images/product/smart-textile-knitting-electrodes.jpg",
      badge: "Patented Technology",
      highlights: [
        "Medical-grade ECG sensors woven into fabric",
        "No adhesives, wires, or rigid components",
        "Continuous 10-day monitoring capability"
      ]
    },
    {
      title: "Why SKIIN Leads in Cardiac Monitoring",
      description: "Proven clinical accuracy with unmatched comfort. SKIIN transforms heart health monitoring for better patient outcomes.",
      image: "/assets/images/product/wear-skiin-man-band-insert-pod.png",
      badge: "Clinical Excellence",
      highlights: [
        "98.6% accuracy matching traditional Holter monitors",
        "66% detection rate vs 9% with 24-hour tests",
        "AI-powered analysis validated by Swiss cardiologists"
      ]
    },
    {
      title: "Comfort That Changes Everything",
      description: "Soft as your second skin. Our garments are designed for real life - shower, sleep, and exercise without disruption.",
      image: "/assets/images/product/skiin-your-second-skin.png",
      badge: "Patient Preferred",
      highlights: [
        "Water-resistant and washable design",
        "Hypoallergenic medical-grade materials",
        "94% patient compliance rate"
      ]
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-b from-background via-secondary/5 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-medical-teal rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-professional-teal rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            The SKIIN Advantage
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Where breakthrough technology meets exceptional patient care
          </p>
        </div>

        {/* Advantages Grid */}
        <div className="space-y-20">
          {advantages.map((advantage, index) => (
            <div 
              key={index} 
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image Column */}
              <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="relative group overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src={advantage.image}
                    alt={advantage.title}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  {/* Badge Overlay */}
                  <div className="absolute top-4 left-4">
                    <Badge 
                      variant="default" 
                      className="bg-background/95 backdrop-blur-sm text-foreground shadow-lg"
                    >
                      {advantage.badge}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Content Column */}
              <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                    {advantage.title}
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {advantage.description}
                  </p>
                </div>

                {/* Highlights */}
                <ul className="space-y-3">
                  {advantage.highlights.map((highlight, hIndex) => (
                    <li key={hIndex} className="flex gap-3 items-start">
                      <CheckCircle className="w-5 h-5 text-medical-teal shrink-0 mt-0.5" />
                      <span className="text-foreground">{highlight}</span>
                    </li>
                  ))}
                </ul>

                {/* Learn More Link */}
                <div className="pt-2">
                  <a 
                    href="/how-it-works/technology" 
                    className="inline-flex items-center gap-2 text-medical-teal hover:text-medical-teal/80 font-medium transition-colors group"
                  >
                    Learn more about our technology
                    <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">
                      →
                    </span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-20 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-medical-teal/10 to-professional-teal/10 border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Experience the Difference?
              </h3>
              <p className="text-muted-foreground mb-6">
                Join thousands who have already benefited from comfortable, accurate cardiac monitoring
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/eligibility" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Start Your Free Assessment
                </a>
                <a 
                  href="/how-it-works/evidence" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
                >
                  View Clinical Evidence
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}