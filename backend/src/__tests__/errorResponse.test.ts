import { describe, it, expect, vi } from 'vitest';
import { sendError } from '../lib/errorResponse.js';

function mockRes() {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe('sendError', () => {
  it('maps 42501 (insufficient_privilege) to 403', () => {
    const res = mockRes();
    sendError(res, { code: '42501', message: 'denied' });
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Not authorized to perform this action.' });
  });

  it('forwards P0001 (trigger raise_exception) message', () => {
    const res = mockRes();
    sendError(res, { code: 'P0001', message: 'Only a super admin can approve or reject events.' });
    expect(res.json).toHaveBeenCalledWith({ error: 'Only a super admin can approve or reject events.' });
  });

  it('maps 23505 (unique_violation) to 409', () => {
    const res = mockRes();
    sendError(res, { code: '23505', message: 'duplicate key' });
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ error: 'This already exists.' });
  });

  it('maps PGRST116 (no row found) to 404', () => {
    const res = mockRes();
    sendError(res, { code: 'PGRST116', message: 'no rows' });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Not found.' });
  });

  it('detects Supabase unreachable (ENOTFOUND) and returns 503', () => {
    const res = mockRes();
    sendError(res, { message: 'fetch failed', details: 'ENOTFOUND cpainkjljrjjwzdgdewz.supabase.co' });
    expect(res.status).toHaveBeenCalledWith(503);
  });

  it('returns generic message for unknown errors', () => {
    const res = mockRes();
    sendError(res, { code: 'UNKNOWN', message: 'some internal detail with table names' });
    expect(res.json).toHaveBeenCalledWith({ error: 'Request could not be completed.' });
  });

  it('uses fallbackStatus for unknown errors', () => {
    const res = mockRes();
    sendError(res, { code: 'UNKNOWN' }, 422);
    expect(res.status).toHaveBeenCalledWith(422);
  });

  it('defaults fallbackStatus to 400', () => {
    const res = mockRes();
    sendError(res, { code: 'UNKNOWN' });
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
