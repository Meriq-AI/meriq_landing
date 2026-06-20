import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { isLocale } from "@/lib/i18n/config"
import { formatPostDate, getPostEntry, getPosts, loadPostBody } from "@/lib/blog"
import { getDictionary } from "../../dictionaries"

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
  const meta = entry.i18n[lang]
  return { title: meta.title, description: meta.excerpt }
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
        <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {meta.title}
        </h1>
      </header>

      <div>
        <Body />
      </div>
    </article>
  )
}
