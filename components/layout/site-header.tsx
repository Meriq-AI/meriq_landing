"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, Menu, X } from "lucide-react"
import posthog from "posthog-js"

import { Button } from "@/components/ui/button"
import { NoiseTexture } from "@/components/ui/noise-texture"
import { cn } from "@/lib/utils"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/app/[lang]/dictionaries"
import { LanguageSwitcher } from "./language-switcher"

/**
 * Raft-style solutions mega-menu: photo thumbnail on the left, "available
 * now" links and a muted roadmap column on the right. Hover-opened on
 * desktop; the mobile menu stays a flat list.
 */
function SolutionsMenu({
  lang,
  solutions,
}: {
  lang: Locale
  solutions: Dictionary["solutions"]
}) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition-colors",
          open
            ? "bg-accent text-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        )}
      >
        {solutions.trigger}
        <ChevronDown
          className={cn("size-3.5 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3">
          {/* grainy gradient panel — same atmosphere language as the hero card */}
          <div className="relative w-[520px] overflow-hidden rounded-2xl border border-border/70 bg-surface p-4 shadow-xl shadow-foreground/[0.1]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_85%_at_100%_120%,oklch(0.865_0.127_207/0.4)_0%,oklch(0.88_0.09_215/0.15)_45%,transparent_70%)]"
            />
            <NoiseTexture
              frequency={0.55}
              slope={0.12}
              className="opacity-25 [mask-image:radial-gradient(95%_95%_at_70%_80%,white_10%,transparent_100%)]"
            />
            <div className="relative grid grid-cols-[9rem_1fr_1fr] gap-5">
              {/* photo thumb, same freight imagery as the closing band */}
              <div className="relative overflow-hidden rounded-xl">
                <Image
                  src="/media/port-hero.jpg"
                  alt=""
                  fill
                  sizes="9rem"
                  className="object-cover"
                  unoptimized
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[linear-gradient(200deg,oklch(0.865_0.127_207/0.25)_0%,oklch(0.30_0.06_227/0.35)_100%)]"
                />
              </div>

              <div>
                <p className="font-mono text-[10px] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
                  {solutions.nowLabel}
                </p>
                <ul className="mt-3 space-y-2">
                  {solutions.now.map((item) => (
                    <li key={item.title}>
                      <a
                        href={`/${lang}${item.href}`}
                        onClick={() => {
                          setOpen(false)
                          posthog.capture("nav_link_clicked", {
                            label: item.title,
                            href: item.href,
                            lang,
                            menu: "solutions",
                          })
                        }}
                        className="group block rounded-lg border border-border/80 bg-card px-3 py-2.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md hover:shadow-primary/10"
                      >
                        <p className="text-sm font-semibold tracking-tight transition-colors group-hover:text-primary-strong">
                          {item.title}
                        </p>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-mono text-[10px] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
                  {solutions.roadmapLabel}
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  {solutions.roadmap.map((item) => (
                    <div
                      key={item}
                      className="rounded-lg border border-border/80 bg-card px-3 py-2.5 text-sm font-medium text-foreground/75 shadow-sm"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/** Floating pill nav: a rounded white bar hovering over the page. */
export function SiteHeader({
  lang,
  nav,
  solutions,
  cta,
}: {
  lang: Locale
  nav: Dictionary["nav"]
  solutions: Dictionary["solutions"]
  cta: string
}) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Absolute targets so the nav works from any route, not just the landing.
  const links = [
    { href: `/${lang}#quote`, label: nav.product },
    { href: `/${lang}#proof`, label: nav.proof },
    { href: `/${lang}#faq`, label: nav.faq },
  ]
  // Desktop: the product link lives inside the solutions menu instead.
  const desktopLinks = links.filter((l) => l.label !== nav.product)

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-6">
      <div
        className={cn(
          "mx-auto w-full max-w-4xl rounded-4xl border bg-card/90 backdrop-blur-md transition-shadow duration-300",
          scrolled
            ? "border-border shadow-lg shadow-foreground/[0.06]"
            : "border-border/70 shadow-md shadow-foreground/[0.04]"
        )}
      >
        <div className="flex h-14 items-center justify-between gap-3 pr-2.5 pl-5">
          <Link
            href={`/${lang}`}
            className="flex items-center gap-2"
            aria-label="Meriq home"
          >
            {/* Silver-navy mark keeps its own colors; wordmark is a white
                asset, inverted for the light theme. */}
            <Image
              src="/meriq-mark.png"
              alt=""
              width={256}
              height={256}
              className="size-6"
              quality={100}
              unoptimized
              priority
            />
            <Image
              src="/meriq-wordmark.png"
              alt="MERIQ AI"
              width={680}
              height={93}
              className="h-[17px] w-auto invert"
              quality={100}
              unoptimized
              priority
            />
          </Link>

          <nav className="hidden items-center gap-0.5 md:flex">
            <SolutionsMenu lang={lang} solutions={solutions} />
            {desktopLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() =>
                  posthog.capture("nav_link_clicked", {
                    label: link.label,
                    href: link.href,
                    lang,
                  })
                }
                className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <LanguageSwitcher
              current={lang}
              className="hidden sm:inline-flex"
            />
            <Button
              size="sm"
              className="hidden rounded-full sm:inline-flex"
              asChild
            >
              <Link
                href={`/${lang}/demo`}
                onClick={() =>
                  posthog.capture("book_demo_clicked", {
                    location: "header",
                    lang,
                  })
                }
              >
                {cta}
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-full md:hidden"
              aria-label={open ? nav.closeMenu : nav.openMenu}
              aria-expanded={open}
              onClick={() => {
                const next = !open
                setOpen(next)
                if (next) posthog.capture("mobile_menu_opened", { lang })
              }}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>

        {open && (
          <nav className="flex flex-col gap-1 border-t border-border px-3 py-3 md:hidden">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => {
                  setOpen(false)
                  posthog.capture("nav_link_clicked", {
                    label: link.label,
                    href: link.href,
                    lang,
                    mobile: true,
                  })
                }}
                className="rounded-xl px-3 py-2.5 text-sm text-foreground/90 hover:bg-accent"
              >
                {link.label}
              </a>
            ))}
            {/* CTA + compact language pill share one row — the switcher must
                not stretch full-width (it reads as a broken input) */}
            <div className="mt-2 flex items-center gap-2.5 px-1 pb-1">
              <Button size="sm" className="flex-1 rounded-full" asChild>
                <Link
                  href={`/${lang}/demo`}
                  onClick={() => {
                    setOpen(false)
                    posthog.capture("book_demo_clicked", {
                      location: "header_mobile",
                      lang,
                    })
                  }}
                >
                  {cta}
                </Link>
              </Button>
              <LanguageSwitcher current={lang} className="shrink-0" />
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
