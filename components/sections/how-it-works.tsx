import { ArrowRight } from "lucide-react"

import { BlurFade } from "@/components/ui/blur-fade"
import { Eyebrow, Section, SectionHeading } from "@/components/section"
import type { Dictionary } from "@/app/[lang]/dictionaries"

export function HowItWorks({
  howItWorks,
}: {
  howItWorks: Dictionary["howItWorks"]
}) {
  return (
    <Section id="how">
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
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
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
    </Section>
  )
}
