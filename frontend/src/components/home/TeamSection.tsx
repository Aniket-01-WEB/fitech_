'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const TEAM_MEMBERS = [
  {
    num: '01',
    name: 'ARIJIT DEY',
    role: 'PRESIDENT',
    dept: 'EXECUTIVE',
    domain: 'EXECUTIVE GOVERNANCE & STRATEGY',
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
    image: '/images/team/pritesh.jpeg',
    linkedin: 'https://linkedin.com',
    featured: false,
  },
  {
    num: '04',
    name: 'SHIVAM JAISWAL',
    role: 'V. PRESIDENT',
    dept: 'EXECUTIVE',
    domain: 'OPERATIONS & OUTREACH',
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
    image: '/images/team/souvik.jpeg',
    linkedin: 'https://linkedin.com',
    featured: false,
  },
  {
    num: '06',
    name: 'AVIRUP CHATTERJEE',
    role: 'JT. SECRETARY',
    dept: 'EXECUTIVE',
    domain: 'ACADEMIC LIAISON',
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
    image: '/images/team/debjit.jpeg',
    linkedin: 'https://linkedin.com',
    featured: false,
  },
];

const FILTER_TAGS = [
  { id: 'ALL', label: 'ALL PERSONNEL [16]' },
  { id: 'EXECUTIVE', label: 'EXECUTIVE [06]' },
  { id: 'TECH', label: 'TECH & LABS [03]' },
  { id: 'DESIGN_MEDIA', label: 'DESIGN & MEDIA [04]' },
  { id: 'OPERATIONS', label: 'OPERATIONS [03]' },
];

export default function TeamSection() {
  const [filter, setFilter] = useState('ALL');

  const visibleMembers = filter === 'ALL'
    ? TEAM_MEMBERS
    : TEAM_MEMBERS.filter((m) => m.dept === filter);

  return (
    <section id="team" className="relative w-full bg-[#FAFAF8] py-24 md:py-36 lg:py-44 border-b border-[#DCDCD8]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
        
        {/* Section Index Marker */}
        <div className="flex items-center justify-between pb-4 mb-14 sm:mb-20 border-b border-[#DCDCD8] font-mono text-[11px] text-[#707070] tracking-wider uppercase">
          <span>[ SECTION 05 // LEADERSHIP ROSTER & GOVERNANCE ]</span>
          <span>PEOPLE INDEX // 2026</span>
        </div>

        {/* Section Header & Filters */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 sm:mb-20">
          <div>
            <span className="font-mono text-xs font-bold text-[#111111] uppercase tracking-wider block mb-2">
              05 / ROSTER
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-[#111111] uppercase tracking-tight leading-none">
              PEOPLE INDEX
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#555555] font-sans max-w-lg leading-relaxed">
              The student fellows governing engineering divisions, quantitative models, research publications, and guild operations.
            </p>
          </div>

          {/* Clean Editorial Filter Strip */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-[#FFFFFF] border border-[#DCDCD8]">
            {FILTER_TAGS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFilter(t.id)}
                className={`px-3.5 py-1.5 font-mono text-[11px] font-semibold tracking-wider uppercase transition-all ${
                  filter === t.id
                    ? 'bg-[#111111] text-[#FFFFFF]'
                    : 'text-[#555555] hover:text-[#111111] hover:bg-[#F1F2F0]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ASYMMETRIC EDITORIAL GRID: Creates rhythm with varying card weights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8">
          {visibleMembers.map((member, idx) => {
            // Asymmetric column span: Featured members span 6 cols on lg, standard span 3 cols on lg
            const isFeatured = member.featured && filter === 'ALL';
            const colSpanClass = isFeatured ? 'lg:col-span-6' : 'lg:col-span-3';

            return (
              <div
                key={member.num}
                className={`${colSpanClass} relative bg-[#FFFFFF] border border-[#DCDCD8] p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1`}
                style={{
                  boxShadow: '4px 4px 0 rgba(0,0,0,0.05)'
                }}
              >
                {/* Header Strip: Number + LinkedIn */}
                <div className="flex items-center justify-between font-mono text-[10px] pb-2 mb-4 border-b border-[#ECECE8]">
                  <span className="font-bold text-[#111111]">NO. {member.num} / 16</span>
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#707070] hover:text-[#111111] flex items-center gap-1 font-semibold"
                      title={`${member.name} on LinkedIn`}
                    >
                      <span>LN</span>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25c-.9 0-1.63.73-1.63 1.63 0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63 0-.9-.73-1.63-1.63-1.63Z" />
                      </svg>
                    </a>
                  )}
                </div>

                {/* Portrait Frame: Real Image or Neutral Technical Grid Placeholder */}
                <div className="relative w-full aspect-[4/4.2] bg-[#F1F2F0] border border-[#DCDCD8] overflow-hidden mb-5 flex items-center justify-center">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover grayscale contrast-115 hover:grayscale-0 transition-all duration-300"
                    />
                  ) : (
                    /* Intentional Neutral Technical Grid Placeholder */
                    <div className="w-full h-full flex flex-col items-center justify-center relative p-4 text-center">
                      <div
                        className="absolute inset-0 opacity-15 pointer-events-none"
                        style={{
                          backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
                          backgroundSize: '16px 16px',
                        }}
                      />
                      <span className="font-mono text-[10px] text-[#707070] tracking-widest uppercase mb-1">
                        RECORDED PERSONNEL
                      </span>
                      <span className="font-heading font-black text-3xl sm:text-4xl text-[#111111]">
                        {member.name.charAt(0)}
                      </span>
                      <span className="font-mono text-[9px] text-[#707070] mt-1 border border-[#DCDCD8] px-2 py-0.5 bg-[#FFFFFF]">
                        FT-{member.num}
                      </span>
                    </div>
                  )}

                  {/* Corner Tick Marks */}
                  <span className="absolute top-1 left-1 font-mono text-[8px] text-[#999999] select-none">┌</span>
                  <span className="absolute top-1 right-1 font-mono text-[8px] text-[#999999] select-none">┐</span>
                  <span className="absolute bottom-1 left-1 font-mono text-[8px] text-[#999999] select-none">└</span>
                  <span className="absolute bottom-1 right-1 font-mono text-[8px] text-[#999999] select-none">┘</span>
                </div>

                {/* Member Identity & Metadata */}
                <div>
                  <h3 className="font-heading font-black text-lg sm:text-xl text-[#111111] uppercase tracking-tight leading-snug">
                    {member.name}
                  </h3>

                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#ECECE8]">
                    <span className="font-mono text-xs font-bold text-[#111111] uppercase">
                      {member.role}
                    </span>
                  </div>

                  <div className="font-mono text-[10px] text-[#707070] uppercase mt-1 leading-tight">
                    {member.domain}
                  </div>
                </div>

                {/* Bottom Card Annotation */}
                <div className="mt-4 pt-2 border-t border-[#ECECE8] flex items-center justify-between font-mono text-[9px] text-[#707070]">
                  <span>ADAMAS CHAPTER</span>
                  <span>CONFIRMED</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Roster Link */}
        <div className="mt-14 p-6 bg-[#FFFFFF] border border-[#DCDCD8] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-[#111111]"></span>
            <span className="font-bold text-[#111111]">
              ADAMAS UNIVERSITY RESEARCH CHAPTER PERSONNEL ROSTER
            </span>
          </div>
          <Link
            href="/team"
            className="font-bold text-[#111111] hover:underline inline-flex items-center gap-1.5 uppercase tracking-wider"
          >
            <span>FULL GOVERNANCE ROSTER</span>
            <span>→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
