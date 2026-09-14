'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { usePortal } from '@/context/PortalContext';

const DOMAINS = [
  'Quantitative Systems',
  'Statistical Arbitrage',
  'Financial Transformers',
  'Stochastic Volatility',
  'Venture Incubation',
  'Decentralized Protocols',
];

export default function HeroSection() {
  const { openJoinModal } = usePortal();
  const containerRef = useRef<HTMLElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const { scrollYProgress: imgProgress } = useScroll({
    target: heroImageRef,
    offset: ['start end', 'end start'],
  });

  // Stanzza-grade scroll choreography
  const yHeadline = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const scaleHeroImg = useTransform(imgProgress, [0, 1], [1.08, 1.0]);

  return (
    <section
      ref={containerRef}
      className="relative w-full max-w-full bg-[#FFFBF5] pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pt-44 lg:pb-28 border-b border-[#D8D6CB] overflow-hidden"
    >
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 relative z-10">
        
        {/* Top Micro Telemetry Strip (Stanzza Style) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-8 sm:mb-12 border-b border-[#D8D6CB] font-mono text-[11px] text-[#5F5F5F]">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-[#1E1E1E]"></span>
            <span className="font-bold text-[#1E1E1E] tracking-wider">FITECH</span>
            <span className="text-[#D8D6CB]">/</span>
            <span className="tracking-wide">QUANTITATIVE RESEARCH SOCIETY</span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[#707070]">
            <span>COORDINATES: 22.72° N, 88.48° E</span>
            <span className="text-[#D8D6CB]">│</span>
            <span>ADAMAS UNIVERSITY • SOET</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
            <span className="font-medium text-[#1E1E1E] tracking-wide">SYSTEM: ACTIVE // 2026</span>
          </div>
        </div>

        {/* STANZZA HERO COMPOSITION: Graceful Editorial Serif Typography */}
        <div className="relative my-4 sm:my-6">
          
          {/* Micro Category Slogan */}
          <div className="flex items-center gap-3 font-mono text-[10px] sm:text-xs text-[#707070] uppercase tracking-widest mb-6 sm:mb-8">
            <span className="px-3 py-1 rounded-full bg-[#E5E4DC] text-[#1E1E1E] font-semibold">
              ENGINEERING
            </span>
            <span>•</span>
            <span className="px-3 py-1 rounded-full bg-[#E5E4DC] text-[#1E1E1E] font-semibold">
              RESEARCH
            </span>
            <span>•</span>
            <span className="px-3 py-1 rounded-full bg-[#E5E4DC] text-[#1E1E1E] font-semibold">
              CAPITAL
            </span>
          </div>

          {/* Stanzza Scaled Headline with Harmonious Proportion */}
          <motion.div style={{ y: yHeadline }} className="mb-10 sm:mb-12">
            <h1 className="font-serif text-[clamp(44px,7.5vw,98px)] font-normal text-[#1E1E1E] leading-[0.92] tracking-[-0.03em] max-w-5xl">
              From code to capital.
            </h1>
            <h2 className="font-serif italic text-[clamp(36px,6.2vw,84px)] font-normal text-[#1E1E1E]/85 leading-[0.96] tracking-[-0.03em] mt-1 sm:mt-2 max-w-5xl">
              Composed with institutional precision.
            </h2>
          </motion.div>

          {/* Full-Bleed Expanding Aperture Window (Stanzza .image-hero) */}
          <div 
            ref={heroImageRef}
            className="relative w-full aspect-[16/7.5] sm:aspect-[16/7] md:aspect-[21/9] rounded-3xl overflow-hidden border border-[#D8D6CB] bg-[#1E1E1E] mb-12 sm:mb-16 group"
            style={{ boxShadow: '0 24px 60px rgba(30,30,30,0.07)' }}
          >
            <motion.img
              style={{ scale: scaleHeroImg }}
              src="/images/event-summit.jpg"
              alt="Fitech Quantitative Systems Lab"
              className="w-full h-full object-cover grayscale contrast-115 group-hover:grayscale-0 transition-all duration-700 will-change-transform"
            />
            <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-[#1E1E1E]/80 text-[#FFFBF5] backdrop-blur-md font-mono text-[10px] uppercase tracking-wider border border-[#FFFFFF]/10">
              Plate 00 // Flagship Research Symposium • Main Auditorium
            </div>
            <div className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-full bg-[#FFFBF5]/90 text-[#1E1E1E] backdrop-blur-md font-mono text-[10px] uppercase tracking-wider border border-[#D8D6CB]">
              Adamas University • SOET Chapter
            </div>
          </div>

          {/* Editorial Subtitle & Balanced Stanzza Pill Action Buttons */}
          <div className="pt-8 sm:pt-10 border-t border-[#D8D6CB] flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#1E1E1E] leading-snug tracking-tight mb-3">
                A student-governed engineering society bridging academia and institutional quantitative finance.
              </h3>

              <p className="font-sans-body text-sm sm:text-base text-[#5F5F5F] leading-relaxed font-light">
                We engineer high-throughput order matching engines, calibrate stochastic volatility surfaces, deploy zero-knowledge protocol invariants, and incubate technical founders at the academic frontier.
              </p>
            </div>

            {/* Stanzza Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 shrink-0">
              <button
                type="button"
                onClick={openJoinModal}
                className="stanzza-btn-pill stanzza-btn-dark px-8 py-4 text-xs font-semibold uppercase tracking-[0.14em]"
              >
                <span>Join The Guild</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </button>

              <a
                href="#composition"
                className="stanzza-btn-pill stanzza-btn-light px-8 py-4 text-xs font-semibold uppercase tracking-[0.14em]"
              >
                <span>Philosophy</span>
                <span className="text-[#707070]">↓</span>
              </a>
            </div>
          </div>

          {/* Floating Pill Domain Ticker */}
          <div className="mt-12 pt-6 border-t border-[#E5E4DC] flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="font-mono text-[10px] text-[#707070] uppercase tracking-widest mr-2">
              DISCIPLINES:
            </span>
            {DOMAINS.map((domain, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full bg-[#F4F3EB] border border-[#D8D6CB] font-mono text-[10px] text-[#3A3A3A] hover:border-[#1E1E1E] transition-colors"
              >
                {domain}
              </span>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
