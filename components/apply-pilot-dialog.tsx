"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import posthog from "posthog-js"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/app/[lang]/dictionaries"

// Calendly 30-min intro booking, shown after submit when the user opts in.
const InlineWidget = dynamic(
  () => import("react-calendly").then((m) => m.InlineWidget),
  { ssr: false }
)
const CALENDLY_URL =
  "https://calendly.com/justinli-meriqai/30min?primary_color=06b6d4"

type Option = { value: string; label: string }

function DropdownField({
  label,
  placeholder,
  options,
  value,
  onChange,
  invalid,
}: {
  label: string
  placeholder: string
  options: Option[]
  value: string
  onChange: (value: string) => void
  invalid?: boolean
}) {
  const selected = options.find((o) => o.value === value)
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-invalid={invalid}
          className={cn(
            "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors outline-none",
            "aria-invalid:border-destructive data-[state=open]:border-ring"
          )}
        >
          <span
            className={cn("truncate", !selected && "text-muted-foreground")}
          >
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown className="size-4 shrink-0 opacity-50" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-(--radix-dropdown-menu-trigger-width)"
        >
          <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
            {options.map((o) => (
              <DropdownMenuRadioItem key={o.value} value={o.value}>
                {o.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

type Fields = {
  role: string
  volume: string
  pain: string
  sampleDocs: string
  wantsCall: string
}

const EMPTY: Fields = {
  role: "",
  volume: "",
  pain: "",
  sampleDocs: "",
  wantsCall: "",
}

export function ApplyPilotDialog({
  pilot,
  lang,
  location,
  children,
}: {
  pilot: Dictionary["pilot"]
  lang: Locale
  /** Where the trigger lives, for analytics (e.g. "header", "hero"). */
  location: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [fields, setFields] = useState<Fields>(EMPTY)
  const [attempted, setAttempted] = useState(false)
  const [error, setError] = useState(false)

  const showCal = done && fields.wantsCall === "yes"

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (next) {
      posthog.capture("pilot_dialog_opened", { location, lang })
    } else {
      window.setTimeout(() => {
        setDone(false)
        setAttempted(false)
        setError(false)
        setFields(EMPTY)
      }, 200)
    }
  }

  function setField(name: keyof Fields) {
    return (value: string) => setFields((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get("name") ?? "").trim()
    const company = String(data.get("company") ?? "").trim()
    const email = String(data.get("email") ?? "").trim()
    const painOther = String(data.get("painOther") ?? "").trim()
    const { role, volume, pain, sampleDocs, wantsCall } = fields

    if (
      !name ||
      !company ||
      !email ||
      !role ||
      !volume ||
      !pain ||
      !sampleDocs ||
      !wantsCall ||
      (pain === "other" && !painOther)
    ) {
      setAttempted(true)
      return
    }

    const payload = {
      name,
      company,
      role,
      monthly_volume: volume,
      main_pain: pain,
      main_pain_other: pain === "other" ? painOther : "",
      can_share_docs: sampleDocs,
      wants_call: wantsCall,
      email,
      lang,
      location,
    }

    setSubmitting(true)
    setError(false)
    try {
      posthog.identify(email, { email, name, company, role })
      posthog.capture("pilot_application_submitted", payload)
    } catch {
      // analytics is best-effort; don't block on it
    }
    try {
      const res = await fetch("/api/pilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("request failed")
      setDone(true)
    } catch {
      setError(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className={cn(
          "max-h-[88vh] overflow-y-auto rounded-3xl p-6 shadow-2xl shadow-foreground/10 sm:p-7",
          showCal ? "sm:max-w-lg" : "sm:max-w-md"
        )}
      >
        {done ? (
          <div className="py-2 text-center">
            <DialogHeader>
              <DialogTitle>{pilot.successTitle}</DialogTitle>
              <DialogDescription>
                {showCal ? pilot.bookCallBody : pilot.successBody}
              </DialogDescription>
            </DialogHeader>
            {showCal && (
              <div className="mt-4 overflow-hidden rounded-xl border border-border">
                <InlineWidget
                  url={CALENDLY_URL}
                  styles={{ height: "640px", minWidth: "320px" }}
                />
              </div>
            )}
            <Button
              className="mt-6 w-full"
              onClick={() => handleOpenChange(false)}
            >
              {pilot.close}
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{pilot.title}</DialogTitle>
              <DialogDescription>{pilot.subtitle}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="mt-2 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="pilot-name">{pilot.name}</Label>
                <Input
                  id="pilot-name"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder={pilot.namePlaceholder}
                  className="focus-visible:ring-0"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pilot-company">{pilot.company}</Label>
                <Input
                  id="pilot-company"
                  name="company"
                  required
                  autoComplete="organization"
                  placeholder={pilot.companyPlaceholder}
                  className="focus-visible:ring-0"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <DropdownField
                  label={pilot.role}
                  placeholder={pilot.selectPlaceholder}
                  options={pilot.roleOptions}
                  value={fields.role}
                  onChange={setField("role")}
                  invalid={attempted && !fields.role}
                />
                <DropdownField
                  label={pilot.volume}
                  placeholder={pilot.selectPlaceholder}
                  options={pilot.volumeOptions}
                  value={fields.volume}
                  onChange={setField("volume")}
                  invalid={attempted && !fields.volume}
                />
              </div>

              <DropdownField
                label={pilot.pain}
                placeholder={pilot.selectPlaceholder}
                options={pilot.painOptions}
                value={fields.pain}
                onChange={setField("pain")}
                invalid={attempted && !fields.pain}
              />

              {fields.pain === "other" && (
                <div className="space-y-1.5">
                  <Input
                    id="pilot-pain-other"
                    name="painOther"
                    required
                    placeholder={pilot.painOtherPlaceholder}
                    className="focus-visible:ring-0"
                  />
                </div>
              )}

              <DropdownField
                label={pilot.sampleDocs}
                placeholder={pilot.selectPlaceholder}
                options={pilot.sampleDocsOptions}
                value={fields.sampleDocs}
                onChange={setField("sampleDocs")}
                invalid={attempted && !fields.sampleDocs}
              />

              <div className="space-y-1.5">
                <Label htmlFor="pilot-email">{pilot.email}</Label>
                <Input
                  id="pilot-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder={pilot.emailPlaceholder}
                  className="focus-visible:ring-0"
                />
              </div>

              <DropdownField
                label={pilot.wantsCall}
                placeholder={pilot.selectPlaceholder}
                options={pilot.wantsCallOptions}
                value={fields.wantsCall}
                onChange={setField("wantsCall")}
                invalid={attempted && !fields.wantsCall}
              />

              {error && (
                <p className="text-sm text-destructive">{pilot.errorBody}</p>
              )}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? pilot.submitting : pilot.submit}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
