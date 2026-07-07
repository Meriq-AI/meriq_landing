import type { Metadata } from "next"
import {
  Bricolage_Grotesque,
  Geist_Mono,
  Inter,
  Noto_Sans_TC,
} from "next/font/google"
import { notFound } from "next/navigation"

import "../globals.css"
import { cn } from "@/lib/utils"
import { htmlLang, isLocale, locales, type Locale } from "@/lib/i18n/config"
import { KEYWORDS, ogLocale, SITE_NAME, SITE_URL } from "@/lib/seo"
import { getDictionary } from "./dictionaries"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

// Latin display face for headlines; zh headlines fall back to Noto Sans TC.
// Every font-display usage is semibold — ship just the 600 instance, not the
// whole variable axis.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: "600",
  variable: "--font-display",
})

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
    metadataBase: new URL(SITE_URL),
    title: {
      default: dict.meta.title,
      template: `%s · ${SITE_NAME}`,
    },
    description: dict.meta.description,
    applicationName: SITE_NAME,
    keywords: KEYWORDS,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: ogLocale[locale],
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map((l) => ogLocale[l]),
      url: `${SITE_URL}/${locale}`,
      title: dict.meta.title,
      description: dict.meta.description,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: ["/og.png"],
    },
    // Favicon + Apple touch icon come from app/icon.png and app/apple-icon.png.
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
      className={cn(
        "antialiased",
        inter.variable,
        fontMono.variable,
        display.variable,
        notoTC.variable,
        "font-sans"
      )}
    >
      <body>{children}</body>
    </html>
  )
}
