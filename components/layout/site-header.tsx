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
import { ApplyPilotDialog } from "@/components/apply-pilot-dialog"
import { LanguageSwitcher } from "./language-switcher"
import { ThemeToggle } from "./theme-toggle"

export function SiteHeader({
  lang,
  nav,
  pilot,
}: {
  lang: Locale
  nav: Dictionary["nav"]
  pilot: Dictionary["pilot"]
}) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Absolute targets so the nav works from any route (e.g. blog pages), not
  // just the landing page. "Vision" is the blog.
  const links = [
    { href: `/${lang}#how`, label: nav.how },
    { href: `/${lang}/blog`, label: nav.vision },
  ]

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-md"
          : "border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between gap-4 px-6">
        <Link
          href={`/${lang}`}
          className="flex items-center gap-2.5"
          aria-label="Meriq home"
        >
          <Image
            src="/meriq-mark.png"
            alt=""
            width={34}
            height={34}
            className="size-[34px]"
            quality={100}
            unoptimized
            priority
          />
          <span className="text-2xl font-semibold tracking-tight">Meriq</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
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
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher current={lang} className="hidden sm:inline-flex" />
          <ThemeToggle />
          <ApplyPilotDialog pilot={pilot} lang={lang} location="header">
            <Button size="sm" className="hidden sm:inline-flex">
              {pilot.cta}
            </Button>
          </ApplyPilotDialog>
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
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
        <div className="border-t border-border bg-background/95 backdrop-blur-md md:hidden">
          <nav className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-6 py-4">
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
                className="rounded-md px-3 py-2.5 text-sm text-foreground/90 hover:bg-accent"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-3">
              {/* Opens over the menu (doesn't close it, so the dialog stays mounted). */}
              <ApplyPilotDialog
                pilot={pilot}
                lang={lang}
                location="header_mobile"
              >
                <Button size="sm" className="w-full">
                  {pilot.cta}
                </Button>
              </ApplyPilotDialog>
              <LanguageSwitcher current={lang} />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
