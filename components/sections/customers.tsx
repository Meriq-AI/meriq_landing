import { BlurFade } from "@/components/ui/blur-fade"
import { Eyebrow, Section, SectionHeading } from "@/components/section"
import type { Dictionary } from "@/app/[lang]/dictionaries"

export function Customers({
  customers,
}: {
  customers: Dictionary["customers"]
}) {
  return (
    <Section id="customers" containerClassName="max-w-3xl text-center">
      <BlurFade delay={0.05} className="flex justify-center">
        <Eyebrow>{customers.eyebrow}</Eyebrow>
      </BlurFade>
      <BlurFade delay={0.1}>
        <SectionHeading className="mt-4">{customers.title}</SectionHeading>
      </BlurFade>
      <BlurFade delay={0.16}>
        <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground">
          {customers.lead}
        </p>
      </BlurFade>

      <BlurFade delay={0.2}>
        <ul className="mt-8 flex flex-wrap justify-center gap-2.5">
          {customers.chips.map((chip) => (
            <li
              key={chip}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm transition-colors duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
            >
              {chip}
            </li>
          ))}
        </ul>
      </BlurFade>

      <BlurFade delay={0.26}>
        <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed font-medium text-pretty text-foreground/90">
          {customers.closing}
        </p>
      </BlurFade>
    </Section>
  )
}
