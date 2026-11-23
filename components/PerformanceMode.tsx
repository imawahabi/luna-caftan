'use client';

import { MotionConfig } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';

const COMPACT_BREAKPOINT = 1024;

interface PerformanceModeProps {
  children: ReactNode;
}

function isCompactViewport() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= COMPACT_BREAKPOINT;
}

export default function PerformanceMode({ children }: PerformanceModeProps) {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const syncViewportMode = () => {
      setIsCompact(isCompactViewport());
    };

    syncViewportMode();
    window.addEventListener('resize', syncViewportMode, { passive: true });
    return () => window.removeEventListener('resize', syncViewportMode);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.classList.toggle('perf-lite', isCompact);
    body.classList.toggle('perf-lite', isCompact);

    return () => {
      root.classList.remove('perf-lite');
      body.classList.remove('perf-lite');
    };
  }, [isCompact]);

  return (
    <MotionConfig reducedMotion={isCompact ? 'always' : 'user'}>
      {children}
    </MotionConfig>
  );
}
