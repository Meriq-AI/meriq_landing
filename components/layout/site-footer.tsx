import Image from "next/image"
import Link from "next/link"

import { LanguageSwitcher } from "@/components/layout/language-switcher"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/app/[lang]/dictionaries"

export function SiteFooter({
  lang,
  footer,
  nav,
}: {
  lang: Locale
  footer: Dictionary["footer"]
  nav: Dictionary["nav"]
}) {
  const columns = [
    {
      label: footer.productLabel,
      links: [
        { href: `/${lang}#how`, label: nav.how },
        { href: `/${lang}#roles`, label: nav.roles },
      ],
    },
    {
      label: footer.resourcesLabel,
      links: [
        { href: `/${lang}/blog`, label: nav.vision },
        { href: `/${lang}#book`, label: nav.bookCall },
      ],
    },
  ]

  return (
    <footer className="px-6">
      <div className="mx-auto w-full max-w-6xl py-14">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <Link
              href={`/${lang}`}
              className="flex items-center gap-2.5"
              aria-label="Meriq home"
            >
              <Image
                src="/meriq-mark.png"
                alt=""
                width={28}
                height={28}
                className="size-7"
                quality={100}
                unoptimized
              />
              <span className="text-lg font-semibold tracking-tight">Meriq</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {footer.tagline}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            {columns.map((col) => (
              <div key={col.label}>
                <p className="font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
                  {col.label}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col-reverse items-start gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Meriq AI · {footer.rights}
          </p>
          <LanguageSwitcher current={lang} />
        </div>
      </div>
    </footer>
  )
}
