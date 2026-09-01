import { z } from 'zod';

/**
 * Parses req.body against a Zod schema before the route handler runs.
 * On success, req.body is replaced with the parsed/typed result (unknown
 * fields already stripped by the schema's own .strict()/.strip()
 * behavior); on failure, responds 400 with a compact, safe message —
 * never the raw Zod issue objects, which can echo back attacker input.
 */
export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body ?? {});
    if (!result.success) {
      const first = result.error.issues[0];
      const field = first?.path?.join('.') || 'body';
      return res.status(400).json({ error: `Invalid ${field}: ${first?.message || 'malformed input'}` });
    }
    req.body = result.data;
    next();
  };
}

/**
 * Same idea, for req.query — but req.query is a read-only getter in
 * Express 5 (backed by the URL's own parsed search params), so this only
 * validates and calls next(); it never reassigns req.query. Route
 * handlers keep reading the original (string) values, which is what
 * Supabase's query builder expects anyway.
 */
export function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query ?? {});
    if (!result.success) {
      const first = result.error.issues[0];
      const field = first?.path?.join('.') || 'query';
      return res.status(400).json({ error: `Invalid ${field}: ${first?.message || 'malformed input'}` });
    }
    next();
  };
}

/** Validates a single :id-style route param (bigint ids, not UUIDs, in this schema). */
export function validateIdParam(req, res, next) {
  if (!/^\d+$/.test(req.params.id || '')) {
    return res.status(400).json({ error: 'Invalid id.' });
  }
  next();
}

// ---- shared field building blocks ----
const httpsUrl = (max = 2000) =>
  z.string().trim().min(1).max(max).url().refine((u) => /^https?:\/\//i.test(u), { message: 'must be an http(s) URL' });

const shortText = (max) => z.string().trim().max(max);
const requiredText = (max) => z.string().trim().min(1).max(max);
const bigIntId = z.union([z.number().int().positive(), z.string().regex(/^\d+$/)]);

// ---- route schemas ----

export const profileUpdateSchema = z.object({
  name: shortText(120).min(1).optional(),
  reg_number: shortText(60).optional(),
  roll_number: shortText(60).optional(),
  school: shortText(160).optional(),
  department: shortText(160).optional(),
  section: shortText(60).optional(),
  current_year: shortText(60).optional(),
  contact_number: shortText(30).optional(),
  interested_domain: shortText(160).optional(),
}).strict();

export const eventCreateSchema = z.object({
  title: requiredText(200),
  type: shortText(60).optional(),
  banner: shortText(2000).optional(),
  event_time: shortText(60).optional(),
  event_time_label: shortText(200).optional(),
  venue: shortText(200).optional(),
  description: shortText(5000).optional(),
}).strict();

export const eventUpdateSchema = eventCreateSchema.partial().strict();

export const registrationCreateSchema = z.object({
  event_id: bigIntId,
}).strict();

export const registrationQuerySchema = z.object({
  event_id: bigIntId.optional(),
}).strict();

export const adminRequestCreateSchema = z.object({
  reason: shortText(1000).optional(),
}).strict();

export const noteCreateSchema = z.object({
  title: requiredText(200),
  domain: shortText(160).optional(),
  description: shortText(5000).optional(),
  external_link: httpsUrl().optional(),
  file_type: shortText(100).optional(),
  topics: z.array(shortText(80)).max(20).optional(),
  r2_key: shortText(500).optional(),
}).strict()
  .refine((v) => Boolean(v.external_link || v.r2_key), { message: 'Provide an external_link or upload a file first.' });

export const uploadUrlSchema = z.object({
  fileName: requiredText(255),
  contentType: shortText(150).optional(),
  fileSize: z.number().int().positive().optional(),
}).strict();

const recordingFields = {
  title: requiredText(200),
  type: shortText(60).optional(),
  speaker: shortText(160).optional(),
  banner: shortText(2000).optional(),
  recording_date: shortText(100).optional(),
  duration_label: shortText(60).optional(),
  duration_seconds: z.number().int().min(0).max(24 * 60 * 60).optional(), // capped at 24h
  video_url: httpsUrl().optional(),
  description: shortText(5000).optional(),
  takeaways: z.array(shortText(300)).max(30).optional(),
  r2_key: shortText(500).optional(),
};

export const recordingCreateSchema = z.object(recordingFields).strict();
export const recordingUpdateSchema = z.object(recordingFields).partial().strict();

// ---- upload allowlists (defense-in-depth alongside the frontend's own
// <input accept> hint, which a client can trivially bypass) ----
export const ALLOWED_NOTE_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'image/png',
  'image/jpeg',
]);

export const ALLOWED_RECORDING_MIME_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime',
]);

export const MAX_NOTE_BYTES = 25 * 1024 * 1024; // 25 MB
export const MAX_RECORDING_BYTES = 750 * 1024 * 1024; // 750 MB
