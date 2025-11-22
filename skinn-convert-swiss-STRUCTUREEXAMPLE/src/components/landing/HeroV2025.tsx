import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface HeroV2025Props {
  className?: string;
}

export const HeroV2025: React.FC<HeroV2025Props> = ({ className }) => {
  const navigate = useNavigate();
  const [showHeadlines, setShowHeadlines] = useState(false);
  const [showRest, setShowRest] = useState(false);

  useEffect(() => {
    // Show headlines immediately
    setShowHeadlines(true);
    
    // Show everything else after 1.5 seconds
    const timer = setTimeout(() => {
      setShowRest(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleCTAClick = () => {
    // Navigate to the eligibility flow
    navigate('/eligibility');
  };

  // Headline animation - immediate fade in
  const headlineVariants = {
    hidden: { 
      opacity: 0,
      y: 30
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  // Rest of content animation
  const fadeInVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <section className={cn("min-h-screen bg-muted flex items-center", className)}>
      <div className="container mx-auto px-6">
        <div className="text-center max-w-6xl mx-auto">
          {/* Headlines appear FIRST */}
          <motion.div 
            className="mb-12"
            initial="hidden"
            animate={showHeadlines ? "visible" : "hidden"}
          >
            {/* Tagline comes first */}
            <motion.p 
              className="text-sm uppercase tracking-widest text-muted-foreground mb-8 font-medium"
              variants={headlineVariants}
            >
              LIVE WELL. START WITH YOUR HEART.
            </motion.p>

            {/* Main Headline */}
            <motion.h1 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold mb-8 leading-tight lg:whitespace-nowrap"
              variants={headlineVariants}
            >
              <span className="text-foreground">Most heart issues are silent.</span>
            </motion.h1>

            {/* Subheadline - Same font size as headline, centered */}
            <motion.h2 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-accent leading-tight text-center mx-auto"
              variants={headlineVariants}
            >
              A simple check can make all the difference.
            </motion.h2>
          </motion.div>

          {/* Rest of content appears after delay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showRest ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          >

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={showRest ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <button 
                onClick={handleCTAClick}
                className="
                bg-secondary-foreground 
                hover:bg-secondary-foreground/90 
                text-white 
                px-10 py-5 
                rounded-lg 
                text-lg 
                font-medium 
                transition-all 
                duration-300 
                transform 
                hover:scale-105 
                shadow-lg
                hover:shadow-xl
              ">
                Check your heart from home →
              </button>
            </motion.div>

            {/* Trust Line */}
            <motion.div 
              className="mt-20 pt-8 border-t border-muted-foreground/10"
              initial={{ opacity: 0 }}
              animate={showRest ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                <span className="text-xs uppercase tracking-wider text-muted-foreground/70">
                  Certified by BAG
                </span>
                <span className="hidden sm:block text-muted-foreground/30">•</span>
                <span className="text-xs uppercase tracking-wider text-muted-foreground/70">
                  Covered by Insurance
                </span>
                <span className="hidden sm:block text-muted-foreground/30">•</span>
                <span className="text-xs uppercase tracking-wider text-muted-foreground/70">
                  Delivered to Your Home
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};