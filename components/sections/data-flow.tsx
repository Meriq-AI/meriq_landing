"use client"

import { createRef, useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import {
  Award,
  Check,
  ClipboardCheck,
  ClipboardList,
  FlaskConical,
  Image as ImageIcon,
  Layers,
  Mail,
  MessagesSquare,
  ReceiptText,
  Ship,
  Workflow,
  type LucideIcon,
} from "lucide-react"

import { BlurFade } from "@/components/ui/blur-fade"
import { Eyebrow, Section, SectionHeading } from "@/components/section"
import type { Dictionary } from "@/app/[lang]/dictionaries"

const INPUT_ICONS: LucideIcon[] = [
  ReceiptText,
  ClipboardList,
  Ship,
  Award,
  FlaskConical,
  ImageIcon,
  Mail,
  MessagesSquare,
]

const LAYER_ICONS: LucideIcon[] = [Layers, Workflow, ClipboardCheck]

function useNodeRefs(n: number) {
  return useMemo(
    () => Array.from({ length: n }, () => createRef<HTMLDivElement>()),
    [n]
  )
}

export function DataFlow({ flow }: { flow: Dictionary["flow"] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const leftHubRef = useRef<HTMLDivElement>(null)
  const rightHubRef = useRef<HTMLDivElement>(null)
  const inputRefs = useNodeRefs(flow.inputs.length)
  const outcomeRefs = useNodeRefs(flow.outcomes.length)

  const [beamsOn, setBeamsOn] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)")
    const update = () => setBeamsOn(mq.matches)
    const raf = requestAnimationFrame(update)
    mq.addEventListener("change", update)
    return () => {
      cancelAnimationFrame(raf)
      mq.removeEventListener("change", update)
    }
  }, [])

  // Self-drawn connectors: anchor exactly at chip edges and the card hubs, so
  // the lines always land precisely (unlike center-to-center beams).
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [links, setLinks] = useState<{ d: string; i: number }[]>([])

  useEffect(() => {
    if (!beamsOn) return
    const container = containerRef.current
    if (!container) return

    const curve = (x1: number, y1: number, x2: number, y2: number) => {
      // Keep control points within the horizontal span so they never cross
      // (which would kink the line); short tangents give clean, direct rays.
      const dx = Math.min(Math.abs(x2 - x1) * 0.45, 26)
      return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`
    }

    const compute = () => {
      const cr = container.getBoundingClientRect()
      const center = (r: DOMRect) => ({
        x: r.left + r.width / 2 - cr.left,
        y: r.top + r.height / 2 - cr.top,
      })
      const hl = leftHubRef.current?.getBoundingClientRect()
      const hr = rightHubRef.current?.getBoundingClientRect()
      if (!hl || !hr) return
      const lh = center(hl)
      const rh = center(hr)
      const next: { d: string; i: number }[] = []

      inputRefs.forEach((ref, i) => {
        const b = ref.current?.getBoundingClientRect()
        if (!b) return
        const sx = b.right - cr.left
        const sy = b.top + b.height / 2 - cr.top
        next.push({ d: curve(sx, sy, lh.x, lh.y), i })
      })
      outcomeRefs.forEach((ref, i) => {
        const b = ref.current?.getBoundingClientRect()
        if (!b) return
        const ex = b.left - cr.left
        const ey = b.top + b.height / 2 - cr.top
        next.push({ d: curve(rh.x, rh.y, ex, ey), i: inputRefs.length + i })
      })

      setSize({ w: cr.width, h: cr.height })
      setLinks(next)
    }

    const raf = requestAnimationFrame(compute)
    const ro = new ResizeObserver(compute)
    ro.observe(container)
    window.addEventListener("resize", compute)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener("resize", compute)
    }
  }, [beamsOn, inputRefs, outcomeRefs])

  return (
    <Section id="how">
      <div className="mx-auto max-w-2xl text-center">
        <BlurFade delay={0.05} className="flex justify-center">
          <Eyebrow>{flow.eyebrow}</Eyebrow>
        </BlurFade>
        <BlurFade delay={0.1}>
          <SectionHeading className="mt-4">{flow.title}</SectionHeading>
        </BlurFade>
        <BlurFade delay={0.16}>
          <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground">
            {flow.subtitle}
          </p>
        </BlurFade>
      </div>

      <BlurFade delay={0.2}>
        <div
          ref={containerRef}
          className="relative mx-auto mt-16 grid max-w-5xl grid-cols-1 items-center gap-y-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)_minmax(0,0.85fr)] lg:gap-x-12"
        >
          {/* Left — fragmented inputs */}
          <div>
            <ColumnLabel>{flow.inputsLabel}</ColumnLabel>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1 lg:gap-2.5">
              {flow.inputs.map((label, i) => {
                const Icon = INPUT_ICONS[i % INPUT_ICONS.length]
                return (
                  <div
                    key={label}
                    ref={inputRefs[i]}
                    className="z-10 flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm"
                  >
                    <Icon className="size-4 shrink-0 text-muted-foreground" />
                    <span className="text-[13px] leading-tight font-medium text-foreground/90">
                      {label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Center — Meriq platform */}
          <div className="relative z-10 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <span
              ref={leftHubRef}
              className="absolute top-1/2 left-0 z-20 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
              aria-hidden
            />
            <span
              ref={rightHubRef}
              className="absolute top-1/2 right-0 z-20 size-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
              aria-hidden
            />

            {/* header — logo + wordmark, centered */}
            <div className="flex items-center justify-center gap-3 border-b border-border px-5 py-6">
              <Image
                src="/meriq-mark.png"
                alt=""
                width={40}
                height={40}
                className="size-10"
                quality={100}
                unoptimized
              />
              <span className="text-2xl font-semibold tracking-tight">
                Meriq
              </span>
            </div>

            {/* layers */}
            <div className="space-y-2.5 p-3.5">
              {flow.layers.map((layer, i) => {
                const Icon = LAYER_ICONS[i % LAYER_ICONS.length]
                return (
                  <div
                    key={layer.title}
                    className="rounded-xl border border-border/60 bg-muted/40 p-3.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
                        <Icon className="size-4" />
                      </span>
                      <p className="text-sm font-semibold">{layer.title}</p>
                    </div>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
                      {layer.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right — outcomes */}
          <div>
            <ColumnLabel>{flow.outcomesLabel}</ColumnLabel>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-1 lg:gap-2.5">
              {flow.outcomes.map((label, i) => (
                <div
                  key={label}
                  ref={outcomeRefs[i]}
                  className="z-10 flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm"
                >
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  <span className="text-[13px] leading-tight font-medium text-foreground/90">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Self-drawn connectors (desktop only) */}
          {beamsOn && links.length > 0 && (
            <svg
              className="pointer-events-none absolute inset-0 z-0"
              width={size.w}
              height={size.h}
              viewBox={`0 0 ${size.w} ${size.h}`}
              fill="none"
              aria-hidden
            >
              {links.map((link) => (
                <path
                  key={link.i}
                  d={link.d}
                  stroke="var(--primary)"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  opacity={0.35}
                />
              ))}
            </svg>
          )}
        </div>
      </BlurFade>
    </Section>
  )
}

function ColumnLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 font-mono text-[11px] tracking-widest text-muted-foreground/70 uppercase lg:text-center">
      {children}
    </p>
  )
}
