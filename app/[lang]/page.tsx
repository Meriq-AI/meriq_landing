import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ScrollProgress } from "@/components/ui/scroll-progress"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { Hero } from "@/components/sections/hero"
import { HiddenCost } from "@/components/sections/hidden-cost"
import { HowItWorks } from "@/components/sections/how-it-works"
import { Faq } from "@/components/sections/faq"
import { PilotCta } from "@/components/sections/pilot-cta"
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
        "@type": "SoftwareApplication",
        name: "Meriq",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: `${SITE_URL}/${lang}`,
        description: dict.meta.description,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          description: "Pilot for design partners",
        },
        audience: {
          "@type": "Audience",
          audienceType:
            "Customs brokers, freight forwarders, and trade operations teams",
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
      <SiteHeader lang={lang} nav={dict.nav} pilot={dict.pilot} />
      <main>
        <Hero
          hero={dict.hero}
          lang={lang}
          pilot={dict.pilot}
          watch={dict.watch}
        />
        <HiddenCost hiddenCost={dict.hiddenCost} />
        <HowItWorks howItWorks={dict.howItWorks} />
        <Faq faq={dict.faq} />
        <PilotCta pilotCta={dict.pilotCta} pilot={dict.pilot} lang={lang} />
      </main>
      <SiteFooter lang={lang} footer={dict.footer} />
    </>
  )
}
