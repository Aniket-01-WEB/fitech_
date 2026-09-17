import { test, expect, type Page } from '@playwright/test';

// The intro loader plays on every load; set its skip flag so tests see
// the page immediately.
async function open(page: Page, path: string) {
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem('fitech_skip_loader', 'true');
    } catch {
      // storage unavailable — loader simply plays
    }
  });
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(path, { waitUntil: 'networkidle' });
  return errors;
}

test.describe('public pages', () => {
  for (const path of ['/', '/events', '/team', '/projects', '/domain', '/gallery', '/login']) {
    test(`${path} renders without runtime errors or horizontal overflow`, async ({ page }) => {
      const errors = await open(page, path);
      await expect(page.locator('nav[aria-label="Main Navigation"]')).toBeVisible();
      expect(errors, 'uncaught page errors').toEqual([]);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, 'horizontal overflow in px').toBeLessThanOrEqual(0);
    });
  }

  test('security headers are sent', async ({ request }) => {
    const res = await request.get('/');
    const h = res.headers();
    expect(h['content-security-policy']).toContain("default-src 'self'");
    expect(h['x-content-type-options']).toBe('nosniff');
    expect(h['x-frame-options']).toBe('SAMEORIGIN');
    expect(h['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(h['permissions-policy']).toContain('camera=()');
  });

  test('FAQ expands from its toggle only', async ({ page }) => {
    await open(page, '/');
    const toggles = page.locator('#faq .faq-toggle');
    await toggles.nth(1).scrollIntoViewIfNeeded();
    await expect(toggles.nth(1)).toHaveAttribute('aria-expanded', 'false');
    await page.locator('#faq h3').nth(1).click();
    await expect(toggles.nth(1)).toHaveAttribute('aria-expanded', 'false');
    await toggles.nth(1).click();
    await expect(toggles.nth(1)).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#faq-answer-1')).toBeVisible();
  });

  test('unknown route shows the not-found page', async ({ page }) => {
    const res = await page.goto('/this-route-does-not-exist');
    expect(res?.status()).toBe(404);
  });
});

test.describe('auth', () => {
  test('protected dashboards redirect signed-out visitors to /login', async ({ page }) => {
    for (const path of ['/dashboard', '/student-portal', '/admin-portal', '/super-admin']) {
      await open(page, path);
      await page.waitForURL(/\/login/, { timeout: 15_000 });
      expect(page.url()).toContain('/login');
    }
  });

  test('demo student can sign in and reach the student portal', async ({ page }) => {
    test.skip(process.env.E2E_DEMO_LOGIN !== 'true', 'needs a reachable backend + Supabase; set E2E_DEMO_LOGIN=true');
    await open(page, '/login');
    await page.getByLabel(/email/i).first().fill('student@matrix.club');
    await page.getByLabel(/password/i).first().fill('MatrixDemo-2026!');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL(/\/student-portal/, { timeout: 30_000 });
    await expect(page.getByText(/student member dashboard/i)).toBeVisible();
  });
});
