'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { isLoaderDone } from '@/components/layout/PageLoader';

type Dots = { cols: number; rows: number; text: string };

// Sized from the dot grid so the box holds its shape before the data
// arrives (no layout shift), and the font scales with the container width.
const COLS = 520;
const ROWS = 144;
const CHAR_ASPECT = 0.6; // JetBrains Mono advance width / em

const UNFOLD_MS = 1800;
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

// Nearest-facet lookup precomputed once over note space at grid
// resolution, so each animation frame only does transforms and table
// reads instead of a 26-seed search per cell. Stores the facet, the
// crease glyph for the boundary with the runner-up facet, and the
// distance gap to that boundary.
const FACET = new Uint8Array(COLS * ROWS);
const GAP = new Float32Array(COLS * ROWS);
const CREASE = new Uint8Array(COLS * ROWS);
{
  const cx = COLS / 2, cy = ROWS / 2;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const nx = (c - cx) * CHAR_ASPECT, ny = r - cy;
      let best = 0, second = 1, d1 = Infinity, d2 = Infinity;
      for (let k = 0; k < FACETS; k++) {
        const s = SEEDS[k];
        const d = (nx - s.x) * (nx - s.x) + (ny - s.y) * (ny - s.y);
        if (d < d1) { d2 = d1; second = best; d1 = d; best = k; } else if (d < d2) { d2 = d; second = k; }
      }
      const i = r * COLS + c;
      FACET[i] = best;
      GAP[i] = Math.sqrt(d2) - Math.sqrt(d1);
      const o = SEEDS[second], sd = SEEDS[best];
      const ang = Math.atan2(sd.y - o.y, sd.x - o.x) + Math.PI / 2;
      const q = Math.round(((ang % Math.PI) + Math.PI) % Math.PI / (Math.PI / 4)) % 4;
      CREASE[i] = [1, 0, 3, 2][q];
    }
  }
}

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
  const sprinkle = a > 0.15 ? a * a * 0.03 : 0;

  const dx_ux = CHAR_ASPECT * cosT;
  const dx_uy = -CHAR_ASPECT * sinT;
  const dx_nx = dx_ux / sxScale;
  const dx_ny = dx_uy / syScale;

  const out: string[] = [];
  const buf: string[] = new Array(COLS);
  for (let r = 0; r < ROWS; r++) {
    const py = r - cy;
    let last = -1;
    let ux = -cx * CHAR_ASPECT * cosT + py * sinT;
    let uy = cx * CHAR_ASPECT * sinT + py * cosT;
    let nx = ux / sxScale;
    let ny = uy / syScale;

    for (let c = 0; c < COLS; c++) {
      // Cheap reject: outside the ball's widest possible rim is blank.
      const ax = nx < 0 ? -nx : nx, ay = ny < 0 ? -ny : ny;
      const rectD = ax / halfW > ay / halfH ? ax / halfW : ay / halfH;
      const radial = Math.sqrt(ux * ux + uy * uy) / ballR;
      if (a * radial / 1.1 + (1 - a) * rectD >= 1) {
        buf[c] = ' ';
        ux += dx_ux; uy += dx_uy; nx += dx_nx; ny += dx_ny;
        continue;
      }

      // Facet lookup (clamped to the table).
      let tc = Math.round(nx / CHAR_ASPECT + cx), tr = Math.round(ny + cy);
      if (tc < 0) tc = 0; else if (tc >= COLS) tc = COLS - 1;
      if (tr < 0) tr = 0; else if (tr >= ROWS) tr = ROWS - 1;
      const ti = tr * COLS + tc;
      const seed = SEEDS[FACET[ti]];

      // Silhouette: blend a jagged circle (ball) with the note rectangle.
      if (a * (radial / seed.rim) + (1 - a) * rectD >= 1) {
        buf[c] = ' ';
        ux += dx_ux; uy += dx_uy; nx += dx_nx; ny += dx_ny;
        continue;
      }

      // Facet shows a shifted fragment of the note.
      const cc = Math.round((nx + a * seed.dx) / CHAR_ASPECT + cx);
      const rr = Math.round(ny + a * seed.dy + cy);
      let ch = ' ';
      if (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS) ch = rows[rr][cc] ?? ' ';

      // Crease where two facets meet, oriented along the boundary.
      if (GAP[ti] < edgeW) {
        ch = EDGE[CREASE[ti]];
      } else if (sprinkle > 0 && hash(r, c) < sprinkle) {
        ch = EDGE[Math.floor(hash(c, r) * EDGE.length)];
      }
      buf[c] = ch;
      if (ch !== ' ') last = c;

      ux += dx_ux; uy += dx_uy; nx += dx_nx; ny += dx_ny;
    }
    out.push(last < 0 ? '' : buf.slice(0, last + 1).join(''));
  }
  return out.join('\n');
}

// The note is drawn as vertical strips (STRIP_COLS columns each) so a
// phase-shifted CSS animation can bob each strip in Y — a wave travelling
// along X, like a flag — using transforms only, with no text re-layout.
const STRIP_COLS = 20;
const STRIPS = Math.ceil(COLS / STRIP_COLS);
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
  const stageRef = useRef<HTMLDivElement>(null);
  // The strips are filled by writing textContent directly: pushing 26 large
  // strings through React state every frame meant a reconcile + commit per
  // frame on top of the text layout, which is what made the unfold hitch.
  const stripRefs = useRef<(HTMLPreElement | null)[]>([]);
  const paint = useCallback((text: string) => {
    const parts = strips(text);
    for (let i = 0; i < STRIPS; i++) {
      const el = stripRefs.current[i];
      if (el) el.textContent = parts[i] ?? '';
    }
  }, []);

  // Pause animations when offscreen to preserve 100% GPU/CPU headroom during scrolling
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.remove('is-paused');
      } else {
        el.classList.add('is-paused');
      }
    }, { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;
    let cancelled = false;
    fetch('/intro/bill-dots.json')
      .then((r) => r.json())
      .then((data: Dots) => {
        if (cancelled) return;
        const rows = data.text.split('\n').map((l) => l.padEnd(COLS, ' '));
        while (rows.length < ROWS) rows.push(' '.repeat(COLS));
        paint(crumple(rows, 1));
        const loaderGone = isLoaderDone;
        let start = 0;
        const tick = (now: number) => {
          if (cancelled) return;
          if (stageRef.current?.classList.contains('is-paused')) {
            raf = requestAnimationFrame(tick);
            return;
          }
          if (!start) {
            if (!loaderGone()) {
              raf = requestAnimationFrame(tick);
              return;
            }
            start = now + 150;
          }
          if (now < start) {
            raf = requestAnimationFrame(tick);
            return;
          }
          // One crumple sample per display frame; the eased timeline is
          // wall-clock based, so a slow frame skips ahead rather than
          // stretching the animation.
          const t = Math.min(1, (now - start) / UNFOLD_MS);
          const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          const a = Math.max(0, 1 - eased);
          paint(crumple(rows, t >= 1 ? 0 : a));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [paint]);

  // Mouse-follow tilt. Written straight to CSS variables (no React state)
  // so it never re-renders the text and can't interfere with the unfold.
  const onMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--tilt-y', `${(x * 10).toFixed(2)}deg`);
    el.style.setProperty('--tilt-x', `${(-y * 7).toFixed(2)}deg`);
  }, []);
  const onLeave = useCallback(() => {
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty('--tilt-y', '0deg');
    el.style.setProperty('--tilt-x', '0deg');
  }, []);

  return (
    <div className="ascii-stage" ref={stageRef} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div
        className="ascii-dollar"
        role="img"
        aria-label="Dot-matrix ASCII rendering of a five hundred rupee note being smoothed flat"
        style={{ aspectRatio: `${COLS * CHAR_ASPECT} / ${ROWS}` }}
      >
        <div className="ascii-dollar-tilt">
          <div className="ascii-dollar-base" aria-hidden="true">
            {Array.from({ length: STRIPS }, (_, i) => (
              <pre
                key={i}
                ref={(el) => { stripRefs.current[i] = el; }}
                className="ascii-strip"
                style={{ '--i': i, left: `${(i * 100) / STRIPS}%`, width: `${100 / STRIPS}%` } as React.CSSProperties}
              />
            ))}
          </div>
          <div className="ascii-dollar-shine" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
