'use client';

import React, { useEffect, useState } from 'react';
import { LOADER_SESSION_KEY } from '@/components/layout/PageLoader';

type Dots = { cols: number; rows: number; text: string };

// Sized from the dot grid so the box holds its shape before the data
// arrives (no layout shift), and the font scales with the container width.
const COLS = 240;
const ROWS = 60;
const CHAR_ASPECT = 0.6; // JetBrains Mono advance width / em

const UNFOLD_MS = 4200;
const FACETS = 26;
const EDGE = '|/-\\';

// Deterministic noise so facet layout and crumple texture don't flicker.
function hash(a: number, b: number) {
  let h = (a * 73856093) ^ (b * 19349663);
  h = Math.imul(h ^ (h >>> 13), 0x5bd1e995);
  return ((h ^ (h >>> 15)) >>> 0) / 4294967296;
}

// Facets of the crumpled ball: each is a Voronoi cell in note space that
// shows a shifted fragment of the note, with a jagged silhouette radius.
// Coordinates are in "pixel" space (cols x CHAR_ASPECT, rows) so that
// distances and the ball are visually round.
const SEEDS = Array.from({ length: FACETS }, (_, k) => ({
  x: (hash(k, 1) - 0.5) * COLS * CHAR_ASPECT,
  y: (hash(k, 2) - 0.5) * ROWS,
  dx: (hash(k, 3) - 0.5) * 70, // fragment shift (px), scaled by crumple
  dy: (hash(k, 4) - 0.5) * 30,
  rim: 0.88 + hash(k, 5) * 0.22, // silhouette bump for this facet
}));

// Samples the flat note through a crumple field of strength `a` (1 -> 0):
// the note is squeezed into a rough ball, its surface broken into shifted
// facets with dark crease edges, tilted mid-way through, and everything
// relaxes to exactly the flat note at a = 0.
function crumple(rows: string[], a: number): string {
  if (a <= 0) return rows.join('\n');
  const cx = COLS / 2;
  const cy = ROWS / 2;
  const halfW = cx * CHAR_ASPECT; // px
  const halfH = cy;
  const ballR = halfH * 0.74;
  // Overall scale from ball to full sheet, per axis (px).
  const sxScale = ballR / halfW + (1 - ballR / halfW) * (1 - a);
  const syScale = ballR / halfH + (1 - ballR / halfH) * (1 - a);
  // Tilt peaks mid-unfold and is zero at both ends, like the tumble in
  // the reference clip.
  const tilt = a * (1 - a) * 1.1;
  const cosT = Math.cos(tilt);
  const sinT = Math.sin(tilt);
  const edgeW = 0.55 * a;

  const out: string[] = [];
  for (let r = 0; r < ROWS; r++) {
    let line = '';
    for (let c = 0; c < COLS; c++) {
      // Output cell -> px, undo tilt, undo scale -> note-space px.
      const px = (c - cx) * CHAR_ASPECT;
      const py = r - cy;
      const ux = px * cosT + py * sinT;
      const uy = -px * sinT + py * cosT;
      const nx = ux / sxScale;
      const ny = uy / syScale;

      // Silhouette: blend a jagged circle (ball) with the note rectangle.
      let best = 0, second = 1, d1 = Infinity, d2 = Infinity;
      for (let k = 0; k < FACETS; k++) {
        const s = SEEDS[k];
        const d = (nx - s.x) * (nx - s.x) + (ny - s.y) * (ny - s.y);
        if (d < d1) { d2 = d1; second = best; d1 = d; best = k; } else if (d < d2) { d2 = d; second = k; }
      }
      const seed = SEEDS[best];
      const rectD = Math.max(Math.abs(nx) / halfW, Math.abs(ny) / halfH);
      const circD = Math.hypot(ux, uy) / (ballR * seed.rim);
      const inside = a * circD + (1 - a) * rectD < 1;
      if (!inside) { line += ' '; continue; }

      // Facet shows a shifted fragment of the note.
      const fx = nx + a * seed.dx;
      const fy = ny + a * seed.dy;
      const cc = Math.round(fx / CHAR_ASPECT + cx);
      const rr = Math.round(fy + cy);
      let ch = ' ';
      if (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS) ch = rows[rr][cc] ?? ' ';

      // Crease where two facets meet, oriented along the boundary.
      const gap = Math.sqrt(d2) - Math.sqrt(d1);
      if (gap < edgeW) {
        const o = SEEDS[second];
        const ang = Math.atan2(seed.y - o.y, seed.x - o.x) + Math.PI / 2;
        const q = Math.round(((ang % Math.PI) + Math.PI) % Math.PI / (Math.PI / 4)) % 4;
        ch = EDGE[[1, 0, 3, 2][q]];
      } else if (a > 0.15 && hash(r, c) < a * a * 0.03) {
        ch = EDGE[Math.floor(hash(c, r) * EDGE.length)];
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
          // Slow start (the ball loosening), fast middle (the note
          // springing open), gentle settle to perfectly flat.
          const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          const a = Math.max(0, 1 - eased);
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
