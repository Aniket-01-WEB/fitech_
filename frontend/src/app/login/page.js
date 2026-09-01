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
  const {
    login,
    currentUser,
    openJoinModal,
    requestPasswordReset,
    verifyPasswordResetOtp,
    updatePassword,
    logout
  } = usePortal();
  const router = useRouter();

  // view: 'login' | 'forgot-request' (enter email) | 'forgot-verify' (enter OTP) | 'forgot-reset' (set new password)
  const [view, setView] = useState('login');
  const [resetEmail, setResetEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  useEffect(() => {
    if (currentUser && view === 'login') {
      router.push(ROLE_HOME[currentUser.role] || '/student-portal');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const goToForgotPassword = () => {
    setErrorMsg('');
    setInfoMsg('');
    setResetEmail(email.trim());
    setView('forgot-request');
  };

  const backToLogin = () => {
    setErrorMsg('');
    setInfoMsg('');
    setView('login');
  };

  // Step 1: send the 6-digit recovery code to the registered email.
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const trimmed = resetEmail.trim().toLowerCase();
    if (!trimmed) {
      setErrorMsg('Enter the email your account is registered with.');
      return;
    }
    setIsSubmitting(true);
    try {
      await requestPasswordReset(trimmed);
      setInfoMsg(`A 6-digit verification code has been sent to ${trimmed}. It expires shortly, so enter it soon.`);
      setView('forgot-verify');
    } catch (err) {
      setErrorMsg(err.message || 'Could not send a reset code. Check the email and try again.');
    }
    setIsSubmitting(false);
  };

  // Step 2: verifying the code proves inbox ownership and opens a
  // temporary recovery session.
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!otpCode.trim()) {
      setErrorMsg('Enter the code from your email.');
      return;
    }
    setIsSubmitting(true);
    try {
      await verifyPasswordResetOtp(resetEmail.trim().toLowerCase(), otpCode.trim());
      setInfoMsg('');
      setView('forgot-reset');
    } catch (err) {
      setErrorMsg(err.message || 'That code is invalid or has expired. Request a new one.');
    }
    setIsSubmitting(false);
  };

  // Step 3: set the new password on the now-verified session.
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    setIsSubmitting(true);
    try {
      await updatePassword(newPassword);
      await logout();
      setView('login');
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setOtpCode('');
      setErrorMsg('');
      setInfoMsg('Password updated. Please log in with your new password.');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to reset password.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="portal-page">
      <div className="portal-login-card">
        <div className="portal-card-header">
          <span className="portal-badge">MATRIX AUTH GATEWAY</span>
          <h1 className="portal-login-title">CLUB MEMBER ACCESS</h1>
          <p className="portal-login-subtitle">
            {view === 'login'
              ? 'Sign in to access masterclass recordings, event passes, and project dashboards.'
              : 'Reset your password — verify your email, then choose a new one.'}
          </p>
        </div>

        {view === 'login' && (
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
        )}

        {infoMsg && <p style={{ color: '#166534', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', marginBottom: '16px' }}>{infoMsg}</p>}
        {errorMsg && <p className="portal-field-error" style={{ marginBottom: '16px' }}>{errorMsg}</p>}

        {view === 'login' && (
          <>
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
                <button
                  type="button"
                  onClick={goToForgotPassword}
                  style={{ font: 'inherit', fontSize: '12px', color: '#0f172a', fontWeight: '600', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', marginTop: '6px', padding: 0, alignSelf: 'flex-end' }}
                >
                  Forgot password?
                </button>
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

            {role === 'student' && (
              <div className="portal-footer-links" style={{ marginTop: '24px', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: '#64748b' }}>
                  Haven&apos;t registered yet?{' '}
                  <button
                    type="button"
                    onClick={openJoinModal}
                    style={{ font: 'inherit', color: '#0f172a', fontWeight: '700', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Join Us
                  </button>
                </p>
              </div>
            )}

            {role === 'admin' && (
              <div className="portal-footer-links" style={{ marginTop: '24px', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: '#64748b' }}>
                  Admin accounts aren&apos;t self-registered here.{' '}
                  <button
                    type="button"
                    onClick={openJoinModal}
                    style={{ font: 'inherit', color: '#0f172a', fontWeight: '700', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Create a student account
                  </button>
                  {' '}first, then request admin access from your Student Portal profile — a Super Admin reviews every request.
                </p>
              </div>
            )}
          </>
        )}

        {view === 'forgot-request' && (
          <form onSubmit={handleRequestOtp} className="portal-form">
            <div className="form-group">
              <label htmlFor="reset-email">Registered Email</label>
              <input
                type="email"
                id="reset-email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
              {isSubmitting ? 'SENDING CODE...' : 'SEND VERIFICATION CODE →'}
            </button>
            <button
              type="button"
              onClick={backToLogin}
              style={{ font: 'inherit', fontSize: '13px', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', marginTop: '16px', textAlign: 'center', width: '100%' }}
            >
              ← Back to login
            </button>
          </form>
        )}

        {view === 'forgot-verify' && (
          <form onSubmit={handleVerifyOtp} className="portal-form">
            <div className="form-group">
              <label htmlFor="reset-otp">6-Digit Verification Code</label>
              <input
                type="text"
                id="reset-otp"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                inputMode="numeric"
                maxLength={6}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
              {isSubmitting ? 'VERIFYING...' : 'VERIFY CODE →'}
            </button>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
              <button
                type="button"
                onClick={backToLogin}
                style={{ font: 'inherit', fontSize: '13px', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ← Back to login
              </button>
              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={isSubmitting}
                style={{ font: 'inherit', fontSize: '13px', color: '#0f172a', fontWeight: '600', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Resend code
              </button>
            </div>
          </form>
        )}

        {view === 'forgot-reset' && (
          <form onSubmit={handleResetPassword} className="portal-form">
            <div className="form-group">
              <label htmlFor="reset-new-pass">New Password</label>
              <input
                type="password"
                id="reset-new-pass"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                minLength={8}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="reset-confirm-pass">Confirm New Password</label>
              <input
                type="password"
                id="reset-confirm-pass"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                minLength={8}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
              {isSubmitting ? 'SAVING...' : 'RESET PASSWORD →'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
