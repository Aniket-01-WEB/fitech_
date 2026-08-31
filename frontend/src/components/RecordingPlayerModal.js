'use client';

import React, { useState, useEffect } from 'react';
import { usePortal } from '@/context/PortalContext';

export default function RecordingPlayerModal() {
  const { activeRecordingPlayer, closeRecordingPlayer, updateStudentActivity, currentUser } = usePortal();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaySec, setCurrentPlaySec] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

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
    setPlaybackSpeed(1);
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeRecordingPlayer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeRecordingPlayer, closeRecordingPlayer]);

  useEffect(() => {
    if (!isPlaying || !activeRecordingPlayer) return;

    const totalSec = activeRecordingPlayer.durationSec || 3240;
    const intervalMs = 1000 / playbackSpeed;

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
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isPlaying, activeRecordingPlayer, currentUser, updateStudentActivity, playbackSpeed]);

  if (!activeRecordingPlayer) return null;

  const totalSec = activeRecordingPlayer.durationSec || 3240;
  const progressPercent = Math.min(100, (currentPlaySec / totalSec) * 100);

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    setCurrentPlaySec(Math.floor(ratio * totalSec));
  };

  const skipTime = (deltaSec) => {
    setCurrentPlaySec(prev => Math.max(0, Math.min(totalSec, prev + deltaSec)));
  };

  const speedOptions = [1, 1.25, 1.5, 2];

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
            height: '260px',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {speedOptions.map(spd => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setPlaybackSpeed(spd)}
                  style={{
                    background: playbackSpeed === spd ? '#ffffff' : 'rgba(255,255,255,0.2)',
                    color: playbackSpeed === spd ? '#0f172a' : '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '2px 8px',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {spd}x
                </button>
              ))}
              <button
                type="button"
                className="join-modal-close"
                onClick={closeRecordingPlayer}
                aria-label="Close"
                style={{ position: 'static', background: 'rgba(255,255,255,0.8)', marginLeft: '8px' }}
              >
                ×
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', width: '100%', margin: '16px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <button
                type="button"
                onClick={() => skipTime(-10)}
                title="Rewind 10s"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ↺10
              </button>

              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(8px)',
                  border: '1.5px solid rgba(255,255,255,0.5)',
                  color: '#ffffff',
                  fontSize: '22px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.15s ease'
                }}
              >
                {isPlaying ? '❚❚' : '▶'}
              </button>

              <button
                type="button"
                onClick={() => skipTime(10)}
                title="Forward 10s"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                10↻
              </button>
            </div>

            <span style={{ display: 'block', color: '#ffffff', fontSize: '11px', marginTop: '10px', fontWeight: '600', letterSpacing: '1px' }}>
              {isPlaying ? `PLAYING AT ${playbackSpeed}x SPEED...` : 'CLICK TO START SESSION'}
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
            <div style={{ marginTop: '20px', background: '#f8fafc', padding: '18px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
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

