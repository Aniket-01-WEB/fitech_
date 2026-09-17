import { describe, it, expect } from 'vitest';
import { buildKey, ownsKey } from '../lib/r2.js';

describe('buildKey', () => {
  it('generates a key in the format kind/uploaderId/timestamp-uuid-safeName', () => {
    const key = buildKey('notes', 'user-123', 'lecture.pdf');
    expect(key).toMatch(/^notes\/user-123\/\d+-[0-9a-f-]+-lecture\.pdf$/);
  });

  it('sanitizes special characters in file names', () => {
    const key = buildKey('notes', 'user-1', 'my file (final).pdf');
    // Spaces, parens should be replaced with underscores
    expect(key).not.toContain(' ');
    expect(key).not.toContain('(');
    expect(key).not.toContain(')');
  });

  it('sanitizes path-traversal attempts', () => {
    const key = buildKey('notes', 'user-1', '../../../etc/passwd');
    expect(key).not.toContain('..');
    expect(key).toMatch(/^notes\//);
  });

  it('truncates extremely long filenames to 120 characters', () => {
    const longName = 'a'.repeat(300) + '.pdf';
    const key = buildKey('notes', 'user-1', longName);
    const safeName = key.split('-').pop()!;
    expect(safeName.length).toBeLessThanOrEqual(120);
  });

  it('handles undefined fileName gracefully', () => {
    const key = buildKey('recordings', 'user-1', undefined);
    expect(key).toMatch(/^recordings\/user-1\/\d+-[0-9a-f-]+-file$/);
  });

  it('handles undefined uploaderId', () => {
    const key = buildKey('notes', undefined, 'test.pdf');
    expect(key).toMatch(/^notes\/unknown\//);
  });

  it('generates unique keys for the same inputs', () => {
    const key1 = buildKey('notes', 'user-1', 'test.pdf');
    const key2 = buildKey('notes', 'user-1', 'test.pdf');
    expect(key1).not.toBe(key2); // UUID + timestamp differ
  });
});

describe('ownsKey', () => {
  it('accepts a key minted for the same uploader and kind', () => {
    expect(ownsKey('notes', 'user-1', buildKey('notes', 'user-1', 'a.pdf'))).toBe(true);
  });
  it('rejects another uploader\'s key', () => {
    expect(ownsKey('notes', 'user-2', buildKey('notes', 'user-1', 'a.pdf'))).toBe(false);
  });
  it('rejects a key from a different kind', () => {
    expect(ownsKey('notes', 'user-1', buildKey('recordings', 'user-1', 'a.mp4'))).toBe(false);
  });
  it('rejects non-strings and prefix look-alikes', () => {
    expect(ownsKey('notes', 'user-1', undefined)).toBe(false);
    expect(ownsKey('notes', 'user-1', 'notes/user-10/x')).toBe(false);
  });
});
