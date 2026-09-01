'use client';

import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

// ?v is bumped whenever the payload's shape changes, so a browser holding an
// older copy can never satisfy this request from cache.
const DATA_SRC = '/intro/ascii-frames.json?v=2';
const SEEN_KEY = 'matrix_intro_seen';

const BASE_FONT_PX = 10;     // measured at this size, then scaled to fit the viewport
const FIT_W = 0.94;

/* Landscape phones are short enough that a 90%-height note leaves no room for
   the wordmark underneath, so the note gives some height back. */
const FIT_H_TALL = 0.9, FIT_H_SHORT = 0.7;
const SHORT_VH_PX = 520;

/* Grid choice is made on the resulting character size, not on a width
   breakpoint: a 768px tablet would render the fine grid at ~2.4px per cell,
   which stops reading as characters at all. */
const MIN_ADVANCE_PX = 3.4;

/* The note's ink ends ~80% down its grid (the rest of the 16:9 frame is empty
   background), so the wordmark hangs off the art rather than off the viewport.
   On a portrait phone the note is a band in the middle, and pinning the word to
   the bottom of the screen left a large hole between them. */
const ART_INK_BOTTOM = 0.8;
const WORD_GAP_FRAC = 0.06;
const WORD_MIN_GAP_PX = 14;
const WORD_MAX_H_FRAC = 0.14; // wordmark never taller than this share of viewport

/* The wordmark is drawn in real Montserrat on a canvas, then read back and
   converted to characters on the same ramp as the note, so it belongs to the
   same picture instead of sitting on top of it as ordinary type. */
const WORD = 'FINTECH';
const WORD_RAMP = '@%#*+=-:.';
const WORD_TRACKING_EM = 0.18;
const WORD_INK_FLOOR = 0.10;  // below this coverage a cell stays empty
const WORD_SUPERSAMPLE = 4;
const WORD_ROWS_WIDE = 11, WORD_ROWS_NARROW = 7;
const NARROW_GRID_MAX_COLS = 160; // distinguishes the coarse grid from the fine one
const WORD_WIDTH_WIDE = 0.62, WORD_WIDTH_NARROW = 0.86; // share of viewport width

/* The letterform holds still; only the density inside it moves. Cells start as
   noise, resolve on a sweep across the word, then a slow wave keeps travelling
   through them so it reads as live output rather than a static picture. */
const WORD_START_MS = 420;          // matches the CSS fade-in delay
const WORD_DECODE_SWEEP_MS = 420;   // the resolve sweeps left to right
const WORD_DECODE_JITTER_MS = 240;  // per-cell scatter, so the edge is not a hard line
const WORD_WAVE_PERIOD_MS = 1500;   // one full pass of the wave
const WORD_WAVE_CYCLES = 1.5;       // waves visible across the word at once
const WORD_WAVE_AMP = 0.17;         // how far the wave pushes a cell along the ramp

/* 49 frames of the note unfolding, then the camera push is done here as a
   transform rather than with the source clip's own zoom (those frames are a
   full-bleed close-up that turns to mud as ASCII).
     frames  49 @ 30fps            = 1633ms
     push    starts 1500ms, runs   =  800ms
     total                         = 2300ms */
const ZOOM_START_MS = 1500;
const ZOOM_MS = 800;         // keep in sync with .is-zooming transitions in globals.css
const LOAD_TIMEOUT_MS = 2500;
const WATCHDOG_MS = 6000;

/* Set by the boot script in layout.js before first paint, and dropped the moment
   the push begins. While present it blacks the page out and hides the body, so
   nothing (the MATRIX PageLoader included) can flash behind the intro. */
const ACTIVE_CLASS = 'money-intro-active';

/* Resolved once per page load: the intro is a landing moment, not a page transition. */
let introWillPlay = null;

export function shouldPlayIntro() {
  if (typeof window === 'undefined') return false;
  if (introWillPlay === null) {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === '1';
    } catch {
      seen = false; // storage blocked (private mode), just play it
    }
    introWillPlay = window.location.pathname === '/' && !seen;
  }
  return introWillPlay;
}

const fitHeightShare = () =>
  (window.innerHeight < SHORT_VH_PX ? FIT_H_SHORT : FIT_H_TALL);

function releasePage() {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove(ACTIVE_CLASS);
  }
}

/* Rasterise WORD in Montserrat and read the pixels back as characters.
   cellAspect is the width:height ratio of one character cell, so the letters
   come out correctly proportioned instead of stretched by the grid. */
function buildWordAscii(rows, cellAspect) {
  const probe = document.createElement('canvas').getContext('2d');
  if (!probe) return null;

  const FS = 200;
  probe.font = `800 ${FS}px Montserrat, sans-serif`;
  try { probe.letterSpacing = `${WORD_TRACKING_EM * FS}px`; } catch { /* older browsers */ }

  let m = probe.measureText(WORD);
  const inkW = m.width;
  const inkH = (m.actualBoundingBoxAscent || FS * 0.72) + (m.actualBoundingBoxDescent || 0);
  if (!inkW || !inkH) return null;

  const cols = Math.max(8, Math.round((rows * (inkW / inkH)) / cellAspect));
  const SS = WORD_SUPERSAMPLE;
  const canvas = document.createElement('canvas');
  canvas.width = cols * SS;
  canvas.height = rows * SS;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;

  const fontSize = FS * (canvas.height / inkH);
  ctx.font = `800 ${fontSize}px Montserrat, sans-serif`;
  try { ctx.letterSpacing = `${WORD_TRACKING_EM * fontSize}px`; } catch { /* older browsers */ }
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  m = ctx.measureText(WORD);
  const ascent = m.actualBoundingBoxAscent || fontSize * 0.72;
  const descent = m.actualBoundingBoxDescent || 0;
  ctx.fillText(
    WORD,
    (canvas.width - m.width) / 2,
    (canvas.height + ascent - descent) / 2
  );

  const px = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const ink = new Float32Array(cols * rows);
  const jitter = new Float32Array(cols * rows);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let sum = 0;
      for (let y = 0; y < SS; y++) {
        const rowStart = ((r * SS + y) * canvas.width + c * SS) * 4;
        for (let x = 0; x < SS; x++) sum += px[rowStart + x * 4 + 3];
      }
      const i = r * cols + c;
      ink[i] = sum / (SS * SS * 255);
      jitter[i] = Math.random() * WORD_DECODE_JITTER_MS;
    }
  }
  return { ink, jitter, cols, rows };
}

/* One animated frame of the wordmark. Cells outside the glyphs stay empty at all
   times, so the silhouette is crisp from the very first frame and only the
   texture inside the letters churns. */
function renderWordFrame(word, elapsed) {
  const { ink, jitter, cols, rows } = word;
  const last = WORD_RAMP.length - 1;
  const phase = (elapsed / WORD_WAVE_PERIOD_MS) * Math.PI * 2;
  let out = '';
  for (let r = 0; r < rows; r++) {
    let line = '';
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const a = ink[i];
      if (a < WORD_INK_FLOOR) { line += ' '; continue; }
      if (elapsed < (c / cols) * WORD_DECODE_SWEEP_MS + jitter[i]) {
        line += WORD_RAMP[(Math.random() * WORD_RAMP.length) | 0]; // still decoding
        continue;
      }
      const wave = Math.sin((c / cols) * WORD_WAVE_CYCLES * Math.PI * 2 - phase);
      const lit = Math.min(1, Math.max(0, a + wave * WORD_WAVE_AMP));
      line += WORD_RAMP[Math.min(last, Math.floor((1 - lit) * WORD_RAMP.length))];
    }
    out += r ? '\n' + line : line;
  }
  return out;
}

const subscribeToNothing = () => () => {};
const introIsPending = () => false;

export default function MoneyIntro() {
  // Client-only value: false through SSR and hydration, real answer right after.
  const shouldPlay = useSyncExternalStore(subscribeToNothing, shouldPlayIntro, introIsPending);

  const [ready, setReady] = useState(false);
  const [zooming, setZooming] = useState(false);
  const [finished, setFinished] = useState(false);

  const loRef = useRef(null);
  const hiRef = useRef(null);
  const wordRef = useRef(null);
  const wordBoxRef = useRef(null);
  const wordGridRef = useRef(null);
  const wordDataRef = useRef(null);
  const framesRef = useRef(null);
  const gridRef = useRef(null);
  const aspectRef = useRef(16 / 9);
  const fpsRef = useRef(30);
  const rafRef = useRef(0);
  const playedRef = useRef(false);
  const timersRef = useRef([]);
  const closedRef = useRef(false);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const addTimer = useCallback((fn, ms) => {
    timersRef.current.push(window.setTimeout(fn, Math.max(0, ms)));
  }, []);

  const close = useCallback((delayMs) => {
    if (closedRef.current) return;
    closedRef.current = true;
    clearTimers();
    window.cancelAnimationFrame(rafRef.current);
    releasePage(); // never leave the page blacked out, whatever went wrong
    if (playedRef.current) {
      // Only suppress future plays if it actually ran. Marking it seen after a
      // failed load would silently kill the intro for the rest of the session.
      try {
        window.sessionStorage.setItem(SEEN_KEY, '1');
      } catch {
        /* storage blocked, the intro simply plays again next load */
      }
    }
    window.setTimeout(() => {
      document.body.classList.remove('money-intro-lock');
      setFinished(true);
    }, delayMs);
  }, [clearTimers]);

  /* Fit the grid to the viewport. Character advance differs between monospace
     faces (Consolas is narrower than Menlo), so measure it and derive a
     line-height that reproduces the source 16:9 proportions in any font, or the
     note comes out stretched. offsetWidth/offsetHeight are layout values and
     ignore the transform, so this stays valid once the push has started. */
  const fitToViewport = useCallback(() => {
    const lo = loRef.current, hi = hiRef.current, grid = gridRef.current;
    if (!lo || !hi || !grid) return;

    lo.style.fontSize = `${BASE_FONT_PX}px`;
    lo.style.lineHeight = '1';
    const advance = lo.offsetWidth / grid.cols;
    if (!advance) return;

    const gridW = grid.cols * advance;
    const gridH = gridW / aspectRef.current;
    const lineHeight = gridH / grid.rows / BASE_FONT_PX;
    const fit = Math.min(
      (window.innerWidth * FIT_W) / gridW,
      (window.innerHeight * fitHeightShare()) / gridH
    );
    // Set the real font size rather than transform-scaling, so glyphs stay crisp.
    const fontSize = `${BASE_FONT_PX * fit}px`;
    for (const el of [lo, hi]) {
      el.style.fontSize = fontSize;
      el.style.lineHeight = `${lineHeight}`;
    }

    /* The wordmark keeps the note's cell proportions but is sized on its own, so
       it stays legible on a phone where the note's grid is far coarser. Width
       drives the size until the viewport is too short, then height caps it. */
    const word = wordRef.current, wordBox = wordBoxRef.current, wordGrid = wordGridRef.current;
    if (word && wordBox && wordGrid) {
      const advanceRatio = advance / BASE_FONT_PX;
      const share = grid.cols <= NARROW_GRID_MAX_COLS ? WORD_WIDTH_NARROW : WORD_WIDTH_WIDE;
      const byWidth = (window.innerWidth * share) / (wordGrid.cols * advanceRatio);
      const byHeight = (window.innerHeight * WORD_MAX_H_FRAC) / (wordGrid.rows * lineHeight);
      const wordFont = Math.min(byWidth, byHeight);
      word.style.fontSize = `${wordFont}px`;
      word.style.lineHeight = `${lineHeight}`;

      // Sit under the note's ink, then clamp so it can never run off-screen.
      const artH = gridH * fit;
      const inkBottom = (window.innerHeight - artH) / 2 + artH * ART_INK_BOTTOM;
      const gap = Math.max(artH * WORD_GAP_FRAC, WORD_MIN_GAP_PX);
      const wordH = wordGrid.rows * lineHeight * wordFont;
      const top = Math.min(
        inkBottom + gap,
        window.innerHeight - wordH - WORD_MIN_GAP_PX
      );
      wordBox.style.top = `${Math.max(0, top)}px`;
    }
  }, []);

  useEffect(() => {
    if (!shouldPlay) return undefined;

    document.body.classList.add('money-intro-lock');
    let alive = true;

    fetch(DATA_SRC)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data) => {
        if (!alive || closedRef.current) return;
        const srcAspect = data.srcAspect || 16 / 9;
        const artW = Math.min(
          window.innerWidth * FIT_W,
          window.innerHeight * fitHeightShare() * srcAspect
        );
        const fine = data.wide, coarse = data.narrow;
        const grid = (fine && fine.cols && artW / fine.cols >= MIN_ADVANCE_PX)
          ? fine
          : (coarse || fine);
        if (!grid || !Array.isArray(grid.lo) || !grid.lo.length) {
          throw new Error('empty frame set');
        }
        framesRef.current = { lo: grid.lo, hi: grid.hi || [] };
        gridRef.current = { cols: grid.cols, rows: grid.rows };
        aspectRef.current = data.srcAspect || 16 / 9;
        fpsRef.current = data.fps || 30;
        setReady(true);
      })
      .catch(() => close(0)); // no frames, reveal the site at once

    addTimer(() => {
      if (!framesRef.current) close(0);
    }, LOAD_TIMEOUT_MS);
    addTimer(() => close(0), WATCHDOG_MS);

    return () => {
      alive = false;
      clearTimers();
      window.cancelAnimationFrame(rafRef.current);
      releasePage();
      document.body.classList.remove('money-intro-lock');
    };
  }, [shouldPlay, addTimer, clearTimers, close]);

  // Playback starts only once the frames are in hand.
  useEffect(() => {
    if (!ready || closedRef.current) return undefined;

    const frames = framesRef.current;
    const lo = loRef.current, hi = hiRef.current;
    if (!frames || !lo || !hi) return undefined;

    lo.textContent = frames.lo[0];
    hi.textContent = frames.hi[0] || '';
    fitToViewport();
    window.addEventListener('resize', fitToViewport);

    /* Wait for the real face before rasterising: converting a fallback sans
       would bake the wrong letterforms into the grid. */
    let alive = true;
    const drawWord = () => {
      if (!alive || closedRef.current) return;
      const el = wordRef.current, grid = gridRef.current;
      if (!el || !grid) return;
      const lineHeightPx = parseFloat(window.getComputedStyle(lo).lineHeight);
      const cellAspect = lineHeightPx
        ? (lo.offsetWidth / grid.cols) / lineHeightPx
        : 0.6;
      const built = buildWordAscii(
        grid.cols <= NARROW_GRID_MAX_COLS ? WORD_ROWS_NARROW : WORD_ROWS_WIDE,
        cellAspect
      );
      if (!built) return;
      wordGridRef.current = { cols: built.cols, rows: built.rows };
      wordDataRef.current = built;
      el.textContent = renderWordFrame(built, 0);
      fitToViewport();
    };

    if (document.fonts && document.fonts.load) {
      document.fonts.load('800 200px Montserrat').then(drawWord, drawWord);
    } else {
      drawWord();
    }

    const frameMs = 1000 / fpsRef.current;
    const startedAt = performance.now();
    let shown = -1;

    const tick = (now) => {
      if (closedRef.current) return;
      const i = Math.min(frames.lo.length - 1, Math.floor((now - startedAt) / frameMs));
      if (i !== shown) {
        shown = i;
        lo.textContent = frames.lo[i];
        hi.textContent = frames.hi[i] || '';
      }
      const word = wordDataRef.current;
      if (word && wordRef.current) {
        wordRef.current.textContent =
          renderWordFrame(word, now - startedAt - WORD_START_MS);
      }
      rafRef.current = window.requestAnimationFrame(tick);
    };
    playedRef.current = true;
    rafRef.current = window.requestAnimationFrame(tick);

    addTimer(() => {
      // Hand the page back while the overlay still covers it, so the reveal
      // happens under cover and the whole thing lands as one motion.
      releasePage();
      setZooming(true);
    }, ZOOM_START_MS);
    addTimer(() => close(ZOOM_MS), ZOOM_START_MS);

    return () => {
      alive = false;
      window.removeEventListener('resize', fitToViewport);
      window.cancelAnimationFrame(rafRef.current);
    };
  }, [ready, addTimer, close, fitToViewport]);

  if (!shouldPlay || finished) return null;

  return (
    <div className={`money-intro${zooming ? ' is-zooming' : ''}`} role="presentation">
      <div className="money-intro-stack">
        <pre ref={loRef} className="money-intro-art money-intro-dim" aria-hidden="true" />
        <pre ref={hiRef} className="money-intro-art money-intro-bright" aria-hidden="true" />
      </div>
      <div className="money-intro-wordmark" ref={wordBoxRef}>
        <pre
          ref={wordRef}
          className="money-intro-art money-intro-bright"
          role="img"
          aria-label={WORD}
        />
      </div>
    </div>
  );
}
