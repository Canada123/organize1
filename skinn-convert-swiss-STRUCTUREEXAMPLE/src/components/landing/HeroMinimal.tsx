import React from 'react';
import { cn } from '@/lib/utils';

interface HeroMinimalProps {
  className?: string;
}

export const HeroMinimal: React.FC<HeroMinimalProps> = ({ className }) => {
  return (
    <section className={cn("min-h-screen bg-muted flex items-center", className)}>
      <div className="container mx-auto px-6">
        <div className="text-center max-w-5xl mx-auto">
          {/* Tagline */}
          <p className="text-sm uppercase tracking-wider text-muted-foreground mb-8">
            LIVE WELL. START WITH YOUR HEART.
          </p>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-foreground">Most heart issues show no signs.</span>
          </h1>

          {/* Subheadline - Purple */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-accent mb-12">
            A simple check can make all the difference.
          </h2>

          {/* CTA Button */}
          <button className="bg-secondary-foreground hover:bg-secondary-foreground/90 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors">
            Check your heart from home →
          </button>

          {/* Trust Line */}
          <div className="mt-16 pt-8 border-t border-muted-foreground/20">
            <p className="text-sm text-muted-foreground uppercase tracking-wide">
              CERTIFIED BY BAG | COVERED BY INSURANCE | DELIVERED TO YOUR HOME
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};