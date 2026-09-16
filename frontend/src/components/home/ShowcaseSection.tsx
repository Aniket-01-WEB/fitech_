'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface LabProject {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  domain: string;
  tags: string[];
  metric1Label: string;
  metric1Val: string;
  metric2Label: string;
  metric2Val: string;
  metric3Label: string;
  metric3Val: string;
  description: string;
  architecture: string;
  image: string;
}

const PROJECTS: LabProject[] = [
  {
    id: 'nexus-l2',
    num: '01',
    title: 'Nexus L2 Matching Engine',
    subtitle: 'Ultra-Low Latency Order Book Core',
    domain: 'Quantitative Systems & Execution',
    tags: ['C++20', 'DPDK', 'Lock-Free SPSC', 'AVX-512'],
    metric1Label: 'ROUND-TRIP LATENCY',
    metric1Val: '< 820ns',
    metric2Label: 'THROUGHPUT',
    metric2Val: '4.2M ops/sec',
    metric3Label: 'DETERMINISM',
    metric3Val: '99.999%',
    description:
      'Standard exchange matching architectures suffer from non-deterministic operating system interrupts and cache pollution under high-frequency tick bursts. Nexus L2 solves this with single-producer single-consumer ring buffers and memory-mapped kernel bypass.',
    architecture:
      'Engineered in strict C++20 with 64-byte cache-line alignment to eliminate false sharing, memory-mapped kernel bypass DPDK networking, and AVX-512 SIMD price-level scanning.',
    image: '/images/event-summit.jpg',
  },
  {
    id: 'volatility-engine',
    num: '02',
    title: 'Neural Volatility Smile Engine',
    subtitle: 'Cross-Asset Stochastic Volatility Calibration',
    domain: 'Mathematical & Quantitative Finance',
    tags: ['PyTorch', 'SVI Surfaces', 'Monte Carlo', 'CUDA'],
    metric1Label: 'SURFACE FIT',
    metric1Val: '99.4% R²',
    metric2Label: 'INFERENCE SPEED',
    metric2Val: '1.8ms',
    metric3Label: 'VAR CONFIDENCE',
    metric3Val: '99% Tail Risk',
    description:
      'Classical Black-Scholes and parametric Gatheral SVI calibration fail to fit extreme market tail risk and option skew regimes during sudden liquidity shocks. This engine applies deep neural operators to calibrate local-stochastic volatility surfaces in real time.',
    architecture:
      'Trained on 10+ years of high-frequency tick options data across multi-asset books. Employs GPU-accelerated Monte Carlo pricing with antithetic variate reduction and quasi-random Sobol sequences.',
    image: '/images/event-summit.jpg',
  },
  {
    id: 'zk-solvency',
    num: '03',
    title: 'Zero-Knowledge Solvency Protocol',
    subtitle: 'Cryptographic Liabilities Attestation',
    domain: 'Decentralized Protocols & Cryptography',
    tags: ['Circom', 'Solidity', 'Groth16', 'BN254 Snark'],
    metric1Label: 'PROOF TIME',
    metric1Val: '1.42s',
    metric2Label: 'CIRCUIT CONSTRAINTS',
    metric2Val: '28.4K R1CS',
    metric3Label: 'VERIFIER GAS',
    metric3Val: '28,400 Gas',
    description:
      'Decentralized protocols and lending vaults currently require blind trust or leak sensitive wallet balances when proving reserve solvency. This protocol provides trustless mathematical verification of total liabilities.',
    architecture:
      'Recursive Groth16 zero-knowledge zk-SNARK circuits over BN254 elliptic curves. Evaluates Merkle sum trees of user balances to mathematically prove Total Reserves >= Total Liabilities without disclosing individual account balances.',
    image: '/images/event-summit.jpg',
  },
];

export default function ShowcaseSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeProject = PROJECTS[activeIdx];

  return (
    <section id="projects" className="relative w-full bg-[#FFFFFF] py-14 md:py-20 lg:py-24 border-b border-[#DADADA]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
        
        {/* Section Marker */}
        <div className="flex items-center justify-between pb-4 mb-8 sm:mb-10 border-b border-[#DADADA] font-mono text-[11px] text-[#6B6B6B] tracking-wider uppercase">
          <span>02 / FLAGSHIP CODEBASES</span>
          <span>APPLIED ENGINEERING ARCHIVE // 2026</span>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#EAEAEA] text-[#0A0A0A] font-mono text-[10px] uppercase tracking-wider inline-block mb-4">
              02 // LAB BUILDS
            </span>
            <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal text-[#0A0A0A] tracking-tight leading-[0.92]">
              Flagship
              <br />
              <span className="italic">Systems.</span>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#4A4A4A] font-sans-body max-w-md leading-relaxed font-light">
            Proprietary matching architectures, stochastic risk calibrators, and cryptographic verifiers engineered by student research fellows.
          </p>
        </div>

        {/* Stanzza-Style Project Switcher Tabs (Rounded Pills) */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-10 sm:mb-14 pb-6 border-b border-[#DADADA]">
          {PROJECTS.map((proj, idx) => {
            const isActive = activeIdx === idx;
            return (
              <button
                key={proj.id}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`stanzza-btn-pill transition-all duration-300 ${
                  isActive
                    ? 'stanzza-btn-dark'
                    : 'stanzza-btn-light'
                }`}
              >
                <span>{proj.num} {"//"}</span>
                <span>{proj.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Project Presentation Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProject.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#F2F2F2] rounded-3xl border border-[#DADADA] p-6 sm:p-10 md:p-14"
            style={{ boxShadow: '0 20px 50px rgba(30,30,30,0.05)' }}
          >
            {/* Top Info Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#DADADA]">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-[#0A0A0A]">
                  SPEC REF: EXP-2026.0{activeIdx + 1}
                </span>
                <span className="text-[#DADADA]">│</span>
                <span className="font-mono text-xs text-[#4A4A4A] uppercase">
                  {activeProject.domain}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {activeProject.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-3 py-1 rounded-full bg-[#EAEAEA] border border-[#DADADA] font-mono text-[10px] text-[#0A0A0A] font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Title & Narrative */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-10">
              <div className="lg:col-span-7">
                <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#0A0A0A] leading-tight mb-4">
                  {activeProject.title}
                </h3>
                <p className="font-sans-body text-base text-[#4A4A4A] leading-relaxed mb-4">
                  {activeProject.description}
                </p>
                <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#DADADA] text-xs font-sans-body text-[#4A4A4A] leading-relaxed">
                  <span className="font-mono font-bold text-[#0A0A0A] block mb-1 uppercase tracking-wider text-[10px]">
                    Technical Implementation:
                  </span>
                  {activeProject.architecture}
                </div>
              </div>

              {/* Specs Cards */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#DADADA]">
                  <span className="font-mono text-[10px] text-[#6B6B6B] uppercase block mb-1">
                    {activeProject.metric1Label}
                  </span>
                  <span className="font-serif text-3xl font-normal text-[#0A0A0A]">
                    {activeProject.metric1Val}
                  </span>
                </div>
                <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#DADADA]">
                  <span className="font-mono text-[10px] text-[#6B6B6B] uppercase block mb-1">
                    {activeProject.metric2Label}
                  </span>
                  <span className="font-serif text-3xl font-normal text-[#0A0A0A]">
                    {activeProject.metric2Val}
                  </span>
                </div>
                <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#DADADA]">
                  <span className="font-mono text-[10px] text-[#6B6B6B] uppercase block mb-1">
                    {activeProject.metric3Label}
                  </span>
                  <span className="font-serif text-3xl font-normal text-[#0A0A0A]">
                    {activeProject.metric3Val}
                  </span>
                </div>
              </div>
            </div>

            {/* Media Aperture & CTA */}
            <div className="relative w-full aspect-[16/7] md:aspect-[21/8] rounded-2xl overflow-hidden border border-[#DADADA] bg-[#0A0A0A]">
              <img
                src={activeProject.image}
                alt={activeProject.title}
                className="w-full h-full object-cover transition-all duration-700"
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-3">
                <Link
                  href="/projects"
                  className="stanzza-btn-pill stanzza-btn-dark text-xs backdrop-blur-md"
                >
                  <span>Explore Full Project</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
