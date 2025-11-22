import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const ScrollProgress: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      
      // Only show progress when user has scrolled at least 1%
      setIsVisible(progress > 1);
    };

    // Delay initial check to ensure DOM is ready
    const timer = setTimeout(() => {
      handleScroll();
    }, 100);

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* Top Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary/20 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-accent"
          style={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </motion.div>

      {/* Side Progress Indicator */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
          className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:block"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
        <div className="flex flex-col items-center space-y-2">
          <span className="text-xs text-muted-foreground font-medium">
            {Math.round(scrollProgress)}%
          </span>
          <div className="relative w-1 h-40 bg-muted/30 rounded-full overflow-hidden">
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary to-accent rounded-full"
              style={{ height: `${scrollProgress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <span className="text-xs text-muted-foreground">Scroll</span>
        </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};