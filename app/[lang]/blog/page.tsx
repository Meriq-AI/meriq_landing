import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowRight } from "lucide-react"

import { isLocale, type Locale } from "@/lib/i18n/config"
import { alternates } from "@/lib/seo"
import { formatPostDate, getPosts } from "@/lib/blog"
import { getDictionary } from "../dictionaries"
import { BlogPostLink } from "@/components/blog-post-link"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const locale: Locale = isLocale(lang) ? lang : "en"
  const dict = await getDictionary(locale)
  return {
    title: dict.blog.title,
    description: dict.blog.subtitle,
    alternates: alternates("/blog", locale),
  }
}

export default async function BlogIndex({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const posts = getPosts()

  return (
    <div className="mx-auto w-full max-w-3xl py-16 sm:py-24">
      <ul className="border-t border-border">
        {posts.map((post) => {
          const meta = post.i18n[lang]
          return (
            <li key={post.slug} className="border-b border-border">
              <BlogPostLink
                href={`/${lang}/blog/${post.slug}`}
                slug={post.slug}
                lang={lang}
                className="group block py-7"
              >
                <p className="font-mono text-xs text-muted-foreground">
                  {formatPostDate(post.date, lang)} · {meta.readingTime}
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
                  {meta.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">
                  {meta.excerpt}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </BlogPostLink>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
