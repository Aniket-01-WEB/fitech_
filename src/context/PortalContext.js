'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const KEYS = {
  EVENTS: 'matrix_events',
  CURRENT_USER: 'matrix_current_user',
  REGISTRATIONS: 'matrix_student_registrations',
  MEMBERS: 'matrix_members',
  RECORDINGS: 'matrix_recordings',
  ACTIVITY: 'matrix_student_activity',
  NOTES: 'matrix_notes'
};

// Shared domain/track options — used by the Join form, the Notes uploader, and profile editing.
export const DOMAIN_OPTIONS = [
  'Quantitative Finance & Algo',
  'DeFi & Blockchain Infrastructure',
  'AI & Machine Learning in Finance',
  'Risk Analytics & Economic Modeling',
  'High-Frequency Trading & Systems'
];

const SEED_RECORDINGS = [
  {
    id: 'rec-1',
    title: 'High-Frequency Order Book Dynamics & L2 Data',
    type: 'Algo Workshop',
    date: 'Feb 10, 2026',
    duration: '54m',
    durationSec: 3240,
    speaker: 'Dr. Vikram Sethi • Quant Research Lead',
    banner: 'linear-gradient(135deg, #090d16, #1e293b)',
    description: 'An in-depth technical analysis of Level 2 market data, matching engines, order queue positioning, and execution slippage reduction.',
    takeaways: [
      'Level 2 limit order book matching mechanics and queue priority models.',
      'Python order execution simulation codebase and slippage backtesting framework.',
      'Market impact cost analysis for algorithmic high-frequency strategies.'
    ]
  },
  {
    id: 'rec-2',
    title: 'Automated Market Maker (AMM) Invariant Mechanics',
    type: 'DeFi Engineering',
    date: 'Jan 28, 2026',
    duration: '1h 12m',
    durationSec: 4320,
    speaker: 'Elena Rostova • Protocol Architect',
    banner: 'linear-gradient(135deg, #0f172a, #334155)',
    description: 'Mathematical derivation of constant product formulas, concentrated liquidity curves, impermanent loss hedging, and arbitrage loops.',
    takeaways: [
      'Derivation of xy=k invariant curve mechanics and concentrated liquidity ticks.',
      'Impermanent loss hedging strategies using perpetual futures.',
      'MEV arbitrage sandwich attack simulation and private RPC routing.'
    ]
  },
  {
    id: 'rec-3',
    title: 'Machine Learning for Volatility Surface Forecasting',
    type: 'Quant Research',
    date: 'Jan 15, 2026',
    duration: '48m',
    durationSec: 2880,
    speaker: 'Arjun Nambiar • Senior Quantitative Strategist',
    banner: 'linear-gradient(135deg, #1e293b, #475569)',
    description: 'Applying transformer architectures and stochastic volatility models to reconstruct implied volatility smiles across multi-asset option chains.',
    takeaways: [
      'SVI and Heston stochastic volatility parameter calibration.',
      'Temporal convolutional networks for cross-asset volatility skew prediction.',
      'Real-time delta and vega risk hedging in high-kurtosis market regimes.'
    ]
  },
  {
    id: 'rec-4',
    title: 'Decentralized Credit Risk & Zero-Knowledge Proofs',
    type: 'Web3 & Security',
    date: 'Dec 18, 2025',
    duration: '1h 05m',
    durationSec: 3900,
    speaker: 'Sarah Lin • Cryptography Fellow',
    banner: 'linear-gradient(135deg, #0a0a0a, #1e293b)',
    description: 'Exploring non-collateralized on-chain lending protocols through zk-SNARK private identity verification and cryptographic solvency attestation.',
    takeaways: [
      'zk-SNARK circuit construction using Circom and snarkjs.',
      'Private credit scoring algorithms utilizing verified off-chain cash flows.',
      'Smart contract risk mitigation and liquidation cascade safeguards.'
    ]
  }
];

const SEED_EVENTS = [
  {
    id: 'evt-1',
    title: 'MATRIX FinTech Summit 2026',
    type: 'Summit',
    banner: 'linear-gradient(135deg, #0f172a, #1e293b)',
    time: 'Mar 15, 2026 • 10:00 AM',
    venue: 'Main Auditorium',
    description: 'Flagship summit uniting global industry founders, investors, and student innovators exploring the future of global finance.',
    status: 'approved',
    createdBy: 'admin@matrix.club',
    createdAt: 1773550800000
  },
  {
    id: 'evt-2',
    title: 'Quantitative Trading Masterclass',
    type: 'Workshop',
    banner: 'linear-gradient(135deg, #1e293b, #334155)',
    time: 'Feb 22, 2026 • 2:00 PM',
    venue: 'Lab 301',
    description: 'Deep dive into systematic market analysis, high-frequency execution, and algorithmic trading strategies.',
    status: 'approved',
    createdBy: 'admin@matrix.club',
    createdAt: 1771768800000
  },
  {
    id: 'evt-3',
    title: 'AI × Finance National Hackathon',
    type: 'Hackathon',
    banner: 'linear-gradient(135deg, #334155, #475569)',
    time: 'Apr 5, 2026 • 9:00 AM',
    venue: 'Tech Center',
    description: '48-hour national hackathon challenging student developers to build AI-powered credit, risk, and trading bots.',
    status: 'approved',
    createdBy: 'admin@matrix.club',
    createdAt: 1775360400000
  },
  {
    id: 'evt-4',
    title: 'Algorithmic Market Making Lab',
    type: 'Lab',
    banner: 'linear-gradient(135deg, #475569, #64748b)',
    time: 'Apr 20, 2026 • 4:00 PM',
    venue: 'Innovation Hub',
    description: 'Hands-on session building order book simulation engines and liquidity management protocols.',
    status: 'approved',
    createdBy: 'admin@matrix.club',
    createdAt: 1776657600000
  },
  {
    id: 'evt-5',
    title: 'DeFi & Tokenomics Symposium',
    type: 'Symposium',
    banner: 'linear-gradient(135deg, #0f172a, #334155)',
    time: 'May 2, 2026 • 11:00 AM',
    venue: 'Auditorium B',
    description: 'Panel discussion featuring blockchain architects on automated market makers, ZK proofs, and liquidity pools.',
    status: 'approved',
    createdBy: 'admin@matrix.club',
    createdAt: 1777694400000
  },
  {
    id: 'evt-6',
    title: 'Venture Pitching & Angel Sandbox',
    type: 'Session',
    banner: 'linear-gradient(135deg, #1e293b, #475569)',
    time: 'May 18, 2026 • 3:00 PM',
    venue: 'Venture Hub',
    description: 'Pitch session where student fintech startups present MVPs directly to institutional angel investors.',
    status: 'approved',
    createdBy: 'admin@matrix.club',
    createdAt: 1779078000000
  }
];

const SEED_MEMBERS = {
  'student@matrix.club': {
    name: 'Rahul Sharma',
    regNumber: '2024REG1092',
    rollNumber: '24CS084',
    school: 'School of Computer Science & Engineering',
    department: 'Computer Science & Engineering',
    section: 'CSE-B',
    currentYear: '2nd Year',
    contactNumber: '+91 98765 43210',
    interestedDomain: 'Quantitative Finance & Algo',
    gmail: 'student@matrix.club'
  },
  'alice@matrix.club': {
    name: 'Alice Vance',
    regNumber: '2024REG4401',
    rollNumber: '24EC019',
    school: 'School of Electronics & Communication',
    department: 'Electronics Engineering',
    section: 'ECE-A',
    currentYear: '3rd Year',
    contactNumber: '+91 98123 45678',
    interestedDomain: 'DeFi & Blockchain Infrastructure',
    gmail: 'alice@matrix.club'
  },
  'priya.patel@gmail.com': {
    name: 'Priya Patel',
    regNumber: '2024REG7812',
    rollNumber: '24DS012',
    school: 'School of Computer Science & Engineering',
    department: 'Data Science & AI',
    section: 'DS-A',
    currentYear: '1st Year',
    contactNumber: '+91 97654 32109',
    interestedDomain: 'AI & Machine Learning in Finance',
    gmail: 'priya.patel@gmail.com'
  },
  'aditya.verma@gmail.com': {
    name: 'Aditya Verma',
    regNumber: '2023REG5542',
    rollNumber: '23CS140',
    school: 'School of Computer Science & Engineering',
    department: 'Computer Science & Engineering',
    section: 'CSE-C',
    currentYear: '3rd Year',
    contactNumber: '+91 99887 76655',
    interestedDomain: 'High-Frequency Trading & Systems',
    gmail: 'aditya.verma@gmail.com'
  }
};

const SEED_REGISTRATIONS = [
  { id: 'reg-1', eventId: 'evt-1', userEmail: 'student@matrix.club', timestamp: Date.now() },
  { id: 'reg-2', eventId: 'evt-2', userEmail: 'student@matrix.club', timestamp: Date.now() },
  { id: 'reg-3', eventId: 'evt-1', userEmail: 'alice@matrix.club', timestamp: Date.now() },
  { id: 'reg-4', eventId: 'evt-3', userEmail: 'priya.patel@gmail.com', timestamp: Date.now() },
  { id: 'reg-5', eventId: 'evt-2', userEmail: 'aditya.verma@gmail.com', timestamp: Date.now() }
];

const SEED_ACTIVITY = {
  'student@matrix.club': {
    totalSeconds: 16320,
    websiteSeconds: 9960,
    recordingSeconds: 6360,
    sessionsWatched: 2,
    lastActive: Date.now()
  },
  'alice@matrix.club': {
    totalSeconds: 9480,
    websiteSeconds: 6240,
    recordingSeconds: 3240,
    sessionsWatched: 1,
    lastActive: Date.now()
  },
  'priya.patel@gmail.com': {
    totalSeconds: 5400,
    websiteSeconds: 5400,
    recordingSeconds: 0,
    sessionsWatched: 0,
    lastActive: Date.now()
  },
  'aditya.verma@gmail.com': {
    totalSeconds: 12600,
    websiteSeconds: 8280,
    recordingSeconds: 4320,
    sessionsWatched: 1,
    lastActive: Date.now()
  }
};

const SEED_NOTES = [
  {
    id: 'note-1',
    title: 'Order Book Microstructure — Cheat Sheet',
    domain: 'High-Frequency Trading & Systems',
    description: 'Quick-reference notes on limit order book depth, queue priority, and matching engine mechanics from the HFT masterclass.',
    fileName: 'order-book-cheatsheet.pdf',
    fileData: '',
    link: '',
    uploadedBy: 'admin@matrix.club',
    uploadedAt: 1770000000000
  },
  {
    id: 'note-2',
    title: 'AMM Invariant Derivations',
    domain: 'DeFi & Blockchain Infrastructure',
    description: 'Step-by-step derivation of the constant product formula and concentrated liquidity math covered in the DeFi engineering session.',
    fileName: 'amm-invariants.pdf',
    fileData: '',
    link: '',
    uploadedBy: 'admin@matrix.club',
    uploadedAt: 1771000000000
  }
];

const PortalContext = createContext();

export function PortalProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [events, setEvents] = useState(SEED_EVENTS);
  const [recordings, setRecordings] = useState(SEED_RECORDINGS);
  const [members, setMembers] = useState(SEED_MEMBERS);
  const [registrations, setRegistrations] = useState(SEED_REGISTRATIONS);
  const [activity, setActivity] = useState(SEED_ACTIVITY);
  const [notes, setNotes] = useState(SEED_NOTES);
  const [isHydrated, setIsHydrated] = useState(false);

  // Modals state
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [activeDetailEvent, setActiveDetailEvent] = useState(null);
  const [activeRecordingPlayer, setActiveRecordingPlayer] = useState(null);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(KEYS.CURRENT_USER);
      if (storedUser) setCurrentUser(JSON.parse(storedUser));

      const storedEvents = localStorage.getItem(KEYS.EVENTS);
      if (storedEvents) setEvents(JSON.parse(storedEvents));

      const storedRecordings = localStorage.getItem(KEYS.RECORDINGS);
      if (storedRecordings) setRecordings(JSON.parse(storedRecordings));

      const storedMembers = localStorage.getItem(KEYS.MEMBERS);
      if (storedMembers) setMembers(JSON.parse(storedMembers));

      const storedRegs = localStorage.getItem(KEYS.REGISTRATIONS);
      if (storedRegs) setRegistrations(JSON.parse(storedRegs));

      const storedAct = localStorage.getItem(KEYS.ACTIVITY);
      if (storedAct) setActivity(JSON.parse(storedAct));

      const storedNotes = localStorage.getItem(KEYS.NOTES);
      if (storedNotes) setNotes(JSON.parse(storedNotes));
    } catch (err) {
      console.error('Failed to load from localStorage:', err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync state helpers to localStorage
  const saveStorage = (key, data) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Storage write error:', e);
    }
  };

  // User auth actions
  const login = (role, email) => {
    const userObj = { role, email: email.toLowerCase().trim() };
    setCurrentUser(userObj);
    saveStorage(KEYS.CURRENT_USER, userObj);
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(KEYS.CURRENT_USER);
    } catch (e) {}
  };

  // Event actions
  // New events always start as a pending request — a Super Admin must approve
  // them before they appear as an "upcoming event" in the student portal.
  const createEvent = (eventData) => {
    const newEvent = {
      id: 'evt-' + Date.now(),
      title: eventData.title,
      type: eventData.type || 'Event',
      banner: eventData.banner || 'linear-gradient(135deg, #0f172a, #1e293b)',
      time: eventData.time,
      venue: eventData.venue,
      description: eventData.description,
      status: 'pending',
      createdBy: currentUser ? currentUser.email : 'admin@matrix.club',
      createdAt: Date.now(),
      reviewedBy: null,
      reviewedAt: null
    };
    const updated = [newEvent, ...events];
    setEvents(updated);
    saveStorage(KEYS.EVENTS, updated);
    return newEvent;
  };

  const updateEvent = (eventId, eventData) => {
    const updated = events.map(evt => {
      if (evt.id === eventId) {
        return {
          ...evt,
          title: eventData.title || evt.title,
          type: eventData.type || evt.type,
          time: eventData.time || evt.time,
          venue: eventData.venue || evt.venue,
          banner: eventData.banner || evt.banner,
          description: eventData.description || evt.description
        };
      }
      return evt;
    });
    setEvents(updated);
    saveStorage(KEYS.EVENTS, updated);
  };

  const deleteEvent = (eventId) => {
    const updated = events.filter(e => e.id !== eventId);
    setEvents(updated);
    saveStorage(KEYS.EVENTS, updated);
  };

  // Super Admin event-approval workflow
  const setEventStatus = (eventId, status) => {
    const updated = events.map(evt => {
      if (evt.id === eventId) {
        return {
          ...evt,
          status,
          reviewedBy: currentUser ? currentUser.email : evt.reviewedBy,
          reviewedAt: Date.now()
        };
      }
      return evt;
    });
    setEvents(updated);
    saveStorage(KEYS.EVENTS, updated);
  };

  const approveEvent = (eventId) => setEventStatus(eventId, 'approved');
  const rejectEvent = (eventId) => setEventStatus(eventId, 'rejected');
  const resubmitEvent = (eventId) => setEventStatus(eventId, 'pending');

  const getApprovedEvents = useCallback(() => events.filter(e => e.status === 'approved'), [events]);
  const getPendingEvents = useCallback(() => events.filter(e => e.status === 'pending'), [events]);

  // Event registration toggling
  const isEventJoined = useCallback((eventId, email) => {
    const targetEmail = (email || (currentUser ? currentUser.email : '')).toLowerCase();
    if (!targetEmail) return false;
    return registrations.some(r => r.eventId === eventId && r.userEmail.toLowerCase() === targetEmail);
  }, [registrations, currentUser]);

  const toggleJoinEvent = (eventId, email) => {
    const targetEmail = (email || (currentUser ? currentUser.email : '')).toLowerCase();
    if (!targetEmail) return false;

    const joined = isEventJoined(eventId, targetEmail);
    let updated;
    if (joined) {
      updated = registrations.filter(r => !(r.eventId === eventId && r.userEmail.toLowerCase() === targetEmail));
    } else {
      updated = [...registrations, { id: 'reg-' + Date.now(), eventId, userEmail: targetEmail, timestamp: Date.now() }];
    }
    setRegistrations(updated);
    saveStorage(KEYS.REGISTRATIONS, updated);
    return !joined;
  };

  const getJoinedEventsForUser = (email) => {
    const targetEmail = (email || (currentUser ? currentUser.email : '')).toLowerCase();
    if (!targetEmail) return [];
    const joinedIds = registrations.filter(r => r.userEmail.toLowerCase() === targetEmail).map(r => r.eventId);
    return events.filter(evt => joinedIds.includes(evt.id));
  };

  const getRegisteredStudentsForEvent = (eventId) => {
    const regs = registrations.filter(r => r.eventId === eventId);
    return regs.map(r => {
      const email = r.userEmail.toLowerCase();
      const profile = members[email] || {};
      return {
        email: email,
        gmail: profile.gmail || email,
        name: profile.name || email.split('@')[0],
        regNumber: profile.regNumber || 'N/A',
        rollNumber: profile.rollNumber || 'N/A',
        school: profile.school || 'N/A',
        department: profile.department || 'N/A',
        section: profile.section || 'N/A',
        currentYear: profile.currentYear || '1st Year',
        contactNumber: profile.contactNumber || 'N/A',
        interestedDomain: profile.interestedDomain || 'Quantitative Finance & Algo'
      };
    });
  };

  // Member profiles
  const saveMember = (memberData) => {
    const email = (memberData.gmail || memberData.email || '').toLowerCase().trim();
    if (!email) return;

    const existing = members[email] || {};
    const updatedMembers = {
      ...members,
      [email]: {
        ...existing,
        name: memberData.name || existing.name || '',
        regNumber: memberData.regNumber || existing.regNumber || '',
        rollNumber: memberData.rollNumber || existing.rollNumber || '',
        school: memberData.school || existing.school || '',
        department: memberData.department || existing.department || '',
        section: memberData.section || existing.section || '',
        currentYear: memberData.currentYear || existing.currentYear || '1st Year',
        contactNumber: memberData.contactNumber || existing.contactNumber || '',
        interestedDomain: memberData.interestedDomain || existing.interestedDomain || 'Quantitative Finance & Algo',
        gmail: email
      }
    };
    setMembers(updatedMembers);
    saveStorage(KEYS.MEMBERS, updatedMembers);
  };

  const getMemberByEmail = (email) => {
    if (!email) return null;
    return members[email.toLowerCase().trim()] || null;
  };

  // Recording management
  const saveRecording = (recData) => {
    const newRec = {
      id: 'rec-' + Date.now(),
      title: recData.title,
      type: recData.type || 'Algo Workshop',
      date: recData.date,
      duration: recData.duration,
      durationSec: recData.durationSec || 3240,
      speaker: recData.speaker,
      banner: recData.banner || 'linear-gradient(135deg, #090d16, #1e293b)',
      description: recData.description,
      takeaways: recData.takeaways || []
    };
    const updated = [newRec, ...recordings];
    setRecordings(updated);
    saveStorage(KEYS.RECORDINGS, updated);
  };

  const updateRecording = (recId, recData) => {
    const updated = recordings.map(r => {
      if (r.id === recId) {
        return {
          ...r,
          title: recData.title || r.title,
          type: recData.type || r.type,
          date: recData.date || r.date,
          duration: recData.duration || r.duration,
          speaker: recData.speaker || r.speaker,
          banner: recData.banner || r.banner,
          description: recData.description || r.description,
          takeaways: recData.takeaways || r.takeaways
        };
      }
      return r;
    });
    setRecordings(updated);
    saveStorage(KEYS.RECORDINGS, updated);
  };

  const deleteRecording = (recId) => {
    const updated = recordings.filter(r => r.id !== recId);
    setRecordings(updated);
    saveStorage(KEYS.RECORDINGS, updated);
  };

  // Notes management (admin uploads, students read/download)
  const saveNote = (noteData) => {
    const newNote = {
      id: 'note-' + Date.now(),
      title: noteData.title,
      domain: noteData.domain || DOMAIN_OPTIONS[0],
      description: noteData.description || '',
      fileName: noteData.fileName || '',
      fileData: noteData.fileData || '',
      link: noteData.link || '',
      uploadedBy: currentUser ? currentUser.email : 'admin@matrix.club',
      uploadedAt: Date.now()
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    saveStorage(KEYS.NOTES, updated);
    return newNote;
  };

  const deleteNote = (noteId) => {
    const updated = notes.filter(n => n.id !== noteId);
    setNotes(updated);
    saveStorage(KEYS.NOTES, updated);
  };

  // Activity tracking
  const updateStudentActivity = (email, deltaWebSec = 0, deltaRecSec = 0, watchedSessionIncrement = false) => {
    const targetEmail = (email || (currentUser ? currentUser.email : '')).toLowerCase();
    if (!targetEmail) return null;

    const curr = activity[targetEmail] || {
      totalSeconds: 0,
      websiteSeconds: 0,
      recordingSeconds: 0,
      sessionsWatched: 0,
      lastActive: Date.now()
    };

    const newWeb = curr.websiteSeconds + deltaWebSec;
    const newRec = curr.recordingSeconds + deltaRecSec;
    const newTotal = newWeb + newRec;
    const newSessions = curr.sessionsWatched + (watchedSessionIncrement ? 1 : 0);

    const updatedObj = {
      totalSeconds: newTotal,
      websiteSeconds: newWeb,
      recordingSeconds: newRec,
      sessionsWatched: newSessions,
      lastActive: Date.now()
    };

    const updatedActivityMap = { ...activity, [targetEmail]: updatedObj };
    setActivity(updatedActivityMap);
    saveStorage(KEYS.ACTIVITY, updatedActivityMap);
    return updatedObj;
  };

  const getStudentActivity = (email) => {
    const targetEmail = (email || (currentUser ? currentUser.email : '')).toLowerCase();
    return activity[targetEmail] || {
      totalSeconds: 0,
      websiteSeconds: 0,
      recordingSeconds: 0,
      sessionsWatched: 0,
      lastActive: Date.now()
    };
  };

  // Modal helpers
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
        logout,
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
