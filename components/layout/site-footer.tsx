import Image from "next/image"
import Link from "next/link"
import { Mail } from "lucide-react"

import { LanguageSwitcher } from "@/components/layout/language-switcher"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/app/[lang]/dictionaries"

const CONTACT_EMAIL = "justinli@meriqai.com"

export function SiteFooter({
  lang,
  footer,
}: {
  lang: Locale
  footer: Dictionary["footer"]
}) {
  return (
    <footer className="relative overflow-hidden px-6">
      {/* Oversized brand watermark, like Halo's footer. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-[28%] text-center text-[24vw] leading-[0.8] font-semibold tracking-tight text-foreground/[0.04] select-none"
      >
        Meriq
      </span>

      <div className="relative mx-auto w-full max-w-6xl py-16">
        <Link
          href={`/${lang}`}
          className="flex items-center gap-2.5"
          aria-label="Meriq home"
        >
          <Image
            src="/meriq-mark.png"
            alt=""
            width={30}
            height={30}
            className="size-[30px]"
            quality={100}
            unoptimized
          />
          <span className="text-2xl font-semibold tracking-tight">Meriq</span>
        </Link>

        <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {footer.tagline}
        </p>

        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Mail className="size-4" />
          {footer.contact}: {CONTACT_EMAIL}
        </a>

        <div className="mt-14 flex flex-col-reverse items-start gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Meriq AI. {footer.rights}
          </p>
          <LanguageSwitcher current={lang} />
        </div>
      </div>
    </footer>
  )
}
