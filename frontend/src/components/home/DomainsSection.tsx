'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const DOMAINS_INDEX = [
  {
    num: '01',
    code: 'FA',
    title: 'FinTech Architecture & Infrastructure',
    category: 'Systems & Low-Latency Execution',
    desc: 'Sub-microsecond order matching engines, lock-free ring buffers, kernel-bypass DPDK networking, and distributed financial exchange backbones.',
    metric: '< 800ns Roundtrip',
    tags: ['C++20', 'DPDK', 'FPGA', 'Lock-Free', 'L2 Books'],
    details: 'Covers hardware cache-line optimization, non-blocking queue design, zero-copy packet ingestion, and high-frequency exchange simulation.',
  },
  {
    num: '02',
    code: 'MQ',
    title: 'Markets & Quantitative Investment',
    category: 'Algorithmic Strategy & Alpha',
    desc: 'Microstructure tick-level signal generation, statistical arbitrage, order flow toxicity (VPIN), mean-reversion, and momentum execution.',
    metric: 'Tick-Level Alpha',
    tags: ['Python', 'NumPy', 'Tick Data', 'Stat-Arb', 'Backtesting'],
    details: 'Focuses on cross-sectional equity strategies, cointegration trading pairs, order book imbalance metrics, and slippage modeling.',
  },
  {
    num: '03',
    code: 'AI',
    title: 'AI & Machine Learning in Finance',
    category: 'Time-Series & Neural Engines',
    desc: 'Transformer architectures for multi-asset regime forecasting, NLP extraction from SEC filings and earnings transcripts, and neural credit evaluation.',
    metric: 'Time-Series Attention',
    tags: ['PyTorch', 'Transformers', 'Financial NLP', 'Risk AI', 'CUDA'],
    details: 'Deploys temporal attention networks to capture long-range volatility dependencies, textual sentiment extraction, and synthetic data generation.',
  },
  {
    num: '04',
    code: 'QR',
    title: 'Quantitative Research & Derivatives',
    category: 'Stochastic Analysis & SVI',
    desc: 'Stochastic volatility modeling (Heston, SVI), Monte Carlo derivatives pricing, Extreme Value Theory (EVT), and institutional portfolio stress testing.',
    metric: '99% 1-Day VaR',
    tags: ['R', 'Monte Carlo', 'Option Greeks', 'SVI Surfaces', 'VaR'],
    details: 'Calibrates implied volatility smiles across equity and crypto options, computing empirical value-at-risk and conditional tail expectations.',
  },
  {
    num: '05',
    code: 'VE',
    title: 'Venture Capital & Entrepreneurship',
    category: 'Incubation & Angel Syndicates',
    desc: 'Incubating student fintech founders, building prototype financial APIs, stress-testing unit economics, and preparing institutional pitch decks.',
    metric: 'Student Incubator',
    tags: ['Startups', 'Pitching', 'Tokenomics', 'FinTech Sandbox', 'MVPs'],
    details: 'Mentors student founders through technical feasibility reviews, regulatory compliance roadmaps, and venture angel syndicate presentations.',
  },
  {
    num: '06',
    code: 'BC',
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
    <section id="domains" className="relative w-full bg-[#FFFFFF] py-14 md:py-20 lg:py-24 border-b border-[#DADADA]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
        
        {/* Section Marker */}
        <div className="flex items-center justify-between pb-4 mb-8 sm:mb-10 border-b border-[#DADADA] font-mono text-[11px] text-[#6B6B6B] tracking-wider uppercase">
          <span>ARCHITECTURAL THINKING</span>
          <span>CURRICULUM ARCHIVE</span>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-6 sm:mb-8">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#EAEAEA] text-[#0A0A0A] font-mono text-[10px] uppercase tracking-wider inline-block mb-4">
              DISCIPLINES
            </span>
            <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal text-[#0A0A0A] tracking-tight leading-[0.92]">
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
          <div className="lg:col-span-5 lg:sticky lg:top-36 bg-[#F2F2F2] rounded-3xl border border-[#DADADA] p-8 sm:p-10" style={{ boxShadow: '0 12px 32px rgba(30,30,30,0.04)' }}>
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#DADADA] font-mono text-xs text-[#6B6B6B]">
              <span className="font-bold text-[#0A0A0A]">DISCIPLINE SPEC</span>
              <span>{selectedDomain.code}</span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl font-normal text-[#0A0A0A] leading-tight mb-3">
              {selectedDomain.title}
            </h3>

            <div className="inline-block px-3 py-1 rounded-full bg-[#EAEAEA] text-[#0A0A0A] font-mono text-[10px] uppercase font-semibold mb-4">
              Benchmark: {selectedDomain.metric}
            </div>

            <p className="font-sans-body text-sm text-[#4A4A4A] leading-relaxed mb-6 font-light">
              {selectedDomain.details}
            </p>

            <div className="pt-4 border-t border-[#DADADA] flex flex-wrap gap-1.5 mb-6">
              {selectedDomain.tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="px-2.5 py-1 rounded-full bg-[#FFFFFF] border border-[#DADADA] font-mono text-[10px] text-[#0A0A0A]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-[#DADADA] flex items-center justify-between font-mono text-[10px] text-[#6B6B6B]">
              <span>SELECT DISCIPLINE</span>
            </div>
          </div>

          {/* Right Column: Sleek Editorial List Rows */}
          <div className="lg:col-span-7 divide-y divide-[#DADADA] border-t border-b border-[#DADADA]">
            {DOMAINS_INDEX.map((domain, index) => {
              const isCurrent = activeIdx === index;

              return (
                <div
                  key={domain.num}
                  onClick={() => setActiveIdx(index)}
                  className={`group py-7 sm:py-8 px-4 sm:px-6 rounded-2xl transition-all duration-300 cursor-pointer ${
                    isCurrent
                      ? 'bg-[#F2F2F2] border-l-4 border-l-[#0A0A0A]'
                      : 'hover:bg-[#F2F2F2]/60'
                  }`}
                >
                  <div className="flex items-baseline justify-end gap-4 mb-2">
                    <span className="font-mono text-[10px] uppercase text-[#6B6B6B]">
                      {domain.category}
                    </span>
                  </div>

                  <h4 className="font-serif text-2xl sm:text-3xl font-normal text-[#0A0A0A] group-hover:underline">
                    {domain.title}
                  </h4>

                  <p className="mt-2 font-sans-body text-xs sm:text-sm text-[#4A4A4A] leading-relaxed line-clamp-2 font-light">
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
