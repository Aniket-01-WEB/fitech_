'use client';

import React from 'react';
import Link from 'next/link';

export default function GallerySection() {
  return (
    <section id="gallery" className="relative w-full bg-[#F7F7F5] py-24 md:py-36 lg:py-44 border-b border-[#DCDCD8]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
        
        {/* Section Index Marker */}
        <div className="flex items-center justify-between pb-4 mb-14 sm:mb-20 border-b border-[#DCDCD8] font-mono text-[11px] text-[#707070] tracking-wider uppercase">
          <span>[ SECTION 07 // FIELD NOTES & PHOTOGRAPHIC ARCHIVE ]</span>
          <span>CONTACT SHEET // 2026</span>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-20">
          <div>
            <span className="font-mono text-xs font-bold text-[#111111] uppercase tracking-wider block mb-2">
              07 / ARCHIVE
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-[#111111] uppercase tracking-tight leading-none">
              MOMENTS THAT
              <br />
              MATTER
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#555555] font-sans max-w-md leading-relaxed">
            Archival photographic documentation of our summits, algorithmic coding sessions, hackathons, and student guild ecosystem.
          </p>
        </div>

        {/* DOMINANT PHOTOGRAPHY: Asymmetric Contact Sheet Layout */}
        <div className="space-y-10 sm:space-y-12">
          
          {/* Large Dominant Image: Flagship Summit */}
          <div 
            className="relative bg-[#FFFFFF] border border-[#DCDCD8] p-4 sm:p-6 md:p-8"
            style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}
          >
            {/* Corner Crop Marks */}
            <span className="absolute top-2 left-2 font-mono text-xs text-[#999999] select-none">┼</span>
            <span className="absolute top-2 right-2 font-mono text-xs text-[#999999] select-none">┼</span>
            <span className="absolute bottom-2 left-2 font-mono text-xs text-[#999999] select-none">┼</span>
            <span className="absolute bottom-2 right-2 font-mono text-xs text-[#999999] select-none">┼</span>

            {/* Negative Exposure Metadata Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] sm:text-[11px] text-[#707070] pb-3 mb-4 border-b border-[#ECECE8]">
              <div className="flex items-center gap-3">
                <span className="font-bold text-[#111111]">PLATE 01 // EXPOSURE 12</span>
                <span className="text-[#DCDCD8]">│</span>
                <span>ISO 800 • 35MM FOCAL • 1/250s</span>
              </div>
              <div>DATE: MARCH 2026 • ARCHIVE REF: FT-PH-01</div>
            </div>

            {/* Large Photographic Frame */}
            <div className="relative w-full aspect-[16/8.5] sm:aspect-[16/7.5] bg-[#111111] overflow-hidden border border-[#DCDCD8]">
              <img
                src="/images/event-summit.jpg"
                alt="FinTech & Quantitative Research Summit"
                className="w-full h-full object-cover grayscale contrast-120 hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute bottom-3 right-3 px-3 py-1 bg-[#111111]/85 text-[#FFFFFF] font-mono text-[10px] tracking-wider uppercase backdrop-blur-sm">
                ADAMAS AUDITORIUM
              </div>
            </div>

            {/* Caption Strip */}
            <div className="mt-5 pt-4 border-t border-[#ECECE8] flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h3 className="font-heading font-black text-xl sm:text-2xl text-[#111111] uppercase tracking-tight">
                  Flagship FinTech & Quantitative Research Summit
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm text-[#555555] font-sans max-w-3xl leading-relaxed">
                  Keynote address on limit order book microstructures, automated market maker invariants, and zero-knowledge solvency verification at Adamas University.
                </p>
              </div>
              <div className="font-mono text-xs text-[#707070] shrink-0 text-left sm:text-right">
                <span>COORDINATES: 22.72° N, 88.48° E</span>
              </div>
            </div>
          </div>

          {/* Secondary 2-Column Archival Plates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
            
            {/* Plate 02 */}
            <div 
              className="relative bg-[#FFFFFF] border border-[#DCDCD8] p-4 sm:p-6"
              style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}
            >
              {/* Corner Marks */}
              <span className="absolute top-1.5 left-1.5 font-mono text-[10px] text-[#999999] select-none">┼</span>
              <span className="absolute top-1.5 right-1.5 font-mono text-[10px] text-[#999999] select-none">┼</span>

              <div className="flex items-center justify-between font-mono text-[10px] text-[#707070] pb-2 mb-3 border-b border-[#ECECE8]">
                <span className="font-bold text-[#111111]">PLATE 02 // LAB SESSION</span>
                <span>JANUARY 2026</span>
              </div>

              <div className="relative w-full aspect-[16/10] bg-[#18181B] border border-[#DCDCD8] flex flex-col items-center justify-center p-6 text-center text-[#FFFFFF] overflow-hidden">
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: 'linear-gradient(to right, #FFF 1px, transparent 1px), linear-gradient(to bottom, #FFF 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />
                <span className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-widest mb-1">
                  COMPUTATIONAL FINANCE LAB 402
                </span>
                <span className="font-heading text-lg sm:text-xl font-bold uppercase tracking-tight">
                  Systems & Algorithmic Benchmarks
                </span>
                <span className="font-mono text-[9px] text-[#71717A] mt-2 border border-[#333333] px-2 py-0.5">
                  RING BUFFER TELEMETRY LOGS
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-[#ECECE8]">
                <h4 className="font-heading font-black text-base text-[#111111] uppercase tracking-tight">
                  Order Book Matching Benchmarks
                </h4>
                <p className="mt-1 text-xs text-[#555555] font-sans leading-relaxed">
                  Student fellows benchmarking lock-free single-producer ring buffers under synthetic nano-second tick floods.
                </p>
              </div>
            </div>

            {/* Plate 03 */}
            <div 
              className="relative bg-[#FFFFFF] border border-[#DCDCD8] p-4 sm:p-6"
              style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}
            >
              {/* Corner Marks */}
              <span className="absolute top-1.5 left-1.5 font-mono text-[10px] text-[#999999] select-none">┼</span>
              <span className="absolute top-1.5 right-1.5 font-mono text-[10px] text-[#999999] select-none">┼</span>

              <div className="flex items-center justify-between font-mono text-[10px] text-[#707070] pb-2 mb-3 border-b border-[#ECECE8]">
                <span className="font-bold text-[#111111]">PLATE 03 // INCUBATOR</span>
                <span>FEBRUARY 2026</span>
              </div>

              <div className="relative w-full aspect-[16/10] bg-[#18181B] border border-[#DCDCD8] flex flex-col items-center justify-center p-6 text-center text-[#FFFFFF] overflow-hidden">
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: 'linear-gradient(to right, #FFF 1px, transparent 1px), linear-gradient(to bottom, #FFF 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />
                <span className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-widest mb-1">
                  INNOVATION CELL • SOET
                </span>
                <span className="font-heading text-lg sm:text-xl font-bold uppercase tracking-tight">
                  Student Founders Sandbox
                </span>
                <span className="font-mono text-[9px] text-[#71717A] mt-2 border border-[#333333] px-2 py-0.5">
                  TOKENOMICS DEFENSE & DEMO
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-[#ECECE8]">
                <h4 className="font-heading font-black text-base text-[#111111] uppercase tracking-tight">
                  Fintech Prototype Pitch Sessions
                </h4>
                <p className="mt-1 text-xs text-[#555555] font-sans leading-relaxed">
                  Defending student-built decentralized lending invariants and machine learning credit risk engines.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Full Gallery Navigation */}
        <div className="mt-14 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#FFFFFF] border-2 border-[#111111] font-mono text-xs font-bold text-[#111111] tracking-wider uppercase shadow-[4px_4px_0px_#111111] hover:bg-[#111111] hover:text-[#FFFFFF] transition-all"
          >
            <span>[ VIEW COMPLETE PHOTOGRAPHIC ARCHIVE ]</span>
            <span>→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
