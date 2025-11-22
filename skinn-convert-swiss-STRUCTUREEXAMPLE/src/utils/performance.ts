/**
 * Performance monitoring and optimization utilities
 */

interface PerformanceMetrics {
  LCP: number | null;
  FID: number | null;
  CLS: number | null;
  FCP: number | null;
  TTFB: number | null;
  totalPageWeight: number;
}

/**
 * Measure and report Web Vitals
 */
export const measureWebVitals = (callback: (metrics: PerformanceMetrics) => void) => {
  const metrics: PerformanceMetrics = {
    LCP: null,
    FID: null,
    CLS: null,
    FCP: null,
    TTFB: null,
    totalPageWeight: 0,
  };

  // Observe Largest Contentful Paint
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    metrics.LCP = lastEntry.startTime;
  });
  lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

  // Observe First Input Delay
  const fidObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const firstEntry = entries[0];
    if (firstEntry) {
      metrics.FID = (firstEntry as any).processingStart - firstEntry.startTime;
    }
  });
  fidObserver.observe({ entryTypes: ['first-input'] });

  // Observe Cumulative Layout Shift
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        clsValue += (entry as any).value;
      }
    }
    metrics.CLS = clsValue;
  });
  clsObserver.observe({ entryTypes: ['layout-shift'] });

  // Measure First Contentful Paint
  const paintObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    for (const entry of entries) {
      if (entry.name === 'first-contentful-paint') {
        metrics.FCP = entry.startTime;
      }
    }
  });
  paintObserver.observe({ entryTypes: ['paint'] });

  // Measure Time to First Byte
  const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navigationEntry) {
    metrics.TTFB = navigationEntry.responseStart - navigationEntry.requestStart;
  }

  // Calculate total page weight
  const calculatePageWeight = () => {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    let totalSize = 0;
    
    resources.forEach((resource) => {
      if (resource.transferSize) {
        totalSize += resource.transferSize;
      }
    });
    
    metrics.totalPageWeight = totalSize;
  };

  // Report metrics after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      calculatePageWeight();
      callback(metrics);
      
      // Clean up observers
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
      paintObserver.disconnect();
    }, 1000);
  });
};

/**
 * Preload critical resources
 */
export const preloadCriticalAssets = () => {
  const criticalImages = [
    '/assets/images/Father-daughter.png',
    '/assets/images/product/wear-skiin-man-band-insert-pod.png',
  ];

  criticalImages.forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

/**
 * Optimize animations based on user preferences
 */
export const optimizeAnimations = () => {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    document.documentElement.style.setProperty('--transition-fast', '0ms');
    document.documentElement.style.setProperty('--transition-base', '0ms');
    document.documentElement.style.setProperty('--transition-slow', '0ms');
  }
};

/**
 * Enable paint holding for smoother transitions
 */
export const enablePaintHolding = () => {
  if ('paintWorklet' in CSS) {
    // Add paint worklet for custom effects if supported
    // This is future-proofing for when paint worklets are widely supported
  }
};

/**
 * Resource hints for faster navigation
 */
export const addResourceHints = () => {
  // Preconnect to external domains
  const domains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ];

  domains.forEach((domain) => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

/**
 * Log performance metrics to console in development
 */
export const logPerformanceMetrics = (metrics: PerformanceMetrics) => {
  if (process.env.NODE_ENV === 'development') {
    console.group('⚡ Performance Metrics');
    console.log(`LCP: ${metrics.LCP?.toFixed(2)}ms ${metrics.LCP && metrics.LCP < 2500 ? '✅' : '⚠️'}`);
    console.log(`FID: ${metrics.FID?.toFixed(2)}ms ${metrics.FID && metrics.FID < 100 ? '✅' : '⚠️'}`);
    console.log(`CLS: ${metrics.CLS?.toFixed(3)} ${metrics.CLS && metrics.CLS < 0.1 ? '✅' : '⚠️'}`);
    console.log(`FCP: ${metrics.FCP?.toFixed(2)}ms`);
    console.log(`TTFB: ${metrics.TTFB?.toFixed(2)}ms`);
    console.log(`Total Page Weight: ${(metrics.totalPageWeight / 1024 / 1024).toFixed(2)}MB ${metrics.totalPageWeight < 2 * 1024 * 1024 ? '✅' : '⚠️'}`);
    console.groupEnd();
  }
};

/**
 * Initialize all performance optimizations
 */
export const initializePerformanceOptimizations = () => {
  // Add resource hints immediately
  addResourceHints();
  
  // Preload critical assets
  preloadCriticalAssets();
  
  // Optimize animations based on user preferences
  optimizeAnimations();
  
  // Enable paint holding
  enablePaintHolding();
  
  // Measure and log web vitals
  measureWebVitals(logPerformanceMetrics);
};