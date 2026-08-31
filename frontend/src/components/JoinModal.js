'use client';

import React, { useState, useEffect } from 'react';
import { usePortal } from '@/context/PortalContext';

const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyd1SmdJymqZ1B0Z-d5K0J5N28h-M4jJq1rF-vX1Q1s9J4x2m/exec';

export default function JoinModal() {
  const { isJoinModalOpen, closeJoinModal, signUp } = usePortal();
  const [submitted, setSubmitted] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    regNumber: '',
    rollNumber: '',
    school: '',
    department: '',
    section: '',
    currentYear: '1st Year',
    contactNumber: '',
    gmail: '',
    password: '',
    interestedDomain: 'Quantitative Finance & Algo'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const requiredFields = ['name', 'regNumber', 'rollNumber', 'school', 'department', 'section', 'contactNumber', 'gmail', 'password'];
    for (const field of requiredFields) {
      if (!formData[field].trim()) {
        setErrorMsg('Please fill in all required fields.');
        return;
      }
    }
    if (formData.password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }

    setSubmitting(true);

    try {
      // Fire-and-forget backup log — unrelated to real account creation.
      fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      }).catch(err => console.error('Webhook error:', err));

      const result = await signUp(formData.gmail, formData.password, formData);

      setSubmitting(false);
      setNeedsConfirmation(Boolean(result.needsConfirmation));
      setSubmitted(true);
    } catch (err) {
      setSubmitting(false);
      setErrorMsg(err.message || 'An error occurred during submission.');
    }
  };

  useEffect(() => {
    if (!isJoinModalOpen) return;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSubmitted(false);
        setErrorMsg('');
        closeJoinModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isJoinModalOpen, closeJoinModal]);

  const handleClose = () => {
    setSubmitted(false);
    setErrorMsg('');
    closeJoinModal();
  };

  if (!isJoinModalOpen) return null;

  return (
    <div className={`join-modal-backdrop ${isJoinModalOpen ? 'active' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
      <div className="join-modal-container">
        <button type="button" className="join-modal-close" onClick={handleClose} aria-label="Close Modal">
          ×
        </button>

        {!submitted ? (
          <>
            <div className="join-modal-header">
              <span className="join-modal-badge">MEMBERSHIP APPLICATION</span>
              <h2 className="join-modal-title">Join MATRIX FinTech Club</h2>
              <p className="join-modal-subtitle">Fill out your academic details to apply for student membership.</p>
            </div>

            {errorMsg && <p className="portal-field-error" style={{ marginBottom: '16px', fontSize: '13px' }}>{errorMsg}</p>}

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="modal-name">Full Name <span className="req">*</span></label>
                  <input type="text" id="modal-name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Alex Morgan" required />
                </div>

                <div className="form-group">
                  <label htmlFor="modal-reg">Registration No. <span className="req">*</span></label>
                  <input type="text" id="modal-reg" name="regNumber" value={formData.regNumber} onChange={handleChange} placeholder="e.g. 2024REG1092" required />
                </div>

                <div className="form-group">
                  <label htmlFor="modal-roll">Roll No. <span className="req">*</span></label>
                  <input type="text" id="modal-roll" name="rollNumber" value={formData.rollNumber} onChange={handleChange} placeholder="e.g. 24CS084" required />
                </div>

                <div className="form-group">
                  <label htmlFor="modal-school">School / College <span className="req">*</span></label>
                  <input type="text" id="modal-school" name="school" value={formData.school} onChange={handleChange} placeholder="e.g. School of Computer Science" required />
                </div>

                <div className="form-group">
                  <label htmlFor="modal-dept">Department <span className="req">*</span></label>
                  <input type="text" id="modal-dept" name="department" value={formData.department} onChange={handleChange} placeholder="e.g. Computer Science" required />
                </div>

                <div className="form-group">
                  <label htmlFor="modal-section">Section <span className="req">*</span></label>
                  <input type="text" id="modal-section" name="section" value={formData.section} onChange={handleChange} placeholder="e.g. CSE-B" required />
                </div>

                <div className="form-group">
                  <label htmlFor="modal-year">Current Academic Year</label>
                  <select id="modal-year" name="currentYear" value={formData.currentYear} onChange={handleChange}>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate / PhD">Postgraduate / PhD</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="modal-contact">Contact Number <span className="req">*</span></label>
                  <input type="tel" id="modal-contact" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="e.g. +91 98765 43210" required />
                </div>

                <div className="form-group form-group-full">
                  <label htmlFor="modal-gmail">Official / Personal Gmail <span className="req">*</span></label>
                  <input type="email" id="modal-gmail" name="gmail" value={formData.gmail} onChange={handleChange} placeholder="e.g. alex@gmail.com" required />
                </div>

                <div className="form-group form-group-full">
                  <label htmlFor="modal-password">Choose a Password <span className="req">*</span></label>
                  <input type="password" id="modal-password" name="password" value={formData.password} onChange={handleChange} placeholder="At least 8 characters" minLength={8} required />
                </div>

                <div className="form-group form-group-full">
                  <label htmlFor="modal-domain">Primary Track of Interest</label>
                  <select id="modal-domain" name="interestedDomain" value={formData.interestedDomain} onChange={handleChange}>
                    <option value="Quantitative Finance & Algo">Quantitative Finance & Algo Trading</option>
                    <option value="DeFi & Blockchain Infrastructure">DeFi & Blockchain Infrastructure</option>
                    <option value="AI & Machine Learning in Finance">AI & Machine Learning in Finance</option>
                    <option value="Risk Analytics & Economic Modeling">Risk Analytics & Economic Modeling</option>
                    <option value="High-Frequency Trading & Systems">High-Frequency Trading & Systems</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="join-submit-btn" disabled={submitting}>
                  {submitting ? 'SUBMITTING APPLICATION...' : 'SUBMIT MEMBERSHIP APPLICATION →'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="join-success-state">
            <div className="success-icon-circle">✓</div>
            <h3>{needsConfirmation ? 'Almost there!' : 'Application Received!'}</h3>
            <p>
              {needsConfirmation
                ? `We've sent a confirmation link to ${formData.gmail}. Confirm your email, then log in from the Student Portal tab.`
                : 'Welcome to MATRIX FinTech Club. Your profile has been logged and you are now authenticated as a student member.'}
            </p>
            <button type="button" className="join-done-btn" onClick={handleClose}>
              DONE & CONTINUE →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
