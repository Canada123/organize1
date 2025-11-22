import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface FullScreenVideoProps {
  src: string;
  thumbnail?: string;
  title: string;
  className?: string;
}

/**
 * FullScreenVideo Component
 * A modern full-screen video component with lazy loading and smooth transitions
 * Inspired by Apple's product pages and high-end health tech sites
 */
const FullScreenVideo: React.FC<FullScreenVideoProps> = ({
  src,
  thumbnail,
  title,
  className
}) => {
  const [isInView, setIsInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Set up Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting && videoRef.current) {
          // Start loading the video when in view
          setIsLoading(true);
          videoRef.current.load();
        }
      },
      {
        threshold: 0.3, // Trigger when 30% of the video is visible
        rootMargin: '100px' // Start loading 100px before the video comes into view
      }
    );

    const containerElement = containerRef.current;
    if (containerElement) {
      observer.observe(containerElement);
    }

    return () => {
      if (containerElement) {
        observer.unobserve(containerElement);
      }
    };
  }, []);

  // Auto-play when video comes into view
  useEffect(() => {
    if (isInView && videoRef.current && !isPlaying && !isLoading) {
      // Only autoplay if video is muted (browser requirement)
      if (videoRef.current.muted) {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Handle autoplay policy restrictions
  // Console statement removed by ESLint fix
          setShowControls(true);
        });
      }
    } else if (!isInView && videoRef.current && isPlaying) {
      // Pause when out of view
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isInView, isPlaying, isLoading]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      setHasUserInteracted(true);
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Hide controls after 3 seconds of inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const hideControls = () => {
      timeout = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };

    const showControlsHandler = () => {
      setShowControls(true);
      clearTimeout(timeout);
      hideControls();
    };

    const containerElement = containerRef.current;
    if (containerElement) {
      containerElement.addEventListener('mousemove', showControlsHandler);
      containerElement.addEventListener('touchstart', showControlsHandler);
    }

    hideControls();

    return () => {
      clearTimeout(timeout);
      if (containerElement) {
        containerElement.removeEventListener('mousemove', showControlsHandler);
        containerElement.removeEventListener('touchstart', showControlsHandler);
      }
    };
  }, [isPlaying]);

  return (
    <section 
      ref={containerRef}
      className={cn(
        "relative w-full h-screen overflow-hidden bg-black",
        className
      )}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        poster={thumbnail}
        muted={isMuted}
        loop
        playsInline
        preload="metadata"
        autoPlay={false}
        onLoadedData={() => {
          setIsLoading(false);
          setLoadingProgress(100);
        }}
        onProgress={(e) => {
          const video = e.currentTarget;
          if (video.buffered.length > 0) {
            const loaded = video.buffered.end(video.buffered.length - 1);
            const total = video.duration;
            setLoadingProgress((loaded / total) * 100);
          }
        }}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none" />

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-12 h-12 text-white mb-4" />
            </motion.div>
            <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white/60 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-white/60 text-sm mt-2">Loading video...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title Overlay */}
      <motion.div 
        className={cn(
          "absolute inset-0 flex items-center justify-center",
          isPlaying && !showControls ? "opacity-0" : "opacity-100"
        )}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: isPlaying && !showControls ? 0 : 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <motion.h2 
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white px-6 drop-shadow-2xl mb-8"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {title}
          </motion.h2>
          {!isPlaying && !isLoading && (
            <motion.button
              onClick={togglePlayPause}
              className="mx-auto flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all duration-300 group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              <span className="text-white font-medium">Play Video</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Video Controls */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 p-8 flex items-center justify-between transition-all duration-300",
          showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
        )}
      >
        <div className="flex items-center gap-4">
          {/* Play/Pause Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlayPause}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" />
            )}
          </Button>

          {/* Mute/Unmute Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white"
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6" />
            ) : (
              <Volume2 className="w-6 h-6" />
            )}
          </Button>
        </div>

        {/* Video Progress Indicator */}
        <div className="flex-1 max-w-md mx-8">
          <div className="h-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-md">
            <div 
              className="h-full bg-white transition-all duration-300"
              style={{ 
                width: videoRef.current ? 
                  `${(videoRef.current.currentTime / videoRef.current.duration) * 100}%` : 
                  '0%' 
              }}
            />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        className={cn(
          "absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-500",
          isPlaying ? "opacity-0" : "opacity-100"
        )}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-1">
          <div className="w-1 h-3 bg-white/50 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default FullScreenVideo;