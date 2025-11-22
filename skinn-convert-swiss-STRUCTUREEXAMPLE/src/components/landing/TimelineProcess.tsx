import React, { useRef, useEffect, useState } from 'react';
import { Calendar, Package, Smartphone, FileText, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProcessStep {
  id: number;
  icon: React.ElementType;
  title: string;
  description: string;
  duration: string;
  color: string;
}

const steps: ProcessStep[] = [
  {
    id: 1,
    icon: Calendar,
    title: "Book Appointment",
    description: "Schedule a quick consultation with your doctor",
    duration: "Day 1",
    color: "bg-lp-primary-blue"
  },
  {
    id: 2,
    icon: Package,
    title: "Receive Device",
    description: "SKIIN kit delivered to your home",
    duration: "Day 2-3",
    color: "bg-lp-dark-blue"
  },
  {
    id: 3,
    icon: Smartphone,
    title: "Easy Setup",
    description: "5-minute app-guided installation",
    duration: "Day 3",
    color: "bg-lp-primary-blue"
  },
  {
    id: 4,
    icon: Heart,
    title: "Monitor Heart",
    description: "Live normally while SKIIN monitors 24/7",
    duration: "Days 3-13",
    color: "bg-lp-dark-blue"
  },
  {
    id: 5,
    icon: FileText,
    title: "Get Results",
    description: "Comprehensive report sent to you and your doctor",
    duration: "Day 14-15",
    color: "bg-lp-primary-blue"
  }
];

export const TimelineProcess: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const element = scrollRef.current;
    if (element) {
      element.addEventListener('scroll', checkScroll);
      return () => element.removeEventListener('scroll', checkScroll);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-20 bg-gradient-lp-timeline">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Your Journey to Better Heart Health
          </h2>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto">
            From consultation to results in just 15 days
          </p>
        </div>

        {/* Desktop Timeline */}
        <div className="hidden lg:block max-w-6xl mx-auto">
          <div className="relative">
            {/* Main Timeline Line */}
            <div className="absolute top-24 left-0 right-0 h-1 bg-white/20">
              <div className="h-full bg-white/40" style={{
                background: 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.6) 100%)'
              }} />
            </div>

            {/* Steps */}
            <div className="relative grid grid-cols-5 gap-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.id} className="relative text-center">
                    {/* Step Number */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-white/60 text-sm font-medium">
                      Step {step.id}
                    </div>

                    {/* Icon Circle */}
                    <div className="relative mx-auto w-20 h-20 mb-6">
                      <div className={cn(
                        "absolute inset-0 rounded-full opacity-20",
                        step.color
                      )} />
                      <div className="relative w-full h-full bg-white rounded-full shadow-lg flex items-center justify-center">
                        <Icon className="w-8 h-8 text-lp-dark-blue" />
                      </div>
                      
                      {/* Connector Dot */}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-3 h-3 bg-white rounded-full" />
                    </div>

                    {/* Content */}
                    <div className="text-white">
                      <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                      <p className="text-sm text-blue-100 mb-3">{step.description}</p>
                      <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                        {step.duration}
                      </span>
                    </div>

                    {/* Progress Arrow */}
                    {index < steps.length - 1 && (
                      <div className="absolute top-24 right-0 transform translate-x-1/2 text-white/40">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="lg:hidden relative">
          {/* Scroll Indicators */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white/90 rounded-r-lg shadow-lg"
              aria-label="Scroll left"
            >
              <svg className="w-5 h-5 text-lp-dark-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white/90 rounded-l-lg shadow-lg"
              aria-label="Scroll right"
            >
              <svg className="w-5 h-5 text-lp-dark-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Scrollable Container */}
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide space-x-6 pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex-shrink-0 w-72">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center",
                        step.color
                      )}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Step {step.id}</p>
                        <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                      </div>
                    </div>
                    <p className="text-blue-100 text-sm mb-3">{step.description}</p>
                    <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium text-white">
                      {step.duration}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Scroll Hint */}
          <div className="text-center mt-4">
            <p className="text-xs text-white/60">Swipe to see all steps →</p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <button className="px-8 py-4 bg-white text-lp-dark-blue font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-lg">
            Start Your Journey
          </button>
          <p className="mt-4 text-sm text-blue-100">
            Most patients complete the entire process in under 2 weeks
          </p>
        </div>
      </div>
    </section>
  );
};