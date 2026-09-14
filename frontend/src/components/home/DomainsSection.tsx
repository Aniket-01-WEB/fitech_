'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const DOMAINS_INDEX = [
  {
    num: '01',
    code: 'FA-01',
    title: 'FINTECH ARCHITECTURE & INFRASTRUCTURE',
    category: 'SYSTEMS & EXECUTION',
    desc: 'Sub-microsecond order matching engines, lock-free ring buffers, kernel-bypass DPDK networking, and distributed financial exchange backbones.',
    metric: '< 800ns LATENCY',
    tags: ['C++20', 'DPDK', 'FPGA', 'Lock-Free', 'L2 Order Books'],
  },
  {
    num: '02',
    code: 'MQ-02',
    title: 'MARKETS & QUANTITATIVE INVESTMENT',
    category: 'ALGORITHMIC STRATEGY',
    desc: 'Microstructure tick-level signal generation, statistical arbitrage, order flow toxicity (VPIN), mean-reversion, and momentum execution.',
    metric: 'NANOSECOND TICKS',
    tags: ['Python', 'NumPy', 'Level 2 Tick Data', 'Stat-Arb', 'Backtesting'],
  },
  {
    num: '03',
    code: 'AI-03',
    title: 'AI & DATA SCIENCE IN FINANCE',
    category: 'INTELLIGENCE ENGINES',
    desc: 'Transformer architectures for multi-asset regime forecasting, NLP extraction from SEC filings and earnings transcripts, and neural credit evaluation.',
    metric: 'TRANSFORMERS',
    tags: ['PyTorch', 'Transformers', 'Financial NLP', 'Risk AI', 'CUDA'],
  },
  {
    num: '04',
    code: 'QR-04',
    title: 'QUANTITATIVE RESEARCH & INNOVATION',
    category: 'STOCHASTIC ANALYSIS',
    desc: 'Stochastic volatility modeling (Heston, SVI), Monte Carlo derivatives pricing, Extreme Value Theory (EVT), and institutional portfolio stress testing.',
    metric: '99% 1-DAY VaR',
    tags: ['R', 'Monte Carlo', 'Option Greeks', 'SVI Surfaces', 'VaR'],
  },
  {
    num: '05',
    code: 'VE-05',
    title: 'VENTURE CAPITAL & ENTREPRENEURSHIP',
    category: 'INCUBATION & ANGEL SYNDICATES',
    desc: 'Incubating student fintech founders, building prototype financial APIs, stress-testing unit economics, and preparing institutional pitch decks.',
    metric: 'STUDENT INCUBATOR',
    tags: ['Startups', 'Pitching', 'Tokenomics', 'FinTech Sandbox', 'MVPs'],
  },
  {
    num: '06',
    code: 'BC-06',
    title: 'BLOCKCHAIN & DECENTRALIZED WEB3',
    category: 'DECENTRALIZED PROTOCOLS',
    desc: 'Automated market maker (AMM) concentrated liquidity mechanics, zero-knowledge solvency proofs, MEV arbitrage searchers, and smart contract audits.',
    metric: 'ON-CHAIN ZK',
    tags: ['Solidity', 'Rust', 'zk-SNARKs', 'EVM', 'AMM Invariants'],
  },
];

export default function DomainsSection() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <section id="domains" className="relative w-full bg-[#FFFFFF] py-24 md:py-36 lg:py-44 border-b border-[#DCDCD8]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
        
        {/* Section Index Marker */}
        <div className="flex items-center justify-between pb-4 mb-14 sm:mb-20 border-b border-[#DCDCD8] font-mono text-[11px] text-[#707070] tracking-wider uppercase">
          <span>[ SECTION 02 // FINANCIAL INDEX & OPERATIONAL DISCIPLINES ]</span>
          <span>CURRICULUM ARCHIVE // 01—06</span>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 sm:mb-20">
          <div>
            <span className="font-mono text-xs font-bold text-[#111111] uppercase tracking-wider block mb-2">
              02 / CURRICULUM
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-[#111111] uppercase tracking-tight leading-none">
              OUR DOMAINS
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#555555] max-w-xl font-sans leading-relaxed">
              Six operational divisions bridging theoretical mathematics, low-latency computer systems, and financial market mechanics.
            </p>
          </div>

          <Link
            href="/domain"
            className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#111111] border-b-2 border-[#111111] pb-1 hover:text-[#555555] hover:border-[#555555] transition-all shrink-0 uppercase tracking-wider"
          >
            <span>FULL SPECIFICATION DIRECTORY</span>
            <span>→</span>
          </Link>
        </div>

        {/* Structured Financial Index - Technical Research Archive Rows */}
        <div className="border-t border-[#DCDCD8]">
          {DOMAINS_INDEX.map((domain, index) => {
            const isHovered = hoveredIdx === index;

            return (
              <div
                key={domain.num}
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`group relative border-b border-[#DCDCD8] py-8 sm:py-10 md:py-12 transition-all duration-200 cursor-pointer ${
                  isHovered ? 'translate-x-2 bg-[#FAFAF8] pl-4 sm:pl-6 -mr-2 sm:-mr-4' : 'bg-transparent'
                }`}
              >
                {/* Active Accent Indicator Dot */}
                <div
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#111111] transition-opacity duration-200 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start">
                  
                  {/* Column 1: Index Number & Code */}
                  <div className="lg:col-span-1 font-mono text-sm sm:text-base font-bold text-[#111111] flex lg:flex-col items-center lg:items-start gap-2">
                    <span>{domain.num}</span>
                    <span className="text-[10px] text-[#707070] lg:block">/{domain.code}</span>
                  </div>

                  {/* Column 2: Title & Category */}
                  <div className="lg:col-span-4">
                    <div className="font-mono text-[10px] text-[#707070] tracking-wider uppercase mb-1">
                      {domain.category}
                    </div>
                    <h3 className="font-heading text-xl sm:text-2xl font-black text-[#111111] tracking-tight leading-tight uppercase group-hover:text-[#111111]">
                      {domain.title}
                    </h3>

                    {/* Micro Tag Pills */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {domain.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 bg-[#F1F2F0] border border-[#ECECE8] font-mono text-[10px] text-[#555555]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Column 3: Description */}
                  <div className="lg:col-span-5 text-sm sm:text-base text-[#555555] font-sans leading-relaxed pt-1">
                    <p className={`transition-colors ${isHovered ? 'text-[#111111]' : 'text-[#555555]'}`}>
                      {domain.desc}
                    </p>
                  </div>

                  {/* Column 4: Micro Metric & Inspect Link */}
                  <div className="lg:col-span-2 flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-2 pt-2 lg:pt-0">
                    <span className="font-mono text-[11px] font-bold text-[#111111] px-2.5 py-1 bg-[#F1F2F0] border border-[#DCDCD8]">
                      {domain.metric}
                    </span>
                    <Link
                      href="/domain"
                      className="font-mono text-xs font-bold text-[#111111] inline-flex items-center gap-1.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                    >
                      <span>INSPECT</span>
                      <span>→</span>
                    </Link>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
