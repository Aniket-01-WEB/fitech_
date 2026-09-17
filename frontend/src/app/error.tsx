'use client';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      background: '#FFFFFF',
      color: '#0A0A0A',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      padding: '2rem',
      textAlign: 'center' as const
    }}>
      <p style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: '#6B6B6B',
        marginBottom: '16px'
      }}>
        SYSTEM ERROR
      </p>
      <h1 style={{
        fontFamily: "'Instrument Serif', Georgia, serif",
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: 400,
        lineHeight: 1.1,
        letterSpacing: '-1px',
        marginBottom: '1rem',
        color: '#0A0A0A'
      }}>
        Something went wrong
      </h1>
      <p style={{
        color: '#6B6B6B',
        marginBottom: '2rem',
        maxWidth: '440px',
        fontSize: '15px',
        lineHeight: 1.6
      }}>
        {error?.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <button
        onClick={reset}
        style={{
          padding: '12px 28px',
          background: '#0A0A0A',
          color: '#FFFFFF',
          border: '1px solid #0A0A0A',
          borderRadius: '9999px',
          cursor: 'pointer',
          fontSize: '11px',
          fontWeight: 600,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          letterSpacing: '0.14em',
          textTransform: 'uppercase' as const,
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        Try Again →
      </button>
    </div>
  );
}
