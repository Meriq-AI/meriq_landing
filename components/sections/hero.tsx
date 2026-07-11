import Link from "next/link"
import { ArrowUpRight, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BlurFade } from "@/components/ui/blur-fade"
import { NoiseTexture } from "@/components/ui/noise-texture"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/app/[lang]/dictionaries"

/**
 * Clean centered hero: nothing but the pitch, over a noise-textured
 * white-cyan canvas. The product itself demos in the how-it-works section.
 */
export function Hero({
  hero,
  lang,
}: {
  hero: Dictionary["hero"]
  lang: Locale
}) {
  return (
    // Raft-style stage: the hero is one full-viewport rounded card floating
    // inside a thin frame of page background; the pill nav hovers above it.
    <section className="px-3 pt-3 pb-2 sm:px-4 sm:pt-4">
      <div className="relative flex min-h-[calc(100svh-1.5rem)] items-center overflow-hidden rounded-[1.75rem] border border-border/70 bg-surface sm:rounded-[2.5rem]">
        {/* Soft cyan tint + noise texture as the card's atmosphere */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_115%,oklch(0.865_0.127_207/0.5)_0%,oklch(0.88_0.09_215/0.22)_45%,transparent_78%),radial-gradient(60%_50%_at_0%_0%,oklch(0.88_0.09_215/0.18)_0%,transparent_60%)]"
        />
        <NoiseTexture
          frequency={0.55}
          slope={0.12}
          className="[mask-image:radial-gradient(85%_95%_at_50%_60%,white_20%,transparent_100%)] opacity-35"
        />

        <div className="relative mx-auto w-full max-w-3xl px-6 pt-32 pb-20 text-center sm:pt-36">
          <BlurFade delay={0.05}>
            {/* plain small caps — no pill, it read as a filter chip */}
            <p className="font-mono text-[11px] font-bold tracking-[0.3em] text-primary-strong uppercase">
              {hero.eyebrow}
            </p>
          </BlurFade>

          <BlurFade delay={0.12}>
            {/* ink headline; only one small segment carries color */}
            <h1
              className={
                lang === "zh-TW"
                  ? "mt-8 font-display text-4xl leading-[1.18] font-semibold tracking-tight text-balance sm:text-[3.6rem]"
                  : "mt-8 font-display text-[2.7rem] leading-[1.08] font-semibold tracking-tight text-balance sm:text-6xl"
              }
            >
              {hero.titleLead}
              <br aria-hidden />
              {hero.titleL2Pre}
              <span className="text-primary-strong">{hero.titleEmph}</span>
              {hero.titleEnd}
            </h1>
          </BlurFade>

          <BlurFade delay={0.2}>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
              {hero.pitch}
            </p>
          </BlurFade>

          <BlurFade delay={0.28}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Button
                size="lg"
                className="h-12 rounded-full px-7 text-[15px] shadow-lg shadow-primary/25 transition-transform hover:-translate-y-0.5"
                asChild
              >
                <Link href={`/${lang}/demo`}>
                  {hero.primaryCta}
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-full bg-card px-7 text-[15px] shadow-sm transition-transform hover:-translate-y-0.5"
                asChild
              >
                <a href="#quote">{hero.secondaryCta}</a>
              </Button>
            </div>
          </BlurFade>

          <BlurFade delay={0.36}>
            <p className="mt-9 inline-flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
              <ShieldCheck
                className="size-3.5 text-primary-strong"
                aria-hidden
              />
              {hero.trustLine}
            </p>
          </BlurFade>
        </div>
      </div>
    </section>
  )
}
