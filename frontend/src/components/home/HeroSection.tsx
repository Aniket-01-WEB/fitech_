'use client';

import React from 'react';
import { usePortal } from '@/context/PortalContext';
import AsciiDollar from './AsciiDollar';

export default function HeroSection() {
  const { openJoinModal } = usePortal();

  return (
    <section className="relative w-full max-w-full bg-[#FFFFFF] pt-20 pb-8 sm:pt-24 sm:pb-10 lg:pt-24 lg:pb-10 border-b border-[#DADADA] overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 relative z-10 flex flex-col items-center text-center">

        <p className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#0A0A0A] leading-snug tracking-tight mb-2 sm:mb-3">
          From code to capital.
        </p>

        <div className="w-full max-w-[1080px]">
          <AsciiDollar />
        </div>

        <h1 className="font-serif text-[clamp(26px,3.2vw,44px)] font-normal text-[#0A0A0A] leading-snug tracking-tight max-w-4xl mt-2 sm:mt-3">
          A student-governed engineering society bridging academia
          <br className="hidden sm:block" />
          {' '}and institutional quantitative finance.
        </h1>

        <button
          type="button"
          onClick={openJoinModal}
          className="stanzza-btn-pill stanzza-btn-dark mt-4 sm:mt-5 px-10 py-4 text-xs font-semibold uppercase tracking-[0.14em]"
        >
          <span>Join Us</span>
        </button>

      </div>
    </section>
  );
}
