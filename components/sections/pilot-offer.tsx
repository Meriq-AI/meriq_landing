import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BlurFade } from "@/components/ui/blur-fade"
import { BorderBeam } from "@/components/ui/border-beam"
import { Eyebrow, Section } from "@/components/section"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/app/[lang]/dictionaries"

export function PilotOffer({
  pilotOffer,
  lang,
}: {
  pilotOffer: Dictionary["pilotOffer"]
  lang: Locale
}) {
  return (
    <Section id="pilot">
      <BlurFade delay={0.05}>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <BorderBeam
            size={220}
            duration={10}
            colorFrom="oklch(0.72 0.13 215)"
            colorTo="oklch(0.55 0.12 222)"
          />
          <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:gap-14">
            <div>
              <Eyebrow>{pilotOffer.eyebrow}</Eyebrow>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                {pilotOffer.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground">
                {pilotOffer.lead}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button size="lg" className="rounded-full" asChild>
                  <Link href={`/${lang}/demo`}>
                    {pilotOffer.cta}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
              <p className="mt-4 text-[13px] font-medium text-muted-foreground">
                {pilotOffer.note}
              </p>
            </div>

            <ul className="grid content-center gap-3 rounded-2xl border border-border bg-surface p-6 sm:p-8">
              {pilotOffer.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="size-3 text-primary" aria-hidden />
                  </span>
                  <span className="text-[15px] leading-6">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </BlurFade>
    </Section>
  )
}
