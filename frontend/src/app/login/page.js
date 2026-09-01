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

  const switchRole = (newRole) => {
    setRole(newRole);
    setEmail('');
    setPassword('');
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

  // Step 2: verifying the code proves inbox ownership and opens a temporary recovery session.
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
      setErrorMsg('');
      setInfoMsg('Password updated. Please log in with your new password.');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to reset password.');
    }
    setIsSubmitting(false);
  };

  const roleLabel = {
    student: {
      badge: 'MEMBER AUTHENTICATION',
      subtitle: 'Sign in to discover upcoming events, workshops, and lab sessions.',
      emailLabel: 'Email Address',
      emailPlaceholder: 'Enter Registered Email ID',
      passLabel: 'Password',
      passPlaceholder: '••••••••',
    },
    admin: {
      badge: 'ADMIN AUTHENTICATION',
      subtitle: 'Sign in to manage events, recordings, and member resources.',
      emailLabel: 'Admin Email',
      emailPlaceholder: 'admin@matrix.club',
      passLabel: 'Admin Password',
      passPlaceholder: 'Enter admin password',
    },
    superadmin: {
      badge: 'SUPER ADMIN AUTHENTICATION',
      subtitle: 'Sign in to oversee all operations and manage member roles.',
      emailLabel: 'Super Admin Email',
      emailPlaceholder: 'superadmin@matrix.club',
      passLabel: 'Super Admin Password',
      passPlaceholder: 'Enter super admin password',
    },
  };

  const lbl = roleLabel[role];

  return (
    <div className="lp-shell">
      {/* ── MAIN LOGIN CARD ── */}
      <div className="lp-card">
        {/* Header */}
        <div className="lp-header">
          <span className="lp-badge">
            {view === 'login' ? lbl.badge : 'PASSWORD RECOVERY'}
          </span>
          <h1 className="lp-heading">
            {view === 'login' ? 'WELCOME' : 'RESET PASSWORD'}
          </h1>
          <p className="lp-subtext">
            {view === 'login'
              ? lbl.subtitle
              : 'Reset your password — verify your email, then choose a new one.'}
          </p>
        </div>

        {/* Info & Error messages */}
        {infoMsg && (
          <p style={{ color: '#166534', background: '#dcfce7', border: '1px solid #bbf7d0', padding: '10px 14px', fontSize: '13px', marginBottom: '16px' }}>
            {infoMsg}
          </p>
        )}
        {errorMsg && <p className="lp-error">{errorMsg}</p>}

        {/* VIEW 1: LOGIN FORM */}
        {view === 'login' && (
          <>
            <form onSubmit={handleSubmit} className="lp-form">
              <div className="lp-field">
                <label className="lp-label" htmlFor="lp-email">
                  {lbl.emailLabel} <span className="lp-req">*</span>
                </label>
                <input
                  type="email"
                  id="lp-email"
                  className="lp-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={lbl.emailPlaceholder}
                  required
                />
              </div>

              <div className="lp-field">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="lp-label" htmlFor="lp-password" style={{ margin: 0 }}>
                    {lbl.passLabel} <span className="lp-req">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={goToForgotPassword}
                    style={{ font: 'inherit', fontSize: '12px', color: '#0f172a', fontWeight: '600', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  id="lp-password"
                  className="lp-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={lbl.passPlaceholder}
                  required
                />
              </div>

              <button type="submit" className="lp-submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'AUTHENTICATING...' : 'SIGN IN →'}
              </button>
            </form>

            {/* Join / Admin Notice links */}
            {role === 'student' && (
              <p className="lp-join-text">
                Not registered yet?{' '}
                <button type="button" onClick={openJoinModal} className="lp-join-link">
                  Join us →
                </button>
              </p>
            )}

            {role === 'admin' && (
              <p className="lp-join-text" style={{ fontSize: '12.5px', textAlign: 'left', lineHeight: '1.5' }}>
                Admin accounts aren&apos;t self-registered here.{' '}
                <button type="button" onClick={openJoinModal} className="lp-join-link">
                  Create a student account
                </button>
                {' '}first, then request admin access from your Student Portal profile — a Super Admin reviews every request.
              </p>
            )}

            {/* Divider + role switch links */}
            <div className="lp-divider" />
            <div className="lp-role-links">
              {role !== 'admin' && (
                <button type="button" className="lp-role-link" onClick={() => switchRole('admin')}>
                  Login as Admin →
                </button>
              )}
              {role !== 'superadmin' && (
                <button type="button" className="lp-role-link" onClick={() => switchRole('superadmin')}>
                  Login as Superadmin →
                </button>
              )}
              {role !== 'student' && (
                <button type="button" className="lp-role-link lp-role-link-back" onClick={() => switchRole('student')}>
                  ← Back to Student Login
                </button>
              )}
            </div>
          </>
        )}

        {/* VIEW 2: FORGOT - REQUEST OTP */}
        {view === 'forgot-request' && (
          <form onSubmit={handleRequestOtp} className="lp-form">
            <div className="lp-field">
              <label className="lp-label" htmlFor="reset-email">Registered Email <span className="lp-req">*</span></label>
              <input
                type="email"
                id="reset-email"
                className="lp-input"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <button type="submit" className="lp-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'SENDING CODE...' : 'SEND VERIFICATION CODE →'}
            </button>
            <button
              type="button"
              onClick={backToLogin}
              className="lp-role-link lp-role-link-back"
              style={{ marginTop: '12px' }}
            >
              ← Back to login
            </button>
          </form>
        )}

        {/* VIEW 3: FORGOT - VERIFY OTP */}
        {view === 'forgot-verify' && (
          <form onSubmit={handleVerifyOtp} className="lp-form">
            <div className="lp-field">
              <label className="lp-label" htmlFor="reset-otp">6-Digit Verification Code <span className="lp-req">*</span></label>
              <input
                type="text"
                id="reset-otp"
                className="lp-input"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                inputMode="numeric"
                maxLength={6}
                required
              />
            </div>
            <button type="submit" className="lp-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'VERIFYING...' : 'VERIFY CODE →'}
            </button>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
              <button
                type="button"
                onClick={backToLogin}
                className="lp-role-link"
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

        {/* VIEW 4: FORGOT - SET NEW PASSWORD */}
        {view === 'forgot-reset' && (
          <form onSubmit={handleResetPassword} className="lp-form">
            <div className="lp-field">
              <label className="lp-label" htmlFor="reset-new-pass">New Password <span className="lp-req">*</span></label>
              <input
                type="password"
                id="reset-new-pass"
                className="lp-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                minLength={8}
                required
              />
            </div>
            <div className="lp-field">
              <label className="lp-label" htmlFor="reset-confirm-pass">Confirm New Password <span className="lp-req">*</span></label>
              <input
                type="password"
                id="reset-confirm-pass"
                className="lp-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                minLength={8}
                required
              />
            </div>
            <button type="submit" className="lp-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'SAVING...' : 'RESET PASSWORD →'}
            </button>
          </form>
        )}
      </div>

      {/* ── DEMO BUTTONS — outside the card in blank space ── */}
      <div className="lp-demo-strip">
        <span className="lp-demo-label">QUICK DEMO ACCESS</span>
        <div className="lp-demo-btns">
          <button
            type="button"
            className="lp-demo-btn"
            disabled={isSubmitting}
            onClick={() => handleQuickDemo('student', 'student@matrix.club')}
          >
            ⚡ Student Demo
          </button>
          <button
            type="button"
            className="lp-demo-btn"
            disabled={isSubmitting}
            onClick={() => handleQuickDemo('admin', 'admin@matrix.club')}
          >
            ⚡ Admin Demo
          </button>
          <button
            type="button"
            className="lp-demo-btn"
            disabled={isSubmitting}
            onClick={() => handleQuickDemo('superadmin', 'superadmin@matrix.club')}
          >
            ⚡ Superadmin Demo
          </button>
        </div>
      </div>
    </div>
  );
}
