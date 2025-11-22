import React from 'react';
import { MinimalCard, MinimalCardContent } from '@/components/ui/minimal-card';
import { Quote } from 'lucide-react';

interface TestimonialType {
  quote: string;
  author: string;
  condition: string;
}

const testimonials: TestimonialType[] = [
  {
    quote: "SKIIN detected my atrial fibrillation before I felt any symptoms. The early detection allowed me to start treatment immediately.",
    author: "Maria K.",
    condition: "AFib Patient, Zurich"
  },
  {
    quote: "The comfort of wearing SKIIN for 10 days was remarkable. I could shower, exercise, and live normally while being monitored.",
    author: "Thomas B.",
    condition: "Heart Monitoring, Basel"
  },
  {
    quote: "My insurance covered everything, and the process was seamless. Results came back in just 2 days with a detailed report.",
    author: "Sophie L.",
    condition: "Preventive Screening, Geneva"
  }
];

export const MinimalTestimonials: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-[#EEE8E1]">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#0D0D0D] mb-4">
            Real Stories, Real Results
          </h2>
          <p className="text-lg text-[#475259] max-w-2xl mx-auto">
            Hear from Swiss families who discovered peace of mind with SKIIN
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <MinimalCard key={index} variant="soft" className="relative">
              <MinimalCardContent className="pt-8">
                <Quote className="w-8 h-8 text-[#004C96]/20 mb-4" />
                <p className="text-[#475259] mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-[#004C96]/10 pt-4">
                  <p className="font-semibold text-[#0D0D0D]">{testimonial.author}</p>
                  <p className="text-sm text-[#475259]">{testimonial.condition}</p>
                </div>
              </MinimalCardContent>
            </MinimalCard>
          ))}
        </div>
      </div>
    </section>
  );
};