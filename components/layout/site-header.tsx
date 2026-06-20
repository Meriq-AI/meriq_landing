"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/app/[lang]/dictionaries"
import { LanguageSwitcher } from "./language-switcher"
import { ThemeToggle } from "./theme-toggle"

export const BOOK_CALL_HREF = "#book"

export function SiteHeader({
  lang,
  nav,
}: {
  lang: Locale
  nav: Dictionary["nav"]
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
    { href: `/${lang}#roles`, label: nav.roles },
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
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher current={lang} className="hidden sm:inline-flex" />
          <ThemeToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <a href={`/${lang}${BOOK_CALL_HREF}`}>{nav.bookCall}</a>
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            aria-label={open ? nav.closeMenu : nav.openMenu}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
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
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm text-foreground/90 hover:bg-accent"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex items-center justify-between gap-3">
              <LanguageSwitcher current={lang} />
              <Button asChild size="sm" className="flex-1">
                <a href={`/${lang}${BOOK_CALL_HREF}`} onClick={() => setOpen(false)}>
                  {nav.bookCall}
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
