'use client';

import React, { useEffect, useState } from 'react';

type Frames = { fps: number; cols: number; rows: number; frames: string[] };

// Sized from the frame grid so the box holds its shape before the frames
// arrive (no layout shift), and the font scales with the container width.
const COLS = 228;
const ROWS = 65;
const CHAR_ASPECT = 0.6; // JetBrains Mono advance width / em

export default function AsciiDollar() {
  const [text, setText] = useState('');

  useEffect(() => {
    let raf = 0;
    let cancelled = false;
    fetch('/intro/bill-frames.json')
      .then((r) => r.json())
      .then((data: Frames) => {
        if (cancelled) return;
        const { fps, frames } = data;
        const start = performance.now();
        const tick = (now: number) => {
          const i = Math.min(frames.length - 1, Math.floor(((now - start) / 1000) * fps));
          setText(frames[i]);
          if (i < frames.length - 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className="ascii-dollar"
      role="img"
      aria-label="ASCII rendering of a one hundred dollar note"
      style={{ aspectRatio: `${COLS * CHAR_ASPECT} / ${ROWS}` }}
    >
      <pre className="ascii-dollar-base" aria-hidden="true">{text}</pre>
      <pre className="ascii-dollar-shine" aria-hidden="true">{text}</pre>
    </div>
  );
}
