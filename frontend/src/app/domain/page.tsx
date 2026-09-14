'use client';

import React from 'react';
import Link from 'next/link';
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

export default function DomainPage() {
  const { openJoinModal } = usePortal();

  return (
    <div className="simple-events-shell">
      <div className="simple-events-header">
        <div className="simple-events-title-wrap">
          <h1 className="simple-events-main-title">INNOVATION TRACKS</h1>
          <p className="simple-events-subtitle">Explore the six specialized domains powering MATRIX FinTech research.</p>
        </div>
        <Link href="/" className="simple-back-btn">
          ← BACK TO HOME
        </Link>
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

      <div style={{ marginTop: '64px', textAlign: 'center' }}>
        <button type="button" onClick={openJoinModal} className="btn btn-primary btn-lg">
          APPLY TO JOIN A TRACK NOW <span className="arrow">→</span>
        </button>
      </div>
    </div>
  );
}
