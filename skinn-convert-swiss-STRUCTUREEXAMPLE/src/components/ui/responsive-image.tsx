import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  onLoad?: () => void;
  aspectRatio?: string; // e.g., "16/9", "4/3", "1/1"
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  fallbackSrc?: string;
}

/**
 * ResponsiveImage component with WebP support, lazy loading, and responsive sizing
 * Automatically generates srcset for different viewport sizes
 */
export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  sizes = '100vw',
  className = '',
  loading = 'lazy',
  priority = false,
  onLoad,
  aspectRatio,
  objectFit = 'cover',
  objectPosition = 'center',
  fallbackSrc,
}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate optimized image paths
  const getOptimizedPath = (originalSrc: string, size: number, format: 'webp' | 'original') => {
    const pathParts = originalSrc.split('/');
    const filename = pathParts.pop() || '';
    const nameParts = filename.split('.');
    const ext = nameParts.pop();
    const name = nameParts.join('.');
    
    // Check if image is already in optimized folder
    if (originalSrc.includes('/optimized/')) {
      return originalSrc;
    }
    
    // Find the position of 'images' in the path
    const imagesIndex = pathParts.findIndex(part => part === 'images');
    if (imagesIndex !== -1) {
      // Insert 'optimized' after 'images'
      pathParts.splice(imagesIndex + 1, 0, 'optimized');
    } else {
      // Fallback: add optimized to the end
      pathParts.push('optimized');
    }
    
    // Generate new filename
    const newExt = format === 'webp' ? 'webp' : ext;
    const newFilename = `${name}-${size}w.${newExt}`;
    
    return [...pathParts, newFilename].join('/');
  };

  // Generate srcset for responsive images
  const generateSrcSet = (format: 'webp' | 'original') => {
    const sizes = [375, 768, 1024, 1440, 1920];
    return sizes
      .map(size => `${getOptimizedPath(src, size, format)} ${size}w`)
      .join(', ');
  };

  // Use Intersection Observer for truly lazy loading
  useEffect(() => {
    if (!containerRef.current || priority || loading === 'eager') {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { 
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.01 
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [priority, loading]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    // Try fallback source if available
    if (fallbackSrc && imgRef.current) {
      imgRef.current.src = fallbackSrc;
    }
  };

  // Container styles for aspect ratio
  const containerStyles = aspectRatio
    ? { aspectRatio, position: 'relative' as const, overflow: 'hidden' }
    : {};

  // Show placeholder while loading
  const showPlaceholder = !isLoaded && loading === 'lazy';

  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
      style={containerStyles}
    >
      {/* Placeholder/skeleton while loading */}
      {showPlaceholder && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}

      {/* Render image only when intersecting or priority */}
      {(isIntersecting || priority) && (
        <picture>
          {/* WebP sources */}
          <source
            type="image/webp"
            srcSet={generateSrcSet('webp')}
            sizes={sizes}
          />
          
          {/* Original format sources */}
          <source
            srcSet={generateSrcSet('original')}
            sizes={sizes}
          />
          
          {/* Fallback img tag - use optimized full size */}
          <img
            ref={imgRef}
            src={getOptimizedPath(src, 0, 'original').replace('-0w', '-full')}
            alt={alt}
            loading={priority ? 'eager' : loading}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              'transition-opacity duration-300',
              {
                'opacity-0': showPlaceholder,
                'opacity-100': isLoaded || !showPlaceholder,
                'w-full h-full': aspectRatio,
              },
              className
            )}
            style={{
              objectFit,
              objectPosition,
            }}
          />
        </picture>
      )}
    </div>
  );
};

// Hero-specific responsive image with performance optimizations
export const HeroImage: React.FC<Omit<ResponsiveImageProps, 'priority' | 'loading'>> = (props) => {
  return (
    <ResponsiveImage
      {...props}
      priority={true}
      loading="eager"
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  );
};