'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePortal } from '@/context/PortalContext';

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

  // Notes Modal state
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteForm, setNoteForm] = useState({
    title: '',
    domain: 'Quantitative Finance & Algo Trading',
    author: '',
    fileType: 'PDF / Research Notes',
    description: '',
    topicsStr: 'Quant Models, Market Microstructure',
    link: '',
    fileName: '',
    fileData: ''
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

  const handleNoteFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setNoteForm(prev => ({ ...prev, fileName: file.name, fileData: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveNoteSubmit = (e) => {
    e.preventDefault();
    if (!noteForm.fileData && !noteForm.link.trim()) {
      alert('Attach a file or provide a link before uploading a note.');
      return;
    }
    const topics = noteForm.topicsStr
      ? noteForm.topicsStr.split(',').map(t => t.trim()).filter(Boolean)
      : ['General Notes'];

    saveNote({
      title: noteForm.title,
      domain: noteForm.domain,
      author: noteForm.author || (currentUser ? currentUser.email : 'Admin'),
      fileType: noteForm.fileType,
      description: noteForm.description,
      topics: topics,
      link: noteForm.link,
      fileName: noteForm.fileName,
      fileData: noteForm.fileData
    });

    setShowNoteModal(false);
    setNoteForm({
      title: '',
      domain: 'Quantitative Finance & Algo Trading',
      author: '',
      fileType: 'PDF / Research Notes',
      description: '',
      topicsStr: 'Quant Models, Market Microstructure',
      link: '',
      fileName: '',
      fileData: ''
    });
  };

  const handleSaveRec = (e) => {
    e.preventDefault();
    saveRecording(recForm);
    setShowRecForm(false);
    setRecForm({ title: '', type: 'Algo Workshop', date: '', duration: '', speaker: '', description: '' });
  };

  const registeredStudentsForSelectedEvent = inspectEventId ? getRegisteredStudentsForEvent(inspectEventId) : [];
  const inspectEventObj = events.find(e => e.id === inspectEventId);
  const memberList = Object.values(members);
  const notesList = notes || [];

  return (
    <div className="portal-page" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
      <div className="container">
        {/* ADMIN HEADER - BLACK & WHITE THEME */}
        <div
          className="portal-header-card"
          style={{
            background: '#0a0a0a',
            color: '#ffffff',
            padding: '36px 32px',
            borderRadius: '16px',
            marginBottom: '32px',
            border: '1.5px solid #27272a',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#a1a1aa' }}>
                ADMINISTRATIVE CONTROL CONSOLE
              </span>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(26px, 3.2vw, 38px)', fontWeight: '900', margin: '8px 0', letterSpacing: '-0.5px' }}>
                MATRIX CLUB ADMINISTRATION
              </h1>
              <p style={{ color: '#a1a1aa', fontSize: '14px', margin: 0 }}>
                Authenticated as: <strong style={{ color: '#ffffff' }}>{currentUser.email}</strong>
              </p>
            </div>

            {/* BUTTON CONTROLS: CREATE EVENT + UPLOAD NOTES */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  setEditingEventId(null);
                  setEventForm({ title: '', type: 'Summit', time: '', venue: '', description: '', banner: 'linear-gradient(135deg, #0f172a, #1e293b)' });
                  setShowEventForm(true);
                }}
                className="admin-btn admin-btn-edit"
                style={{ padding: '12px 20px', fontSize: '12px', background: '#ffffff', color: '#000000', border: '1.5px solid #ffffff' }}
              >
                + CREATE NEW EVENT
              </button>

              <button
                type="button"
                onClick={() => {
                  setNoteForm({
                    title: '',
                    domain: 'Quantitative Finance & Algo Trading',
                    author: 'Admin / Lead Strategist',
                    fileType: 'PDF / Research Notes',
                    description: '',
                    topicsStr: 'Quant Models, Market Microstructure',
                    link: '',
                    fileName: '',
                    fileData: ''
                  });
                  setShowNoteModal(true);
                }}
                className="admin-btn"
                style={{
                  padding: '12px 20px',
                  fontSize: '12px',
                  background: 'transparent',
                  color: '#ffffff',
                  border: '1.5px solid #ffffff'
                }}
              >
                + UPLOAD NOTES
              </button>
            </div>
          </div>
        </div>

        {/* TABS - MONOCHROME SWITCHER */}
        <div className="portal-role-switch" style={{ marginBottom: '32px', display: 'flex', flexWrap: 'wrap', gap: '8px', background: '#f8fafc', padding: '6px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <button
            type="button"
            className={`portal-role-tab ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
            style={activeTab === 'events' ? { background: '#0a0a0a', color: '#ffffff' } : { color: '#0f172a' }}
          >
            EVENTS MANAGEMENT ({events.length})
          </button>
          <button
            type="button"
            className={`portal-role-tab ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
            style={activeTab === 'notes' ? { background: '#0a0a0a', color: '#ffffff' } : { color: '#0f172a' }}
          >
            NOTES & STUDY MATERIAL ({notesList.length})
          </button>
          <button
            type="button"
            className={`portal-role-tab ${activeTab === 'inspector' ? 'active' : ''}`}
            onClick={() => setActiveTab('inspector')}
            style={activeTab === 'inspector' ? { background: '#0a0a0a', color: '#ffffff' } : { color: '#0f172a' }}
          >
            STUDENT REGISTRATION INSPECTOR
          </button>
          <button
            type="button"
            className={`portal-role-tab ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => setActiveTab('members')}
            style={activeTab === 'members' ? { background: '#0a0a0a', color: '#ffffff' } : { color: '#0f172a' }}
          >
            MEMBER DIRECTORY ({memberList.length})
          </button>
          <button
            type="button"
            className={`portal-role-tab ${activeTab === 'recordings' ? 'active' : ''}`}
            onClick={() => setActiveTab('recordings')}
            style={activeTab === 'recordings' ? { background: '#0a0a0a', color: '#ffffff' } : { color: '#0f172a' }}
          >
            RECORDINGS ({recordings.length})
          </button>
        </div>

        {/* CREATE / EDIT EVENT FORM MODAL */}
        {showEventForm && (
          <div className="portal-detail-backdrop active" onClick={(e) => { if (e.target === e.currentTarget) setShowEventForm(false); }}>
            <div className="portal-detail-dialog" style={{ maxWidth: '640px', padding: '32px', borderRadius: '16px', border: '2px solid #000000', background: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1.5px solid #000000', paddingBottom: '12px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '900', margin: 0, color: '#000000' }}>
                  {editingEventId ? 'EDIT EVENT DETAILS' : 'CREATE NEW CLUB EVENT'}
                </h3>
                <button type="button" onClick={() => setShowEventForm(false)} className="join-modal-close">×</button>
              </div>

              <form onSubmit={handleSaveEvent} className="form-grid">
                <div className="form-group form-group-full">
                  <label style={{ fontWeight: '700', color: '#000000' }}>Event Title</label>
                  <input type="text" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: '700', color: '#000000' }}>Category / Type</label>
                  <select value={eventForm.type} onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}>
                    <option value="Summit">Summit</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Lab">Lab Session</option>
                    <option value="Symposium">Symposium</option>
                    <option value="Session">Session</option>
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: '700', color: '#000000' }}>Date & Time</label>
                  <input type="text" value={eventForm.time} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })} placeholder="Mar 20, 2026 • 3:00 PM" required />
                </div>
                <div className="form-group form-group-full">
                  <label style={{ fontWeight: '700', color: '#000000' }}>Venue / Location</label>
                  <input type="text" value={eventForm.venue} onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })} placeholder="Auditorium B / Lab 301" required />
                </div>
                <div className="form-group form-group-full">
                  <label style={{ fontWeight: '700', color: '#000000' }}>Full Description</label>
                  <textarea rows={4} value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} required />
                </div>
                <div className="form-actions" style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
                  <button type="submit" className="admin-btn admin-btn-inspect" style={{ width: '100%', padding: '14px', fontSize: '13px' }}>
                    {editingEventId ? 'SAVE EVENT CHANGES →' : 'SUBMIT FOR SUPER ADMIN APPROVAL →'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* UPLOAD NOTES MODAL */}
        {showNoteModal && (
          <div className="portal-detail-backdrop active" onClick={(e) => { if (e.target === e.currentTarget) setShowNoteModal(false); }}>
            <div className="portal-detail-dialog" style={{ maxWidth: '640px', padding: '32px', borderRadius: '16px', border: '2px solid #000000', background: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1.5px solid #000000', paddingBottom: '12px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '900', margin: 0, color: '#000000' }}>
                  UPLOAD CLUB NOTES & STUDY MATERIAL
                </h3>
                <button type="button" onClick={() => setShowNoteModal(false)} className="join-modal-close">×</button>
              </div>

              <form onSubmit={handleSaveNoteSubmit} className="form-grid">
                <div className="form-group form-group-full">
                  <label style={{ fontWeight: '700', color: '#000000' }}>Document / Notes Title</label>
                  <input
                    type="text"
                    value={noteForm.title}
                    onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                    placeholder="e.g. Quantitative Market Making & Order Book Mechanics"
                    required
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontWeight: '700', color: '#000000' }}>Academic Domain</label>
                  <select value={noteForm.domain} onChange={(e) => setNoteForm({ ...noteForm, domain: e.target.value })}>
                    <option value="Quantitative Finance & Algo Trading">Quantitative Finance & Algo Trading</option>
                    <option value="DeFi & Blockchain Infrastructure">DeFi & Blockchain Infrastructure</option>
                    <option value="AI & Machine Learning in Finance">AI & Machine Learning in Finance</option>
                    <option value="Risk Analytics & Economic Modeling">Risk Analytics & Economic Modeling</option>
                    <option value="High-Frequency Trading & Systems">High-Frequency Trading & Systems</option>
                    <option value="Venture Capital & Fintech Sandbox">Venture Capital & Fintech Sandbox</option>
                  </select>
                </div>

                <div className="form-group">
                  <label style={{ fontWeight: '700', color: '#000000' }}>Format / File Type</label>
                  <select value={noteForm.fileType} onChange={(e) => setNoteForm({ ...noteForm, fileType: e.target.value })}>
                    <option value="PDF / Mathematical Guide">PDF / Mathematical Guide</option>
                    <option value="Formula Sheet / Cheat Sheet">Formula Sheet / Cheat Sheet</option>
                    <option value="Technical Architecture Doc">Technical Architecture Doc</option>
                    <option value="Jupyter Notebook / Code Walkthrough">Jupyter Notebook / Code Walkthrough</option>
                  </select>
                </div>

                <div className="form-group form-group-full">
                  <label style={{ fontWeight: '700', color: '#000000' }}>Author / Instructor Name</label>
                  <input
                    type="text"
                    value={noteForm.author}
                    onChange={(e) => setNoteForm({ ...noteForm, author: e.target.value })}
                    placeholder="Admin / Dr. Vikram Sethi / Quant Research Lead"
                    required
                  />
                </div>

                <div className="form-group form-group-full">
                  <label style={{ fontWeight: '700', color: '#000000' }}>Key Topics Covered (Comma separated)</label>
                  <input
                    type="text"
                    value={noteForm.topicsStr}
                    onChange={(e) => setNoteForm({ ...noteForm, topicsStr: e.target.value })}
                    placeholder="e.g. Mean-Variance, Covariance, Black-Scholes PDE, Python Scipy"
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontWeight: '700', color: '#000000' }}>Upload File (PDF, DOC, image…)</label>
                  <input type="file" onChange={handleNoteFileChange} />
                  {noteForm.fileName && <span style={{ fontSize: '12px', color: '#0f172a', marginTop: '4px', display: 'block' }}>Attached: {noteForm.fileName}</span>}
                </div>

                <div className="form-group form-group-full">
                  <label style={{ fontWeight: '700', color: '#000000' }}>Or External Link (Google Drive / URL — optional if a file is attached)</label>
                  <input type="url" value={noteForm.link} onChange={(e) => setNoteForm({ ...noteForm, link: e.target.value })} placeholder="https://drive.google.com/..." />
                </div>

                <div className="form-group form-group-full">
                  <label style={{ fontWeight: '700', color: '#000000' }}>Notes Summary & Key Formulas</label>
                  <textarea
                    rows={4}
                    value={noteForm.description}
                    onChange={(e) => setNoteForm({ ...noteForm, description: e.target.value })}
                    placeholder="Provide a comprehensive summary of equations, proofs, and code implementations covered in this document..."
                    required
                  />
                </div>

                <div className="form-actions" style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
                  <button type="submit" className="admin-btn admin-btn-inspect" style={{ width: '100%', padding: '14px', fontSize: '13px' }}>
                    PUBLISH & UPLOAD NOTES NOW →
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 1: EVENTS MANAGEMENT WITH PROPERLY ALIGNED BUTTONS */}
        {activeTab === 'events' && (
          <div>
            <div className="admin-card-container">
              {events.map(evt => (
                <div key={evt.id} className="admin-event-card">
                  <div className="admin-card-top-content">
                    <span className={`status-pill ${evt.status || 'approved'}`}>{STATUS_LABEL[evt.status || 'approved']}</span>
                    <span className="admin-badge-type" style={{ display: 'block', marginTop: '8px' }}>{evt.type}</span>
                    <h3 className="admin-event-title">{evt.title}</h3>
                    <p className="admin-event-desc">{evt.description}</p>
                  </div>

                  <div className="admin-card-bottom-section">
                    <div className="admin-meta-row">
                      <span>📅 {evt.time}</span>
                      <span>📍 {evt.venue}</span>
                    </div>

                    {/* DEDICATED ALIGNED ACTION BUTTONS GRID */}
                    <div className="admin-card-btn-grid">
                      <button
                        type="button"
                        onClick={() => {
                          setInspectEventId(evt.id);
                          setActiveTab('inspector');
                        }}
                        className="admin-btn admin-btn-inspect"
                      >
                        INSPECT STUDENTS
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditEventClick(evt)}
                        className="admin-btn admin-btn-edit"
                      >
                        EDIT
                      </button>
                      {evt.status === 'rejected' && (
                        <button
                          type="button"
                          onClick={() => resubmitEvent(evt.id)}
                          className="admin-btn admin-btn-edit"
                        >
                          RESUBMIT
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteEvent(evt.id)}
                        className="admin-btn admin-btn-delete"
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

        {/* TAB 2: NOTES & STUDY MATERIAL */}
        {activeTab === 'notes' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '900', margin: 0, color: '#0f172a' }}>
                  STUDY MATERIAL & QUANTITATIVE NOTES REPOSITORY
                </h2>
                <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 0 0' }}>
                  Manage and publish mathematical guides, formula sheets, and code notes for club members.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setNoteForm({
                    title: '',
                    domain: 'Quantitative Finance & Algo Trading',
                    author: 'Admin / Lead Strategist',
                    fileType: 'PDF / Research Notes',
                    description: '',
                    topicsStr: 'Quant Models, Market Microstructure',
                    link: '',
                    fileName: '',
                    fileData: ''
                  });
                  setShowNoteModal(true);
                }}
                className="admin-btn admin-btn-inspect"
                style={{ padding: '10px 18px' }}
              >
                + UPLOAD NEW NOTES
              </button>
            </div>

            <div className="admin-card-container">
              {notesList.map(note => (
                <div key={note.id} className="admin-note-card">
                  <div>
                    <div className="admin-note-header">
                      <span className="admin-badge-type">{note.domain}</span>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>{note.fileType}</span>
                    </div>

                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0', lineHeight: '1.3' }}>
                      {note.title}
                    </h3>
                    <p style={{ fontSize: '12px', fontWeight: '700', color: '#334155', margin: '0 0 10px 0' }}>
                      ✍️ {note.uploadedBy} • 📅 {new Date(note.uploadedAt).toLocaleDateString()}
                    </p>
                    <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.55', margin: 0 }}>
                      {note.description}
                    </p>

                    <div className="admin-note-tags">
                      {note.topics && note.topics.map((t, idx) => (
                        <span key={idx} className="admin-note-tag-pill">✦ {t}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                    <button
                      type="button"
                      onClick={() => {
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
                      }}
                      disabled={!note.fileData && !note.link}
                      className="admin-btn admin-btn-inspect"
                      style={{ flex: 1, opacity: (note.fileData || note.link) ? 1 : 0.5, cursor: (note.fileData || note.link) ? 'pointer' : 'not-allowed' }}
                    >
                      VIEW / DOWNLOAD NOTE ↗
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteNote(note.id)}
                      className="admin-btn admin-btn-delete"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: REGISTERED STUDENTS INSPECTOR */}
        {activeTab === 'inspector' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
                SELECT EVENT TO INSPECT REGISTERED MEMBERS:
              </label>
              <select
                value={inspectEventId || ''}
                onChange={(e) => setInspectEventId(e.target.value)}
                style={{ width: '100%', maxWidth: '480px', padding: '12px', borderRadius: '8px', border: '1.5px solid #0f172a', fontFamily: 'inherit', fontWeight: '600', background: '#ffffff', color: '#000000' }}
              >
                <option value="">-- Choose Event --</option>
                {events.map(evt => (
                  <option key={evt.id} value={evt.id}>{evt.title} ({evt.time})</option>
                ))}
              </select>
            </div>

            {inspectEventObj ? (
              <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1.5px solid #0f172a' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '900', marginBottom: '4px', color: '#0f172a' }}>
                  {inspectEventObj.title}
                </h3>
                <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>
                  Total Registered Students: <strong style={{ color: '#0f172a' }}>{registeredStudentsForSelectedEvent.length}</strong>
                </p>

                {registeredStudentsForSelectedEvent.length === 0 ? (
                  <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No students registered for this event yet.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: '#0f172a', color: '#ffffff', borderBottom: '2px solid #0f172a' }}>
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
                          <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                            <td style={{ padding: '12px', fontWeight: '700', color: '#0f172a' }}>{st.name}</td>
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

        {/* TAB 4: MEMBER DIRECTORY */}
        {activeTab === 'members' && (
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1.5px solid #0f172a' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '900', marginBottom: '20px', color: '#0f172a' }}>
              REGISTERED MEMBERS DIRECTORY
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#0f172a', color: '#ffffff', borderBottom: '2px solid #0f172a' }}>
                    <th style={{ padding: '12px' }}>NAME</th>
                    <th style={{ padding: '12px' }}>ROLL / REG NO.</th>
                    <th style={{ padding: '12px' }}>SCHOOL / DEPT</th>
                    <th style={{ padding: '12px' }}>TRACK INTEREST</th>
                    <th style={{ padding: '12px' }}>CONTACT GMAIL</th>
                  </tr>
                </thead>
                <tbody>
                  {memberList.map((m, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                      <td style={{ padding: '12px', fontWeight: '700', color: '#0f172a' }}>{m.name}</td>
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

        {/* TAB 5: RECORDINGS MANAGER */}
        {activeTab === 'recordings' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '900', margin: 0, color: '#0f172a' }}>
                RECORDED MASTERCLASSES MANAGEMENT
              </h3>
              <button
                type="button"
                onClick={() => setShowRecForm(true)}
                className="admin-btn admin-btn-inspect"
                style={{ padding: '10px 18px' }}
              >
                + ADD RECORDING
              </button>
            </div>

            {showRecForm && (
              <form onSubmit={handleSaveRec} className="form-grid" style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1.5px solid #0f172a', marginBottom: '24px' }}>
                <div className="form-group form-group-full">
                  <label style={{ fontWeight: '700', color: '#000000' }}>Masterclass Title</label>
                  <input type="text" value={recForm.title} onChange={(e) => setRecForm({ ...recForm, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: '700', color: '#000000' }}>Speaker / Instructor</label>
                  <input type="text" value={recForm.speaker} onChange={(e) => setRecForm({ ...recForm, speaker: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: '700', color: '#000000' }}>Date & Duration</label>
                  <input type="text" value={recForm.date} onChange={(e) => setRecForm({ ...recForm, date: e.target.value })} placeholder="Feb 10, 2026 • 54m" required />
                </div>
                <div className="form-group form-group-full">
                  <label style={{ fontWeight: '700', color: '#000000' }}>Description</label>
                  <textarea rows={3} value={recForm.description} onChange={(e) => setRecForm({ ...recForm, description: e.target.value })} required />
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '8px' }}>
                  <button type="submit" className="admin-btn admin-btn-inspect">SAVE RECORDING</button>
                  <button type="button" onClick={() => setShowRecForm(false)} className="admin-btn admin-btn-edit">CANCEL</button>
                </div>
              </form>
            )}

            <div className="admin-card-container">
              {recordings.map(rec => (
                <div key={rec.id} className="admin-event-card">
                  <div className="admin-card-top-content">
                    <span className="admin-badge-type">{rec.type}</span>
                    <h3 className="admin-event-title">{rec.title}</h3>
                    <p style={{ color: '#0f172a', fontWeight: '700', fontSize: '13px', margin: '4px 0' }}>🎙 {rec.speaker}</p>
                    <p className="admin-event-desc">{rec.description}</p>
                  </div>
                  <div className="admin-card-bottom-section">
                    <div className="admin-meta-row">
                      <span>📅 {rec.date}</span>
                      <span>⏱ {rec.duration}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteRecording(rec.id)}
                      className="admin-btn admin-btn-delete"
                      style={{ width: '100%' }}
                    >
                      DELETE RECORDING
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
