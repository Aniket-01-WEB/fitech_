'use client';

import React, { useState, useEffect, useCallback } from 'react';
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

  const handleCloseMenu = useCallback(() => {
    setMobileMenuOpen(false);
    document.body.style.overflow = '';
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change & on Escape key
  useEffect(() => {
    handleCloseMenu();
  }, [pathname, handleCloseMenu]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        handleCloseMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen, handleCloseMenu]);

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

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Domains', href: '/domain' },
    { label: 'Events', href: '/events' },
    { label: 'Projects', href: '/projects' },
    { label: 'Team', href: '/team' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} aria-label="Main Navigation">
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
            MATRIX
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
              aria-expanded={mobileMenuOpen}
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
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`} aria-hidden={!mobileMenuOpen}>
        <ul className="mobile-links">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={pathname === item.href ? 'active-mobile-link' : ''}
              >
                {item.label}
              </Link>
            </li>
          ))}
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
                <Link href="/login" className={pathname === '/login' ? 'active-mobile-link' : ''}>
                  Portal / Login
                </Link>
              </li>
              <li style={{ marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => {
                    handleCloseMenu();
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

