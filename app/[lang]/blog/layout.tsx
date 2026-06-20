import { notFound } from "next/navigation"

import { SiteHeader } from "@/components/layout/site-header"
import { isLocale } from "@/lib/i18n/config"
import { getDictionary } from "../dictionaries"

export default async function BlogLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const dict = await getDictionary(lang)

  return (
    <>
      <SiteHeader lang={lang} nav={dict.nav} />
      <main className="px-6 pt-[72px]">{children}</main>
    </>
  )
}
