'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Set the moment the loader begins to fade out; shown once per session.
export const LOADER_SESSION_KEY = 'fitech_stanzza_loader';

// One odometer column: a reel of 0-9 plus a trailing 0 so a 9 -> 0 wrap
// rolls forward into the spare slot, then snaps back to the real 0 with
// the transition switched off — reels never spin backwards.
const SLOTS = 11;
function Reel({ value }: { value: number }) {
  const [idx, setIdx] = useState(value);
  const [snap, setSnap] = useState(false);
  const prev = useRef(value);

  useEffect(() => {
    if (value === prev.current) return;
    const wrapped = prev.current === 9 && value === 0;
    prev.current = value;
    setSnap(false);
    setIdx(wrapped ? 10 : value);
    if (!wrapped) return;
    const t = window.setTimeout(() => {
      setSnap(true);
      setIdx(0);
    }, 300);
    return () => window.clearTimeout(t);
  }, [value]);

  return (
    <div className="loader-col">
      <div
        className="loader-reel"
        style={{ transform: `translate3d(0, ${(-idx * 100) / SLOTS}%, 0)`, transition: snap ? 'none' : undefined }}
      >
        {Array.from({ length: SLOTS }, (_, n) => (
          <span key={n} className="loader-digit">{n % 10}</span>
        ))}
      </div>
    </div>
  );
}

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
    const duration = 1600; // 000 -> 100
    const holdAt100 = 550; // let "100" land and be read before the site opens

    let animationFrameId: number;
    let holdTimer = 0;

    const updateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      // Ease-out so the last digits slow down and settle on 100 rather
      // than blurring past it.
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 2.2);
      setProgress(Math.round(eased * 100));

      if (t < 1) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        holdTimer = window.setTimeout(() => {
          setIsDone(true);
          try {
            sessionStorage.setItem(LOADER_SESSION_KEY, 'true');
          } catch {
            // ignore
          }
          setTimeout(() => {
            setShouldRender(false);
          }, 600);
        }, holdAt100);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.clearTimeout(holdTimer);
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
            <Reel value={Math.floor(progress / 100)} />
            <Reel value={Math.floor(progress / 10) % 10} />
            <Reel value={progress % 10} />
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
