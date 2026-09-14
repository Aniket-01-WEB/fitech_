'use client';

import React from 'react';

export default function AboutSection() {
  return (
    <section id="about" className="relative w-full bg-[#FAFAF8] py-24 md:py-36 lg:py-44 border-b border-[#DCDCD8]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
        
        {/* Section Index Marker */}
        <div className="flex items-center justify-between pb-4 mb-14 sm:mb-20 border-b border-[#DCDCD8] font-mono text-[11px] text-[#707070] tracking-wider uppercase">
          <span>[ SECTION 01 // MANDATE & FOUNDATIONAL THESIS ]</span>
          <span>RESEARCH DIRECTIVE // 2026</span>
        </div>

        {/* Major Editorial Layout: Hierarchy (Header -> Big Statement -> Supporting Text) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-20 sm:mb-28">
          
          {/* Left Column: Section Title & Micro Metadata */}
          <div className="lg:col-span-4">
            <span className="font-mono text-xs font-bold text-[#111111] uppercase tracking-wider block mb-2">
              01 / MANDATE
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-[#111111] tracking-tight uppercase leading-none">
              ABOUT US
            </h2>
            <div className="mt-6 pt-6 border-t border-[#ECECE8] font-mono text-xs text-[#555555] space-y-1.5">
              <div>INSTITUTION: ADAMAS UNIVERSITY</div>
              <div>AFFILIATION: SCHOOL OF ENGINEERING & TECHNOLOGY</div>
              <div>DOMAIN: QUANTITATIVE SYSTEMS & FINTECH</div>
            </div>
          </div>

          {/* Right Column: Big Statement followed by Supporting Text */}
          <div className="lg:col-span-8">
            {/* BIG STATEMENT */}
            <blockquote className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#111111] leading-[1.12] tracking-tight">
              &ldquo;We believe the future of finance will be built by people who understand technology, data, markets and human behavior.&rdquo;
            </blockquote>

            {/* Supporting Explanation - Unboxed, letting canvas breathe */}
            <div className="mt-10 sm:mt-14 pt-8 border-t border-[#DCDCD8] grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 text-[#555555] font-sans text-sm sm:text-base leading-relaxed">
              <p>
                FITECH is an applied engineering society where students design, benchmark, and deploy real financial technology systems. We dissect modern market microstructures, model volatile derivatives, and formulate automated strategies.
              </p>
              <p>
                By connecting academic computer science and mathematics with institutional trading practices, members gain hands-on proficiency in low-latency C++, decentralized protocol invariants, and quantitative research pipelines.
              </p>
            </div>
          </div>

        </div>

        {/* EDITORIAL STATISTICS: Large numbers + small labels + thin dividers (Research Report Style) */}
        <div className="pt-12 border-t border-[#DCDCD8]">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#DCDCD8]">
            
            {/* Statistic 1: 06 SPECIALIZED DOMAINS */}
            <div className="py-8 sm:py-0 sm:px-8 first:pl-0">
              <div className="font-mono text-[10px] text-[#707070] uppercase tracking-wider mb-2">
                METRIC // 01
              </div>
              <div className="font-heading text-6xl sm:text-7xl lg:text-8xl font-black text-[#111111] leading-none tracking-tight">
                06
              </div>
              <div className="mt-3 font-heading font-bold text-base sm:text-lg text-[#111111] uppercase tracking-wider leading-tight">
                SPECIALIZED
                <br />
                DOMAINS
              </div>
              <p className="mt-3 font-sans text-xs text-[#555555] leading-relaxed max-w-xs">
                Quantitative Systems, Algorithmic Markets, Financial AI, Stochastic Risk, Fintech Incubation, and Web3 Protocols.
              </p>
            </div>

            {/* Statistic 2: 01 STUDENT COMMUNITY */}
            <div className="py-8 sm:py-0 sm:px-8">
              <div className="font-mono text-[10px] text-[#707070] uppercase tracking-wider mb-2">
                METRIC // 02
              </div>
              <div className="font-heading text-6xl sm:text-7xl lg:text-8xl font-black text-[#111111] leading-none tracking-tight">
                01
              </div>
              <div className="mt-3 font-heading font-bold text-base sm:text-lg text-[#111111] uppercase tracking-wider leading-tight">
                STUDENT
                <br />
                COMMUNITY
              </div>
              <p className="mt-3 font-sans text-xs text-[#555555] leading-relaxed max-w-xs">
                Autonomous student leadership governing research symposia, hackathons, and institutional codebase repositories.
              </p>
            </div>

            {/* Statistic 3: ∞ ROOM TO BUILD */}
            <div className="py-8 sm:py-0 sm:px-8 last:pr-0">
              <div className="font-mono text-[10px] text-[#707070] uppercase tracking-wider mb-2">
                METRIC // 03
              </div>
              <div className="font-heading text-6xl sm:text-7xl lg:text-8xl font-black text-[#111111] leading-none tracking-tight">
                ∞
              </div>
              <div className="mt-3 font-heading font-bold text-base sm:text-lg text-[#111111] uppercase tracking-wider leading-tight">
                ROOM TO
                <br />
                BUILD
              </div>
              <p className="mt-3 font-sans text-xs text-[#555555] leading-relaxed max-w-xs">
                Zero gatekeeping for students driven by technical curiosity, mathematical rigor, and production financial engineering.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
