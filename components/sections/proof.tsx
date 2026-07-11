import Link from "next/link"
import { ArrowUpRight, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BlurFade } from "@/components/ui/blur-fade"
import { BorderBeam } from "@/components/ui/border-beam"
import { NoiseTexture } from "@/components/ui/noise-texture"
import { Eyebrow, Section, SectionHeading } from "@/components/section"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/app/[lang]/dictionaries"

/**
 * Early Partner Program — an identity to hold, not a beta to test:
 * membership plate (01 / 05), four concrete rights, founder-led onboarding.
 * Once real numbers exist, flip `proof.testimonialsEnabled` and the
 * testimonial cards (name / role / quote / one number) render below.
 */
export function Proof({
  proof,
  lang,
}: {
  proof: Dictionary["proof"]
  lang: Locale
}) {
  return (
    <Section id="proof" className="scroll-mt-16">
      <div className="mx-auto max-w-2xl text-center">
        <BlurFade delay={0.05} className="flex justify-center">
          <Eyebrow>{proof.eyebrow}</Eyebrow>
        </BlurFade>
        <BlurFade delay={0.1}>
          <SectionHeading className="mt-4">{proof.title}</SectionHeading>
        </BlurFade>
      </div>

      <BlurFade delay={0.16}>
        <div className="relative mx-auto mt-12 max-w-4xl overflow-hidden rounded-3xl border border-border/70 bg-surface shadow-sm">
          <BorderBeam
            size={220}
            duration={10}
            colorFrom="oklch(0.865 0.127 207)"
            colorTo="oklch(0.609 0.126 222)"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_90%_at_0%_120%,oklch(0.865_0.127_207/0.3)_0%,transparent_60%)]"
          />
          <NoiseTexture
            frequency={0.55}
            slope={0.12}
            className="opacity-25 [mask-image:radial-gradient(95%_95%_at_30%_80%,white_10%,transparent_100%)]"
          />

          <div className="relative p-7 sm:p-10">
            {/* membership plate — an identity, not a coupon */}
            <div className="flex items-center justify-between gap-3 border-b border-dashed border-border pb-4">
              <span className="font-mono text-[10px] font-bold tracking-[0.24em] text-primary-strong uppercase">
                {proof.badge}
              </span>
              <span className="font-mono text-[10px] font-bold tracking-[0.24em] text-muted-foreground tabular-nums">
                {proof.badgeNo}
              </span>
            </div>

            <div className="mt-7 grid gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-12">
              {/* the invitation */}
              <div>
                <p className="text-base leading-relaxed font-medium text-pretty">
                  {proof.body1}
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-pretty text-muted-foreground">
                  {proof.body2}
                </p>
                <div className="mt-8">
                  <Button size="lg" className="rounded-full" asChild>
                    <Link href={`/${lang}/demo`}>
                      {proof.cta}
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                </div>
                <p className="mt-4 text-[13px] font-medium text-muted-foreground">
                  {proof.note}
                </p>
              </div>

              {/* the rights */}
              <div>
                <p className="font-mono text-[10px] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
                  {proof.benefitsLabel}
                </p>
                <ul className="mt-4 space-y-4">
                  {proof.benefits.map((benefit) => (
                    <li key={benefit.title} className="flex gap-3">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20">
                        <Check
                          className="size-3 text-primary-strong"
                          strokeWidth={2.5}
                        />
                      </span>
                      <div>
                        <p className="text-sm font-semibold tracking-tight">
                          {benefit.title}
                        </p>
                        <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">
                          {benefit.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </BlurFade>

      {proof.testimonialsEnabled && (
        <BlurFade delay={0.22}>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {proof.testimonials.map((t) => (
              <figure
                key={t.name}
                className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <blockquote className="text-[15px] leading-relaxed text-foreground/85">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-auto pt-5">
                  <p className="text-sm font-semibold tracking-tight">
                    {t.name}
                  </p>
                  <p className="text-[13px] text-muted-foreground">
                    {t.role} · {t.company}
                  </p>
                  <p className="mt-3 font-display text-2xl font-semibold text-primary-strong">
                    {t.metric}
                    <span className="ml-2 align-middle font-sans text-[13px] font-medium text-muted-foreground">
                      {t.metricLabel}
                    </span>
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </BlurFade>
      )}
    </Section>
  )
}
