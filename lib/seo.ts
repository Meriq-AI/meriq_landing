import type { Metadata } from "next"

import { htmlLang, locales, type Locale } from "@/lib/i18n/config"

/** Production origin. Override with NEXT_PUBLIC_SITE_URL on the deploy host. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://meriqai.com"
).replace(/\/$/, "")

export const SITE_NAME = "Meriq"

// Single source of truth for contact/booking surfaces (footer, final CTA,
// export-plan form) — these drifted when duplicated per-file.
export const CONTACT_EMAIL = "justinli@meriqai.com"
export const BOOKING_URL = "https://calendar.app.google/YwUWhSyPuiBRTf4N6"
export const LINKEDIN_URL = "https://www.linkedin.com/company/meriq-ai"

export const ogLocale: Record<Locale, string> = {
  en: "en_US",
  "zh-TW": "zh_TW",
}

// Search terms relevant people would use to find this kind of product.
export const KEYWORDS = [
  "AI export operator",
  "export RFQ",
  "freight quote comparison",
  "landed cost calculator",
  "export documentation checklist",
  "Incoterms CIF DAP DDP quote",
  "export operations for manufacturers",
  "Taiwan export logistics",
  "HS code classification",
  "出口報價",
  "海外詢價",
  "貨代報價比較",
  "landed cost 計算",
  "出口文件",
  "出口關稅查詢",
  "國際運費估算",
  "台灣製造商出口",
]

/**
 * Canonical + hreflang alternates for a locale-agnostic path:
 * "" → home, "/blog", "/blog/vision".
 */
export function alternates(path: string, lang: Locale): Metadata["alternates"] {
  const languages: Record<string, string> = {}
  for (const l of locales) languages[htmlLang[l]] = `${SITE_URL}/${l}${path}`
  languages["x-default"] = `${SITE_URL}/en${path}`
  return { canonical: `${SITE_URL}/${lang}${path}`, languages }
}
