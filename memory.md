# FITECH System & Architecture Memory

## 1. Full-Stack TypeScript Architecture
The entire codebase across both workspaces is written in **100% pure TypeScript**:
- **Frontend (`frontend/`)**: Next.js 16 (Turbopack), React 19, TypeScript (`.tsx` / `.ts`), Tailwind CSS v4.
  - All pages: `src/app/**/page.tsx`, `layout.tsx`, `error.tsx`, `not-found.tsx`.
  - All modular components: `src/components/home/*.tsx`, `src/components/layout/*.tsx`, `src/components/modals/*.tsx`.
  - Application Context: `src/context/PortalContext.tsx`.
  - Utilities & API layer: `src/lib/api.ts`, `src/lib/supabase.ts`, `src/constants/statusLabels.ts`.
  - Typecheck command: `npm run typecheck` runs `tsc --noEmit` cleanly with 0 errors.
- **Backend (`backend/`)**: Node.js / Express API, TypeScript (`.ts`), `tsx`.
  - Server & routes: `src/server.ts`, `src/routes/*.ts`, `src/middleware/*.ts`, `src/lib/*.ts`, `src/config/*.ts`.
  - Type definitions: `src/types/express.d.ts` (custom Express Request typing for `req.supabase` and `req.user`).
  - Typecheck command: `npm run typecheck` runs `tsc --noEmit` cleanly with 0 errors.
- **Monorepo Scripts**:
  - `npm run typecheck`: Runs TypeScript checks across all workspaces.
  - `npm run lint`: Runs ESLint across all workspaces.
  - `npm run build`: Compiles production Next.js frontend and validates backend types.

## 2. Core Visual Direction & Refinement
- **Design Metaphor**: Physical 2D Design with Dimensionality / "Printed matter with interface precision".
- **Target Aesthetic**: Financial Publication × Quantitative Research Lab × Engineering Studio × Student Community.
- **Color Palette (White Background Constraint)**:
  - Base Canvas: `#FFFFFF`
  - Supporting Surfaces: `#F7F7F5`, `#FAFAF8`, `#F1F2F0`
  - Structural Hairline Borders: `#DCDCD8`, `#ECECE8`, Feature: `2px solid #111111`
  - Primary Typography: `#111111`, `#171717` (crisp printing ink)
  - Secondary / Spec Typography: `#555555`, `#707070`
  - Financial Data Accents: Restrained dark navy, subtle muted emerald (`#059669`) for active telemetry and verified status.
  - Strictly NO gradients, no neon, no purple, no glowing blobs.
- **Physical Depth Techniques (Strictly 2D, Zero 3D/WebGL)**:
  - 1px hairline structural borders (`border-[#DCDCD8]`, `border-[#ECECE8]`).
  - Layered paper offset frames (`box-shadow: 4px 6px 0 rgba(0,0,0,0.06)`, `0 8px 24px rgba(0,0,0,0.04)`).
  - Subtle blueprint watermark grids (32px to 48px at 2.5% opacity).
  - Registration marks (`┼`, `┌`, `┐`, `└`, `┘`) at corners of technical panels.
  - Section alternation: White (`#FFFFFF`) → Off-white (`#FAFAF8`) → White (`#FFFFFF`) → Off-white (`#F7F7F5`) for natural rhythm without card-heavy boundaries.

## 3. Typography & Spacing System
- **Global Spacing**: Generous editorial whitespace between sections (`clamp(96px, 10vw, 180px)` / `py-24 md:py-36 lg:py-44`) with dense, organized information inside.
- **Headings**: `Space Grotesk` (`var(--font-heading)` / `font-heading`) — bold, compressed, authoritative editorial character.
- **Body**: `Inter` (`var(--font-body)` / `font-sans`) — readable, clean, institutional.
- **Technical & Metrics**: `JetBrains Mono` (`var(--font-mono)` / `font-mono`) — code references, coordinates, latency benchmarks, telemetry, and indices.

## 4. Modular Homepage Component Hierarchy
The homepage (`frontend/src/app/page.tsx`) is constructed from refined modular components located in `frontend/src/components/home/`:

| Index | Component | Surface | Key Features |
|---|---|---|---|
| 01 | `HeroSection.tsx` | `#FFFFFF` | Metadata pushed to edges, layered paper plate with hairline border `#DCDCD8`, dominant headline *"FROM CODE TO CAPITAL."*, clean hierarchy (*"A STUDENT-DRIVEN COMMUNITY BUILDING THE FUTURE OF FINANCE"*), tactile `[ JOIN US ]` CTA, and clean 6-track operational taxonomy strip (`01 / FINTECH` ... `06 / WEB3`). |
| 02 | `AboutSection.tsx` | `#FAFAF8` | Unboxed editorial composition. Oversized statement: *"We believe the future of finance will be built by people who understand technology, data, markets and human behavior."*, supporting narrative, and research report statistics (`06 SPECIALIZED DOMAINS`, `01 STUDENT COMMUNITY`, `∞ ROOM TO BUILD`) with thin dividers. |
| 03 | `DomainsSection.tsx` | `#FFFFFF` | Structured "financial index" research table replacing generic SaaS cards. 6 operational tracks with micro-metrics, tag pills, row hover shift (`translate-x-2`), and active dark accent indicator bar. |
| 04 | `ActivitiesSection.tsx` | `#F7F7F5` | Editorial research bulletin: large visual block for the featured upcoming event (title, date, location, domain, description, CTA) + compact rows for past events. Real event data only with proper empty state. |
| 05 | `ShowcaseSection.tsx` | `#FFFFFF` | Asymmetric engineering archive. Prominent flagship project (*Nexus L2 Matching Engine*) with full-width architectural spread (Context, Built by, Guidance, Domain, Tech, live benchmark numbers) + 2 supporting lab builds (*ZK Solvency Protocol*, *Neural Volatility Smile Engine*). |
| 06 | `TeamSection.tsx` | `#FAFAF8` | Asymmetric editorial "PEOPLE INDEX" with varying card widths (featured leads span 6 cols, standard span 3 cols). Real photos where available, intentional technical grid placeholders where missing. Preserves all 16 leadership members with LinkedIn links. |
| 07 | `CommunitiesSection.tsx` | `#FFFFFF` | Institutional credentials layout (*"MORE THAN A COMMUNITY"*). 4 large credential statements (Quant Codebases, Research Grants, Placement Pipeline, Hackathon Incubator) with thin borders + Adamas University SOET academic charter seal plate. |
| 08 | `GallerySection.tsx` | `#F7F7F5` | Dominant photography contact sheet. Large flagship summit photo plate (`/images/event-summit.jpg`) with natural contrast, corner crop marks (`┼`), negative strip metadata, captions, dates. |
| 09 | `CtaSection.tsx` | `#FFFFFF` | High-impact accession frame with double offset border, massive typography (*"READY TO BUILD WHAT COMES NEXT?"*), small supporting line, and tactile pressed button `[ JOIN FITECH → ]`. |
| 10 | `Footer.tsx` | `#FAFAF8` | Minimal financial publication colophon with system telemetry bar, 3 clean columns (Navigation, Contact, Social), and Adamas University chapter attribution. |

## 5. Inviolable Constraints Enforced
1. **Navbar Design Integrity**: `frontend/src/components/layout/Navbar.tsx` is preserved 100% in design, dimensions, spacing, links, and structure.
2. **Strict Light Canvas**: No dark mode on landing, no neon, no generic gradient blobs, no 3D/WebGL.
3. **Data Integrity**: Dynamic events from `PortalContext`, modal triggers (`openJoinModal`, `openDetailModal`), and all 16 team members preserved.
4. **Environment**: Strictly single `.env` file at repository root.
