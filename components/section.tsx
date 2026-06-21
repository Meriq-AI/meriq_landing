import { cn } from "@/lib/utils"

export function Section({
  className,
  containerClassName,
  children,
  ...props
}: React.ComponentProps<"section"> & { containerClassName?: string }) {
  return (
    <section
      className={cn("relative px-6 py-20 sm:py-28", className)}
      {...props}
    >
      <div className={cn("mx-auto w-full max-w-6xl", containerClassName)}>
        {children}
      </div>
    </section>
  )
}

export function Eyebrow({ className, children }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 font-mono text-xs font-medium tracking-widest text-muted-foreground uppercase",
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
      {children}
    </p>
  )
}

export function SectionHeading({
  className,
  children,
}: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "text-3xl font-semibold tracking-tight text-balance sm:text-4xl",
        className
      )}
    >
      {children}
    </h2>
  )
}
