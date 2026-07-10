import { FileStack, Hourglass, UserX, type LucideIcon } from "lucide-react"

import { BlurFade } from "@/components/ui/blur-fade"
import { Eyebrow, Section, SectionHeading } from "@/components/section"
import type { Dictionary } from "@/app/[lang]/dictionaries"

const ICONS: LucideIcon[] = [FileStack, Hourglass, UserX]

export function Problem({ problem }: { problem: Dictionary["problem"] }) {
  return (
    <Section id="pain">
      <div className="mx-auto max-w-2xl text-center">
        <BlurFade delay={0.05} className="flex justify-center">
          <Eyebrow>{problem.eyebrow}</Eyebrow>
        </BlurFade>
        <BlurFade delay={0.1}>
          <SectionHeading className="mt-4">{problem.title}</SectionHeading>
        </BlurFade>
      </div>

      <BlurFade delay={0.16}>
        <div className="mt-12 grid gap-3 sm:grid-cols-3">
          {problem.items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length]
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/[0.07]"
              >
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-[18px]" />
                </span>
                <p className="mt-4 text-[15px] font-semibold tracking-tight">
                  {item.title}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            )
          })}
        </div>
      </BlurFade>

      {/* Punchline */}
      <BlurFade delay={0.2}>
        <div className="mt-20 text-center sm:mt-24">
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {problem.punchLead}
          </p>
          <p className="mx-auto mt-3 max-w-3xl font-display text-2xl font-semibold tracking-tight text-balance sm:text-4xl">
            {problem.punchEmph}
          </p>
        </div>
      </BlurFade>
    </Section>
  )
}
