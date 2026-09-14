'use client';

import React from 'react';
import { usePortal } from '@/context/PortalContext';

export default function CtaSection() {
  const { openJoinModal } = usePortal();

  return (
    <section className="relative w-full bg-[#FFFFFF] py-24 md:py-36 lg:py-44 border-b border-[#DCDCD8] overflow-hidden">
      {/* Subtle blueprint grid watermark */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 relative z-10">
        
        {/* Layered Physical Framing with 2nd Offset Border for Tactile Depth */}
        <div className="relative">
          
          {/* Layer 0: Second Offset Paper Border */}
          <div 
            className="absolute -inset-2 sm:-inset-4 border border-[#DCDCD8] bg-[#FAFAF8] pointer-events-none"
            style={{
              boxShadow: '6px 8px 0 rgba(0,0,0,0.06)'
            }}
          />

          {/* Layer 1: Primary Precision Bounded Frame */}
          <div className="relative bg-[#FFFFFF] border-2 border-[#111111] p-10 sm:p-16 md:p-24 lg:p-28 text-center">
            
            {/* Registration Corner Marks */}
            <span className="absolute top-2.5 left-2.5 font-mono text-xs text-[#111111] select-none">┼</span>
            <span className="absolute top-2.5 right-2.5 font-mono text-xs text-[#111111] select-none">┼</span>
            <span className="absolute bottom-2.5 left-2.5 font-mono text-xs text-[#111111] select-none">┼</span>
            <span className="absolute bottom-2.5 right-2.5 font-mono text-xs text-[#111111] select-none">┼</span>

            {/* Top Micro-Header */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F1F2F0] border border-[#DCDCD8] font-mono text-[11px] text-[#111111] font-semibold uppercase tracking-wider mb-8 sm:mb-12">
              <span className="w-1.5 h-1.5 bg-[#059669] rounded-full"></span>
              <span>ANNUAL RECRUITMENT INTAKE // 2026</span>
            </div>

            {/* Huge Powerful Typography */}
            <h2 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[#111111] uppercase tracking-[-0.03em] leading-[0.92] max-w-5xl mx-auto">
              READY TO BUILD
              <br />
              <span className="underline decoration-2 underline-offset-8 decoration-[#DCDCD8]">
                WHAT COMES NEXT?
              </span>
            </h2>

            {/* Small Supporting Line */}
            <p className="mt-8 sm:mt-10 max-w-2xl mx-auto font-sans text-base sm:text-lg text-[#555555] leading-relaxed">
              Learn, build, and deploy real quantitative software at the intersection of computer systems and institutional financial markets.
            </p>

            {/* Tactile Pressed Button */}
            <div className="mt-10 sm:mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={openJoinModal}
                className="w-full sm:w-auto px-12 py-5 bg-[#111111] text-[#FFFFFF] font-mono text-sm font-bold tracking-wider uppercase border border-[#111111] shadow-[4px_4px_0px_#707070] hover:shadow-[6px_6px_0px_#111111] hover:-translate-y-0.5 active:translate-y-0.5 transition-all inline-flex items-center justify-center gap-3"
              >
                <span>[ JOIN FITECH → ]</span>
              </button>
            </div>

            {/* Specification Footnote */}
            <div className="mt-14 pt-8 border-t border-[#ECECE8] flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#707070]">
              <div className="flex items-center gap-3">
                <span>TRACKS: QUANT DEVELOPER</span>
                <span className="text-[#DCDCD8]">│</span>
                <span>DEFI RESEARCHER</span>
                <span className="text-[#DCDCD8]">│</span>
                <span>AI / RISK FELLOW</span>
              </div>
              <div>
                <span>NO PRIOR INSTITUTIONAL EXPERIENCE REQUIRED</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
