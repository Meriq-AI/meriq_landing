"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  Copy,
  Link2,
  Loader2,
  Search,
  ShieldCheck,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { formatCcc } from "@/lib/tariff/hs-code"
import {
  computeCustomsValue,
  computeDuty,
  computeLanded,
  parseRate,
  quantityInUnit,
  twd,
  unitLabel,
  type Incoterm,
  type ParsedRate,
} from "@/lib/tariff/calc"
import { lookupTariffItem, type TariffLookup } from "@/app/actions/tariff"

type Col = "col1" | "col2" | "col3"
const COLS: { key: Col; label: string; note: string }[] = [
  { key: "col1", label: "第一欄", note: "WTO 會員 / 一般" },
  { key: "col2", label: "第二欄", note: "特定優惠國" },
  { key: "col3", label: "第三欄", note: "非互惠" },
]

const CURRENCIES = ["TWD", "USD", "CNY", "JPY", "EUR"] as const
const FX_HINT: Record<string, string> = {
  USD: "約 32",
  CNY: "約 4.5",
  JPY: "約 0.21",
  EUR: "約 35",
}

const INCOTERMS: { key: Incoterm; label: string }[] = [
  { key: "CIF", label: "CIF" },
  { key: "CFR", label: "CFR" },
  { key: "FOB", label: "FOB" },
]

const KIND_BADGE: Record<ParsedRate["kind"], string> = {
  free: "免稅",
  advalorem: "從價稅",
  specific: "從量稅",
  compound: "複合稅 · 從高",
  unknown: "—",
}

const num = (s: string) => Number(s.replace(/[^0-9.]/g, "")) || 0

function rateHeadline(p: ParsedRate): string {
  if (p.kind === "free") return "免稅"
  if (p.kind === "advalorem") return p.pct != null ? `${p.pct}%` : p.raw || "—"
  if (p.kind === "specific")
    return `NT$${p.specificAmount}/${unitLabel(p.specificUnit)}`
  if (p.kind === "compound")
    return `NT$${p.specificAmount}/${unitLabel(p.specificUnit)} 或 ${p.pct}%`
  return p.raw || "—"
}

export function TariffSimulator({ lang }: { lang: string }) {
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<TariffLookup | null>(null)
  const [col, setCol] = useState<Col>("col1")

  const [goodsValue, setGoodsValue] = useState("")
  const [currency, setCurrency] = useState<string>("TWD")
  const [incoterm, setIncoterm] = useState<Incoterm>("CIF")
  const [fxRate, setFxRate] = useState("")
  const [freight, setFreight] = useState("")
  const [insurance, setInsurance] = useState("")
  const [weight, setWeight] = useState("") // 淨重 KG (從量/複合)
  const [count, setCount] = useState("") // 數量 (MTR/SET)
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)

  const [loading, startLoad] = useTransition()

  function runSearch() {
    const q = query.trim()
    if (!q) return
    startLoad(async () => setSelected(await lookupTariffItem(q)))
  }

  // Restore a shared result from the URL on first load (?ccc=…&v=…).
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    const ccc = p.get("ccc")
    if (!ccc) return
    startLoad(async () => {
      setQuery(ccc)
      if (p.get("v")) setGoodsValue(p.get("v")!)
      if (p.get("cur")) setCurrency(p.get("cur")!)
      if (p.get("inc")) setIncoterm(p.get("inc") as Incoterm)
      if (p.get("col")) setCol(p.get("col") as Col)
      if (p.get("fx")) setFxRate(p.get("fx")!)
      if (p.get("fr")) setFreight(p.get("fr")!)
      if (p.get("ins")) setInsurance(p.get("ins")!)
      if (p.get("w")) setWeight(p.get("w")!)
      if (p.get("n")) setCount(p.get("n")!)
      setSelected(await lookupTariffItem(ccc))
    })
  }, [])

  function shareResults() {
    if (!selected?.found) return
    const p = new URLSearchParams({ ccc: selected.ccc })
    if (goodsValue) p.set("v", goodsValue)
    if (currency !== "TWD") p.set("cur", currency)
    if (incoterm !== "CIF") p.set("inc", incoterm)
    if (col !== "col1") p.set("col", col)
    if (fxRate) p.set("fx", fxRate)
    if (freight) p.set("fr", freight)
    if (insurance) p.set("ins", insurance)
    if (weight) p.set("w", weight)
    if (count) p.set("n", count)
    const url = `${window.location.origin}/${lang}/tariff?${p.toString()}`
    navigator.clipboard.writeText(url).then(() => {
      setShared(true)
      setTimeout(() => setShared(false), 2000)
    })
  }

  // ── derive everything (pure) ──────────────────────────────────────────────
  const parsed = selected?.found ? parseRate(selected.rates[col]) : null
  const isSpecific = parsed?.kind === "specific" || parsed?.kind === "compound"
  const unit = parsed?.specificUnit ?? null
  const needsCount = unit === "MTR" || unit === "SET"

  const fx = currency === "TWD" ? 1 : num(fxRate)
  const customsValue = computeCustomsValue({
    goodsValue: num(goodsValue),
    incoterm,
    freight: num(freight),
    insurance: num(insurance),
    fxRate: fx,
  })

  const rawQty = needsCount ? num(count) : num(weight)
  const qty =
    parsed && isSpecific && rawQty > 0
      ? quantityInUnit(unit, num(weight), num(count))
      : null
  const dutyRes = parsed ? computeDuty(customsValue, parsed, qty) : null

  const result =
    parsed && customsValue > 0 && dutyRes && dutyRes.duty != null
      ? computeLanded({
          customsValue,
          duty: dutyRes.duty,
          commodityTaxPct: selected?.commodityTax?.ratePercent ?? null,
        })
      : null

  function copySummary() {
    if (!selected || !result || !parsed) return
    const lines = [
      "【Meriq 進口稅費試算】",
      `${formatCcc(selected.ccc)} ${selected.nameZh ?? ""}`.trim(),
      `完稅價格:${twd(customsValue)}`,
      `進口關稅(${COLS.find((c) => c.key === col)?.label} ${rateHeadline(parsed)}):${twd(result.duty)}`,
      result.tradeFee > 0
        ? `推廣貿易服務費:${twd(result.tradeFee)}`
        : "推廣貿易服務費:免徵",
      result.commodityTax > 0 ? `貨物稅:${twd(result.commodityTax)}` : "",
      `營業稅 5%:${twd(result.vat)}`,
      `預估總稅費:${twd(result.totalTax)}`,
      `預估落地成本:${twd(result.landedCost)}`,
      "※ 僅供估算,實際稅費以海關核定為準。",
    ].filter(Boolean)
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-2">
        {/* ── Inputs ─────────────────────────────────────────── */}
        <div className="rounded-2xl bg-card p-5 shadow-sm shadow-black/[0.04]">
          <h2 className="text-[14px] font-semibold text-foreground">
            貨物資料
          </h2>

          <label className="mt-4 block text-[12px] text-muted-foreground">
            CCC 號列(11 碼)
          </label>
          <div className="mt-1.5 flex gap-2">
            <input
              value={query}
              inputMode="numeric"
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runSearch()}
              placeholder="例如:0801.32.10.00-1"
              className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-[14px] tabular-nums outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
            />
            <button
              onClick={runSearch}
              disabled={loading || !query.trim()}
              className="flex h-10 flex-shrink-0 items-center gap-1.5 rounded-lg bg-foreground px-4 text-[13px] font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Search className="size-4" />
              )}
              查詢
            </button>
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground/70">
            不確定 11 碼號列?可至{" "}
            <a
              href="https://hscode.customs.gov.tw/aisearch"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              海關稅則稅率查詢
            </a>
            。
          </p>

          {/* not found */}
          {selected && !selected.found && (
            <p className="mt-3 rounded-lg bg-muted/40 px-3 py-2.5 text-[12.5px] text-muted-foreground">
              查無此號列,請確認輸入完整的 11 碼 CCC 號列。
            </p>
          )}

          {/* Selected code — echo the official 貨名 to confirm the entered code */}
          {selected?.found && (
            <div className="mt-2 rounded-lg bg-muted/50 px-3 py-2.5">
              {selected.nameZh ? (
                <>
                  <div className="text-[13px] leading-relaxed text-foreground">
                    {selected.nameZh}
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground tabular-nums">
                    {formatCcc(selected.ccc)}
                  </div>
                </>
              ) : (
                <div className="text-[14px] font-semibold text-foreground tabular-nums">
                  {formatCcc(selected.ccc)}
                </div>
              )}
            </div>
          )}

          {/* Value + terms — only meaningful once a code is chosen */}
          {selected?.found && (
            <>
              <label className="mt-4 block text-[12px] text-muted-foreground">
                貨值
              </label>
              <div className="mt-1.5 flex gap-2">
                <input
                  value={goodsValue}
                  inputMode="numeric"
                  onChange={(e) => setGoodsValue(e.target.value)}
                  placeholder="例如:10,000"
                  className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-[14px] tabular-nums outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
                />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="h-10 flex-shrink-0 rounded-lg border border-input bg-background px-2 text-[13px] outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <label className="mt-4 block text-[12px] text-muted-foreground">
                貿易條件
              </label>
              <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                {INCOTERMS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setIncoterm(t.key)}
                    className={cn(
                      "rounded-lg py-2 text-center text-[13px] font-medium transition-colors",
                      incoterm === t.key
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/40 text-foreground hover:bg-muted/70"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* freight / insurance only when not CIF */}
              {incoterm !== "CIF" && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {incoterm === "FOB" && (
                    <Field
                      label={`運費 (${currency})`}
                      value={freight}
                      onChange={setFreight}
                    />
                  )}
                  <Field
                    label={`保險費 (${currency})`}
                    value={insurance}
                    onChange={setInsurance}
                  />
                </div>
              )}

              {/* exchange rate only when not TWD */}
              {currency !== "TWD" && (
                <>
                  <label className="mt-4 block text-[12px] text-muted-foreground">
                    報關匯率({currency} → TWD)
                  </label>
                  <input
                    value={fxRate}
                    inputMode="decimal"
                    onChange={(e) => setFxRate(e.target.value)}
                    placeholder={`海關每旬公告 ${FX_HINT[currency] ?? ""}`}
                    className="mt-1.5 h-10 w-full rounded-lg border border-input bg-background px-3 text-[14px] tabular-nums outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </>
              )}

              <label className="mt-4 block text-[12px] text-muted-foreground">
                適用稅率欄(依原產地)
              </label>
              <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                {COLS.map((c) => {
                  const active = col === c.key
                  return (
                    <button
                      key={c.key}
                      onClick={() => setCol(c.key)}
                      className={cn(
                        "rounded-lg px-2 py-2 text-center transition-colors",
                        active ? "bg-primary" : "bg-muted/40 hover:bg-muted/70"
                      )}
                    >
                      <div
                        className={cn(
                          "text-[11px]",
                          active
                            ? "text-primary-foreground/75"
                            : "text-muted-foreground"
                        )}
                      >
                        {c.label}
                      </div>
                      <div
                        className={cn(
                          "mt-0.5 truncate text-[12px] font-medium tabular-nums",
                          active ? "text-primary-foreground" : "text-foreground"
                        )}
                      >
                        {rateHeadline(parseRate(selected.rates[c.key]))}
                      </div>
                    </button>
                  )
                })}
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground/70">
                {COLS.find((c) => c.key === col)?.note}
                {selected.rates[col]?.trim()
                  ? ` · 稅率 ${selected.rates[col]!.trim()}`
                  : ""}
              </p>

              {/* 淨重 / 數量 — only for 從量 / 複合稅 */}
              {isSpecific && (
                <>
                  <label className="mt-4 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                    {needsCount ? `數量 (${unitLabel(unit)})` : "淨重 (公斤)"}
                    <span className="rounded bg-warning/10 px-1.5 py-0.5 text-[10px] font-medium text-warning">
                      {KIND_BADGE[parsed!.kind]}必填
                    </span>
                  </label>
                  <input
                    value={needsCount ? count : weight}
                    inputMode="numeric"
                    onChange={(e) =>
                      needsCount
                        ? setCount(e.target.value)
                        : setWeight(e.target.value)
                    }
                    placeholder={needsCount ? "例如:500" : "例如:1,000"}
                    className="mt-1.5 h-10 w-full rounded-lg border border-input bg-background px-3 text-[14px] tabular-nums outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </>
              )}
            </>
          )}
        </div>

        {/* ── Results ────────────────────────────────────────── */}
        <div className="rounded-2xl bg-card p-5 shadow-sm shadow-black/[0.04]">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-semibold text-foreground">
              試算結果
            </h2>
            {result && (
              <div className="flex items-center gap-0.5">
                <button
                  onClick={shareResults}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-[12px] text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                >
                  {shared ? (
                    <Check className="size-3.5 text-success" />
                  ) : (
                    <Link2 className="size-3.5" />
                  )}
                  {shared ? "已複製連結" : "分享"}
                </button>
                <button
                  onClick={copySummary}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-[12px] text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                >
                  {copied ? (
                    <Check className="size-3.5 text-success" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                  {copied ? "已複製" : "複製摘要"}
                </button>
              </div>
            )}
          </div>

          {!selected?.found || !parsed ? (
            <div className="flex h-[280px] flex-col items-center justify-center gap-2 text-center">
              <Search className="size-6 text-muted-foreground/30" />
              <p className="text-[12.5px] text-muted-foreground/60">
                {loading ? "查詢中…" : "輸入 CCC 號列開始試算"}
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-5">
              {/* Duty rate headline */}
              <div className="rounded-xl bg-muted/40 px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground">
                    進口關稅率({COLS.find((c) => c.key === col)?.label})
                  </span>
                  <span className="rounded-full bg-foreground/[0.06] px-2 py-0.5 text-[10px] font-medium text-foreground/70">
                    {KIND_BADGE[parsed.kind]}
                  </span>
                </div>
                <div className="mt-0.5 text-[26px] font-semibold tracking-tight text-foreground">
                  {rateHeadline(parsed)}
                </div>
                {parsed.kind === "compound" && (
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    從價與從量取較高者課徵
                  </p>
                )}
              </div>

              {/* needs weight prompt */}
              {isSpecific && dutyRes?.needsQuantity && (
                <p className="flex items-center gap-1.5 rounded-lg bg-warning/10 px-3 py-2.5 text-[12.5px] text-warning">
                  <AlertTriangle className="size-3.5 flex-shrink-0" />
                  此號列為{KIND_BADGE[parsed.kind]},請輸入
                  {needsCount ? `數量(${unitLabel(unit)})` : "淨重(公斤)"}
                  才能估算關稅。
                </p>
              )}

              {/* Cost breakdown */}
              {result ? (
                <div className="space-y-1.5 text-[13px]">
                  <Row label="完稅價格(CIF)" value={twd(customsValue)} muted />
                  <Row
                    label={
                      parsed.kind === "compound" && dutyRes?.applied
                        ? `進口關稅(從${dutyRes.applied === "specific" ? "量" : "價"}適用)`
                        : "進口關稅"
                    }
                    value={twd(result.duty)}
                  />
                  <Row
                    label="推廣貿易服務費 0.04%"
                    value={result.tradeFee > 0 ? twd(result.tradeFee) : "免徵"}
                  />
                  {result.commodityTax > 0 && (
                    <Row
                      label={`貨物稅 ${selected.commodityTax?.ratePercent}%${
                        selected.commodityTax?.subcategoryZh
                          ? `(${selected.commodityTax.subcategoryZh})`
                          : ""
                      }`}
                      value={twd(result.commodityTax)}
                    />
                  )}
                  <Row label="營業稅 5%" value={twd(result.vat)} />
                  <p className="pl-0.5 text-[10.5px] text-muted-foreground/70">
                    稅基 = 完稅價格 + 進口關稅
                    {result.commodityTax > 0 ? " + 貨物稅" : ""}
                  </p>
                  <div className="my-1.5 border-t border-border/60" />
                  <Row label="總稅費" value={twd(result.totalTax)} strong />
                  <div className="mt-2 flex items-center justify-between rounded-lg bg-primary/10 px-3 py-2.5">
                    <span className="text-[13px] font-medium text-foreground">
                      預估落地成本
                    </span>
                    <span className="text-[18px] font-semibold text-primary tabular-nums">
                      {twd(result.landedCost)}
                    </span>
                  </div>
                </div>
              ) : (
                !dutyRes?.needsQuantity && (
                  <p className="rounded-lg bg-muted/30 px-3 py-3 text-center text-[12.5px] text-muted-foreground">
                    {currency !== "TWD" && num(fxRate) <= 0
                      ? "輸入貨值與報關匯率以估算稅費"
                      : "輸入貨值以估算稅費與落地成本"}
                  </p>
                )
              )}

              {/* 其他稅費 — 從量/依品項 貨物稅 或 菸酒稅 (authoritative flag, 未計入) */}
              {((selected.commodityTax &&
                selected.commodityTax.ratePercent == null) ||
                selected.tobaccoAlcoholTax) && (
                <div className="space-y-1.5">
                  {selected.commodityTax &&
                    selected.commodityTax.ratePercent == null && (
                      <p className="flex gap-1.5 rounded-lg bg-warning/10 px-3 py-2 text-[12px] leading-relaxed text-warning">
                        <AlertTriangle className="mt-px size-3.5 flex-shrink-0" />
                        <span>
                          應徵貨物稅
                          {selected.commodityTax.subcategoryZh
                            ? `(${selected.commodityTax.subcategoryZh})`
                            : ""}
                          {selected.commodityTax.note
                            ? ` — ${selected.commodityTax.note}`
                            : ""}
                          ;依品項/數量,未計入估算。
                        </span>
                      </p>
                    )}
                  {selected.tobaccoAlcoholTax && (
                    <p className="flex gap-1.5 rounded-lg bg-warning/10 px-3 py-2 text-[12px] leading-relaxed text-warning">
                      <AlertTriangle className="mt-px size-3.5 flex-shrink-0" />
                      <span>應徵菸酒稅(含菸品健康福利捐),未計入估算。</span>
                    </p>
                  )}
                </div>
              )}

              {/* 輸入規定 / 簽審 — what the gov calculator + Cervo don't show */}
              <div>
                <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-muted-foreground/70 uppercase">
                  輸入規定 / 簽審
                </div>
                {selected.regulations.length === 0 ? (
                  <p className="flex items-center gap-1.5 text-[12.5px] text-success">
                    <ShieldCheck className="size-3.5" />
                    查無輸入規定(准許免證)
                  </p>
                ) : (
                  <ul className="space-y-1.5">
                    {selected.regulations.map((r) => (
                      <li key={r.code} className="flex gap-2.5">
                        <span className="mt-px flex-shrink-0 rounded bg-warning/10 px-1.5 py-0.5 text-[11px] font-medium text-warning tabular-nums">
                          {r.code}
                        </span>
                        <span className="text-[12.5px] leading-relaxed text-foreground/80">
                          {r.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <Link
        href={`/${lang}`}
        className="mt-4 flex items-center justify-between rounded-2xl bg-foreground px-5 py-4 text-background transition-opacity hover:opacity-90"
      >
        <div>
          <div className="text-[14px] font-semibold">
            想把整票貨在報關前自動查核?
          </div>
          <div className="mt-0.5 text-[12.5px] text-background/70">
            Meriq 幫你抽欄位、跨文件對帳、帶出簽審、產生追件訊息。
          </div>
        </div>
        <span className="flex flex-shrink-0 items-center gap-1 rounded-lg bg-primary px-3.5 py-2 text-[13px] font-medium text-primary-foreground">
          了解 Meriq
          <ArrowUpRight className="size-4" />
        </span>
      </Link>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-[12px] text-muted-foreground">{label}</label>
      <input
        value={value}
        inputMode="numeric"
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 h-10 w-full rounded-lg border border-input bg-background px-3 text-[14px] tabular-nums outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
      />
    </div>
  )
}

function Row({
  label,
  value,
  muted,
  strong,
}: {
  label: string
  value: string
  muted?: boolean
  strong?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={cn(
          "text-[13px]",
          muted ? "text-muted-foreground" : "text-foreground/80",
          strong && "font-medium text-foreground"
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "text-[13px] tabular-nums",
          muted ? "text-muted-foreground" : "text-foreground",
          strong && "font-semibold"
        )}
      >
        {value}
      </span>
    </div>
  )
}
