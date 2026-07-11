export const locales = ["en", "zh-TW"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "zh-TW"

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  "zh-TW": "zh-TW",
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

// BCP-47 lang attribute for <html lang>
export const htmlLang: Record<Locale, string> = {
  en: "en",
  "zh-TW": "zh-Hant-TW",
}
