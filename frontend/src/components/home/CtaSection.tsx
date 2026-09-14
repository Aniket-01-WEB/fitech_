'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePortal } from '@/context/PortalContext';

export default function CtaSection() {
  const { openJoinModal } = usePortal();

  return (
    <section className="relative w-full bg-[#FFFBF5] py-24 md:py-36 lg:py-44 border-b border-[#D8D6CB] overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 relative z-10">
        
        {/* Section Marker */}
        <div className="flex items-center justify-between pb-4 mb-14 sm:mb-20 border-b border-[#D8D6CB] font-mono text-[11px] text-[#707070] tracking-wider uppercase">
          <span>09 / INTAKE & ADMISSIONS</span>
          <span>CAMPUS GUILD CHAPTER // 2026</span>
        </div>

        {/* Stanzza Floating Conversation Card */}
        <div 
          className="relative bg-[#F4F3EB] rounded-3xl border border-[#D8D6CB] p-10 sm:p-16 md:p-20 lg:p-24 text-center max-w-5xl mx-auto"
          style={{ boxShadow: '0 24px 60px rgba(30,30,30,0.05)' }}
        >
          {/* Top Micro-Header */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFBF5] border border-[#D8D6CB] font-mono text-[11px] text-[#1E1E1E] font-semibold uppercase tracking-wider mb-8 sm:mb-10">
            <span className="w-1.5 h-1.5 bg-[#059669] rounded-full"></span>
            <span>Annual Recruitment Cycle // Open</span>
          </div>

          {/* Stanzza Serif Headline */}
          <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-[#1E1E1E] leading-[0.92] tracking-tight max-w-4xl mx-auto mb-6 sm:mb-8">
            Start with a
            <br />
            <span className="italic">Conversation.</span>
          </h2>

          <p className="font-sans-body text-base sm:text-xl text-[#5F5F5F] leading-relaxed max-w-2xl mx-auto font-light mb-10 sm:mb-12">
            Whether you want to engineer low-latency matching cores, research stochastic volatility, or incubate a technical fintech startup, our laboratory doors are open.
          </p>

          {/* Stanzza Rounded Pill Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={openJoinModal}
              className="stanzza-btn-pill stanzza-btn-dark px-10 py-5 text-xs tracking-[0.16em]"
            >
              <span>Join FiTech Fellowship</span>
              <span>→</span>
            </button>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="stanzza-btn-pill stanzza-btn-light px-10 py-5 text-xs tracking-[0.16em]"
            >
              <span>Inspect Repositories</span>
              <span>↗</span>
            </a>
          </div>

          {/* Footnote Metadata */}
          <div className="mt-14 pt-8 border-t border-[#D8D6CB] flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#707070]">
            <div>
              <span>TRACKS: QUANT DEVELOPER • DEFI RESEARCHER • AI / RISK FELLOW</span>
            </div>
            <div>
              <span>ADAMAS UNIVERSITY • SOET CAMPUS</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
