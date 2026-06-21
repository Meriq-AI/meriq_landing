"use client"

import Link from "next/link"
import posthog from "posthog-js"

export function BlogPostLink({
  href,
  slug,
  lang,
  children,
  className,
}: {
  href: string
  slug: string
  lang: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      onClick={() => posthog.capture("blog_post_clicked", { slug, lang, href })}
      className={className}
    >
      {children}
    </Link>
  )
}
