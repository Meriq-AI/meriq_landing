import type { MetadataRoute } from "next"

import { defaultLocale, htmlLang, locales } from "@/lib/i18n/config"
import { SITE_URL } from "@/lib/seo"

// Blog routes still exist in code but are intentionally unlisted for now.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/demo"]

  return paths.flatMap((path) => {
    const languages: Record<string, string> = {}
    for (const l of locales) languages[htmlLang[l]] = `${SITE_URL}/${l}${path}`
    languages["x-default"] = `${SITE_URL}/${defaultLocale}${path}`

    return locales.map((lang) => ({
      url: `${SITE_URL}/${lang}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.8,
      alternates: { languages },
    }))
  })
}
