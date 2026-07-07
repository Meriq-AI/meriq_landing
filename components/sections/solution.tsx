import { Check } from "lucide-react"

import { BlurFade } from "@/components/ui/blur-fade"
import { Eyebrow, Section } from "@/components/section"
import type { Dictionary } from "@/app/[lang]/dictionaries"

export function Solution({ solution }: { solution: Dictionary["solution"] }) {
  return (
    <Section
      id="solution"
      className="bg-surface"
      containerClassName="max-w-4xl text-center"
    >
      <BlurFade delay={0.05} className="flex justify-center">
        <Eyebrow>{solution.eyebrow}</Eyebrow>
      </BlurFade>
      <BlurFade delay={0.1}>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
          {solution.titleLead}
          <span className="text-primary">{solution.titleEmph}</span>
          {solution.titleEnd}
        </h2>
      </BlurFade>
      <BlurFade delay={0.16}>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
          {solution.lead}
        </p>
      </BlurFade>

      <BlurFade delay={0.2}>
        <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2.5">
          {solution.items.map((item) => (
            <li
              key={item}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card py-2 pr-4 pl-3 text-sm font-medium shadow-sm"
            >
              <Check className="size-4 text-primary" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </BlurFade>

      <BlurFade delay={0.26}>
        <div className="mx-auto mt-10 max-w-2xl space-y-1.5">
          <p className="text-base leading-relaxed text-muted-foreground">
            {solution.closing1}
          </p>
          <p className="text-base leading-relaxed font-medium text-foreground">
            {solution.closing2}
          </p>
        </div>
      </BlurFade>
    </Section>
  )
}
