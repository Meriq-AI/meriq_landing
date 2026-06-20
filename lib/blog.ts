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
        title: "Building the AI-native pre-clearance workspace",
        excerpt:
          "Global trade breaks before filing — in scattered emails, incomplete documents, and endless follow-ups. How we're building the context layer for customs brokerage.",
        readingTime: "8 min read",
      },
      "zh-TW": {
        title: "打造 AI 原生的報關前作業平台",
        excerpt:
          "全球貿易的混亂往往發生在報關前——分散的 email、不完整的文件、無止境的追問。這是我們打造報關產業 context layer 的方式。",
        readingTime: "8 分鐘閱讀",
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
