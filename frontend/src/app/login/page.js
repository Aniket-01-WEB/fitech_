'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePortal } from '@/context/PortalContext';

const ROLE_HOME = {
  admin: '/admin-portal',
  superadmin: '/super-admin',
  student: '/student-portal'
};

const ROLE_LABEL = {
  student: 'Student Portal',
  admin: 'Admin Console',
  superadmin: 'Super Admin'
};

// Demo accounts seeded directly in Supabase Auth for quick testing.
const DEMO_PASSWORD = 'MatrixDemo-2026!';

export default function LoginPage() {
  const [role, setRole] = useState('student'); // 'student' | 'admin' | 'superadmin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login, currentUser, openJoinModal } = usePortal();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push(ROLE_HOME[currentUser.role] || '/student-portal');
    }
  }, [currentUser, router]);

  const attemptLogin = async (loginEmail, loginPassword, expectedRole) => {
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const profile = await login(loginEmail, loginPassword);
      if (profile.role !== expectedRole) {
        setErrorMsg(`This account isn't registered as ${ROLE_LABEL[expectedRole]}. It's a ${ROLE_LABEL[profile.role] || profile.role} account — try that tab instead.`);
        setIsSubmitting(false);
        return;
      }
      router.push(ROLE_HOME[profile.role] || '/student-portal');
    } catch (err) {
      setErrorMsg(err.message || 'Sign in failed. Check your email and password.');
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }
    attemptLogin(trimmedEmail, password, role);
  };

  const handleQuickDemo = (demoRole, demoEmail) => {
    setRole(demoRole);
    setEmail(demoEmail);
    attemptLogin(demoEmail, DEMO_PASSWORD, demoRole);
  };

  const handleRoleSwitch = (newRole) => {
    setRole(newRole);
    setErrorMsg('');
  };

  return (
    <div className="portal-page">
      <div className="portal-login-card">
        <div className="portal-card-header">
          <span className="portal-badge">MATRIX AUTH GATEWAY</span>
          <h1 className="portal-login-title">CLUB MEMBER ACCESS</h1>
          <p className="portal-login-subtitle">Sign in to access masterclass recordings, event passes, and project dashboards.</p>
        </div>

        <div className="portal-role-switch">
          <button
            type="button"
            className={`portal-role-tab ${role === 'student' ? 'active' : ''}`}
            onClick={() => handleRoleSwitch('student')}
          >
            STUDENT PORTAL
          </button>
          <button
            type="button"
            className={`portal-role-tab ${role === 'admin' ? 'active' : ''}`}
            onClick={() => handleRoleSwitch('admin')}
          >
            ADMIN CONSOLE
          </button>
          <button
            type="button"
            className={`portal-role-tab ${role === 'superadmin' ? 'active' : ''}`}
            onClick={() => handleRoleSwitch('superadmin')}
          >
            SUPER ADMIN
          </button>
        </div>

        {errorMsg && <p className="portal-field-error" style={{ marginBottom: '16px' }}>{errorMsg}</p>}

        <form onSubmit={handleSubmit} className="portal-form">
          <div className="form-group">
            <label htmlFor="login-email">Registered Email</label>
            <input
              type="email"
              id="login-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-pass">Password</label>
            <input
              type="password"
              id="login-pass"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
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
