import { BlurFade } from "@/components/ui/blur-fade"
import { Eyebrow, Section, SectionHeading } from "@/components/section"
import type { Dictionary } from "@/app/[lang]/dictionaries"

export function WhyUs({ whyUs }: { whyUs: Dictionary["whyUs"] }) {
  return (
    <Section
      id="why-us"
      className="bg-surface"
      containerClassName="max-w-3xl text-center"
    >
      <BlurFade delay={0.05} className="flex justify-center">
        <Eyebrow>{whyUs.eyebrow}</Eyebrow>
      </BlurFade>
      <BlurFade delay={0.1}>
        <SectionHeading className="mt-4">{whyUs.title}</SectionHeading>
      </BlurFade>
      <BlurFade delay={0.16}>
        <p className="mt-5 text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
          {whyUs.body}
        </p>
      </BlurFade>

      <BlurFade delay={0.2}>
        <figure className="mt-12">
          <figcaption className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            {whyUs.quoteLabel}
          </figcaption>
          <blockquote className="mx-auto mt-4 max-w-2xl border-l-2 border-primary pl-6 text-left text-2xl leading-snug font-semibold tracking-tight text-balance sm:text-3xl">
            {whyUs.quote}
          </blockquote>
        </figure>
      </BlurFade>

      <BlurFade delay={0.26}>
        <div className="mt-10 space-y-1">
          <p className="text-lg font-medium text-primary">{whyUs.line1}</p>
          <p className="text-base text-muted-foreground">{whyUs.line2}</p>
        </div>
      </BlurFade>
    </Section>
  )
}
