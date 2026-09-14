'use client';

import React from 'react';
import Link from 'next/link';
import { usePortal } from '@/context/PortalContext';

const DOMAIN_TRACKS = [
  { num: '01', name: 'FINTECH', focus: 'Low-Latency Architecture', latency: '< 800ns' },
  { num: '02', name: 'MARKETS', focus: 'Statistical Arbitrage', latency: 'Tick-Level' },
  { num: '03', name: 'AI', focus: 'Time-Series Transformers', latency: 'Inference' },
  { num: '04', name: 'QUANT', focus: 'Stochastic Risk & SVI', latency: '99% VaR' },
  { num: '05', name: 'VENTURE', focus: 'Student Incubator', latency: 'Pre-Seed' },
  { num: '06', name: 'WEB3', focus: 'ZK Proofs & AMMs', latency: 'On-Chain' },
];

export default function HeroSection() {
  const { openJoinModal } = usePortal();

  return (
    <section className="relative w-full bg-[#FFFFFF] pt-32 pb-24 md:pt-44 md:pb-36 lg:pt-52 lg:pb-44 border-b border-[#DCDCD8] overflow-hidden">
      {/* Subtle blueprint grid watermark */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 relative z-10">
        
        {/* Top Technical Metadata Strip - Pushed to Edges */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-14 sm:mb-20 md:mb-24 border-b border-[#ECECE8] font-mono text-[11px] sm:text-xs text-[#555555]">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 bg-[#111111]"></span>
            <span className="font-bold text-[#111111] tracking-wider">FITECH</span>
            <span className="text-[#DCDCD8]">/</span>
            <span className="tracking-wide">TECHNOLOGY × FINANCE</span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[#707070]">
            <span>COORDINATES: 22.72° N, 88.48° E</span>
            <span className="text-[#DCDCD8]">│</span>
            <span>ADAMAS UNIVERSITY RESEARCH CHAPTER</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
            <span className="font-medium text-[#111111] tracking-wide">STATUS: ACTIVE // 2026</span>
          </div>
        </div>

        {/* Central Typographic Composition with Generous Breathing Room */}
        <div className="relative my-6 sm:my-10 lg:my-14">
          
          {/* Layer 0: Subtle Physical Offset Paper Plate behind headline */}
          <div 
            className="absolute -inset-2 sm:-inset-4 md:-inset-6 border border-[#ECECE8] bg-[#FAFAF8] pointer-events-none"
            style={{
              boxShadow: '4px 6px 0 rgba(0,0,0,0.04)'
            }}
          />

          {/* Layer 1: Primary Precision Bounded Frame */}
          <div 
            className="relative bg-[#FFFFFF] border border-[#DCDCD8] p-8 sm:p-14 md:p-20 lg:p-24"
            style={{
              boxShadow: '0 8px 24px rgba(0,0,0,0.04)'
            }}
          >
            {/* Corner Blueprint Registration Marks */}
            <span className="absolute -top-2.5 -left-2.5 font-mono text-xs text-[#999999] select-none">┼</span>
            <span className="absolute -top-2.5 -right-2.5 font-mono text-xs text-[#999999] select-none">┼</span>
            <span className="absolute -bottom-2.5 -left-2.5 font-mono text-xs text-[#999999] select-none">┼</span>
            <span className="absolute -bottom-2.5 -right-2.5 font-mono text-xs text-[#999999] select-none">┼</span>

            {/* Subtle Editorial Marker */}
            <div className="flex items-center justify-between font-mono text-[10px] sm:text-[11px] text-[#707070] uppercase tracking-widest mb-8 sm:mb-12">
              <span className="font-semibold text-[#111111]">FITECH RESEARCH GUILD</span>
              <span>EST. 2024 • RECORD 2026.FT</span>
            </div>

            {/* Dominant Visual Moment: FROM CODE TO CAPITAL. */}
            <div className="mb-10 sm:mb-14">
              <h1 className="font-heading text-[clamp(46px,9.5vw,124px)] font-black text-[#111111] leading-[0.88] tracking-[-0.04em] uppercase">
                FROM CODE
                <br />
                TO
                <br />
                <span className="relative inline-block text-[#111111]">
                  CAPITAL.
                  <span className="absolute left-0 bottom-1 sm:bottom-2 w-full h-[2px] bg-[#111111]" />
                </span>
              </h1>
            </div>

            {/* Desired Hierarchy: A STUDENT-DRIVEN COMMUNITY BUILDING THE FUTURE OF FINANCE */}
            <div className="pt-8 sm:pt-12 border-t border-[#ECECE8] grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-end">
              <div className="lg:col-span-8">
                <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-extrabold text-[#111111] leading-tight tracking-tight uppercase">
                  A STUDENT-DRIVEN COMMUNITY
                  <br className="hidden sm:inline" />
                  BUILDING THE FUTURE OF FINANCE
                </h2>

                <p className="mt-4 font-sans text-sm sm:text-base text-[#555555] leading-relaxed max-w-2xl">
                  We engineer high-throughput order matching engines, research stochastic volatility models, deploy decentralized protocol invariants, and incubate fintech founders at the academic frontier.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3.5 justify-end">
                <button
                  type="button"
                  onClick={openJoinModal}
                  className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#111111] text-[#FFFFFF] font-mono text-xs font-bold uppercase tracking-wider border border-[#111111] shadow-[4px_4px_0px_#707070] hover:shadow-[6px_6px_0px_#111111] hover:-translate-y-0.5 active:translate-y-0.5 transition-all text-center"
                >
                  <span>[ JOIN US ]</span>
                  <span>→</span>
                </button>

                <a
                  href="#domains"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#FFFFFF] text-[#111111] font-mono text-xs font-semibold tracking-wider uppercase border border-[#DCDCD8] hover:border-[#111111] hover:bg-[#FAFAF8] transition-all text-center"
                >
                  <span>RESEARCH TRACKS</span>
                  <span className="text-[#707070]">↓</span>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* HERO DATA DETAILS: Clean 6-Track Engineering Documentation Strip */}
        <div className="mt-14 sm:mt-20 pt-8 border-t border-[#ECECE8]">
          <div className="flex items-center justify-between pb-3 mb-4 font-mono text-[11px] text-[#707070] uppercase tracking-wider">
            <span>OPERATIONAL TAXONOMY</span>
            <span>06 CORE DISCIPLINES</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border-t border-l border-[#DCDCD8] bg-[#FFFFFF]">
            {DOMAIN_TRACKS.map((track) => (
              <div
                key={track.num}
                className="border-r border-b border-[#DCDCD8] p-4 sm:p-5 hover:bg-[#FAFAF8] transition-colors group"
              >
                <div className="font-mono text-[10px] text-[#707070] mb-1">
                  {track.num} / TRACK
                </div>
                <div className="font-heading font-black text-sm text-[#111111] tracking-tight group-hover:underline">
                  {track.name}
                </div>
                <div className="font-sans text-[11px] text-[#555555] mt-1.5 leading-snug">
                  {track.focus}
                </div>
                <div className="mt-3 pt-2 border-t border-[#ECECE8] font-mono text-[10px] text-[#111111] font-semibold">
                  {track.latency}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
