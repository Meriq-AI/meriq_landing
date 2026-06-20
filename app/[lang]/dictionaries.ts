import "server-only"

import type { Locale } from "@/lib/i18n/config"

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  "zh-TW": () => import("./dictionaries/zh-TW.json").then((m) => m.default),
}

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["en"]>>

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]()
