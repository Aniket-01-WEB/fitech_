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

        {/* STANZZA HERO COMPOSITION: Graceful Editorial Serif Typography */}
        <div className="relative my-4 sm:my-6">
          
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

          {/* Stanzza Scaled Headline with Harmonious Proportion */}
          <motion.div style={{ y: yHeadline }} className="mb-6 sm:mb-8">
            <h1 className="font-serif text-[clamp(44px,7.5vw,98px)] font-normal text-[#0A0A0A] leading-[0.92] tracking-[-0.03em] max-w-5xl">
              From code to capital.
            </h1>
            <h2 className="font-serif italic text-[clamp(36px,6.2vw,84px)] font-normal text-[#0A0A0A]/85 leading-[0.96] tracking-[-0.03em] mt-1 sm:mt-2 max-w-5xl">
              Composed with institutional precision.
            </h2>
          </motion.div>

          {/* Full-Bleed Expanding Aperture Window (Stanzza .image-hero) */}
          <div 
            ref={heroImageRef}
            className="relative w-full aspect-[16/7.5] sm:aspect-[16/7] md:aspect-[21/9] rounded-3xl overflow-hidden border border-[#DADADA] bg-[#0A0A0A] mb-8 sm:mb-10 group"
            style={{ boxShadow: '0 24px 60px rgba(30,30,30,0.07)' }}
          >
            <motion.img
              style={{ scale: scaleHeroImg }}
              src="/images/event-summit.jpg"
              alt="Fitech Quantitative Systems Lab"
              className="w-full h-full object-cover grayscale contrast-115 group-hover:grayscale-0 transition-all duration-700 will-change-transform"
            />
            <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-[#0A0A0A]/80 text-[#FFFFFF] backdrop-blur-md font-mono text-[10px] uppercase tracking-wider border border-[#FFFFFF]/10">
              Plate 00 // Flagship Research Symposium • Main Auditorium
            </div>
            <div className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-full bg-[#FFFFFF]/90 text-[#0A0A0A] backdrop-blur-md font-mono text-[10px] uppercase tracking-wider border border-[#DADADA]">
              Adamas University • SOET Chapter
            </div>
          </div>

          {/* Editorial Subtitle & Balanced Stanzza Pill Action Buttons */}
          <div className="pt-8 sm:pt-10 border-t border-[#DADADA] flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#0A0A0A] leading-snug tracking-tight mb-3">
                A student-governed engineering society bridging academia and institutional quantitative finance.
              </h3>

              <p className="font-sans-body text-sm sm:text-base text-[#4A4A4A] leading-relaxed font-light">
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
                <span className="text-[#6B6B6B]">↓</span>
              </a>
            </div>
          </div>

          {/* Floating Pill Domain Ticker */}
          <div className="mt-8 pt-6 border-t border-[#EAEAEA] flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="font-mono text-[10px] text-[#6B6B6B] uppercase tracking-widest mr-2">
              DISCIPLINES:
            </span>
            {DOMAINS.map((domain, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full bg-[#F2F2F2] border border-[#DADADA] font-mono text-[10px] text-[#4A4A4A] hover:border-[#0A0A0A] transition-colors"
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
