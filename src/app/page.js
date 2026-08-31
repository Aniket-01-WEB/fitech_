'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MatrixCanvas from '@/components/MatrixCanvas';
import { usePortal } from '@/context/PortalContext';

const MONEY_WORDS = ['MONEY', 'PAISA', 'DHARMA', 'ARGENT', 'GELD', 'DINERO', 'CURRENCY', 'CAPITAL'];

const DOMAINS_DATA = [
  {
    num: '01',
    title: 'Quantitative Finance & Algo Trading',
    desc: 'High-frequency order book dynamics, alpha signal generation, statistical arbitrage, and stochastic volatility modeling.',
    tags: ['C++', 'Python', 'Level 2 LOB', 'Backtesting'],
    theme: 'dark'
  },
  {
    num: '02',
    title: 'DeFi & Blockchain Infrastructure',
    desc: 'Automated market makers (AMMs), concentrated liquidity mechanics, zero-knowledge solvency proofs, and MEV searcher bots.',
    tags: ['Solidity', 'Rust', 'zk-SNARKs', 'EVM'],
    theme: 'light'
  },
  {
    num: '03',
    title: 'AI & Machine Learning in Finance',
    desc: 'Transformer networks for market regime forecasting, sentiment extraction from financial SEC filings, and credit scoring.',
    tags: ['PyTorch', 'LLMs', 'Transformer', 'Risk AI'],
    theme: 'blue'
  },
  {
    num: '04',
    title: 'Risk Analytics & Economic Modeling',
    desc: 'Monte Carlo portfolio stress testing, Value at Risk (VaR), Extreme Value Theory (EVT), and liquidity risk management.',
    tags: ['R', 'Monte Carlo', 'VaR', 'Stress Testing'],
    theme: 'light'
  },
  {
    num: '05',
    title: 'High-Frequency Trading & Systems',
    desc: 'Low-latency C++ execution engines, kernel bypass networking (DPDK), and FPGA hardware acceleration.',
    tags: ['Low Latency', 'DPDK', 'FPGA', 'Kernel Bypass'],
    theme: 'dark'
  },
  {
    num: '06',
    title: 'Venture Capital & Fintech Sandbox',
    desc: 'Incubating student fintech startups, pitching angel syndicates, and prototyping tokenomics models.',
    tags: ['Startups', 'Pitching', 'Tokenomics', 'MVPs'],
    theme: 'light'
  }
];

const PROJECTS_DATA = [
  {
    num: '01',
    name: 'Nexus L2 Matching Engine',
    category: 'QUANT SYSTEMS',
    desc: 'Sub-microsecond limit order book matching engine written in C++20 with lock-free ring buffers.',
    tags: ['C++20', 'Lock-Free', 'DPDK', 'HFT']
  },
  {
    num: '02',
    name: 'Zero-Knowledge Solvency Protocol',
    category: 'DEFI / CRYPTOGRAPHY',
    desc: 'Cryptographic proof-of-solvency protocol allowing crypto exchanges to attest reserves via zk-SNARKs.',
    tags: ['Circom', 'Solidity', 'zk-SNARKs', 'DeFi']
  },
  {
    num: '03',
    name: 'Neural Volatility Smile Engine',
    category: 'QUANT RESEARCH',
    desc: 'Deep learning pipeline predicting implied volatility surfaces across multi-asset option chains.',
    tags: ['PyTorch', 'Options', 'SVI', 'ML']
  },
  {
    num: '04',
    name: 'MEV Sandwich Protection RPC',
    category: 'WEB3 INFRASTRUCTURE',
    desc: 'Private transaction routing RPC node shielding retail Swaps from front-running and sandwich attacks.',
    tags: ['Rust', 'Geth', 'MEV', 'Ethereum']
  }
];

const TEAM_DATA = [
  {
    name: 'ANIKET',
    role: 'FOUNDER & PRESIDENT',
    avatar: 'A',
    image: '/prof_file/aniket_prof.jpg',
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'GOURAV',
    role: 'HEAD OF QUANT RESEARCH',
    avatar: 'G',
    image: '/prof_file/gourav_prof.jpg',
    linkedin: 'https://linkedin.com',
    theme: 'theme-white'
  },
  {
    name: 'ADITYA',
    role: 'ALGO TRADING LEAD',
    avatar: 'A',
    image: '/prof_file/aditya_prof.jpg',
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'VANSH',
    role: 'DEFI ARCHITECT',
    avatar: 'V',
    image: '/prof_file/vansh_prof.jpg',
    linkedin: 'https://linkedin.com',
    theme: 'theme-white'
  },
  {
    name: 'PRIYA',
    role: 'AI IN FINANCE LEAD',
    avatar: 'P',
    image: null,
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  }
];

const ORBIT_TAGS = ['QUANT', 'ALGO', 'DEFI', 'AI', 'RISK', 'HFT'];

export default function HomePage() {
  const [moneyWordIndex, setMoneyWordIndex] = useState(0);
  const [eventsTab, setEventsTab] = useState('upcoming');
  const [flippedCards, setFlippedCards] = useState({});
  const { events, openDetailModal, openJoinModal } = usePortal();

  // Hero Money Ticker effect
  useEffect(() => {
    const interval = setInterval(() => {
      setMoneyWordIndex(prev => (prev + 1) % MONEY_WORDS.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const handleCardFlip = (index) => {
    setFlippedCards(prev => ({ ...prev, [index]: !prev[index] }));
  };

  // Only Super-Admin-approved events are ever shown publicly.
  const approvedEvents = events.filter(evt => (evt.status || 'approved') === 'approved');
  const filteredEvents = approvedEvents.filter(evt => {
    if (eventsTab === 'upcoming') return !evt.title.toLowerCase().includes('2025') && !evt.title.toLowerCase().includes('past');
    return evt.title.toLowerCase().includes('2025') || evt.title.toLowerCase().includes('past');
  });

  return (
    <div className="home-wrapper">
      {/* 1. HERO SECTION */}
      <section className="habito-hero">
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <MatrixCanvas />
        </div>

        <div className="habito-container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="habito-hero-top">
            <div className="habito-media-col">
              <div className="habito-showreel-box">
                <div className="habito-showreel-graphic">
                  <div className="habito-cross-lines">
                    <div className="cross-line-h"></div>
                    <div className="cross-line-v"></div>
                  </div>
                  <div className="habito-dot"></div>
                </div>
              </div>
              <div className="habito-media-meta">
                <span className="habito-showreel-caption">MATRIX FINTECH LABS</span>
                <span className="habito-badge-pill">2026 EDITION</span>
              </div>
            </div>

            <div className="habito-title-col">
              <h1 className="habito-main-title">
                WE MAKE
                <br />
                <span className="hero-money-ticker">{MONEY_WORDS[moneyWordIndex]}</span>
                <br />
                WORK FOR YOU
              </h1>
            </div>
          </div>

          <div className="habito-hero-bottom">
            <div>
              <p className="habito-statement-text">
                The premier quantitative finance, computational economics, and financial engineering research society.
              </p>
              <div className="habito-features-strip">
                <span className="habito-feat-tag">✦ High-Frequency Execution</span>
                <span className="habito-feat-tag">✦ AMM Invariants</span>
                <span className="habito-feat-tag">✦ Machine Learning Risk</span>
              </div>
            </div>

            <div className="habito-actions-col">
              <button type="button" onClick={openJoinModal} className="habito-action-link">
                JOIN US <span className="arrow">→</span>
              </button>
            </div>
          </div>
        </div>

        <div className="habito-ticker-bar">
          <div className="habito-ticker-track">
            <div className="habito-ticker-content">
              <span>QUANTITATIVE FINANCE</span><span className="dot">•</span>
              <span>ALGORITHMIC TRADING</span><span className="dot">•</span>
              <span>DECENTRALIZED FINANCE</span><span className="dot">•</span>
              <span>ARTIFICIAL INTELLIGENCE IN MARKETS</span><span className="dot">•</span>
              <span>HIGH FREQUENCY ORDER BOOKS</span><span className="dot">•</span>
            </div>
            <div className="habito-ticker-content">
              <span>QUANTITATIVE FINANCE</span><span className="dot">•</span>
              <span>ALGORITHMIC TRADING</span><span className="dot">•</span>
              <span>DECENTRALIZED FINANCE</span><span className="dot">•</span>
              <span>ARTIFICIAL INTELLIGENCE IN MARKETS</span><span className="dot">•</span>
              <span>HIGH FREQUENCY ORDER BOOKS</span><span className="dot">•</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS STRIP */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">500<span className="stat-plus">+</span></span>
              <span className="stat-label">Active Members</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">12<span className="stat-plus">+</span></span>
              <span className="stat-label">Quant Models Built</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">$2.4M<span className="stat-plus">+</span></span>
              <span className="stat-label">Simulated Trading Vol</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">100<span className="stat-plus">%</span></span>
              <span className="stat-label">Open Source Code</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT SECTION */}
      <section className="habito-about-card-section" style={{ padding: '80px 0' }}>
        <div className="container" style={{ height: '100%' }}>
          <div className="habito-about-marquee">
            <div className="habito-about-marquee-track">
              <div className="habito-about-marquee-content">
                <span>MATRIX FINTECH CLUB</span>
                <svg className="clover-icon" viewBox="0 0 100 100" fill="none"><path d="M50 0C50 27.6142 27.6142 50 0 50C27.6142 50 50 72.3858 50 100C50 72.3858 72.3858 50 100 50C72.3858 50 50 27.6142 50 0Z" fill="#0A0A0A"/></svg>
                <span>QUANTITATIVE RESEARCH</span>
                <svg className="clover-icon" viewBox="0 0 100 100" fill="none"><path d="M50 0C50 27.6142 27.6142 50 0 50C27.6142 50 50 72.3858 50 100C50 72.3858 72.3858 50 100 50C72.3858 50 50 27.6142 50 0Z" fill="#0A0A0A"/></svg>
              </div>
              <div className="habito-about-marquee-content">
                <span>MATRIX FINTECH CLUB</span>
                <svg className="clover-icon" viewBox="0 0 100 100" fill="none"><path d="M50 0C50 27.6142 27.6142 50 0 50C27.6142 50 50 72.3858 50 100C50 72.3858 72.3858 50 100 50C72.3858 50 50 27.6142 50 0Z" fill="#0A0A0A"/></svg>
                <span>QUANTITATIVE RESEARCH</span>
                <svg className="clover-icon" viewBox="0 0 100 100" fill="none"><path d="M50 0C50 27.6142 27.6142 50 0 50C27.6142 50 50 72.3858 50 100C50 72.3858 72.3858 50 100 50C72.3858 50 50 27.6142 50 0Z" fill="#0A0A0A"/></svg>
              </div>
            </div>
          </div>

          <div className="habito-about-grid-container">
            <div className="habito-about-grid">
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: '900', color: '#0a0a0a', lineHeight: '1.05', textTransform: 'uppercase' }}>
                  REDEFINING FINANCIAL TECHNOLOGY AT THE ACADEMIC FRONTIER
                </h2>
              </div>

              <div className="habito-about-right">
                <div className="habito-about-block">
                  <h3 className="habito-about-subtitle">OUR MISSION</h3>
                  <p className="habito-about-desc">
                    MATRIX is dedicated to training the next generation of quantitative developers, financial engineers, and blockchain architects. We bridge academic rigor with real-world institutional execution.
                  </p>
                </div>

                <div className="habito-about-block">
                  <h3 className="habito-about-subtitle">WHAT WE BUILD</h3>
                  <p className="habito-about-desc">
                    From sub-microsecond matching engines in C++ to automated market maker invariants and transformer-based volatility forecasting, our members design end-to-end trading infrastructure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SIX DIMENSIONS OF INNOVATION SECTION */}
      <section className="domains-habito-grid-section" id="domains">
        <div className="container" style={{ marginBottom: '40px' }}>
          <h2 className="section-title">SIX DIMENSIONS OF INNOVATION</h2>
        </div>

        <div className="domains-habito-container">
          {DOMAINS_DATA.slice(0, 3).map((domain, index) => (
            <div key={index} className={`habito-col ${index === 2 ? 'col-wide' : 'col-small'}`}>
              <div className="habito-col-header">
                <span className="habito-col-title">TRACK {domain.num}</span>
                <span className="habito-col-year">2026</span>
              </div>
              <div className={`habito-card habito-card-${domain.theme}`}>
                <div className="habito-card-inner">
                  <span className="habito-card-badge">{domain.num}</span>
                  <h3 className="habito-card-heading">{domain.title}</h3>
                  <p className="habito-card-text">{domain.desc}</p>
                  <div className="habito-card-tags">
                    {domain.tags.map((tag, tIdx) => (
                      <span key={tIdx}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="domains-habito-container alt-layout" style={{ marginTop: '24px' }}>
          {DOMAINS_DATA.slice(3, 6).map((domain, index) => (
            <div key={index} className={`habito-col ${index === 0 ? 'col-wide' : 'col-small'}`}>
              <div className="habito-col-header">
                <span className="habito-col-title">TRACK {domain.num}</span>
                <span className="habito-col-year">2026</span>
              </div>
              <div className={`habito-card habito-card-${domain.theme}`}>
                <div className="habito-card-inner">
                  <span className="habito-card-badge">{domain.num}</span>
                  <h3 className="habito-card-heading">{domain.title}</h3>
                  <p className="habito-card-text">{domain.desc}</p>
                  <div className="habito-card-tags">
                    {domain.tags.map((tag, tIdx) => (
                      <span key={tIdx}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. EVENTS MARQUEE SECTION */}
      <section className="section" id="events" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
            <h2 className="section-title" style={{ margin: 0 }}>EVENTS & MASTERCLASSES</h2>

            <div className="events-tabs">
              <button
                type="button"
                className={`tab-btn ${eventsTab === 'upcoming' ? 'active' : ''}`}
                onClick={() => setEventsTab('upcoming')}
              >
                UPCOMING
              </button>
              <button
                type="button"
                className={`tab-btn ${eventsTab === 'past' ? 'active' : ''}`}
                onClick={() => setEventsTab('past')}
              >
                PAST SESSIONS
              </button>
            </div>
          </div>

          <div className="events-marquee-wrapper">
            <div className="events-marquee-track">
              {filteredEvents.map((evt, idx) => (
                <div
                  key={evt.id}
                  className={`event-card ${idx % 2 === 0 ? 'theme-white' : 'theme-black'}`}
                  onClick={() => openDetailModal(evt)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="event-image" style={{ background: evt.banner || 'linear-gradient(135deg, #0f172a, #1e293b)' }}>
                    <span className="event-category">{evt.type || 'Event'}</span>
                  </div>
                  <div className="event-body">
                    <h3 className="event-name">{evt.title}</h3>
                    <div className="event-meta">
                      <span>📅 {evt.time}</span>
                      <span>📍 {evt.venue}</span>
                    </div>
                    <p className="event-desc">{evt.description}</p>
                    <span className="text-link">View Details & Register →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURED PROJECTS SECTION */}
      <section className="section" id="projects">
        <div className="container">
          <h2 className="section-title">FEATURED LAB BUILDS</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {PROJECTS_DATA.map((proj, idx) => (
              <div key={idx} className="simple-event-card">
                <div className="simple-card-top">
                  <span className="simple-card-category">{proj.category}</span>
                  <h3 className="simple-card-title">{proj.name}</h3>
                  <p className="simple-card-desc">{proj.desc}</p>
                </div>
                <div className="simple-card-bottom">
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {proj.tags.map((t, i) => (
                      <span key={i} className="projects-reveal-card-tag">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CORE TEAM SECTION */}
      <section className="section" id="team" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div className="container">
          <h2 className="section-title">CORE LEADERSHIP</h2>

          <div className="team-marquee-wrapper">
            <div className="team-marquee-track">
              {TEAM_DATA.map((member, idx) => (
                <div
                  key={idx}
                  className={`team-card ${member.theme} ${flippedCards[idx] ? 'flipped' : ''}`}
                  onClick={() => handleCardFlip(idx)}
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
                      <p style={{ fontSize: '12px', lineHeight: '1.5', margin: '12px 0' }}>
                        Leading research and software architecture for MATRIX FinTech Club.
                      </p>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="team-linkedin"
                        onClick={(e) => e.stopPropagation()}
                      >
                        LinkedIn ↗
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. BENEFITS TICKER SECTION */}
      <section className="benefits section">
        <div className="benefits-bg-ticker">
          <div className="benefits-ticker-track">
            <span>MATRIX FINTECH CLUB</span>
            <span>QUANT RESEARCH SOCIETY</span>
            <span>BUILD THE FUTURE</span>
          </div>
        </div>

        <div className="container">
          <h2 className="section-title" style={{ color: '#0f172a' }}>MORE THAN A CLUB</h2>

          <div className="benefits-grid">
            <div className="benefit-card">
              <h3 className="benefit-title">Institutional Quant Codebases</h3>
              <p className="benefit-desc">
                Access production-ready C++ matching engine templates, Python backtesting frameworks, and Solidity smart contract audit toolkits.
              </p>
            </div>
            <div className="benefit-card">
              <h3 className="benefit-title">Industry Research Grants</h3>
              <p className="benefit-desc">
                Receive compute credits, dataset access (Level 2 order books, tick data), and research stipends for published technical whitepapers.
              </p>
            </div>
            <div className="benefit-card">
              <h3 className="benefit-title">Direct Hedge Fund Placement</h3>
              <p className="benefit-desc">
                Fast-track interview referrals to leading quantitative hedge funds, algorithmic trading desks, and DeFi protocols.
              </p>
            </div>
            <div className="benefit-card">
              <h3 className="benefit-title">National Hackathon Incubator</h3>
              <p className="benefit-desc">
                Form high-caliber teams for national hackathons with mentorship from senior fintech founders and quantitative strategists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CTA ORBIT SECTION */}
      <section className="cta-section">
        <div className="cta-canvas">
          <MatrixCanvas />
        </div>
        <div className="cta-overlay"></div>

        <div className="cta-content container">
          <h2 className="cta-title">READY TO SHAPE FINANCIAL TECH?</h2>
          <p className="cta-desc">
            Join hundreds of student quants, developers, and researchers building institutional fintech infrastructure.
          </p>
          <div className="cta-buttons" style={{ marginTop: '24px' }}>
            <button type="button" onClick={openJoinModal} className="cta-join-btn">
              APPLY FOR MEMBERSHIP →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
