'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePortal } from '@/context/PortalContext';

export default function Footer() {
  const { openJoinModal } = usePortal();

  return (
    <footer className="relative w-full bg-[#FAFAF8] border-t border-[#DCDCD8] text-[#111111] overflow-hidden">
      
      {/* Top Status Telemetry Bar */}
      <div className="border-b border-[#ECECE8] bg-[#FFFFFF] py-3.5">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#555555]">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-[#059669]"></span>
            <span className="font-bold text-[#111111]">SYSTEM TELEMETRY: ALL DOMAINS ACTIVE</span>
            <span className="text-[#DCDCD8]">│</span>
            <span>BUILD REF: 2026.FT-AU</span>
          </div>

          <div className="flex items-center gap-4 text-[#707070]">
            <span>COORDINATES: 22.72° N, 88.48° E</span>
            <span className="text-[#DCDCD8]">│</span>
            <span>SOET • ADAMAS UNIVERSITY</span>
          </div>
        </div>
      </div>

      {/* Main Minimal Directory Grid */}
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 py-16 sm:py-20 lg:py-24">
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
              <span className="font-heading text-2xl font-black text-[#111111] tracking-tight">
                FITECH
              </span>
            </div>

            <p className="font-mono text-xs text-[#707070] uppercase tracking-wider mb-6">
              Technology × Finance × Innovation
            </p>

            <p className="font-sans text-sm text-[#555555] leading-relaxed max-w-md">
              The student quantitative finance and financial engineering research society at Adamas University. We engineer algorithmic systems, empirical risk models, and decentralized protocols.
            </p>

            <div className="mt-8 pt-6 border-t border-[#ECECE8] font-mono text-xs text-[#707070]">
              <span>AFFILIATION: SCHOOL OF ENGINEERING & TECHNOLOGY</span>
              <br />
              <span>ADAMAS UNIVERSITY • KOLKATA, WEST BENGAL</span>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="lg:col-span-3 lg:border-l lg:border-[#ECECE8] lg:pl-8">
            <span className="font-mono text-xs font-bold text-[#111111] uppercase tracking-wider block mb-5">
              NAVIGATION
            </span>
            <ul className="font-mono text-xs text-[#555555] space-y-3">
              <li>
                <Link href="/#about" className="hover:text-[#111111] hover:underline">
                  ABOUT US
                </Link>
              </li>
              <li>
                <Link href="/domain" className="hover:text-[#111111] hover:underline">
                  DOMAINS (06)
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-[#111111] hover:underline">
                  SCHEDULE
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-[#111111] hover:underline">
                  LAB BUILDS
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#111111] hover:underline">
                  MOMENTS / GALLERY
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-[#111111] hover:underline">
                  PEOPLE INDEX
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-2 lg:border-l lg:border-[#ECECE8] lg:pl-8">
            <span className="font-mono text-xs font-bold text-[#111111] uppercase tracking-wider block mb-5">
              CONTACT
            </span>
            <ul className="font-mono text-xs text-[#555555] space-y-3">
              <li>
                <button
                  type="button"
                  onClick={openJoinModal}
                  className="font-bold text-[#111111] hover:underline uppercase text-left"
                >
                  JOIN FITECH →
                </button>
              </li>
              <li>
                <Link href="/events" className="hover:text-[#111111] hover:underline">
                  WORKSHOPS
                </Link>
              </li>
              <li>
                <Link href="/domain" className="hover:text-[#111111] hover:underline">
                  ETHICS CHARTER
                </Link>
              </li>
              <li>
                <Link href="/domain" className="hover:text-[#111111] hover:underline">
                  CONSTITUTION
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Column */}
          <div className="lg:col-span-2 lg:border-l lg:border-[#ECECE8] lg:pl-8">
            <span className="font-mono text-xs font-bold text-[#111111] uppercase tracking-wider block mb-5">
              SOCIAL
            </span>
            <ul className="font-mono text-xs text-[#555555] space-y-3">
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#111111] hover:underline flex items-center gap-1.5"
                >
                  <span>LINKEDIN</span>
                  <span>↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#111111] hover:underline flex items-center gap-1.5"
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
                  className="hover:text-[#111111] hover:underline flex items-center gap-1.5"
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
                  className="hover:text-[#111111] hover:underline flex items-center gap-1.5"
                >
                  <span>GITHUB</span>
                  <span>↗</span>
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Small Technical Footer Metadata */}
      <div className="border-t border-[#ECECE8] bg-[#FFFFFF] py-6">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#707070]">
          <div>
            © {new Date().getFullYear()} FITECH SOCIETY • ADAMAS UNIVERSITY CHAPTER. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4">
            <span>RESEARCH USE ONLY — NOT FINANCIAL ADVICE</span>
            <span className="text-[#DCDCD8]">│</span>
            <span>2D MATERIAL SPEC</span>
          </div>
        </div>
      </div>

    </footer>
  );
}
