"use client"

import { motion, type Variants } from "motion/react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Meriq's own visual language for the values timeline: the paperwork of a
 * forwarder's desk itself. Each value renders as a physical artifact — a
 * drafted quotation sheet, a cross-document check report, a stack of triage
 * stubs — animated in on scroll with rubber-stamp pops. Copy inside the
 * artifacts stays hardcoded trade English by convention (O/F, THC, CI/PL,
 * pre-alert).
 */

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.22, delayChildren: 0.1 } },
}

const rise: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
}

const stampPop: Variants = {
  hidden: { opacity: 0, scale: 1.7, rotate: -18 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: -8,
    transition: { type: "spring", stiffness: 320, damping: 16 },
  },
}

/** Rubber stamp — mono, boxed, slightly rotated, inked. */
function Stamp({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.span
      variants={stampPop}
      className={cn(
        "pointer-events-none absolute z-10 rounded-md border-2 border-primary/70 px-2 py-0.5 font-mono text-[10px] font-bold tracking-[0.2em] text-primary/80 uppercase mix-blend-multiply",
        className
      )}
    >
      {children}
    </motion.span>
  )
}

/** A sheet of paper: white, shadowed, slightly rotated off-axis. */
function Sheet({
  rotate = "-rotate-1",
  className,
  children,
}: {
  rotate?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      className={cn(
        "relative w-full max-w-sm rounded-sm bg-card p-5 shadow-[0_1px_2px_oklch(0.17_0.012_260/0.06),0_12px_28px_-12px_oklch(0.17_0.012_260/0.18)] ring-1 ring-border/80",
        rotate,
        className
      )}
    >
      {children}
    </motion.div>
  )
}

function SheetHeading({ children }: { children: React.ReactNode }) {
  return (
    <motion.p
      variants={rise}
      className="border-b border-dashed border-border pb-2 font-mono text-[10px] font-semibold tracking-[0.22em] text-muted-foreground uppercase"
    >
      {children}
    </motion.p>
  )
}

/* 01 快 — quotation sheet, drafted from the inquiry in minutes */
export function ArtifactQuote() {
  const rows = [
    ["O/F · KHH → OSA", "$1,150"],
    ["THC", "$180"],
    ["DOC", "$45"],
  ]
  return (
    <Sheet rotate="-rotate-1">
      <Stamp className="-top-2.5 right-3">Draft · 4 min</Stamp>
      <SheetHeading>Quotation · #SHP-2107</SheetHeading>
      <div className="mt-3 space-y-1">
        {rows.map(([k, v]) => (
          <motion.div
            key={k}
            variants={rise}
            className="flex items-baseline justify-between gap-3 font-mono text-[11.5px]"
          >
            <span className="whitespace-nowrap text-muted-foreground">
              {k}
            </span>
            {/* dotted leader as a border (a repeated-char string blows up the
                column's min-content on mobile) */}
            <span
              className="mx-1 mb-0.5 flex-1 self-end border-b border-dotted border-muted-foreground/40"
              aria-hidden
            />
            <span className="tabular-nums">{v}</span>
          </motion.div>
        ))}
        <motion.div
          variants={rise}
          className="mt-2 flex items-baseline justify-between border-t border-dashed border-border pt-2 font-mono text-[12.5px] font-bold"
        >
          <span>ALL-IN</span>
          <span className="tabular-nums">$1,375</span>
        </motion.div>
        <motion.p
          variants={rise}
          className="pt-1.5 font-mono text-[10.5px] text-muted-foreground"
        >
          rate sheet OCT applied · reply draft EN attached
        </motion.p>
      </div>
    </Sheet>
  )
}

/* 02 準 — cross-document check report, one mismatch caught */
export function ArtifactCrosscheck() {
  const checks = [
    { label: "Consignee · CI = PL = HB/L", ok: true },
    { label: "Marks & numbers", ok: true },
    { label: "G.W. 850 kg", ok: true },
  ]
  return (
    <Sheet rotate="rotate-1">
      <Stamp className="right-2 bottom-8">1 exception</Stamp>
      <SheetHeading>Doc check · CI / PL / HB/L</SheetHeading>
      <div className="mt-3 space-y-1.5">
        {checks.map((check) => (
          <motion.div
            key={check.label}
            variants={rise}
            className="flex items-center gap-2.5 font-mono text-[11.5px]"
          >
            <span className="flex size-3.5 items-center justify-center rounded-[3px] border border-foreground/60 text-foreground">
              <Check className="size-2.5" strokeWidth={3.5} />
            </span>
            <span>{check.label}</span>
          </motion.div>
        ))}
        <motion.div
          variants={rise}
          className="mt-2.5 rounded-sm border border-dashed border-warning/60 bg-warning/[0.07] px-2.5 py-1.5 font-mono text-[11px] font-medium text-warning"
        >
          CI qty 1,200 ≠ PL 1,180 → flagged for OP
        </motion.div>
      </div>
    </Sheet>
  )
}

/* 03 不加人 — triage stubs: the machine ran the batch, one goes to the OP */
export function ArtifactTriage() {
  const stubs = [
    { to: "AUTO ×11", body: "Drafted & sent", accent: false },
    { to: "OP ×1", body: "Exception · CI/PL qty", accent: true },
    { to: "PRE-ALERT", body: "Queued → agent", accent: false },
  ]
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      className="flex w-full max-w-md flex-col gap-1.5 sm:flex-row"
    >
      {stubs.map((stub, i) => (
        <motion.div
          key={stub.to}
          variants={{
            hidden: { opacity: 0, x: -10 },
            visible: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.35, ease: "easeOut", delay: i * 0.18 },
            },
          }}
          className={cn(
            "relative flex-1 rounded-sm p-3.5 shadow-[0_1px_2px_oklch(0.17_0.012_260/0.06),0_10px_22px_-12px_oklch(0.17_0.012_260/0.16)] ring-1",
            stub.accent
              ? "bg-primary text-primary-foreground ring-primary"
              : "bg-card ring-border/80",
            i > 0 &&
              "sm:before:absolute sm:before:inset-y-1 sm:before:-left-[4.5px] sm:before:border-l sm:before:border-dashed sm:before:border-muted-foreground/40"
          )}
        >
          <p
            className={cn(
              "font-mono text-[9.5px] font-semibold tracking-[0.2em] uppercase",
              stub.accent
                ? "text-primary-foreground/70"
                : "text-muted-foreground"
            )}
          >
            {stub.to}
          </p>
          <p className="mt-1.5 font-mono text-[11.5px] font-semibold">
            {stub.body}
          </p>
        </motion.div>
      ))}
    </motion.div>
  )
}
