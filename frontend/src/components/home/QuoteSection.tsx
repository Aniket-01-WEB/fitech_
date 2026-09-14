'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function QuoteSection() {
  return (
    <section className="relative w-full bg-[#FFFBF5] py-24 md:py-36 lg:py-44 border-b border-[#D8D6CB]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
        
        <div className="max-w-5xl mx-auto text-center">
          <span className="px-3 py-1 rounded-full bg-[#E5E4DC] text-[#1E1E1E] font-mono text-[10px] uppercase tracking-wider inline-block mb-8 sm:mb-12">
            KEYNOTE // GUILD PHILOSOPHY
          </span>

          <blockquote className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-[#1E1E1E] leading-[1.05] tracking-tight">
            &ldquo;Exceptional engineering feels inevitable.{' '}
            <span className="italic">Nothing extra, nothing missing.</span>&rdquo;
          </blockquote>

          <div className="mt-10 sm:mt-14 pt-8 border-t border-[#D8D6CB] flex flex-col items-center justify-center gap-2">
            <h4 className="font-serif text-2xl text-[#1E1E1E]">
              FiTech Executive Guild & Research Leads
            </h4>
            <p className="font-mono text-xs text-[#707070] uppercase tracking-wider">
              School of Engineering & Technology • Adamas University
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
