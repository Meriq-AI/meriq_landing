import { BlurFade } from "@/components/ui/blur-fade"
import { Eyebrow, Section, SectionHeading } from "@/components/section"
import type { Dictionary } from "@/app/[lang]/dictionaries"

export function WhyUs({ whyUs }: { whyUs: Dictionary["whyUs"] }) {
  const paras = [
    { title: whyUs.para1Title, body: whyUs.para1 },
    { title: whyUs.para2Title, body: whyUs.para2 },
  ]

  return (
    <Section
      id="why"
      className="bg-surface"
      containerClassName="max-w-4xl text-center"
    >
      <BlurFade delay={0.05} className="flex justify-center">
        <Eyebrow>{whyUs.eyebrow}</Eyebrow>
      </BlurFade>
      <BlurFade delay={0.1}>
        <SectionHeading className="mt-4">{whyUs.title}</SectionHeading>
      </BlurFade>

      <BlurFade delay={0.18}>
        <div className="mt-12 grid gap-3 text-left sm:grid-cols-2">
          {paras.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-border bg-background p-6 sm:p-8"
            >
              <p className="text-lg font-semibold tracking-tight text-balance sm:text-xl">
                {p.title}
              </p>
              <p className="mt-3 text-base leading-relaxed text-pretty text-muted-foreground">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </BlurFade>
    </Section>
  )
}
