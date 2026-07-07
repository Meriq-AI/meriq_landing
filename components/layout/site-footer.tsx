import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Mail } from "lucide-react"

import { LanguageSwitcher } from "@/components/layout/language-switcher"
import { CONTACT_EMAIL, LINKEDIN_URL } from "@/lib/seo"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/app/[lang]/dictionaries"

/* lucide removed brand icons — inline LinkedIn mark. */
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  )
}

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
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href={`/${lang}`}
              className="inline-flex items-center"
              aria-label="Meriq home"
            >
              <Image
                src="/meriq-wordmark.png"
                alt="MERIQ AI"
                width={680}
                height={93}
                className="h-4 w-auto invert"
                quality={100}
                unoptimized
              />
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {footer.tagline}
            </p>

            <div className="mt-5 flex flex-col gap-2.5">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="size-4" />
                {footer.contact}: {CONTACT_EMAIL}
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <LinkedInIcon className="size-4" />
                LinkedIn
              </a>
            </div>
          </div>

          {/* Supply side: quiet, deliberately secondary to the exporter CTA. */}
          <div className="rounded-2xl border border-border bg-card/60 p-5 sm:max-w-xs">
            <p className="text-sm text-muted-foreground">
              {footer.partnerLead}
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                "Logistics partner — Meriq"
              )}`}
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              {footer.partnerCta}
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>

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
