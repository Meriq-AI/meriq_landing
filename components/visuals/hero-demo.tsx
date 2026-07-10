"use client"

import { createContext, useContext, useRef } from "react"
import { motion, MotionConfig, useInView } from "motion/react"
import {
  ArrowRight,
  Check,
  FileText,
  FileWarning,
  Mail,
  Paperclip,
  Ship,
} from "lucide-react"

import { cn } from "@/lib/utils"
import type { Locale } from "@/lib/i18n/config"

/**
 * The hero's living demo: an inquiry email (with CI/PL attached) turns into
 * a worked shipment file — quotation drafted, docs cross-checked, reply
 * ready — on a synced 10s loop. Every element shares one duration and uses
 * keyframe `times`, so the whole scene stays in lockstep. The whole loop
 * only runs while the demo is actually in view (it is display:none on
 * mobile, and there's no point animating once scrolled past).
 */

const T = 10 // seconds per loop

const ActiveContext = createContext(true)

function Seq({
  appear,
  vanish,
  y = 10,
  className,
  children,
}: {
  /** Fraction of the loop when this element fades in. */
  appear: number
  /** Fraction when it fades out (defaults to the end-of-loop reset). */
  vanish?: number
  y?: number
  className?: string
  children: React.ReactNode
}) {
  const active = useContext(ActiveContext)
  const out = vanish ?? 0.94

  if (!active) {
    return (
      <div className={cn("opacity-0", className)} aria-hidden>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={className}
      animate={{
        opacity: [0, 0, 1, 1, 0, 0],
        y: [y, y, 0, 0, 0, y],
      }}
      transition={{
        duration: T,
        times: [
          0,
          appear,
          Math.min(appear + 0.045, 1),
          out,
          Math.min(out + 0.04, 1),
          1,
        ],
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {children}
    </motion.div>
  )
}

// The email itself stays authentic per locale: a zh/en mixed inquiry for
// zh-TW (that's what a Taiwanese forwarder's inbox looks like), plain
// English for en. Doc names stay trade English in both.
const COPY = {
  "zh-TW": {
    sender: "王小姐 · 大昌貿易",
    subject: "RE: 高雄到 Osaka 2 板 — 請報價",
    body: (
      <>
        「2 plt / 850 kg，下週五結關，能報 <b>all-in</b> 嗎？CI/PL
        附上，麻煩順便確認資料。」
      </>
    ),
    processing: "Meriq 正在讀這封詢價和附件…",
    verified: "AI 擬好 · 人只看例外",
    planTitle: "一票",
    planStatus: "待 OP 確認 1 件",
    rows: [
      { icon: FileText, text: "報價單草稿：O/F + THC + DOC 已帶入" },
      { icon: Ship, text: "S/O 欄位已從 CI/PL 帶入" },
      {
        icon: FileWarning,
        text: "核對：CI 數量 1,200 ≠ PL 1,180 — 已標記",
        warn: true,
      },
      { icon: Check, text: "給王小姐的回覆草稿已擬好" },
    ],
    footerPrimary: "寄出報價",
    footerSecondary: "例外 1 件",
  },
  en: {
    sender: "Ms. Wang · Dachang Trading",
    subject: "RE: KHH → Osaka, 2 pallets — quote?",
    body: (
      <>
        “2 plt / 850 kg, CY cutoff next Friday — can you quote <b>all-in</b>?
        CI/PL attached, please double-check the data.”
      </>
    ),
    processing: "Meriq is reading this inquiry & attachments…",
    verified: "AI drafts · people check exceptions",
    planTitle: "Shipment file",
    planStatus: "1 item for OP",
    rows: [
      { icon: FileText, text: "Quotation draft: O/F + THC + DOC filled" },
      { icon: Ship, text: "S/O fields pulled from CI/PL" },
      {
        icon: FileWarning,
        text: "Check: CI qty 1,200 ≠ PL 1,180 — flagged",
        warn: true,
      },
      { icon: Check, text: "Reply draft for Ms. Wang, ready" },
    ],
    footerPrimary: "Send quote",
    footerSecondary: "1 exception",
  },
} as const

export function HeroDemo({ lang }: { lang: Locale }) {
  const copy = COPY[lang]
  const ref = useRef<HTMLDivElement>(null)
  // display:none (mobile) never intersects, so the loop never starts there.
  const inView = useInView(ref, { amount: 0.2 })

  return (
    <MotionConfig reducedMotion="user">
      <ActiveContext.Provider value={inView}>
        <div
          ref={ref}
          aria-hidden
          className="relative mx-auto w-full max-w-md select-none"
        >
          {/* Inquiry email, CI/PL attached */}
          <Seq appear={0.03}>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-lg shadow-foreground/[0.05]">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-full bg-accent">
                  <Mail className="size-3.5 text-muted-foreground" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold">
                    {copy.sender}
                  </p>
                  <p className="truncate text-[11.5px] text-muted-foreground">
                    {copy.subject}
                  </p>
                </div>
                <span className="text-[10.5px] text-muted-foreground">
                  09:42
                </span>
              </div>
              <p className="mt-3 text-[12.5px] leading-relaxed text-foreground/80">
                {copy.body}
              </p>
              <div className="mt-3 flex gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-md bg-accent px-2 py-1 text-[10.5px] font-medium text-muted-foreground">
                  <Paperclip className="size-3" />
                  CI_0715.pdf
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-accent px-2 py-1 text-[10.5px] font-medium text-muted-foreground">
                  <Paperclip className="size-3" />
                  PL_0715.xlsx
                </span>
              </div>
            </div>
          </Seq>

          {/* Status pill: working → drafted */}
          <div className="relative z-10 -my-2.5 flex justify-center">
            <Seq appear={0.14} vanish={0.4} y={4} className="absolute">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[11.5px] font-medium text-muted-foreground shadow-md">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-1 animate-[vignette-dot_1.2s_ease-in-out_infinite] rounded-full bg-primary motion-reduce:animate-none"
                    style={{ animationDelay: `${i * 0.18}s` }}
                  />
                ))}
                {copy.processing}
              </span>
            </Seq>
            <Seq appear={0.44} y={4}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-[11.5px] font-semibold text-primary shadow-md backdrop-blur-sm">
                <Check className="size-3.5" />
                {copy.verified}
              </span>
            </Seq>
          </div>

          {/* Shipment file card */}
          <Seq appear={0.22} className="mt-2">
            <div className="animate-[hero-float_7s_ease-in-out_infinite] rounded-2xl border border-border bg-card p-4 shadow-xl shadow-primary/10 motion-reduce:animate-none">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[13px] font-semibold">
                  {copy.planTitle}{" "}
                  <span className="font-mono text-[11px] font-medium text-muted-foreground">
                    #SHP-2107
                  </span>
                </p>
                <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[10.5px] font-semibold text-warning">
                  {copy.planStatus}
                </span>
              </div>
              <ul className="mt-3 space-y-1.5">
                {copy.rows.map((row, i) => {
                  const Icon = row.icon
                  const warn = "warn" in row && row.warn
                  return (
                    // li wraps Seq (not vice versa) — ul > div > li is invalid DOM
                    <li key={row.text}>
                      <Seq appear={0.3 + i * 0.07} y={6}>
                        <div className="flex items-center gap-2.5 rounded-lg bg-surface px-2.5 py-2 text-[12px] leading-snug font-medium ring-1 ring-border/70">
                          <span
                            className={cn(
                              "flex size-5 shrink-0 items-center justify-center rounded-full",
                              warn
                                ? "bg-warning/15 text-warning"
                                : "bg-primary/10 text-primary"
                            )}
                          >
                            <Icon className="size-3" />
                          </span>
                          {row.text}
                        </div>
                      </Seq>
                    </li>
                  )
                })}
              </ul>
              <Seq appear={0.62} y={6}>
                <div className="mt-3 flex gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground shadow-sm">
                    {copy.footerPrimary}
                    <ArrowRight className="size-3" />
                  </span>
                  <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-medium text-foreground/75">
                    {copy.footerSecondary}
                  </span>
                </div>
              </Seq>
            </div>
          </Seq>
        </div>
      </ActiveContext.Provider>
    </MotionConfig>
  )
}
