import { z } from "zod";

/**
 * Parses req.body against a Zod schema before the route handler runs.
 * On success, req.body is replaced with the parsed/typed result (unknown
 * fields already stripped by the schema's own .strict()/.strip()
 * behavior); on failure, responds 400 with a compact, safe message —
 * never the raw Zod issue objects, which can echo back attacker input.
 */
// Zod's own wording ("Too small: expected string to have >=1 characters")
// is for developers. Clients get one short, human sentence per failure.
function describeIssue(issue, fallbackField: string): string {
  const path = issue?.path?.length ? issue.path.join(".") : fallbackField;
  // snake_case and camelCase field names read as plain words.
  const field = String(path)
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase();
  switch (issue?.code) {
    case "too_small":
      if (issue.origin === "string")
        return issue.minimum === 1
          ? `Please enter a ${field}.`
          : `${capitalize(field)} is too short.`;
      return `${capitalize(field)} is too small.`;
    case "too_big":
      return issue.origin === "string"
        ? `${capitalize(field)} is too long.`
        : `${capitalize(field)} is too large.`;
    case "invalid_type":
      return `${capitalize(field)} is missing or not valid.`;
    case "unrecognized_keys":
      return "The request contains a field that is not allowed.";
    case "invalid_format":
      return `${capitalize(field)} is not a valid ${issue.format === "url" ? "link" : "value"}.`;
    case "custom":
      return issue.message || `${capitalize(field)} is not valid.`;
    default:
      return `${capitalize(field)} is not valid.`;
  }
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body ?? {});
    if (!result.success) {
      return res
        .status(400)
        .json({ error: describeIssue(result.error.issues[0], "request") });
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
      return res
        .status(400)
        .json({ error: describeIssue(result.error.issues[0], "query") });
    }
    next();
  };
}

/** Validates a single :id-style route param (bigint ids, not UUIDs, in this schema). */
export function validateIdParam(req, res, next) {
  if (!/^\d+$/.test(req.params.id || "")) {
    return res.status(400).json({ error: "That item could not be found." });
  }
  next();
}

// ---- shared field building blocks ----
const httpsUrl = (max = 2000) =>
  z
    .string()
    .trim()
    .min(1)
    .max(max)
    .url()
    .refine((u) => /^https?:\/\//i.test(u), {
      message: "Links must start with http:// or https://.",
    });

const shortText = (max) => z.string().trim().max(max);
const requiredText = (max) => z.string().trim().min(1).max(max);
const bigIntId = z.union([
  z.number().int().positive(),
  z.string().regex(/^\d+$/),
]);

// ---- route schemas ----

export const profileUpdateSchema = z
  .object({
    name: shortText(120).min(1).optional(),
    reg_number: shortText(60).optional(),
    roll_number: shortText(60).optional(),
    school: shortText(160).optional(),
    department: shortText(160).optional(),
    section: shortText(60).optional(),
    current_year: shortText(60).optional(),
    contact_number: shortText(30).optional(),
    interested_domain: shortText(160).optional(),
  })
  .strict();

export const eventCreateSchema = z
  .object({
    title: requiredText(200),
    type: shortText(60).optional(),
    banner: shortText(2000).optional(),
    event_time: shortText(60).optional(),
    event_time_label: shortText(200).optional(),
    venue: shortText(200).optional(),
    description: shortText(5000).optional(),
  })
  .strict();

export const eventUpdateSchema = eventCreateSchema.partial().strict();

export const registrationCreateSchema = z
  .object({
    event_id: bigIntId,
  })
  .strict();

export const registrationQuerySchema = z
  .object({
    event_id: bigIntId.optional(),
  })
  .strict();

export const adminRequestCreateSchema = z
  .object({
    reason: shortText(1000).optional(),
  })
  .strict();

export const noteCreateSchema = z
  .object({
    title: requiredText(200),
    domain: shortText(160).optional(),
    description: shortText(5000).optional(),
    external_link: httpsUrl().optional(),
    file_type: shortText(100).optional(),
    topics: z.array(shortText(80)).max(20).optional(),
    r2_key: shortText(500).optional(),
  })
  .strict()
  .refine((v) => Boolean(v.external_link || v.r2_key), {
    message: "Add a link or upload a file first.",
  });

export const uploadUrlSchema = z
  .object({
    fileName: requiredText(255),
    contentType: shortText(150).optional(),
    fileSize: z.number().int().positive().optional(),
  })
  .strict();

const recordingFields = {
  title: requiredText(200),
  type: shortText(60).optional(),
  speaker: shortText(160).optional(),
  banner: shortText(2000).optional(),
  recording_date: shortText(100).optional(),
  duration_label: shortText(60).optional(),
  duration_seconds: z
    .number()
    .int()
    .min(0)
    .max(24 * 60 * 60)
    .optional(), // capped at 24h
  video_url: httpsUrl().optional(),
  description: shortText(5000).optional(),
  takeaways: z.array(shortText(300)).max(30).optional(),
  r2_key: shortText(500).optional(),
};

export const recordingCreateSchema = z.object(recordingFields).strict();
export const recordingUpdateSchema = z
  .object(recordingFields)
  .partial()
  .strict();

// ---- upload allowlists (defense-in-depth alongside the frontend's own
// <input accept> hint, which a client can trivially bypass) ----
export const ALLOWED_NOTE_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "image/png",
  "image/jpeg",
]);

export const ALLOWED_RECORDING_MIME_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

export const MAX_NOTE_BYTES = 25 * 1024 * 1024; // 25 MB
export const MAX_RECORDING_BYTES = 750 * 1024 * 1024; // 750 MB
