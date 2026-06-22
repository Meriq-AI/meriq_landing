import { ChevronDown } from "lucide-react"

import { BlurFade } from "@/components/ui/blur-fade"
import { Eyebrow, Section, SectionHeading } from "@/components/section"
import type { Dictionary } from "@/app/[lang]/dictionaries"

export function Faq({ faq }: { faq: Dictionary["faq"] }) {
  return (
    <Section id="faq">
      <div className="mx-auto max-w-2xl text-center">
        <BlurFade delay={0.05} className="flex justify-center">
          <Eyebrow>{faq.eyebrow}</Eyebrow>
        </BlurFade>
        <BlurFade delay={0.1}>
          <SectionHeading className="mt-4">{faq.title}</SectionHeading>
        </BlurFade>
      </div>

      <BlurFade delay={0.16}>
        <div className="mx-auto mt-12 max-w-2xl divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {faq.items.map((item) => (
            <details key={item.q} className="group px-5 py-4 sm:px-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-pretty text-muted-foreground">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </BlurFade>
    </Section>
  )
}
