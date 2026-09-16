// Crops the full-screen ASCII intro frames (300x100, from the
// feat/ascii-intro-animation branch) down to the bill's own bounding box
// and trims trailing whitespace, so the landing page only ships the note
// itself instead of the mostly-empty screen around it.
//
//   node scripts/build-bill-frames.mjs <path/to/ascii-frames.json>
//
// Writes public/intro/bill-frames.json = { fps, cols, rows, frames: string[] }
// where each frame is rows joined with "\n".
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const src = process.argv[2];
if (!src) {
  console.error('usage: node scripts/build-bill-frames.mjs <ascii-frames.json>');
  process.exit(1);
}
const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, '../public/intro/bill-frames.json');

const json = JSON.parse(fs.readFileSync(src, 'utf8'));
const { cols } = json.wide;
const raw = json.wide.hi;
const split = (f) => f.match(new RegExp(`.{1,${cols}}`, 'g'));

let r0 = Infinity, r1 = -1, c0 = Infinity, c1 = -1;
for (const f of raw) {
  split(f).forEach((row, ri) => {
    if (!row.trim()) return;
    r0 = Math.min(r0, ri);
    r1 = Math.max(r1, ri);
    c0 = Math.min(c0, row.search(/\S/));
    c1 = Math.max(c1, row.trimEnd().length - 1);
  });
}

const frames = raw.map((f) =>
  split(f)
    .slice(r0, r1 + 1)
    .map((row) => row.slice(c0, c1 + 1).trimEnd())
    .join('\n'),
);

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(
  out,
  JSON.stringify({ fps: json.fps, cols: c1 - c0 + 1, rows: r1 - r0 + 1, frames }),
);
console.log(`wrote ${out}: ${frames.length} frames, ${c1 - c0 + 1}x${r1 - r0 + 1}, ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
