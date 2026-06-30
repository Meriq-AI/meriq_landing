import type { MetadataRoute } from "next"

import { htmlLang, locales } from "@/lib/i18n/config"
import { getPosts } from "@/lib/blog"
import { SITE_URL } from "@/lib/seo"

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts()
  const paths = ["", "/tariff", "/blog", ...posts.map((p) => `/blog/${p.slug}`)]

  const lastModified = (path: string) => {
    const post = posts.find((p) => `/blog/${p.slug}` === path)
    return post ? new Date(post.date) : new Date()
  }

  return paths.flatMap((path) => {
    const languages: Record<string, string> = {}
    for (const l of locales) languages[htmlLang[l]] = `${SITE_URL}/${l}${path}`
    languages["x-default"] = `${SITE_URL}/en${path}`

    return locales.map((lang) => ({
      url: `${SITE_URL}/${lang}${path}`,
      lastModified: lastModified(path),
      changeFrequency: path === "" ? "weekly" : "monthly",
      priority:
        path === "" ? 1 : path === "/tariff" ? 0.8 : path === "/blog" ? 0.6 : 0.7,
      alternates: { languages },
    }))
  })
}
