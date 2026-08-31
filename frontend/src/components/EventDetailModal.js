'use client';

import React from 'react';
import { usePortal } from '@/context/PortalContext';
import { useRouter } from 'next/navigation';

export default function EventDetailModal() {
  const { activeDetailEvent, closeDetailModal, isEventJoined, toggleJoinEvent, currentUser, openJoinModal } = usePortal();
  const router = useRouter();

  if (!activeDetailEvent) return null;

  const joined = currentUser ? isEventJoined(activeDetailEvent.id, currentUser.email) : false;

  const handleToggleJoin = () => {
    if (!currentUser) {
      closeDetailModal();
      openJoinModal();
      return;
    }
    toggleJoinEvent(activeDetailEvent.id, currentUser.email);
  };

  return (
    <div
      className={`portal-detail-backdrop ${activeDetailEvent ? 'active' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeDetailModal();
      }}
    >
      <div className="portal-detail-dialog" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <div
          className="portal-detail-banner"
          style={{ background: activeDetailEvent.banner || 'linear-gradient(135deg, #0f172a, #1e293b)' }}
        >
          <span className="event-category" style={{ position: 'static' }}>
            {activeDetailEvent.type || 'Event'}
          </span>
          <button
            type="button"
            className="join-modal-close"
            onClick={closeDetailModal}
            aria-label="Close"
            style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.8)' }}
          >
            ×
          </button>
        </div>

        <div className="portal-detail-body">
          <h3 className="portal-detail-title">{activeDetailEvent.title}</h3>

          <div className="portal-detail-meta">
            <span>📅 {activeDetailEvent.time}</span>
            <span>📍 {activeDetailEvent.venue}</span>
          </div>

          <p className="portal-detail-desc">{activeDetailEvent.description}</p>

          <div className="portal-card-actions" style={{ marginTop: '24px' }}>
            <button
              type="button"
              className={`btn ${joined ? 'portal-btn-joined' : 'btn-primary'}`}
              onClick={handleToggleJoin}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {joined ? '✓ YOU ARE REGISTERED (CLICK TO UNREGISTER)' : 'JOIN EVENT NOW →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
