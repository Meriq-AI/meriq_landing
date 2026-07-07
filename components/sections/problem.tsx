import { BlurFade } from "@/components/ui/blur-fade"
import { Eyebrow, Section, SectionHeading } from "@/components/section"
import type { Dictionary } from "@/app/[lang]/dictionaries"

export function Problem({ problem }: { problem: Dictionary["problem"] }) {
  return (
    <Section id="problem">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <BlurFade delay={0.05}>
            <Eyebrow>{problem.eyebrow}</Eyebrow>
          </BlurFade>
          <BlurFade delay={0.1}>
            <SectionHeading className="mt-4">{problem.title}</SectionHeading>
          </BlurFade>
          <BlurFade delay={0.16}>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {problem.intro}
            </p>
          </BlurFade>
        </div>

        <BlurFade delay={0.16}>
          <ul className="divide-y divide-border border-y border-border">
            {problem.items.map((item, i) => (
              <li key={item} className="flex gap-5 py-5">
                <span
                  className="font-mono text-sm leading-7 font-medium text-muted-foreground/60 tabular-nums"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[15px] leading-7 text-pretty text-foreground/85">
                  {item}
                </p>
              </li>
            ))}
          </ul>
        </BlurFade>
      </div>

      {/* Punchline */}
      <BlurFade delay={0.2}>
        <div className="mt-20 text-center sm:mt-28">
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {problem.punchLead}
          </p>
          <p className="mx-auto mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
            {problem.punchEmph}
          </p>
        </div>
      </BlurFade>
    </Section>
  )
}
