import { match } from "@formatjs/intl-localematcher"
import Negotiator from "negotiator"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { defaultLocale, locales } from "@/lib/i18n/config"

function getLocale(request: NextRequest): string {
  const headers = {
    "accept-language": request.headers.get("accept-language") ?? "",
  }
  const languages = new Negotiator({ headers }).languages()
  try {
    return match(languages, locales as readonly string[], defaultLocale)
  } catch {
    return defaultLocale
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  if (pathnameHasLocale) return

  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  // Skip Next internals, the API, and anything with a file extension (static assets).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
}
