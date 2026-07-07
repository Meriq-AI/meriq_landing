# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml` / `pnpm-workspace.yaml`).

- `pnpm dev` — run the dev server (Next.js)
- `pnpm build` — production build
- `pnpm start` — serve the production build
- `pnpm lint` — ESLint (flat config, `eslint-config-next`)
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm format` — Prettier write over all `.ts`/`.tsx`

There is no test runner configured. A husky pre-commit hook runs `pnpm lint && pnpm typecheck`.

## Critical: Next.js version

This is **Next.js 16** with **React 19** — a version with breaking changes from older Next.js. Per `AGENTS.md`, before writing Next.js-specific code, read the relevant guide under `node_modules/next/dist/docs/` and heed deprecation notices. Notably: request interception lives in `proxy.ts` (exporting `proxy()`), not `middleware.ts`, and route `params` are Promises that must be awaited.

## What this site is

The Meriq marketing site: **AI export operator for Taiwanese manufacturers** — turning overseas buyer inquiries into shippable export plans (freight quote comparison, landed cost, document checklists, shipment coordination). Bilingual (en / zh-TW), deployed at `meriqai.com`. Surfaces: the landing page and the quote-request page at `/[lang]/export-plan`. An MDX blog exists at `/[lang]/blog` but is intentionally unlisted (no nav link, not in the sitemap); the old tariff calculator was deleted.

Positioning notes: demand side = exporters (primary CTA 取得出口方案 / Get Export Plan); supply side = forwarders/carriers (quiet "Partner with us" link in the footer only — deliberately secondary). Do not use "Book Freight" wording — Meriq is not a licensed forwarder.

## Design system: light mode ONLY

Dark mode was intentionally removed. There is no ThemeProvider, no `.dark` class, no theme toggle; `globals.css` defines a single light token set (`html { color-scheme: light }`). Do not reintroduce `dark:` styling.

Visual language (Derya/YC-startup inspired, but differentiated):
- Warm-white canvas, one vivid working blue (`--primary: oklch(0.546 0.215 263)`), near-black type.
- Floating pill nav (`site-header.tsx`) with the **wordmark asset** `public/meriq-wordmark.png` (white PNG, rendered with CSS `invert` on light backgrounds), blue radial hero wash, full-bleed blue final CTA band. Footer carries the LinkedIn link (`linkedin.com/company/meriq-ai`; lucide has no brand icons — inline SVG).
- "Blueprint frame": the mid-page sections sit inside one bordered column with hatched gutters (`.hatch` utility) and `divide-y` rules — assembled in `app/[lang]/page.tsx`.
- **Animations are a feature, in Meriq's own language (trade paperwork, not app-UI cards)**: `components/visuals/hero-demo.tsx` (looping buyer-email → export-plan scene, synced via one shared duration + keyframe `times`), `paper-artifacts.tsx` (scroll-triggered stage artifacts: RFQ form, stamped quote sheet, landed-cost till receipt, doc checklist, perforated handoff stubs), `case-tracker.tsx` (shipment-tracking card cycling the five desk stages). Respect `prefers-reduced-motion` (`MotionConfig reducedMotion="user"`, `motion-reduce:animate-none`, reduced → finished state).
- Fonts: Inter → `--font-sans`, Bricolage Grotesque → `--font-display` (Latin headlines, via `font-display` class), Noto Sans TC → `--font-zh` (zh fallback), Geist Mono → `--font-mono`.

## Architecture

### i18n is the routing backbone

Every page lives under `app/[lang]/` — there is **no root `app/layout.tsx`**; `app/[lang]/layout.tsx` is the root layout (fonts, metadata).

- `lib/i18n/config.ts` — single source of truth: `locales = ["en", "zh-TW"]`, default `en`, `htmlLang` maps `zh-TW` → `zh-Hant-TW`.
- `proxy.ts` (repo root) — redirects locale-less paths via Accept-Language. Its matcher deliberately excludes `_next`, `/api`, `/ingest` (PostHog proxy), and static assets — keep those exclusions.
- **All user-facing copy** lives in `app/[lang]/dictionaries/{en,zh-TW}.json`, loaded via `getDictionary()` (`server-only`). The `Dictionary` type is inferred from `en.json`, so both files must stay structurally identical. Components receive dict slices as props; zh-TW is the copy master. Product-UI text inside vignettes is intentionally hardcoded trade English (Incoterms, doc names); `hero-demo.tsx` carries its own zh/en copy map keyed by `lang`.
- Adding a page: put it in `app/[lang]/`, add copy to both dictionaries, emit `alternates(path, lang)` from `lib/seo.ts` in `generateMetadata`, add the path to `app/sitemap.ts`.

### Pages & data flow

- **Landing** (`app/[lang]/page.tsx`) — hero + blueprint-framed sections from `components/sections/` (problem, solution, capabilities, how-it-works, use-cases, customers, pilot-offer, why-us, faq) + full-bleed final CTA; emits JSON-LD (Organization / WebSite / Service / FAQPage).
- **Lead capture** — every CTA links to `/[lang]/export-plan` (`app/[lang]/export-plan/`): a stacked form (route & terms / cargo / contact, chip selectors, paste-the-buyer's-email textarea) with a **live plan-preview sheet** that fills in as the user types. Submits to `app/api/plan/route.ts` → Supabase `export_plan_requests` insert (insert-only RLS, anon key) + best-effort Resend email; Calendly embed on success when the user opts into a call. Only destination, product, name, email are required.
- **Blog** (unlisted) — metadata registry in `lib/blog.ts` (`POSTS`); bodies at `content/blog/<slug>/<locale>.mdx` via `@next/mdx`; article typography in root `mdx-components.tsx`. Content still carries pre-pivot positioning; rewrite before re-listing.

### Analytics (PostHog)

Client init in `instrumentation-client.ts`; events reverse-proxied through `/ingest` rewrites in `next.config.ts` (why both the rewrites and `proxy.ts` special-case `/ingest`). Server client in `lib/posthog-server.ts`. Key events: `export_plan_submitted`, `get_plan_clicked`, `nav_link_clicked`, `language_switched`.

### SEO

`lib/seo.ts`: `SITE_URL` (override via `NEXT_PUBLIC_SITE_URL`), bilingual export-focused `KEYWORDS`, and `alternates()` for canonical + hreflang. `app/sitemap.ts`, `app/robots.ts`, `public/llms.txt`.

## Environment variables

`.env.local` (not committed): `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`, `RESEND_API_KEY`, `PILOT_NOTIFY_TO`, `PILOT_NOTIFY_FROM` (optional), `NEXT_PUBLIC_SITE_URL` (optional).

## Styling & UI

- **Tailwind CSS v4**, configured entirely in `app/globals.css` (no `tailwind.config`). Use semantic token classes (`bg-background`, `text-muted-foreground`, `bg-surface`) rather than raw colors.
- **shadcn/ui** config in `components.json` (style `radix-nova`, base `neutral`, icons `lucide`); add with `npx shadcn@latest add <name>` → `components/ui/`, alongside Magic UI-style primitives (`blur-fade`, `border-beam`, `scroll-progress`).
- `lib/utils.ts` exports `cn()`; compose classes via `cn(...)`. Path alias `@/*` → repo root.

## Conventions

Prettier (`.prettierrc`): **no semicolons**, double quotes, 2-space indent, `es5` trailing commas, 80-char width; the Tailwind plugin sorts classes inside `cn()`/`cva()`. Comments and copy mix English with Traditional Chinese trade vocabulary (報關, 貨代, 詢價, landed cost) — keep that where it aids precision.
