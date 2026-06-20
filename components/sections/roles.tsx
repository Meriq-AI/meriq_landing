import Image from "next/image"
import { Check, Stamp, Truck, type LucideIcon } from "lucide-react"

import { BlurFade } from "@/components/ui/blur-fade"
import { Eyebrow, Section, SectionHeading } from "@/components/section"
import type { Dictionary } from "@/app/[lang]/dictionaries"

type Role = Dictionary["roles"]["forwarder"]

function RoleCard({ icon: Icon, role }: { icon: LucideIcon; role: Role }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        <h3 className="text-lg font-semibold tracking-tight">{role.label}</h3>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {role.lead}
      </p>
      <ul className="mt-5 space-y-2.5">
        {role.points.map((point) => (
          <li key={point} className="flex items-start gap-2.5 text-sm">
            <Check className="mt-0.5 size-4 shrink-0 text-success" strokeWidth={2.5} />
            <span className="text-foreground/90">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Roles({ roles }: { roles: Dictionary["roles"] }) {
  return (
    <Section id="roles">
      <div className="mx-auto max-w-2xl text-center">
        <BlurFade delay={0.05} className="flex justify-center">
          <Eyebrow>{roles.eyebrow}</Eyebrow>
        </BlurFade>
        <BlurFade delay={0.1}>
          <SectionHeading className="mt-4">{roles.title}</SectionHeading>
        </BlurFade>
        <BlurFade delay={0.16}>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
            {roles.subtitle}
          </p>
        </BlurFade>
      </div>

      <BlurFade delay={0.2}>
        <div className="mt-14 grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr]">
          <RoleCard icon={Truck} role={roles.forwarder} />

          {/* Shared-workspace connector */}
          <div className="flex flex-row items-center justify-center gap-3 lg:flex-col lg:gap-2">
            <div className="h-px flex-1 bg-border lg:h-auto lg:w-px lg:flex-1" />
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex size-12 items-center justify-center rounded-full border border-border bg-card shadow-sm">
                <Image
                  src="/meriq-mark.png"
                  alt=""
                  width={26}
                  height={26}
                  className="size-[26px]"
                  quality={100}
                  unoptimized
                />
              </div>
              <span className="font-mono text-[10px] tracking-wide text-muted-foreground whitespace-nowrap uppercase">
                {roles.sharedLabel}
              </span>
            </div>
            <div className="h-px flex-1 bg-border lg:h-auto lg:w-px lg:flex-1" />
          </div>

          <RoleCard icon={Stamp} role={roles.broker} />
        </div>
      </BlurFade>
    </Section>
  )
}
