'use client';

import React from 'react';

const STATS = [
  { num: '06', label: 'Operational Domains', detail: 'Covering HFT C++, AI time-series, derivatives SVI, and decentralized protocols.' },
  { num: '450+', label: 'Guild Builders', detail: 'Active student researchers, engineers, and faculty advisors at Adamas University.' },
  { num: '12+', label: 'Production Builds', detail: 'Open-source and audited repositories deployed to public testnets and research archives.' },
  { num: '₹15M+', label: 'Simulated Volume', detail: 'Order-flow backtested and live paper-traded through empirical microstructure pipelines.' },
];

const ADVANTAGES = [
  {
    num: '01',
    title: 'Institutional Quant Codebases',
    statement: 'Production-grade C++ matching engines, lock-free ring buffers, and Solidity audit frameworks.',
    detail: 'Members build, benchmark, and deploy real quantitative software using industry-grade development workflows rather than theoretical toy models.',
  },
  {
    num: '02',
    title: 'High-Frequency Data Feeds',
    statement: 'Nanosecond Level 2 order book ticks, market feeds, and dedicated GPU compute credits.',
    detail: 'Direct access to institutional tick historical archives and compute clusters for empirical market microstructure research.',
  },
  {
    num: '03',
    title: 'Industry Referral Pipeline',
    statement: 'Direct technical mentorship and referral pipeline to leading algorithmic trading desks and venture labs.',
    detail: 'Alumni practitioners and guest quants review student codebases and provide direct pathways into elite tech roles.',
  },
  {
    num: '04',
    title: 'National Hackathon Incubation',
    statement: 'End-to-end technical incubation from initial mathematical formulation to live deployment.',
    detail: 'Multi-championship track record across national Web3 and fintech hackathons with institutional support.',
  },
];

export default function CommunitiesSection() {
  return (
    <section id="communities" className="relative w-full bg-[#FFFFFF] py-24 md:py-36 lg:py-44 border-b border-[#DADADA]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
        
        {/* Section Marker */}
        <div className="flex items-center justify-between pb-4 mb-14 sm:mb-20 border-b border-[#DADADA] font-mono text-[11px] text-[#6B6B6B] tracking-wider uppercase">
          <span>03 / CONTROLLED ENGINEERING</span>
          <span>EMPIRICAL PERFORMANCE RECORD // 2026</span>
        </div>

        {/* Section Heading (Stanzza Style) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-16 sm:mb-24 items-end">
          <div className="lg:col-span-6">
            <span className="px-3.5 py-1 rounded-full bg-[#EAEAEA] text-[#0A0A0A] font-mono text-[10px] uppercase tracking-wider inline-block mb-4 font-semibold">
              03 // ADVANTAGE
            </span>
            <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal text-[#0A0A0A] tracking-tight leading-[0.92]">
              Controlled
              <br />
              <span className="italic">Delivery.</span>
            </h2>
          </div>
          <div className="lg:col-span-6">
            <p className="text-base sm:text-lg text-[#4A4A4A] font-sans-body leading-relaxed font-light">
              We operate as an applied research guild. Everything we do is structured around empirical rigor, production execution, and direct technical career mobility into quantitative finance and high-throughput engineering.
            </p>
          </div>
        </div>

        {/* 4 Large Editorial Stat Cards (100% VISIBLE) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 sm:mb-28">
          {STATS.map((stat, idx) => (
            <div
              key={idx}
              className="bg-[#F2F2F2] rounded-3xl p-8 border border-[#DADADA] hover:border-[#0A0A0A] transition-all duration-300 group"
              style={{ boxShadow: '0 8px 24px rgba(30,30,30,0.03)' }}
            >
              <span className="font-serif text-6xl sm:text-7xl font-normal text-[#0A0A0A] block mb-4 group-hover:translate-x-1 transition-transform">
                {stat.num}
              </span>
              <h4 className="font-sans-body font-semibold text-sm text-[#0A0A0A] mb-2 uppercase tracking-wide">
                {stat.label}
              </h4>
              <p className="font-sans-body text-xs text-[#4A4A4A] leading-relaxed font-light">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>

        {/* 4 Pillars Grid (100% VISIBLE) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {ADVANTAGES.map((adv, idx) => (
            <div
              key={idx}
              className="bg-[#FFFFFF] rounded-3xl p-8 sm:p-10 border border-[#DADADA] hover:bg-[#F2F2F2] transition-all duration-300"
            >
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#DADADA] font-mono text-xs text-[#6B6B6B]">
                <span className="font-bold text-[#0A0A0A]">{adv.num} {"//"} PILLAR</span>
                <span>VERIFIED</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#0A0A0A] mb-3">
                {adv.title}
              </h3>
              <p className="font-sans-body text-sm text-[#0A0A0A] font-medium leading-relaxed mb-3">
                {adv.statement}
              </p>
              <p className="font-sans-body text-xs sm:text-sm text-[#4A4A4A] leading-relaxed font-light">
                {adv.detail}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
