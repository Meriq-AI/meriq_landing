import {
  AlarmClock,
  Inbox,
  Receipt,
  Repeat,
  Scale,
  ShieldQuestion,
  type LucideIcon,
} from "lucide-react"

import { BlurFade } from "@/components/ui/blur-fade"
import { Eyebrow, Section, SectionHeading } from "@/components/section"
import type { Dictionary } from "@/app/[lang]/dictionaries"

const ICONS: LucideIcon[] = [
  Inbox,
  AlarmClock,
  Scale,
  ShieldQuestion,
  Repeat,
  Receipt,
]

export function HiddenCost({
  hiddenCost,
}: {
  hiddenCost: Dictionary["hiddenCost"]
}) {
  return (
    <Section id="problem">
      <div className="mx-auto max-w-2xl text-center">
        <BlurFade delay={0.05} className="flex justify-center">
          <Eyebrow>{hiddenCost.eyebrow}</Eyebrow>
        </BlurFade>
        <BlurFade delay={0.1}>
          <SectionHeading className="mt-4">{hiddenCost.title}</SectionHeading>
        </BlurFade>
        <BlurFade delay={0.16}>
          <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground">
            {hiddenCost.subtitle}
          </p>
        </BlurFade>
      </div>

      <BlurFade delay={0.2}>
        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {hiddenCost.items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length]
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <span className="flex size-9 items-center justify-center rounded-xl bg-warning/10 text-warning">
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
    </Section>
  )
}
