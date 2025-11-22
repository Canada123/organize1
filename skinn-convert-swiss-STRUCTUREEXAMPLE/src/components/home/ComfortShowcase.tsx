import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Heart, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface ComfortShowcaseProps {
  className?: string;
}

/**
 * Comfort Showcase Component - Full Screen Version
 * Features Maria's testimonial with comfort-focused messaging
 * Now with parallax effects and full viewport experience
 */
export function ComfortShowcase({ className }: ComfortShowcaseProps) {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.2,
    triggerOnce: false
  });
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const scrollProgress = 1 - (rect.top / window.innerHeight);
        setScrollY(scrollProgress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const comfortFeatures = [
    "No wires or adhesive patches",
    "Soft, breathable medical textile",
    "Machine washable and reusable",
    "Hypoallergenic for sensitive skin",
    "Wear during sleep and daily activities",
    "Water-resistant for showering"
  ];

  return (
    <section 
      ref={sectionRef}
      className={cn(
        "relative min-h-screen flex items-center justify-center overflow-hidden",
        "bg-gradient-to-b from-background via-secondary/5 to-background",
        className
      )}
      data-testid="comfort-showcase-section"
    >
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          transform: `translateY(${scrollY * 20}px)`,
          backgroundImage: 'radial-gradient(circle at 20% 50%, var(--medical-teal) 0%, transparent 50%), radial-gradient(circle at 80% 80%, var(--medical-blue) 0%, transparent 50%)'
        }}
      />
      
      {/* Large Background Text */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          transform: `translateY(${scrollY * 40}px)`,
        }}
      >
        <h1 className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-bold text-foreground/[0.02] select-none leading-none">
          COMFORT
        </h1>
      </div>

      <div className="container-custom relative z-10 py-20">
        <div 
          ref={ref}
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* Left: Visual and Testimonial */}
          <div 
            className={cn(
              "space-y-6 transition-all duration-1000",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            )}
          >
            <div className="relative">
              <img 
                src="/assets/images/1f227914-01f4-49cb-9a48-3f39976b4898.png"
                alt="Maria wearing SKIIN - comfort testimonial"
                className="rounded-2xl shadow-xl w-full"
                loading="lazy"
                data-testid="maria-comfort-image"
              />
              <Card 
                className="absolute -bottom-6 -right-6 lg:-right-12 p-6 max-w-sm shadow-2xl bg-white/95 backdrop-blur-md border-0"
                style={{
                  transform: `translateY(${scrollY * -10}px)`
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-medical-teal/10">
                    <Heart className="w-5 h-5 text-medical-teal" />
                  </div>
                  <div>
                    <p className="text-lg font-medium italic text-foreground mb-2">
                      "I almost forgot I was wearing it – so comfortable!"
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Maria, 58, Zurich
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Right: Content */}
          <div 
            className={cn(
              "space-y-6 transition-all duration-1000 delay-300",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            )}
          >
            <div>
              <span className="text-medical-teal font-medium flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4" />
                Comfort Redefined
              </span>
              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6 leading-tight">
                <span className="block text-2xl lg:text-3xl font-medium text-muted-foreground mb-2">Experience</span>
                Soft as Your Second Skin
              </h2>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                Traditional heart monitors use sticky patches and tangled wires that irritate skin and disrupt sleep. 
                <span className="font-semibold text-foreground"> SKIIN changes everything</span> with soft, textile-based monitoring that feels like your favorite underwear.
              </p>
            </div>

            {/* Comfort Features */}
            <div className="space-y-3">
              {comfortFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-medical-teal flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            {/* Sensitive Skin Focus */}
            <Card className="p-6 bg-medical-teal/5 border-medical-teal/20">
              <h3 className="font-semibold text-lg mb-2">Perfect for Sensitive Skin</h3>
              <p className="text-muted-foreground text-sm">
                Developed with dermatologists, SKIIN uses medical-grade textiles that are gentle on even the most 
                sensitive skin. No latex, no adhesives, no irritation – just comfortable, continuous monitoring.
              </p>
            </Card>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="default" 
                size="lg"
                onClick={() => window.location.href = '/about/contact'}
                data-testid="comfort-cta-primary"
              >
                Experience SKIIN Comfort
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.location.href = '/solutions/10-day-heart-screening'}
                data-testid="comfort-cta-secondary"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Comfort Images */}
        <div 
          className={cn(
            "mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-1000 delay-600",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}
        >
          <div className="relative group overflow-hidden rounded-lg">
            <img 
              src="/assets/images/32de0ca4-a556-4e60-bfaf-fc48bf4bd27c.png"
              alt="Person comfortably wearing SKIIN band"
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-sm font-medium">Daily Comfort</p>
              </div>
            </div>
          </div>
          
          <div className="relative group overflow-hidden rounded-lg">
            <img 
              src="/assets/images/product/skiin-kit.webp"
              alt="SKIIN complete kit"
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-sm font-medium">Complete Kit</p>
              </div>
            </div>
          </div>

          <div className="relative group overflow-hidden rounded-lg">
            <img 
              src="/assets/images/product/visual-compar-skiin-medical-wearable.png"
              alt="SKIIN vs traditional monitors comparison"
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-sm font-medium">Superior Comfort</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}