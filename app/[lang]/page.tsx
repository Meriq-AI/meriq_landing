import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ScrollProgress } from "@/components/ui/scroll-progress"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { Hero } from "@/components/sections/hero"
import { Belief } from "@/components/sections/belief"
import { QuotePrep } from "@/components/sections/quote-prep"
import { Proof } from "@/components/sections/proof"
import { Faq } from "@/components/sections/faq"
import {
  defaultLocale,
  htmlLang,
  isLocale,
  type Locale,
} from "@/lib/i18n/config"
import { alternates, SITE_URL } from "@/lib/seo"
import { getDictionary } from "./dictionaries"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const locale: Locale = isLocale(lang) ? lang : defaultLocale
  return { alternates: alternates("", locale) }
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()

  const dict = await getDictionary(lang)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Meriq",
        url: SITE_URL,
        logo: `${SITE_URL}/meriq-mark.png`,
        description: dict.meta.description,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Meriq",
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: htmlLang[lang],
      },
      {
        "@type": "Service",
        name: "Meriq Quote Agent",
        serviceType:
          "AI quote preparation for freight forwarders: inquiry-email intake, rate structuring, quote drafting with human confirmation",
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: "TW",
        url: `${SITE_URL}/${lang}#quote`,
        description: dict.quotePrep.sub,
        audience: {
          "@type": "Audience",
          audienceType:
            "Small and mid-sized freight forwarders (5–50 staff)",
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/${lang}#faq`,
        mainEntity: dict.faq.items.map((it) => ({
          "@type": "Question",
          name: it.q,
          acceptedAnswer: { "@type": "Answer", text: it.a },
        })),
      },
    ],
  }

  return (
    <>
      {/* JSON-LD: trusted, server-built (no user input); `<` escaped for safety. */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd).replace(/</g, "\\u003c")}
      </script>
      <ScrollProgress className="z-[60] h-0.5 bg-primary" />
      <SiteHeader
        lang={lang}
        nav={dict.nav}
        solutions={dict.solutions}
        cta={dict.demo.cta}
      />
      <main>
        <Hero hero={dict.hero} lang={lang} />
        <QuotePrep quotePrep={dict.quotePrep} lang={lang} />
        <Belief belief={dict.belief} />
        <Proof proof={dict.proof} lang={lang} />
        <Faq faq={dict.faq} />
      </main>
      <SiteFooter lang={lang} footer={dict.footer} />
    </>
  )
}
