'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { usePortal } from '@/context/PortalContext';
import AsciiDollar from './AsciiDollar';

export default function HeroSection() {
  const { openJoinModal } = usePortal();
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Stanzza-grade scroll choreography
  const yHeadline = useTransform(scrollYProgress, [0, 1], [0, -30]);

  return (
    <section
      ref={containerRef}
      className="relative w-full max-w-full bg-[#FFFFFF] pt-28 pb-12 sm:pt-32 sm:pb-14 lg:pt-36 lg:pb-16 border-b border-[#DADADA] overflow-hidden"
    >
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 relative z-10">
        
        {/* Top Micro Telemetry Strip (Stanzza Style) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 sm:mb-8 border-b border-[#DADADA] font-mono text-[11px] text-[#4A4A4A]">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-[#0A0A0A]"></span>
            <span className="font-bold text-[#0A0A0A] tracking-wider">FITECH</span>
            <span className="text-[#DADADA]">/</span>
            <span className="tracking-wide">QUANTITATIVE RESEARCH SOCIETY</span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[#6B6B6B]">
            <span>COORDINATES: 22.72° N, 88.48° E</span>
            <span className="text-[#DADADA]">│</span>
            <span>ADAMAS UNIVERSITY • SOET</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
            <span className="font-medium text-[#0A0A0A] tracking-wide">SYSTEM: ACTIVE // 2026</span>
          </div>
        </div>

        {/* Two-column hero: headline left, ASCII $100 note right */}
        <div className="relative my-4 sm:my-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">

          <div>
            {/* Micro Category Slogan */}
            <div className="flex items-center gap-3 font-mono text-[10px] sm:text-xs text-[#6B6B6B] uppercase tracking-widest mb-6 sm:mb-8">
              <span className="px-3 py-1 rounded-full bg-[#EAEAEA] text-[#0A0A0A] font-semibold">
                ENGINEERING
              </span>
              <span>•</span>
              <span className="px-3 py-1 rounded-full bg-[#EAEAEA] text-[#0A0A0A] font-semibold">
                RESEARCH
              </span>
              <span>•</span>
              <span className="px-3 py-1 rounded-full bg-[#EAEAEA] text-[#0A0A0A] font-semibold">
                CAPITAL
              </span>
            </div>

            <motion.div style={{ y: yHeadline }}>
              <h1 className="font-serif text-[clamp(44px,7.5vw,98px)] font-normal text-[#0A0A0A] leading-[0.92] tracking-[-0.03em] max-w-5xl">
                From code to capital.
              </h1>
              <h2 className="font-serif italic text-[clamp(36px,6.2vw,84px)] font-normal text-[#0A0A0A]/85 leading-[0.96] tracking-[-0.03em] mt-1 sm:mt-2 max-w-5xl">
                Composed with institutional precision.
              </h2>
            </motion.div>
          </div>

          <div className="lg:pt-2">
            <p className="font-mono text-sm sm:text-base uppercase tracking-wide text-[#0A0A0A] mb-5">
              Quantitative Currency Analysis //<br />ASCII Representation
            </p>

            <AsciiDollar />

            <button
              type="button"
              onClick={openJoinModal}
              className="stanzza-btn-pill stanzza-btn-dark mt-8 px-8 py-4 text-xs font-semibold uppercase tracking-[0.14em]"
            >
              <span>Join Us</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
