import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scale' | 'blur';
  delay?: number;
  duration?: number;
  stagger?: boolean;
  triggerOnce?: boolean;
}

const animations = {
  fadeUp: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 }
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  slideLeft: {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 }
  },
  slideRight: {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 }
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  },
  blur: {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    visible: { opacity: 1, filter: 'blur(0px)' }
  }
};

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className,
  animation = 'fadeUp',
  delay = 0,
  duration = 0.6,
  stagger = false,
  triggerOnce = true
}) => {
  const { ref, isInView } = useScrollAnimation({ triggerOnce });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={animations[animation]}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // Custom easing
        staggerChildren: stagger ? 0.1 : 0
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
};