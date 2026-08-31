'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const TEAM_DATA = [
  {
    name: 'ANIKET',
    role: 'FOUNDER & PRESIDENT',
    avatar: 'A',
    image: '/prof_file/aniket_prof.jpg',
    bio: 'Pioneering quantitative finance architecture and research society leadership.',
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'GOURAV',
    role: 'HEAD OF QUANT RESEARCH',
    avatar: 'G',
    image: '/prof_file/gourav_prof.jpg',
    bio: 'Specializing in order book simulation engines and statistical arbitrage models.',
    linkedin: 'https://linkedin.com',
    theme: 'theme-white'
  },
  {
    name: 'ADITYA',
    role: 'ALGO TRADING LEAD',
    avatar: 'A',
    image: '/prof_file/aditya_prof.jpg',
    bio: 'High-frequency low-latency execution engines in C++20 and DPDK.',
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'VANSH',
    role: 'DEFI ARCHITECT',
    avatar: 'V',
    image: '/prof_file/vansh_prof.jpg',
    bio: 'Automated market maker invariants, concentrated liquidity, and zk-SNARK solvency proofs.',
    linkedin: 'https://linkedin.com',
    theme: 'theme-white'
  },
  {
    name: 'PRIYA PATEL',
    role: 'AI IN FINANCE LEAD',
    avatar: 'P',
    image: null,
    bio: 'Transformer models for implied volatility surface forecasting and SEC filing sentiment.',
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'RAHUL SHARMA',
    role: 'RISK ANALYTICS LEAD',
    avatar: 'R',
    image: null,
    bio: 'Monte Carlo stress testing frameworks, Value at Risk (VaR), and liquidity management.',
    linkedin: 'https://linkedin.com',
    theme: 'theme-white'
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
            className={`team-card ${member.theme} ${flippedCards[idx] ? 'flipped' : ''}`}
            onClick={() => handleCardFlip(idx)}
            style={{ width: '100%', height: '360px' }}
          >
            <div className="flip-card-inner">
              <div className={`flip-card-front ${member.image ? 'has-bg-img' : ''}`} style={member.image ? { backgroundImage: `url(${member.image})` } : {}}>
                {!member.image && <div className="team-avatar">{member.avatar}</div>}
                <h3 className="team-name">{member.name}</h3>
                <span className="team-role-label">{member.role}</span>
                <span className="flip-hint">TAP TO FLIP ↵</span>
              </div>

              <div className="flip-card-back">
                <h3 className="team-name">{member.name}</h3>
                <span className="team-role">{member.role}</span>
                <p style={{ fontSize: '13px', lineHeight: '1.6', margin: '16px 0' }}>{member.bio}</p>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team-linkedin"
                  onClick={(e) => e.stopPropagation()}
                >
                  LinkedIn Profile ↗
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
