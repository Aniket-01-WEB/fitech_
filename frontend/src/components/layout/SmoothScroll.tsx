'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // A refresh always opens at the top of the page. Browsers otherwise
  // restore the previous scroll position (and jump to any #hash), which
  // would land a reloaded visitor mid-page behind the loader.
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    if (nav?.type === 'reload' && window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Skip Lenis on touch/mobile devices or when user prefers reduced motion
    // to preserve native hardware-accelerated 120Hz/60Hz scrolling
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 0,
      infinite: false,
    });

    window.__lenis = lenis;

    let animationFrameId: number;
    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    // Smooth anchor link scrolling
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && href.length > 1 && href !== '#') {
        const el = document.querySelector(href);
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el as HTMLElement, { offset: -70, duration: 0.9 });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  // Reset scroll on page transition
  useEffect(() => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return <>{children}</>;
}
