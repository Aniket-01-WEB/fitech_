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
  image: string | null;
  linkedin?: string;
  featured?: boolean;
}

const FEATURED_LEADERS: TeamMember[] = [
  {
    num: '01',
    name: 'Pritesh Shrivastav',
    role: 'V. President',
    dept: 'Executive',
    domain: 'Quantitative Development',
    image: '/images/team/pritesh.jpeg',
    linkedin: 'https://linkedin.com',
  },
  {
    num: '02',
    name: 'Souvik Bandopadhyay',
    role: 'Secretary',
    dept: 'Executive',
    domain: 'Institutional Administration',
    image: '/images/team/souvik.jpeg',
    linkedin: 'https://linkedin.com',
  },
  {
    num: '03',
    name: 'Aniket Dutta',
    role: 'Tech Lead',
    dept: 'Engineering',
    domain: 'Systems & Infrastructure',
    image: '/images/team/aniket.jpeg',
    linkedin: 'https://linkedin.com',
  },
  {
    num: '04',
    name: 'Gourav Ghosh',
    role: 'Design Lead',
    dept: 'Creative',
    domain: 'Visual Architecture & Design',
    image: '/images/team/gourav.jpeg',
    linkedin: 'https://linkedin.com',
  },
  {
    num: '05',
    name: 'Debjit Modak',
    role: 'Documentation Lead',
    dept: 'Archive',
    domain: 'Research Archives & Minutes',
    image: '/images/team/debjit.jpeg',
    linkedin: 'https://linkedin.com',
  },
];

const FULL_ROSTER: TeamMember[] = [
  { num: '01', name: 'Arijit Dey', role: 'President', dept: 'Executive', domain: 'Executive Governance & Strategy', image: null },
  { num: '02', name: 'Digant Mishra', role: 'President', dept: 'Executive', domain: 'Research Fellowships & Symposia', image: null },
  { num: '03', name: 'Pritesh Shrivastav', role: 'V. President', dept: 'Executive', domain: 'Quantitative Development', image: '/images/team/pritesh.jpeg' },
  { num: '04', name: 'Shivam Jaiswal', role: 'V. President', dept: 'Executive', domain: 'Operations & Outreach', image: null },
  { num: '05', name: 'Souvik Bandopadhyay', role: 'Secretary', dept: 'Executive', domain: 'Institutional Administration', image: '/images/team/souvik.jpeg' },
  { num: '06', name: 'Avirup Chatterjee', role: 'Jt. Secretary', dept: 'Executive', domain: 'Academic Liaison', image: null },
  { num: '07', name: 'Aniket Dutta', role: 'Tech Lead', dept: 'Engineering', domain: 'Systems & Infrastructure', image: '/images/team/aniket.jpeg' },
  { num: '08', name: 'Shorya Singh', role: 'Asst. Tech', dept: 'Engineering', domain: 'HFT & Low-Latency C++', image: null },
  { num: '09', name: 'Ayush Jaiswal', role: 'Asst. Tech', dept: 'Engineering', domain: 'Financial AI & Quant', image: null },
  { num: '10', name: 'Arnab Mandal', role: 'Media Lead', dept: 'Communications', domain: 'Research Publications & Broadcast', image: null },
  { num: '11', name: 'Azad Hussain', role: 'Asst. Media', dept: 'Communications', domain: 'Digital Media & Coverage', image: null },
  { num: '12', name: 'Gourav Ghosh', role: 'Design Lead', dept: 'Creative', domain: 'Visual Architecture & Design', image: '/images/team/gourav.jpeg' },
  { num: '13', name: 'Priyanshu Verma', role: 'Asst. Design', dept: 'Creative', domain: 'Editorial & Technical Graphics', image: null },
  { num: '14', name: 'Sayan Sheikh', role: 'Social Lead', dept: 'Community', domain: 'Community Network & Relations', image: null },
  { num: '15', name: 'Priyom Chhetree', role: 'Asst. Social', dept: 'Community', domain: 'External Relations & Sponsorships', image: null },
  { num: '16', name: 'Debjit Modak', role: 'Documentation', dept: 'Archive', domain: 'Archival Records & Minutes', image: '/images/team/debjit.jpeg' },
];

export default function TeamSection() {
  const [showFullDirectory, setShowFullDirectory] = useState(false);

  return (
    <section id="team" className="relative w-full bg-[#FFFFFF] py-14 md:py-20 lg:py-24 border-b border-[#DADADA]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
        
        {/* Section Marker */}
        <div className="flex items-center justify-between pb-4 mb-8 sm:mb-10 border-b border-[#DADADA] font-mono text-[11px] text-[#6B6B6B] tracking-wider uppercase">
          <span>06 / PEOPLE INDEX & GOVERNANCE</span>
          <span>FELLOWSHIP DIRECTORY // 2026</span>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 sm:mb-8">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#EAEAEA] text-[#0A0A0A] font-mono text-[10px] uppercase tracking-wider inline-block mb-4">
              06 // ROSTER
            </span>
            <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal text-[#0A0A0A] tracking-tight leading-[0.92]">
              Fellowship
              <br />
              <span className="italic">Directory.</span>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#4A4A4A] font-sans-body max-w-md leading-relaxed font-light">
            The student fellows governing engineering divisions, quantitative models, research publications, and guild operations at Adamas University.
          </p>
        </div>

        {/* Stanzza 5-Column Editorial Portrait Grid (100% VISIBLE) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6 sm:mb-8">
          {FEATURED_LEADERS.map((leader, idx) => (
            <div
              key={idx}
              className="group bg-[#F2F2F2] rounded-3xl p-4 border border-[#DADADA] hover:border-[#0A0A0A] transition-all duration-300"
              style={{ boxShadow: '0 8px 24px rgba(30,30,30,0.03)' }}
            >
              <div className="relative w-full aspect-[4/4.8] rounded-2xl overflow-hidden bg-[#0A0A0A] mb-4 border border-[#DADADA]">
                <img
                  src={leader.image!}
                  alt={leader.name}
                  className="w-full h-full object-cover transition-all duration-700"
                />
                <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-[#0A0A0A]/80 text-[#FFFFFF] font-mono text-[9px] uppercase tracking-wider backdrop-blur-md">
                  {leader.role}
                </div>
              </div>

              <div className="px-1">
                <div className="font-mono text-[10px] text-[#6B6B6B] uppercase mb-1">
                  NO. 0{idx + 1} {"//"} {leader.dept}
                </div>
                <h4 className="font-serif text-2xl font-normal text-[#0A0A0A] leading-snug group-hover:underline">
                  {leader.name}
                </h4>
                <p className="font-sans-body text-xs text-[#4A4A4A] mt-1 font-light">
                  {leader.domain}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Governance Directory Toggle */}
        <div className="pt-8 border-t border-[#DADADA] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="font-mono text-xs text-[#6B6B6B] uppercase tracking-wider">
            GOVERNANCE DIRECTORY & APPOINTMENTS (16 VERIFIED FELLOWS)
          </span>

          <button
            type="button"
            onClick={() => setShowFullDirectory(!showFullDirectory)}
            className="stanzza-btn-pill stanzza-btn-light"
          >
            <span>{showFullDirectory ? 'Hide Full Directory' : 'View Full 16-Fellow Ledger'}</span>
            <span>{showFullDirectory ? '↑' : '↓'}</span>
          </button>
        </div>

        {/* Collapsible Directory Ledger */}
        <AnimatePresence>
          {showFullDirectory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 overflow-hidden"
            >
              <div className="divide-y divide-[#DADADA] border-t border-b border-[#DADADA]">
                {FULL_ROSTER.map((member, idx) => (
                  <div
                    key={idx}
                    className="py-4 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#F2F2F2] rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-[#6B6B6B]">
                        {member.num} {"//"}
                      </span>
                      <span className="font-serif text-xl text-[#0A0A0A]">
                        {member.name}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#EAEAEA] text-[#0A0A0A] font-mono text-[9px] uppercase">
                        {member.role}
                      </span>
                    </div>

                    <div className="font-sans-body text-xs text-[#4A4A4A] sm:text-right font-light">
                      {member.domain}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
