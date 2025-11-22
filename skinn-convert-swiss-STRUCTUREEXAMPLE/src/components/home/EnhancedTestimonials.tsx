import React from "react";
import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

interface EnhancedTestimonialsProps {
  className?: string;
}

/**
 * Enhanced Testimonials Section with Maria comfort testimonial
 * Includes patient stories and doctor endorsements
 */
export function EnhancedTestimonials({ className }: EnhancedTestimonialsProps) {
  const translations = useTranslation('home');
  
  const testimonials = [
    {
      quote: "I almost forgot I was wearing it – so comfortable! As someone with sensitive skin, I was amazed that I could wear SKIIN for the full 10 days without any irritation.",
      name: "Maria, 58",
      location: "Zurich",
      title: "Heart Monitoring Patient",
      image: "/assets/images/1f227914-01f4-49cb-9a48-3f39976b4898.png",
      isFeature: true,
      rating: 5
    },
    {
      quote: translations.testimonials.items[0].quote,
      name: translations.testimonials.items[0].name,
      title: translations.testimonials.items[0].title,
      image: "/assets/images/2c470df9-6b84-48a2-b3f4-d958760f8b36.png",
      rating: 5
    },
    {
      quote: translations.testimonials.items[1].quote,
      name: translations.testimonials.items[1].name,
      title: translations.testimonials.items[1].title,
      image: "",
      rating: 5
    },
    {
      quote: translations.testimonials.items[2].quote,
      name: translations.testimonials.items[2].name,
      title: translations.testimonials.items[2].title,
      image: "/assets/images/72de88b6-6f7b-4e58-abb2-dc50a762a353.png",
      rating: 5
    },
  ];

  return (
    <section 
      className={cn("section-padding bg-gradient-to-b from-background to-muted/30", className)}
      data-testid="enhanced-testimonials-section"
    >
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-medium">{translations.testimonials.tagline}</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            {translations.testimonials.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {translations.testimonials.subtitle}
          </p>
        </div>

        {/* Feature Testimonial - Maria */}
        <div className="mb-12" data-testid="feature-testimonial">
          <Card className="p-8 lg:p-12 shadow-lg border-medical-teal/20 bg-gradient-to-br from-white to-medical-teal/5">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="order-2 lg:order-1">
                <Quote className="w-12 h-12 text-medical-teal/30 mb-6" />
                <p className="text-xl lg:text-2xl text-foreground mb-6 italic">
                  "{testimonials[0].quote}"
                </p>
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(testimonials[0].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{testimonials[0].name}, {testimonials[0].location}</h4>
                  <p className="text-muted-foreground">{testimonials[0].title}</p>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <img
                  src={testimonials[0].image}
                  alt={`${testimonials[0].name} - SKIIN comfort testimonial`}
                  className="w-full rounded-lg shadow-md"
                  loading="lazy"
                  data-testid="maria-testimonial-image"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Other Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.slice(1).map((testimonial, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-md transition-shadow bg-white border-none"
              data-testid={`testimonial-${index + 1}`}
            >
              <div className="flex items-center gap-2 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center">
                {testimonial.image ? (
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <span className="text-primary font-medium text-lg">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Swiss Patient Stories CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Join hundreds of Swiss patients who have discovered peace of mind through SKIIN monitoring
          </p>
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-muted-foreground">500+ Swiss patients monitored</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-muted-foreground">94% wear compliance rate</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}