'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { usePortal } from '@/context/PortalContext';

const ROLE_HOME = {
  admin: '/admin-portal',
  superadmin: '/super-admin',
  student: '/student-portal',
};

function getDashboardHref(role) {
  return ROLE_HOME[role] || '/student-portal';
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = usePortal();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
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
    document.body.style.overflow = nextState ? 'hidden' : '';
  };

  const handleSignOut = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      <header className={`sleek-navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
        <nav className="sleek-navbar" role="navigation" aria-label="Main Navigation">
          {/* Left Brand with Square White Badge */}
          <Link href="/" className="sleek-nav-brand" aria-label="FITECH Home">
            <div className="sleek-nav-logo-badge">
              <Image
                src="/images/logo-alt.png"
                alt="FITECH"
                width={22}
                height={22}
                className="sleek-nav-logo-img"
                priority
              />
            </div>
            <span className="sleek-nav-title">FITECH</span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="sleek-nav-links">
            <li>
              <Link href="/" className={pathname === '/' ? 'active' : ''}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/domain" className={pathname === '/domain' ? 'active' : ''}>
                Domains
              </Link>
            </li>
            <li>
              <Link href="/events" className={pathname === '/events' ? 'active' : ''}>
                Events
              </Link>
            </li>
            <li>
              <Link href="/projects" className={pathname === '/projects' ? 'active' : ''}>
                Projects
              </Link>
            </li>
            <li>
              <Link href="/gallery" className={pathname === '/gallery' ? 'active' : ''}>
                Gallery
              </Link>
            </li>
            <li>
              <Link href="/team" className={pathname === '/team' ? 'active' : ''}>
                Team
              </Link>
            </li>
            {currentUser ? (
              <>
                <li>
                  <Link
                    href={getDashboardHref(currentUser.role)}
                    className={pathname.includes('portal') || pathname.includes('admin') ? 'active' : ''}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="sleek-signout-btn"
                    title="Sign Out"
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link href="/login" className={pathname === '/login' ? 'active' : ''}>
                  Portal / Login
                </Link>
              </li>
            )}
          </ul>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className={`sleek-nav-toggle ${mobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
      </header>

      {/* Sleek White Mobile Drawer */}
      <div className={`sleek-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sleek-mobile-content">
          <ul className="sleek-mobile-links">
            <li>
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/domain" onClick={() => setMobileMenuOpen(false)}>
                Domains
              </Link>
            </li>
            <li>
              <Link href="/events" onClick={() => setMobileMenuOpen(false)}>
                Events
              </Link>
            </li>
            <li>
              <Link href="/projects" onClick={() => setMobileMenuOpen(false)}>
                Projects
              </Link>
            </li>
            <li>
              <Link href="/gallery" onClick={() => setMobileMenuOpen(false)}>
                Gallery
              </Link>
            </li>
            <li>
              <Link href="/team" onClick={() => setMobileMenuOpen(false)}>
                Team
              </Link>
            </li>
            {currentUser ? (
              <>
                <li>
                  <Link
                    href={getDashboardHref(currentUser.role)}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard ({currentUser.role.toUpperCase()})
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="sleek-mobile-signout"
                  >
                    SIGN OUT ({currentUser.email})
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  Portal / Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
