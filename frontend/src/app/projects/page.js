'use client';

import React from 'react';
import Link from 'next/link';

const ALL_PROJECTS = [
  {
    num: '01',
    name: 'Nexus L2 Matching Engine',
    category: 'QUANT SYSTEMS',
    desc: 'Sub-microsecond limit order book matching engine written in C++20 with lock-free ring buffers, DPDK kernel bypass, and memory-mapped queue persistence.',
    tags: ['C++20', 'Lock-Free', 'DPDK', 'HFT', 'Memory-Mapped']
  },
  {
    num: '02',
    name: 'Zero-Knowledge Solvency Protocol',
    category: 'DEFI / CRYPTOGRAPHY',
    desc: 'Cryptographic proof-of-solvency protocol allowing centralized & decentralized exchanges to attest liabilities and reserve balances via zk-SNARK circuits without revealing account balances.',
    tags: ['Circom', 'Solidity', 'zk-SNARKs', 'DeFi', 'snarkjs']
  },
  {
    num: '03',
    name: 'Neural Volatility Smile Engine',
    category: 'QUANT RESEARCH',
    desc: 'Deep learning pipeline utilizing temporal convolutional networks to reconstruct and forecast implied volatility surfaces across equity and crypto option chains in real time.',
    tags: ['PyTorch', 'Options', 'SVI', 'ML', 'Python']
  },
  {
    num: '05',
    name: 'QuantRisk Monte Carlo Engine',
    category: 'RISK ANALYTICS',
    desc: 'Distributed GPU-accelerated Monte Carlo stress testing system computing Value at Risk (VaR) and Expected Shortfall (ES) for multi-asset institutional portfolios.',
    tags: ['CUDA', 'C++', 'Monte Carlo', 'VaR', 'Risk']
  },
  {
    num: '06',
    name: 'SEC Filing Sentiment Analyzer',
    category: 'AI IN FINANCE',
    desc: 'Domain-adapted Transformer model processing 10-K and 10-Q SEC filings to detect management sentiment shifts and predict post-earnings announcement drift.',
    tags: ['BERT', 'NLP', 'SEC Filings', 'Python', 'LLM']
  }
];

export default function ProjectsPage() {
  return (
    <div className="simple-events-shell">
      <div className="simple-events-header">
        <div className="simple-events-title-wrap">
          <h1 className="simple-events-main-title">LAB BUILDS & OPEN SOURCE</h1>
          <p className="simple-events-subtitle">Explore open-source quantitative engines, cryptographic protocols, and AI pipelines built by MATRIX members.</p>
        </div>
        <Link href="/" className="simple-back-btn">
          ← BACK TO HOME
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px' }}>
        {ALL_PROJECTS.map((proj, idx) => (
          <div key={idx} className="lab-card-container">
            <div className="simple-event-card lab-build-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div className="simple-card-top">
                <span className="simple-card-category">{proj.category}</span>
                <h3 className="simple-card-title">{proj.name}</h3>
                <p className="simple-card-desc" style={{ fontSize: '14px', lineHeight: '1.6' }}>{proj.desc}</p>
              </div>
              <div className="simple-card-bottom">
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {proj.tags.map((t, i) => (
                    <span key={i} className="projects-reveal-card-tag">{t}</span>
                  ))}
                </div>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="simple-action-btn"
                  style={{ textAlign: 'center', width: '100%', display: 'inline-block' }}
                >
                  VIEW REPOSITORY ON GITHUB ↗
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
