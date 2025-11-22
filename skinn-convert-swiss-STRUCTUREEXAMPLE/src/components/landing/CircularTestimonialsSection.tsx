import React from 'react';
import { CircularTestimonials } from '@/components/ui/circular-testimonials';

const testimonials = [
  {
    quote: "After my routine checkup showed irregular heartbeats, my doctor recommended SKIIN. The peace of mind it gives me is priceless. I can live my life normally while knowing my heart is being monitored 24/7.",
    name: "Maria S.",
    designation: "58 years old • Zürich",
    src: "https://images.unsplash.com/photo-1582549762933-a3a9d5c1580f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    quote: "The traditional Holter monitor was so uncomfortable I couldn't sleep. SKIIN is completely different - I forget I'm wearing it. Got my results in just 2 days and my insurance covered everything.",
    name: "Thomas R.",
    designation: "62 years old • Geneva",
    src: "https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    quote: "As someone with a family history of heart issues, early detection is crucial. SKIIN found an arrhythmia that short tests missed. My cardiologist said catching it early made all the difference.",
    name: "Elisabeth M.",
    designation: "45 years old • Basel",
    src: "https://images.unsplash.com/photo-1598978483688-92d0e6c4e8a6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

export const CircularTestimonialsSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
            REAL STORIES
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            What Our Patients Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Join thousands of Swiss families who have discovered peace of mind with SKIIN's comfortable, continuous heart monitoring
          </p>
        </div>
        
        <div className="flex justify-center">
          <CircularTestimonials
            testimonials={testimonials}
            autoplay={true}
            colors={{
              name: "hsl(var(--foreground))",
              designation: "hsl(var(--muted-foreground))",
              testimony: "hsl(var(--foreground))",
              arrowBackground: "hsl(var(--secondary-foreground))",
              arrowForeground: "hsl(var(--background))",
              arrowHoverBackground: "hsl(var(--primary))",
            }}
            fontSizes={{
              name: "1.75rem",
              designation: "1rem",
              quote: "1.125rem",
            }}
          />
        </div>
      </div>
    </section>
  );
};