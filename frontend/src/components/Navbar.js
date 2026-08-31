'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { usePortal } from '@/context/PortalContext';

const ROLE_HOME = {
  admin: '/admin-portal',
  superadmin: '/super-admin',
  student: '/student-portal'
};

function getDashboardHref(role) {
  return ROLE_HOME[role] || '/student-portal';
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout, openJoinModal } = usePortal();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    document.body.style.overflow = '';
  }, [pathname]);

  const toggleMobileMenu = () => {
    const nextState = !mobileMenuOpen;
    setMobileMenuOpen(nextState);
    if (nextState) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const handleSignOut = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Link href="/" className="nav-brand" aria-label="MATRIX Home">
            <Image
              src="/real_logo_org.png"
              alt="MATRIX FinTech Club Logo"
              width={64}
              height={64}
              className="nav-club-logo"
              priority
            />
          </Link>

          <Link href="/" className="nav-center-title">
            FITECH
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {currentUser && (
              <div className="nav-user-indicator" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link
                  href={getDashboardHref(currentUser.role)}
                  className="nav-dashboard-link"
                >
                  Dashboard →
                </Link>
                <button type="button" onClick={handleSignOut} className="nav-signout-btn">
                  Sign Out ↵
                </button>
              </div>
            )}

            <button
              type="button"
              className={`nav-toggle ${mobileMenuOpen ? 'active' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle Navigation Menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Fullscreen Mobile Drawer */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-links">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/domain">Domains</Link>
          </li>
          <li>
            <Link href="/events">Events</Link>
          </li>
          <li>
            <Link href="/projects">Projects</Link>
          </li>
          <li>
            <Link href="/team">Team</Link>
          </li>
          {currentUser ? (
            <>
              <li>
                <Link href={getDashboardHref(currentUser.role)}>
                  Dashboard ({currentUser.role.toUpperCase()})
                </Link>
              </li>
              <li>
                <button type="button" onClick={handleSignOut} className="nav-signout-btn">
                  SIGN OUT ({currentUser.email})
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login">Portal / Login</Link>
              </li>
              <li style={{ marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    document.body.style.overflow = '';
                    openJoinModal();
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  JOIN US <span className="arrow">→</span>
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
}
