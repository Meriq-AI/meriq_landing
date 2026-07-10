import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BlurFade } from "@/components/ui/blur-fade"
import { BorderBeam } from "@/components/ui/border-beam"
import { Eyebrow, Section, SectionHeading } from "@/components/section"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/app/[lang]/dictionaries"

/**
 * Proof section. Pre-launch it carries the Design Partner scarcity card;
 * once measured numbers exist, flip `proof.testimonialsEnabled` in the
 * dictionaries and the Reform-style testimonial cards (name / role / quote /
 * one number) render below it.
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
        <div className="relative mx-auto mt-12 max-w-3xl overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <BorderBeam
            size={220}
            duration={10}
            colorFrom="oklch(0.72 0.13 215)"
            colorTo="oklch(0.55 0.12 222)"
          />
          <div className="p-8 text-center sm:p-12">
            <h3 className="font-display text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              {proof.scarcityTitle}
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground">
              {proof.scarcityBody}
            </p>
            <div className="mt-8 flex justify-center">
              <Button size="lg" className="rounded-full" asChild>
                <Link href={`/${lang}/demo`}>
                  {proof.cta}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
            <p className="mt-4 text-[13px] font-medium text-muted-foreground">
              {proof.note}
            </p>
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
                  <p className="mt-3 font-display text-2xl font-semibold text-primary">
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
