import Link from "next/link"
import { ArrowRight, CalendarClock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BlurFade } from "@/components/ui/blur-fade"
import { BOOKING_URL } from "@/lib/seo"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/app/[lang]/dictionaries"

/** Full-bleed working-blue band — the inverse of the light page above it. */
export function FinalCta({
  finalCta,
  lang,
}: {
  finalCta: Dictionary["finalCta"]
  lang: Locale
}) {
  return (
    <section
      id="cta"
      className="relative overflow-hidden bg-primary text-primary-foreground"
    >
      {/* Depth: darker vignette at the edges, soft glow center-top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,oklch(1_0_0/0.16)_0%,transparent_55%),radial-gradient(140%_120%_at_50%_115%,oklch(0.3_0.14_263/0.55)_0%,transparent_65%)]"
      />

      <div className="relative mx-auto w-full max-w-3xl px-6 py-24 text-center sm:py-32">
        <BlurFade delay={0.05}>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
            {finalCta.title}
          </h2>
        </BlurFade>
        <BlurFade delay={0.12}>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-pretty text-primary-foreground/80 sm:text-lg">
            {finalCta.body}
          </p>
        </BlurFade>
        <BlurFade delay={0.2}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              className="h-12 rounded-full bg-white px-7 text-[15px] text-primary shadow-lg shadow-black/15 hover:bg-white/90"
              asChild
            >
              <Link href={`/${lang}/demo`}>
                {finalCta.cta}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-white/30 bg-white/10 px-7 text-[15px] text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
              asChild
            >
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                <CalendarClock className="size-4" />
                {finalCta.secondaryCta}
              </a>
            </Button>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
