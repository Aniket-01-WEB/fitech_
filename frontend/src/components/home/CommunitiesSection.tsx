'use client';

import React from 'react';

const CREDENTIALS = [
  {
    num: '01',
    title: 'Institutional Quant Codebases',
    statement: 'Production-grade C++ matching engines, lock-free ring buffers, and Solidity audit frameworks.',
    detail: 'Members build, benchmark, and deploy real quantitative software using industry-grade development workflows rather than theoretical toy models.',
    spec: 'REPOSITORIES: INTERNAL GUILD REPOS • VERIFIED C++20',
  },
  {
    num: '02',
    title: 'Industry Research Grants & Data Feeds',
    statement: 'Compute credits, Level 2 order book feeds, and research stipends for published technical whitepapers.',
    detail: 'Direct access to nanosecond tick data feeds and dedicated GPU clusters for empirical market microstructure research.',
    spec: 'DATASETS: NANOSECOND LOB TICKS • GPU CLUSTERS',
  },
  {
    num: '03',
    title: 'Direct Placement Pipeline',
    statement: 'Fast-track interview referrals to leading algorithmic trading desks, quant hedge funds, and DeFi protocols.',
    detail: 'Direct mentorship from alumni practitioners and industry engineers working across quantitative finance.',
    spec: 'NETWORK: QUANT DESKS & PROTOCOL TEAMS',
  },
  {
    num: '04',
    title: 'National Hackathon Incubator',
    statement: 'High-caliber student engineering teams mentored by senior fintech founders and algorithmic strategists.',
    detail: 'End-to-end guidance from initial mathematical formulation to high-throughput production deployment.',
    spec: 'RECORD: MULTI-CHAMPIONSHIP SLATE',
  },
];

export default function CommunitiesSection() {
  return (
    <section id="communities" className="relative w-full bg-[#FFFFFF] py-24 md:py-36 lg:py-44 border-b border-[#DCDCD8]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
        
        {/* Section Index Marker */}
        <div className="flex items-center justify-between pb-4 mb-14 sm:mb-20 border-b border-[#DCDCD8] font-mono text-[11px] text-[#707070] tracking-wider uppercase">
          <span>[ SECTION 06 // INSTITUTIONAL ADVANTAGE & ECOSYSTEM ]</span>
          <span>CAMPUS GUILD CHARTER // 2026</span>
        </div>

        {/* Institutional Layout: Large Statements with Subtle Supporting Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20 sm:mb-28">
          
          {/* Left Column: Huge Institutional Statement */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <span className="font-mono text-xs font-bold text-[#111111] uppercase tracking-wider block mb-2">
              06 / ADVANTAGE
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-[#111111] uppercase tracking-tight leading-[0.92]">
              MORE THAN
              <br />
              A COMMUNITY
            </h2>
            <p className="mt-6 text-sm sm:text-base text-[#555555] font-sans leading-relaxed">
              We operate as an applied research guild. Everything we do is structured around empirical rigor, production execution, and direct career mobility.
            </p>

            <div className="mt-8 pt-6 border-t border-[#ECECE8] font-mono text-xs text-[#707070] space-y-1">
              <div>FOUNDATION: APPLIED RESEARCH</div>
              <div>LOCATION: ADAMAS UNIVERSITY</div>
              <div>VERIFICATION: SOET CHARTERED</div>
            </div>
          </div>

          {/* Right Column: 4 Research Credentials (Not SaaS feature cards) */}
          <div className="lg:col-span-8 border-t border-[#DCDCD8]">
            {CREDENTIALS.map((item) => (
              <div
                key={item.num}
                className="py-10 sm:py-12 border-b border-[#DCDCD8] first:pt-0"
              >
                <div className="font-mono text-[10px] text-[#707070] uppercase tracking-wider mb-2">
                  CREDENTIAL // {item.num}
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111111] uppercase tracking-tight leading-tight">
                  {item.title}
                </h3>

                <p className="mt-4 font-heading font-semibold text-base sm:text-lg text-[#111111] leading-snug">
                  {item.statement}
                </p>

                <p className="mt-3 font-sans text-sm text-[#555555] leading-relaxed max-w-2xl">
                  {item.detail}
                </p>

                <div className="mt-5 pt-3 border-t border-[#ECECE8] font-mono text-[11px] text-[#707070]">
                  {item.spec}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Official Adamas University Chapter Charter Seal Plate */}
        <div 
          className="border border-[#DCDCD8] bg-[#FAFAF8] p-8 sm:p-12 relative"
          style={{ boxShadow: '4px 6px 0 rgba(0,0,0,0.04)' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Technical Emblem Stamp */}
            <div className="lg:col-span-4 flex items-center gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 border-2 border-[#111111] flex flex-col items-center justify-center p-1 text-center font-mono relative bg-[#FFFFFF]">
                <div className="border border-[#111111] w-full h-full flex flex-col items-center justify-center p-1">
                  <span className="text-[8px] tracking-widest text-[#707070]">ADAMAS</span>
                  <span className="font-black text-xs text-[#111111]">SOET</span>
                  <span className="text-[7px] text-[#707070]">CHAPTER</span>
                </div>
                {/* 4 Corner tick marks */}
                <span className="absolute -top-1 -left-1 text-[8px] text-[#111111]">┌</span>
                <span className="absolute -top-1 -right-1 text-[8px] text-[#111111]">┐</span>
                <span className="absolute -bottom-1 -left-1 text-[8px] text-[#111111]">└</span>
                <span className="absolute -bottom-1 -right-1 text-[8px] text-[#111111]">┘</span>
              </div>

              <div>
                <div className="font-heading font-black text-base text-[#111111] tracking-tight uppercase">
                  ACADEMIC CHARTER
                </div>
                <div className="font-mono text-xs text-[#555555] mt-0.5">
                  School of Engineering & Technology
                </div>
                <div className="font-mono text-[10px] text-[#707070] mt-0.5">
                  Adamas University • Kolkata, West Bengal
                </div>
              </div>
            </div>

            {/* Right: Charter Metadata */}
            <div className="lg:col-span-8 lg:border-l lg:border-[#DCDCD8] lg:pl-10 font-mono text-xs text-[#555555] space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[#111111] font-bold">
                <span>CHAPTER SPECIFICATION: FT-SOET-2026</span>
                <span className="text-[#059669] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
                  OFFICIALLY RECOGNIZED CHAPTER
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#707070]">
                FITECH operates under institutional academic sanction to foster quantitative finance, low-latency software engineering, and decentralized systems innovation.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
