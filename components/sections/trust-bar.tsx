import type { Dictionary } from "@/app/[lang]/dictionaries"

export function TrustBar({ trustBar }: { trustBar: Dictionary["trustBar"] }) {
  return (
    <section className="border-y border-border bg-surface px-6 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 text-center">
        <p className="max-w-2xl text-pretty text-sm text-muted-foreground">
          {trustBar.lead}
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2.5">
          {trustBar.pills.map((pill) => (
            <li
              key={pill}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 font-mono text-xs text-foreground/80"
            >
              <span className="size-1.5 rounded-full bg-primary" aria-hidden />
              {pill}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
