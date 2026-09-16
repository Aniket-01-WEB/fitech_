'use client';

import React, { useEffect, useState } from 'react';

type Dots = { cols: number; rows: number; text: string };

// Sized from the dot grid so the box holds its shape before the data
// arrives (no layout shift), and the font scales with the container width.
const COLS = 240;
const ROWS = 61;
const CHAR_ASPECT = 0.6; // JetBrains Mono advance width / em
const DECODE_MS = 1800;
const GLYPHS = '$#%&@*+=-:.0123456789';

export default function AsciiDollar() {
  const [text, setText] = useState('');

  useEffect(() => {
    let raf = 0;
    let cancelled = false;
    fetch('/intro/bill-dots.json')
      .then((r) => r.json())
      .then((data: Dots) => {
        if (cancelled) return;
        const target = data.text;
        // Each character locks in at its own random moment so the note
        // "resolves" out of glyph noise rather than typing in left-to-right.
        const lockAt = Array.from(target, (ch) =>
          ch === '\n' || ch === ' ' ? 0 : Math.random() * DECODE_MS,
        );
        const start = performance.now();
        const tick = (now: number) => {
          const t = now - start;
          let out = '';
          let done = true;
          for (let i = 0; i < target.length; i++) {
            if (t >= lockAt[i]) {
              out += target[i];
            } else {
              done = false;
              out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
            }
          }
          setText(out);
          if (!done) raf = requestAnimationFrame(tick);
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
      aria-label="Dot-matrix ASCII rendering of a one hundred dollar note"
      style={{ aspectRatio: `${COLS * CHAR_ASPECT} / ${ROWS}` }}
    >
      <pre className="ascii-dollar-base" aria-hidden="true">{text}</pre>
      <pre className="ascii-dollar-shine" aria-hidden="true">{text}</pre>
    </div>
  );
}
