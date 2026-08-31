'use client';

import React, { useState, useEffect } from 'react';
import { usePortal } from '@/context/PortalContext';

export default function RecordingPlayerModal() {
  const { activeRecordingPlayer, closeRecordingPlayer, updateStudentActivity, currentUser } = usePortal();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaySec, setCurrentPlaySec] = useState(0);

  const formatTimeCode = (totalSeconds) => {
    const sec = Math.max(0, Number(totalSeconds) || 0);
    const mins = Math.floor(sec / 60);
    const remSec = Math.floor(sec % 60);
    return `${String(mins).padStart(2, '0')}:${String(remSec).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!activeRecordingPlayer) return;
    setIsPlaying(false);
    setCurrentPlaySec(0);
  }, [activeRecordingPlayer]);

  useEffect(() => {
    if (!isPlaying || !activeRecordingPlayer) return;

    const totalSec = activeRecordingPlayer.durationSec || 3240;
    const interval = setInterval(() => {
      setCurrentPlaySec(prev => {
        if (prev >= totalSec) {
          setIsPlaying(false);
          return totalSec;
        }
        return prev + 1;
      });

      if (currentUser) {
        updateStudentActivity(currentUser.email, 0, 1, false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, activeRecordingPlayer, currentUser, updateStudentActivity]);

  if (!activeRecordingPlayer) return null;

  const totalSec = activeRecordingPlayer.durationSec || 3240;
  const progressPercent = Math.min(100, (currentPlaySec / totalSec) * 100);

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    setCurrentPlaySec(Math.floor(ratio * totalSec));
  };

  return (
    <div
      className={`portal-detail-backdrop ${activeRecordingPlayer ? 'active' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeRecordingPlayer();
      }}
    >
      <div className="portal-detail-dialog" style={{ maxWidth: '720px', borderRadius: '16px', overflow: 'hidden' }}>
        <div
          className="portal-detail-banner"
          style={{
            height: '240px',
            background: activeRecordingPlayer.banner || 'linear-gradient(135deg, #090d16, #1e293b)',
            position: 'relative',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '24px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span className="event-category" style={{ position: 'static' }}>
              {activeRecordingPlayer.type || 'MASTERCLASS'}
            </span>
            <button
              type="button"
              className="join-modal-close"
              onClick={closeRecordingPlayer}
              aria-label="Close"
              style={{ position: 'static', background: 'rgba(255,255,255,0.8)' }}
            >
              ×
            </button>
          </div>

          <div style={{ textAlign: 'center', width: '100%', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(8px)',
                border: '1.5px solid rgba(255,255,255,0.4)',
                color: '#ffffff',
                fontSize: '24px',
                cursor: 'pointer',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isPlaying ? '❚❚' : '▶'}
            </button>
            <span style={{ display: 'block', color: '#ffffff', fontSize: '12px', marginTop: '8px', fontWeight: '600', letterSpacing: '1px' }}>
              {isPlaying ? 'PLAYING MASTERCLASS STREAM...' : 'CLICK TO START SESSION'}
            </span>
          </div>

          <div style={{ width: '100%' }}>
            <div
              onClick={handleSeek}
              style={{
                width: '100%',
                height: '6px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '3px',
                cursor: 'pointer',
                overflow: 'hidden',
                marginBottom: '6px'
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  background: '#ffffff',
                  transition: 'width 0.1s linear'
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontFamily: 'var(--font-heading)' }}>
              <span>{formatTimeCode(currentPlaySec)}</span>
              <span>{formatTimeCode(totalSec)}</span>
            </div>
          </div>
        </div>

        <div className="portal-detail-body">
          <h3 className="portal-detail-title" style={{ fontSize: '24px' }}>{activeRecordingPlayer.title}</h3>
          <p style={{ color: '#0f172a', fontWeight: '700', fontSize: '13px', marginBottom: '12px' }}>
            🎙 {activeRecordingPlayer.speaker}
          </p>

          <div className="portal-detail-meta">
            <span>📅 {activeRecordingPlayer.date}</span>
            <span>⏱ {activeRecordingPlayer.duration}</span>
          </div>

          <p className="portal-detail-desc">{activeRecordingPlayer.description}</p>

          {activeRecordingPlayer.takeaways && activeRecordingPlayer.takeaways.length > 0 && (
            <div style={{ marginTop: '20px', background: '#f8fafc', padding: '18px', border: '1px solid #e2e8f0' }}>
              <strong style={{ display: 'block', fontSize: '13px', color: '#0f172a', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Key Technical Takeaways
              </strong>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '0', fontSize: '13.5px', color: '#475569' }}>
                {activeRecordingPlayer.takeaways.map((takeaway, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <span style={{ color: '#0f172a' }}>✦</span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
