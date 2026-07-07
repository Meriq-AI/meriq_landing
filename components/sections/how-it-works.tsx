import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BlurFade } from "@/components/ui/blur-fade"
import { Eyebrow, Section, SectionHeading } from "@/components/section"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/app/[lang]/dictionaries"

export function HowItWorks({
  howItWorks,
  lang,
}: {
  howItWorks: Dictionary["howItWorks"]
  lang: Locale
}) {
  return (
    <Section id="how" className="bg-surface">
      <div className="mx-auto max-w-2xl text-center">
        <BlurFade delay={0.05} className="flex justify-center">
          <Eyebrow>{howItWorks.eyebrow}</Eyebrow>
        </BlurFade>
        <BlurFade delay={0.1}>
          <SectionHeading className="mt-4">{howItWorks.title}</SectionHeading>
        </BlurFade>
        <BlurFade delay={0.16}>
          <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground">
            {howItWorks.subtitle}
          </p>
        </BlurFade>
      </div>

      <BlurFade delay={0.2}>
        <ol className="mt-12 grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
          {howItWorks.steps.map((step, i) => (
            <li key={step.step} className="contents">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/[0.07]">
                <span className="font-mono text-sm font-semibold text-primary">
                  {step.step}
                </span>
                <h3 className="mt-3 text-lg font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </div>
              {i < howItWorks.steps.length - 1 && (
                <div
                  className="flex items-center justify-center text-muted-foreground/40"
                  aria-hidden
                >
                  <ArrowRight className="size-5 rotate-90 lg:rotate-0" />
                </div>
              )}
            </li>
          ))}
        </ol>
      </BlurFade>

      <BlurFade delay={0.26}>
        <div className="mt-10 flex justify-center">
          <Button size="lg" className="rounded-full" asChild>
            <Link href={`/${lang}/export-plan`}>
              {howItWorks.cta}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </BlurFade>
    </Section>
  )
}
