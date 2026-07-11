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

The Meriq marketing site: **AI 作業工作流 for small/mid-sized Taiwanese freight forwarders (5–50 人)** (ICP wording everywhere: 台灣中小型 freight forwarder; en "AI operations workflow") — reads 詢價信 and shipping docs, drafts 報價單, fills S/O, cross-checks CI/PL/提單/報單, prepares bilingual replies; people only handle exceptions; nothing to replace. Built with a 43-year 報關 team. Bilingual (zh-TW default / en), deployed at `meriqai.com`. Surfaces: the landing page and the demo-booking page at `/[lang]/demo` (`/export-plan` and `/tariff` 301 to their successors). An MDX blog exists at `/[lang]/blog` but is intentionally unlisted (no nav link, not in the sitemap).

Positioning notes: demand side = forwarders (CTA ladder: header/hero 預約合作討論 / Book an intro call → 申請成為早期合作夥伴 inside the Early Partner Program section). Meriq is not a licensed forwarder and does not file customs entries. Tone rules: no 賦能/顛覆/革命; every claim hangs on a concrete document or action (繕打, 核對, pre-alert); trade jargon stays English (S/O, pre-alert, HB/L, CI/PL). Sections in order (deliberately few — founding-sales trim, 2026-07: how-it-works, the 快準不加人 values section, and the 痛點 pain cards were all cut as redundant/off-wedge; don't reintroduce without a reason): hero (CTAs: 預約合作討論 / 查看運作方式) / **Meriq Quote Agent product section** (`#quote` — the first sales wedge: 詢價 Email → 報價草稿 → 人工確認; three numbered workflow blocks — annotated inquiry email, lane rate card, stamped quotation sheet — joined by a dashed route line; deliberately narrow, explicitly no TMS write-back and no auto-send) / **我們相信 belief manifesto** (dark rounded grainy stage with per-paragraph scroll reveals — replaces pain cards until real pilot numbers earn a results section) / **Early Partner Program** (`#proof` — identity framing, not beta-testing: membership plate 01/05, four partner rights, founder-led onboarding; CTA ladder is header/hero 預約合作討論 → in-section 申請成為早期合作夥伴; testimonial cards gated by `proof.testimonialsEnabled` until real numbers exist) / FAQ (7 pilot-objection items, answers carry \n\n paragraph breaks). (The photo final-CTA band was removed 2026-07; `public/media/port-hero.jpg` remains in use by the Solutions menu thumbnail.) Header has a Raft-style Solutions mega-menu (available-now vs roadmap columns).

## Design system: light mode ONLY

Dark mode was intentionally removed. There is no ThemeProvider, no `.dark` class, no theme toggle; `globals.css` defines a single light token set (`html { color-scheme: light }`). Do not reintroduce `dark:` styling.

Visual language (Reform/Dia/Raft-inspired, but differentiated):
- Warm-white canvas, near-black type, cyan family: `--primary` = #06b6d4 (oklch 0.715 0.143 215) **with ink `--primary-foreground`** (never white-on-cyan), `--color-primary-strong` (cyan-700) for small text accents on light bg, `--color-verify` (cyan-300) as the document-highlighter token (artifact field marks, ::selection).
- Floating pill nav (`site-header.tsx`) with the silver **mark** `public/meriq-mark.png` (colored, no invert) before the **wordmark** `public/meriq-wordmark.png` (white PNG, CSS `invert` on light backgrounds). Language switcher labels: EN / zh-TW. Footer carries the LinkedIn link (`linkedin.com/company/meriq-ai`; lucide has no brand icons — inline SVG).
- Hero is a Raft-style **full-viewport rounded card** (`min-h-[calc(100svh-1.5rem)]`, rounded-[2.5rem]) with cyan radial wash + Magic UI `noise-texture` (vendored in `components/ui/`); the 我們相信 belief block is the same rounded grainy stage inverted to ink, with per-paragraph scroll reveals. Mid-page sections stack full-width with no frame (hatch gutters and the bordered column were removed by request — don't reintroduce). `public/media/port-hero.jpg` (Pexels #906982, free commercial license) is used by the Solutions menu thumbnail.
- **Animations are a feature, in Meriq's own language (trade paperwork, not app-UI cards)**: `components/visuals/hero-demo.tsx` (looping 詢價信+CI/PL → worked shipment-file scene, synced via one shared duration + keyframe `times`; rendered inside the QuotePrep section). Respect `prefers-reduced-motion` (`MotionConfig reducedMotion="user"`, `motion-reduce:animate-none`, reduced → finished state).
- Fonts: Inter → `--font-sans`, Bricolage Grotesque → `--font-display` (Latin headlines, via `font-display` class), Noto Sans TC → `--font-zh` (zh fallback), Geist Mono → `--font-mono`.

## Architecture

### i18n is the routing backbone

Every page lives under `app/[lang]/` — there is **no root `app/layout.tsx`**; `app/[lang]/layout.tsx` is the root layout (fonts, metadata).

- `lib/i18n/config.ts` — single source of truth: `locales = ["en", "zh-TW"]`, default `zh-TW` (also the hreflang/sitemap x-default), `htmlLang` maps `zh-TW` → `zh-Hant-TW`.
- `proxy.ts` (repo root) — redirects locale-less paths via Accept-Language. Its matcher deliberately excludes `_next`, `/api`, `/ingest` (PostHog proxy), and static assets — keep those exclusions.
- **All user-facing copy** lives in `app/[lang]/dictionaries/{en,zh-TW}.json`, loaded via `getDictionary()` (`server-only`). The `Dictionary` type is inferred from `en.json`, so both files must stay structurally identical. Components receive dict slices as props; zh-TW is the copy master. Product-UI text inside vignettes is intentionally hardcoded trade English (Incoterms, doc names); `hero-demo.tsx` carries its own zh/en copy map keyed by `lang`.
- Adding a page: put it in `app/[lang]/`, add copy to both dictionaries, emit `alternates(path, lang)` from `lib/seo.ts` in `generateMetadata`, add the path to `app/sitemap.ts`.

### Pages & data flow

- **Landing** (`app/[lang]/page.tsx`) — sections from `components/sections/` (hero, belief, quote-prep, proof, faq); emits JSON-LD (Organization / WebSite / Service / FAQPage).
- **Lead capture** — every CTA links to `/[lang]/demo` (`app/[lang]/demo/`, framed as 預約合作討論): a lean forwarder-qualification form (company / role chips / monthly-shipment-volume chips / current system). Submits to `app/api/demo/route.ts` → Supabase `demo_requests` insert (insert-only RLS, anon key) + best-effort Resend email; booking link always shown on success. Only company, name, email are required. The old `export_plan_requests` table remains as historical lead data.
- **Blog** (unlisted) — metadata registry in `lib/blog.ts` (`POSTS`); bodies at `content/blog/<slug>/<locale>.mdx` via `@next/mdx`; article typography in root `mdx-components.tsx`. Content still carries pre-pivot positioning; rewrite before re-listing.

### Analytics (PostHog)

Client init in `instrumentation-client.ts`; events reverse-proxied through `/ingest` rewrites in `next.config.ts` (why both the rewrites and `proxy.ts` special-case `/ingest`). Server client in `lib/posthog-server.ts`. Key events: `demo_requested`, `book_demo_clicked`, `nav_link_clicked`, `language_switched` (pre-pivot dashboards used `export_plan_submitted`/`get_plan_clicked` — annotate, don't alias).

### SEO

`lib/seo.ts`: `SITE_URL` (override via `NEXT_PUBLIC_SITE_URL`), bilingual forwarder-automation `KEYWORDS`, and `alternates()` for canonical + hreflang. `app/sitemap.ts`, `app/robots.ts`, `public/llms.txt`.

## Environment variables

`.env.local` (not committed): `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`, `RESEND_API_KEY`, `PILOT_NOTIFY_TO`, `PILOT_NOTIFY_FROM` (optional), `NEXT_PUBLIC_SITE_URL` (optional).

## Styling & UI

- **Tailwind CSS v4**, configured entirely in `app/globals.css` (no `tailwind.config`). Use semantic token classes (`bg-background`, `text-muted-foreground`, `bg-surface`) rather than raw colors.
- **shadcn/ui** config in `components.json` (style `radix-nova`, base `neutral`, icons `lucide`); add with `npx shadcn@latest add <name>` → `components/ui/`, alongside Magic UI-style primitives (`blur-fade`, `border-beam`, `scroll-progress`).
- `lib/utils.ts` exports `cn()`; compose classes via `cn(...)`. Path alias `@/*` → repo root.

## Conventions

Prettier (`.prettierrc`): **no semicolons**, double quotes, 2-space indent, `es5` trailing commas, 80-char width; the Tailwind plugin sorts classes inside `cn()`/`cva()`. Comments and copy mix English with Traditional Chinese trade vocabulary (報關, 貨代, 詢價, landed cost) — keep that where it aids precision.
