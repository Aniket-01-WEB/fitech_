'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePortal } from '@/context/PortalContext';

const ROLE_HOME = {
  admin: '/admin-portal',
  superadmin: '/super-admin',
  student: '/student-portal'
};

export default function LoginPage() {
  const [role, setRole] = useState('student'); // 'student' | 'admin' | 'superadmin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login, currentUser, openJoinModal } = usePortal();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push(ROLE_HOME[currentUser.role] || '/student-portal');
    }
  }, [currentUser, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (role === 'admin') {
      if (!password || (password !== 'admin123' && password !== 'matrix2026' && password !== 'admin')) {
        setErrorMsg('Invalid admin credentials. (Demo pass: admin123 or matrix2026)');
        return;
      }
    }

    if (role === 'superadmin') {
      if (!password || (password !== 'super2026' && password !== 'superadmin123')) {
        setErrorMsg('Invalid super admin credentials. (Demo pass: super2026 or superadmin123)');
        return;
      }
    }

    setIsSubmitting(true);

    // Simulated network delay for realistic auth response
    setTimeout(() => {
      login(role, trimmedEmail);
      setIsSubmitting(false);
      router.push(ROLE_HOME[role] || '/student-portal');
    }, 400);
  };

  const handleQuickDemo = (demoRole, demoEmail) => {
    setErrorMsg('');
    setIsSubmitting(true);
    setTimeout(() => {
      login(demoRole, demoEmail);
      setIsSubmitting(false);
      router.push(ROLE_HOME[demoRole] || '/student-portal');
    }, 300);
  };

  const handleRoleSwitch = (newRole) => {
    setRole(newRole);
    setErrorMsg('');
    setPassword('');
    setShowPassword(false);
  };

  return (
    <div className="portal-page">
      <div className="portal-login-card">
        <div className="portal-card-header">
          <span className="portal-badge">MATRIX AUTH GATEWAY</span>
          <h1 className="portal-login-title">CLUB MEMBER ACCESS</h1>
          <p className="portal-login-subtitle">Sign in to access masterclass recordings, event passes, and project dashboards.</p>
        </div>

        <div className="portal-role-switch" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={role === 'student'}
            className={`portal-role-tab ${role === 'student' ? 'active' : ''}`}
            onClick={() => handleRoleSwitch('student')}
          >
            STUDENT PORTAL
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={role === 'admin'}
            className={`portal-role-tab ${role === 'admin' ? 'active' : ''}`}
            onClick={() => handleRoleSwitch('admin')}
          >
            ADMIN CONSOLE
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={role === 'superadmin'}
            className={`portal-role-tab ${role === 'superadmin' ? 'active' : ''}`}
            onClick={() => handleRoleSwitch('superadmin')}
          >
            SUPER ADMIN
          </button>
        </div>

        {errorMsg && (
          <div className="portal-field-error" style={{ marginBottom: '16px', animation: 'fadeIn 0.2s ease-in-out' }}>
            <span>⚠️ {errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="portal-form">
          <div className="form-group">
            <label htmlFor="login-email">{role === 'superadmin' ? 'Super Admin Gmail / Username' : role === 'admin' ? 'Admin Gmail / Username' : 'Student Registered Email'}</label>
            <input
              type="email"
              id="login-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === 'superadmin' ? 'superadmin@matrix.club' : role === 'admin' ? 'admin@matrix.club' : 'student@matrix.club'}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-pass">{role === 'superadmin' ? 'Super Admin Security Password' : role === 'admin' ? 'Admin Security Password' : 'Password (Optional)'}</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="login-pass"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={role !== 'student' ? 'Enter password' : '••••••••'}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
          >
            {isSubmitting ? 'AUTHENTICATING...' : 'AUTHENTICATE & LOG IN →'}
          </button>
        </form>

        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
          <span style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
            QUICK DEMO ACCESSIBILITY:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleQuickDemo('student', 'student@matrix.club')}
              className="btn btn-secondary"
              disabled={isSubmitting}
              style={{ flex: '1 1 140px', fontSize: '12px', padding: '10px 12px' }}
            >
              ⚡ Student Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin', 'admin@matrix.club')}
              className="btn btn-secondary"
              disabled={isSubmitting}
              style={{ flex: '1 1 140px', fontSize: '12px', padding: '10px 12px' }}
            >
              ⚡ Admin Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('superadmin', 'superadmin@matrix.club')}
              className="btn btn-secondary"
              disabled={isSubmitting}
              style={{ flex: '1 1 140px', fontSize: '12px', padding: '10px 12px' }}
            >
              ⚡ Super Admin Demo
            </button>
          </div>
        </div>

        <div className="portal-footer-links" style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            Don&apos;t have a student account yet?{' '}
            <button
              type="button"
              onClick={openJoinModal}
              style={{ font: 'inherit', color: '#0f172a', fontWeight: '700', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Apply for Membership
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

