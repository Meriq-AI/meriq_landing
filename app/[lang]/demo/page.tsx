import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config"
import { alternates } from "@/lib/seo"
import { getDictionary } from "../dictionaries"
import { DemoForm } from "./demo-form"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const locale: Locale = isLocale(lang) ? lang : defaultLocale
  const dict = await getDictionary(locale)
  return {
    title: dict.demo.metaTitle,
    description: dict.demo.metaDescription,
    alternates: alternates("/demo", locale),
  }
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()

  const dict = await getDictionary(lang)

  return (
    <>
      <SiteHeader lang={lang} nav={dict.nav} cta={dict.demo.cta} />
      <main className="relative overflow-hidden">
        {/* Same blue wash language as the landing hero, quieter */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(90%_100%_at_50%_-20%,oklch(0.546_0.215_263/0.12)_0%,transparent_70%)]"
        />
        <div className="mx-auto w-full max-w-6xl px-6 pt-32 sm:pt-36">
          {/* DemoForm renders the page heading itself so the success screen
              can replace it. */}
          <DemoForm demo={dict.demo} lang={lang} />
        </div>
      </main>
      <SiteFooter lang={lang} footer={dict.footer} />
    </>
  )
}
