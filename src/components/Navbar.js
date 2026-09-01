'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { usePortal } from '@/context/PortalContext';

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
      <header className={`curved-navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
        <nav className="curved-navbar">
          {/* Left Brand */}
          <Link href="/" className="curved-nav-brand" aria-label="FITECH Home">
            <Image
              src="/logo_club-removebg-preview.png"
              alt="FITECH Club Logo"
              width={34}
              height={34}
              className="curved-nav-logo"
              priority
            />
            <span className="curved-nav-title">FITECH</span>
          </Link>

          {/* Desktop Nav Links (shifted to right) */}
          <ul className="curved-nav-links">
            <li>
              <Link href="/#about" className={pathname === '/' ? 'active' : ''}>About</Link>
            </li>
            <li>
              <Link href="/domain" className={pathname === '/domain' ? 'active' : ''}>Domains</Link>
            </li>
            <li>
              <Link href="/events" className={pathname === '/events' ? 'active' : ''}>Events</Link>
            </li>
            <li>
              <Link href="/projects" className={pathname === '/projects' ? 'active' : ''}>Projects</Link>
            </li>
            <li>
              <Link href="/team" className={pathname === '/team' ? 'active' : ''}>Team</Link>
            </li>
          </ul>

          {/* Right Actions for logged-in user or mobile hamburger */}
          <div className="curved-nav-actions">
            {currentUser && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link
                  href={currentUser.role === 'admin' ? '/admin-portal' : '/student-portal'}
                  className="curved-nav-dash-link"
                >
                  Dashboard
                </Link>
                <button type="button" onClick={handleSignOut} className="curved-nav-signout">
                  Sign Out
                </button>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              type="button"
              className={`curved-nav-toggle ${mobileMenuOpen ? 'active' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle Navigation Menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>
      </header>

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
                <Link href={currentUser.role === 'admin' ? '/admin-portal' : '/student-portal'}>
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
