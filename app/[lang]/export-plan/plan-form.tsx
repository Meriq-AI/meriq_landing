"use client"

import { useState } from "react"
import Link from "next/link"
import posthog from "posthog-js"
import {
  ArrowRight,
  CalendarClock,
  Check,
  CircleCheck,
  Mail,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BOOKING_URL, CONTACT_EMAIL } from "@/lib/seo"
import { cn } from "@/lib/utils"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/app/[lang]/dictionaries"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Full Incoterms 2020 set, most-requested terms first.
const INCOTERMS = [
  "DDP",
  "DAP",
  "CIF",
  "FOB",
  "EXW",
  "FCA",
  "CFR",
  "CPT",
  "CIP",
  "DPU",
  "FAS",
]

type Plan = Dictionary["plan"]

/** Single-select pill group. */
function Chips({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(active ? "" : opt.value)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
              active
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 font-mono text-[11px] font-semibold text-primary">
        {num}
      </span>
      <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
    </div>
  )
}

/** Live preview: the export plan sheet building itself as the form fills. */
function PlanPreview({
  plan,
  origin,
  destination,
  incoterm,
  mode,
  customs,
  product,
  quantity,
  weight,
  readyDate,
}: {
  plan: Plan
  origin: string
  destination: string
  incoterm: string
  mode: string
  customs: string
  product: string
  quantity: string
  weight: string
  readyDate: string
}) {
  const dash = (
    <span className="text-muted-foreground/40 select-none">— — —</span>
  )
  const modeLabel = plan.modeOptions.find((m) => m.value === mode)?.label
  const customsLabel = plan.customsOptions.find(
    (c) => c.value === customs
  )?.label
  const cargo = [product, quantity, weight].filter(Boolean).join(" · ")

  const row = (label: string, value: React.ReactNode) => (
    <div className="flex items-baseline justify-between gap-4 py-1.5 font-mono text-[12px]">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="text-right font-semibold break-words">
        {value || dash}
      </span>
    </div>
  )

  return (
    <div
      aria-hidden
      className="relative w-full rotate-1 rounded-sm bg-card p-6 shadow-[0_1px_2px_oklch(0.17_0.012_260/0.06),0_16px_36px_-14px_oklch(0.17_0.012_260/0.2)] ring-1 ring-border/80"
    >
      <span className="pointer-events-none absolute -top-3 right-4 rounded-md border-2 border-primary/60 px-2 py-0.5 font-mono text-[10px] font-bold tracking-[0.2em] text-primary/70 uppercase mix-blend-multiply">
        Draft
      </span>

      <p className="border-b border-dashed border-border pb-2.5 font-mono text-[10px] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
        {plan.preview.title} · {plan.preview.caseNo} #EXP-NEW
      </p>

      <div className="mt-3 divide-y divide-border/60">
        {row(
          plan.preview.route,
          destination ? (
            <>
              {origin || "Taiwan"}{" "}
              <span className="text-primary">→ {destination}</span>
            </>
          ) : origin ? (
            `${origin} → ?`
          ) : null
        )}
        {row(
          plan.preview.incoterm,
          [incoterm, modeLabel].filter(Boolean).join(" · ")
        )}
        {row(plan.preview.cargo, cargo)}
        {row(plan.preview.customs, customsLabel)}
        {row(plan.preview.ready, readyDate)}
      </div>

      <p className="mt-5 font-mono text-[10px] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
        {plan.preview.deliver}
      </p>
      <ul className="mt-2 space-y-1.5">
        {plan.preview.deliverables.map((item) => (
          <li key={item} className="flex items-center gap-2 text-[12.5px]">
            <span className="flex size-4 items-center justify-center rounded-full bg-primary/10">
              <Check className="size-2.5 text-primary" strokeWidth={3} />
            </span>
            {item}
          </li>
        ))}
      </ul>

      <p className="mt-5 border-t border-dashed border-border pt-3 font-mono text-[10.5px] text-muted-foreground">
        {plan.preview.status}
      </p>
    </div>
  )
}

export function PlanForm({ plan, lang }: { plan: Plan; lang: Locale }) {
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(false)
  const [attempted, setAttempted] = useState(false)

  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [incoterm, setIncoterm] = useState("")
  const [mode, setMode] = useState("")
  const [customs, setCustoms] = useState("")
  const [product, setProduct] = useState("")
  const [quantity, setQuantity] = useState("")
  const [weight, setWeight] = useState("")
  const [readyDate, setReadyDate] = useState("")
  const [dangerous, setDangerous] = useState(false)
  const [inquiry, setInquiry] = useState("")
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [wantsCall, setWantsCall] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (
      !destination.trim() ||
      !product.trim() ||
      !name.trim() ||
      !EMAIL_RE.test(email.trim())
    ) {
      setAttempted(true)
      return
    }
    // Honeypot (uncontrolled, hidden): bots fill it, the API silently drops it.
    const website = String(
      new FormData(event.currentTarget).get("website") ?? ""
    )

    const payload = {
      website,
      name: name.trim(),
      company: company.trim(),
      email: email.trim(),
      phone: phone.trim(),
      origin: origin.trim(),
      destination: destination.trim(),
      incoterm,
      mode,
      customs_handling: customs,
      product: product.trim(),
      quantity: quantity.trim(),
      weight: weight.trim(),
      ready_date: readyDate.trim(),
      dangerous_goods: dangerous,
      inquiry_text: inquiry.trim(),
      wants_call: wantsCall,
      lang,
      source: "export_plan_page",
    }

    setSubmitting(true)
    setError(false)
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("request failed")
      // Analytics only after the lead is actually stored; keep the pasted
      // buyer email (PII, potentially huge) out of the event.
      try {
        posthog.identify(payload.email, {
          email: payload.email,
          name: payload.name,
          company: payload.company,
        })
        // Strip the pasted buyer email (PII) and the honeypot from the event.
        const { inquiry_text, website: _, ...rest } = payload
        void _
        posthog.capture("export_plan_submitted", {
          ...rest,
          inquiry_length: inquiry_text.length,
        })
      } catch {
        // analytics is best-effort; don't block on it
      }
      setDone(true)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch {
      setError(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg pb-24 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-success/10">
          <CircleCheck className="size-7 text-success" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight">
          {plan.successTitle}
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
          {plan.successBody}
        </p>
        {wantsCall && (
          <div className="mt-6">
            <p className="mb-3 text-sm font-medium">{plan.successBook}</p>
            <Button size="lg" className="rounded-full" asChild>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                <CalendarClock className="size-4" />
                {plan.successBookCta}
              </a>
            </Button>
          </div>
        )}
        <Button
          variant={wantsCall ? "outline" : "default"}
          className="mt-8 rounded-full"
          asChild
        >
          <Link href={`/${lang}`}>{plan.backHome}</Link>
        </Button>
      </div>
    )
  }

  const invalid = {
    destination: attempted && !destination.trim(),
    product: attempted && !product.trim(),
    name: attempted && !name.trim(),
    email: attempted && !EMAIL_RE.test(email.trim()),
  }

  return (
    <>
      {/* Page heading lives inside the form flow so the success screen
          replaces it entirely (no duplicate h1 above the confirmation). */}
      <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
        {/* whitespace-pre-line: the zh title carries an explicit \n */}
        <h1 className="font-display text-3xl font-semibold tracking-tight text-balance whitespace-pre-line sm:text-5xl">
          {plan.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
          {plan.subtitle}
        </p>
      </div>

      <div className="grid gap-12 pb-24 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <form onSubmit={handleSubmit} noValidate className="space-y-10">
          {/* Honeypot — visually hidden, tab-skipped; bots fill it. */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] size-px opacity-0"
          />
          {/* 01 — route & terms */}
          <section className="space-y-5">
            <SectionHeader num="01" title={plan.sectionShipment} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="plan-origin">{plan.origin}</Label>
                <Input
                  id="plan-origin"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder={plan.originPlaceholder}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="plan-destination">{plan.destination}</Label>
                <Input
                  id="plan-destination"
                  required
                  aria-invalid={invalid.destination}
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder={plan.destinationPlaceholder}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>{plan.incoterm}</Label>
              <Chips
                options={[
                  ...INCOTERMS.map((t) => ({ value: t, label: t })),
                  { value: "unsure", label: plan.incotermUnsure },
                ]}
                value={incoterm}
                onChange={setIncoterm}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{plan.mode}</Label>
              <Chips
                options={plan.modeOptions}
                value={mode}
                onChange={setMode}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{plan.customs}</Label>
              <Chips
                options={plan.customsOptions}
                value={customs}
                onChange={setCustoms}
              />
            </div>
          </section>

          {/* 02 — cargo */}
          <section className="space-y-5 border-t border-border pt-8">
            <SectionHeader num="02" title={plan.sectionCargo} />
            <div className="space-y-1.5">
              <Label htmlFor="plan-product">{plan.product}</Label>
              <Input
                id="plan-product"
                required
                aria-invalid={invalid.product}
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder={plan.productPlaceholder}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="plan-quantity">{plan.quantity}</Label>
                <Input
                  id="plan-quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder={plan.quantityPlaceholder}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="plan-weight">{plan.weight}</Label>
                <Input
                  id="plan-weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={plan.weightPlaceholder}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="plan-ready">{plan.readyDate}</Label>
                <Input
                  id="plan-ready"
                  value={readyDate}
                  onChange={(e) => setReadyDate(e.target.value)}
                  placeholder={plan.readyDatePlaceholder}
                />
              </div>
            </div>
            <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={dangerous}
                onChange={(e) => setDangerous(e.target.checked)}
                className="size-4 accent-primary"
              />
              {plan.dangerous}
            </label>
            <div className="space-y-1.5">
              <Label htmlFor="plan-inquiry">{plan.inquiry}</Label>
              <textarea
                id="plan-inquiry"
                value={inquiry}
                onChange={(e) => setInquiry(e.target.value)}
                placeholder={plan.inquiryPlaceholder}
                rows={5}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors outline-none placeholder:text-muted-foreground focus:border-ring"
              />
            </div>
          </section>

          {/* 03 — contact */}
          <section className="space-y-5 border-t border-border pt-8">
            <SectionHeader num="03" title={plan.sectionContact} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="plan-name">{plan.name}</Label>
                <Input
                  id="plan-name"
                  required
                  aria-invalid={invalid.name}
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={plan.namePlaceholder}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="plan-company">{plan.company}</Label>
                <Input
                  id="plan-company"
                  autoComplete="organization"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder={plan.companyPlaceholder}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="plan-email">{plan.email}</Label>
                <Input
                  id="plan-email"
                  type="email"
                  required
                  aria-invalid={invalid.email}
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={plan.emailPlaceholder}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="plan-phone">{plan.phone}</Label>
                <Input
                  id="plan-phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={plan.phonePlaceholder}
                />
              </div>
            </div>
            <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={wantsCall}
                onChange={(e) => setWantsCall(e.target.checked)}
                className="size-4 accent-primary"
              />
              {plan.wantsCall}
            </label>
          </section>

          <div className="border-t border-border pt-6">
            {error && (
              <p className="mb-3 text-sm text-destructive">{plan.errorBody}</p>
            )}
            <div className="flex flex-wrap items-center gap-4">
              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="h-12 rounded-full px-8 text-[15px] shadow-lg shadow-primary/25"
              >
                {submitting ? plan.submitting : plan.submit}
                {!submitting && <ArrowRight className="size-4" />}
              </Button>
              <p className="text-[13px] text-muted-foreground">
                {plan.requiredHint}
              </p>
            </div>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <Mail className="size-3.5" />
              {CONTACT_EMAIL}
            </a>
          </div>
        </form>

        {/* Live plan preview */}
        <div className="hidden lg:block">
          <div className="sticky top-28">
            <PlanPreview
              plan={plan}
              origin={origin}
              destination={destination}
              incoterm={incoterm === "unsure" ? plan.incotermUnsure : incoterm}
              mode={mode}
              customs={customs}
              product={product}
              quantity={quantity}
              weight={weight}
              readyDate={readyDate}
            />
          </div>
        </div>
      </div>
    </>
  )
}
