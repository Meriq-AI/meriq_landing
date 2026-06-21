"use client"

import { useEffect } from "react"
import posthog from "posthog-js"

export function BlogPostTracker({
  slug,
  lang,
  title,
}: {
  slug: string
  lang: string
  title: string
}) {
  useEffect(() => {
    posthog.capture("blog_post_viewed", { slug, lang, title })
  }, [slug, lang, title])

  return null
}
