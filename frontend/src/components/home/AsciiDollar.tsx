'use client';

import React, { useEffect, useRef, useState } from 'react';

type Dots = { cols: number; rows: number; text: string };

// Sized from the dot grid so the box holds its shape before the data
// arrives (no layout shift), and the font scales with the container width.
const COLS = 347;
const ROWS = 97;
const CHAR_ASPECT = 0.6; // JetBrains Mono advance width / em

// The note is drawn as vertical strips (STRIP_COLS columns each) so a
// phase-shifted CSS animation can bob each strip in Y — a wave travelling
// along X, like a flag — using transforms only, with no text re-layout.
const STRIPS = 26;
const STRIP_COLS = Math.ceil(COLS / STRIPS);
function strips(text: string): string[] {
  if (!text) return [];
  const lines = text.split('\n');
  const out: string[] = [];
  for (let s = 0; s < STRIPS; s++) {
    const from = s * STRIP_COLS;
    out.push(lines.map((l) => l.slice(from, from + STRIP_COLS)).join('\n'));
  }
  return out;
}

export default function AsciiDollar() {
  const [text, setText] = useState('');
  const stageRef = useRef<HTMLDivElement>(null);

  // Pause the wave when offscreen so scrolling elsewhere costs nothing.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => {
      el.classList.toggle('is-paused', !entry.isIntersecting);
    }, { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch('/intro/bill-dots.json')
      .then((r) => r.json())
      .then((data: Dots) => {
        if (cancelled) return;
        const rows = data.text.split('\n').map((l) => l.padEnd(COLS, ' '));
        while (rows.length < ROWS) rows.push(' '.repeat(COLS));
        setText(rows.join('\n'));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const stripList = React.useMemo(() => strips(text), [text]);

  return (
    <div className="ascii-stage" ref={stageRef}>
      <div
        className="ascii-dollar"
        role="img"
        aria-label="Dot-matrix rendering of a five hundred rupee note rippling like a flag"
        style={{ aspectRatio: `${COLS * CHAR_ASPECT} / ${ROWS}`, '--ascii-em-cols': COLS * CHAR_ASPECT } as React.CSSProperties}
      >
        <div className="ascii-dollar-base" aria-hidden="true">
          {stripList.map((strip, i) => (
            <pre
              key={i}
              className="ascii-strip"
              style={{ '--i': i, left: `${(i * 100) / STRIPS}%`, width: `${100 / STRIPS}%` } as React.CSSProperties}
            >
              {strip}
            </pre>
          ))}
        </div>
      </div>
    </div>
  );
}
