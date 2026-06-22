import type { Metadata } from "next"

import { htmlLang, locales, type Locale } from "@/lib/i18n/config"

/** Production origin. Override with NEXT_PUBLIC_SITE_URL on the deploy host. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://meriqai.com"
).replace(/\/$/, "")

export const SITE_NAME = "Meriq"

export const ogLocale: Record<Locale, string> = {
  en: "en_US",
  "zh-TW": "zh_TW",
}

// Search terms relevant people would use to find this kind of product.
export const KEYWORDS = [
  "customs broker software",
  "AI for customs brokers",
  "freight forwarder software",
  "pre-filing review",
  "HS code classification",
  "CCC code classification",
  "customs compliance AI",
  "shipment document review",
  "broker-ready case",
  "trade operations software",
  "報關行軟體",
  "報關 AI",
  "貨運承攬",
  "報關前審查",
  "HS / CCC 號列查詢",
  "出貨文件審查",
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
