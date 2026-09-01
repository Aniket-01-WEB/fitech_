'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';

// Shared domain/track options — used by the Join form, the Notes uploader, and profile editing.
export const DOMAIN_OPTIONS = [
  'Quantitative Finance & Algo',
  'DeFi & Blockchain Infrastructure',
  'AI & Machine Learning in Finance',
  'Risk Analytics & Economic Modeling',
  'High-Frequency Trading & Systems'
];

// ---- snake_case (Postgres) <-> camelCase (this app's existing UI) mapping ----

function mapProfile(p) {
  if (!p) return null;
  return {
    id: p.id,
    email: p.email,
    role: p.role,
    name: p.name || (p.email ? p.email.split('@')[0] : ''),
    regNumber: p.reg_number || '',
    rollNumber: p.roll_number || '',
    school: p.school || '',
    department: p.department || '',
    section: p.section || '',
    currentYear: p.current_year || '1st Year',
    contactNumber: p.contact_number || '',
    interestedDomain: p.interested_domain || DOMAIN_OPTIONS[0],
    gmail: p.email
  };
}

function mapAdminRequest(r) {
  const p = r.profiles || {};
  return {
    id: r.id,
    userId: r.user_id,
    reason: r.reason || '',
    status: r.status,
    requestedAt: r.requested_at ? new Date(r.requested_at).getTime() : Date.now(),
    reviewedBy: r.reviewed_by || null,
    reviewedAt: r.reviewed_at,
    applicantName: p.name || (p.email ? p.email.split('@')[0] : ''),
    applicantEmail: p.email || ''
  };
}

function mapEvent(e) {
  return {
    id: e.id,
    title: e.title,
    type: e.type,
    banner: e.banner,
    time: e.event_time_label || (e.event_time ? new Date(e.event_time).toLocaleString() : ''),
    venue: e.venue,
    description: e.description,
    status: e.status,
    createdBy: e.created_by_profile?.email || e.created_by || '',
    reviewedBy: e.reviewed_by_profile?.email || e.reviewed_by || null,
    reviewedAt: e.reviewed_at,
    createdAt: e.created_at ? new Date(e.created_at).getTime() : Date.now()
  };
}

function mapRecording(r) {
  return {
    id: r.id,
    title: r.title,
    type: r.type,
    date: r.recording_date || '',
    duration: r.duration_label || '',
    durationSec: r.duration_seconds || 0,
    videoUrl: r.video_url || '',
    speaker: r.speaker || '',
    banner: r.banner,
    description: r.description || '',
    takeaways: r.takeaways || []
  };
}

function mapNote(n) {
  return {
    id: n.id,
    title: n.title,
    domain: n.domain,
    description: n.description || '',
    fileType: n.file_type || '',
    topics: n.topics || [],
    fileData: n.file_url || '', // reused as "the downloadable URL" by existing UI
    link: n.external_link || '',
    fileName: n.title,
    uploadedBy: n.uploaded_by_profile?.email || n.uploaded_by || '',
    uploadedAt: n.created_at ? new Date(n.created_at).getTime() : Date.now()
  };
}

function mapRegistration(r) {
  const p = r.profiles || {};
  return {
    id: r.id,
    eventId: r.event_id,
    userEmail: p.email || '',
    timestamp: r.registered_at ? new Date(r.registered_at).getTime() : Date.now(),
    profile: p
  };
}

const PortalContext = createContext();

export function PortalProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); // mapped profile, or null
  const [isHydrated, setIsHydrated] = useState(false);

  const [events, setEvents] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [notes, setNotes] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [members, setMembers] = useState({}); // email -> mapped profile, staff-only
  const [activity, setActivity] = useState({}); // own email -> activity row
  const [adminRequests, setAdminRequests] = useState([]); // own request (student) or all (staff)

  // Modals state
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [activeDetailEvent, setActiveDetailEvent] = useState(null);
  const [activeRecordingPlayer, setActiveRecordingPlayer] = useState(null);

  const currentUserRef = useRef(currentUser);
  currentUserRef.current = currentUser;

  // ---- session bootstrap + profile loading ----
  const loadProfile = useCallback(async () => {
    try {
      const { profile } = await api.get('/api/profile');
      setCurrentUser(mapProfile(profile));
    } catch (err) {
      console.error('Failed to load profile:', err);
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      if (data.session) {
        await loadProfile();
      }
      if (active) setIsHydrated(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        await loadProfile();
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      active = false;
      sub?.subscription?.unsubscribe();
    };
  }, [loadProfile]);

  // ---- data refreshers ----
  const refreshEvents = useCallback(async () => {
    try {
      const { events } = await api.get('/api/events');
      setEvents(events.map(mapEvent));
    } catch (err) {
      console.error('Failed to load events:', err);
    }
  }, []);

  const refreshRecordings = useCallback(async () => {
    if (!currentUserRef.current) return;
    try {
      const { recordings } = await api.get('/api/recordings');
      setRecordings(recordings.map(mapRecording));
    } catch (err) {
      console.error('Failed to load recordings:', err);
    }
  }, []);

  const refreshNotes = useCallback(async () => {
    if (!currentUserRef.current) return;
    try {
      const { notes } = await api.get('/api/notes');
      setNotes(notes.map(mapNote));
    } catch (err) {
      console.error('Failed to load notes:', err);
    }
  }, []);

  const refreshRegistrations = useCallback(async () => {
    if (!currentUserRef.current) return;
    try {
      const { registrations } = await api.get('/api/registrations');
      setRegistrations(registrations.map(mapRegistration));
    } catch (err) {
      console.error('Failed to load registrations:', err);
    }
  }, []);

  const refreshMembers = useCallback(async () => {
    if (!currentUserRef.current || !['admin', 'superadmin'].includes(currentUserRef.current.role)) return;
    try {
      const { members } = await api.get('/api/members');
      const map = {};
      members.forEach(m => { map[m.email] = mapProfile(m); });
      setMembers(map);
    } catch (err) {
      console.error('Failed to load members:', err);
    }
  }, []);

  const refreshActivity = useCallback(async () => {
    if (!currentUserRef.current) return;
    try {
      const { activity: row } = await api.get('/api/activity');
      setActivity(prev => ({ ...prev, [currentUserRef.current.email]: mapActivity(row) }));
    } catch (err) {
      console.error('Failed to load activity:', err);
    }
  }, []);

  const refreshAdminRequests = useCallback(async () => {
    if (!currentUserRef.current) return;
    try {
      const { adminRequests } = await api.get('/api/admin-requests');
      setAdminRequests(adminRequests.map(mapAdminRequest));
    } catch (err) {
      console.error('Failed to load admin requests:', err);
    }
  }, []);

  function mapActivity(a) {
    return {
      totalSeconds: a.total_seconds || 0,
      websiteSeconds: a.website_seconds || 0,
      recordingSeconds: a.recording_seconds || 0,
      sessionsWatched: a.sessions_watched || 0,
      lastActive: a.last_active
    };
  }

  // Events are public (approved ones, at least) — load once on mount.
  useEffect(() => { refreshEvents(); }, [refreshEvents]);

  // Everything else needs a signed-in user; (re)load whenever auth settles.
  useEffect(() => {
    if (!isHydrated) return;
    if (currentUser) {
      refreshEvents();
      refreshRecordings();
      refreshNotes();
      refreshRegistrations();
      refreshMembers();
      refreshActivity();
      refreshAdminRequests();
    } else {
      setRecordings([]);
      setNotes([]);
      setRegistrations([]);
      setMembers({});
      setActivity({});
      setAdminRequests([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id, isHydrated]);

  // ---- auth actions ----
  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    const { profile } = await api.get('/api/profile');
    const mapped = mapProfile(profile);
    setCurrentUser(mapped);
    return mapped;
  };

  const signUp = async (email, password, profileFields = {}) => {
    // Passed as signup metadata (not a follow-up PATCH) so the
    // on_auth_user_created trigger can save the full profile row
    // immediately — this must not depend on getting a session back,
    // since email confirmation (when required) means signUp() returns
    // no session at all.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: profileFields.name,
          reg_number: profileFields.regNumber,
          roll_number: profileFields.rollNumber,
          school: profileFields.school,
          department: profileFields.department,
          section: profileFields.section,
          current_year: profileFields.currentYear,
          contact_number: profileFields.contactNumber,
          interested_domain: profileFields.interestedDomain
        }
      }
    });
    if (error) throw new Error(error.message);

    if (!data.session) {
      // Email confirmation is required before this account can sign in —
      // the profile row (with all the fields above) is already saved,
      // just not yet reachable since there's no session to fetch it with.
      return { needsConfirmation: true };
    }

    await loadProfile();
    return { needsConfirmation: false };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  // ---- password reset (email OTP) ----
  // Step 1: Supabase emails a 6-digit recovery code to a registered
  // address (requires the project's Reset Password template to include
  // {{ .Token }}, and custom SMTP configured to send from the club's
  // address — both are dashboard-side settings, not app code).
  const requestPasswordReset = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw new Error(error.message);
  };

  // Step 2: verifying the code proves the applicant owns that inbox and
  // hands back a real (temporary) Supabase session — no service-role key
  // involved, this is the standard client-side recovery flow.
  const verifyPasswordResetOtp = async (email, token) => {
    const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'recovery' });
    if (error) throw new Error(error.message);
    return data;
  };

  // Step 3: with that recovery session active, the user can set their own
  // new password directly.
  const updatePassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw new Error(error.message);
  };

  // ---- events ----
  const createEvent = async (eventData) => {
    await api.post('/api/events', {
      title: eventData.title,
      type: eventData.type,
      banner: eventData.banner,
      event_time_label: eventData.time,
      venue: eventData.venue,
      description: eventData.description
    });
    await refreshEvents();
  };

  const updateEvent = async (eventId, eventData) => {
    await api.patch(`/api/events/${eventId}`, {
      title: eventData.title,
      type: eventData.type,
      banner: eventData.banner,
      event_time_label: eventData.time,
      venue: eventData.venue,
      description: eventData.description
    });
    await refreshEvents();
  };

  const deleteEvent = async (eventId) => {
    await api.delete(`/api/events/${eventId}`);
    await refreshEvents();
  };

  const approveEvent = async (eventId) => {
    await api.post(`/api/events/${eventId}/approve`);
    await refreshEvents();
  };

  const rejectEvent = async (eventId) => {
    await api.post(`/api/events/${eventId}/reject`);
    await refreshEvents();
  };

  const resubmitEvent = async (eventId) => {
    await api.post(`/api/events/${eventId}/resubmit`);
    await refreshEvents();
  };

  const getApprovedEvents = useCallback(() => events.filter(e => e.status === 'approved'), [events]);
  const getPendingEvents = useCallback(() => events.filter(e => e.status === 'pending'), [events]);

  // ---- registrations ----
  const isEventJoined = useCallback((eventId, email) => {
    const targetEmail = (email || currentUser?.email || '').toLowerCase();
    if (!targetEmail) return false;
    return registrations.some(r => String(r.eventId) === String(eventId) && r.userEmail.toLowerCase() === targetEmail);
  }, [registrations, currentUser]);

  const toggleJoinEvent = async (eventId) => {
    const joined = isEventJoined(eventId);
    if (joined) {
      await api.delete(`/api/registrations/${eventId}`);
    } else {
      await api.post('/api/registrations', { event_id: eventId });
    }
    await refreshRegistrations();
    return !joined;
  };

  const getJoinedEventsForUser = (email) => {
    const targetEmail = (email || currentUser?.email || '').toLowerCase();
    if (!targetEmail) return [];
    const joinedIds = registrations.filter(r => r.userEmail.toLowerCase() === targetEmail).map(r => String(r.eventId));
    return events.filter(evt => joinedIds.includes(String(evt.id)));
  };

  const getRegisteredStudentsForEvent = (eventId) => {
    return registrations
      .filter(r => String(r.eventId) === String(eventId))
      .map(r => {
        const p = r.profile || {};
        return {
          email: p.email || r.userEmail,
          gmail: p.email || r.userEmail,
          name: p.name || (p.email ? p.email.split('@')[0] : 'Unknown'),
          regNumber: p.reg_number || 'N/A',
          rollNumber: p.roll_number || 'N/A',
          school: p.school || 'N/A',
          department: p.department || 'N/A',
          section: p.section || 'N/A',
          currentYear: p.current_year || '1st Year',
          contactNumber: p.contact_number || 'N/A',
          interestedDomain: p.interested_domain || DOMAIN_OPTIONS[0]
        };
      });
  };

  // ---- member profiles ----
  const saveMember = async (memberData) => {
    await api.patch('/api/profile', {
      name: memberData.name,
      reg_number: memberData.regNumber,
      roll_number: memberData.rollNumber,
      school: memberData.school,
      department: memberData.department,
      section: memberData.section,
      current_year: memberData.currentYear,
      contact_number: memberData.contactNumber,
      interested_domain: memberData.interestedDomain
    });
    await loadProfile();
  };

  const getMemberByEmail = (email) => {
    if (!email) return null;
    return members[email.toLowerCase().trim()] || null;
  };

  // ---- admin access requests ----
  // Any signed-in member can apply to become an admin; a superadmin
  // approves/rejects, and approval actually grants the admin role
  // (handled server-side by the admin_requests_guard_status trigger).
  const requestAdminAccess = async (reason) => {
    await api.post('/api/admin-requests', { reason });
    await refreshAdminRequests();
  };

  const resubmitAdminRequest = async (requestId) => {
    await api.post(`/api/admin-requests/${requestId}/resubmit`);
    await refreshAdminRequests();
  };

  const getMyAdminRequest = useCallback(
    () => adminRequests.find(r => r.userId === currentUser?.id) || null,
    [adminRequests, currentUser]
  );

  const getPendingAdminRequests = useCallback(
    () => adminRequests.filter(r => r.status === 'pending'),
    [adminRequests]
  );

  const approveAdminRequest = async (requestId) => {
    await api.post(`/api/admin-requests/${requestId}/approve`);
    await refreshAdminRequests();
    await refreshMembers();
  };

  const rejectAdminRequest = async (requestId) => {
    await api.post(`/api/admin-requests/${requestId}/reject`);
    await refreshAdminRequests();
  };

  // ---- recordings ----
  const saveRecording = async (recData) => {
    await api.post('/api/recordings', {
      title: recData.title,
      type: recData.type,
      speaker: recData.speaker,
      banner: recData.banner,
      recording_date: recData.date,
      duration_label: recData.duration,
      duration_seconds: recData.durationSec,
      video_url: recData.videoUrl,
      description: recData.description,
      takeaways: recData.takeaways || []
    });
    await refreshRecordings();
  };

  const updateRecording = async (recId, recData) => {
    await api.patch(`/api/recordings/${recId}`, {
      title: recData.title,
      type: recData.type,
      speaker: recData.speaker,
      banner: recData.banner,
      recording_date: recData.date,
      duration_label: recData.duration,
      description: recData.description,
      takeaways: recData.takeaways
    });
    await refreshRecordings();
  };

  const deleteRecording = async (recId) => {
    await api.delete(`/api/recordings/${recId}`);
    await refreshRecordings();
  };

  // ---- notes ----
  // Uploads the file straight to Supabase Storage (RLS-gated to staff)
  // under the caller's own session, then hands the backend the resulting
  // public URL to store alongside the note's metadata.
  const saveNote = async (noteData) => {
    let fileUrl = noteData.link ? '' : '';
    let externalLink = noteData.link || '';

    if (noteData.file) {
      const file = noteData.file;
      const path = `${currentUser?.id || 'anon'}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from('notes').upload(path, file);
      if (uploadError) throw new Error(uploadError.message);
      const { data: pub } = supabase.storage.from('notes').getPublicUrl(path);
      fileUrl = pub.publicUrl;
    }

    const topics = Array.isArray(noteData.topics) ? noteData.topics : [];

    await api.post('/api/notes', {
      title: noteData.title,
      domain: noteData.domain,
      description: noteData.description,
      file_type: noteData.fileType,
      topics,
      file_url: fileUrl || undefined,
      external_link: externalLink || undefined
    });
    await refreshNotes();
  };

  const deleteNote = async (noteId) => {
    await api.delete(`/api/notes/${noteId}`);
    await refreshNotes();
  };

  // ---- activity tracking ----
  const updateStudentActivity = async (email, deltaWebSec = 0, deltaRecSec = 0, watchedSessionIncrement = false) => {
    if (!currentUserRef.current) return null;
    try {
      const { activity: row } = await api.patch('/api/activity', {
        deltaWebSec,
        deltaRecSec,
        watchedSessionIncrement
      });
      const mapped = mapActivity(row);
      setActivity(prev => ({ ...prev, [currentUserRef.current.email]: mapped }));
      return mapped;
    } catch (err) {
      console.error('Failed to update activity:', err);
      return null;
    }
  };

  const getStudentActivity = (email) => {
    const targetEmail = (email || currentUser?.email || '').toLowerCase();
    return activity[targetEmail] || {
      totalSeconds: 0,
      websiteSeconds: 0,
      recordingSeconds: 0,
      sessionsWatched: 0,
      lastActive: null
    };
  };

  // ---- modal helpers ----
  const openJoinModal = () => setIsJoinModalOpen(true);
  const closeJoinModal = () => setIsJoinModalOpen(false);

  const openDetailModal = (evt) => setActiveDetailEvent(evt);
  const closeDetailModal = () => setActiveDetailEvent(null);

  const openRecordingPlayer = (rec) => setActiveRecordingPlayer(rec);
  const closeRecordingPlayer = () => setActiveRecordingPlayer(null);

  return (
    <PortalContext.Provider
      value={{
        isHydrated,
        currentUser,
        login,
        signUp,
        logout,
        requestPasswordReset,
        verifyPasswordResetOtp,
        updatePassword,
        events,
        createEvent,
        updateEvent,
        deleteEvent,
        approveEvent,
        rejectEvent,
        resubmitEvent,
        getApprovedEvents,
        getPendingEvents,
        isEventJoined,
        toggleJoinEvent,
        getJoinedEventsForUser,
        getRegisteredStudentsForEvent,
        recordings,
        saveRecording,
        updateRecording,
        deleteRecording,
        notes,
        saveNote,
        deleteNote,
        members,
        saveMember,
        getMemberByEmail,
        adminRequests,
        requestAdminAccess,
        resubmitAdminRequest,
        getMyAdminRequest,
        getPendingAdminRequests,
        approveAdminRequest,
        rejectAdminRequest,
        activity,
        updateStudentActivity,
        getStudentActivity,
        isJoinModalOpen,
        openJoinModal,
        closeJoinModal,
        activeDetailEvent,
        openDetailModal,
        closeDetailModal,
        activeRecordingPlayer,
        openRecordingPlayer,
        closeRecordingPlayer
      }}
    >
      {children}
    </PortalContext.Provider>
  );
}

export function usePortal() {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
}
