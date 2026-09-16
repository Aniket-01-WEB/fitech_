'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Elements that animate individually, with a stagger among siblings.
const ITEM_SELECTOR = [
  '.grid > *',
  '[class*="grid-cols"] > *',
  '.simple-event-card',
  '.admin-event-card',
  '.admin-note-card',
  '.lab-card',
  '.habito-card',
  '.benefit-card',
  '.team-card',
].join(',');

// Top-level blocks inside a section's container (header strips, headings,
// copy, tables). A block that contains animated items is left alone so the
// items don't move twice.
const BLOCK_SELECTOR = ['main section > div > *', 'main section > div > div > *', 'footer > div > *'].join(',');

// Never animate inside these: overlays, the nav, and the 3D note stage.
const EXCLUDE = '.sleek-mobile-menu, .join-modal-backdrop, .portal-detail-backdrop, header, .ascii-stage, .projects-reveal-card, .animate-marquee';

const MAX_STAGGER = 8;

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    root.classList.add('js-reveal');

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in-view');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.05 },
    );

    // Tagging is idempotent, but observing must be redone for every fresh
    // observer (effects re-run on route change and under StrictMode), so an
    // already-tagged element that hasn't revealed yet is observed again.
    const mark = (el: Element, delay: number) => {
      if (!el.hasAttribute('data-reveal')) {
        el.setAttribute('data-reveal', '');
        (el as HTMLElement).style.setProperty('--reveal-delay', `${delay}ms`);
      }
      if (!el.classList.contains('in-view')) io.observe(el);
    };

    const scan = () => {
      // Items first, staggered by position among their marked siblings.
      const items = document.querySelectorAll(ITEM_SELECTOR);
      const seen = new Set<Element>();
      items.forEach((el) => {
        if (seen.has(el) || el.closest(EXCLUDE)) return;
        if (el.querySelector('.ascii-stage')) return;
        const parent = el.parentElement;
        if (!parent) return;
        let i = 0;
        for (const sib of Array.from(parent.children)) {
          if (!sib.matches(ITEM_SELECTOR)) continue;
          seen.add(sib);
          if (sib.closest(EXCLUDE)) continue;
          mark(sib, Math.min(i, MAX_STAGGER) * 70);
          i++;
        }
      });
      // Then blocks, skipping any that contain items already marked.
      document.querySelectorAll(BLOCK_SELECTOR).forEach((el) => {
        if (el.closest(EXCLUDE)) return;
        if (el.hasAttribute('data-reveal')) { mark(el, 0); return; }
        if (el.closest('[data-reveal]') || el.querySelector('[data-reveal], .ascii-stage')) return;
        if ((el as HTMLElement).offsetParent === null && getComputedStyle(el).position !== 'fixed') return;
        mark(el, 0);
      });
    };

    scan();
    // Content that arrives later (portal data, tab switches, route changes).
    let t = 0;
    const mo = new MutationObserver(() => {
      window.clearTimeout(t);
      t = window.setTimeout(scan, 60);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(t);
      mo.disconnect();
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
