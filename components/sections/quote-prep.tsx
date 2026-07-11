import { Paperclip, UserRoundCheck } from "lucide-react"

import { BlurFade } from "@/components/ui/blur-fade"
import { NoiseTexture } from "@/components/ui/noise-texture"
import { Eyebrow, Section, SectionHeading } from "@/components/section"
import { cn } from "@/lib/utils"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/app/[lang]/dictionaries"

/** highlighter sweep on a phrase the machine read */
function Hl({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-[3px] bg-verify/40 px-0.5 [box-decoration-break:clone]">
      {children}
    </span>
  )
}

// Vignette copy, keyed by locale (field values stay hardcoded trade English
// per the vignette convention).
const COPY = {
  "zh-TW": {
    subject: "RE: 高雄到 LA 一個 40HQ — 請報價",
    emailBody: (
      <>
        「Auto parts 一票，<Hl>1 × 40HQ</Hl>，約 <Hl>18.5 噸</Hl>，
        <Hl>FOB</Hl>，<Hl>7/20 前要結關</Hl>，能報 all-in
        嗎？PL 先附上，麻煩了。」
      </>
    ),
    v1Extract: "已擷取 · 每格有出處",
    v2Sources: "三種來源 → 一張運價卡",
    v3Customer: "大昌貿易",
    v3Internal: "內部 · 成本 $3,625 · 毛利 8.9% · A 級規則",
    v3Sign: "OP 確認後才寄出",
  },
  en: {
    subject: "RE: KHH → LA, one 40HQ — quote?",
    emailBody: (
      <>
        “One lot of auto parts, <Hl>1 × 40HQ</Hl>, about <Hl>18.5 t</Hl>,{" "}
        <Hl>FOB</Hl>, <Hl>needs to gate in before Jul 20</Hl> — can you quote
        all-in? PL attached, thanks.”
      </>
    ),
    v1Extract: "Extracted · every field sourced",
    v2Sources: "Three sources → one rate card",
    v3Customer: "Dachang Trading",
    v3Internal: "Internal · buy $3,625 · GP 8.9% · tier-A rule",
    v3Sign: "Sent only after OP confirms",
  },
} as const

type Copy = (typeof COPY)[Locale]

/** rubber stamp — solid ink, no blend tricks, so it always reads crisp */
function Stamp({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute z-10 -rotate-[6deg] rounded-md border-2 border-primary-strong/70 bg-card px-2 py-0.5 font-mono text-[10px] font-bold tracking-[0.18em] text-primary-strong uppercase",
        className
      )}
    >
      {children}
    </span>
  )
}

/** a sheet on the desk: straight, grainy-gradient, text always on top */
function Sheet({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-border/70 bg-surface p-5 shadow-[0_1px_2px_oklch(0.17_0.012_260/0.06),0_22px_44px_-18px_oklch(0.17_0.012_260/0.22)]",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(95%_85%_at_100%_115%,oklch(0.865_0.127_207/0.3)_0%,oklch(0.88_0.09_215/0.1)_45%,transparent_70%)]"
      />
      <NoiseTexture
        frequency={0.55}
        slope={0.12}
        className="opacity-20 [mask-image:radial-gradient(90%_85%_at_75%_85%,white_10%,transparent_100%)]"
      />
      <div className="relative">{children}</div>
    </div>
  )
}

/** 01 — the inquiry email itself, read with a highlighter, sources pinned */
function VignetteIntake({ t }: { t: Copy }) {
  const tags: Array<[string, boolean?]> = [
    ["FCL · 40HQ"],
    ["KHH → LAX"],
    ["18,500 KG ← PL p.2"],
    ["CRD JUL 20"],
    ["DG ?", true],
  ]
  return (
    <Sheet>
      <Stamp className="right-0 -top-1">Intake · 28s</Stamp>
      <div className="space-y-1 border-b border-dashed border-border pb-2.5 font-mono text-[10px] text-muted-foreground">
        <p className="truncate">
          <span className="mr-2 text-muted-foreground/60">FROM</span>
          wang@dachang.com.tw
        </p>
        <p className="truncate pr-24">
          <span className="mr-2 text-muted-foreground/60">SUBJ</span>
          {t.subject}
        </p>
      </div>
      <p className="mt-3 text-[12.5px] leading-[1.8] text-foreground/85">
        {t.emailBody}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["PL_0715.xlsx", "PO_0715.pdf"].map((file) => (
          <span
            key={file}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 font-mono text-[9.5px] font-medium text-muted-foreground"
          >
            <Paperclip className="size-2.5" />
            {file}
          </span>
        ))}
      </div>
      <p className="mt-4 border-t border-dashed border-border pt-2.5 font-mono text-[9px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
        {t.v1Extract}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {tags.map(([tag, warn]) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 font-mono text-[10px] font-semibold text-foreground/80"
          >
            {warn && (
              <span className="size-1.5 rounded-full bg-warning" aria-hidden />
            )}
            {tag}
          </span>
        ))}
      </div>
    </Sheet>
  )
}

/** 02 — a lane rate card the desk would recognize: vessel, cut-off, validity */
function VignetteRates({ t }: { t: Copy }) {
  const rows: Array<[string, string]> = [
    ["Ocean Freight · 40HQ", "$2,850"],
    ["EBS / LSS", "incl."],
    ["Dest. Local Charges", "$410"],
    ["CY Cut-off", "Every WED"],
  ]
  return (
    <Sheet>
      <Stamp className="right-0 -top-1">Valid → Jul 31</Stamp>
      <div className="flex flex-wrap items-center gap-1.5 border-b border-dashed border-border pb-2.5 pr-28">
        {["rates_2026-07.xlsx", "EMC_quote.eml", "local_chg.pdf"].map(
          (file) => (
            <span
              key={file}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 font-mono text-[9.5px] font-medium text-muted-foreground"
            >
              <Paperclip className="size-2.5" />
              {file}
            </span>
          )
        )}
      </div>
      <p className="mt-2.5 font-mono text-[9px] font-semibold tracking-[0.16em] text-primary-strong uppercase">
        {t.v2Sources}
      </p>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <p className="font-mono text-[19px] font-bold tracking-wide">
          KHH <span className="text-primary-strong">⇄</span> LAX
        </p>
        <span className="font-mono text-[10px] font-semibold text-muted-foreground">
          40HQ · FCL
        </span>
      </div>
      <p className="mt-1 truncate font-mono text-[10px] text-muted-foreground">
        EVER LUCID · V.0723E — ETD JUL 22 → ETA AUG 05
      </p>
      <div className="mt-3 space-y-1.5">
        {rows.map(([k, v]) => (
          <div
            key={k}
            className="flex items-baseline justify-between gap-3 font-mono text-[11.5px]"
          >
            <span className="whitespace-nowrap text-muted-foreground">
              {k}
            </span>
            <span
              className="mx-1 mb-0.5 flex-1 self-end border-b border-dotted border-muted-foreground/40"
              aria-hidden
            />
            <span className="font-semibold tabular-nums">{v}</span>
          </div>
        ))}
      </div>
    </Sheet>
  )
}

/** 03 — the quotation a forwarder actually sends, plus the internal note */
function VignetteQuotation({ t }: { t: Copy }) {
  const rows: Array<[string, string]> = [
    ["Ocean Freight · 40HQ", "$2,850"],
    ["Origin Local Charges", "$320"],
    ["Dest. Local Charges", "$410"],
    ["Documentation", "$45"],
  ]
  return (
    <Sheet>
      <Stamp className="top-7 right-0">Draft</Stamp>
      <div className="flex items-baseline justify-between border-b border-dashed border-border pb-2">
        <p className="font-mono text-[11px] font-bold tracking-[0.26em] uppercase">
          Quotation
        </p>
        <p className="font-mono text-[10px] text-muted-foreground">
          Q-0720 · {t.v3Customer}
        </p>
      </div>
      <div className="mt-3 space-y-1.5">
        {rows.map(([k, v]) => (
          <div
            key={k}
            className="flex items-baseline justify-between gap-3 font-mono text-[11.5px]"
          >
            <span className="whitespace-nowrap text-muted-foreground">
              {k}
            </span>
            <span
              className="mx-1 mb-0.5 flex-1 self-end border-b border-dotted border-muted-foreground/40"
              aria-hidden
            />
            <span className="tabular-nums">{v}</span>
          </div>
        ))}
        <div className="flex items-baseline justify-between border-t border-dashed border-border pt-2 font-mono text-[12.5px] font-bold">
          <span>TOTAL · ALL-IN</span>
          <span className="bg-verify/35 px-0.5 tabular-nums">$3,980</span>
        </div>
        <p className="text-right font-mono text-[10px] text-muted-foreground">
          Validity → Jul 31
        </p>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 rounded-md border border-dashed border-primary-strong/40 bg-primary/10 px-2.5 py-1.5">
        <span className="truncate font-mono text-[9.5px] font-semibold text-primary-strong">
          {t.v3Internal}
        </span>
        <span className="shrink-0 font-mono text-[8px] font-bold tracking-[0.16em] text-primary-strong/70 uppercase">
          Internal
        </span>
      </div>
      <div className="mt-4 flex items-end gap-3">
        <p className="shrink-0 font-mono text-[9.5px] text-muted-foreground">
          {t.v3Sign}
        </p>
        <span className="mb-1 flex-1 border-b border-border" aria-hidden />
        <UserRoundCheck
          className="size-3.5 text-muted-foreground"
          aria-hidden
        />
      </div>
    </Sheet>
  )
}

/**
 * The first product, kept deliberately narrow: inquiry email → quote draft →
 * human confirmation. Three numbered blocks follow the desk's actual quoting
 * workflow (read the inquiry → find the rates → issue the quotation), each
 * rendered in the trade's own paper — annotated emails, lane rate cards,
 * stamped quotation sheets — joined by a dashed route line. Traceability is
 * the pitch, not AI magic.
 */
export function QuotePrep({
  quotePrep,
  lang,
}: {
  quotePrep: Dictionary["quotePrep"]
  lang: Locale
}) {
  const t = COPY[lang]
  const vignettes = [VignetteIntake, VignetteRates, VignetteQuotation]

  return (
    <Section id="quote" className="scroll-mt-16">
      <div className="mx-auto max-w-2xl text-center">
        <BlurFade delay={0.05} className="flex justify-center">
          <Eyebrow>{quotePrep.eyebrow}</Eyebrow>
        </BlurFade>
        <BlurFade delay={0.1}>
          <SectionHeading className="mt-4">{quotePrep.title}</SectionHeading>
        </BlurFade>
        <BlurFade delay={0.16}>
          <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground">
            {quotePrep.sub}
          </p>
        </BlurFade>
      </div>

      {/* the desk's quoting workflow — three legs on one dashed route */}
      <div className="mt-16 sm:mt-20">
        {quotePrep.features.map((feature, i) => {
          const Vig = vignettes[i % vignettes.length]
          return (
            <div key={feature.tag}>
              {i > 0 && (
                <div
                  aria-hidden
                  className="mx-auto flex h-16 w-px flex-col items-center sm:h-20"
                >
                  <span className="w-px flex-1 border-l-2 border-dashed border-border" />
                  <span className="mt-1 size-2 rounded-full border-2 border-primary bg-card" />
                </div>
              )}
              <BlurFade delay={0.08}>
                <div
                  className={cn(
                    "grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
                    i > 0 && "mt-6"
                  )}
                >
                  <div className={cn(i % 2 === 1 && "lg:order-2")}>
                    <p className="font-mono text-[11px] font-bold tracking-[0.24em] text-primary-strong uppercase">
                      {String(i + 1).padStart(2, "0")} · {feature.tag}
                    </p>
                    <h3 className="mt-4 bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text font-display text-2xl font-semibold tracking-tight text-balance text-transparent sm:text-[1.9rem] sm:leading-[1.2]">
                      {feature.title}
                    </h3>
                    <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-pretty text-muted-foreground">
                      {feature.body}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "mx-auto w-full max-w-md",
                      i % 2 === 1 && "lg:order-1"
                    )}
                  >
                    <Vig t={t} />
                  </div>
                </div>
              </BlurFade>
            </div>
          )
        })}
      </div>

      {/* the honest boundary */}
      <p className="mt-16 border-t border-dashed border-border pt-6 text-center font-mono text-[11px] font-medium tracking-wide text-muted-foreground sm:mt-20">
        {quotePrep.note}
      </p>
    </Section>
  )
}
