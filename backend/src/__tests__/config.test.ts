import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('config/index (ALLOWED_ORIGINS)', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('includes localhost origins in development', async () => {
    delete process.env.NODE_ENV;
    delete process.env.FRONTEND_ORIGIN;
    const { ALLOWED_ORIGINS } = await import('../config/index.js');
    expect(ALLOWED_ORIGINS).toContain('http://localhost:3000');
    expect(ALLOWED_ORIGINS).toContain('http://127.0.0.1:3000');
  });

  it('includes configured origins from FRONTEND_ORIGIN', async () => {
    process.env.FRONTEND_ORIGIN = 'https://fitech.club,https://staging.fitech.club';
    delete process.env.NODE_ENV;
    const { ALLOWED_ORIGINS } = await import('../config/index.js');
    expect(ALLOWED_ORIGINS).toContain('https://fitech.club');
    expect(ALLOWED_ORIGINS).toContain('https://staging.fitech.club');
  });

  it('deduplicates origins', async () => {
    process.env.FRONTEND_ORIGIN = 'http://localhost:3000';
    delete process.env.NODE_ENV;
    const { ALLOWED_ORIGINS } = await import('../config/index.js');
    const localhostCount = ALLOWED_ORIGINS.filter((o: string) => o === 'http://localhost:3000').length;
    expect(localhostCount).toBe(1);
  });

  it('always allows the deployed frontend and local dev, even in production', async () => {
    process.env.NODE_ENV = 'production';
    process.env.FRONTEND_ORIGIN = 'https://fitech.club';
    const { ALLOWED_ORIGINS } = await import('../config/index.js');
    expect(ALLOWED_ORIGINS).toContain('https://fitech.club');
    expect(ALLOWED_ORIGINS).toContain('https://fitech-eta.vercel.app');
    expect(ALLOWED_ORIGINS).toContain('http://localhost:3000');
  });

  it('strips trailing slashes from configured origins', async () => {
    process.env.FRONTEND_ORIGIN = 'https://fitech.club/, https://staging.fitech.club//';
    const { ALLOWED_ORIGINS } = await import('../config/index.js');
    expect(ALLOWED_ORIGINS).toContain('https://fitech.club');
    expect(ALLOWED_ORIGINS).toContain('https://staging.fitech.club');
    expect(ALLOWED_ORIGINS).not.toContain('https://fitech.club/');
  });

  it('uses default PORT 4000 when PORT is not set', async () => {
    delete process.env.PORT;
    const { PORT } = await import('../config/index.js');
    expect(PORT).toBe(4000);
  });

  it('reads PORT from environment', async () => {
    process.env.PORT = '8080';
    const { PORT } = await import('../config/index.js');
    expect(PORT).toBe('8080');
  });
});
