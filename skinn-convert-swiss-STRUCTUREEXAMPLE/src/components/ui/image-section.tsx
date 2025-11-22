import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface ImageSectionProps {
  src: string;
  alt: string;
  caption?: string;
  position?: 'left' | 'right' | 'center' | 'full';
  aspectRatio?: 'square' | '4:3' | '16:9' | 'auto';
  lazy?: boolean;
  className?: string;
  imageClassName?: string;
  captionClassName?: string;
  rounded?: boolean;
  shadow?: boolean;
}

export function ImageSection({
  src,
  alt,
  caption,
  position = 'center',
  aspectRatio = 'auto',
  lazy = true,
  className,
  imageClassName,
  captionClassName,
  rounded = true,
  shadow = true
}: ImageSectionProps) {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });
  const [imageLoaded, setImageLoaded] = useState(false);

  const aspectClasses = {
    'square': 'aspect-square',
    '4:3': 'aspect-[4/3]',
    '16:9': 'aspect-video',
    'auto': ''
  };

  const positionClasses = {
    'left': 'mr-auto',
    'right': 'ml-auto',
    'center': 'mx-auto',
    'full': 'w-full'
  };

  const containerClasses = cn(
    "transition-all duration-1000",
    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
    positionClasses[position],
    position !== 'full' && 'max-w-2xl',
    className
  );

  const imageWrapperClasses = cn(
    "overflow-hidden",
    rounded && "rounded-xl",
    shadow && "shadow-lg",
    aspectClasses[aspectRatio],
    "bg-background-secondary"
  );

  const imgClasses = cn(
    "w-full h-full object-cover transition-all duration-700",
    imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95",
    imageClassName
  );

  return (
    <div ref={ref} className={containerClasses}>
      <div className={imageWrapperClasses}>
        <img
          src={src}
          alt={alt}
          loading={lazy ? "lazy" : "eager"}
          onLoad={() => setImageLoaded(true)}
          className={imgClasses}
        />
      </div>
      {caption && (
        <p className={cn(
          "text-sm text-muted-foreground text-center mt-4 italic",
          captionClassName
        )}>
          {caption}
        </p>
      )}
    </div>
  );
}