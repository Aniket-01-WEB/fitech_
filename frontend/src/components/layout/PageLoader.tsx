'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Check if preloader has already been shown in this session
    try {
      if (sessionStorage.getItem('fitech_stanzza_loader')) {
        setShouldRender(false);
        return;
      }
    } catch {
      // ignore
    }

    const startTime = performance.now();
    const duration = 1200;

    let animationFrameId: number;

    const updateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        setIsDone(true);
        try {
          sessionStorage.setItem('fitech_stanzza_loader', 'true');
        } catch {
          // ignore
        }
        setTimeout(() => {
          setShouldRender(false);
        }, 600);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[99999] bg-[#FFFFFF] flex flex-col justify-between p-8 sm:p-14 select-none pointer-events-auto"
        >
          {/* Top Archival Header */}
          <div className="flex items-center justify-between font-mono text-[11px] text-[#707070] uppercase tracking-wider border-b border-[#ECECE8] pb-4">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-[#111111]"></span>
              <span className="font-bold text-[#111111]">FITECH RESEARCH GUILD</span>
              <span>{'//'}</span>
              <span>SOET CHAPTER</span>
            </div>
            <div>
              <span>SYS.INIT // 2026</span>
            </div>
          </div>

          {/* Center Stanzza Aperture & Typography */}
          <div className="flex flex-col items-center justify-center text-center my-auto">
            {/* Minimal Aperture Frame */}
            <motion.div
              initial={{ scaleX: 0.2, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-48 sm:w-64 h-[1px] bg-[#111111] mb-8"
            >
              <span className="absolute -top-1.5 -left-1 text-[9px] font-mono text-[#111111]">┌</span>
              <span className="absolute -top-1.5 -right-1 text-[9px] font-mono text-[#111111]">┐</span>
            </motion.div>

            {/* Huge Clean Monogram */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading font-black text-5xl sm:text-7xl lg:text-8xl text-[#111111] tracking-[-0.04em] uppercase leading-none"
            >
              FITECH
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="font-mono text-xs sm:text-sm text-[#707070] uppercase tracking-widest mt-4"
            >
              Technology × Finance × Engineering
            </motion.p>
          </div>

          {/* Bottom Telemetry Counter Strip */}
          <div className="border-t border-[#ECECE8] pt-4 flex items-center justify-between font-mono text-xs text-[#555555]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse"></span>
              <span>CALIBRATING QUANTITATIVE MATRIX</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[#111111] font-bold tracking-widest">
                [{progress.toString().padStart(3, '0')}%]
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
