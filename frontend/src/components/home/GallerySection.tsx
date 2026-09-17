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
    <section id="gallery" className="relative w-full bg-[#FFFFFF] py-14 md:py-20 lg:py-24 border-b border-[#DADADA]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
        
        {/* Section Marker */}
        <div className="flex items-center justify-between pb-4 mb-8 sm:mb-10 border-b border-[#DADADA] font-mono text-[11px] text-[#6B6B6B] tracking-wider uppercase">
          <span>FIELD NOTES & ARCHIVE</span>
          <span>PHOTOGRAPHIC LOG // 2026</span>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 sm:mb-8">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#EAEAEA] text-[#0A0A0A] font-mono text-[10px] uppercase tracking-wider inline-block mb-4">
              GALLERY
            </span>
            <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal text-[#0A0A0A] tracking-tight leading-[0.92]">
              Moments from
              <br />
              <span className="italic">The Lab.</span>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#4A4A4A] font-sans-body max-w-md leading-relaxed font-light">
            Archival photographic documentation of our summits, algorithmic coding sessions, hackathons, and student guild ecosystem at Adamas University.
          </p>
        </div>

        {/* Master Photo Plate */}
        <div 
          ref={masterImageRef}
          className="relative bg-[#F2F2F2] rounded-3xl border border-[#DADADA] p-6 sm:p-8 md:p-10 mb-8 overflow-hidden"
          style={{ boxShadow: '0 20px 50px rgba(30,30,30,0.05)' }}
        >
          <div className="relative w-full aspect-[16/8] md:aspect-[21/9] rounded-2xl overflow-hidden bg-[#0A0A0A] mb-6 border border-[#DADADA]">
            <motion.img
              style={{ scale: scaleImage }}
              src="/images/event-summit.jpg"
              alt="Flagship FinTech & Quantitative Research Summit"
              className="w-full h-full object-cover transition-all duration-700"
            />
            <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-[#0A0A0A]/80 text-[#FFFFFF] font-mono text-[10px] uppercase tracking-wider backdrop-blur-md">
              Plate Main Auditorium • Keynote Session
            </div>
            <div className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-full bg-[#FFFFFF]/90 text-[#0A0A0A] font-mono text-[10px] uppercase tracking-wider backdrop-blur-md border border-[#DADADA]">
              Adamas University Campus
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div>
              <h4 className="font-serif text-2xl sm:text-3xl text-[#0A0A0A]">
                Flagship FinTech & Quantitative Research Summit
              </h4>
              <p className="font-sans-body text-xs sm:text-sm text-[#4A4A4A] mt-1 font-light">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-[#F2F2F2] rounded-3xl p-6 border border-[#DADADA]">
            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-[#0A0A0A] mb-4 border border-[#DADADA]">
              <img
                src="/images/team/aniket.jpeg"
                alt="Systems & Matching Engine Lab"
                className="w-full h-full object-cover transition-all duration-700"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0A0A0A]/80 text-[#FFFFFF] font-mono text-[9px] uppercase">
                Plate Systems & Matching Lab
              </div>
            </div>
            <h5 className="font-serif text-xl text-[#0A0A0A]">Order Book Matching Benchmarks</h5>
            <p className="font-sans-body text-xs text-[#4A4A4A] mt-1 font-light">
              Stress-testing lock-free queue implementations under simulated market micro-bursts.
            </p>
          </div>

          <div className="bg-[#F2F2F2] rounded-3xl p-6 border border-[#DADADA]">
            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-[#0A0A0A] mb-4 border border-[#DADADA]">
              <img
                src="/images/team/pritesh.jpeg"
                alt="Quantitative Research & Strategy"
                className="w-full h-full object-cover transition-all duration-700"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0A0A0A]/80 text-[#FFFFFF] font-mono text-[9px] uppercase">
                Plate Quant Research Desk
              </div>
            </div>
            <h5 className="font-serif text-xl text-[#0A0A0A]">Algorithmic Strategy & Alpha</h5>
            <p className="font-sans-body text-xs text-[#4A4A4A] mt-1 font-light">
              Student teams demonstrating decentralized lending invariants and solvency vaults.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
