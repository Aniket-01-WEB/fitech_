'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  const [errorMsg, setErrorMsg] = useState('');
  const { login, currentUser, openJoinModal } = usePortal();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push(ROLE_HOME[currentUser.role] || '/student-portal');
    }
  }, [currentUser, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (role === 'admin') {
      if (password !== 'admin123' && password !== 'matrix2026' && password !== 'admin') {
        setErrorMsg('Invalid admin credentials. (Demo pass: admin123 or matrix2026)');
        return;
      }
    }

    if (role === 'superadmin') {
      if (password !== 'super2026' && password !== 'superadmin123') {
        setErrorMsg('Invalid super admin credentials. (Demo pass: super2026 or superadmin123)');
        return;
      }
    }

    login(role, trimmedEmail);
    router.push(ROLE_HOME[role] || '/student-portal');
  };

  const handleQuickDemo = (demoRole, demoEmail) => {
    login(demoRole, demoEmail);
    router.push(ROLE_HOME[demoRole] || '/student-portal');
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
            onClick={() => { setRole('student'); setErrorMsg(''); }}
          >
            STUDENT PORTAL
          </button>
          <button
            type="button"
            className={`portal-role-tab ${role === 'admin' ? 'active' : ''}`}
            onClick={() => { setRole('admin'); setErrorMsg(''); }}
          >
            ADMIN CONSOLE
          </button>
          <button
            type="button"
            className={`portal-role-tab ${role === 'superadmin' ? 'active' : ''}`}
            onClick={() => { setRole('superadmin'); setErrorMsg(''); }}
          >
            SUPER ADMIN
          </button>
        </div>

        {errorMsg && <p className="portal-field-error" style={{ marginBottom: '16px' }}>{errorMsg}</p>}

        <form onSubmit={handleSubmit} className="portal-form">
          <div className="form-group">
            <label htmlFor="login-email">{role === 'superadmin' ? 'Super Admin Gmail / Username' : role === 'admin' ? 'Admin Gmail / Username' : 'Student Registered Email'}</label>
            <input
              type="email"
              id="login-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === 'superadmin' ? 'superadmin@matrix.club' : role === 'admin' ? 'admin@matrix.club' : 'student@matrix.club'}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-pass">{role === 'superadmin' ? 'Super Admin Security Password' : role === 'admin' ? 'Admin Security Password' : 'Password (Optional)'}</label>
            <input
              type="password"
              id="login-pass"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={role !== 'student' ? 'Enter password' : '••••••••'}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
            AUTHENTICATE & LOG IN →
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
              style={{ flex: '1 1 140px', fontSize: '12px', padding: '10px 12px' }}
            >
              ⚡ Student Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin', 'admin@matrix.club')}
              className="btn btn-secondary"
              style={{ flex: '1 1 140px', fontSize: '12px', padding: '10px 12px' }}
            >
              ⚡ Admin Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('superadmin', 'superadmin@matrix.club')}
              className="btn btn-secondary"
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
