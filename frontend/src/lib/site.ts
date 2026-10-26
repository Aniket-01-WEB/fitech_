// Absolute base for canonical URLs, the sitemap and social-card images.
// Point NEXT_PUBLIC_SITE_URL at a custom domain when one is set up; until
// then it falls back to the live Vercel deployment. The trailing slash is
// stripped so callers can always append "/path".
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://fitech-eta.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "Fincoders";

export const SITE_TAGLINE =
  "Quantitative Finance & Financial Engineering Society";

export const SITE_DESCRIPTION =
  "Fincoders is the student quantitative finance and financial engineering research society at Adamas University. We build algorithmic trading systems, empirical risk models and decentralized protocols, and run symposia, labs and masterclasses for student researchers.";

// Public, crawlable routes. The portal routes are auth-gated and are
// excluded here and in robots.ts.
export const PUBLIC_ROUTES = [
  "/",
  "/domain",
  "/events",
  "/projects",
  "/gallery",
  "/team",
  "/login",
] as const;
