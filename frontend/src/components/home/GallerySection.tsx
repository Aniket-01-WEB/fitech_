'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function GallerySection() {
  const masterImageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: masterImageRef,
    offset: ['start end', 'end start'],
  });

  const scaleImage = useTransform(scrollYProgress, [0, 1], [1.08, 1.0]);

  return (
    <section id="gallery" className="relative w-full bg-[#FFFBF5] py-24 md:py-36 lg:py-44 border-b border-[#D8D6CB]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
        
        {/* Section Marker */}
        <div className="flex items-center justify-between pb-4 mb-14 sm:mb-20 border-b border-[#D8D6CB] font-mono text-[11px] text-[#707070] tracking-wider uppercase">
          <span>07 / FIELD NOTES & ARCHIVE</span>
          <span>PHOTOGRAPHIC LOG // 2026</span>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-20">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#E5E4DC] text-[#1E1E1E] font-mono text-[10px] uppercase tracking-wider inline-block mb-4">
              07 // GALLERY
            </span>
            <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal text-[#1E1E1E] tracking-tight leading-[0.92]">
              Moments from
              <br />
              <span className="italic">The Lab.</span>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#5F5F5F] font-sans-body max-w-md leading-relaxed font-light">
            Archival photographic documentation of our summits, algorithmic coding sessions, hackathons, and student guild ecosystem at Adamas University.
          </p>
        </div>

        {/* Master Photo Plate */}
        <div 
          ref={masterImageRef}
          className="relative bg-[#F4F3EB] rounded-3xl border border-[#D8D6CB] p-6 sm:p-8 md:p-10 mb-12 overflow-hidden"
          style={{ boxShadow: '0 20px 50px rgba(30,30,30,0.05)' }}
        >
          <div className="relative w-full aspect-[16/8] md:aspect-[21/9] rounded-2xl overflow-hidden bg-[#1E1E1E] mb-6 border border-[#D8D6CB]">
            <motion.img
              style={{ scale: scaleImage }}
              src="/images/event-summit.jpg"
              alt="Flagship FinTech & Quantitative Research Summit"
              className="w-full h-full object-cover grayscale contrast-115 hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-[#1E1E1E]/80 text-[#FFFBF5] font-mono text-[10px] uppercase tracking-wider backdrop-blur-md">
              Plate 01 // Main Auditorium • Keynote Session
            </div>
            <div className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-full bg-[#FFFBF5]/90 text-[#1E1E1E] font-mono text-[10px] uppercase tracking-wider backdrop-blur-md border border-[#D8D6CB]">
              Adamas University Campus
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div>
              <h4 className="font-serif text-2xl sm:text-3xl text-[#1E1E1E]">
                Flagship FinTech & Quantitative Research Summit
              </h4>
              <p className="font-sans-body text-xs sm:text-sm text-[#5F5F5F] mt-1 font-light">
                Keynote address on limit order book microstructures and automated market maker invariants.
              </p>
            </div>

            <Link
              href="/gallery"
              className="stanzza-btn-pill stanzza-btn-dark shrink-0"
            >
              <span>View Full Archive</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* 2 Staggered Plates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          <div className="bg-[#F4F3EB] rounded-3xl p-6 border border-[#D8D6CB]">
            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-[#1E1E1E] mb-4 border border-[#D8D6CB]">
              <img
                src="/images/team/aniket.jpeg"
                alt="Systems & Matching Engine Lab"
                className="w-full h-full object-cover grayscale contrast-110 hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#1E1E1E]/80 text-[#FFFBF5] font-mono text-[9px] uppercase">
                Plate 02 // Systems & Matching Lab
              </div>
            </div>
            <h5 className="font-serif text-xl text-[#1E1E1E]">Order Book Matching Benchmarks</h5>
            <p className="font-sans-body text-xs text-[#5F5F5F] mt-1 font-light">
              Stress-testing lock-free queue implementations under simulated market micro-bursts.
            </p>
          </div>

          <div className="bg-[#F4F3EB] rounded-3xl p-6 border border-[#D8D6CB]">
            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-[#1E1E1E] mb-4 border border-[#D8D6CB]">
              <img
                src="/images/team/pritesh.jpeg"
                alt="Quantitative Research & Strategy"
                className="w-full h-full object-cover grayscale contrast-110 hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#1E1E1E]/80 text-[#FFFBF5] font-mono text-[9px] uppercase">
                Plate 03 // Quant Research Desk
              </div>
            </div>
            <h5 className="font-serif text-xl text-[#1E1E1E]">Algorithmic Strategy & Alpha</h5>
            <p className="font-sans-body text-xs text-[#5F5F5F] mt-1 font-light">
              Student teams demonstrating decentralized lending invariants and solvency vaults.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
