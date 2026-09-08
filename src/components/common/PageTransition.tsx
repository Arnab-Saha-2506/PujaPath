import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { SankhaLoader } from './SankhaLoader';

export const PageTransition: React.FC = () => {
  const location = useLocation();
  const isFirstRender = useRef(true);
  const [isActive, setIsActive] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const timerRef = useRef<number | null>(null);
  const fadeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // Skip initial page load so user isn't delayed on direct entry
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Clear any existing transition timers
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);

    // Reset window scroll position to top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Start transition
    setIsActive(true);
    setIsFading(false);

    // Keep active for 450ms, then begin smooth fade-out
    timerRef.current = window.setTimeout(() => {
      setIsFading(true);
      // Wait for 280ms fade-out transition to complete
      fadeTimerRef.current = window.setTimeout(() => {
        setIsActive(false);
        setIsFading(false);
      }, 280);
    }, 450);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
    };
  }, [location.pathname, location.search]);

  if (!isActive) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-ivory/90 dark:bg-[#090305]/95 backdrop-blur-md transition-opacity duration-300 ease-out ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
        }`}
      style={{ willChange: 'opacity' }}
    >
      <SankhaLoader
        variant="inline"
        size="md"
        text="শারদোৎসব ২০২৬ • আগমনী বার্তা"
        subtext="নতুন পুজোযাত্রার পথ সাজছে..."
      />
    </div>
  );
};
