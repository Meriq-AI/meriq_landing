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

There is no test runner configured.

## Critical: Next.js version

This is **Next.js 16** with **React 19** — a version with breaking changes from older Next.js. Per `AGENTS.md`, before writing Next.js-specific code, read the relevant guide under `node_modules/next/dist/docs/` (`01-app`, `02-pages`, `03-architecture`) and heed deprecation notices. Do not assume APIs/conventions from older Next.js.

## Architecture

A landing-site scaffold built on the App Router with shadcn/ui. Currently minimal — `app/page.tsx` is a placeholder; most of `components/`, `hooks/`, `lib/` are empty (`.gitkeep`).

- **`app/`** — App Router. `layout.tsx` is the root: loads fonts (`Inter` → `--font-sans`, `Geist_Mono` → `--font-mono`) and wraps children in `ThemeProvider`. `globals.css` is the single source of design tokens.
- **`components/`** — `ui/` holds shadcn primitives; app components go at the top level. `theme-provider.tsx` wraps `next-themes` and also registers a global **`d` hotkey** that toggles dark mode (ignored while typing in inputs).
- **`lib/utils.ts`** — `cn()` (clsx + tailwind-merge) for class composition. The convention everywhere is to compose classes via `cn(...)`.
- **`hooks/`** — custom React hooks.

Path alias: `@/*` maps to the repo root (e.g. `@/components/ui/button`, `@/lib/utils`).

## Styling & UI

- **Tailwind CSS v4**, configured entirely in `app/globals.css` (no `tailwind.config`). PostCSS via `@tailwindcss/postcss`. CSS imports include `tailwindcss`, `tw-animate-css`, and `shadcn/tailwind.css`.
- Theming uses CSS variables defined in `globals.css` and mapped under `@theme inline` (e.g. `--color-primary`, `--color-muted-foreground`). Use the semantic token classes (`bg-background`, `text-muted-foreground`, etc.) rather than raw colors. Dark mode is the `.dark` class variant (driven by `next-themes`).
- **shadcn/ui** config in `components.json`: style `radix-nova`, base color `neutral`, RSC enabled, icon library `lucide`. Add components with `npx shadcn@latest add <name>` — they land in `components/ui/`.

## Conventions

Prettier (`.prettierrc`) enforces: **no semicolons**, double quotes, 2-space indent, `es5` trailing commas, 80-char width. The Tailwind plugin auto-sorts classes and is configured to sort inside `cn()` and `cva()` calls. Match this style in new code.
