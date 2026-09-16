import React from 'react';

// Scattered pixel-square halo behind the hero. Squares are placed on a grid
// with a probability that falls off from a few soft centres, so the field
// reads as a loose cloud rather than a regular pattern. Seeded so the
// server and client render the identical set (no hydration mismatch).
const COLS = 240;
const ROWS = 120;
const CELL = 6;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BLOBS: [number, number, number, number, number][] = [
  // [cx, cy, rx, ry, strength] in grid units
  [120, 52, 78, 46, 1.0],
  [42, 84, 30, 22, 0.55],
  [206, 88, 34, 22, 0.6],
  [178, 22, 26, 14, 0.45],
];

function buildRects() {
  const rand = mulberry32(20260917);
  const rects: { x: number; y: number; o: number }[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let p = 0;
      for (const [cx, cy, rx, ry, s] of BLOBS) {
        const d = Math.hypot((c - cx) / rx, (r - cy) / ry);
        p = Math.max(p, s * Math.max(0, 1 - d) ** 1.4);
      }
      if (rand() < p * 0.5) {
        rects.push({ x: c * CELL, y: r * CELL, o: 0.08 + rand() * 0.2 });
      }
    }
  }
  return rects;
}

const RECTS = buildRects();

export default function DotField() {
  return (
    <svg
      className="dot-field"
      viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {RECTS.map((d, i) => (
        <rect key={i} x={d.x + 1} y={d.y + 1} width={CELL - 2} height={CELL - 2} fill="#0A0A0A" opacity={d.o} />
      ))}
    </svg>
  );
}
