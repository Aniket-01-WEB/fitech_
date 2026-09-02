// Must be the very first import in server.js — every other module here
// (config/index.js, lib/supabaseClient.js, lib/r2.js, ...) reads
// process.env at its own top level, so the env file has to be loaded
// before any of them are imported, not just before the rest of this
// file's code runs.
//
// Loads the repo-root .env by resolved path, not the current working
// directory, so this works identically whether started via the root
// `npm run dev` (scripts/dev.js already loads the same file and passes
// it down to this process — dotenv never overwrites a variable already
// present in process.env, so this becomes a harmless no-op then) or
// directly via `cd backend && npm run dev`, where this is what actually
// finds it. Falls back to backend/.env for anyone still using an
// old-style per-app file instead of the shared root one.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
