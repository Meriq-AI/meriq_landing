import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ScrollProgress } from "@/components/ui/scroll-progress"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { Hero } from "@/components/sections/hero"
import { Problem } from "@/components/sections/problem"
import { Solution } from "@/components/sections/solution"
import { Capabilities } from "@/components/sections/capabilities"
import { HowItWorks } from "@/components/sections/how-it-works"
import { UseCases } from "@/components/sections/use-cases"
import { Customers } from "@/components/sections/customers"
import { PilotOffer } from "@/components/sections/pilot-offer"
import { WhyUs } from "@/components/sections/why-us"
import { FinalCta } from "@/components/sections/final-cta"
import { Faq } from "@/components/sections/faq"
import { htmlLang, isLocale, type Locale } from "@/lib/i18n/config"
import { alternates, SITE_URL } from "@/lib/seo"
import { getDictionary } from "./dictionaries"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const locale: Locale = isLocale(lang) ? lang : "en"
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
        name: "Meriq Export Desk",
        serviceType:
          "Export operations: freight quote comparison, landed cost estimation, export documentation review, shipment coordination",
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: "TW",
        url: `${SITE_URL}/${lang}`,
        description: dict.meta.description,
        audience: {
          "@type": "Audience",
          audienceType:
            "Taiwanese manufacturers, exporters, and trading companies",
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
      <SiteHeader lang={lang} nav={dict.nav} cta={dict.demo.cta} />
      <main>
        <Hero hero={dict.hero} lang={lang} cta={dict.demo.cta} />

        {/* Blueprint frame (Derya-style): one bordered column with hatched
            rails; divide-y draws the rule between each section. */}
        <div className="px-3 sm:px-6">
          <div className="relative mx-auto w-full max-w-6xl">
            <div
              aria-hidden
              className="hatch pointer-events-none absolute inset-y-0 -left-7 hidden w-6 xl:block"
            />
            <div
              aria-hidden
              className="hatch pointer-events-none absolute inset-y-0 -right-7 hidden w-6 xl:block"
            />
            <div className="divide-y divide-border border-x border-t border-border">
              <Problem problem={dict.problem} />
              <Solution solution={dict.solution} />
              <Capabilities capabilities={dict.capabilities} lang={lang} />
              <HowItWorks howItWorks={dict.howItWorks} lang={lang} />
              <UseCases useCases={dict.useCases} />
              <Customers customers={dict.customers} />
              <PilotOffer pilotOffer={dict.pilotOffer} lang={lang} />
              <WhyUs whyUs={dict.whyUs} />
              <Faq faq={dict.faq} />
            </div>
          </div>
        </div>

        <FinalCta finalCta={dict.finalCta} lang={lang} />
      </main>
      <SiteFooter lang={lang} footer={dict.footer} />
    </>
  )
}
