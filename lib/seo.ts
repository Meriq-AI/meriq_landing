import type { Metadata } from "next"

import { defaultLocale, htmlLang, locales, type Locale } from "@/lib/i18n/config"

/** Production origin. Override with NEXT_PUBLIC_SITE_URL on the deploy host. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://meriqai.com"
).replace(/\/$/, "")

export const SITE_NAME = "Meriq"

// Single source of truth for contact/booking surfaces (footer, final CTA,
// demo form) — these drifted when duplicated per-file.
export const CONTACT_EMAIL = "justinli@meriqai.com"
export const BOOKING_URL = "https://calendar.app.google/YwUWhSyPuiBRTf4N6"
export const LINKEDIN_URL = "https://www.linkedin.com/company/meriq-ai"

export const ogLocale: Record<Locale, string> = {
  en: "en_US",
  "zh-TW": "zh_TW",
}

// Search terms relevant people would use to find this kind of product.
export const KEYWORDS = [
  "freight forwarder automation",
  "forwarding operations AI",
  "freight forwarder AI Taiwan",
  "quotation automation freight",
  "shipping document cross-check",
  "S/O automation",
  "pre-alert automation",
  "海空運承攬 AI",
  "貨代 自動化",
  "報價單 自動化",
  "詢價信 自動報價",
  "文件核對 CI PL 提單",
  "OP 文件繕打",
  "承攬業 系統",
  "台灣 中小型 forwarder",
]

/**
 * Canonical + hreflang alternates for a locale-agnostic path:
 * "" → home, "/blog", "/blog/vision".
 */
export function alternates(path: string, lang: Locale): Metadata["alternates"] {
  const languages: Record<string, string> = {}
  for (const l of locales) languages[htmlLang[l]] = `${SITE_URL}/${l}${path}`
  languages["x-default"] = `${SITE_URL}/${defaultLocale}${path}`
  return { canonical: `${SITE_URL}/${lang}${path}`, languages }
}
