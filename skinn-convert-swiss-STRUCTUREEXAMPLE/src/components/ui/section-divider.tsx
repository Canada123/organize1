import React from 'react';
import { cn } from '@/lib/utils';

export type DividerVariant = 'wave' | 'angle' | 'gradient' | 'geometric' | 'dots' | 'curve';

interface SectionDividerProps {
  variant?: DividerVariant;
  className?: string;
  color?: string;
  flipY?: boolean;
  flipX?: boolean;
}

/**
 * Section Divider Component
 * Creates visual separation between sections with various patterns
 */
export function SectionDivider({ 
  variant = 'wave', 
  className,
  color = 'currentColor',
  flipY = false,
  flipX = false
}: SectionDividerProps) {
  const transforms = [];
  if (flipY) transforms.push('scaleY(-1)');
  if (flipX) transforms.push('scaleX(-1)');
  const transformStyle = transforms.length > 0 ? { transform: transforms.join(' ') } : {};

  const dividers = {
    wave: (
      <svg 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
        className={cn("w-full", className)}
        style={transformStyle}
      >
        <path 
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          fill={color}
          fillOpacity="0.3"
        />
        <path 
          d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-58.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
          fill={color}
        />
      </svg>
    ),
    angle: (
      <svg 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
        className={cn("w-full", className)}
        style={transformStyle}
      >
        <polygon 
          points="1200,0 0,120 0,0"
          fill={color}
        />
      </svg>
    ),
    gradient: (
      <div 
        className={cn("w-full h-32", className)}
        style={{
          background: `linear-gradient(to bottom, ${color}00 0%, ${color}20 50%, ${color}00 100%)`,
          ...transformStyle
        }}
      />
    ),
    geometric: (
      <svg 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
        className={cn("w-full", className)}
        style={transformStyle}
      >
        <g>
          <polygon 
            points="1200,0 600,120 0,0"
            fill={color}
            fillOpacity="0.1"
          />
          <polygon 
            points="1200,40 600,120 0,40"
            fill={color}
            fillOpacity="0.2"
          />
          <polygon 
            points="1200,80 600,120 0,80"
            fill={color}
            fillOpacity="0.3"
          />
        </g>
      </svg>
    ),
    dots: (
      <div 
        className={cn("w-full h-24 relative overflow-hidden", className)}
        style={transformStyle}
      >
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px',
            opacity: 0.2
          }}
        />
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, transparent 0%, white 100%)`
          }}
        />
      </div>
    ),
    curve: (
      <svg 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
        className={cn("w-full", className)}
        style={transformStyle}
      >
        <path 
          d="M0,0 Q600,120 1200,0 L1200,120 L0,120 Z"
          fill={color}
          fillOpacity="0.1"
        />
        <path 
          d="M0,40 Q600,120 1200,40 L1200,120 L0,120 Z"
          fill={color}
          fillOpacity="0.15"
        />
        <path 
          d="M0,80 Q600,120 1200,80 L1200,120 L0,120 Z"
          fill={color}
          fillOpacity="0.2"
        />
      </svg>
    )
  };

  return (
    <div 
      className={cn("relative w-full pointer-events-none select-none", className)}
      aria-hidden="true"
    >
      {dividers[variant]}
    </div>
  );
}

/**
 * Preset divider configurations for common use cases
 */
export const SectionDividerPresets = {
  topWave: { variant: 'wave' as DividerVariant, className: '-mb-px' },
  bottomWave: { variant: 'wave' as DividerVariant, className: '-mt-px', flipY: true },
  topAngle: { variant: 'angle' as DividerVariant, className: '-mb-px' },
  bottomAngle: { variant: 'angle' as DividerVariant, className: '-mt-px', flipY: true },
  subtleGradient: { variant: 'gradient' as DividerVariant, className: 'h-16 -my-8' },
  geometric: { variant: 'geometric' as DividerVariant, className: 'h-20' },
  dots: { variant: 'dots' as DividerVariant, className: 'h-16' },
  topCurve: { variant: 'curve' as DividerVariant, className: '-mb-px' },
  bottomCurve: { variant: 'curve' as DividerVariant, className: '-mt-px', flipY: true }
};