---
name: stanzza-editorial-motion
description: "Master guidelines, mathematical formulas, and component recipes for implementing Stanzza-grade editorial interaction design (inspired by https://stanzza.design). Use whenever designing or implementing editorial websites, fluid smooth scrolling (Lenis), line-by-line clipping text reveals, image scale-settlement, adaptive auto-hiding navigation, asymmetric spatial rhythm, tactile 2D paper depth, and custom spring cursors."
metadata:
  author: fitech-design-lab
  version: "1.0.0"
---

# Stanzza Editorial Motion & Interaction Design System
Reference: `https://stanzza.design`

This skill provides complete architectural patterns, mathematical formulas, CSS rules, and React/Next.js component recipes to achieve the exact editorial luxury, spatial rhythm, and fluid physics of Stanzza.

---

## 1. Core Visual DNA & Rules of Engagement

1. **Restraint over Decoration**:
   - Zero generic SaaS card grids, zero neon gradient blur blobs, zero floating 3D WebGL spheres.
   - Ground is pure light/warm white (`#FFFFFF`, `#FAFAF8`, `#F7F7F5`), typography is deep charcoal/near-black (`#111111`, `#18181B`), dividers are fine 1px hairlines (`#DCDCD8`, `#ECECE8`).
   - Generous, intentional whitespace: section vertical padding is `clamp(96px, 10vw, 180px)`.

2. **Physical 2D Dimensionality & Archival Details**:
   - Registration crosses (`┼`) and corner ticks (`┌ ┐ └ ┘`) placed on bounding frames.
   - Dual-border offset framing (e.g., `-inset-2` or `-inset-4` offset paper surface behind primary container).
   - Hard, crisp mechanical drop shadows (`boxShadow: '4px 6px 0 rgba(0,0,0,0.05)'`).
   - Photographic contact sheet metadata (Exposure, ISO, Lens Focal Length, GPS coordinates, Archive IDs).

3. **Motion is Physical, Never Bouncy**:
   - Easing must be silky and weighted, using custom cubic beziers:
     - Standard reveal: `cubic-bezier(0.16, 1, 0.3, 1)` or `[0.25, 1, 0.5, 1]`.
     - GSAP equivalent: `ease: "power3.out"` or `ease: "expo.out"`.
     - Lenis smooth scroll inertia: `lerp: 0.1` or `smoothWheel: true`.

---

## 2. Mathematical Formulas & Typography

### Fluid Scaled Typography Equation (Direct from Stanzza)
Stanzza uses a continuous interpolation between viewport bounds rather than jagged media query steps:

```css
:root {
  --font-from: 18;
  --font-to: 20;
  --vw-from: calc(1440 / 100);
  --vw-to: calc(1920 / 100);
  --coefficient: calc((var(--font-to) - var(--font-from)) / (var(--vw-to) - var(--vw-from)));
  --base: calc((var(--font-from) - var(--vw-from) * var(--coefficient)) / 16);
}

html {
  font-size: calc(var(--base) * 1rem + var(--coefficient) * 1vw);
}

@media screen and (max-width: 1440px) {
  :root {
    --font-from: 16;
    --font-to: 18;
    --vw-from: calc(768 / 100);
    --vw-to: calc(1440 / 100);
  }
}
```

In Tailwind CSS projects:
- Headlines: `font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-[-0.03em] leading-[0.92]`.
- Monospace subheads & telemetry: `font-mono text-[10px] sm:text-xs tracking-wider uppercase text-[#707070]`.

---

## 3. The 6 Iconic Stanzza Animation Patterns

### Pattern 1: Line-by-Line Clipping Reveal (Masking)
Never fade text in as a whole block. Each line must sit inside an `overflow-hidden` container and slide upward into view.

```tsx
// Framer Motion Pattern
const lines = ['THE FUTURE OF FINANCE', 'WILL BE BUILT BY PEOPLE', 'WHO UNDERSTAND', 'TECHNOLOGY.'];

<div className="space-y-1">
  {lines.map((line, idx) => (
    <div key={idx} className="overflow-hidden">
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        whileInView={{ y: '0%', opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{
          duration: 0.75,
          delay: idx * 0.1,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight"
      >
        {line}
      </motion.div>
    </div>
  ))}
</div>
```

---

### Pattern 2: Image Scale Settlement & Curtain Unveil
Images in Stanzza do not pop in. They are pinned in an `overflow-hidden` parent and scale gently from `1.08` down to `1.00` as the user scrolls, giving a tactile camera focus feel.

```tsx
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function StanzzaImageFrame({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1.0]);

  return (
    <div ref={containerRef} className="relative w-full aspect-[16/9] overflow-hidden bg-[#111111] border border-[#DCDCD8]">
      <motion.img
        style={{ scale }}
        src={src}
        alt={alt}
        className="w-full h-full object-cover grayscale contrast-115 hover:grayscale-0 transition-all duration-700 will-change-transform"
      />
    </div>
  );
}
```

---

### Pattern 3: Adaptive Header with Direction & Contrast Sensing
The header:
1. Hides when scrolling down past `5vh` (`translateY(-110%)`).
2. Re-appears immediately on any upward scroll (`translateY(0%)`).
3. Switches contrast (dark/light) when crossing inverted sections.

```tsx
// Header auto-hide logic
useEffect(() => {
  let lastScroll = 0;
  const threshold = 0.05 * window.innerHeight;

  const onScroll = () => {
    const current = window.scrollY;
    const isScrollingDown = current > lastScroll;
    const header = document.querySelector('header');
    
    if (header) {
      if (current > threshold && isScrollingDown) {
        header.classList.add('is-hide'); // transform: translateY(-110%)
      } else {
        header.classList.remove('is-hide'); // transform: translateY(0)
      }
    }
    lastScroll = Math.max(0, current);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}, []);
```

---

### Pattern 4: Pinned Split-Screen Storytelling (Sticky Left, Scrolling Right)
The left side pins in place with the chapter thesis, while the right side presents sequential evidence, credentials, or dossiers.

```tsx
<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
  {/* Sticky Left Column */}
  <div className="lg:col-span-4 lg:sticky lg:top-36">
    <span className="font-mono text-xs font-bold uppercase tracking-wider block mb-2">
      01 / INDEX
    </span>
    <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none">
      CHAPTER TITLE
    </h2>
    <p className="mt-4 font-sans text-sm text-[#555555] leading-relaxed">
      Context statement that remains fixed as the user reads through the records.
    </p>
  </div>

  {/* Sequential Right Column */}
  <div className="lg:col-span-8 border-t border-[#DCDCD8]">
    {/* Items */}
  </div>
</div>
```

---

### Pattern 5: Expanding Underline Micro-Interaction
Interactive text links feature an underline pseudo-element that expands from left to right on hover:

```css
.u-link-stanzza {
  position: relative;
  text-decoration: none;
}
.u-link-stanzza::before {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0%;
  height: 1px;
  background-color: currentColor;
  transition: width 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}
.u-link-stanzza:hover::before {
  width: 100%;
}
```

---

### Pattern 6: Spring-Physics Desktop Cursor
A tiny dot with a damped follower circle that smoothly expands when hovering over interactive triggers:

- Physics: `stiffness: 500`, `damping: 28`, `mass: 0.5`.
- Disabled completely on mobile / touch (`@media (hover: none)`).
- Carries subtle uppercase action tags (`VIEW`, `INSPECT`, `READ`).

---

## 4. Checklist for Stanzza-Grade Execution

- [ ] All typography uses high-contrast editorial hierarchy (`leading-[0.92]`, `tracking-tight`).
- [ ] No generic boxy cards: use 1px hairlines and unboxed asymmetric rows.
- [ ] Images have scale settlement on scroll (`1.08 -> 1.00`).
- [ ] Headlines reveal line-by-line using `overflow: hidden` mask wrappers.
- [ ] Sticky left headers keep context grounded during vertical reads.
- [ ] Interactive buttons have tactile pressed states (`active:translate-y-0.5`).
- [ ] Registration crosses (`┼`) and film sheet metadata enrich technical sections.
- [ ] Zero build warnings, zero layout shifts, zero horizontal scrollbars.
