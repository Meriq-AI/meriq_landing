import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { isLocale, type Locale } from "@/lib/i18n/config"
import { alternates, ogLocale, SITE_NAME, SITE_URL } from "@/lib/seo"
import {
  formatPostDate,
  getPostEntry,
  getPosts,
  loadPostBody,
} from "@/lib/blog"
import { getDictionary } from "../../dictionaries"
import { BlogPostTracker } from "@/components/blog-post-tracker"

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const entry = getPostEntry(slug)
  if (!isLocale(lang) || !entry) return {}
  const locale = lang as Locale
  const meta = entry.i18n[locale]
  return {
    title: meta.title,
    description: meta.excerpt,
    alternates: alternates(`/blog/${slug}`, locale),
    openGraph: {
      type: "article",
      url: `${SITE_URL}/${locale}/blog/${slug}`,
      siteName: SITE_NAME,
      locale: ogLocale[locale],
      title: meta.title,
      description: meta.excerpt,
      publishedTime: entry.date,
      // Re-attach the OG image; an explicit openGraph here would otherwise drop
      // the inherited one (Next replaces, doesn't deep-merge).
      images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE_NAME }],
    },
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  if (!isLocale(lang)) notFound()
  const entry = getPostEntry(slug)
  if (!entry) notFound()

  const meta = entry.i18n[lang]
  const dict = await getDictionary(lang)
  // A registered post missing this locale's MDX should 404, not 500.
  const Body = await loadPostBody(slug, lang).catch(() => null)
  if (!Body) notFound()

  return (
    <article className="mx-auto w-full max-w-2xl py-16 sm:py-24">
      <BlogPostTracker slug={slug} lang={lang} title={meta.title} />
      <Link
        href={`/${lang}/blog`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {dict.blog.backToBlog}
      </Link>

      <header className="mt-8 mb-10">
        <p className="font-mono text-xs text-muted-foreground">
          {formatPostDate(entry.date, lang)} · {meta.readingTime}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {meta.title}
        </h1>
      </header>

      <div>
        <Body />
      </div>
    </article>
  )
}
