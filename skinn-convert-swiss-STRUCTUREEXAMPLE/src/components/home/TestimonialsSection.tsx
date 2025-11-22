
import React from "react";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";

const TestimonialsSection = () => {
  const translations = useTranslation('home');
  
  const testimonials = [
    {
      quote: translations.testimonials.items[0].quote,
      name: translations.testimonials.items[0].name,
      title: translations.testimonials.items[0].title,
      image: "/assets/images/2c470df9-6b84-48a2-b3f4-d958760f8b36.png"
    },
    {
      quote: translations.testimonials.items[1].quote,
      name: translations.testimonials.items[1].name,
      title: translations.testimonials.items[1].title,
      image: ""
    },
    {
      quote: translations.testimonials.items[2].quote,
      name: translations.testimonials.items[2].name,
      title: translations.testimonials.items[2].title,
      image: "/assets/images/72de88b6-6f7b-4e58-abb2-dc50a762a353.png"
    },
  ];

  return (
    <section className="section-padding bg-gradient-to-b from-background to-muted/30">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-md transition-shadow bg-white border-none"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 42 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mb-4 text-primary/30"
              >
                <path
                  d="M11.6249 36L0.374945 24.75V13.5H15.7499V28.125H4.49995L11.6249 36ZM33.7499 36L22.4999 24.75V13.5H37.8749V28.125H26.6249L33.7499 36Z"
                  fill="currentColor"
                />
              </svg>
              <p className="text-muted-foreground mb-6">"{testimonial.quote}"</p>
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
      </div>
    </section>
  );
};

export default TestimonialsSection;
