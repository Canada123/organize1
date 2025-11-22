import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Testimonial {
  id: number;
  name: string;
  age: number;
  location: string;
  quote: string;
  highlight: string;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Maria S.",
    age: 58,
    location: "Zürich",
    quote: "After my routine checkup showed irregular heartbeats, my doctor recommended SKIIN. The peace of mind it gives me is priceless. I can live my life normally while knowing my heart is being monitored 24/7.",
    highlight: "Peace of mind is priceless",
    image: "/assets/images/testimonials/testimonial-1.jpg"
  },
  {
    id: 2,
    name: "Thomas R.",
    age: 62,
    location: "Geneva",
    quote: "The traditional Holter monitor was so uncomfortable I couldn't sleep. SKIIN is completely different - I forget I'm wearing it. Got my results in just 2 days and my insurance covered everything.",
    highlight: "I forget I'm wearing it",
    image: "/assets/images/testimonials/testimonial-2.jpg"
  },
  {
    id: 3,
    name: "Elisabeth M.",
    age: 45,
    location: "Basel",
    quote: "As someone with a family history of heart issues, early detection is crucial. SKIIN found an arrhythmia that short tests missed. My cardiologist said catching it early made all the difference.",
    highlight: "Catching it early made all the difference",
    image: "/assets/images/testimonials/testimonial-3.jpg"
  }
];

interface TestimonialsV2Props {
  variant?: 'divider' | 'carousel';
}

export const TestimonialsV2: React.FC<TestimonialsV2Props> = ({ variant = 'divider' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (variant === 'divider') {
    // Full-width divider variant
    return (
      <section className="relative py-24 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="/assets/images/testimonials/testimonial-bg.jpg"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-lp-dark-blue/90 to-lp-primary-blue/80" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Quote className="w-16 h-16 mx-auto mb-8 opacity-50" />
            
            <blockquote className="text-2xl md:text-3xl font-light mb-8 leading-relaxed">
              "{testimonials[currentIndex].quote}"
            </blockquote>

            <p className="text-xl font-semibold mb-2">
              {testimonials[currentIndex].highlight}
            </p>

            <div className="flex items-center justify-center space-x-2 text-white/80">
              <span className="font-medium">{testimonials[currentIndex].name}</span>
              <span>•</span>
              <span>{testimonials[currentIndex].age} years old</span>
              <span>•</span>
              <span>{testimonials[currentIndex].location}</span>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    index === currentIndex
                      ? "w-8 bg-white"
                      : "bg-white/40 hover:bg-white/60"
                  )}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Carousel variant
  return (
    <section className="py-16 bg-lp-cream">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-lp-dark-blue mb-4">
            Real Stories from Real Patients
          </h2>
          <p className="text-lg text-lp-charcoal">
            Join thousands of Swiss families who trust SKIIN for their heart health
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex items-start space-x-2 mb-6">
              <Quote className="w-8 h-8 text-lp-primary-blue/30 flex-shrink-0" />
              <blockquote className="text-lg md:text-xl text-lp-charcoal leading-relaxed">
                {testimonials[currentIndex].quote}
              </blockquote>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-lp-dark-blue">
                  {testimonials[currentIndex].name}
                </p>
                <p className="text-sm text-lp-charcoal">
                  {testimonials[currentIndex].age} years old • {testimonials[currentIndex].location}
                </p>
              </div>

              {/* Navigation Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={prevTestimonial}
                  className="p-2 rounded-lg border border-gray-200 hover:border-lp-primary-blue hover:text-lp-primary-blue transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="p-2 rounded-lg border border-gray-200 hover:border-lp-primary-blue hover:text-lp-primary-blue transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Highlight Badge */}
            <div className="mt-6 inline-flex items-center px-4 py-2 bg-lp-primary-blue/10 rounded-full">
              <span className="text-sm font-medium text-lp-primary-blue">
                "{testimonials[currentIndex].highlight}"
              </span>
            </div>
          </div>

          {/* Mobile Swipe Indicator */}
          <div className="md:hidden flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === currentIndex
                    ? "w-8 bg-lp-primary-blue"
                    : "bg-gray-300"
                )}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button className="text-lp-primary-blue hover:text-lp-dark-blue font-medium transition-colors">
            Read More Patient Stories →
          </button>
        </div>
      </div>
    </section>
  );
};