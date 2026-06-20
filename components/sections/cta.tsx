import { BlurFade } from "@/components/ui/blur-fade"
import { CalendlyInline } from "@/components/calendly-inline"
import { Eyebrow, Section, SectionHeading } from "@/components/section"
import type { Dictionary } from "@/app/[lang]/dictionaries"

const CALENDLY_URL =
  "https://calendly.com/justinli-meriqai/30min?primary_color=0080a3&hide_gdpr_banner=1"

export function CTA({ cta }: { cta: Dictionary["cta"] }) {
  return (
    <Section id="book" className="scroll-mt-20">
      <div className="mx-auto max-w-2xl text-center">
        <BlurFade delay={0.05} className="flex justify-center">
          <Eyebrow>{cta.eyebrow}</Eyebrow>
        </BlurFade>
        <BlurFade delay={0.1}>
          <SectionHeading className="mt-4">{cta.title}</SectionHeading>
        </BlurFade>
        <BlurFade delay={0.16}>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
            {cta.subtitle}
          </p>
        </BlurFade>
      </div>

      <BlurFade delay={0.2}>
        <div className="mx-auto mt-10 max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <CalendlyInline url={CALENDLY_URL} height={600} />
        </div>
        <p className="mx-auto mt-5 max-w-xl text-center text-sm text-muted-foreground">
          {cta.note}
        </p>
      </BlurFade>
    </Section>
  )
}
