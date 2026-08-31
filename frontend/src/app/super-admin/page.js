'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePortal } from '@/context/PortalContext';

const STATUS_LABEL = {
  pending: '⏳ PENDING REVIEW',
  approved: '✅ APPROVED — LIVE',
  rejected: '✕ REJECTED'
};

export default function SuperAdminPortalPage() {
  const {
    currentUser,
    events,
    approveEvent,
    rejectEvent,
    resubmitEvent,
    getPendingEvents,
    members
  } = usePortal();

  const router = useRouter();
  const [activeTab, setActiveTab] = useState('pending');

  // Sync redirect for non-super-admin
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    } else if (currentUser.role === 'admin') {
      router.push('/admin-portal');
    } else if (currentUser.role !== 'superadmin') {
      router.push('/student-portal');
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== 'superadmin') return null;

  const pendingEvents = getPendingEvents();
  const memberCount = Object.keys(members).length;

  return (
    <div className="portal-page" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
      <div className="container">
        {/* SUPER ADMIN HEADER */}
        <div className="portal-header-card" style={{ background: 'linear-gradient(135deg, #1e1033, #4c1d95)', color: '#ffffff', padding: '32px', borderRadius: '16px', marginBottom: '32px', border: '1px solid #6d28d9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', color: '#c4b5fd' }}>
                SUPER ADMIN OVERSIGHT CONSOLE
              </span>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: '900', margin: '8px 0' }}>
                MATRIX CLUB SUPER ADMIN
              </h1>
              <p style={{ color: '#ddd6fe', fontSize: '14px' }}>
                Authenticated as: <strong style={{ color: '#ffffff' }}>{currentUser.name || currentUser.email}</strong> — final approver for all club events.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(255,255,255,0.12)', padding: '12px 18px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '20px', fontWeight: '800' }}>{pendingEvents.length}</span>
                <span style={{ fontSize: '11px', color: '#c4b5fd', textTransform: 'uppercase' }}>Awaiting Review</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.12)', padding: '12px 18px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '20px', fontWeight: '800' }}>{events.length}</span>
                <span style={{ fontSize: '11px', color: '#c4b5fd', textTransform: 'uppercase' }}>Total Events</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.12)', padding: '12px 18px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '20px', fontWeight: '800' }}>{memberCount}</span>
                <span style={{ fontSize: '11px', color: '#c4b5fd', textTransform: 'uppercase' }}>Club Members</span>
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="portal-role-switch" style={{ marginBottom: '32px' }}>
          <button
            type="button"
            className={`portal-role-tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            PENDING REQUESTS ({pendingEvents.length})
          </button>
          <button
            type="button"
            className={`portal-role-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            ALL EVENTS ({events.length})
          </button>
        </div>

        {/* TAB 1: PENDING REQUESTS */}
        {activeTab === 'pending' && (
          <div>
            {pendingEvents.length === 0 ? (
              <div style={{ padding: '48px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', textAlign: 'center' }}>
                <p style={{ color: '#64748b', fontSize: '15px' }}>No pending event requests. New events created by an Admin will show up here for approval.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {pendingEvents.map(evt => (
                  <div key={evt.id} className="simple-event-card">
                    <div className="simple-card-top">
                      <span className="status-pill pending">{STATUS_LABEL.pending}</span>
                      <span className="simple-card-category" style={{ display: 'block', marginTop: '8px' }}>{evt.type}</span>
                      <h3 className="simple-card-title">{evt.title}</h3>
                      <p className="simple-card-desc">{evt.description}</p>
                    </div>
                    <div className="simple-card-bottom">
                      <div className="simple-card-meta">
                        <span>📅 {evt.time}</span>
                        <span>📍 {evt.venue}</span>
                        <span>👤 Requested by {evt.createdBy}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button
                          type="button"
                          onClick={() => approveEvent(evt.id).catch(err => alert(err.message))}
                          className="btn btn-primary"
                          style={{ flex: 1, justifyContent: 'center', fontSize: '12px', background: '#15803d', border: '1px solid #15803d' }}
                        >
                          ✓ APPROVE
                        </button>
                        <button
                          type="button"
                          onClick={() => rejectEvent(evt.id).catch(err => alert(err.message))}
                          className="btn btn-secondary"
                          style={{ flex: 1, justifyContent: 'center', fontSize: '12px', color: '#ef4444' }}
                        >
                          ✕ REJECT
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ALL EVENTS OVERSIGHT */}
        {activeTab === 'all' && (
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '900', marginBottom: '20px' }}>
              ALL CLUB EVENTS
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '12px' }}>EVENT</th>
                    <th style={{ padding: '12px' }}>REQUESTED BY</th>
                    <th style={{ padding: '12px' }}>STATUS</th>
                    <th style={{ padding: '12px' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map(evt => (
                    <tr key={evt.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px' }}>
                        <strong style={{ display: 'block' }}>{evt.title}</strong>
                        <span style={{ color: '#64748b', fontSize: '12px' }}>{evt.time} • {evt.venue}</span>
                      </td>
                      <td style={{ padding: '12px' }}>{evt.createdBy}</td>
                      <td style={{ padding: '12px' }}>
                        <span className={`status-pill ${evt.status || 'approved'}`}>{STATUS_LABEL[evt.status || 'approved']}</span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {evt.status !== 'approved' && (
                            <button type="button" onClick={() => approveEvent(evt.id).catch(err => alert(err.message))} className="btn btn-secondary" style={{ fontSize: '11px', color: '#15803d' }}>APPROVE</button>
                          )}
                          {evt.status !== 'rejected' && (
                            <button type="button" onClick={() => rejectEvent(evt.id).catch(err => alert(err.message))} className="btn btn-secondary" style={{ fontSize: '11px', color: '#ef4444' }}>REJECT</button>
                          )}
                          {evt.status !== 'pending' && (
                            <button type="button" onClick={() => resubmitEvent(evt.id).catch(err => alert(err.message))} className="btn btn-secondary" style={{ fontSize: '11px' }}>RESET TO PENDING</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
