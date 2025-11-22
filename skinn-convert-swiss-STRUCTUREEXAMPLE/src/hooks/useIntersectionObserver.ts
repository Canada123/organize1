import { useEffect, useRef, useState } from 'react';

interface IntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useIntersectionObserver(
  options: IntersectionObserverOptions = {}
): [React.RefObject<HTMLDivElement>, boolean] {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const intersecting = entry.isIntersecting;
          
          if (intersecting && !hasIntersected) {
            setHasIntersected(true);
          }
          
          if (!triggerOnce || !hasIntersected) {
            setIsIntersecting(intersecting);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentTarget = targetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [threshold, rootMargin, triggerOnce, hasIntersected]);

  return [targetRef, triggerOnce ? hasIntersected : isIntersecting];
}