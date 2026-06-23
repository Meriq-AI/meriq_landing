"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowUp, Check, MessageSquare } from "lucide-react"
import { motion, useInView, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import type { Dictionary } from "@/app/[lang]/dictionaries"

type Watch = Dictionary["watch"]

const DOT: Record<string, string> = {
  fail: "bg-destructive",
  warn: "bg-warning",
  review: "bg-warning",
  missing: "bg-muted-foreground/40",
}

// Rail stages complete for a given number of revealed chat items (11-beat script, 7 stages).
// …6 questions · 7 q · 8 done · 9 q "tell the customer?" · 10 customer status draft → ready.
function stagesDone(vc: number) {
  if (vc >= 11) return 7
  if (vc >= 7) return 5
  if (vc >= 5) return 4
  if (vc >= 2) return 3
  if (vc >= 1) return 2
  return 0
}

export function AgentDemo({ watch }: { watch: Watch }) {
  const reduced = useReducedMotion() ?? false
  const windowRef = useRef<HTMLDivElement>(null)
  const inView = useInView(windowRef, { margin: "-80px" })

  const [visible, setVisible] = useState(0)
  const [typing, setTyping] = useState(false)
  // Pause the loop while the user is reading (hover / focus within the window).
  const pausedRef = useRef(false)

  useEffect(() => {
    if (!inView || reduced) return

    let i = 0
    const timers: ReturnType<typeof setTimeout>[] = []
    const at = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms))
    // Hold the sequence while paused (don't advance or restart mid-read).
    const run = (fn: () => void) => {
      if (pausedRef.current) at(() => run(fn), 250)
      else fn()
    }

    const next = () => {
      if (i >= watch.chat.length) {
        // Hold on the finished result ~8s, then loop from the top.
        at(
          () =>
            run(() => {
              i = 0
              setVisible(0)
              setTyping(false)
              at(() => run(next), 600)
            }),
          8000
        )
        return
      }
      const isAgent = watch.chat[i].from !== "user"
      if (isAgent) {
        setTyping(true)
        at(
          () =>
            run(() => {
              setTyping(false)
              setVisible(i + 1)
              i += 1
              at(() => run(next), 600)
            }),
          1000
        )
      } else {
        at(
          () =>
            run(() => {
              setVisible(i + 1)
              i += 1
              at(() => run(next), 500)
            }),
          750
        )
      }
    }

    at(
      () =>
        run(() => {
          setVisible(0)
          setTyping(false)
          next()
        }),
      300
    )
    return () => timers.forEach(clearTimeout)
  }, [inView, reduced, watch.chat])

  const shown = reduced ? watch.chat.length : visible
  const showTyping = reduced ? false : typing
  const done = stagesDone(shown)
  const ready = done >= watch.rail.length
  const currentStage = watch.rail[Math.min(done, watch.rail.length - 1)]

  return (
    <div>
      <div
        ref={windowRef}
        onMouseEnter={() => {
          pausedRef.current = true
        }}
        onMouseLeave={() => {
          pausedRef.current = false
        }}
        onFocus={() => {
          pausedRef.current = true
        }}
        onBlur={() => {
          pausedRef.current = false
        }}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-border bg-card text-left shadow-[0_30px_90px_-40px] shadow-primary/30",
          !reduced && "cursor-pause"
        )}
      >
        {/* Window header */}
        <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-4 py-3 sm:px-5">
          <div className="hidden gap-1.5 sm:flex" aria-hidden>
            <span className="size-3 rounded-full bg-muted-foreground/20" />
            <span className="size-3 rounded-full bg-muted-foreground/20" />
            <span className="size-3 rounded-full bg-muted-foreground/20" />
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-sm font-semibold">
              {watch.caseTitle}
            </span>
            <span className="hidden text-muted-foreground/40 sm:inline">·</span>
            <span className="hidden truncate text-[13px] text-muted-foreground sm:inline">
              {watch.caseSub}
            </span>
          </div>
          <StatusPill
            ready={ready}
            workingLabel={watch.statusWorking}
            readyLabel={watch.statusReady}
          />
        </div>

        <div className="grid lg:grid-cols-[248px_1fr]">
          {/* Left rail */}
          <aside className="hidden border-r border-border bg-muted/20 p-5 lg:block">
            <p className="font-mono text-[11px] tracking-widest text-muted-foreground/70 uppercase">
              {watch.railLabel}
            </p>
            <ol className="mt-4">
              {watch.rail.map((s, i) => (
                <RailStage
                  key={s.title}
                  title={s.title}
                  sub={s.sub}
                  state={i < done ? "done" : i === done ? "active" : "pending"}
                  last={i === watch.rail.length - 1}
                />
              ))}
            </ol>
          </aside>

          {/* Chat */}
          <div className="flex flex-col bg-card">
            {/* Mobile progress strip */}
            <div className="border-b border-border px-4 py-3 lg:hidden">
              <div className="flex items-center gap-1.5">
                {watch.rail.map((s, i) => (
                  <span
                    key={s.title}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-colors",
                      i < done
                        ? "bg-primary"
                        : i === done
                          ? "bg-primary/40"
                          : "bg-border"
                    )}
                  />
                ))}
              </div>
              <p className="mt-2 text-[12px] font-medium text-muted-foreground">
                {currentStage.title}
              </p>
            </div>

            {/* Transcript — fixed height, bottom-anchored, older messages clip */}
            <div className="relative flex h-[440px] flex-col justify-end gap-3.5 overflow-hidden px-5 py-4 sm:h-[500px] sm:px-6">
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-card to-transparent" />
              {watch.chat.slice(0, shown).map((m, idx) => {
                if (m.from === "card")
                  return (
                    <Reveal key={idx} reduced={reduced} className="sm:ml-[42px]">
                      <ClassificationCard
                        label={watch.blockersLabel}
                        items={watch.blockers}
                      />
                    </Reveal>
                  )
                if (m.from === "status")
                  return (
                    <Reveal key={idx} reduced={reduced} className="sm:ml-[42px]">
                      <CustomerStatusCard
                        label={watch.statusLabel}
                        text={m.text}
                      />
                    </Reveal>
                  )
                return (
                  <Reveal key={idx} reduced={reduced}>
                    <ChatRow from={m.from} text={m.text} />
                  </Reveal>
                )
              })}
              {showTyping && <Typing />}
            </div>

            {/* Prompt chips + composer */}
            <div className="border-t border-border px-4 py-3.5 sm:px-5">
              <div className="mb-2.5 flex flex-wrap gap-1.5">
                {watch.chips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    className="cursor-pointer rounded-full border border-border bg-foreground/[0.03] px-2.5 py-1 text-[11.5px] text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-foreground"
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-border bg-foreground/[0.04] px-3 py-2.5 shadow-sm transition-colors focus-within:border-primary/50 focus-within:bg-foreground/[0.06]">
                <MeriqAvatar size={22} />
                <span className="flex-1 truncate text-[13px] text-muted-foreground/60">
                  {watch.composer}
                </span>
                <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-105">
                  <ArrowUp className="size-3.5" strokeWidth={2.5} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-3 max-w-2xl text-center text-[12px] text-muted-foreground">
        {watch.note}
      </p>
    </div>
  )
}

/* ── Sub-components (module-level so revealed rows keep identity across ticks) ── */

function StatusPill({
  ready,
  workingLabel,
  readyLabel,
}: {
  ready: boolean
  workingLabel: string
  readyLabel: string
}) {
  return (
    <span
      className={cn(
        "ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors",
        ready
          ? "bg-primary/10 text-primary"
          : "border border-warning/25 bg-warning/10 text-warning"
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          ready ? "bg-primary" : "bg-warning motion-safe:animate-pulse"
        )}
        aria-hidden
      />
      {ready ? readyLabel : workingLabel}
    </span>
  )
}

function RailStage({
  title,
  sub,
  state,
  last,
}: {
  title: string
  sub: string
  state: "done" | "active" | "pending"
  last: boolean
}) {
  return (
    <li className="relative flex gap-3 pb-5 last:pb-0">
      {!last && (
        <span
          className={cn(
            "absolute top-[26px] bottom-1 left-[11px] w-px",
            state === "done" ? "bg-primary/40" : "bg-border"
          )}
          aria-hidden
        />
      )}
      <span
        className={cn(
          "z-10 flex size-[22px] shrink-0 items-center justify-center rounded-full transition-colors",
          state === "done" && "bg-primary text-primary-foreground",
          state === "active" && "border-2 border-primary bg-primary/10",
          state === "pending" && "border-2 border-border bg-card"
        )}
        aria-hidden
      >
        {state === "done" ? (
          <Check className="size-3" strokeWidth={3} />
        ) : state === "active" ? (
          <span className="size-2 rounded-full bg-primary motion-safe:animate-pulse" />
        ) : null}
      </span>
      <div className="min-w-0">
        <p
          className={cn(
            "text-[13.5px] font-medium",
            state === "pending" ? "text-muted-foreground/60" : "text-foreground"
          )}
        >
          {title}
        </p>
        <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground">
          {sub}
        </p>
      </div>
    </li>
  )
}

function MeriqAvatar({ size = 28 }: { size?: number }) {
  return (
    <Image
      src="/meriq-mark.png"
      alt=""
      width={size}
      height={size}
      className="shrink-0"
      style={{ width: size, height: size }}
      quality={100}
      unoptimized
    />
  )
}

function ChatRow({ from, text }: { from: string; text: string }) {
  const isUser = from === "user"
  return (
    <div
      className={cn("flex items-start gap-2.5", isUser && "flex-row-reverse")}
    >
      {isUser ? (
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-foreground text-[12px] font-semibold text-background">
          Y
        </span>
      ) : (
        <MeriqAvatar />
      )}
      <div
        className={cn(
          "max-w-[82%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed whitespace-pre-line",
          isUser
            ? "rounded-tr-sm bg-foreground text-background"
            : "rounded-tl-sm bg-muted/60 text-foreground"
        )}
      >
        {text}
      </div>
    </div>
  )
}

function ClassificationCard({
  label,
  items,
}: {
  label: string
  items: Watch["blockers"]
}) {
  return (
    <div className="max-w-md overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-4 py-2.5">
        <span className="font-mono text-[11px] tracking-widest text-muted-foreground/70 uppercase">
          {label}
        </span>
      </div>
      <ul className="divide-y divide-border/60">
        {items.map((b) => (
          <li key={b.title} className="flex items-start gap-3 px-4 py-3">
            <span
              className={cn(
                "mt-[5px] size-2 shrink-0 rounded-full",
                DOT[b.state] ?? "bg-muted-foreground"
              )}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-foreground">
                {b.title}
              </p>
              <p className="mt-0.5 text-[12.5px] leading-snug text-muted-foreground">
                {b.desc}
              </p>
            </div>
            <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {b.tag}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CustomerStatusCard({
  label,
  text,
}: {
  label: string
  text: string
}) {
  return (
    <div className="max-w-md overflow-hidden rounded-xl border border-primary/30 bg-primary/[0.06] shadow-sm">
      <div className="flex items-center gap-1.5 border-b border-primary/20 px-4 py-2">
        <MessageSquare className="size-3.5 text-primary" />
        <span className="font-mono text-[11px] tracking-widest text-primary uppercase">
          {label}
        </span>
      </div>
      <p className="px-4 py-3 text-[13px] leading-relaxed whitespace-pre-line text-foreground">
        {text}
      </p>
    </div>
  )
}

function Typing() {
  return (
    <div className="flex items-start gap-2.5">
      <MeriqAvatar />
      <div className="rounded-2xl rounded-tl-sm bg-muted/60 px-4 py-3.5">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-1.5 rounded-full bg-muted-foreground/50 motion-safe:animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function Reveal({
  reduced,
  className,
  children,
}: {
  reduced: boolean
  className?: string
  children: React.ReactNode
}) {
  if (reduced) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}
