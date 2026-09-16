'use client';

import React from 'react';

const COMPOSITION_CARDS = [
  {
    num: '01',
    title: 'High-Frequency Systems Lab',
    tag: 'Low-Latency C++',
    image: '/images/event-summit.jpg',
    caption: 'Lock-free single-producer single-consumer ring buffers benchmarked under tick bursts.',
    offset: 'md:translate-y-0',
  },
  {
    num: '02',
    title: 'Quantitative Research Keynote',
    tag: 'Symposia & Keynotes',
    image: '/images/team/aniket.jpeg',
    caption: 'Student fellows presenting stochastic volatility and arbitrage pipelines to university faculty.',
    offset: 'md:translate-y-8',
  },
  {
    num: '03',
    title: 'Financial Machine Learning',
    tag: 'Time-Series AI',
    image: '/images/team/pritesh.jpeg',
    caption: 'Temporal fusion transformers and deep feature extraction from raw order book dynamics.',
    offset: 'md:-translate-y-4',
  },
  {
    num: '04',
    title: 'Decentralized Protocol Deployments',
    tag: 'Zero-Knowledge',
    image: '/images/team/souvik.jpeg',
    caption: 'Groth16 snark circuits and automated market maker invariant verification on testnet.',
    offset: 'md:translate-y-6',
  },
];

export default function AboutSection() {
  return (
    <section 
      id="composition" 
      className="relative w-full bg-[#FFFFFF] py-24 md:py-36 lg:py-44 border-b border-[#DADADA]"
    >
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
        
        {/* Section Marker */}
        <div className="flex items-center justify-between pb-4 mb-14 sm:mb-20 border-b border-[#DADADA] font-mono text-[11px] text-[#6B6B6B] tracking-wider uppercase">
          <span>01 / COMPOSITION & PHILOSOPHY</span>
          <span>CAMPUS GUILD CHARTER // 2026</span>
        </div>

        {/* Major Editorial Layout: Stanzza Composition Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-16 sm:mb-24">
          
          {/* Left Column: Micro Title */}
          <div className="lg:col-span-4">
            <span className="px-3.5 py-1 rounded-full bg-[#EAEAEA] text-[#0A0A0A] font-mono text-[10px] uppercase tracking-wider inline-block mb-4 font-semibold">
              01 // MANDATE
            </span>
            <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal text-[#0A0A0A] tracking-tight leading-[0.92]">
              Composed
              <br />
              <span className="italic">Execution.</span>
            </h2>
            <div className="mt-8 pt-6 border-t border-[#DADADA] font-mono text-xs text-[#4A4A4A] space-y-2">
              <div>INSTITUTION: ADAMAS UNIVERSITY</div>
              <div>DEPARTMENT: SCHOOL OF ENGINEERING (SOET)</div>
              <div>RESEARCH: COMPUTATIONAL FINANCE & SYSTEMS</div>
            </div>
          </div>

          {/* Right Column: Prominent Display Narrative */}
          <div className="lg:col-span-8">
            <div className="space-y-3 mb-10">
              <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#0A0A0A] leading-[1.04] tracking-tight font-normal">
                A guild is a composition.
              </h3>
              <h3 className="font-serif italic text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#0A0A0A]/80 leading-[1.04] tracking-tight font-normal">
                Nothing in rigorous engineering is accidental.
              </h3>
            </div>

            {/* Supporting Explanation - Generous Whitespace */}
            <div className="pt-8 border-t border-[#DADADA] grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 text-[#4A4A4A] font-sans-body text-base leading-relaxed font-light">
              <p>
                In high-calibre engineering, nothing is accidental. Proportion sets the structure, mathematical curiosity sets the velocity, and execution shapes the trajectory. FiTech operates as an applied engineering guild where students design, benchmark, and deploy real financial technology systems.
              </p>
              <p>
                By connecting academic computer science and mathematics with institutional quantitative practices, members gain hands-on proficiency in low-latency C++, decentralized protocol invariants, and automated trading research pipelines.
              </p>
            </div>
          </div>

        </div>

        {/* STANZZA ASYMMETRICAL FLOATING COMPOSITION CARDS (100% VISIBLE & ROBUST) */}
        <div className="my-10 sm:my-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {COMPOSITION_CARDS.map((card, idx) => (
            <div
              key={idx}
              className={`group relative bg-[#F2F2F2] rounded-3xl p-4 border border-[#DADADA] hover:border-[#0A0A0A] transition-all duration-300 ${card.offset}`}
              style={{ boxShadow: '0 12px 32px rgba(30,30,30,0.04)' }}
            >
              <div className="relative w-full aspect-[4/3.8] rounded-2xl overflow-hidden bg-[#0A0A0A] mb-4">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0A0A0A]/80 text-[#FFFFFF] font-mono text-[9px] uppercase tracking-wider backdrop-blur-md">
                  {card.tag}
                </div>
              </div>

              <div className="px-2 pb-2">
                <div className="flex items-center justify-between text-[#6B6B6B] font-mono text-[10px] uppercase mb-1.5">
                  <span>PLATE {card.num}</span>
                  <span>VERIFIED</span>
                </div>
                <h4 className="font-serif text-xl font-normal text-[#0A0A0A] leading-snug mb-2 group-hover:underline">
                  {card.title}
                </h4>
                <p className="font-sans-body text-xs text-[#4A4A4A] leading-relaxed line-clamp-2">
                  {card.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
