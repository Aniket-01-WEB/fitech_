import { describe, it, expect } from "vitest";
import {
  profileUpdateSchema,
  eventCreateSchema,
  eventUpdateSchema,
  registrationCreateSchema,
  registrationQuerySchema,
  adminRequestCreateSchema,
  noteCreateSchema,
  uploadUrlSchema,
  recordingCreateSchema,
  recordingUpdateSchema,
  ALLOWED_NOTE_MIME_TYPES,
  ALLOWED_RECORDING_MIME_TYPES,
  MAX_NOTE_BYTES,
  MAX_RECORDING_BYTES,
} from "../lib/validation.js";

describe("profileUpdateSchema", () => {
  it("accepts a valid partial profile update", () => {
    const result = profileUpdateSchema.safeParse({
      name: "Alice",
      school: "SOET",
    });
    expect(result.success).toBe(true);
  });

  it("accepts an empty object (no fields to update)", () => {
    const result = profileUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("rejects unknown fields like role (strict mode)", () => {
    const result = profileUpdateSchema.safeParse({ role: "superadmin" });
    expect(result.success).toBe(false);
  });

  it("rejects an excessively long name", () => {
    const result = profileUpdateSchema.safeParse({ name: "A".repeat(200) });
    expect(result.success).toBe(false);
  });

  it("trims whitespace from string fields", () => {
    const result = profileUpdateSchema.safeParse({ name: "  Alice  " });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.name).toBe("Alice");
  });
});

describe("eventCreateSchema", () => {
  it("accepts a valid event with title only", () => {
    const result = eventCreateSchema.safeParse({
      title: "FinTech Summit 2026",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an event without a title", () => {
    const result = eventCreateSchema.safeParse({ venue: "Main Hall" });
    expect(result.success).toBe(false);
  });

  it("rejects unknown fields like status", () => {
    const result = eventCreateSchema.safeParse({
      title: "Test",
      status: "approved",
    });
    expect(result.success).toBe(false);
  });

  it("allows all optional fields", () => {
    const result = eventCreateSchema.safeParse({
      title: "DeFi Summit",
      type: "SUMMIT",
      banner: "https://example.com/banner.jpg",
      event_time: "2026-04-01T10:00:00Z",
      venue: "Auditorium",
      description: "A great event about DeFi",
    });
    expect(result.success).toBe(true);
  });
});

describe("eventUpdateSchema", () => {
  it("accepts a partial update (all fields optional)", () => {
    const result = eventUpdateSchema.safeParse({ title: "Updated Title" });
    expect(result.success).toBe(true);
  });

  it("accepts an empty object", () => {
    const result = eventUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

describe("registrationCreateSchema", () => {
  it("accepts a numeric event_id", () => {
    const result = registrationCreateSchema.safeParse({ event_id: 42 });
    expect(result.success).toBe(true);
  });

  it("accepts a string event_id that looks like a number", () => {
    const result = registrationCreateSchema.safeParse({ event_id: "42" });
    expect(result.success).toBe(true);
  });

  it("rejects a non-numeric string event_id", () => {
    const result = registrationCreateSchema.safeParse({ event_id: "abc" });
    expect(result.success).toBe(false);
  });

  it("rejects extra fields", () => {
    const result = registrationCreateSchema.safeParse({
      event_id: 1,
      user_id: "sneaky",
    });
    expect(result.success).toBe(false);
  });
});

describe("registrationQuerySchema", () => {
  it("accepts an empty query", () => {
    const result = registrationQuerySchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts an event_id filter", () => {
    const result = registrationQuerySchema.safeParse({ event_id: "123" });
    expect(result.success).toBe(true);
  });
});

describe("adminRequestCreateSchema", () => {
  it("accepts a reason", () => {
    const result = adminRequestCreateSchema.safeParse({
      reason: "I want to help manage events",
    });
    expect(result.success).toBe(true);
  });

  it("accepts an empty object", () => {
    const result = adminRequestCreateSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("rejects extra fields like status", () => {
    const result = adminRequestCreateSchema.safeParse({
      reason: "test",
      status: "approved",
    });
    expect(result.success).toBe(false);
  });
});

describe("noteCreateSchema", () => {
  it("accepts a note with an external link", () => {
    const result = noteCreateSchema.safeParse({
      title: "Intro to Black-Scholes",
      external_link: "https://example.com/notes.pdf",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a note with an r2_key", () => {
    const result = noteCreateSchema.safeParse({
      title: "Lecture Notes",
      r2_key: "notes/abc/file.pdf",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a note with neither external_link nor r2_key", () => {
    const result = noteCreateSchema.safeParse({ title: "Empty Note" });
    expect(result.success).toBe(false);
  });

  it("accepts optional topics array", () => {
    const result = noteCreateSchema.safeParse({
      title: "Topic Note",
      external_link: "https://example.com/note.pdf",
      topics: ["finance", "derivatives"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects more than 20 topics", () => {
    const topics = Array.from({ length: 21 }, (_, i) => `topic-${i}`);
    const result = noteCreateSchema.safeParse({
      title: "Too Many Topics",
      external_link: "https://example.com/note.pdf",
      topics,
    });
    expect(result.success).toBe(false);
  });
});

describe("uploadUrlSchema", () => {
  it("accepts a valid upload request", () => {
    const result = uploadUrlSchema.safeParse({
      fileName: "lecture.pdf",
      contentType: "application/pdf",
      fileSize: 1024 * 1024,
    });
    expect(result.success).toBe(true);
  });

  it("requires fileName", () => {
    const result = uploadUrlSchema.safeParse({
      contentType: "application/pdf",
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative fileSize", () => {
    const result = uploadUrlSchema.safeParse({
      fileName: "test.pdf",
      fileSize: -1,
    });
    expect(result.success).toBe(false);
  });
});

describe("recordingCreateSchema", () => {
  it("accepts a valid recording", () => {
    const result = recordingCreateSchema.safeParse({
      title: "C++ Masterclass",
      type: "MASTERCLASS",
      speaker: "Aniket Dutta",
    });
    expect(result.success).toBe(true);
  });

  it("rejects duration_seconds over 24h", () => {
    const result = recordingCreateSchema.safeParse({
      title: "Test",
      duration_seconds: 100000,
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid video_url", () => {
    const result = recordingCreateSchema.safeParse({
      title: "Video",
      video_url: "https://youtube.com/watch?v=abc",
    });
    expect(result.success).toBe(true);
  });

  it("rejects javascript: video_url", () => {
    const result = recordingCreateSchema.safeParse({
      title: "XSS",
      video_url: "javascript:alert(1)",
    });
    expect(result.success).toBe(false);
  });
});

describe("recordingUpdateSchema", () => {
  it("accepts a partial update", () => {
    const result = recordingUpdateSchema.safeParse({ title: "Updated Title" });
    expect(result.success).toBe(true);
  });
});

describe("MIME type allowlists", () => {
  it("allows PDF for notes", () => {
    expect(ALLOWED_NOTE_MIME_TYPES.has("application/pdf")).toBe(true);
  });

  it("blocks executables for notes", () => {
    expect(ALLOWED_NOTE_MIME_TYPES.has("application/x-msdownload")).toBe(false);
  });

  it("allows mp4 for recordings", () => {
    expect(ALLOWED_RECORDING_MIME_TYPES.has("video/mp4")).toBe(true);
  });

  it("blocks exe for recordings", () => {
    expect(ALLOWED_RECORDING_MIME_TYPES.has("application/x-msdownload")).toBe(
      false,
    );
  });
});

describe("size limits", () => {
  it("note limit is 25 MB", () => {
    expect(MAX_NOTE_BYTES).toBe(25 * 1024 * 1024);
  });

  it("recording limit is 750 MB", () => {
    expect(MAX_RECORDING_BYTES).toBe(750 * 1024 * 1024);
  });
});
