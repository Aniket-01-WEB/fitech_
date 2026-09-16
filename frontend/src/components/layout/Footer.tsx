'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePortal } from '@/context/PortalContext';

export default function Footer() {
  const { openJoinModal } = usePortal();

  return (
    <footer className="relative w-full bg-[#FFFFFF] border-t border-[#DADADA] text-[#0A0A0A] overflow-hidden">
      
      {/* Top Status Telemetry Bar */}
      <div className="border-b border-[#DADADA] bg-[#F2F2F2] py-3.5">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#4A4A4A]">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
            <span className="font-bold text-[#0A0A0A]">SYSTEM: ALL RESEARCH DOMAINS ACTIVE</span>
            <span className="text-[#DADADA]">│</span>
            <span>BUILD REF: 2026.FT-AU</span>
          </div>

          <div className="flex items-center gap-4 text-[#6B6B6B]">
            <span>COORDINATES: 22.72° N, 88.48° E</span>
            <span className="text-[#DADADA]">│</span>
            <span>SOET • ADAMAS UNIVERSITY</span>
          </div>
        </div>
      </div>

      {/* Main Minimal Directory Grid */}
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 py-12 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand & Manifesto Block */}
          <div className="lg:col-span-5 pr-0 lg:pr-10">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/logo.png"
                alt="FITECH Logo"
                width={36}
                height={36}
                className="w-9 h-9 object-contain"
              />
              <span className="font-serif text-3xl font-normal text-[#0A0A0A] tracking-tight">
                FITECH
              </span>
            </div>

            <p className="font-mono text-xs text-[#6B6B6B] uppercase tracking-wider mb-6">
              Engineering × Quantitative Finance × Innovation
            </p>

            <p className="font-sans-body text-sm text-[#4A4A4A] leading-relaxed max-w-md font-light">
              The student quantitative finance and financial engineering research society at Adamas University. We engineer algorithmic systems, empirical risk models, and decentralized protocols.
            </p>

            <div className="mt-8 pt-6 border-t border-[#DADADA] font-mono text-xs text-[#6B6B6B] space-y-1">
              <div>AFFILIATION: SCHOOL OF ENGINEERING & TECHNOLOGY</div>
              <div>ADAMAS UNIVERSITY • BARASAT, KOLKATA 700126</div>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="lg:col-span-3 lg:border-l lg:border-[#DADADA] lg:pl-8">
            <span className="font-mono text-xs font-bold text-[#0A0A0A] uppercase tracking-wider block mb-5">
              NAVIGATION
            </span>
            <ul className="font-mono text-xs text-[#4A4A4A] space-y-3">
              <li>
                <Link href="/#composition" className="hover:text-[#0A0A0A] hover:underline">
                  COMPOSITION // ABOUT
                </Link>
              </li>
              <li>
                <Link href="/domain" className="hover:text-[#0A0A0A] hover:underline">
                  DOMAINS (06)
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-[#0A0A0A] hover:underline">
                  SCHEDULE
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-[#0A0A0A] hover:underline">
                  LAB BUILDS
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#0A0A0A] hover:underline">
                  MOMENTS / GALLERY
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-[#0A0A0A] hover:underline">
                  PEOPLE INDEX
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-2 lg:border-l lg:border-[#DADADA] lg:pl-8">
            <span className="font-mono text-xs font-bold text-[#0A0A0A] uppercase tracking-wider block mb-5">
              FELLOWSHIP
            </span>
            <ul className="font-mono text-xs text-[#4A4A4A] space-y-3">
              <li>
                <button
                  type="button"
                  onClick={openJoinModal}
                  className="hover:text-[#0A0A0A] hover:underline text-left cursor-pointer"
                >
                  JOIN FELLOWSHIP →
                </button>
              </li>
              <li>
                <Link href="/events" className="hover:text-[#0A0A0A] hover:underline">
                  SYMPOSIA
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#0A0A0A] hover:underline">
                  CONSTITUTION
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="lg:col-span-2 lg:border-l lg:border-[#DADADA] lg:pl-8">
            <span className="font-mono text-xs font-bold text-[#0A0A0A] uppercase tracking-wider block mb-5">
              CONNECT
            </span>
            <ul className="font-mono text-xs text-[#4A4A4A] space-y-3">
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#0A0A0A] hover:underline flex items-center gap-1.5"
                >
                  <span>LINKEDIN</span>
                  <span>↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#0A0A0A] hover:underline flex items-center gap-1.5"
                >
                  <span>X / TWITTER</span>
                  <span>↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#0A0A0A] hover:underline flex items-center gap-1.5"
                >
                  <span>DISCORD</span>
                  <span>↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#0A0A0A] hover:underline flex items-center gap-1.5"
                >
                  <span>GITHUB</span>
                  <span>↗</span>
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Colophon & Copyright Bar */}
      <div className="border-t border-[#DADADA] bg-[#FFFFFF] py-6">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#6B6B6B]">
          <div>
            © 2026 FITECH SOCIETY • ADAMAS UNIVERSITY CHAPTER. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4">
            <span>RESEARCH USE ONLY</span>
            <span>•</span>
            <span>NOT FINANCIAL ADVICE</span>
          </div>
        </div>
      </div>

    </footer>
  );
}
