"use client"

import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BlurFade } from "@/components/ui/blur-fade"
import { GridPattern } from "@/components/ui/grid-pattern"
import { AgentDemo } from "@/components/visuals/agent-demo"
import { cn } from "@/lib/utils"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/app/[lang]/dictionaries"
import { ApplyPilotDialog } from "@/components/apply-pilot-dialog"

export function Hero({
  hero,
  lang,
  pilot,
  watch,
}: {
  hero: Dictionary["hero"]
  lang: Locale
  pilot: Dictionary["pilot"]
  watch: Dictionary["watch"]
}) {
  return (
    <section className="relative overflow-hidden px-6 pt-32 sm:pt-40">
      <GridPattern
        width={48}
        height={48}
        className={cn(
          "absolute inset-0 -z-10 h-full w-full",
          "[mask-image:radial-gradient(80%_60%_at_50%_0%,black,transparent)] stroke-border/60"
        )}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[460px] bg-gradient-to-b from-primary/[0.05] to-transparent" />

      {/* Copy */}
      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-3xl">
          <BlurFade delay={0.05}>
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 font-mono text-xs font-medium tracking-wide text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" aria-hidden />
              {hero.eyebrow}
            </p>
          </BlurFade>

          <BlurFade delay={0.12}>
            <h1 className="mt-5 text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.5rem]">
              {hero.titleLead}
              {lang === "zh-TW" && <br aria-hidden />}
              <span className="text-primary">{hero.titleEmph}</span>
            </h1>
          </BlurFade>

          <BlurFade delay={0.2}>
            <div className="mt-6 max-w-2xl space-y-2.5">
              <p className="text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
                {hero.pitch}
              </p>
              <p className="text-base leading-relaxed font-medium text-pretty text-foreground sm:text-lg">
                {hero.outcome}
              </p>
            </div>
          </BlurFade>

          <BlurFade delay={0.28}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ApplyPilotDialog pilot={pilot} lang={lang} location="hero">
                <Button size="lg">
                  {pilot.cta}
                  <ArrowRight className="size-4" />
                </Button>
              </ApplyPilotDialog>
            </div>
            <p className="mt-3 text-[13px] text-muted-foreground">
              {hero.ctaNote}
            </p>
          </BlurFade>
        </div>
      </div>

      {/* Live agent demo — the product working a case, step by step */}
      <BlurFade delay={0.22} className="mx-auto mt-16 w-full max-w-5xl">
        <div id="sample-review" className="scroll-mt-24">
          <AgentDemo watch={watch} />
        </div>
      </BlurFade>
    </section>
  )
}
