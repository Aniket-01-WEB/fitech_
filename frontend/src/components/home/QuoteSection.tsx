'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function QuoteSection() {
  return (
    <section className="relative w-full bg-[#FFFFFF] py-14 md:py-20 lg:py-24 border-b border-[#DADADA]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
        
        <div className="max-w-5xl mx-auto text-center">
          <span className="px-3 py-1 rounded-full bg-[#EAEAEA] text-[#0A0A0A] font-mono text-[10px] uppercase tracking-wider inline-block mb-6 sm:mb-8">
            KEYNOTE // GUILD PHILOSOPHY
          </span>

          <blockquote className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-[#0A0A0A] leading-[1.05] tracking-tight">
            &ldquo;Exceptional engineering feels inevitable.{' '}
            <span className="italic">Nothing extra, nothing missing.</span>&rdquo;
          </blockquote>

          <div className="mt-10 sm:mt-14 pt-8 border-t border-[#DADADA] flex flex-col items-center justify-center gap-2">
            <h4 className="font-serif text-2xl text-[#0A0A0A]">
              FiTech Executive Guild & Research Leads
            </h4>
            <p className="font-mono text-xs text-[#6B6B6B] uppercase tracking-wider">
              School of Engineering & Technology • Adamas University
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
