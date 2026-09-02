import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0f',
      color: '#e2e8f0',
      fontFamily: 'system-ui, sans-serif',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{
        fontSize: '6rem',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        margin: 0,
        lineHeight: 1
      }}>404</h1>
      <p style={{ fontSize: '1.25rem', color: '#94a3b8', marginTop: '1rem', marginBottom: '2rem' }}>
        This page doesn&apos;t exist.
      </p>
      <Link href="/" style={{
        padding: '0.75rem 2rem',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        color: '#fff',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '1rem'
      }}>Back to Home</Link>
    </div>
  );
}
