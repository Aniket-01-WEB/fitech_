'use client';

import React from 'react';
import Link from 'next/link';
import { usePortal } from '@/context/PortalContext';

export default function EventsPage() {
  const { events, openDetailModal } = usePortal();

  // Only Super-Admin-approved events are ever shown publicly.
  const approvedEvents = events.filter(evt => (evt.status || 'approved') === 'approved');
  const upcomingEvents = approvedEvents.filter(evt => !evt.title.toLowerCase().includes('2025') && !evt.title.toLowerCase().includes('past'));
  const pastEvents = approvedEvents.filter(evt => evt.title.toLowerCase().includes('2025') || evt.title.toLowerCase().includes('past'));

  return (
    <div className="simple-events-shell">
      <div className="simple-events-header">
        <div className="simple-events-title-wrap">
          <h1 className="simple-events-main-title">CLUB EVENTS & MASTERCLASSES</h1>
          <p className="simple-events-subtitle">Browse upcoming flagship summits, algorithmic labs, and past recorded masterclasses.</p>
        </div>
        <Link href="/" className="simple-back-btn">
          ← BACK TO HOME
        </Link>
      </div>

      {/* UPCOMING SECTION */}
      <div className="simple-section-block">
        <div className="simple-section-header">
          <h2 className="simple-section-heading">
            UPCOMING EXPERIENCES <span className="count-num">({upcomingEvents.length})</span>
          </h2>
          <span className="simple-section-badge">SPRING / SUMMER 2026</span>
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="empty-events-box">
            <p className="empty-events-text">No upcoming events.</p>
          </div>
        ) : (
          <div className="simple-events-grid">
            {upcomingEvents.map(evt => (
              <div key={evt.id} className="simple-event-card">
                <div className="simple-card-top">
                  <span className="simple-card-category">{evt.type || 'EVENT'}</span>
                  <h3 className="simple-card-title">{evt.title}</h3>
                  <p className="simple-card-desc">{evt.description}</p>
                </div>

                <div className="simple-card-bottom">
                  <div className="simple-card-meta">
                    <span className="simple-meta-date">📅 {evt.time}</span>
                    <span className="simple-meta-venue">📍 {evt.venue}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openDetailModal(evt)}
                    className="simple-action-btn"
                  >
                    VIEW DETAILS →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PAST SESSIONS SECTION */}
      {pastEvents.length > 0 && (
        <div className="simple-section-block">
          <div className="simple-section-header">
            <h2 className="simple-section-heading">
              PAST SESSIONS & ARCHIVES <span className="count-num">({pastEvents.length})</span>
            </h2>
            <span className="simple-section-badge">ARCHIVED RECORDINGS</span>
          </div>

          <div className="simple-events-grid">
            {pastEvents.map(evt => (
              <div key={evt.id} className="simple-event-card">
                <div className="simple-card-top">
                  <span className="simple-card-category">{evt.type || 'ARCHIVE'}</span>
                  <h3 className="simple-card-title">{evt.title}</h3>
                  <p className="simple-card-desc">{evt.description}</p>
                </div>

                <div className="simple-card-bottom">
                  <div className="simple-card-meta">
                    <span className="simple-meta-date">📅 {evt.time}</span>
                    <span className="simple-meta-venue">📍 {evt.venue}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openDetailModal(evt)}
                    className="simple-action-btn past-btn"
                  >
                    VIEW ARCHIVE →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
