'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePortal } from '@/context/PortalContext';

const DEFAULT_PROFILE_TEMPLATE = {
  name: '',
  regNumber: '2024REG1092',
  rollNumber: '24CS084',
  school: 'School of Computer Science',
  department: 'Computer Science',
  section: 'CSE-B',
  currentYear: '2nd Year',
  contactNumber: '+91 98765 43210',
  interestedDomain: 'Quantitative Finance & Algo',
  gmail: ''
};

export default function StudentPortalPage() {
  const {
    currentUser,
    getApprovedEvents,
    recordings,
    notes,
    getJoinedEventsForUser,
    isEventJoined,
    toggleJoinEvent,
    openDetailModal,
    openRecordingPlayer,
    saveMember,
    getStudentActivity,
    updateStudentActivity
  } = usePortal();

  const router = useRouter();
  const [activeTab, setActiveTab] = useState('my-events');
  const [editingProfile, setEditingProfile] = useState(false);

  // memberProfile is derived every render so it's always safe to call as a hook
  // initializer below, regardless of whether currentUser has hydrated yet.
  // currentUser (from the /api/profile fetch) already carries every field —
  // there's no separate per-student lookup needed (getMemberByEmail only
  // ever resolves for staff, since the member directory is staff-only).
  const memberProfile = currentUser || DEFAULT_PROFILE_TEMPLATE;

  const [profileForm, setProfileForm] = useState(memberProfile);

  // Sync redirect for unauthenticated, admin, or super admin users
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    } else if (currentUser.role === 'admin') {
      router.push('/admin-portal');
    } else if (currentUser.role === 'superadmin') {
      router.push('/super-admin');
    }
  }, [currentUser, router]);

  // Live session timer tracking
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'student') return;
    const interval = setInterval(() => {
      updateStudentActivity(currentUser.email, 1, 0, false);
    }, 1000);
    return () => clearInterval(interval);
  }, [currentUser, updateStudentActivity]);

  if (!currentUser || currentUser.role !== 'student') {
    return null;
  }

  // A new member's application must be approved by a Super Admin before
  // they can use the portal — mirrors the event approval workflow. RLS
  // enforces this server-side too (recordings/notes reads and event
  // registration all require is_member_approved()); this is just the UX.
  if (currentUser.membershipStatus !== 'approved') {
    return (
      <div className="portal-page" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
        <div className="container">
          <div style={{ maxWidth: '520px', margin: '0 auto', textAlign: 'center', padding: '48px 32px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
            {currentUser.membershipStatus === 'rejected' ? (
              <>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>✕</div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '900', color: '#0f172a', marginBottom: '8px' }}>MEMBERSHIP APPLICATION DECLINED</h2>
                <p style={{ color: '#64748b', fontSize: '14px' }}>
                  Your membership application wasn&apos;t approved by the Super Admin. If you believe this is a mistake, reach out to the club directly.
                </p>
              </>
            ) : (
              <>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>⏳</div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '900', color: '#0f172a', marginBottom: '8px' }}>APPLICATION PENDING SUPER ADMIN APPROVAL</h2>
                <p style={{ color: '#64748b', fontSize: '14px' }}>
                  Thanks for applying to MATRIX FinTech Club{currentUser.name ? `, ${currentUser.name}` : ''}. A Super Admin needs to approve your membership before you can register for events or access recordings and notes. Check back soon.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Only Super-Admin-approved events are ever visible/joinable here.
  const approvedEvents = getApprovedEvents();
  const userActivity = getStudentActivity(currentUser.email);
  const myEvents = getJoinedEventsForUser(currentUser.email);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      await saveMember(profileForm);
    } catch (err) {
      alert(err.message || 'Failed to save profile.');
      return;
    }
    setEditingProfile(false);
  };

  const handleNoteDownload = (note) => {
    if (note.fileData) {
      const a = document.createElement('a');
      a.href = note.fileData;
      a.download = note.fileName || `${note.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (note.link) {
      window.open(note.link, '_blank', 'noopener,noreferrer');
    }
  };

  const formatHoursMins = (sec) => {
    const s = Math.max(0, Number(sec) || 0);
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  return (
    <div className="portal-page" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
      <div className="container">
        {/* WELCOME HEADER */}
        <div className="portal-header-card" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: '#ffffff', padding: '32px', borderRadius: '16px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', color: '#94a3b8' }}>
                STUDENT MEMBER DASHBOARD
              </span>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: '900', margin: '8px 0' }}>
                WELCOME, {memberProfile.name.toUpperCase()}
              </h1>
              <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
                {memberProfile.rollNumber} • {memberProfile.department} • {memberProfile.interestedDomain}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px 18px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '20px', fontWeight: '800' }}>{myEvents.length}</span>
                <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Registered Events</span>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px 18px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '20px', fontWeight: '800' }}>{formatHoursMins(userActivity.totalSeconds)}</span>
                <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Learning Time</span>
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="portal-role-switch" style={{ marginBottom: '32px' }}>
          <button
            type="button"
            className={`portal-role-tab ${activeTab === 'my-events' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-events')}
          >
            MY EVENTS ({myEvents.length})
          </button>
          <button
            type="button"
            className={`portal-role-tab ${activeTab === 'all-events' ? 'active' : ''}`}
            onClick={() => setActiveTab('all-events')}
          >
            ALL EVENTS ({approvedEvents.length})
          </button>
          <button
            type="button"
            className={`portal-role-tab ${activeTab === 'recordings' ? 'active' : ''}`}
            onClick={() => setActiveTab('recordings')}
          >
            RECORDED SESSIONS ({recordings.length})
          </button>
          <button
            type="button"
            className={`portal-role-tab ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            NOTES ({notes.length})
          </button>
          <button
            type="button"
            className={`portal-role-tab ${activeTab === 'metrics' ? 'active' : ''}`}
            onClick={() => setActiveTab('metrics')}
          >
            TIME TRACKER
          </button>
          <button
            type="button"
            className={`portal-role-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            MY PROFILE
          </button>
        </div>

        {/* TAB 1: MY EVENTS */}
        {activeTab === 'my-events' && (
          <div>
            <h2 className="section-title" style={{ fontSize: '22px', marginBottom: '20px' }}>MY REGISTERED EVENTS</h2>
            {myEvents.length === 0 ? (
              <div style={{ padding: '48px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', textAlign: 'center' }}>
                <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '16px' }}>You haven&apos;t registered for any events yet.</p>
                <button type="button" className="btn btn-primary" onClick={() => setActiveTab('all-events')}>
                  BROWSE ALL EVENTS →
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {myEvents.map(evt => (
                  <div key={evt.id} className="simple-event-card">
                    <div className="simple-card-top">
                      <span className="simple-card-category">{evt.type}</span>
                      <h3 className="simple-card-title">{evt.title}</h3>
                      <p className="simple-card-desc">{evt.description}</p>
                    </div>
                    <div className="simple-card-bottom">
                      <div className="simple-card-meta">
                        <span>📅 {evt.time}</span>
                        <span>📍 {evt.venue}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleJoinEvent(evt.id).catch(err => alert(err.message))}
                        className="btn portal-btn-joined"
                        style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
                      >
                        ✓ REGISTERED (CLICK TO LEAVE)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ALL EVENTS */}
        {activeTab === 'all-events' && (
          <div>
            <h2 className="section-title" style={{ fontSize: '22px', marginBottom: '20px' }}>ALL CLUB EVENTS & WORKSHOPS</h2>
            {approvedEvents.length === 0 ? (
              <div className="empty-events-box">
                <p className="empty-events-text">No upcoming events.</p>
              </div>
            ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {approvedEvents.map(evt => {
                const joined = isEventJoined(evt.id, currentUser.email);
                return (
                  <div key={evt.id} className="simple-event-card">
                    <div className="simple-card-top">
                      <span className="simple-card-category">{evt.type}</span>
                      <h3 className="simple-card-title">{evt.title}</h3>
                      <p className="simple-card-desc">{evt.description}</p>
                    </div>
                    <div className="simple-card-bottom">
                      <div className="simple-card-meta">
                        <span>📅 {evt.time}</span>
                        <span>📍 {evt.venue}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button
                          type="button"
                          onClick={() => openDetailModal(evt)}
                          className="btn btn-secondary"
                          style={{ flex: 1, fontSize: '12px' }}
                        >
                          DETAILS
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleJoinEvent(evt.id).catch(err => alert(err.message))}
                          className={`btn ${joined ? 'portal-btn-joined' : 'btn-primary'}`}
                          style={{ flex: 1.5, fontSize: '12px', justifyContent: 'center' }}
                        >
                          {joined ? '✓ REGISTERED' : 'REGISTER NOW'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            )}
          </div>
        )}

        {/* TAB 3: RECORDED MASTERCLASS SESSIONS */}
        {activeTab === 'recordings' && (
          <div>
            <h2 className="section-title" style={{ fontSize: '22px', marginBottom: '20px' }}>MASTERCLASS RECORDING LIBRARY</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {recordings.map(rec => (
                <div key={rec.id} className="simple-event-card">
                  <div className="simple-card-top">
                    <span className="simple-card-category">{rec.type}</span>
                    <h3 className="simple-card-title">{rec.title}</h3>
                    <p style={{ color: '#0f172a', fontWeight: '700', fontSize: '12px', margin: '6px 0' }}>🎙 {rec.speaker}</p>
                    <p className="simple-card-desc">{rec.description}</p>
                  </div>
                  <div className="simple-card-bottom">
                    <div className="simple-card-meta">
                      <span>📅 {rec.date}</span>
                      <span>⏱ {rec.duration}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => openRecordingPlayer(rec)}
                      className="btn btn-primary"
                      style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
                    >
                      ▶ STREAM MASTERCLASS →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: NOTES LIBRARY */}
        {activeTab === 'notes' && (
          <div>
            <h2 className="section-title" style={{ fontSize: '22px', marginBottom: '20px' }}>SHARED NOTES & STUDY MATERIAL</h2>
            {notes.length === 0 ? (
              <div style={{ padding: '48px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', textAlign: 'center' }}>
                <p style={{ color: '#64748b', fontSize: '15px' }}>No notes have been uploaded yet. Check back soon.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {notes.map(note => {
                  const hasFile = Boolean(note.fileData || note.link);
                  return (
                    <div key={note.id} className="simple-event-card">
                      <div className="simple-card-top">
                        <span className="simple-card-category">{note.domain}</span>
                        <h3 className="simple-card-title">{note.title}</h3>
                        {note.topics && note.topics.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '8px 0' }}>
                            {note.topics.map((topic, i) => (
                              <span key={i} style={{ fontSize: '11px', fontWeight: '600', color: '#0f172a', background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '2px 10px', borderRadius: '100px' }}>{topic}</span>
                            ))}
                          </div>
                        )}
                        <p className="simple-card-desc">{note.description}</p>
                      </div>
                      <div className="simple-card-bottom">
                        <div className="simple-card-meta">
                          <span>👤 {note.uploadedBy}</span>
                          <span>🗓 {new Date(note.uploadedAt).toLocaleDateString()}</span>
                          {note.fileType && <span>📎 {note.fileType}</span>}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleNoteDownload(note)}
                          className="btn btn-primary"
                          disabled={!hasFile}
                          style={{ width: '100%', justifyContent: 'center', marginTop: '12px', opacity: hasFile ? 1 : 0.5, cursor: hasFile ? 'pointer' : 'not-allowed' }}
                        >
                          {hasFile ? '📄 READ / DOWNLOAD NOTE →' : 'NO FILE ATTACHED'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: TIME TRACKER & METRICS */}
        {activeTab === 'metrics' && (
          <div>
            <h2 className="section-title" style={{ fontSize: '22px', marginBottom: '20px' }}>STUDENT ACTIVITY & METRICS</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <div style={{ background: '#ffffff', padding: '24px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>TOTAL TIME ON PORTAL</span>
                <h3 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', margin: '8px 0' }}>{formatHoursMins(userActivity.totalSeconds)}</h3>
                <p style={{ fontSize: '12px', color: '#64748b' }}>Live counter running</p>
              </div>

              <div style={{ background: '#ffffff', padding: '24px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>WEBSITE ACTIVE TIME</span>
                <h3 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', margin: '8px 0' }}>{formatHoursMins(userActivity.websiteSeconds)}</h3>
                <p style={{ fontSize: '12px', color: '#64748b' }}>Dashboard & portal navigation</p>
              </div>

              <div style={{ background: '#ffffff', padding: '24px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>MASTERCLASS WATCH TIME</span>
                <h3 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', margin: '8px 0' }}>{formatHoursMins(userActivity.recordingSeconds)}</h3>
                <p style={{ fontSize: '12px', color: '#64748b' }}>Video session consumption</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: MY PROFILE */}
        {activeTab === 'profile' && (
          <div style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 className="section-title" style={{ fontSize: '22px', margin: 0 }}>STUDENT PROFILE DETAILS</h2>
              {!editingProfile && (
                <button type="button" onClick={() => { setProfileForm(memberProfile); setEditingProfile(true); }} className="btn btn-secondary">
                  ✏ EDIT PROFILE
                </button>
              )}
            </div>

            {!editingProfile ? (
              <div style={{ background: '#ffffff', padding: '32px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '700' }}>FULL NAME</span>
                    <strong style={{ fontSize: '16px', color: '#0f172a' }}>{memberProfile.name}</strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '700' }}>REGISTRATION NUMBER</span>
                    <strong style={{ fontSize: '16px', color: '#0f172a' }}>{memberProfile.regNumber}</strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '700' }}>ROLL NUMBER</span>
                    <strong style={{ fontSize: '16px', color: '#0f172a' }}>{memberProfile.rollNumber}</strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '700' }}>SECTION & YEAR</span>
                    <strong style={{ fontSize: '16px', color: '#0f172a' }}>{memberProfile.section} ({memberProfile.currentYear})</strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '700' }}>DEPARTMENT</span>
                    <strong style={{ fontSize: '16px', color: '#0f172a' }}>{memberProfile.department}</strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '700' }}>CONTACT NUMBER</span>
                    <strong style={{ fontSize: '16px', color: '#0f172a' }}>{memberProfile.contactNumber}</strong>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '700' }}>GMAIL / EMAIL</span>
                    <strong style={{ fontSize: '16px', color: '#0f172a' }}>{memberProfile.gmail}</strong>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '700' }}>PRIMARY TRACK</span>
                    <strong style={{ fontSize: '16px', color: '#0f172a' }}>{memberProfile.interestedDomain}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProfileSave} style={{ background: '#ffffff', padding: '32px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Registration Number</label>
                    <input type="text" value={profileForm.regNumber} onChange={(e) => setProfileForm({ ...profileForm, regNumber: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Roll Number</label>
                    <input type="text" value={profileForm.rollNumber} onChange={(e) => setProfileForm({ ...profileForm, rollNumber: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Section</label>
                    <input type="text" value={profileForm.section} onChange={(e) => setProfileForm({ ...profileForm, section: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Contact Number</label>
                    <input type="text" value={profileForm.contactNumber} onChange={(e) => setProfileForm({ ...profileForm, contactNumber: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Current Year</label>
                    <input type="text" value={profileForm.currentYear} onChange={(e) => setProfileForm({ ...profileForm, currentYear: e.target.value })} required />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button type="submit" className="btn btn-primary">SAVE CHANGES</button>
                  <button type="button" onClick={() => setEditingProfile(false)} className="btn btn-secondary">CANCEL</button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
