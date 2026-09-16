'use client';

import React from 'react';
import { usePortal } from '@/context/PortalContext';
import AsciiDollar from './AsciiDollar';
import DotField from './DotField';

export default function HeroSection() {
  const { openJoinModal } = usePortal();

  return (
    <section className="relative w-full max-w-full bg-[#FFFFFF] pt-28 pb-12 sm:pt-32 sm:pb-14 lg:pt-36 lg:pb-16 border-b border-[#DADADA] overflow-hidden">
      <DotField />

      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 relative z-10 flex flex-col items-center text-center">

        <p className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#0A0A0A] leading-snug tracking-tight mb-6 sm:mb-8">
          From code to capital.
        </p>

        {/* Feathered white pad so the halo squares don't muddy the dots of the note */}
        <div className="w-full max-w-[960px] bg-[#FFFFFF]" style={{ boxShadow: '0 0 40px 28px #FFFFFF' }}>
          <AsciiDollar />
        </div>

        <h1 className="font-serif text-[clamp(26px,3.2vw,44px)] font-normal text-[#0A0A0A] leading-snug tracking-tight max-w-4xl mt-8 sm:mt-10">
          A student-governed engineering society bridging academia
          <br className="hidden sm:block" />
          {' '}and institutional quantitative finance.
        </h1>

        <button
          type="button"
          onClick={openJoinModal}
          className="stanzza-btn-pill stanzza-btn-dark mt-8 sm:mt-10 px-10 py-4 text-xs font-semibold uppercase tracking-[0.14em]"
        >
          <span>Join Us</span>
        </button>

      </div>
    </section>
  );
}
