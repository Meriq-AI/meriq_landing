import type { MDXComponents } from "mdx/types"
import Link from "next/link"
import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

// Global MDX component map. Required by @next/mdx in the App Router.
// Article typography is defined here (token-aligned) rather than via a plugin.
const components: MDXComponents = {
  h2: ({ className, ...props }: ComponentProps<"h2">) => (
    <h2
      className={cn(
        "mt-12 mb-4 text-xl font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: ComponentProps<"h3">) => (
    <h3
      className={cn(
        "mt-8 mb-3 text-lg font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: ComponentProps<"p">) => (
    <p
      className={cn("my-5 text-[15px] leading-7 text-foreground/80", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }: ComponentProps<"ul">) => (
    <ul
      className={cn(
        "my-5 ml-1 list-disc space-y-2 pl-5 text-[15px] leading-7 text-foreground/80 marker:text-muted-foreground/60",
        className
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }: ComponentProps<"ol">) => (
    <ol
      className={cn(
        "my-5 ml-1 list-decimal space-y-2 pl-5 text-[15px] leading-7 text-foreground/80 marker:text-muted-foreground",
        className
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }: ComponentProps<"li">) => (
    <li className={cn("pl-1", className)} {...props} />
  ),
  strong: ({ className, ...props }: ComponentProps<"strong">) => (
    <strong
      className={cn("font-semibold text-foreground", className)}
      {...props}
    />
  ),
  blockquote: ({ className, ...props }: ComponentProps<"blockquote">) => (
    <blockquote
      className={cn(
        "my-6 border-l-2 border-primary/40 pl-4 text-[15px] text-muted-foreground italic",
        className
      )}
      {...props}
    />
  ),
  hr: ({ className, ...props }: ComponentProps<"hr">) => (
    <hr className={cn("my-10 border-border", className)} {...props} />
  ),
  a: ({ href = "", className, ...props }: ComponentProps<"a">) => {
    const cls = cn(
      "font-medium text-primary underline-offset-4 hover:underline",
      className
    )
    if (href.startsWith("/")) {
      return <Link href={href} className={cls} {...props} />
    }
    return (
      <a
        href={href}
        className={cls}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        {...props}
      />
    )
  },
}

export function useMDXComponents(): MDXComponents {
  return components
}
