import "server-only"

import type { ComponentType } from "react"
import type { Locale } from "@/lib/i18n/config"

export type PostMeta = {
  title: string
  excerpt: string
  readingTime: string
}

export type PostEntry = {
  slug: string
  /** ISO date, used for sorting and display. */
  date: string
  i18n: Record<Locale, PostMeta>
}

// Listing + SEO metadata lives here (one source of truth, i18n-friendly);
// the article body for each post lives in content/blog/<slug>/<locale>.mdx.
const POSTS: PostEntry[] = [
  {
    slug: "vision",
    date: "2026-06-19",
    i18n: {
      en: {
        title: "Turn messy shipment communication into reviewable pre-filing cases",
        excerpt:
          "Meriq helps customs brokers, forwarders, and trade teams turn scattered emails, documents, product details, and regulatory questions into clear, traceable, reviewable shipment cases — before filing.",
        readingTime: "3 min read",
      },
      "zh-TW": {
        title: "把混亂的出貨溝通，整理成可審查的報關前案件",
        excerpt:
          "Meriq 幫助報關行、貨代與貿易團隊，在正式報關前，把分散的 email、出貨文件、產品資訊與法規疑義，整理成清楚、可追蹤、可審查的 shipment case。",
        readingTime: "3 分鐘閱讀",
      },
    },
  },
]

export function getPosts(): PostEntry[] {
  return [...POSTS].sort((a, b) => b.date.localeCompare(a.date))
}

export function getPostEntry(slug: string): PostEntry | null {
  return POSTS.find((p) => p.slug === slug) ?? null
}

export async function loadPostBody(
  slug: string,
  lang: Locale
): Promise<ComponentType> {
  const mod = await import(`@/content/blog/${slug}/${lang}.mdx`)
  return mod.default as ComponentType
}

export function formatPostDate(date: string, lang: Locale): string {
  return new Date(date).toLocaleDateString(
    lang === "zh-TW" ? "zh-TW" : "en-US",
    { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }
  )
}
