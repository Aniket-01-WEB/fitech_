'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Set the moment the loader begins to fade out; shown once per session.
export const LOADER_SESSION_KEY = 'fitech_stanzza_loader';

export default function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Check if preloader has already been shown in this session
    try {
      if (sessionStorage.getItem(LOADER_SESSION_KEY)) {
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
          sessionStorage.setItem(LOADER_SESSION_KEY, 'true');
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
          className="fixed inset-0 z-[99999] bg-[#FFFFFF] flex flex-col justify-between p-8 sm:p-14 select-none pointer-events-auto overflow-hidden"
        >
          {/* Top Archival Header */}
          <div className="relative z-10 flex items-center justify-between font-mono text-[11px] text-[#6B6B6B] uppercase tracking-wider border-b border-[#F2F2F2] pb-4">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-[#0A0A0A]"></span>
              <span className="font-bold text-[#0A0A0A]">FITECH RESEARCH GUILD</span>
              <span>{'//'}</span>
              <span>SOET CHAPTER</span>
            </div>
            <div>
              <span>SYS.INIT // 2026</span>
            </div>
          </div>

          {/* Giant three-column odometer: hundreds / tens / units, each digit
              rolling like a slot as the count runs 0 -> 100. */}
          <div className="loader-odometer flex-1 min-h-0 my-4" aria-label={`Loading ${progress}%`}>
            {[Math.floor(progress / 100), Math.floor(progress / 10) % 10, progress % 10].map((d, col) => (
              <div key={col} className="loader-col">
                <div className="loader-reel" style={{ transform: `translate3d(0, ${-d * 10}%, 0)` }}>
                  {Array.from({ length: 10 }, (_, n) => (
                    <span key={n} className="loader-digit">{n}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Telemetry Counter Strip */}
          <div className="relative z-10 border-t border-[#F2F2F2] pt-4 flex items-center justify-between font-mono text-xs text-[#4A4A4A]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse"></span>
              <span>CALIBRATING QUANTITATIVE MATRIX</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[#0A0A0A] font-bold tracking-widest">
                [{progress.toString().padStart(3, '0')}%]
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
