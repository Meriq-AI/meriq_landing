"use client"

import { motion, type Variants } from "motion/react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Meriq's own visual language for the capabilities timeline: the paperwork of
 * trade itself. Each stage renders as a physical artifact — an RFQ form, a
 * stamped quote sheet, a landed-cost till receipt, a checklist form, a
 * perforated handoff ticket — animated in on scroll with rubber-stamp pops.
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

/* 01 — export RFQ form, fields filled in, gaps flagged */
export function ArtifactRfq() {
  const fields = [
    ["Origin", "Taichung, TW"],
    ["Destination", "Dallas, TX · USA"],
    ["Incoterm", "DDP"],
    ["Cargo", "2 plt · 640 kg · non-DG"],
    ["Ready date", "Aug 15"],
  ]
  return (
    <Sheet rotate="-rotate-1">
      <Stamp className="-top-2.5 right-3">Drafted</Stamp>
      <SheetHeading>Export RFQ · #EXP-0341</SheetHeading>
      <div className="mt-3 space-y-1.5">
        {fields.map(([k, v]) => (
          <motion.div
            key={k}
            variants={rise}
            className="flex items-baseline justify-between gap-4 font-mono text-[11.5px]"
          >
            <span className="text-muted-foreground">{k}</span>
            <span className="font-semibold text-foreground">{v}</span>
          </motion.div>
        ))}
        <motion.div
          variants={rise}
          className="mt-2.5 rounded-sm border border-dashed border-warning/60 bg-warning/[0.07] px-2.5 py-1.5 font-mono text-[11px] font-medium text-warning"
        >
          MISSING → carton dims · MSDS
        </motion.div>
      </div>
    </Sheet>
  )
}

/* 02 — quote comparison sheet with a BEST FIT stamp */
export function ArtifactQuotes() {
  const rows = [
    { name: "Forwarder A", total: "$1,840", days: "32d", best: false },
    { name: "Forwarder B", total: "$1,760", days: "35d", best: true },
    { name: "Forwarder C", total: "$1,690*", days: "41d", best: false },
  ]
  return (
    <Sheet rotate="rotate-1">
      <Stamp className="top-9 -right-2">Best fit</Stamp>
      <SheetHeading>Quote comparison · normalized</SheetHeading>
      <div className="mt-3 space-y-1">
        {rows.map((row) => (
          <motion.div
            key={row.name}
            variants={rise}
            className={cn(
              "flex items-baseline justify-between gap-3 rounded-sm px-2 py-1.5 font-mono text-[11.5px]",
              row.best ? "bg-primary/[0.07] font-semibold" : ""
            )}
          >
            <span>{row.name}</span>
            <span className="flex-1 overflow-hidden text-muted-foreground/50">
              {"·".repeat(40)}
            </span>
            <span className="tabular-nums">{row.total}</span>
            <span className="w-8 text-right text-muted-foreground tabular-nums">
              {row.days}
            </span>
          </motion.div>
        ))}
        <motion.p
          variants={rise}
          className="pt-1.5 font-mono text-[10.5px] text-muted-foreground"
        >
          * excludes customs clearance — asked, awaiting reply
        </motion.p>
      </div>
    </Sheet>
  )
}

/* 03 — landed cost till receipt with zigzag tear */
export function ArtifactReceipt() {
  const rows = [
    ["Product", "$9.40"],
    ["Freight", "$2.10"],
    ["Insurance", "$0.20"],
    ["Duty 6.5%", "$1.30"],
    ["Dest. fees", "$0.90"],
  ]
  return (
    <Sheet
      rotate="-rotate-1"
      className="max-w-[15rem] pb-7 [clip-path:polygon(0_0,100%_0,100%_calc(100%-6px),97%_100%,93%_calc(100%-6px),89%_100%,85%_calc(100%-6px),81%_100%,77%_calc(100%-6px),73%_100%,69%_calc(100%-6px),65%_100%,61%_calc(100%-6px),57%_100%,53%_calc(100%-6px),49%_100%,45%_calc(100%-6px),41%_100%,37%_calc(100%-6px),33%_100%,29%_calc(100%-6px),25%_100%,21%_calc(100%-6px),17%_100%,13%_calc(100%-6px),9%_100%,5%_calc(100%-6px),0_100%)]"
    >
      <SheetHeading>Landed cost / unit</SheetHeading>
      <div className="mt-3 space-y-1">
        {rows.map(([k, v]) => (
          <motion.div
            key={k}
            variants={rise}
            className="flex items-baseline justify-between font-mono text-[11.5px]"
          >
            <span className="text-muted-foreground">{k}</span>
            <span className="tabular-nums">{v}</span>
          </motion.div>
        ))}
        <motion.div
          variants={rise}
          className="mt-2 flex items-baseline justify-between border-t border-dashed border-border pt-2 font-mono text-[12.5px] font-bold"
        >
          <span>TOTAL</span>
          <span className="tabular-nums">$13.90</span>
        </motion.div>
        <motion.div
          variants={rise}
          className="flex items-center justify-between pt-1 font-mono text-[11.5px] font-semibold text-success"
        >
          <span className="inline-flex items-center gap-1">
            <Check className="size-3" /> MARGIN
          </span>
          <span>18%</span>
        </motion.div>
      </div>
    </Sheet>
  )
}

/* 04 — document checklist form, one line stamped pending */
export function ArtifactDocs() {
  const docs = [
    { label: "Commercial Invoice", ok: true },
    { label: "Packing List", ok: true },
    { label: "B/L draft", ok: true },
    { label: "Certificate of Origin", ok: true },
    { label: "MSDS", ok: false },
  ]
  return (
    <Sheet rotate="rotate-1">
      <Stamp className="right-2 bottom-8">Ask supplier</Stamp>
      <SheetHeading>Document check · US lane</SheetHeading>
      <div className="mt-3 space-y-1.5">
        {docs.map((doc) => (
          <motion.div
            key={doc.label}
            variants={rise}
            className="flex items-center gap-2.5 font-mono text-[11.5px]"
          >
            <span
              className={cn(
                "flex size-3.5 items-center justify-center rounded-[3px] border",
                doc.ok
                  ? "border-foreground/60 text-foreground"
                  : "border-warning/70"
              )}
            >
              {doc.ok && <Check className="size-2.5" strokeWidth={3.5} />}
            </span>
            <span className={cn(!doc.ok && "text-warning")}>{doc.label}</span>
          </motion.div>
        ))}
      </div>
    </Sheet>
  )
}

/* 05 — handoff ticket with perforated stubs for each party */
export function ArtifactHandoff() {
  const stubs = [
    { to: "BUYER", body: "Reply summary · EN", accent: true },
    { to: "FORWARDERS", body: "RFQ package ×3" },
    { to: "BROKER", body: "HS code questions ×2" },
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
            To: {stub.to}
          </p>
          <p className="mt-1.5 font-mono text-[11.5px] font-semibold">
            {stub.body}
          </p>
        </motion.div>
      ))}
    </motion.div>
  )
}
