import type { Metadata } from "next"
import { Geist_Mono, Inter, Noto_Sans_TC } from "next/font/google"
import { notFound } from "next/navigation"
import Script from "next/script"

import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { htmlLang, isLocale, locales, type Locale } from "@/lib/i18n/config"
import { getDictionary } from "./dictionaries"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

const notoTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-zh",
})

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const locale: Locale = isLocale(lang) ? lang : "en"
  const dict = await getDictionary(locale)
  return {
    title: dict.meta.title,
    description: dict.meta.description,
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()

  return (
    <html
      lang={htmlLang[lang]}
      suppressHydrationWarning
      className={cn(
        "antialiased",
        inter.variable,
        fontMono.variable,
        notoTC.variable,
        "font-sans"
      )}
    >
      <body>
        {/* Pre-paint: set the theme class before first paint to avoid a flash.
            External src via next/script (not inline) so React 19 doesn't warn
            and the no-sync-scripts lint rule is satisfied. */}
        <Script src="/theme-init.js" strategy="beforeInteractive" />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
