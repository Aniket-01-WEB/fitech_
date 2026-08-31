'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePortal } from '@/context/PortalContext';

export default function Footer() {
  const { openJoinModal } = usePortal();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-manifesto">
          ENGINEERING THE FUTURE
          <span
            className="plus-icon-spin"
            title="Hover to rotate"
          >
            <svg
              width="0.75em"
              height="0.75em"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="4" x2="12" y2="20" />
              <line x1="4" y1="12" x2="20" y2="12" />
            </svg>
          </span>
          OF FINANCIAL TECH
        </div>

        <div className="footer-brand-row">
          <div className="footer-brand">
            <Image
              src="/real_logo_org.png"
              alt="MATRIX Logo"
              width={68}
              height={68}
              className="footer-logo-img"
            />
            <span className="footer-brand-title">MATRIX</span>
          </div>
          <p className="footer-mission-desc">
            MATRIX is the premier quantitative finance and financial engineering research society. We bridge high-level mathematics, computational economics, and decentralized blockchain architecture to incubate next-generation fintech leaders.
          </p>
        </div>

        <div className="footer-links-row">
          <div className="footer-col">
            <span className="footer-col-title">NAVIGATION</span>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/domain">Domains</Link></li>
              <li><Link href="/events">Events</Link></li>
              <li><Link href="/projects">Projects</Link></li>
              <li><Link href="/team">Team</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <span className="footer-col-title">TRACKS</span>
            <ul>
              <li><Link href="/domain">QUANT FINANCE</Link></li>
              <li><Link href="/domain">ALGO TRADING</Link></li>
              <li><Link href="/domain">DEFI SYSTEMS</Link></li>
              <li><Link href="/domain">AI IN FINANCE</Link></li>
              <li><Link href="/domain">RISK ENGINE</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <span className="footer-col-title">PORTAL</span>
            <ul>
              <li><Link href="/login">STUDENT ACCESS</Link></li>
              <li><Link href="/login">ADMIN CONSOLE</Link></li>
              <li><button type="button" onClick={openJoinModal} style={{ textAlign: 'left', font: 'inherit', color: 'inherit', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}>APPLY FOR MEMBERSHIP</button></li>
            </ul>
          </div>

          <div className="footer-social-strip">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
            </a>
          </div>
        </div>

        <div className="footer-bottom-row">
          <div className="footer-cert-badge">
            <div className="cert-icon-circle">MATRIX</div>
            <div className="cert-text">
              <strong>FINTECH ENGINEERING CLUB</strong>
              <span>RESEARCH & INNOVATION LABS</span>
            </div>
          </div>

          <div className="footer-copyright">
            © {new Date().getFullYear()} MATRIX FINTECH CLUB. ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </footer>
  );
}
