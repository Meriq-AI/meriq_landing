import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { htmlLang, isLocale, type Locale } from "@/lib/i18n/config"
import { alternates, SITE_URL } from "@/lib/seo"
import { getDictionary } from "../dictionaries"
import { TariffSimulator } from "./tariff-simulator"

const TARIFF_DESCRIPTION =
  "線上試算台灣進口關稅、貨物稅與營業稅:輸入 CCC 號列即可估算總稅費與落地成本,並帶出該號列的輸入規定與簽審。資料取自財政部關務署,僅供估算,以海關核定為準。"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const locale: Locale = isLocale(lang) ? lang : "en"
  // Plain string title so the root layout's "%s · Meriq" template applies once
  // (avoids the doubled brand a hard-coded "… | Meriq" would produce).
  return {
    title: "進口關稅試算・CCC 號列稅費與落地成本估算",
    description: TARIFF_DESCRIPTION,
    alternates: alternates("/tariff", locale),
  }
}

export default async function TariffPage({
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
        "@type": "WebApplication",
        name: "進口關稅試算",
        url: `${SITE_URL}/${lang}/tariff`,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        inLanguage: htmlLang[lang],
        description: TARIFF_DESCRIPTION,
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "TWD" },
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Meriq",
            item: `${SITE_URL}/${lang}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "進口關稅試算",
            item: `${SITE_URL}/${lang}/tariff`,
          },
        ],
      },
    ],
  }

  return (
    <>
      {/* JSON-LD: trusted, server-built (no user input); `<` escaped for safety. */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd).replace(/</g, "\\u003c")}
      </script>
      <SiteHeader lang={lang} nav={dict.nav} pilot={dict.pilot} />
      <main className="mx-auto max-w-5xl px-4 pt-28 pb-16 sm:px-6">
        <div className="mb-6 max-w-2xl sm:mb-8">
          <h1 className="text-[26px] font-semibold tracking-tight text-foreground sm:text-[30px]">
            進口稅費試算
          </h1>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            輸入 CCC 號列,估算進口
            <span className="text-foreground">關稅、貨物稅、營業稅</span>
            與落地成本,並帶出該號列的
            <span className="text-foreground">輸入規定 / 簽審</span>。
          </p>
        </div>

        <TariffSimulator lang={lang} />

        <p className="mt-6 text-[12px] leading-relaxed text-muted-foreground/70">
          稅率與輸入規定取自財政部關務署開放資料(海關進口稅則
          #80871、輸入規定代號 #16519)。本試算
          <span className="text-muted-foreground">僅供參考</span>
          ,實際稅則歸列與稅費以海關核定為準。
        </p>
      </main>
      <SiteFooter lang={lang} footer={dict.footer} />
    </>
  )
}
