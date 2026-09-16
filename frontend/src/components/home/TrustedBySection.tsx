'use client';

import React from 'react';

const PARTNERS = [
  'ADAMAS UNIVERSITY',
  'SOET LABS',
  'COMPUTATIONAL FINANCE LAB',
  'INDIAN QUANT ASSOCIATION',
  'ETHEREUM FOUNDATION SCHOLARS',
  'DEFI ALLIANCE FELLOWS',
  'NATIONAL FINTECH SANDBOX',
  'KOLKATA TECH COLLECTIVE',
];

export default function TrustedBySection() {
  return (
    <section className="relative w-full max-w-full bg-[#FFFFFF] py-16 sm:py-20 border-b border-[#DADADA] overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 mb-8 flex items-center justify-between font-mono text-[11px] text-[#6B6B6B] tracking-wider uppercase">
        <span>BUILT TOGETHER WITH</span>
        <span>ACADEMIC & INDUSTRY CONSORTIUM</span>
      </div>

      {/* Contained Infinite Scrolling Marquee */}
      <div className="relative w-full max-w-full overflow-hidden whitespace-nowrap">
        <div className="flex gap-8 items-center w-max animate-marquee">
          {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, idx) => (
            <div
              key={idx}
              className="flex items-center gap-8 font-serif text-2xl sm:text-3xl text-[#0A0A0A]/70 hover:text-[#0A0A0A] transition-colors shrink-0"
            >
              <span>{partner}</span>
              <span className="text-[#DADADA] text-base select-none">✦</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
