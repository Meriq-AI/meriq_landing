"use client"

import { motion, MotionConfig } from "motion/react"

import { NoiseTexture } from "@/components/ui/noise-texture"
import { cn } from "@/lib/utils"
import type { Dictionary } from "@/app/[lang]/dictionaries"

/** each line surfaces as it scrolls into view — blur-in, once */
function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -18% 0px" }}
      transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98], delay }}
    >
      {children}
    </motion.div>
  )
}

/**
 * The brand's stance, not a pain quiz: a dark rounded stage in the same
 * grainy-gradient language as the hero card, a narrow left-aligned column
 * with generous air, each paragraph surfacing on scroll. Only three phrases
 * carry color. Replaces the old pain cards until real pilot numbers earn a
 * results section.
 */
export function Belief({ belief }: { belief: Dictionary["belief"] }) {
  return (
    <MotionConfig reducedMotion="user">
      <section id="belief" className="px-3 py-2 sm:px-4">
        <div
          className={cn(
            "relative overflow-hidden rounded-[1.75rem] bg-foreground text-white sm:rounded-[2.5rem]"
          )}
        >
          {/* hero-grade atmosphere, inverted: cyan embers + noise on ink */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_65%_at_12%_-5%,oklch(0.715_0.143_215/0.22)_0%,transparent_58%),radial-gradient(70%_60%_at_95%_115%,oklch(0.715_0.143_215/0.16)_0%,transparent_60%),radial-gradient(50%_40%_at_60%_50%,oklch(0.4_0.08_222/0.25)_0%,transparent_70%)]"
          />
          {/* heavier frosted grain — full-bleed, no mask */}
          <NoiseTexture
            frequency={0.6}
            octaves={5}
            slope={0.14}
            className="opacity-50"
          />

          <div className="relative mx-auto w-full max-w-[52rem] px-6 py-24 sm:py-36">
            <Reveal>
              <p className="font-mono text-[11px] font-bold tracking-[0.28em] text-primary uppercase">
                {belief.eyebrow}
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="mt-7 font-display text-3xl leading-[1.25] font-semibold tracking-tight text-balance sm:text-5xl sm:leading-[1.2]">
                {belief.titleLead}
                <span className="text-primary">{belief.titleEmph}</span>
              </h2>
            </Reveal>

            <div className="mt-14 space-y-10 text-lg leading-[1.9] text-white/70 sm:text-xl sm:leading-[1.9]">
              <Reveal>
                <p>
                  {belief.p1Lead}
                  <span className="font-medium text-white">
                    {belief.p1Emph}
                  </span>
                  {belief.p1End}
                </p>
              </Reveal>

              <Reveal>
                <p>{belief.p2}</p>
              </Reveal>

              <Reveal>
                <p className="font-display text-2xl leading-snug font-semibold tracking-tight text-primary sm:text-3xl">
                  {belief.p3}
                </p>
              </Reveal>

              <Reveal>
                <p>
                  {belief.p4Lead}
                  <span className="font-medium text-white">
                    {belief.p4Emph}
                  </span>
                  {belief.p4End}
                </p>
              </Reveal>
            </div>

            <Reveal>
              <p className="mt-14 border-t border-white/10 pt-8 text-base leading-relaxed text-white/50">
                {belief.closing}
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </MotionConfig>
  )
}
