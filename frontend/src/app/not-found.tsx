import Link from 'next/link';

export default function NotFound() {
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
        PAGE NOT FOUND
      </p>
      <h1 style={{
        fontFamily: "'Instrument Serif', Georgia, serif",
        fontSize: 'clamp(5rem, 12vw, 8rem)',
        fontWeight: 400,
        lineHeight: 1,
        letterSpacing: '-3px',
        margin: 0,
        color: '#0A0A0A'
      }}>
        404
      </h1>
      <p style={{
        fontSize: '15px',
        color: '#6B6B6B',
        marginTop: '1rem',
        marginBottom: '2rem',
        lineHeight: 1.6
      }}>
        This page doesn&apos;t exist.
      </p>
      <Link href="/" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 28px',
        background: '#0A0A0A',
        color: '#FFFFFF',
        border: '1px solid #0A0A0A',
        borderRadius: '9999px',
        textDecoration: 'none',
        fontSize: '11px',
        fontWeight: 600,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        letterSpacing: '0.14em',
        textTransform: 'uppercase' as const,
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        Back to Home →
      </Link>
    </div>
  );
}
