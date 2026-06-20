"use client"

import { useEffect } from "react"

import { cn } from "@/lib/utils"

declare global {
  interface Window {
    Calendly?: { initInlineWidgets: () => void }
  }
}

const SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js"

/**
 * Calendly inline booking widget. Loads the Calendly script once and lets it
 * hydrate the `.calendly-inline-widget` div; on later mounts (client nav) the
 * script is already present, so we re-init the widget instead of re-adding it.
 */
export function CalendlyInline({
  url,
  height = 630,
  className,
}: {
  url: string
  height?: number
  className?: string
}) {
  useEffect(() => {
    if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      window.Calendly?.initInlineWidgets()
      return
    }
    const script = document.createElement("script")
    script.src = SCRIPT_SRC
    script.async = true
    document.body.appendChild(script)
  }, [])

  return (
    <div
      className={cn("calendly-inline-widget", className)}
      data-url={url}
      style={{ minWidth: 280, height }}
    />
  )
}
