import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: path.resolve(__dirname, '..'),
  },
  // Disables Next.js's own dev-mode indicator — the floating circular
  // "N" badge it renders in the bottom-left corner during `next dev`.
  // Framework-injected, not part of this app's own markup/CSS; already
  // absent from production builds regardless.
  devIndicators: false,
};

export default nextConfig;
