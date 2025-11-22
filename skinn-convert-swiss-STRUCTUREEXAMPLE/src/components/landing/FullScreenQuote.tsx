import React from 'react';
import { cn } from '@/lib/utils';

interface FullScreenQuoteProps {
  className?: string;
}

export const FullScreenQuote: React.FC<FullScreenQuoteProps> = ({ className }) => {
  return (
    <section className={cn("relative min-h-screen flex items-center", className)}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/assets/images/product/Mother-daughter-HQ.jpg"
          alt="Mother and daughter embracing"
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Quote Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-4xl">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            "She's okay – and now<br />
            I know for sure."
          </h2>
        </div>
      </div>
    </section>
  );
};