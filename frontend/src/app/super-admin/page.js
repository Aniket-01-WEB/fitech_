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
    members,
    getPendingAdminRequests,
    approveAdminRequest,
    rejectAdminRequest,
    notes,
    getPendingNotes,
    approveNote,
    rejectNote,
    recordings,
    getPendingRecordings,
    approveRecording,
    rejectRecording
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
  const pendingAdminRequests = getPendingAdminRequests();
  const pendingNotes = getPendingNotes();
  const pendingRecordings = getPendingRecordings();
  const memberList = Object.values(members).sort((a, b) => a.name.localeCompare(b.name));
  const memberCount = memberList.length;

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
                <span style={{ display: 'block', fontSize: '20px', fontWeight: '800' }}>{pendingAdminRequests.length}</span>
                <span style={{ fontSize: '11px', color: '#c4b5fd', textTransform: 'uppercase' }}>Admin Requests</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.12)', padding: '12px 18px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '20px', fontWeight: '800' }}>{events.length}</span>
                <span style={{ fontSize: '11px', color: '#c4b5fd', textTransform: 'uppercase' }}>Total Events</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.12)', padding: '12px 18px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '20px', fontWeight: '800' }}>{pendingNotes.length + pendingRecordings.length}</span>
                <span style={{ fontSize: '11px', color: '#c4b5fd', textTransform: 'uppercase' }}>Pending Content</span>
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
          <button
            type="button"
            className={`portal-role-tab ${activeTab === 'admin-requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin-requests')}
          >
            ADMIN REQUESTS ({pendingAdminRequests.length})
          </button>
          <button
            type="button"
            className={`portal-role-tab ${activeTab === 'directory' ? 'active' : ''}`}
            onClick={() => setActiveTab('directory')}
          >
            MEMBER DIRECTORY ({memberCount})
          </button>
          <button
            type="button"
            className={`portal-role-tab ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            NOTES ({pendingNotes.length})
          </button>
          <button
            type="button"
            className={`portal-role-tab ${activeTab === 'recordings' ? 'active' : ''}`}
            onClick={() => setActiveTab('recordings')}
          >
            RECORDINGS ({pendingRecordings.length})
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

        {/* TAB 3: ADMIN ACCESS REQUESTS */}
        {activeTab === 'admin-requests' && (
          <div>
            {pendingAdminRequests.length === 0 ? (
              <div style={{ padding: '48px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', textAlign: 'center' }}>
                <p style={{ color: '#64748b', fontSize: '15px' }}>No pending admin access requests. Members who apply for admin access from their Student Portal will show up here for approval.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {pendingAdminRequests.map(request => (
                  <div key={request.id} className="simple-event-card">
                    <div className="simple-card-top">
                      <span className="status-pill pending">⏳ PENDING REVIEW</span>
                      <h3 className="simple-card-title" style={{ marginTop: '8px' }}>{request.applicantName}</h3>
                      <p className="simple-card-desc">
                        {request.reason || 'No reason given.'}
                      </p>
                    </div>
                    <div className="simple-card-bottom">
                      <div className="simple-card-meta">
                        <span>📧 {request.applicantEmail}</span>
                        <span>🗓 Requested {new Date(request.requestedAt).toLocaleDateString()}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button
                          type="button"
                          onClick={() => approveAdminRequest(request.id).catch(err => alert(err.message))}
                          className="btn btn-primary"
                          style={{ flex: 1, justifyContent: 'center', fontSize: '12px', background: '#15803d', border: '1px solid #15803d' }}
                        >
                          ✓ APPROVE — GRANT ADMIN
                        </button>
                        <button
                          type="button"
                          onClick={() => rejectAdminRequest(request.id).catch(err => alert(err.message))}
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

        {/* TAB 4: MEMBER DIRECTORY */}
        {activeTab === 'directory' && (
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '900', marginBottom: '20px' }}>
              CLUB MEMBER DIRECTORY
            </h3>
            {memberList.length === 0 ? (
              <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No members yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '12px' }}>NAME</th>
                      <th style={{ padding: '12px' }}>ROLL / REG NO.</th>
                      <th style={{ padding: '12px' }}>DEPARTMENT / YEAR</th>
                      <th style={{ padding: '12px' }}>TRACK INTEREST</th>
                      <th style={{ padding: '12px' }}>ROLE</th>
                      <th style={{ padding: '12px' }}>CONTACT / EMAIL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {memberList.map((m, idx) => (
                      <tr key={m.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px', fontWeight: '700' }}>{m.name}</td>
                        <td style={{ padding: '12px' }}>{m.rollNumber || '—'} / {m.regNumber || '—'}</td>
                        <td style={{ padding: '12px' }}>{m.department || '—'} {m.currentYear ? `(${m.currentYear})` : ''}</td>
                        <td style={{ padding: '12px' }}>{m.interestedDomain || '—'}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: m.role === 'superadmin' ? '#6d28d9' : m.role === 'admin' ? '#0f172a' : '#64748b' }}>
                            {m.role}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>{m.contactNumber || '—'} / {m.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: NOTES REVIEW */}
        {activeTab === 'notes' && (
          <div>
            {pendingNotes.length === 0 ? (
              <div style={{ padding: '48px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', textAlign: 'center' }}>
                <p style={{ color: '#64748b', fontSize: '15px' }}>No pending notes. Notes an Admin uploads will show up here for approval.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {pendingNotes.map(note => (
                  <div key={note.id} className="simple-event-card">
                    <div className="simple-card-top">
                      <span className="status-pill pending">⏳ PENDING REVIEW</span>
                      <span className="simple-card-category" style={{ display: 'block', marginTop: '8px' }}>{note.domain}</span>
                      <h3 className="simple-card-title">{note.title}</h3>
                      <p className="simple-card-desc">{note.description}</p>
                    </div>
                    <div className="simple-card-bottom">
                      <div className="simple-card-meta">
                        <span>👤 {note.uploadedBy}</span>
                        <span>📎 {note.fileType || (note.hasUpload ? 'Uploaded file' : 'External link')}</span>
                      </div>
                      {(note.fileData || note.link) && (
                        <a href={note.fileData || note.link} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px', fontSize: '12px' }}>
                          PREVIEW ↗
                        </a>
                      )}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button
                          type="button"
                          onClick={() => approveNote(note.id).catch(err => alert(err.message))}
                          className="btn btn-primary"
                          style={{ flex: 1, justifyContent: 'center', fontSize: '12px', background: '#15803d', border: '1px solid #15803d' }}
                        >
                          ✓ APPROVE
                        </button>
                        <button
                          type="button"
                          onClick={() => rejectNote(note.id).catch(err => alert(err.message))}
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

        {/* TAB 6: RECORDINGS REVIEW */}
        {activeTab === 'recordings' && (
          <div>
            {pendingRecordings.length === 0 ? (
              <div style={{ padding: '48px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', textAlign: 'center' }}>
                <p style={{ color: '#64748b', fontSize: '15px' }}>No pending recordings. Masterclasses an Admin uploads will show up here for approval.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {pendingRecordings.map(rec => (
                  <div key={rec.id} className="simple-event-card">
                    <div className="simple-card-top">
                      <span className="status-pill pending">⏳ PENDING REVIEW</span>
                      <span className="simple-card-category" style={{ display: 'block', marginTop: '8px' }}>{rec.type}</span>
                      <h3 className="simple-card-title">{rec.title}</h3>
                      <p style={{ color: '#0f172a', fontWeight: '700', fontSize: '12px', margin: '6px 0' }}>🎙 {rec.speaker}</p>
                      <p className="simple-card-desc">{rec.description}</p>
                    </div>
                    <div className="simple-card-bottom">
                      <div className="simple-card-meta">
                        <span>📅 {rec.date}</span>
                        <span>📎 {rec.hasUpload ? 'Uploaded video' : 'External link'}</span>
                      </div>
                      {rec.videoUrl && (
                        <a href={rec.videoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px', fontSize: '12px' }}>
                          PREVIEW ↗
                        </a>
                      )}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button
                          type="button"
                          onClick={() => approveRecording(rec.id).catch(err => alert(err.message))}
                          className="btn btn-primary"
                          style={{ flex: 1, justifyContent: 'center', fontSize: '12px', background: '#15803d', border: '1px solid #15803d' }}
                        >
                          ✓ APPROVE
                        </button>
                        <button
                          type="button"
                          onClick={() => rejectRecording(rec.id).catch(err => alert(err.message))}
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
      </div>
    </div>
  );
}
