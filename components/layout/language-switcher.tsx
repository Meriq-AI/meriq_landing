"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { locales, localeLabels, isLocale, type Locale } from "@/lib/i18n/config"

function swapLocale(pathname: string, next: Locale): string {
  const segments = pathname.split("/")
  // segments[0] is "" (leading slash); segments[1] is the current locale
  if (segments.length > 1 && isLocale(segments[1])) {
    segments[1] = next
  } else {
    segments.splice(1, 0, next)
  }
  return segments.join("/") || `/${next}`
}

export function LanguageSwitcher({
  current,
  className,
}: {
  current: Locale
  className?: string
}) {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-card/60 p-0.5",
        className
      )}
      role="group"
      aria-label="Language"
    >
      {locales.map((locale) => {
        const active = locale === current
        return (
          <Link
            key={locale}
            href={swapLocale(pathname, locale)}
            aria-current={active ? "true" : undefined}
            className={cn(
              "rounded-full px-2.5 py-1 font-mono text-xs font-medium transition-colors",
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {localeLabels[locale]}
          </Link>
        )
      })}
    </div>
  )
}
