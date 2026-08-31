'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePortal, DOMAIN_OPTIONS } from '@/context/PortalContext';

const STATUS_LABEL = {
  pending: '⏳ PENDING SUPER ADMIN REVIEW',
  approved: '✅ LIVE — APPROVED',
  rejected: '✕ REJECTED'
};

export default function AdminPortalPage() {
  const {
    currentUser,
    events,
    createEvent,
    updateEvent,
    deleteEvent,
    resubmitEvent,
    recordings,
    saveRecording,
    updateRecording,
    deleteRecording,
    notes,
    saveNote,
    deleteNote,
    members,
    saveMember,
    getRegisteredStudentsForEvent
  } = usePortal();

  const router = useRouter();
  const [activeTab, setActiveTab] = useState('events');

  // Modal / Form state for events
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    type: 'Summit',
    time: '',
    venue: '',
    description: '',
    banner: 'linear-gradient(135deg, #0f172a, #1e293b)'
  });

  // Inspector state
  const [inspectEventId, setInspectEventId] = useState(null);

  // Recording form state
  const [showRecForm, setShowRecForm] = useState(false);
  const [recForm, setRecForm] = useState({
    title: '',
    type: 'Algo Workshop',
    date: '',
    duration: '',
    speaker: '',
    description: ''
  });

  // Notes upload form state
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteForm, setNoteForm] = useState({
    title: '',
    domain: DOMAIN_OPTIONS[0],
    description: '',
    link: '',
    fileName: '',
    fileData: ''
  });

  // Sync redirect for non-admin
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    } else if (currentUser.role === 'superadmin') {
      router.push('/super-admin');
    } else if (currentUser.role !== 'admin') {
      router.push('/student-portal');
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== 'admin') return null;

  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (editingEventId) {
      updateEvent(editingEventId, eventForm);
    } else {
      createEvent(eventForm);
    }
    setShowEventForm(false);
    setEditingEventId(null);
    setEventForm({ title: '', type: 'Summit', time: '', venue: '', description: '', banner: 'linear-gradient(135deg, #0f172a, #1e293b)' });
  };

  const handleEditEventClick = (evt) => {
    setEditingEventId(evt.id);
    setEventForm({
      title: evt.title,
      type: evt.type,
      time: evt.time,
      venue: evt.venue,
      description: evt.description,
      banner: evt.banner || 'linear-gradient(135deg, #0f172a, #1e293b)'
    });
    setShowEventForm(true);
  };

  const handleSaveRec = (e) => {
    e.preventDefault();
    saveRecording(recForm);
    setShowRecForm(false);
    setRecForm({ title: '', type: 'Algo Workshop', date: '', duration: '', speaker: '', description: '' });
  };

  const handleNoteFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setNoteForm(prev => ({ ...prev, fileName: file.name, fileData: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!noteForm.fileData && !noteForm.link.trim()) {
      alert('Attach a file or provide a link before uploading a note.');
      return;
    }
    saveNote(noteForm);
    setShowNoteForm(false);
    setNoteForm({ title: '', domain: DOMAIN_OPTIONS[0], description: '', link: '', fileName: '', fileData: '' });
  };

  const registeredStudentsForSelectedEvent = inspectEventId ? getRegisteredStudentsForEvent(inspectEventId) : [];
  const inspectEventObj = events.find(e => e.id === inspectEventId);

  const memberList = Object.values(members);

  return (
    <div className="portal-page" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
      <div className="container">
        {/* ADMIN HEADER */}
        <div className="portal-header-card" style={{ background: 'linear-gradient(135deg, #020617, #0f172a)', color: '#ffffff', padding: '32px', borderRadius: '16px', marginBottom: '32px', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', color: '#38bdf8' }}>
                ADMINISTRATIVE CONTROL CONSOLE
              </span>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: '900', margin: '8px 0' }}>
                MATRIX CLUB ADMINISTRATION
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                Authenticated as: <strong style={{ color: '#ffffff' }}>{currentUser.email}</strong>
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => {
                  setEditingEventId(null);
                  setEventForm({ title: '', type: 'Summit', time: '', venue: '', description: '', banner: 'linear-gradient(135deg, #0f172a, #1e293b)' });
                  setShowEventForm(true);
                }}
                className="btn btn-primary"
              >
                + CREATE NEW EVENT
              </button>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="portal-role-switch" style={{ marginBottom: '32px' }}>
          <button
            type="button"
            className={`portal-role-tab ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            EVENTS MANAGEMENT ({events.length})
          </button>
          <button
            type="button"
            className={`portal-role-tab ${activeTab === 'inspector' ? 'active' : ''}`}
            onClick={() => setActiveTab('inspector')}
          >
            STUDENT REGISTRATION INSPECTOR
          </button>
          <button
            type="button"
            className={`portal-role-tab ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => setActiveTab('members')}
          >
            MEMBER DIRECTORY ({memberList.length})
          </button>
          <button
            type="button"
            className={`portal-role-tab ${activeTab === 'recordings' ? 'active' : ''}`}
            onClick={() => setActiveTab('recordings')}
          >
            RECORDINGS ({recordings.length})
          </button>
          <button
            type="button"
            className={`portal-role-tab ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            NOTES ({notes.length})
          </button>
        </div>

        {/* CREATE / EDIT EVENT FORM MODAL */}
        {showEventForm && (
          <div className="portal-detail-backdrop active" onClick={(e) => { if (e.target === e.currentTarget) setShowEventForm(false); }}>
            <div className="portal-detail-dialog" style={{ maxWidth: '640px', padding: '32px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '900', margin: 0 }}>
                  {editingEventId ? 'EDIT EVENT DETAILS' : 'CREATE NEW CLUB EVENT'}
                </h3>
                <button type="button" onClick={() => setShowEventForm(false)} className="join-modal-close">×</button>
              </div>

              <form onSubmit={handleSaveEvent} className="form-grid">
                <div className="form-group form-group-full">
                  <label>Event Title</label>
                  <input type="text" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Category / Type</label>
                  <select value={eventForm.type} onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}>
                    <option value="Summit">Summit</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Lab">Lab Session</option>
                    <option value="Symposium">Symposium</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Date & Time</label>
                  <input type="text" value={eventForm.time} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })} placeholder="Mar 20, 2026 • 3:00 PM" required />
                </div>
                <div className="form-group form-group-full">
                  <label>Venue / Location</label>
                  <input type="text" value={eventForm.venue} onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })} placeholder="Auditorium B / Lab 301" required />
                </div>
                <div className="form-group form-group-full">
                  <label>Full Description</label>
                  <textarea rows={4} value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} required />
                </div>
                <div className="form-actions" style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    {editingEventId ? 'SAVE EVENT CHANGES →' : 'SUBMIT FOR SUPER ADMIN APPROVAL →'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 1: EVENTS MANAGEMENT */}
        {activeTab === 'events' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {events.map(evt => (
                <div key={evt.id} className="simple-event-card">
                  <div className="simple-card-top">
                    <span className={`status-pill ${evt.status || 'approved'}`}>{STATUS_LABEL[evt.status || 'approved']}</span>
                    <span className="simple-card-category" style={{ display: 'block', marginTop: '8px' }}>{evt.type}</span>
                    <h3 className="simple-card-title">{evt.title}</h3>
                    <p className="simple-card-desc">{evt.description}</p>
                  </div>
                  <div className="simple-card-bottom">
                    <div className="simple-card-meta">
                      <span>📅 {evt.time}</span>
                      <span>📍 {evt.venue}</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setInspectEventId(evt.id);
                          setActiveTab('inspector');
                        }}
                        className="btn btn-secondary"
                        style={{ flex: 1, fontSize: '11px' }}
                      >
                        INSPECT STUDENTS
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditEventClick(evt)}
                        className="btn btn-secondary"
                        style={{ fontSize: '11px' }}
                      >
                        EDIT
                      </button>
                      {evt.status === 'rejected' && (
                        <button
                          type="button"
                          onClick={() => resubmitEvent(evt.id)}
                          className="btn btn-secondary"
                          style={{ color: '#0f172a', fontSize: '11px' }}
                        >
                          RESUBMIT
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteEvent(evt.id)}
                        className="btn btn-secondary"
                        style={{ color: '#ef4444', fontSize: '11px' }}
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: REGISTERED STUDENTS INSPECTOR */}
        {activeTab === 'inspector' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>
                SELECT EVENT TO INSPECT REGISTERED MEMBERS:
              </label>
              <select
                value={inspectEventId || ''}
                onChange={(e) => setInspectEventId(e.target.value)}
                style={{ width: '100%', maxWidth: '480px', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit', fontWeight: '600' }}
              >
                <option value="">-- Choose Event --</option>
                {events.map(evt => (
                  <option key={evt.id} value={evt.id}>{evt.title} ({evt.time})</option>
                ))}
              </select>
            </div>

            {inspectEventObj ? (
              <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '900', marginBottom: '4px' }}>
                  {inspectEventObj.title}
                </h3>
                <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>
                  Total Registered Students: <strong>{registeredStudentsForSelectedEvent.length}</strong>
                </p>

                {registeredStudentsForSelectedEvent.length === 0 ? (
                  <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No students registered for this event yet.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                          <th style={{ padding: '12px' }}>NAME</th>
                          <th style={{ padding: '12px' }}>ROLL NO.</th>
                          <th style={{ padding: '12px' }}>REG NO.</th>
                          <th style={{ padding: '12px' }}>DEPARTMENT & YEAR</th>
                          <th style={{ padding: '12px' }}>CONTACT</th>
                          <th style={{ padding: '12px' }}>GMAIL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registeredStudentsForSelectedEvent.map((st, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '12px', fontWeight: '700' }}>{st.name}</td>
                            <td style={{ padding: '12px' }}>{st.rollNumber}</td>
                            <td style={{ padding: '12px' }}>{st.regNumber}</td>
                            <td style={{ padding: '12px' }}>{st.department} ({st.currentYear})</td>
                            <td style={{ padding: '12px' }}>{st.contactNumber}</td>
                            <td style={{ padding: '12px' }}>{st.gmail}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <p style={{ color: '#64748b' }}>Select an event above to inspect student details.</p>
            )}
          </div>
        )}

        {/* TAB 3: MEMBER DIRECTORY */}
        {activeTab === 'members' && (
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '900', marginBottom: '20px' }}>
              REGISTERED MEMBERS DIRECTORY
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '12px' }}>NAME</th>
                    <th style={{ padding: '12px' }}>ROLL / REG NO.</th>
                    <th style={{ padding: '12px' }}>SCHOOL / DEPT</th>
                    <th style={{ padding: '12px' }}>TRACK INTEREST</th>
                    <th style={{ padding: '12px' }}>CONTACT GMAIL</th>
                  </tr>
                </thead>
                <tbody>
                  {memberList.map((m, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontWeight: '700' }}>{m.name}</td>
                      <td style={{ padding: '12px' }}>{m.rollNumber} / {m.regNumber}</td>
                      <td style={{ padding: '12px' }}>{m.department}</td>
                      <td style={{ padding: '12px' }}>{m.interestedDomain}</td>
                      <td style={{ padding: '12px' }}>{m.gmail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: RECORDINGS MANAGER */}
        {activeTab === 'recordings' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '900', margin: 0 }}>
                RECORDED MASTERCLASSES MANAGEMENT
              </h3>
              <button
                type="button"
                onClick={() => setShowRecForm(true)}
                className="btn btn-primary"
              >
                + ADD RECORDING
              </button>
            </div>

            {showRecForm && (
              <form onSubmit={handleSaveRec} className="form-grid" style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <div className="form-group form-group-full">
                  <label>Masterclass Title</label>
                  <input type="text" value={recForm.title} onChange={(e) => setRecForm({ ...recForm, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Speaker / Instructor</label>
                  <input type="text" value={recForm.speaker} onChange={(e) => setRecForm({ ...recForm, speaker: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Date & Duration</label>
                  <input type="text" value={recForm.date} onChange={(e) => setRecForm({ ...recForm, date: e.target.value })} placeholder="Feb 10, 2026 • 54m" required />
                </div>
                <div className="form-group form-group-full">
                  <label>Description</label>
                  <textarea rows={3} value={recForm.description} onChange={(e) => setRecForm({ ...recForm, description: e.target.value })} required />
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '8px' }}>
                  <button type="submit" className="btn btn-primary">SAVE RECORDING</button>
                  <button type="button" onClick={() => setShowRecForm(false)} className="btn btn-secondary">CANCEL</button>
                </div>
              </form>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {recordings.map(rec => (
                <div key={rec.id} className="simple-event-card">
                  <div className="simple-card-top">
                    <span className="simple-card-category">{rec.type}</span>
                    <h3 className="simple-card-title">{rec.title}</h3>
                    <p style={{ color: '#0f172a', fontWeight: '700', fontSize: '12px', margin: '4px 0' }}>🎙 {rec.speaker}</p>
                    <p className="simple-card-desc">{rec.description}</p>
                  </div>
                  <div className="simple-card-bottom">
                    <div className="simple-card-meta">
                      <span>📅 {rec.date}</span>
                      <span>⏱ {rec.duration}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteRecording(rec.id)}
                      className="btn btn-secondary"
                      style={{ width: '100%', color: '#ef4444', marginTop: '12px' }}
                    >
                      DELETE RECORDING
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: NOTES MANAGER */}
        {activeTab === 'notes' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '900', margin: 0 }}>
                NOTES & STUDY MATERIAL
              </h3>
              <button
                type="button"
                onClick={() => setShowNoteForm(true)}
                className="btn btn-primary"
              >
                + UPLOAD NOTE
              </button>
            </div>

            {showNoteForm && (
              <form onSubmit={handleSaveNote} className="form-grid" style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <div className="form-group form-group-full">
                  <label>Note Title</label>
                  <input type="text" value={noteForm.title} onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Domain / Track</label>
                  <select value={noteForm.domain} onChange={(e) => setNoteForm({ ...noteForm, domain: e.target.value })}>
                    {DOMAIN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Upload File (PDF, DOC, image…)</label>
                  <input type="file" onChange={handleNoteFileChange} />
                  {noteForm.fileName && <span style={{ fontSize: '12px', color: '#0f172a', marginTop: '4px', display: 'block' }}>Attached: {noteForm.fileName}</span>}
                </div>
                <div className="form-group form-group-full">
                  <label>Or External Link (Google Drive / URL — optional if a file is attached)</label>
                  <input type="url" value={noteForm.link} onChange={(e) => setNoteForm({ ...noteForm, link: e.target.value })} placeholder="https://drive.google.com/..." />
                </div>
                <div className="form-group form-group-full">
                  <label>Description</label>
                  <textarea rows={3} value={noteForm.description} onChange={(e) => setNoteForm({ ...noteForm, description: e.target.value })} required />
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '8px' }}>
                  <button type="submit" className="btn btn-primary">SAVE NOTE</button>
                  <button type="button" onClick={() => setShowNoteForm(false)} className="btn btn-secondary">CANCEL</button>
                </div>
              </form>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {notes.map(note => (
                <div key={note.id} className="simple-event-card">
                  <div className="simple-card-top">
                    <span className="simple-card-category">{note.domain}</span>
                    <h3 className="simple-card-title">{note.title}</h3>
                    <p className="simple-card-desc">{note.description}</p>
                  </div>
                  <div className="simple-card-bottom">
                    <div className="simple-card-meta">
                      <span>👤 {note.uploadedBy}</span>
                      <span>🗓 {new Date(note.uploadedAt).toLocaleDateString()}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteNote(note.id)}
                      className="btn btn-secondary"
                      style={{ width: '100%', color: '#ef4444', marginTop: '12px' }}
                    >
                      DELETE NOTE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
