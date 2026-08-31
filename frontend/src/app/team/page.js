'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const TEAM_DATA = [
  {
    name: 'ARIJIT DEY',
    role: 'PRESIDENT',
    avatar: 'A',
    image: null,
    bio: 'Leading overall vision, strategic partnerships, and operations for MATRIX FinTech Club.',
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'DIGANT MISHRA',
    role: 'PRESIDENT',
    avatar: 'D',
    image: null,
    bio: 'Co-leading society expansion, financial engineering initiatives, and research output.',
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'PRITESH SHRIVASTAV',
    role: 'V. PRESIDENT',
    avatar: 'P',
    image: '/prof_file/pritesh.jpeg',
    bio: 'Managing internal operations, core project execution, and cross-team coordination.',
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'SHIVAM JAISWAL',
    role: 'V. PRESIDENT',
    avatar: 'S',
    image: null,
    bio: 'Directing vice-presidential affairs, member engagement, and academic workshops.',
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'SOUVIK BANDOPADHYA',
    role: 'SECRETARY',
    avatar: 'S',
    image: '/prof_file/souvik.jpeg',
    bio: 'Overseeing governance, administration, and official communication channels.',
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'AVIRUP CHATTERJEE',
    role: 'JT. SECRETARY',
    avatar: 'A',
    image: null,
    bio: 'Assisting in administrative workflow, event scheduling, and member records.',
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'ARNAB MANDAL',
    role: 'MEDIA LEAD',
    avatar: 'A',
    image: null,
    bio: 'Heading digital media strategies, public relations, and promotional campaigns.',
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'AZAD HUSSAIN',
    role: 'ASST. MEDIA',
    avatar: 'A',
    image: null,
    bio: 'Supporting content distribution, media assets creation, and outreach.',
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'NORCHEN GOLAY',
    role: 'ASST. MEDIA',
    avatar: 'N',
    image: null,
    bio: 'Managing media operations, event coverage, and digital footprint.',
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'ANIKET DUTTA',
    role: 'TECH LEAD',
    avatar: 'A',
    image: '/prof_file/aniket.jpeg',
    bio: 'Leading quantitative platform architecture, low-latency engines, and web infrastructure.',
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'SHORYA SINGH',
    role: 'ASST. TECH',
    avatar: 'S',
    image: null,
    bio: 'Developing financial tools, algorithm pipelines, and open-source packages.',
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'AYUSH JAISWAL',
    role: 'ASST. TECH',
    avatar: 'A',
    image: null,
    bio: 'Assisting in full-stack web development, quantitative research tooling, and APIs.',
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'GOURAV GHOSH',
    role: 'DESIGN LEAD',
    avatar: 'G',
    image: '/prof_file/Gourav.jpeg',
    bio: 'Crafting visual design language, UI/UX design systems, and brand identity.',
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'PRITAM BARAI',
    role: 'ASST. DESIGN',
    avatar: 'P',
    image: null,
    bio: 'Assisting in visual assets, branding graphics, and interface prototyping.',
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'SAYAN SHEIKH',
    role: 'SOCIAL LEAD',
    avatar: 'S',
    image: null,
    bio: 'Directing community engagement, social media channels, and public relations.',
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'PRIYAM CHHETRI',
    role: 'ASST. SOCIAL',
    avatar: 'P',
    image: null,
    bio: 'Managing community interactions, online discussions, and event publicity.',
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'DEBJIT MODAK',
    role: 'DOCUMENTATION',
    avatar: 'D',
    image: '/prof_file/debjit.jpeg',
    bio: 'Curating research documentation, society archives, and technical reports.',
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  }
];

export default function TeamPage() {
  const [flippedCards, setFlippedCards] = useState({});

  const handleCardFlip = (index) => {
    setFlippedCards(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="simple-events-shell">
      <div className="simple-events-header">
        <div className="simple-events-title-wrap">
          <h1 className="simple-events-main-title">CORE LEADERSHIP & TEAM</h1>
          <p className="simple-events-subtitle">Meet the team driving research, codebases, and operations at MATRIX FinTech Club.</p>
        </div>
        <Link href="/" className="simple-back-btn">
          ← BACK TO HOME
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '28px' }}>
        {TEAM_DATA.map((member, idx) => (
          <div
            key={idx}
            className="team-card theme-black"
            style={{ width: '100%', height: '380px' }}
          >
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <div className="team-image-frame">
                  {member.image && (
                    <img src={member.image} alt={member.name} className="team-img" />
                  )}
                </div>
                <h3 className="team-name">{member.name}</h3>
                <span className="team-role-pill">{member.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
