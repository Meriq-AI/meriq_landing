import { BlurFade } from "@/components/ui/blur-fade"
import { Eyebrow, Section, SectionHeading } from "@/components/section"
import { CaseTracker } from "@/components/visuals/case-tracker"
import {
  ArtifactDocs,
  ArtifactHandoff,
  ArtifactQuotes,
  ArtifactReceipt,
  ArtifactRfq,
} from "@/components/visuals/paper-artifacts"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/app/[lang]/dictionaries"

const ARTIFACTS = [
  ArtifactRfq,
  ArtifactQuotes,
  ArtifactReceipt,
  ArtifactDocs,
  ArtifactHandoff,
]

/**
 * One case, worked start to finish: a live tracking card on the left, and on
 * the right the actual paperwork of each stage — forms, stamps, receipts,
 * tickets. Trade paperwork as the visual language (not app-UI cards).
 */
export function Capabilities({
  capabilities,
  lang,
}: {
  capabilities: Dictionary["capabilities"]
  lang: Locale
}) {
  return (
    <Section id="capabilities">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        {/* Sticky rail: heading + live case tracker */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <BlurFade delay={0.05}>
            <Eyebrow>{capabilities.eyebrow}</Eyebrow>
          </BlurFade>
          <BlurFade delay={0.1}>
            <SectionHeading className="mt-4 sm:text-[2.35rem] sm:leading-[1.15]">
              {capabilities.title}
            </SectionHeading>
          </BlurFade>
          <BlurFade delay={0.18} className="mt-8 hidden lg:block">
            <CaseTracker
              lang={lang}
              stops={capabilities.items.map((item) => item.title)}
            />
          </BlurFade>
        </div>

        {/* The desk's paper trail */}
        <ol className="relative space-y-14 border-l border-border pl-8 sm:pl-12">
          {capabilities.items.map((item, i) => {
            const Artifact = ARTIFACTS[i % ARTIFACTS.length]
            return (
              <li key={item.num} className="relative">
                <span
                  className="absolute top-0 -left-8 flex size-7 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-card font-mono text-[11px] font-semibold text-primary shadow-sm sm:-left-12"
                  aria-hidden
                >
                  {item.num}
                </span>
                <BlurFade delay={0.08}>
                  <h3 className="text-xl font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-md text-[14.5px] leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </BlurFade>
                <div className="mt-5">
                  <Artifact />
                </div>
                <BlurFade delay={0.12}>
                  <ul className="mt-5 flex max-w-md flex-wrap gap-x-4 gap-y-1.5">
                    {item.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-center gap-1.5 text-[13px] text-muted-foreground"
                      >
                        <span
                          className="size-1 rounded-full bg-primary/60"
                          aria-hidden
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm font-medium text-primary">
                    {item.note}
                  </p>
                </BlurFade>
              </li>
            )
          })}
        </ol>
      </div>
    </Section>
  )
}
