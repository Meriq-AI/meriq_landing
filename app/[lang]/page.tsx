import { notFound } from "next/navigation"

import { ScrollProgress } from "@/components/ui/scroll-progress"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { Hero } from "@/components/sections/hero"
import { DataFlow } from "@/components/sections/data-flow"
import { Roles } from "@/components/sections/roles"
import { CTA } from "@/components/sections/cta"
import { isLocale } from "@/lib/i18n/config"
import { getDictionary } from "./dictionaries"

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()

  const dict = await getDictionary(lang)

  return (
    <>
      <ScrollProgress className="z-[60] h-0.5 bg-primary" />
      <SiteHeader lang={lang} nav={dict.nav} />
      <main>
        <Hero hero={dict.hero} lang={lang} />
        <DataFlow flow={dict.flow} />
        <Roles roles={dict.roles} />
        <CTA cta={dict.cta} />
      </main>
      <SiteFooter lang={lang} footer={dict.footer} nav={dict.nav} />
    </>
  )
}
