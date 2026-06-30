// Pure import-tax estimation for the public 稅費試算 tool. No deps so it runs on
// the client. Estimates only — actual duty is determined by 海關.

// ── 稅率解析 ────────────────────────────────────────────────────────────────
// 國定稅率 comes in three shapes (財政部關務署 #80871):
//   從價稅 ad valorem  "2.5%" · "Free" · "0% (PA,GT,…)" (優惠國 → 0)
//   從量稅 specific     "NT$10/KGM" · "NT$750/TNE"  (額定 / 單位)
//   複合稅 compound     "NT$11.3/KGM or 15% whichever is higher" (從高課徵)
export type DutyKind =
  | "free"
  | "advalorem"
  | "specific"
  | "compound"
  | "unknown"
export type SpecificUnit = "KGM" | "TNE" | "MTR" | "SET"

export interface ParsedRate {
  kind: DutyKind
  pct: number | null // 從價率 %
  specificAmount: number | null // 從量額 NT$/unit
  specificUnit: SpecificUnit | null
  raw: string
}

export function parseRate(raw: string | null | undefined): ParsedRate {
  const s = (raw ?? "").trim()
  const base: ParsedRate = {
    kind: "unknown",
    pct: null,
    specificAmount: null,
    specificUnit: null,
    raw: s,
  }
  if (!s) return base
  if (/^(免稅|free)$/i.test(s)) return { ...base, kind: "free", pct: 0 }

  const spec = s.match(/NT\$\s*([0-9.]+)\s*\/\s*(KGM|TNE|MTR|SET)/i)
  const pctM = s.match(/([0-9]+(?:\.[0-9]+)?)\s*%/)
  const pct = pctM ? parseFloat(pctM[1]) : null
  const specificAmount = spec ? parseFloat(spec[1]) : null
  const specificUnit = spec ? (spec[2].toUpperCase() as SpecificUnit) : null

  if (spec && pctM)
    return { ...base, kind: "compound", pct, specificAmount, specificUnit }
  if (spec) return { ...base, kind: "specific", specificAmount, specificUnit }
  if (pctM) return { ...base, kind: "advalorem", pct }
  return base
}

const UNIT_LABEL: Record<SpecificUnit, string> = {
  KGM: "公斤",
  TNE: "公噸",
  MTR: "公尺",
  SET: "件",
}
export const unitLabel = (u: SpecificUnit | null) => (u ? UNIT_LABEL[u] : "")

// The 從量 base measured in the rate's own unit, from a natural user input.
// Weight is entered in KG; TNE rates need it in tonnes.
export function quantityInUnit(
  unit: SpecificUnit | null,
  weightKg: number,
  count: number
): number | null {
  if (!unit) return null
  if (unit === "KGM") return weightKg
  if (unit === "TNE") return weightKg / 1000
  return count // MTR / SET — entered directly
}

// ── 完稅價格 ────────────────────────────────────────────────────────────────
// 完稅價格 = CIF in TWD. FOB/CFR get freight/insurance added, then × 報關匯率.
export type Incoterm = "CIF" | "CFR" | "FOB"

export function computeCustomsValue({
  goodsValue,
  incoterm,
  freight = 0,
  insurance = 0,
  fxRate = 1,
}: {
  goodsValue: number
  incoterm: Incoterm
  freight?: number
  insurance?: number
  fxRate?: number
}): number {
  const foreignCif =
    incoterm === "CIF"
      ? goodsValue
      : incoterm === "CFR"
        ? goodsValue + insurance
        : goodsValue + freight + insurance // FOB
  return Math.max(0, foreignCif) * (fxRate || 1)
}

// ── 進口關稅 ────────────────────────────────────────────────────────────────
export interface DutyResult {
  duty: number | null // null = needs quantity to compute
  applied: DutyKind | null // which leg won (for 複合)
  needsQuantity: boolean
}

export function computeDuty(
  customsValue: number,
  p: ParsedRate,
  qty: number | null
): DutyResult {
  const adv = p.pct != null ? customsValue * (p.pct / 100) : null
  switch (p.kind) {
    case "free":
      return { duty: 0, applied: "free", needsQuantity: false }
    case "advalorem":
      return { duty: adv, applied: "advalorem", needsQuantity: false }
    case "specific": {
      if (qty == null || p.specificAmount == null)
        return { duty: null, applied: null, needsQuantity: true }
      return {
        duty: qty * p.specificAmount,
        applied: "specific",
        needsQuantity: false,
      }
    }
    case "compound": {
      if (qty == null || p.specificAmount == null)
        return { duty: null, applied: null, needsQuantity: true }
      const spec = qty * p.specificAmount
      const advVal = adv ?? 0
      return spec >= advVal
        ? { duty: spec, applied: "specific", needsQuantity: false }
        : { duty: advVal, applied: "advalorem", needsQuantity: false }
    }
    default:
      return { duty: null, applied: null, needsQuantity: false }
  }
}

// ── 落地成本 ────────────────────────────────────────────────────────────────
export interface LandedResult {
  duty: number // 進口關稅
  tradeFee: number // 推廣貿易服務費 0.04%
  commodityTax: number // 貨物稅
  vat: number // 營業稅 5%
  totalTax: number
  landedCost: number
}

const TRADE_PROMOTION_FEE = 0.0004 // 推廣貿易服務費 萬分之四
const TRADE_FEE_MIN = 100 // 應徵金額未達 100 元免徵
const VAT_RATE = 0.05 // 營業稅 5%

export function computeLanded({
  customsValue,
  duty,
  commodityTaxPct,
}: {
  customsValue: number
  duty: number
  commodityTaxPct?: number | null
}): LandedResult {
  const value = Math.max(0, customsValue || 0)
  const d = Math.max(0, duty || 0)
  const rawFee = value * TRADE_PROMOTION_FEE
  const tradeFee = rawFee < TRADE_FEE_MIN ? 0 : rawFee
  // 貨物稅 base ≈ 完稅價格 + 進口關稅 (estimate).
  const commodityTax =
    commodityTaxPct != null && commodityTaxPct > 0
      ? (value + d) * (commodityTaxPct / 100)
      : 0
  // 營業稅 base = 完稅價格 + 進口關稅 + 貨物稅.
  const vat = (value + d + commodityTax) * VAT_RATE
  const totalTax = d + tradeFee + commodityTax + vat
  return {
    duty: d,
    tradeFee,
    commodityTax,
    vat,
    totalTax,
    landedCost: value + totalTax,
  }
}

export const twd = (n: number) => `NT$${Math.round(n).toLocaleString("en-US")}`
