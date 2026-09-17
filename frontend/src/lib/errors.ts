// Turns whatever an API call / Supabase / fetch threw into a sentence a
// member can act on. Technical text (status codes, Postgres/PostgREST
// codes, Zod wording, stack fragments) never reaches the screen.

const KNOWN: Array<[RegExp, string]> = [
  [/invalid login credentials/i, 'Incorrect email or password.'],
  [/email not confirmed/i, 'Please confirm your email address first, then sign in again.'],
  [/user already registered|already exists|already registered/i, 'An account with this email already exists. Try signing in.'],
  [/password should be at least|password.*too short|at least \d+ characters/i, 'Password must be at least 8 characters.'],
  [/invalid email|unable to validate email/i, 'Enter a valid email address.'],
  [/rate limit|too many requests|slow down/i, 'Too many attempts. Please wait a minute and try again.'],
  [/token has expired|otp expired|expired/i, 'That code has expired. Request a new one.'],
  [/invalid.*(otp|token|code)|token.*invalid/i, 'That code is not valid. Check it and try again.'],
  [/not authorized|not allowed|permission|forbidden|42501/i, 'You do not have permission to do that.'],
  [/not found/i, 'That item no longer exists.'],
  [/too long|too large|max(imum)? size|25 ?mb|750 ?mb/i, 'That file is too large.'],
  [/isn'?t allowed for|file type|not allowed/i, 'That file type is not supported.'],
  [/took too long|timeout|timed out/i, 'The server is taking too long. Please try again.'],
  [/can'?t reach|failed to fetch|network|fetch failed|load failed|unavailable|paused/i, 'We could not reach the server. Check your connection and try again.'],
  [/^invalid (\w+)/i, 'Please check the highlighted field and try again.'],
  [/only a super admin/i, 'Only a super admin can approve or reject this.'],
  [/upload does not belong/i, 'That upload belongs to another account.'],
];

// Anything that still looks like developer output gets the fallback.
const LOOKS_TECHNICAL = /\b(PGRST\d+|\d{5}|status \d{3}|\d{3} ?\(|\bat\s+\w+\s*\(|TypeError|ReferenceError|SyntaxError|undefined|null|\{|\}|\[object|expected string|expected number|Too small|Too big|Required)\b/i;

export function friendlyError(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  const raw = err instanceof Error ? err.message : typeof err === 'string' ? err : '';
  if (!raw) return fallback;
  for (const [pattern, text] of KNOWN) if (pattern.test(raw)) return text;
  if (LOOKS_TECHNICAL.test(raw) || raw.length > 140) return fallback;
  // Short, plain, sentence-like server messages (our own triggers write
  // these deliberately) are fine to show.
  return raw.replace(/\s+/g, ' ').trim().replace(/[.]?$/, '.');
}
