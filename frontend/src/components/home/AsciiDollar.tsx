'use client';

import React, { useEffect, useState } from 'react';
import { LOADER_SESSION_KEY } from '@/components/layout/PageLoader';

type Dots = { cols: number; rows: number; text: string };

// Sized from the dot grid so the box holds its shape before the data
// arrives (no layout shift), and the font scales with the container width.
const COLS = 240;
const ROWS = 61;
const CHAR_ASPECT = 0.6; // JetBrains Mono advance width / em

const UNFOLD_MS = 2800;
const PANELS = 7; // accordion folds across the note
const CREASE = '|/\\';
const CRUMPLE = '/\\<>^v~';

// Deterministic per-cell noise so crumple texture doesn't flicker frame to frame.
function hash(r: number, c: number) {
  let h = (r * 73856093) ^ (c * 19349663);
  h = Math.imul(h ^ (h >>> 13), 0x5bd1e995);
  return ((h ^ (h >>> 15)) >>> 0) / 4294967296;
}

// Samples the flat note through a displacement field whose strength `a`
// runs 1 -> 0: accordion panels alternately squeezed and stretched, a
// wrinkle wobble on both axes, dark crease lines at panel edges and stray
// crumple glyphs. At a = 0 the output is exactly the flat note.
function crumple(rows: string[], a: number): string {
  if (a <= 0) return rows.join('\n');
  const cx = COLS / 2;
  const cy = ROWS / 2;
  const widthScale = 1 - 0.42 * a; // folded note is narrower
  const panelW = COLS / PANELS;
  const out: string[] = [];
  for (let r = 0; r < ROWS; r++) {
    let line = '';
    for (let c = 0; c < COLS; c++) {
      // Accordion: triangle wave over panels squeezes one side of each fold
      // and stretches the other.
      const u = (c / panelW) % 1;
      const tri = u < 0.5 ? u * 2 : 2 - u * 2;
      const accordion = (tri - 0.5) * panelW * 0.9;
      const wrinkleX = 5 * Math.sin(r * 0.23 + c * 0.05) + 2.5 * Math.sin(r * 0.61 - c * 0.13);
      const wrinkleY = 2.6 * Math.sin(c * 0.11 + 0.8) + 1.4 * Math.sin(c * 0.29 + r * 0.17);

      const sx = cx + (c - cx) / widthScale + a * (accordion + wrinkleX);
      const sy = cy + (r - cy) + a * wrinkleY;

      const rr = Math.round(sy);
      const cc = Math.round(sx);
      let ch = ' ';
      if (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS) ch = rows[rr][cc] ?? ' ';

      // Only draw folds/crumple where the note actually is.
      const inside = Math.abs(sx - cx) < cx && Math.abs(sy - cy) < cy;
      if (inside) {
        const n = hash(r, c);
        const edge = Math.min(u, 1 - u) * panelW; // distance to nearest panel edge
        if (edge < 0.6 && n < a * 1.2) {
          ch = CREASE[(r + Math.floor(c / panelW)) % CREASE.length];
        } else if (n < a * a * 0.16) {
          ch = CRUMPLE[Math.floor(hash(c, r) * CRUMPLE.length)];
        }
      }
      line += ch;
    }
    out.push(line.replace(/\s+$/, ''));
  }
  return out.join('\n');
}

export default function AsciiDollar() {
  const [text, setText] = useState('');

  useEffect(() => {
    let raf = 0;
    let cancelled = false;
    fetch('/intro/bill-dots.json')
      .then((r) => r.json())
      .then((data: Dots) => {
        if (cancelled) return;
        const rows = data.text.split('\n').map((l) => l.padEnd(COLS, ' '));
        while (rows.length < ROWS) rows.push(' '.repeat(COLS));
        // Show the note fully crumpled straight away, but don't start
        // smoothing it out until the page loader has begun to lift —
        // otherwise the whole unfold plays hidden behind it.
        setText(crumple(rows, 1));
        const loaderGone = () => {
          try {
            return !!sessionStorage.getItem(LOADER_SESSION_KEY);
          } catch {
            return true;
          }
        };
        let start = 0;
        const tick = (now: number) => {
          if (!start) {
            if (!loaderGone()) {
              raf = requestAnimationFrame(tick);
              return;
            }
            start = now + 250; // let the fade get going first
          }
          if (now < start) {
            raf = requestAnimationFrame(tick);
            return;
          }
          const t = Math.min(1, (now - start) / UNFOLD_MS);
          // Ease-out with a small tremor early on, like fingers working
          // the creases out, settling to perfectly flat.
          const eased = 1 - Math.pow(1 - t, 3);
          const tremor = (1 - t) * 0.08 * Math.sin(t * 40);
          const a = Math.max(0, 1 - eased + tremor);
          setText(crumple(rows, t >= 1 ? 0 : a));
          if (t < 1) raf = requestAnimationFrame(tick);
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
      aria-label="Dot-matrix ASCII rendering of a one hundred dollar note being smoothed flat"
      style={{ aspectRatio: `${COLS * CHAR_ASPECT} / ${ROWS}` }}
    >
      <pre className="ascii-dollar-base" aria-hidden="true">{text}</pre>
      <pre className="ascii-dollar-shine" aria-hidden="true">{text}</pre>
    </div>
  );
}
