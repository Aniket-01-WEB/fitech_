// Renders a photo of a banknote as dot-stipple ASCII: every cell is ' ',
// '.' or ':' and all tone comes from dot density, like an engraved halftone.
//
//   node scripts/build-bill-dots.mjs <bill.jpg> [cols] [gamma] [t1] [t2]
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
const COLS = Number(process.argv[3] || 240);
const CHAR_ASPECT = 0.6; // monospace advance width / line height at line-height:1
const RAMP = [' ', '.', ':'];
const GAMMA = Number(process.argv[4] || 2.0);

if (!src) {
  console.error('usage: node scripts/build-bill-dots.mjs <bill.jpg> [cols] [gamma]');
  process.exit(1);
}
const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, '../public/intro/bill-dots.json');

const { width, height, data } = jpeg.decode(fs.readFileSync(src), { useTArray: true, formatAsRGBA: true });
const ROWS = Math.round((COLS * CHAR_ASPECT * height) / width);

// Box-average luminance into the character grid.
const cell = new Float32Array(COLS * ROWS);
for (let r = 0; r < ROWS; r++) {
  const y0 = Math.floor((r * height) / ROWS), y1 = Math.floor(((r + 1) * height) / ROWS);
  for (let c = 0; c < COLS; c++) {
    const x0 = Math.floor((c * width) / COLS), x1 = Math.floor(((c + 1) * width) / COLS);
    let sum = 0, n = 0;
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const i = (y * width + x) * 4;
        sum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
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
  return Math.pow(1 - t, GAMMA);
});

// Quantize straight onto the ramp (no error diffusion — diffusion turns the
// engraving into speckle; hard thresholds keep the line-work crisp).
const T1 = Number(process.argv[5] || 0.22); // ink above this -> '.'
const T2 = Number(process.argv[6] || 0.5); // ink above this -> ':'
const lines = [];
for (let r = 0; r < ROWS; r++) {
  let line = '';
  for (let c = 0; c < COLS; c++) {
    const v = ink[r * COLS + c];
    line += v >= T2 ? RAMP[2] : v >= T1 ? RAMP[1] : RAMP[0];
  }
  lines.push(line.replace(/\s+$/, ''));
}

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify({ cols: COLS, rows: ROWS, text: lines.join('\n') }));
console.log(`wrote ${out}: ${COLS}x${ROWS}, ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
console.log(lines.join('\n'));
