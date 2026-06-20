import Image from "next/image"
import {
  ArrowUp,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Inbox,
  MapPin,
  MessageCircle,
  Minus,
  Settings,
  SignalHigh,
  User,
} from "lucide-react"

import { cn } from "@/lib/utils"
import type { Locale } from "@/lib/i18n/config"

/**
 * A faithful, static reproduction of the real MeriqAI case-detail view
 * (sidebar · shipment data · Ask Meriq review rail). The product chrome follows
 * the site locale: English on /en, Traditional Chinese on /zh-TW. Customer data
 * is mock (Acme / Globex). Rendered at a fixed design width and bled off the
 * viewport edge in the hero.
 */

type Finding = {
  dot: string
  title: string
  explanation: string
  evidence?: string[]
  locate?: boolean
}

type Strings = {
  org: string
  nav: { cases: string; feedback: string; members: string }
  status: string
  priority: string
  assignee: string
  customer: string
  cargo: string
  viewDocs: string
  notProvided: string
  groups: { parties: string; goods: string; terms: string }
  fields: {
    exporter: string
    consignee: string
    supplier: string
    description: string
    quantity: string
    netWeight: string
    grossWeight: string
    total: string
    origin: string
    incoterms: string
  }
  values: {
    exporter: string
    consignee: string
    description: string
    quantity: string
    netWeight: string
    grossWeight: string
    total: string
    incoterms: string
  }
  askMeriq: string
  review: string
  opening: string
  findings: Finding[]
  period: string
  markDone: string
  dismiss: string
  locate: string
  genReport: string
  presets: string[]
  composer: string
}

const EVIDENCE = ["CI  Gross weight: 13,210 KG", "PL  Gross weight: 13,120 KG"]

const STRINGS: Record<Locale, Strings> = {
  en: {
    org: "Demo Brokerage",
    nav: { cases: "Cases", feedback: "Feedback", members: "Members" },
    status: "Needs action",
    priority: "High",
    assignee: "Justin",
    customer: "Acme Foods Co.",
    cargo: "Shipment data",
    viewDocs: "View documents",
    notProvided: "Not provided",
    groups: { parties: "Parties", goods: "Goods", terms: "Value & terms" },
    fields: {
      exporter: "Exporter",
      consignee: "Consignee",
      supplier: "Supplier",
      description: "Description",
      quantity: "Quantity",
      netWeight: "Net weight",
      grossWeight: "Gross weight",
      total: "Total value",
      origin: "Country of origin",
      incoterms: "Incoterms",
    },
    values: {
      exporter: "Globex Trading Co.",
      consignee: "Acme Foods Co.",
      description: "Cashew Kernels WW320",
      quantity: "1,040 CTN",
      netWeight: "12,480 KG",
      grossWeight: "13,210 KG",
      total: "USD 48,200.00",
      incoterms: "CIF KAOHSIUNG",
    },
    askMeriq: "Ask Meriq",
    review: "Document review",
    opening:
      "I compared the commercial invoice and packing list: 1 to fix, 2 to confirm, and 8 checks passed.",
    findings: [
      {
        dot: "bg-destructive",
        title: "Gross weight mismatch",
        explanation:
          "The invoice and packing list don’t agree — confirm the correct value before filing.",
        evidence: EVIDENCE,
        locate: true,
      },
      {
        dot: "bg-warning",
        title: "Missing packing-list number",
        explanation: "The packing list has no document number; request it from the supplier.",
      },
      {
        dot: "bg-warning",
        title: "Country of origin missing",
        explanation: "3 line items have no origin, which affects tariff classification.",
        locate: true,
      },
    ],
    period: ".",
    markDone: "Mark done",
    dismiss: "Dismiss",
    locate: "View in document",
    genReport: "Generate full review report →",
    presets: ["Who are the buyer and seller?", "Total value and currency?", "List the line items"],
    composer: "Ask Meriq about this shipment…",
  },
  "zh-TW": {
    org: "示範報關行",
    nav: { cases: "案件", feedback: "意見回饋", members: "成員管理" },
    status: "需處理",
    priority: "高",
    assignee: "Justin",
    customer: "Acme Foods Co.",
    cargo: "貨物資料",
    viewDocs: "檢視文件",
    notProvided: "未提供",
    groups: { parties: "交易方", goods: "商品", terms: "金額與貿易條件" },
    fields: {
      exporter: "出口商名稱",
      consignee: "收貨人",
      supplier: "供應商",
      description: "商品描述",
      quantity: "數量",
      netWeight: "淨重",
      grossWeight: "毛重",
      total: "總金額",
      origin: "原產地",
      incoterms: "貿易條件",
    },
    values: {
      exporter: "Globex Trading Co.",
      consignee: "Acme Foods Co.",
      description: "腰果仁 Cashew Kernels WW320",
      quantity: "1,040 CTN",
      netWeight: "12,480 KG",
      grossWeight: "13,210 KG",
      total: "USD 48,200.00",
      incoterms: "CIF KAOHSIUNG",
    },
    askMeriq: "Ask Meriq",
    review: "文件審查",
    opening:
      "我比對了商業發票、裝箱單，發現 1 項必須處理、2 項建議確認，另有 8 項查核通過。",
    findings: [
      {
        dot: "bg-destructive",
        title: "毛重不一致",
        explanation: "商業發票與裝箱單的毛重對不起來，報關前需確認正確值。",
        evidence: EVIDENCE,
        locate: true,
      },
      {
        dot: "bg-warning",
        title: "缺少裝箱單號碼",
        explanation: "裝箱單上未標示單號，建議向供應商索取。",
      },
      {
        dot: "bg-warning",
        title: "原產地未填",
        explanation: "3 筆品項缺少原產地，會影響稅則認定。",
        locate: true,
      },
    ],
    period: "。",
    markDone: "標記完成",
    dismiss: "忽略",
    locate: "在文件中查看",
    genReport: "生成完整審查報告 →",
    presets: ["買方、賣方分別是誰？", "總金額與幣別？", "列出商品明細"],
    composer: "詢問 Meriq 這票貨…",
  },
}

function MeriqMark({ size = 20 }: { size?: number }) {
  return (
    <Image
      src="/meriqLogo.png"
      alt=""
      width={size}
      height={size}
      className="flex-shrink-0 rounded-[5px]"
    />
  )
}

type FieldState = "ok" | "confirmed" | "missing"

function Field({
  label,
  value,
  notProvided,
  state = "ok",
}: {
  label: string
  value?: string
  notProvided: string
  state?: FieldState
}) {
  return (
    <div className="flex items-start gap-3 rounded-md px-2.5 py-[7px]">
      <span className="w-[120px] shrink-0 pt-0.5 text-[12.5px] text-muted-foreground">
        {label}
      </span>
      <div className="flex min-w-0 flex-1 items-start gap-2">
        {state === "missing" ? (
          <span className="flex items-center gap-1 pt-0.5 text-[12.5px] text-muted-foreground/50">
            <Minus className="size-3.5" />
            {notProvided}
          </span>
        ) : (
          <span className="pt-0.5 text-[13px] leading-relaxed break-words text-foreground/90">
            {value}
          </span>
        )}
        {state === "confirmed" && (
          <CircleCheck className="mt-0.5 size-3.5 shrink-0 text-success" />
        )}
      </div>
    </div>
  )
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 mb-1 px-2.5 text-[11px] font-medium tracking-wide text-muted-foreground/70 first:mt-0">
      {children}
    </p>
  )
}

function FindingRow({ finding, t }: { finding: Finding; t: Strings }) {
  return (
    <div className="-mx-2 rounded-lg px-2 py-2">
      <div className="flex items-start gap-2">
        <span
          className={cn("mt-[6px] size-1.5 flex-shrink-0 rounded-full", finding.dot)}
        />
        <div className="min-w-0 flex-1">
          <p className="text-[12.5px] leading-relaxed">
            <span className="font-medium text-foreground">
              {finding.title}
              {t.period}
            </span>
            <span className="text-muted-foreground"> {finding.explanation}</span>
          </p>
          {finding.evidence && (
            <div className="mt-1.5 space-y-0.5 border-l border-border pl-2.5">
              {finding.evidence.map((line) => (
                <div
                  key={line}
                  className="font-mono text-[11px] leading-relaxed text-muted-foreground/80"
                >
                  {line}
                </div>
              ))}
            </div>
          )}
          <div className="mt-1.5 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span>{t.markDone}</span>
            <span>{t.dismiss}</span>
            {finding.locate && (
              <span className="ml-auto flex items-center gap-1 text-primary">
                <MapPin className="size-3" />
                {t.locate}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function AppMockup({
  lang,
  className,
}: {
  lang: Locale
  className?: string
}) {
  const t = STRINGS[lang]

  return (
    <div
      className={cn(
        "flex h-[600px] w-full min-w-[1040px] overflow-hidden rounded-xl border border-border bg-background text-left",
        className
      )}
    >
      {/* ── Sidebar ── */}
      <aside className="flex w-[200px] flex-shrink-0 flex-col bg-sidebar">
        <div className="flex h-14 flex-shrink-0 items-center border-b border-sidebar-border px-3">
          <div className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2">
            <MeriqMark size={24} />
            <span className="flex-1 text-[14px] font-semibold tracking-tight text-sidebar-foreground">
              MeriqAI
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/60" />
          </div>
        </div>

        <nav className="flex-1 px-2 py-2">
          <div className="flex items-center gap-2.5 rounded bg-sidebar-accent px-2 py-1.5 text-[13px] font-medium text-sidebar-foreground">
            <Inbox className="h-[15px] w-[15px]" />
            <span className="flex-1">{t.nav.cases}</span>
            <span className="text-[11px] text-muted-foreground tabular-nums">8</span>
          </div>
          <div className="my-2 px-2">
            <div className="h-px bg-sidebar-border" />
          </div>
          <div className="flex items-center gap-2.5 rounded px-2 py-1.5 text-[13px] text-muted-foreground">
            <MessageCircle className="h-[15px] w-[15px]" />
            <span>{t.nav.feedback}</span>
          </div>
          <div className="flex items-center gap-2.5 rounded px-2 py-1.5 text-[13px] text-muted-foreground">
            <Settings className="h-[15px] w-[15px]" />
            <span>{t.nav.members}</span>
          </div>
        </nav>

        <div className="flex-shrink-0 border-t border-sidebar-border px-3 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/15">
              <span className="text-[10px] font-semibold text-primary">J</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-medium text-sidebar-foreground">
                Justin
              </p>
              <p className="truncate text-[11px] text-muted-foreground">{t.org}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Center: case detail ── */}
      <div className="flex min-w-0 flex-1 flex-col bg-background">
        <div className="flex h-12 flex-shrink-0 items-center gap-1.5 px-4">
          <span className="text-[13px] text-muted-foreground">{t.nav.cases}</span>
          <ChevronRight className="size-3.5 text-muted-foreground/50" />
          <span className="font-mono text-[13px] text-foreground">M-1042</span>
          <span className="mx-1 text-muted-foreground/40">·</span>
          <span className="truncate text-[12px] text-muted-foreground">
            {t.customer}
          </span>
          <div className="ml-auto flex items-center gap-3 text-[12px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/25 bg-warning/10 px-2 py-0.5 text-[11.5px] font-medium text-warning">
              <span className="size-1.5 rounded-full bg-warning" />
              {t.status}
            </span>
            <span className="flex items-center gap-1">
              <SignalHigh className="size-3.5 text-muted-foreground/60" />
              {t.priority}
            </span>
            <span className="flex items-center gap-1">
              <User className="size-3.5 text-muted-foreground/60" />
              {t.assignee}
            </span>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 gap-2 p-2.5 pt-1">
          {/* shipment data */}
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-border/60 bg-card">
            <div className="flex h-11 flex-shrink-0 items-center justify-between border-b border-border/60 px-4">
              <span className="text-[13px] font-medium text-foreground">
                {t.cargo}
              </span>
              <span className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[13px] font-medium text-muted-foreground">
                {t.viewDocs} <span className="text-muted-foreground/70">3</span>
              </span>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden p-3">
              <GroupLabel>{t.groups.parties}</GroupLabel>
              <Field
                label={t.fields.exporter}
                value={t.values.exporter}
                notProvided={t.notProvided}
                state="confirmed"
              />
              <Field
                label={t.fields.consignee}
                value={t.values.consignee}
                notProvided={t.notProvided}
                state="confirmed"
              />
              <Field
                label={t.fields.supplier}
                notProvided={t.notProvided}
                state="missing"
              />

              <GroupLabel>{t.groups.goods}</GroupLabel>
              <Field
                label={t.fields.description}
                value={t.values.description}
                notProvided={t.notProvided}
                state="confirmed"
              />
              <Field
                label={t.fields.quantity}
                value={t.values.quantity}
                notProvided={t.notProvided}
              />
              <Field
                label={t.fields.netWeight}
                value={t.values.netWeight}
                notProvided={t.notProvided}
                state="confirmed"
              />
              <Field
                label={t.fields.grossWeight}
                value={t.values.grossWeight}
                notProvided={t.notProvided}
              />

              <GroupLabel>{t.groups.terms}</GroupLabel>
              <Field
                label={t.fields.total}
                value={t.values.total}
                notProvided={t.notProvided}
                state="confirmed"
              />
              <Field
                label={t.fields.origin}
                notProvided={t.notProvided}
                state="missing"
              />
              <Field
                label={t.fields.incoterms}
                value={t.values.incoterms}
                notProvided={t.notProvided}
              />
            </div>
          </div>

          {/* Ask Meriq rail */}
          <div className="flex w-[340px] flex-shrink-0 flex-col overflow-hidden rounded-xl border border-border/60 bg-card">
            <div className="flex h-11 flex-shrink-0 items-center border-b border-border/60 px-4">
              <span className="text-[13px] font-medium text-foreground">
                {t.askMeriq}
              </span>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden px-4 py-3.5">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <MeriqMark />
                  <span className="text-[12px] font-medium text-foreground">
                    Meriq
                  </span>
                  <span className="text-[11px] text-muted-foreground/50">
                    {t.review}
                  </span>
                </div>
                <p className="text-[12.5px] leading-relaxed text-foreground">
                  {t.opening}
                </p>

                <div className="space-y-1 pt-0.5">
                  {t.findings.map((f) => (
                    <FindingRow key={f.title} finding={f} t={t} />
                  ))}
                </div>

                <button className="pt-0.5 text-left text-[11.5px] text-primary">
                  {t.genReport}
                </button>
              </div>
            </div>

            <div className="flex-shrink-0 border-t border-border/60 p-2.5">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {t.presets.map((q) => (
                  <span
                    key={q}
                    className="rounded-full border border-border/60 bg-background px-2.5 py-1 text-[11.5px] text-muted-foreground"
                  >
                    {q}
                  </span>
                ))}
              </div>
              <div className="rounded-xl border border-border/60 bg-background px-3 py-2.5">
                <p className="text-[12.5px] text-muted-foreground/50">{t.composer}</p>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60">
                    <MeriqMark size={14} />
                    Meriq
                  </span>
                  <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <ArrowUp className="size-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
