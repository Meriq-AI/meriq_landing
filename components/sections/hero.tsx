import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BlurFade } from "@/components/ui/blur-fade"
import { HeroDemo } from "@/components/visuals/hero-demo"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/app/[lang]/dictionaries"

/**
 * Split hero: the pitch on the left, the product visibly working on the
 * right — a buyer email becoming an export plan on loop, over a blue wash
 * rising from the bottom.
 */
export function Hero({
  hero,
  lang,
  cta,
}: {
  hero: Dictionary["hero"]
  lang: Locale
  cta: string
}) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[30rem] bg-[radial-gradient(120%_130%_at_75%_115%,oklch(0.546_0.215_263/0.34)_0%,oklch(0.65_0.16_255/0.16)_38%,oklch(0.8_0.09_250/0.08)_60%,transparent_80%)]"
      />

      <div className="mx-auto w-full max-w-6xl px-6 pt-32 pb-14 sm:pt-40">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] lg:gap-10">
          {/* Copy */}
          <div className="max-w-xl">
            <BlurFade delay={0.05}>
              <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium tracking-wide text-muted-foreground shadow-sm">
                <span className="relative flex size-2" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 motion-reduce:animate-none" />
                  <span className="relative inline-flex size-2 rounded-full bg-primary" />
                </span>
                {hero.eyebrow}
              </p>
            </BlurFade>

            <BlurFade delay={0.12}>
              <h1 className="mt-7 font-display text-[2.7rem] leading-[1.06] font-semibold tracking-tight text-balance sm:text-6xl">
                {hero.titleLead}
                {/* zh: always break after 「變成」 so the accent phrase stays whole */}
                {lang === "zh-TW" && <br aria-hidden />}
                <span className="text-primary">{hero.titleEmph}</span>
                {hero.titleEnd}
              </h1>
            </BlurFade>

            <BlurFade delay={0.2}>
              <div className="mt-6 space-y-2">
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
                <Button
                  size="lg"
                  className="h-12 rounded-full px-7 text-[15px] shadow-lg shadow-primary/25 transition-transform hover:-translate-y-0.5"
                  asChild
                >
                  <Link href={`/${lang}/export-plan`}>
                    {cta}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full bg-card px-7 text-[15px] shadow-sm transition-transform hover:-translate-y-0.5"
                  asChild
                >
                  <a href="#how">{hero.secondaryCta}</a>
                </Button>
              </div>
            </BlurFade>

            <BlurFade delay={0.36}>
              <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2">
                {hero.chips.map((chip) => (
                  <li
                    key={chip}
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground"
                  >
                    <Check className="size-3.5 text-primary" aria-hidden />
                    {chip}
                  </li>
                ))}
              </ul>
            </BlurFade>
          </div>

          {/* The product, working */}
          <BlurFade delay={0.25} className="hidden lg:block">
            <HeroDemo lang={lang} />
          </BlurFade>
        </div>
      </div>
    </section>
  )
}
