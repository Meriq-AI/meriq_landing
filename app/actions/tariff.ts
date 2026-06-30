"use server"

import { createClient } from "@supabase/supabase-js"

// Public 稅費試算 lookup. Reads the public gov-data compliance_* reference tables
// on the prod project with the publishable/anon key (those tables have an anon
// SELECT policy). No user data, no writes.

function db() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_PUBLISHABLE_KEY
  if (!url || !key)
    throw new Error("Missing SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY")
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export interface TariffLookup {
  found: boolean
  ccc: string
  nameZh: string | null
  rates: { col1: string | null; col2: string | null; col3: string | null }
  regulations: { code: string; description: string }[]
  commodityTax: {
    ratePercent: number | null
    subcategoryZh: string | null
    note: string | null
  } | null
  tobaccoAlcoholTax: boolean
}

interface TariffRow {
  ccc_code: string
  name_zh: string | null
  rate_col1: string | null
  rate_col2: string | null
  rate_col3: string | null
  excise_code: string | null
}

interface RuleRow {
  ccc_prefix: string | null
  rate_type: string | null
  rate_percent: number | null
  subcategory_zh: string | null
  exemption_note: string | null
}

/** A typed/confirmed CCC號列 → its 稅率 + 輸入規定 + 貨物稅. */
export async function lookupTariffItem(input: string): Promise<TariffLookup> {
  const digits = input.replace(/\D/g, "")
  const empty: TariffLookup = {
    found: false,
    ccc: digits,
    nameZh: null,
    rates: { col1: null, col2: null, col3: null },
    regulations: [],
    commodityTax: null,
    tobaccoAlcoholTax: false,
  }
  if (digits.length < 6) return empty

  const supabase = db()

  // Tariff item — exact 11碼, else first match by prefix.
  const sel = supabase
    .from("compliance_tariff_items")
    .select("ccc_code, name_zh, rate_col1, rate_col2, rate_col3, excise_code")
  const { data: item } = (
    digits.length >= 11
      ? await sel.eq("ccc_code", digits.slice(0, 11)).maybeSingle()
      : await sel
          .ilike("ccc_code", `${digits}%`)
          .order("ccc_code", { ascending: true })
          .limit(1)
          .maybeSingle()
  ) as { data: TariffRow | null }

  if (!item) return empty
  const ccc = item.ccc_code

  // 輸入規定 / 簽審
  const { data: regs } = (await supabase
    .from("compliance_ccc_regulations")
    .select(
      "regulation_code, compliance_import_regulation_codes(description_zh)"
    )
    .eq("ccc_code", ccc)) as {
    data:
      | {
          regulation_code: string
          compliance_import_regulation_codes:
            | { description_zh: string | null }
            | { description_zh: string | null }[]
            | null
        }[]
      | null
  }
  const regulations = (regs ?? []).map((r) => {
    const embed = r.compliance_import_regulation_codes
    const def = Array.isArray(embed) ? embed[0] : embed
    return { code: r.regulation_code, description: def?.description_zh ?? "" }
  })

  // 貨物稅 / 菸酒稅 — applicability is authoritative from 稽徵規定 (T / B / C).
  const exciseTokens: string[] = String(item.excise_code ?? "")
    .split(/\s+/)
    .filter(Boolean)
  const hasCode = (c: string) =>
    exciseTokens.some((t) => t.replace("*", "") === c)
  const commodityApplicable = hasCode("T")
  const tobaccoAlcoholTax = hasCode("B") || hasCode("C")

  let commodityTax: TariffLookup["commodityTax"] = null
  if (commodityApplicable) {
    const { data: rules } = (await supabase
      .from("compliance_commodity_tax_rules")
      .select(
        "ccc_prefix, rate_type, rate_percent, subcategory_zh, exemption_note"
      )
      .not("ccc_prefix", "is", null)) as { data: RuleRow[] | null }
    let best: RuleRow | null = null
    let bestLen = 0
    for (const rule of rules ?? []) {
      const prefix = rule.ccc_prefix ?? ""
      if (prefix && ccc.startsWith(prefix) && prefix.length > bestLen) {
        bestLen = prefix.length
        best = rule
      }
    }
    commodityTax = {
      ratePercent:
        best?.rate_type === "ad_valorem" ? (best.rate_percent ?? null) : null,
      subcategoryZh: best?.subcategory_zh ?? null,
      note: best?.exemption_note ?? null,
    }
  }

  return {
    found: true,
    ccc,
    nameZh: item.name_zh,
    rates: { col1: item.rate_col1, col2: item.rate_col2, col3: item.rate_col3 },
    regulations,
    commodityTax,
    tobaccoAlcoholTax,
  }
}
