'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface TeamMember {
  num: string;
  name: string;
  role: string;
  dept: string;
  domain: string;
  bio: string;
  image: string | null;
  linkedin?: string;
  featured?: boolean;
}

const ALL_PERSONNEL: TeamMember[] = [
  {
    num: '01',
    name: 'ARIJIT DEY',
    role: 'PRESIDENT',
    dept: 'EXECUTIVE',
    domain: 'EXECUTIVE GOVERNANCE & STRATEGY',
    bio: 'Leading strategic partnerships, institutional university relations, and research symposium governance.',
    image: null,
    linkedin: 'https://linkedin.com',
    featured: true,
  },
  {
    num: '02',
    name: 'DIGANT MISHRA',
    role: 'PRESIDENT',
    dept: 'EXECUTIVE',
    domain: 'RESEARCH FELLOWSHIPS & SYMPOSIA',
    bio: 'Co-leading research output, quantitative fellowships, and international paper publications.',
    image: null,
    linkedin: 'https://linkedin.com',
    featured: true,
  },
  {
    num: '03',
    name: 'PRITESH SHRIVASTAV',
    role: 'V. PRESIDENT',
    dept: 'EXECUTIVE',
    domain: 'QUANTITATIVE DEVELOPMENT',
    bio: 'Managing internal operations, core project execution, and algorithmic backtesting pipelines.',
    image: '/images/team/pritesh.jpeg',
    linkedin: 'https://linkedin.com',
    featured: true,
  },
  {
    num: '04',
    name: 'SHIVAM JAISWAL',
    role: 'V. PRESIDENT',
    dept: 'EXECUTIVE',
    domain: 'OPERATIONS & OUTREACH',
    bio: 'Directing member engagement, industry relations, and inter-university hackathon delegations.',
    image: null,
    linkedin: 'https://linkedin.com',
    featured: false,
  },
  {
    num: '05',
    name: 'SOUVIK BANDOPADHYA',
    role: 'SECRETARY',
    dept: 'EXECUTIVE',
    domain: 'INSTITUTIONAL ADMINISTRATION',
    bio: 'Overseeing official guild governance, student council liaison, and administrative filings.',
    image: '/images/team/souvik.jpeg',
    linkedin: 'https://linkedin.com',
    featured: true,
  },
  {
    num: '06',
    name: 'AVIRUP CHATTERJEE',
    role: 'JT. SECRETARY',
    dept: 'EXECUTIVE',
    domain: 'ACADEMIC LIAISON',
    bio: 'Coordinating curriculum alignment, laboratory access schedules, and faculty review sessions.',
    image: null,
    linkedin: 'https://linkedin.com',
    featured: false,
  },
  {
    num: '07',
    name: 'ANIKET DUTTA',
    role: 'TECH LEAD',
    dept: 'TECH',
    domain: 'SYSTEMS & INFRASTRUCTURE',
    bio: 'Engineering sub-microsecond matching engines, high-frequency C++ backbones, and web architecture.',
    image: '/images/team/aniket.jpeg',
    linkedin: 'https://linkedin.com',
    featured: true,
  },
  {
    num: '08',
    name: 'SHORYA SINGH',
    role: 'ASST. TECH',
    dept: 'TECH',
    domain: 'HFT & LOW-LATENCY C++',
    bio: 'Developing lock-free ring buffers, DPDK packet capture modules, and exchange simulator harnesses.',
    image: null,
    linkedin: 'https://linkedin.com',
    featured: false,
  },
  {
    num: '09',
    name: 'AYUSH JAISWAL',
    role: 'ASST. TECH',
    dept: 'TECH',
    domain: 'FINANCIAL AI & QUANT',
    bio: 'Assisting in time-series transformer modeling, volatility forecasting, and Python analytical tools.',
    image: null,
    linkedin: 'https://linkedin.com',
    featured: false,
  },
  {
    num: '10',
    name: 'ARNAB MANDAL',
    role: 'MEDIA LEAD',
    dept: 'DESIGN_MEDIA',
    domain: 'RESEARCH PUBLICATIONS & BROADCAST',
    bio: 'Overseeing editorial publications, technical whitepaper layout, and symposium video coverage.',
    image: null,
    linkedin: 'https://linkedin.com',
    featured: false,
  },
  {
    num: '11',
    name: 'AZAD HUSSAIN',
    role: 'ASST. MEDIA',
    dept: 'DESIGN_MEDIA',
    domain: 'DIGITAL MEDIA & COVERAGE',
    bio: 'Managing social distribution, live summit broadcasts, and guild documentation reels.',
    image: null,
    linkedin: 'https://linkedin.com',
    featured: false,
  },
  {
    num: '12',
    name: 'GOURAV GHOSH',
    role: 'DESIGN LEAD',
    dept: 'DESIGN_MEDIA',
    domain: 'VISUAL ARCHITECTURE & DESIGN',
    bio: 'Directing typographic editorial design systems, brand identities, and technical visual schematics.',
    image: '/images/team/gourav.jpeg',
    linkedin: 'https://linkedin.com',
    featured: true,
  },
  {
    num: '13',
    name: 'PRITAM BARAI',
    role: 'ASST. DESIGN',
    dept: 'DESIGN_MEDIA',
    domain: 'EDITORIAL & TECHNICAL GRAPHICS',
    bio: 'Producing publication graphics, diagrammatic whitepaper assets, and user interfaces.',
    image: null,
    linkedin: 'https://linkedin.com',
    featured: false,
  },
  {
    num: '14',
    name: 'SAYAN SHEIKH',
    role: 'SOCIAL LEAD',
    dept: 'OPERATIONS',
    domain: 'COMMUNITY NETWORK & RELATIONS',
    bio: 'Fostering peer discussion cohorts, Discord research channels, and alumni network channels.',
    image: null,
    linkedin: 'https://linkedin.com',
    featured: false,
  },
  {
    num: '15',
    name: 'PRIYAM CHHETRI',
    role: 'ASST. SOCIAL',
    dept: 'OPERATIONS',
    domain: 'EXTERNAL RELATIONS & SPONSORSHIPS',
    bio: 'Connecting with corporate sponsors, algorithmic trading firms, and intercollegiate partners.',
    image: null,
    linkedin: 'https://linkedin.com',
    featured: false,
  },
  {
    num: '16',
    name: 'DEBJIT MODAK',
    role: 'DOCUMENTATION',
    dept: 'OPERATIONS',
    domain: 'ARCHIVAL RECORDS & MINUTES',
    bio: 'Recording institutional proceedings, code audit histories, and official university minutes.',
    image: '/images/team/debjit.jpeg',
    linkedin: 'https://linkedin.com',
    featured: true,
  },
];

const FILTER_TAGS = [
  { id: 'ALL', label: 'ALL PERSONNEL [16]' },
  { id: 'EXECUTIVE', label: 'EXECUTIVE [06]' },
  { id: 'TECH', label: 'TECH & LABS [03]' },
  { id: 'DESIGN_MEDIA', label: 'DESIGN & MEDIA [04]' },
  { id: 'OPERATIONS', label: 'OPERATIONS [03]' },
];

export default function TeamPage() {
  const [filter, setFilter] = useState('ALL');

  const visibleMembers = filter === 'ALL'
    ? ALL_PERSONNEL
    : ALL_PERSONNEL.filter((m) => m.dept === filter);

  const membersWithPhotos = visibleMembers.filter((m) => m.image !== null);

  return (
    <div className="relative w-full min-h-screen bg-[#F2F2F2] text-[#0A0A0A] pt-32 pb-16 md:pt-32 md:pb-20 selection:bg-[#0A0A0A] selection:text-[#FFFFFF]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-4 mb-10 sm:mb-14 border-b border-[#F2F2F2] font-mono text-[11px] text-[#6B6B6B] tracking-wider uppercase">
          <Link href="/" className="hover:text-[#0A0A0A] inline-flex items-center gap-2">
            <span>←</span>
            <span>RETURN TO REPOSITORY HOME</span>
          </Link>
          <span>PERSONNEL REGISTRY // 2026</span>
        </div>

        {/* Header Block */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-8 sm:mb-10">
          <div>
            <span className="font-mono text-xs font-bold text-[#0A0A0A] uppercase tracking-wider block mb-2">
              05 / PERSONNEL
            </span>
            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black text-[#0A0A0A] uppercase tracking-tight leading-none">
              GOVERNANCE ROSTER
            </h1>
            <p className="mt-4 text-sm sm:text-base text-[#4A4A4A] font-sans max-w-2xl leading-relaxed">
              Complete archival register of student fellows, research coordinators, and operational officers at Adamas University School of Engineering & Technology.
            </p>
          </div>

          {/* Filter Tags */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-[#FFFFFF] border border-[#F2F2F2] shadow-[2px_2px_0px_rgba(0,0,0,0.04)]">
            {FILTER_TAGS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFilter(t.id)}
                className={`px-3.5 py-1.5 font-mono text-[11px] font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                  filter === t.id
                    ? 'bg-[#0A0A0A] text-[#FFFFFF]'
                    : 'text-[#4A4A4A] hover:text-[#0A0A0A] hover:bg-[#F1F2F0]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 01: FEATURED PHOTOGRAPHIC PORTRAITS */}
        {membersWithPhotos.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between font-mono text-[10px] text-[#6B6B6B] uppercase tracking-wider pb-2 mb-6 border-b border-[#F2F2F2]">
              <span className="font-bold text-[#0A0A0A]">EXECUTIVE FELLOWS // PHOTOGRAPHIC ARCHIVE</span>
              <span>PLATE REF: FT-ROSTER.PH</span>
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${membersWithPhotos.length >= 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-6`}>
              <AnimatePresence mode="popLayout">
                {membersWithPhotos.map((member) => (
                  <motion.div
                    layout
                    key={member.num}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="relative bg-[#FFFFFF] border border-[#F2F2F2] p-4 flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1"
                    style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.04)' }}
                  >
                    <span className="absolute top-1.5 left-1.5 font-mono text-[9px] text-[#8A8A8A] select-none">┌</span>
                    <span className="absolute top-1.5 right-1.5 font-mono text-[9px] text-[#8A8A8A] select-none">┐</span>
                    <span className="absolute bottom-1.5 left-1.5 font-mono text-[9px] text-[#8A8A8A] select-none">└</span>
                    <span className="absolute bottom-1.5 right-1.5 font-mono text-[9px] text-[#8A8A8A] select-none">┘</span>

                    <div>
                      <div className="flex items-center justify-between font-mono text-[10px] pb-2 mb-3 border-b border-[#F2F2F2]">
                        <span className="font-bold text-[#0A0A0A]">NO. {member.num} / 16</span>
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#6B6B6B] hover:text-[#0A0A0A] font-semibold flex items-center gap-1"
                          >
                            <span>LN</span>
                            <span className="text-[9px]">↗</span>
                          </a>
                        )}
                      </div>

                      <div className="relative w-full aspect-[4/4.5] bg-[#0A0A0A] border border-[#F2F2F2] overflow-hidden mb-4">
                        <img
                          src={member.image!}
                          alt={member.name}
                          className="w-full h-full object-cover grayscale contrast-115 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 will-change-transform"
                        />
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#0A0A0A]/85 text-[#FFFFFF] font-mono text-[8px] uppercase tracking-wider backdrop-blur-sm">
                          FELLOW FT-{member.num}
                        </div>
                      </div>

                      <h3 className="font-heading font-black text-base sm:text-lg text-[#0A0A0A] uppercase tracking-tight leading-snug">
                        {member.name}
                      </h3>

                      <div className="mt-1.5 pt-1.5 border-t border-[#F2F2F2]">
                        <span className="font-mono text-[11px] font-bold text-[#0A0A0A] uppercase block">
                          {member.role}
                        </span>
                        <span className="font-mono text-[9px] text-[#6B6B6B] uppercase block mt-0.5 leading-snug">
                          {member.domain}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-2 border-t border-[#F2F2F2] flex items-center justify-between font-mono text-[9px] text-[#6B6B6B]">
                      <span>SOET CHAPTER</span>
                      <span className="font-semibold text-[#059669]">CONFIRMED</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* 02: COMPLETE DIRECTORY TABLE */}
        <div className="bg-[#FFFFFF] border border-[#F2F2F2] p-6 sm:p-8 md:p-10" style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-[#F2F2F2]">
            <div>
              <h2 className="font-heading font-black text-xl sm:text-2xl text-[#0A0A0A] uppercase tracking-tight">
                FULL GUILD GOVERNANCE LEDGER
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#4A4A4A] mt-0.5">
                Official registry of student fellows, research coordinators, and operational officers.
              </p>
            </div>
            <div className="font-mono text-xs text-[#6B6B6B] shrink-0">
              <span className="font-bold text-[#0A0A0A]">{visibleMembers.length}</span> REGISTERED FELLOWS
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b-2 border-[#0A0A0A] text-[10px] text-[#6B6B6B] uppercase tracking-wider">
                  <th className="py-3 pr-4 font-bold text-[#0A0A0A]">INDEX</th>
                  <th className="py-3 px-4 font-bold text-[#0A0A0A]">FELLOW IDENTITY</th>
                  <th className="py-3 px-4 font-bold text-[#0A0A0A]">GOVERNANCE ROLE</th>
                  <th className="py-3 px-4 font-bold text-[#0A0A0A] hidden md:table-cell">DOMAIN & MANDATE</th>
                  <th className="py-3 px-4 font-bold text-[#0A0A0A] hidden sm:table-cell">CHAPTER</th>
                  <th className="py-3 pl-4 text-right font-bold text-[#0A0A0A]">RECORD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F2F2]">
                {visibleMembers.map((member) => (
                  <tr
                    key={member.num}
                    className="hover:bg-[#F2F2F2] transition-colors group cursor-default"
                  >
                    <td className="py-4 pr-4 text-[#6B6B6B] font-medium whitespace-nowrap">
                      NO. {member.num}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-heading font-black text-sm text-[#0A0A0A] uppercase tracking-tight group-hover:underline">
                        {member.name}
                      </div>
                      <div className="text-[10px] text-[#6B6B6B] md:hidden font-mono mt-0.5">
                        {member.domain}
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-[#F1F2F0] border border-[#F2F2F2] text-[10px] font-bold text-[#0A0A0A]">
                        {member.role}
                      </span>
                    </td>

                    <td className="py-4 px-4 hidden md:table-cell text-[#4A4A4A] text-[11px] leading-snug">
                      <div className="font-semibold text-[#0A0A0A]">{member.domain}</div>
                      <div className="text-[#6B6B6B] text-[10px] mt-0.5 max-w-md">{member.bio}</div>
                    </td>

                    <td className="py-4 px-4 hidden sm:table-cell whitespace-nowrap text-[#6B6B6B] text-[10px]">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#059669] mr-1.5"></span>
                      SOET CONFIRMED
                    </td>

                    <td className="py-4 pl-4 text-right whitespace-nowrap">
                      {member.linkedin ? (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-[#0A0A0A] hover:underline inline-flex items-center gap-1 uppercase tracking-wider text-[11px]"
                        >
                          <span>CONNECT</span>
                          <span className="transition-transform group-hover:translate-x-0.5">→</span>
                        </a>
                      ) : (
                        <span className="text-[#8A8A8A] text-[10px]">INTERNAL</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
