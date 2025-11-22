import React from 'react';
import { ArrowRight, Shield, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeroFullScreenProps {
  className?: string;
}

export const HeroFullScreen: React.FC<HeroFullScreenProps> = ({ className }) => {
  return (
    <section className={cn("relative min-h-screen flex items-center overflow-hidden", className)}>
      {/* Full-screen Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/images/product/Mother-daughter-HQ.jpg"
          alt="Mother and daughter embracing"
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-lp-dark-blue/90 via-lp-dark-blue/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-lp-black/50" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-2xl">
          {/* Trust Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8 animate-fadeIn">
            <Shield className="w-5 h-5 text-lp-primary-blue" />
            <span className="text-sm font-medium text-white">
              MDR Class IIa Certified • Covered by Swiss Insurance
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-fadeIn animation-delay-100">
            Most Heart Issues
            <span className="block text-lp-primary-blue">Are Silent</span>
          </h1>

          {/* Subheadline */}
          <p className="text-2xl md:text-3xl text-white/90 mb-8 animate-fadeIn animation-delay-200">
            Until it's too late. Screen from home with medical-grade accuracy.
          </p>

          {/* Body Text */}
          <p className="text-lg text-white/80 mb-8 max-w-xl animate-fadeIn animation-delay-300">
            SKIIN's 10-day cardiac monitoring catches what others miss. 
            Join thousands of Swiss families taking control of their heart health.
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fadeIn animation-delay-400">
            <Button 
              size="lg"
              className="bg-lp-primary-blue hover:bg-lp-dark-blue text-white px-8 py-6 text-lg group"
            >
              Start Your Free Heart Check
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg"
            >
              Learn How It Works
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap gap-6 mt-12 animate-fadeIn animation-delay-500">
            <div className="flex items-center space-x-2 text-white/80">
              <Heart className="w-5 h-5 text-lp-primary-blue" />
              <span className="text-sm">15,000+ Hearts Monitored</span>
            </div>
            <div className="flex items-center space-x-2 text-white/80">
              <Shield className="w-5 h-5 text-lp-primary-blue" />
              <span className="text-sm">98.6% Detection Accuracy</span>
            </div>
            <div className="flex items-center space-x-2 text-white/80">
              <Heart className="w-5 h-5 text-lp-primary-blue" />
              <span className="text-sm">Results in 48 Hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
        </div>
      </div>
    </section>
  );
};