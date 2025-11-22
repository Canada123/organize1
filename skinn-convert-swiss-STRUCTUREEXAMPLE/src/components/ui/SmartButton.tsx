import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface SmartButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  success?: boolean;
  ripple?: boolean;
}

export const SmartButton: React.FC<SmartButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  success = false,
  ripple = true,
  className,
  disabled,
  onClick,
  ...props
}) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple && !disabled && !loading) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      
      setRipples(prev => [...prev, { x, y, id }]);
      
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
      }, 600);
    }
    
    if (onClick) onClick(e);
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'bg-secondary-foreground text-white hover:bg-secondary-foreground/90',
    secondary: 'bg-secondary text-foreground hover:bg-secondary/80',
    outline: 'border-2 border-secondary-foreground text-secondary-foreground hover:bg-secondary-foreground hover:text-white'
  };

  return (
    <motion.button
      className={cn(
        'relative overflow-hidden font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      onClick={handleClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      {...props}
    >
      {/* Ripple Effect */}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full bg-white/30"
            style={{
              left: ripple.x,
              top: ripple.y,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: 200, height: 200, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>

      {/* Button Content */}
      <span className="relative z-10 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center"
            >
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Loading...
            </motion.span>
          ) : success ? (
            <motion.span
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Success!
            </motion.span>
          ) : (
            <motion.span
              key="default"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              {children}
            </motion.span>
          )}
        </AnimatePresence>
      </span>

      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};