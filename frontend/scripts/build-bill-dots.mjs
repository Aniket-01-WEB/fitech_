// Renders a photo of a banknote as fine-grid greyscale ASCII: every cell
// is one glyph from a light-to-dark ramp, so at a few px per cell the
// result reads like a halftone photograph.
//
//   node scripts/build-bill-dots.mjs <bill.jpg> [cols] [gamma] [ramp] [contrast]
//
// Current render: the Series 2009+ note (blue ribbon, bell-in-inkwell),
// public-domain scan from Wikimedia Commons:
//   https://upload.wikimedia.org/wikipedia/commons/1/1c/Obverse_of_the_%24100_Federal_Reserve_Note.jpg
// Defaults below are tuned for that scan.
//
// Needs `jpeg-js` (npm i --no-save jpeg-js). Writes
// public/intro/bill-dots.json = { cols, rows, text }.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const jpeg = require('jpeg-js');

const src = process.argv[2];
const COLS = Number(process.argv[3] || 360);
const CHAR_ASPECT = 0.6; // monospace advance width / line height at line-height:1
// Light -> dark. Each glyph is a grey level; at hero size the glyph shape
// blurs away and only its ink coverage reads, so this behaves like a
// 10-step greyscale.
const RAMP = process.argv[5] || ' .:-=+*#%@';
const GAMMA = Number(process.argv[4] || 1.6);
// S-curve strength: >1 pushes paper towards white and ink towards black.
const CONTRAST = Number(process.argv[6] || 2.4);

if (!src) {
  console.error('usage: node scripts/build-bill-dots.mjs <bill.jpg> [cols] [gamma]');
  process.exit(1);
}
const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, '../public/intro/bill-dots.json');

const { width: imgW, height: imgH, data } = jpeg.decode(fs.readFileSync(src), { useTArray: true, formatAsRGBA: true });
const lumAt = (x, y) => {
  const i = (y * imgW + x) * 4;
  return 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
};

// Auto-crop to the note's printed frame: scans have a blank paper margin
// that the security ribbon runs across, which otherwise renders as a strip
// poking out past the top and bottom of the note. The frame is the first
// row/column (from each side) whose mean darkness jumps well above the
// margin's.
function frameEdge(count, other, darkAt, step) {
  const base = [];
  for (let i = 0; i < 4; i++) base.push(darkAt(step > 0 ? i : count - 1 - i));
  const margin = Math.max(...base);
  let i = step > 0 ? 0 : count - 1;
  for (; i >= 0 && i < count; i += step) if (darkAt(i) > margin + 25) break;
  return i;
}
const rowDark = (y) => { let s = 0; for (let x = 0; x < imgW; x++) s += 255 - lumAt(x, y); return s / imgW; };
const colDark = (x) => { let s = 0; for (let y = 0; y < imgH; y++) s += 255 - lumAt(x, y); return s / imgH; };
const top = frameEdge(imgH, imgW, rowDark, 1);
const bottom = frameEdge(imgH, imgW, rowDark, -1) + 1;
const left = frameEdge(imgW, imgH, colDark, 1);
const right = frameEdge(imgW, imgH, colDark, -1) + 1;
const width = right - left;
const height = bottom - top;
console.log(`frame crop: x ${left}..${right}, y ${top}..${bottom} of ${imgW}x${imgH}`);

const ROWS = Math.round((COLS * CHAR_ASPECT * height) / width);

// Box-average luminance into the character grid.
const cell = new Float32Array(COLS * ROWS);
for (let r = 0; r < ROWS; r++) {
  const y0 = top + Math.floor((r * height) / ROWS), y1 = top + Math.floor(((r + 1) * height) / ROWS);
  for (let c = 0; c < COLS; c++) {
    const x0 = left + Math.floor((c * width) / COLS), x1 = left + Math.floor(((c + 1) * width) / COLS);
    let sum = 0, n = 0;
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        sum += lumAt(x, y);
        n++;
      }
    }
    cell[r * COLS + c] = sum / n / 255;
  }
}

// Stretch contrast so the paper goes fully white and ink fully dark, then
// convert to "ink coverage" (1 = solid ink).
const sorted = Float32Array.from(cell).sort();
const lo = sorted[Math.floor(sorted.length * 0.02)];
const hi = sorted[Math.floor(sorted.length * 0.97)];
const ink = Float32Array.from(cell, (v) => {
  const t = Math.min(1, Math.max(0, (v - lo) / (hi - lo)));
  const g = Math.pow(1 - t, GAMMA);
  const a = Math.pow(g, CONTRAST);
  return a / (a + Math.pow(1 - g, CONTRAST));
});

// Quantize onto the ramp with light error diffusion so smooth shading
// (the portrait) doesn't band, while the high level count keeps the
// engraving's line-work crisp.
const N = RAMP.length - 1;
const lines = [];
for (let r = 0; r < ROWS; r++) {
  let line = '';
  for (let c = 0; c < COLS; c++) {
    const i = r * COLS + c;
    const want = Math.min(1, Math.max(0, ink[i]));
    const k = Math.round(want * N);
    line += RAMP[k];
    const err = (want - k / N) * 0.5;
    if (c + 1 < COLS) ink[i + 1] += (err * 7) / 16;
    if (r + 1 < ROWS) {
      if (c > 0) ink[i + COLS - 1] += (err * 3) / 16;
      ink[i + COLS] += (err * 5) / 16;
      if (c + 1 < COLS) ink[i + COLS + 1] += (err * 1) / 16;
    }
  }
  lines.push(line.replace(/\s+$/, ''));
}

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify({ cols: COLS, rows: ROWS, text: lines.join('\n') }));
console.log(`wrote ${out}: ${COLS}x${ROWS}, ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
console.log(lines.join('\n'));
