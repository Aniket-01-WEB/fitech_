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
          Finance
          <span
            className="plus-icon-spin"
            title="Hover to transform to cross"
          >
            <svg
              width="0.7em"
              height="0.7em"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="4" x2="12" y2="20" />
              <line x1="4" y1="12" x2="20" y2="12" />
            </svg>
          </span>
          Technology
        </div>

        <div className="footer-brand-row">
          <div className="footer-brand">
            <Image
              src="/images/logo-alt.png"
              alt="FITECH Logo"
              width={64}
              height={64}
              className="footer-logo-img"
            />
            <span className="footer-brand-title">FITECH</span>
          </div>
          <p className="footer-mission-desc">
            FITECH is a student-led fintech ecosystem. We&apos;re bridging the gap between quantitative finance, cutting-edge software engineering, and financial technology to shape the future of innovation. We call it Financial Intelligence.
          </p>
        </div>

        <div className="footer-links-row">
          <div className="footer-col">
            <span className="footer-col-title">Navigation</span>
            <ul>
              <li><Link href="/#about">ABOUT</Link></li>
              <li><Link href="/domain">DOMAINS</Link></li>
              <li><Link href="/events">EVENTS</Link></li>
              <li><Link href="/projects">PROJECTS</Link></li>
              <li><Link href="/team">TEAM</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <span className="footer-col-title">Connect</span>
            <ul>
              <li>
                <button
                  type="button"
                  onClick={openJoinModal}
                  className="footer-link-btn"
                >
                  JOIN US
                </button>
              </li>
              <li><Link href="/team">COLLECTIVE</Link></li>
              <li><Link href="/events">AFFILIATES</Link></li>
              <li><Link href="/events">WORKSHOPS</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <span className="footer-col-title">Trust</span>
            <ul>
              <li><Link href="/domain">CONSTITUTION</Link></li>
              <li><Link href="/domain">CODE OF CONDUCT</Link></li>
              <li><Link href="/domain">TERMS</Link></li>
              <li><Link href="/domain">PRIVACY</Link></li>
            </ul>
          </div>

          <div className="footer-social-strip">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="social-icon-link"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="social-icon-link"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="social-icon-link"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
              className="social-icon-link"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="social-icon-link"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-bottom-row">
          <div className="footer-cert-badge">
            <div className="cert-icon-circle">FITECH</div>
            <div className="cert-text">
              <strong>FINTECH ENGINEERING CLUB</strong>
              <span>RESEARCH & INNOVATION LABS</span>
            </div>
          </div>

          <div className="footer-copyright">
            © {new Date().getFullYear()} FITECH CLUB. ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </footer>
  );
}
