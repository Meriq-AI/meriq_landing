import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight } from "lucide-react"

import { isLocale, type Locale } from "@/lib/i18n/config"
import { formatPostDate, getPosts } from "@/lib/blog"
import { getDictionary } from "../dictionaries"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const locale: Locale = isLocale(lang) ? lang : "en"
  const dict = await getDictionary(locale)
  return { title: dict.blog.title, description: dict.blog.subtitle }
}

export default async function BlogIndex({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const dict = await getDictionary(lang)
  const posts = getPosts()

  return (
    <div className="mx-auto w-full max-w-3xl py-16 sm:py-24">
      <header className="mb-12">
        <h1 className="text-4xl font-semibold tracking-tight">
          {dict.blog.title}
        </h1>
        <p className="mt-3 text-pretty text-muted-foreground">
          {dict.blog.subtitle}
        </p>
      </header>

      <ul className="border-t border-border">
        {posts.map((post) => {
          const meta = post.i18n[lang]
          return (
            <li key={post.slug} className="border-b border-border">
              <Link
                href={`/${lang}/blog/${post.slug}`}
                className="group block py-7"
              >
                <p className="font-mono text-xs text-muted-foreground">
                  {formatPostDate(post.date, lang)} · {meta.readingTime}
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
                  {meta.title}
                </h2>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {meta.excerpt}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
