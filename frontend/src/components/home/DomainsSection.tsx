'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const DOMAINS_INDEX = [
  {
    num: '01',
    code: 'FA-01',
    title: 'FinTech Architecture & Infrastructure',
    category: 'Systems & Low-Latency Execution',
    desc: 'Sub-microsecond order matching engines, lock-free ring buffers, kernel-bypass DPDK networking, and distributed financial exchange backbones.',
    metric: '< 800ns Roundtrip',
    tags: ['C++20', 'DPDK', 'FPGA', 'Lock-Free', 'L2 Books'],
    details: 'Covers hardware cache-line optimization, non-blocking queue design, zero-copy packet ingestion, and high-frequency exchange simulation.',
  },
  {
    num: '02',
    code: 'MQ-02',
    title: 'Markets & Quantitative Investment',
    category: 'Algorithmic Strategy & Alpha',
    desc: 'Microstructure tick-level signal generation, statistical arbitrage, order flow toxicity (VPIN), mean-reversion, and momentum execution.',
    metric: 'Tick-Level Alpha',
    tags: ['Python', 'NumPy', 'Tick Data', 'Stat-Arb', 'Backtesting'],
    details: 'Focuses on cross-sectional equity strategies, cointegration trading pairs, order book imbalance metrics, and slippage modeling.',
  },
  {
    num: '03',
    code: 'AI-03',
    title: 'AI & Machine Learning in Finance',
    category: 'Time-Series & Neural Engines',
    desc: 'Transformer architectures for multi-asset regime forecasting, NLP extraction from SEC filings and earnings transcripts, and neural credit evaluation.',
    metric: 'Time-Series Attention',
    tags: ['PyTorch', 'Transformers', 'Financial NLP', 'Risk AI', 'CUDA'],
    details: 'Deploys temporal attention networks to capture long-range volatility dependencies, textual sentiment extraction, and synthetic data generation.',
  },
  {
    num: '04',
    code: 'QR-04',
    title: 'Quantitative Research & Derivatives',
    category: 'Stochastic Analysis & SVI',
    desc: 'Stochastic volatility modeling (Heston, SVI), Monte Carlo derivatives pricing, Extreme Value Theory (EVT), and institutional portfolio stress testing.',
    metric: '99% 1-Day VaR',
    tags: ['R', 'Monte Carlo', 'Option Greeks', 'SVI Surfaces', 'VaR'],
    details: 'Calibrates implied volatility smiles across equity and crypto options, computing empirical value-at-risk and conditional tail expectations.',
  },
  {
    num: '05',
    code: 'VE-05',
    title: 'Venture Capital & Entrepreneurship',
    category: 'Incubation & Angel Syndicates',
    desc: 'Incubating student fintech founders, building prototype financial APIs, stress-testing unit economics, and preparing institutional pitch decks.',
    metric: 'Student Incubator',
    tags: ['Startups', 'Pitching', 'Tokenomics', 'FinTech Sandbox', 'MVPs'],
    details: 'Mentors student founders through technical feasibility reviews, regulatory compliance roadmaps, and venture angel syndicate presentations.',
  },
  {
    num: '06',
    code: 'BC-06',
    title: 'Decentralized Finance & Web3',
    category: 'Decentralized Protocols & ZK',
    desc: 'Automated market maker (AMM) concentrated liquidity mechanics, zero-knowledge solvency proofs, MEV arbitrage searchers, and smart contract audits.',
    metric: 'On-Chain Invariants',
    tags: ['Solidity', 'Rust', 'zk-SNARKs', 'EVM', 'AMM Invariants'],
    details: 'Implements constant product and concentrated liquidity invariants, Groth16 circuit verifiers, and searcher bots for decentralized venues.',
  },
];

export default function DomainsSection() {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const selectedDomain = DOMAINS_INDEX[activeIdx];

  return (
    <section id="domains" className="relative w-full bg-[#FFFBF5] py-24 md:py-36 lg:py-44 border-b border-[#D8D6CB]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
        
        {/* Section Marker */}
        <div className="flex items-center justify-between pb-4 mb-14 sm:mb-20 border-b border-[#D8D6CB] font-mono text-[11px] text-[#707070] tracking-wider uppercase">
          <span>04 / ARCHITECTURAL THINKING</span>
          <span>CURRICULUM ARCHIVE // 01—06</span>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 sm:mb-20">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#E5E4DC] text-[#1E1E1E] font-mono text-[10px] uppercase tracking-wider inline-block mb-4">
              04 // DISCIPLINES
            </span>
            <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal text-[#1E1E1E] tracking-tight leading-[0.92]">
              Operational
              <br />
              <span className="italic">Disciplines.</span>
            </h2>
          </div>

          <Link
            href="/domain"
            className="stanzza-btn-pill stanzza-btn-light"
          >
            <span>Full Syllabus Directory</span>
            <span>→</span>
          </Link>
        </div>

        {/* 2-Column Stanzza Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Sticky Left Column: Detailed Active Spec */}
          <div className="lg:col-span-5 lg:sticky lg:top-36 bg-[#F4F3EB] rounded-3xl border border-[#D8D6CB] p-8 sm:p-10" style={{ boxShadow: '0 12px 32px rgba(30,30,30,0.04)' }}>
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#D8D6CB] font-mono text-xs text-[#707070]">
              <span className="font-bold text-[#1E1E1E]">DISCIPLINE SPEC</span>
              <span>{selectedDomain.code}</span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl font-normal text-[#1E1E1E] leading-tight mb-3">
              {selectedDomain.title}
            </h3>

            <div className="inline-block px-3 py-1 rounded-full bg-[#E5E4DC] text-[#1E1E1E] font-mono text-[10px] uppercase font-semibold mb-4">
              Benchmark: {selectedDomain.metric}
            </div>

            <p className="font-sans-body text-sm text-[#5F5F5F] leading-relaxed mb-6 font-light">
              {selectedDomain.details}
            </p>

            <div className="pt-4 border-t border-[#D8D6CB] flex flex-wrap gap-1.5 mb-6">
              {selectedDomain.tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="px-2.5 py-1 rounded-full bg-[#FFFBF5] border border-[#D8D6CB] font-mono text-[10px] text-[#1E1E1E]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-[#D8D6CB] flex items-center justify-between font-mono text-[10px] text-[#707070]">
              <span>SELECT DISCIPLINE</span>
              <span>INDEX: 0{activeIdx + 1}/06</span>
            </div>
          </div>

          {/* Right Column: Sleek Editorial List Rows */}
          <div className="lg:col-span-7 divide-y divide-[#D8D6CB] border-t border-b border-[#D8D6CB]">
            {DOMAINS_INDEX.map((domain, index) => {
              const isCurrent = activeIdx === index;

              return (
                <div
                  key={domain.num}
                  onClick={() => setActiveIdx(index)}
                  className={`group py-7 sm:py-8 px-4 sm:px-6 rounded-2xl transition-all duration-300 cursor-pointer ${
                    isCurrent
                      ? 'bg-[#F4F3EB] border-l-4 border-l-[#1E1E1E]'
                      : 'hover:bg-[#F4F3EB]/60'
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-4 mb-2">
                    <span className="font-mono text-xs font-bold text-[#707070]">
                      {domain.num} {"//"}
                    </span>
                    <span className="font-mono text-[10px] uppercase text-[#707070]">
                      {domain.category}
                    </span>
                  </div>

                  <h4 className="font-serif text-2xl sm:text-3xl font-normal text-[#1E1E1E] group-hover:underline">
                    {domain.title}
                  </h4>

                  <p className="mt-2 font-sans-body text-xs sm:text-sm text-[#5F5F5F] leading-relaxed line-clamp-2 font-light">
                    {domain.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
