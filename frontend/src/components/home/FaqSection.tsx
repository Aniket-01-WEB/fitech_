'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  {
    q: 'What technical background is required to join FiTech?',
    a: 'We welcome students across all undergraduate and postgraduate engineering years. While proficiency in C++, Python, or Web3 is advantageous, our foundational track introduces quantitative finance, financial computing, and low-latency systems from first principles.',
  },
  {
    q: 'How are research domains and engineering labs structured?',
    a: 'The guild operates across six specialized divisions: Quantitative Systems, Algorithmic Strategy, Financial AI, Stochastic Risk, Venture Incubation, and Decentralized Protocols. Fellows contribute to weekly sprint reviews, verified repositories, and empirical whitepapers mentored by student leads and alumni quants.',
  },
  {
    q: 'What compute resources and data feeds are provided to members?',
    a: 'Fellows receive access to high-frequency tick historical archives, Level 2 order books, simulated matching testbeds, and GPU compute clusters for neural transformer training and Monte Carlo derivatives pricing.',
  },
  {
    q: 'Do I need prior financial markets experience, or is programming enough?',
    a: 'Rigorous programming ability and mathematical curiosity are the primary foundations. Financial domain knowledge—such as order book dynamics, stochastic volatility modeling, and AMM invariants—is developed through hands-on lab projects.',
  },
  {
    q: 'How does the guild connect students with industry desks and venture funding?',
    a: 'We maintain active referral pipelines to algorithmic trading desks, quantitative investment firms, and Web3 protocol teams. For student founders building fintech products, our incubator provides technical audits, unit economics stress-testing, and angel investor introductions.',
  },
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="relative w-full bg-[#FFFFFF] py-24 md:py-36 lg:py-44 border-b border-[#DADADA]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
        
        {/* Section Marker */}
        <div className="flex items-center justify-between pb-4 mb-14 sm:mb-20 border-b border-[#DADADA] font-mono text-[11px] text-[#6B6B6B] tracking-wider uppercase">
          <span>08 / FREQUENTLY ASKED QUESTIONS</span>
          <span>ADMISSIONS & INTAKE // 2026</span>
        </div>

        {/* Section Heading */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-16 sm:mb-20 items-end">
          <div className="lg:col-span-6">
            <span className="px-3 py-1 rounded-full bg-[#EAEAEA] text-[#0A0A0A] font-mono text-[10px] uppercase tracking-wider inline-block mb-4">
              08 // FAQS
            </span>
            <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal text-[#0A0A0A] tracking-tight leading-[0.92]">
              Questions prospective
              <br />
              <span className="italic">Fellows ask.</span>
            </h2>
          </div>
          <div className="lg:col-span-6">
            <p className="text-base sm:text-lg text-[#4A4A4A] font-sans-body leading-relaxed font-light">
              Clear answers regarding intake criteria, research commitments, laboratory access, and career pathways through the FiTech ecosystem.
            </p>
          </div>
        </div>

        {/* Stanzza Accordion List */}
        <div className="divide-y divide-[#DADADA] border-t border-b border-[#DADADA]">
          {FAQS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="py-8 sm:py-10 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-start justify-between gap-6 text-left cursor-pointer group"
                >
                  <div className="flex items-baseline gap-4 sm:gap-6">
                    <span className="font-mono text-xs text-[#6B6B6B] pt-1">
                      0{idx + 1} {"//"}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#0A0A0A] group-hover:underline">
                      {item.q}
                    </h3>
                  </div>

                  <span className="w-8 h-8 rounded-full bg-[#F2F2F2] border border-[#DADADA] flex items-center justify-center font-serif text-xl text-[#0A0A0A] shrink-0 transition-transform duration-300">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pt-6 pl-8 sm:pl-12 font-sans-body text-base sm:text-lg text-[#4A4A4A] leading-relaxed max-w-3xl font-light">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
