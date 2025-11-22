import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  backgroundImage?: string;
  speed?: number; // 0-1, where 0 is no parallax and 1 is full parallax
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  className,
  backgroundImage,
  speed = 0.5
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      {backgroundImage && (
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            y,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            willChange: 'transform'
          }}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};