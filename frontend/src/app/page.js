'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePortal } from '@/context/PortalContext';

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
    theme: 'dark'
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
  }
];

const TEAM_DATA = [
  {
    name: 'ARIJIT DEY',
    role: 'PRESIDENT',
    avatar: 'A',
    image: null,
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'DIGANT MISHRA',
    role: 'PRESIDENT',
    avatar: 'D',
    image: null,
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'PRITESH SHRIVASTAV',
    role: 'V. PRESIDENT',
    avatar: 'P',
    image: '/prof_file/pritesh.jpeg',
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'SHIVAM JAISWAL',
    role: 'V. PRESIDENT',
    avatar: 'S',
    image: null,
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'SOUVIK BANDOPADHYA',
    role: 'SECRETARY',
    avatar: 'S',
    image: '/prof_file/souvik.jpeg',
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'AVIRUP CHATTERJEE',
    role: 'JT. SECRETARY',
    avatar: 'A',
    image: null,
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'ARNAB MANDAL',
    role: 'MEDIA LEAD',
    avatar: 'A',
    image: null,
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'AZAD HUSSAIN',
    role: 'ASST. MEDIA',
    avatar: 'A',
    image: null,
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'NORCHEN GOLAY',
    role: 'ASST. MEDIA',
    avatar: 'N',
    image: null,
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'ANIKET DUTTA',
    role: 'TECH LEAD',
    avatar: 'A',
    image: '/prof_file/aniket.jpeg',
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'SHORYA SINGH',
    role: 'ASST. TECH',
    avatar: 'S',
    image: null,
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'AYUSH JAISWAL',
    role: 'ASST. TECH',
    avatar: 'A',
    image: null,
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'GOURAV GHOSH',
    role: 'DESIGN LEAD',
    avatar: 'G',
    image: '/prof_file/Gourav.jpeg',
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'PRITAM BARAI',
    role: 'ASST. DESIGN',
    avatar: 'P',
    image: null,
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'SAYAN SHEIKH',
    role: 'SOCIAL LEAD',
    avatar: 'S',
    image: null,
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'PRIYAM CHHETRI',
    role: 'ASST. SOCIAL',
    avatar: 'P',
    image: null,
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  },
  {
    name: 'DEBJIT MODAK',
    role: 'DOCUMENTATION',
    avatar: 'D',
    image: '/prof_file/debjit.jpeg',
    linkedin: 'https://linkedin.com',
    theme: 'theme-black'
  }
];

const ORBIT_TAGS = ['QUANT', 'ALGO', 'DEFI', 'AI', 'RISK', 'HFT'];

export default function HomePage() {
  const [eventsTab, setEventsTab] = useState('upcoming');
  const [flippedCards, setFlippedCards] = useState({});
  const { events, openDetailModal, openJoinModal } = usePortal();

  const teamWrapperRef = useRef(null);
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const isDraggingRef = useRef(false);
  const [isGrabbing, setIsGrabbing] = useState(false);

  // Team Slider drag setup
  useEffect(() => {
    const wrapper = teamWrapperRef.current;
    if (!wrapper) return;
    wrapper.scrollLeft = 0;
  }, []);

  const handleTeamMouseDown = (e) => {
    isMouseDownRef.current = true;
    isDraggingRef.current = false;
    const wrapper = teamWrapperRef.current;
    if (!wrapper) return;
    startXRef.current = e.pageX - wrapper.offsetLeft;
    scrollLeftRef.current = wrapper.scrollLeft;
    setIsGrabbing(true);
  };

  const handleTeamMouseMove = (e) => {
    if (!isMouseDownRef.current) return;
    const wrapper = teamWrapperRef.current;
    if (!wrapper) return;
    e.preventDefault();
    const x = e.pageX - wrapper.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 5) {
      isDraggingRef.current = true;
    }
    wrapper.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleTeamMouseUp = () => {
    isMouseDownRef.current = false;
    setIsGrabbing(false);
  };

  const handleTeamTouchStart = (e) => {
    isMouseDownRef.current = true;
    isDraggingRef.current = false;
    const wrapper = teamWrapperRef.current;
    if (!wrapper) return;
    startXRef.current = e.touches[0].pageX - wrapper.offsetLeft;
    scrollLeftRef.current = wrapper.scrollLeft;
  };

  const handleTeamTouchMove = (e) => {
    if (!isMouseDownRef.current) return;
    const wrapper = teamWrapperRef.current;
    if (!wrapper) return;
    const x = e.touches[0].pageX - wrapper.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 5) {
      isDraggingRef.current = true;
    }
    wrapper.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleTeamTouchEnd = () => {
    isMouseDownRef.current = false;
  };

  const handleCardFlip = (index) => {
    if (isDraggingRef.current) return;
    setFlippedCards(prev => ({ ...prev, [index]: !prev[index] }));
  };

  // Only Super-Admin-approved events are ever shown publicly.
  const approvedEvents = events.filter(evt => (evt.status || 'approved') === 'approved');
  const upcomingEvents = approvedEvents.filter(evt => !evt.title.toLowerCase().includes('2025') && !evt.title.toLowerCase().includes('past'));
  const pastEvents = approvedEvents.filter(evt => evt.title.toLowerCase().includes('2025') || evt.title.toLowerCase().includes('past'));
  const visibleEvents = eventsTab === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <div className="home-wrapper">
      {/* 1. HERO SECTION */}
      <section className="habito-hero">
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
                MONEY
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
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
              <button type="button" onClick={openJoinModal} className="habito-action-link">
                JOIN US <span className="arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT SECTION */}
      <section className="habito-about-card-section" style={{ padding: '80px 0' }} id="about">
        <div className="habito-container" style={{ height: '100%' }}>
          <div style={{ textAlign: 'center', width: '100%' }}>
            <h2 className="about-section-heading">AboutUs</h2>
          </div>

          <div className="habito-about-grid-container">
            <div className="habito-about-grid">
              <div className="habito-about-left">
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
      <section className="domains-habito-grid-section" id="domains" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div className="habito-container" style={{ marginBottom: '40px' }}>
          <h2 className="section-title" style={{ fontSize: 'clamp(44px, 6.8vw, 84px)', margin: 0 }}>
            SIX DIMENSIONS OF INNOVATION
          </h2>
        </div>

        <div className="domains-habito-container">
          {DOMAINS_DATA.map((domain, index) => (
            <div key={index} className="habito-col">
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
      <section className="section" id="events" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '48px 0 24px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
            <h2 className="section-title" style={{ margin: 0, maxWidth: 'none', whiteSpace: 'nowrap', fontSize: 'clamp(24px, 4vw, 56px)' }}>EVENTS & MASTERCLASSES</h2>

            <div className="events-tabs" style={{ position: 'relative', top: '3px' }}>
              <div
                className="events-tabs-indicator"
                style={{
                  transform: eventsTab === 'upcoming' ? 'translateX(0)' : 'translateX(calc(100% + 4px))'
                }}
              />
              <button
                type="button"
                className={`tab-btn ${eventsTab === 'upcoming' ? 'active' : ''}`}
                onClick={() => setEventsTab('upcoming')}
                style={{ fontSize: '14px', fontWeight: '700', padding: '10px 22px' }}
              >
                UPCOMING
              </button>
              <button
                type="button"
                className={`tab-btn ${eventsTab === 'past' ? 'active' : ''}`}
                onClick={() => setEventsTab('past')}
                style={{ fontSize: '14px', fontWeight: '700', padding: '10px 22px' }}
              >
                PAST
              </button>
            </div>
          </div>

          <div className="events-marquee-wrapper">
            {visibleEvents.length === 0 ? (
              <div className="empty-events-box">
                <p className="empty-events-text">{eventsTab === 'upcoming' ? 'No upcoming events.' : 'No past events yet.'}</p>
              </div>
            ) : (
              <div className="events-marquee-track">
                {visibleEvents.map((evt, idx) => (
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
            )}
          </div>
        </div>
      </section>

      {/* 6. FEATURED PROJECTS SECTION */}
      <section className="section" id="projects">
        <div className="container" style={{ maxWidth: '100%', padding: '0 clamp(24px, 5vw, 64px)' }}>
          <h2 className="section-title" style={{ margin: '0 0 48px 0', textAlign: 'left', maxWidth: 'none' }}>FEATURED LAB BUILDS</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <h2 className="section-title" style={{ margin: 0 }}>CORE LEADERSHIP</h2>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>←</span> Pull or drag with cursor to see more cards <span>→</span>
            </span>
          </div>

          <div
            ref={teamWrapperRef}
            className={`team-marquee-wrapper ${isGrabbing ? 'is-grabbing' : ''}`}
            onMouseDown={handleTeamMouseDown}
            onMouseMove={handleTeamMouseMove}
            onMouseUp={handleTeamMouseUp}
            onMouseLeave={handleTeamMouseUp}
            onTouchStart={handleTeamTouchStart}
            onTouchMove={handleTeamTouchMove}
            onTouchEnd={handleTeamTouchEnd}
          >
            <div className="team-marquee-track">
              {TEAM_DATA.map((member, idx) => (
                <div key={idx} className="team-card">
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="team-card-image" />
                  ) : (
                    <div className="team-card-fallback">
                      <div className="team-card-fallback-avatar">
                        {member.avatar || member.name.charAt(0)}
                      </div>
                    </div>
                  )}
                  <div className="team-card-gradient-overlay" />
                  <div className="team-card-info">
                    <div className="team-card-text">
                      <h3 className="team-card-name">{member.name}</h3>
                      <p className="team-card-role">{member.role}</p>
                    </div>
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="team-card-linkedin"
                        title={`${member.name} on LinkedIn`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25c-.9 0-1.63.73-1.63 1.63 0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63 0-.9-.73-1.63-1.63-1.63Z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. BENEFITS TICKER SECTION */}
      <section className="benefits section" style={{ padding: '80px 0 100px 0' }}>
        <div className="container" style={{ maxWidth: '100%', padding: '0 clamp(24px, 5vw, 64px)' }}>
          <h2 className="more-than-club-title">MORE THAN A COMMUNITY</h2>

          <div className="benefits-grid">
            <div className="benefit-card">
              <h3 className="benefit-title">Institutional Quant Codebases</h3>
              <p className="benefit-desc">
                Access production-ready C++ matching engine templates, Python backtesting frameworks, and Solidity smart contract audit toolkits. Build, test, and experiment with quantitative strategies using industry-inspired development workflows.
              </p>
            </div>
            <div className="benefit-card">
              <h3 className="benefit-title">Industry Research Grants</h3>
              <p className="benefit-desc">
                Receive compute credits, dataset access (Level 2 order books, tick data), and research stipends for published technical whitepapers. Explore emerging financial technologies and turn your ideas into structured research with practical industry applications.
              </p>
            </div>
            <div className="benefit-card">
              <h3 className="benefit-title">Direct Hedge Fund Placement</h3>
              <p className="benefit-desc">
                Fast-track interview referrals to leading quantitative hedge funds, algorithmic trading desks, and DeFi protocols. Gain exposure to real-world opportunities while connecting with professionals working across quantitative finance and financial technology.
              </p>
            </div>
            <div className="benefit-card">
              <h3 className="benefit-title">National Hackathon Incubator</h3>
              <p className="benefit-desc">
                Form high-caliber teams for national hackathons with mentorship from senior fintech founders and quantitative strategists. Get guidance from idea development to deployment while building solutions around real financial and technological challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CTA ORBIT SECTION */}
      <section className="cta-section">
        <div className="cta-overlay"></div>

        <div className="cta-content container">
          <h2 className="cta-title" style={{ fontSize: 'clamp(44px, 7vw, 86px)', marginBottom: '24px', letterSpacing: '0.5px', lineHeight: '1.1' }}>
            READY TO SHAPE FINANCIAL TECH?
          </h2>
          <p className="cta-desc" style={{ maxWidth: '860px', marginBottom: '32px', fontSize: 'clamp(17px, 2vw, 21px)', lineHeight: '1.6' }}>
            Learn, build, and explore the intersection of finance and technology through real-world projects, research, and innovation. Discover new ideas, develop practical skills, and shape the future of fintech
          </p>
          <div className="cta-buttons" style={{ marginTop: '16px' }}>
            <button type="button" onClick={openJoinModal} className="cta-join-btn">
              JOIN OUR COMMUNITY →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
