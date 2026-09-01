'use client';

import React from 'react';
import Link from 'next/link';

export default function GalleryPage() {
  return (
    <div style={{ background: '#ffffff', minHeight: '120vh', paddingTop: '140px', paddingBottom: '100px' }}>
      <div style={{ width: '100%', maxWidth: '1680px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 64px)' }}>
        {/* Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(48px, 6.5vw, 88px)', fontWeight: '900', color: '#0a0a0a', letterSpacing: '-2px', margin: 0, lineHeight: 1.05 }}>
              Moments That Matters
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(16px, 1.6vw, 20px)', color: '#64748b', marginTop: '12px', maxWidth: '820px', lineHeight: 1.6 }}>
              a glimpse into the events,people and experiences that make our community what it is
            </p>
          </div>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '10px 24px',
              borderRadius: '9999px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#0f172a',
              fontWeight: '600',
              fontSize: '14px',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              marginTop: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            Back to Home
          </Link>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: '1px', background: '#e2e8f0', marginBottom: '40px' }}></div>

        {/* 2026 Section Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0', marginBottom: '40px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: '800', color: '#0a0a0a', margin: 0 }}>
            2026
          </h2>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
            3 Photos
          </span>
        </div>

        {/* Photo Grid Placeholder */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '32px' }}>
          <div style={{ height: '500px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a0a0a', fontWeight: '700', fontSize: '20px', boxShadow: '0 12px 32px rgba(0,0,0,0.06)' }}>
            FinTech Hackathon 2026
          </div>
          <div style={{ height: '500px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a0a0a', fontWeight: '700', fontSize: '20px', boxShadow: '0 12px 32px rgba(0,0,0,0.06)' }}>
            Quant Masterclass
          </div>
          <div style={{ height: '500px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a0a0a', fontWeight: '700', fontSize: '20px', boxShadow: '0 12px 32px rgba(0,0,0,0.06)' }}>
            Community Meetup
          </div>
        </div>
      </div>
    </div>
  );
}
