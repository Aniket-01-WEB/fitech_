'use client';

import React from 'react';
import { usePortal } from '@/context/PortalContext';
import AsciiDollar from './AsciiDollar';

export default function HeroSection() {
  const { openJoinModal } = usePortal();

  return (
    <section className="relative w-full max-w-full bg-[#FFFFFF] pt-24 pb-10 sm:pt-28 sm:pb-12 lg:pt-28 lg:pb-14 border-b border-[#DADADA] overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 relative z-10 flex flex-col items-center text-center">

        <p className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#0A0A0A] leading-snug tracking-tight mb-4 sm:mb-5">
          From code to capital.
        </p>

        <div className="w-full max-w-[960px]">
          <AsciiDollar />
        </div>

        <h1 className="font-serif text-[clamp(26px,3.2vw,44px)] font-normal text-[#0A0A0A] leading-snug tracking-tight max-w-4xl mt-5 sm:mt-6">
          A student-governed engineering society bridging academia
          <br className="hidden sm:block" />
          {' '}and institutional quantitative finance.
        </h1>

        <button
          type="button"
          onClick={openJoinModal}
          className="stanzza-btn-pill stanzza-btn-dark mt-5 sm:mt-6 px-10 py-4 text-xs font-semibold uppercase tracking-[0.14em]"
        >
          <span>Join Us</span>
        </button>

      </div>
    </section>
  );
}
