import rateLimit from 'express-rate-limit';

const jsonLimitHandler = (req, res) => {
  res.status(429).json({ error: 'Too many requests. Please slow down and try again shortly.' });
};

/** Generous baseline for all /api traffic — catches abusive scripting, not real usage. */
export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonLimitHandler,
});

/** Tighter limit for the two actions with a real abuse cost: minting an R2
 * presigned upload URL (each one is a real, billable write slot) and
 * filing an admin-access request. */
export const sensitiveActionLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonLimitHandler,
});
