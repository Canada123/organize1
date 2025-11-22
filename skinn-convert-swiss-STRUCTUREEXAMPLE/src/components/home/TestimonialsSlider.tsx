import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  rating?: number;
}

interface TestimonialsSliderProps {
  testimonials?: Testimonial[];
  className?: string;
  autoPlay?: boolean;
  interval?: number;
}

export function TestimonialsSlider({ 
  testimonials: customTestimonials,
  className,
  autoPlay = true,
  interval = 5000
}: TestimonialsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const t = useTranslation('home');
  const { language } = useLanguage();
  
  // Use custom testimonials or default from translations
  const testimonials = customTestimonials || t.testimonials?.items || [];

  useEffect(() => {
    if (!autoPlay || testimonials.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, testimonials.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  if (testimonials.length === 0) return null;

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className={cn("py-16 md:py-20 bg-gradient-to-br from-secondary/5 to-background", className)}>
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="text-sm font-medium text-medical-teal mb-2">
            {t.testimonials?.tagline || 'Testimonials'}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {t.testimonials?.title || 'Trusted by Doctors and Patients'}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t.testimonials?.subtitle || 'Hear from healthcare providers and patients who have experienced the benefits of SKIIN'}
          </p>
        </div>

        {/* Testimonial Slider */}
        <div className="relative max-w-4xl mx-auto">
          <Card className="border-2 shadow-lg">
            <CardContent className="p-8 md:p-12">
              {/* Quote Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-medical-teal/10 flex items-center justify-center">
                  <Quote className="w-8 h-8 text-medical-teal" />
                </div>
              </div>

              {/* Testimonial Content */}
              <div className="text-center mb-8">
                <p className="text-lg md:text-xl lg:text-2xl text-foreground leading-relaxed italic mb-6">
                  "{currentTestimonial.quote}"
                </p>

                {/* Rating Stars */}
                {currentTestimonial.rating && (
                  <div className="flex justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-5 h-5",
                          i < currentTestimonial.rating! 
                            ? "fill-yellow-400 text-yellow-400" 
                            : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                )}

                {/* Author */}
                <div>
                  <p className="font-semibold text-lg">{currentTestimonial.name}</p>
                  <p className="text-muted-foreground">{currentTestimonial.title}</p>
                </div>
              </div>

              {/* Navigation */}
              {testimonials.length > 1 && (
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrevious}
                    className="rounded-full"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  {/* Indicators */}
                  <div className="flex gap-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all duration-300",
                          index === currentIndex
                            ? "w-8 bg-medical-teal"
                            : "bg-gray-300 hover:bg-gray-400"
                        )}
                      />
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNext}
                    className="rounded-full"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* CTA to view more testimonials */}
          <div className="text-center mt-8">
            <Link 
              to={`/${language}/about/testimonials`}
              className="text-medical-teal hover:text-medical-teal/80 font-medium inline-flex items-center gap-2"
            >
              View More Patient Stories
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}