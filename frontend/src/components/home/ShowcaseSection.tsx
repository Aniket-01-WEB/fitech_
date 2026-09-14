'use client';

import React from 'react';
import Link from 'next/link';

export default function ShowcaseSection() {
  return (
    <section id="projects" className="relative w-full bg-[#FFFFFF] py-24 md:py-36 lg:py-44 border-b border-[#DCDCD8]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
        
        {/* Section Index Marker */}
        <div className="flex items-center justify-between pb-4 mb-14 sm:mb-20 border-b border-[#DCDCD8] font-mono text-[11px] text-[#707070] tracking-wider uppercase">
          <span>[ SECTION 04 // APPLIED RESEARCH & LAB REPOSITORIES ]</span>
          <span>ENGINEERING ARCHIVE // 2026</span>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-20">
          <div>
            <span className="font-mono text-xs font-bold text-[#111111] uppercase tracking-wider block mb-2">
              04 / CODEBASES
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-[#111111] uppercase tracking-tight leading-none">
              FEATURED
              <br />
              LAB BUILDS
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#555555] font-sans max-w-md leading-relaxed">
            Proprietary execution systems, cryptographic verifiers, and volatility pipelines engineered by student research fellows at Adamas University.
          </p>
        </div>

        {/* ASYMMETRIC ARCHIVE: Large Feature Project First */}
        <div 
          className="relative border-2 border-[#111111] bg-[#FFFFFF] p-8 sm:p-12 md:p-16 mb-12"
          style={{
            boxShadow: '6px 8px 0 rgba(0,0,0,0.08)'
          }}
        >
          {/* Corner Registration Marks */}
          <span className="absolute -top-2.5 -left-2.5 font-mono text-xs text-[#111111] select-none">┼</span>
          <span className="absolute -top-2.5 -right-2.5 font-mono text-xs text-[#111111] select-none">┼</span>
          <span className="absolute -bottom-2.5 -left-2.5 font-mono text-xs text-[#111111] select-none">┼</span>
          <span className="absolute -bottom-2.5 -right-2.5 font-mono text-xs text-[#111111] select-none">┼</span>

          {/* Feature Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-8 border-b border-[#ECECE8] font-mono text-xs">
            <div className="flex items-center gap-2.5">
              <span className="px-2 py-0.5 bg-[#111111] text-[#FFFFFF] font-bold">01 / FLAGSHIP BUILD</span>
              <span className="text-[#707070]">CODE REF: EXP-2026.01</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
              <span className="font-semibold text-[#111111]">IN ACTIVE BENCHMARK</span>
            </div>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            
            {/* Left 7 Columns: Title, Context, Architecture */}
            <div className="lg:col-span-7">
              <h3 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-[#111111] tracking-tight leading-tight uppercase mb-6">
                Nexus L2 Matching Engine
              </h3>

              <div className="space-y-4 font-sans text-sm sm:text-base text-[#555555] leading-relaxed">
                <div>
                  <span className="font-mono text-xs font-bold text-[#111111] block uppercase tracking-wide mb-1">
                    CONTEXT & PROBLEM:
                  </span>
                  <p>
                    Sub-microsecond limit order book matching engine engineered in modern C++20 with lock-free single-producer single-consumer ring buffers, cache-line alignment to eliminate false sharing, and kernel-bypass DPDK networking.
                  </p>
                </div>

                <div className="pt-2">
                  <span className="font-mono text-xs font-bold text-[#111111] block uppercase tracking-wide mb-1">
                    BUILT BY:
                  </span>
                  <p className="text-xs text-[#707070] font-mono">
                    QUANTITATIVE SYSTEMS DIVISION • STUDENT FELLOWS COHORT
                  </p>
                </div>

                <div>
                  <span className="font-mono text-xs font-bold text-[#111111] block uppercase tracking-wide mb-1">
                    GUIDANCE:
                  </span>
                  <p className="text-xs text-[#707070] font-mono">
                    ACADEMIC FACULTY & ALUMNI HIGH-FREQUENCY TRADING PRACTITIONERS
                  </p>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Tech Specs, Benchmarks & Link */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full pt-4 lg:pt-0">
              <div className="border border-[#DCDCD8] bg-[#FAFAF8] p-6 space-y-4 font-mono text-xs mb-8">
                <div className="border-b border-[#ECECE8] pb-2">
                  <span className="text-[10px] text-[#707070] block uppercase">DOMAIN</span>
                  <span className="font-bold text-[#111111]">QUANT SYSTEMS & EXECUTION</span>
                </div>
                <div className="border-b border-[#ECECE8] pb-2">
                  <span className="text-[10px] text-[#707070] block uppercase">TECH STACK</span>
                  <span className="font-bold text-[#111111]">C++20 / DPDK / FPGA / SIMD</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-[#707070] block uppercase">ROUND-TRIP LATENCY</span>
                    <span className="font-bold text-sm text-[#111111]">&lt; 820ns</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#707070] block uppercase">THROUGHPUT</span>
                    <span className="font-bold text-sm text-[#111111]">4.2M ops/sec</span>
                  </div>
                </div>
              </div>

              <Link
                href="/projects"
                className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#111111] text-[#FFFFFF] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#333333] transition-colors shadow-[4px_4px_0px_#707070] text-center"
              >
                <span>[ INSPECT REPOSITORY & BENCHMARK ]</span>
                <span>→</span>
              </Link>
            </div>

          </div>
        </div>

        {/* Supporting Projects: 2-Column Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
          
          {/* Project 02 */}
          <div 
            className="border border-[#DCDCD8] bg-[#FFFFFF] p-8 sm:p-10 flex flex-col justify-between"
            style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}
          >
            <div>
              <div className="flex items-center justify-between font-mono text-xs pb-3 mb-6 border-b border-[#ECECE8]">
                <span className="font-bold text-[#111111]">02 / LAB BUILD</span>
                <span className="text-[#707070]">EXP-2026.02</span>
              </div>

              <h4 className="font-heading text-2xl sm:text-3xl font-black text-[#111111] uppercase tracking-tight mb-4">
                Zero-Knowledge Solvency Protocol
              </h4>

              <div className="space-y-3 font-sans text-sm text-[#555555] leading-relaxed mb-6">
                <p>
                  <strong className="font-mono text-xs text-[#111111] block uppercase">CONTEXT:</strong>
                  Cryptographic proof-of-solvency protocol allowing centralized and decentralized venues to attest liabilities via recursive zk-SNARK circuits without leaking balances.
                </p>
                <div className="font-mono text-xs text-[#707070] pt-2 border-t border-[#ECECE8]">
                  <span>DOMAIN: DEFI / CRYPTOGRAPHY</span>
                  <br />
                  <span>TECH: CIRCOM / SOLIDITY / GROTH16 / EVM</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#ECECE8] flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-[#111111]">PROOF TIME: 1.42s</span>
              <Link href="/projects" className="font-bold text-[#111111] hover:underline">
                INSPECT SPECS →
              </Link>
            </div>
          </div>

          {/* Project 03 */}
          <div 
            className="border border-[#DCDCD8] bg-[#FFFFFF] p-8 sm:p-10 flex flex-col justify-between"
            style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}
          >
            <div>
              <div className="flex items-center justify-between font-mono text-xs pb-3 mb-6 border-b border-[#ECECE8]">
                <span className="font-bold text-[#111111]">03 / LAB BUILD</span>
                <span className="text-[#707070]">EXP-2026.03</span>
              </div>

              <h4 className="font-heading text-2xl sm:text-3xl font-black text-[#111111] uppercase tracking-tight mb-4">
                Neural Volatility Smile Engine
              </h4>

              <div className="space-y-3 font-sans text-sm text-[#555555] leading-relaxed mb-6">
                <p>
                  <strong className="font-mono text-xs text-[#111111] block uppercase">CONTEXT:</strong>
                  Deep learning pipeline predicting implied volatility surfaces and arbitrage-free smiles across multi-asset option chains using stochastic parameter embeddings.
                </p>
                <div className="font-mono text-xs text-[#707070] pt-2 border-t border-[#ECECE8]">
                  <span>DOMAIN: QUANT RESEARCH & AI</span>
                  <br />
                  <span>TECH: PYTORCH / SVI SURFACES / CUDA</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#ECECE8] flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-[#111111]">SURFACE FIT: 99.4% R²</span>
              <Link href="/projects" className="font-bold text-[#111111] hover:underline">
                INSPECT SPECS →
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
