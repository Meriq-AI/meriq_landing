"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import posthog from "posthog-js"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/app/[lang]/dictionaries"
import { LanguageSwitcher } from "./language-switcher"

/** Floating pill nav: a rounded white bar hovering over the page. */
export function SiteHeader({
  lang,
  nav,
  cta,
}: {
  lang: Locale
  nav: Dictionary["nav"]
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
    { href: `/${lang}#how`, label: nav.how },
    { href: `/${lang}#use-cases`, label: nav.useCases },
    { href: `/${lang}#faq`, label: nav.faq },
  ]

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
            className="flex items-center"
            aria-label="Meriq home"
          >
            {/* White wordmark asset, inverted for the light theme. */}
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
            {links.map((link) => (
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
            <div className="mt-2 flex flex-col gap-3 px-1 pb-1">
              <Button size="sm" className="w-full rounded-full" asChild>
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
              <LanguageSwitcher current={lang} />
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
