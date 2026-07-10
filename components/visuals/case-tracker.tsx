"use client"

import { useEffect, useRef, useState } from "react"
import { useInView, useReducedMotion } from "motion/react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import type { Locale } from "@/lib/i18n/config"

/**
 * A live tracking card for one shipment file (一票): the five desk stages
 * as tracking stops, cycling on a loop while in view. Stop titles come from
 * the dictionary (values.trackerStops).
 */
export function CaseTracker({
  lang,
  stops,
}: {
  lang: Locale
  stops: string[]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.4 })
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (!inView || reduced) return
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % (stops.length + 1))
    }, 1600)
    return () => clearInterval(id)
  }, [inView, reduced, stops.length])

  // Reduced motion (or SSR): show the finished state.
  const current = reduced ? stops.length : active
  const done = current >= stops.length

  const t = {
    "zh-TW": {
      case: "一票",
      route: "KHH → OSA · 海運",
      working: "處理中",
      ready: "可寄出",
    },
    en: {
      case: "Shipment file",
      route: "KHH → OSA · ocean",
      working: "in progress",
      ready: "ready to send",
    },
  }[lang]

  return (
    <div
      ref={ref}
      className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-lg shadow-foreground/[0.05]"
      aria-hidden
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            {t.case} #SHP-2107
          </p>
          <p className="mt-1 text-[13.5px] font-semibold">{t.route}</p>
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[10.5px] font-semibold whitespace-nowrap transition-colors duration-300",
            done ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
          )}
        >
          {done ? t.ready : t.working}
        </span>
      </div>

      <ol className="mt-5">
        {stops.map((stop, i) => {
          const isDone = current > i
          const isActive = current === i
          return (
            <li key={stop} className="relative flex gap-3 pb-4 last:pb-0">
              {/* connector */}
              {i < stops.length - 1 && (
                <span
                  className="absolute top-5 left-[9px] h-[calc(100%-1.25rem)] w-px bg-border"
                  aria-hidden
                >
                  <span
                    className={cn(
                      "block w-px origin-top bg-primary transition-transform duration-500 ease-out",
                      isDone ? "h-full scale-y-100" : "h-full scale-y-0"
                    )}
                  />
                </span>
              )}
              <span
                className={cn(
                  "relative z-10 mt-0.5 flex size-[19px] shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                  isDone
                    ? "border-primary bg-primary text-primary-foreground"
                    : isActive
                      ? "border-primary bg-card"
                      : "border-border bg-card"
                )}
              >
                {isDone ? (
                  <Check className="size-2.5" strokeWidth={3.5} />
                ) : (
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      isActive
                        ? "animate-pulse bg-primary motion-reduce:animate-none"
                        : "bg-border"
                    )}
                  />
                )}
              </span>
              <span
                className={cn(
                  "text-[13px] leading-5 font-medium transition-colors duration-300",
                  isDone || isActive
                    ? "text-foreground"
                    : "text-muted-foreground/70"
                )}
              >
                {stop}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
