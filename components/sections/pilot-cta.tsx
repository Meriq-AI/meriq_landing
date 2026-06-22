import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BlurFade } from "@/components/ui/blur-fade"
import { GridPattern } from "@/components/ui/grid-pattern"
import { ApplyPilotDialog } from "@/components/apply-pilot-dialog"
import { Section } from "@/components/section"
import { cn } from "@/lib/utils"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/app/[lang]/dictionaries"

export function PilotCta({
  pilotCta,
  pilot,
  lang,
}: {
  pilotCta: Dictionary["pilotCta"]
  pilot: Dictionary["pilot"]
  lang: Locale
}) {
  return (
    <Section id="pilot">
      <BlurFade delay={0.05}>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-16 text-center shadow-sm sm:px-12 sm:py-20">
          <GridPattern
            width={40}
            height={40}
            className={cn(
              "absolute inset-0 -z-10 h-full w-full",
              "[mask-image:radial-gradient(70%_60%_at_50%_50%,black,transparent)] stroke-border/60"
            )}
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-gradient-to-b from-primary/[0.05] to-transparent" />

          <p className="font-mono text-xs font-medium tracking-widest text-muted-foreground uppercase">
            {pilotCta.eyebrow}
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {pilotCta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground">
            {pilotCta.subtitle}
          </p>
          <div className="mt-8 flex justify-center">
            <ApplyPilotDialog pilot={pilot} lang={lang} location="pilot_cta">
              <Button size="lg">
                {pilot.cta}
                <ArrowRight className="size-4" />
              </Button>
            </ApplyPilotDialog>
          </div>
          <p className="mt-4 text-[13px] text-muted-foreground">
            {pilotCta.note}
          </p>
        </div>
      </BlurFade>
    </Section>
  )
}
