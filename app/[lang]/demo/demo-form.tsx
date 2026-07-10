"use client"

import { useState } from "react"
import Link from "next/link"
import posthog from "posthog-js"
import { ArrowRight, CalendarClock, CircleCheck, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BOOKING_URL, CONTACT_EMAIL } from "@/lib/seo"
import { cn } from "@/lib/utils"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/app/[lang]/dictionaries"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Demo = Dictionary["demo"]

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

export function DemoForm({ demo, lang }: { demo: Demo; lang: Locale }) {
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(false)
  const [attempted, setAttempted] = useState(false)

  const [company, setCompany] = useState("")
  const [role, setRole] = useState("")
  const [volume, setVolume] = useState("")
  const [currentSystem, setCurrentSystem] = useState("")
  const [inquiry, setInquiry] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!company.trim() || !name.trim() || !EMAIL_RE.test(email.trim())) {
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
      role,
      monthly_shipments: volume,
      current_system: currentSystem.trim(),
      inquiry_text: inquiry.trim(),
      // The whole page exists to book a call — no opt-in checkbox needed.
      wants_call: true,
      lang,
      source: "demo_page",
    }

    setSubmitting(true)
    setError(false)
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("request failed")
      // Analytics only after the lead is actually stored; keep the pasted
      // inquiry email (PII, potentially huge) out of the event.
      try {
        posthog.identify(payload.email, {
          email: payload.email,
          name: payload.name,
          company: payload.company,
        })
        const { inquiry_text, website: _, ...rest } = payload
        void _
        posthog.capture("demo_requested", {
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
          {demo.successTitle}
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
          {demo.successBody}
        </p>
        <div className="mt-6">
          <p className="mb-3 text-sm font-medium">{demo.successBook}</p>
          <Button size="lg" className="rounded-full" asChild>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
              <CalendarClock className="size-4" />
              {demo.successBookCta}
            </a>
          </Button>
        </div>
        <Button variant="outline" className="mt-8 rounded-full" asChild>
          <Link href={`/${lang}`}>{demo.backHome}</Link>
        </Button>
      </div>
    )
  }

  const invalid = {
    company: attempted && !company.trim(),
    name: attempted && !name.trim(),
    email: attempted && !EMAIL_RE.test(email.trim()),
  }

  return (
    <>
      {/* Page heading lives inside the form flow so the success screen
          replaces it entirely (no duplicate h1 above the confirmation). */}
      <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
        {/* whitespace-pre-line: the title carries an explicit \n */}
        <h1 className="font-display text-3xl font-semibold tracking-tight text-balance whitespace-pre-line sm:text-5xl">
          {demo.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
          {demo.subtitle}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto max-w-xl space-y-10 pb-24"
      >
        {/* Honeypot — visually hidden, tab-skipped; bots fill it. */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] size-px opacity-0"
        />

        {/* 01 — your team */}
        <section className="space-y-5">
          <SectionHeader num="01" title={demo.sectionCompany} />
          <div className="space-y-1.5">
            <Label htmlFor="demo-company">{demo.company}</Label>
            <Input
              id="demo-company"
              required
              aria-invalid={invalid.company}
              autoComplete="organization"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder={demo.companyPlaceholder}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{demo.role}</Label>
            <Chips options={demo.roleOptions} value={role} onChange={setRole} />
          </div>
          <div className="space-y-1.5">
            <Label>{demo.volume}</Label>
            <Chips
              options={demo.volumeOptions}
              value={volume}
              onChange={setVolume}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="demo-system">{demo.currentSystem}</Label>
            <Input
              id="demo-system"
              value={currentSystem}
              onChange={(e) => setCurrentSystem(e.target.value)}
              placeholder={demo.currentSystemPlaceholder}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="demo-inquiry">{demo.inquiry}</Label>
            <textarea
              id="demo-inquiry"
              value={inquiry}
              onChange={(e) => setInquiry(e.target.value)}
              placeholder={demo.inquiryPlaceholder}
              rows={5}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors outline-none placeholder:text-muted-foreground focus:border-ring"
            />
          </div>
        </section>

        {/* 02 — contact */}
        <section className="space-y-5 border-t border-border pt-8">
          <SectionHeader num="02" title={demo.sectionContact} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="demo-name">{demo.name}</Label>
              <Input
                id="demo-name"
                required
                aria-invalid={invalid.name}
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={demo.namePlaceholder}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="demo-email">{demo.email}</Label>
              <Input
                id="demo-email"
                type="email"
                required
                aria-invalid={invalid.email}
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={demo.emailPlaceholder}
              />
            </div>
          </div>
        </section>

        <div className="border-t border-border pt-6">
          {error && (
            <p className="mb-3 text-sm text-destructive">{demo.errorBody}</p>
          )}
          <div className="flex flex-wrap items-center gap-4">
            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="h-12 rounded-full px-8 text-[15px] shadow-lg shadow-primary/25"
            >
              {submitting ? demo.submitting : demo.submit}
              {!submitting && <ArrowRight className="size-4" />}
            </Button>
            <p className="text-[13px] text-muted-foreground">
              {demo.requiredHint}
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
    </>
  )
}
