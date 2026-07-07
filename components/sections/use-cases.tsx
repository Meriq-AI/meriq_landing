import {
  Calculator,
  Compass,
  FileSearch,
  MessageSquareQuote,
  PackageOpen,
  type LucideIcon,
} from "lucide-react"

import { BlurFade } from "@/components/ui/blur-fade"
import { Eyebrow, Section, SectionHeading } from "@/components/section"
import { cn } from "@/lib/utils"
import type { Dictionary } from "@/app/[lang]/dictionaries"

const ICONS: LucideIcon[] = [
  MessageSquareQuote,
  Compass,
  FileSearch,
  PackageOpen,
  Calculator,
]

export function UseCases({ useCases }: { useCases: Dictionary["useCases"] }) {
  return (
    <Section id="use-cases" className="scroll-mt-16">
      <div className="mx-auto max-w-2xl text-center">
        <BlurFade delay={0.05} className="flex justify-center">
          <Eyebrow>{useCases.eyebrow}</Eyebrow>
        </BlurFade>
        <BlurFade delay={0.1}>
          <SectionHeading className="mt-4">{useCases.title}</SectionHeading>
        </BlurFade>
      </div>

      {/* 5 cards: 3 on the first row, 2 wider on the second */}
      <BlurFade delay={0.16}>
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {useCases.items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length]
            return (
              <div
                key={item.title}
                className={cn(
                  "rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/[0.07]",
                  i < 3 ? "lg:col-span-2" : "lg:col-span-3"
                )}
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
    </Section>
  )
}
