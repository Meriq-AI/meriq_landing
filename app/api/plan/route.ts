import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"

// Public unauthenticated endpoint: coerce every field defensively (non-string
// values must not throw), cap lengths, and bail silently on the honeypot.
function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : ""
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  // Honeypot: hidden "website" field — humans never fill it. Pretend success.
  if (str(body.website, 10)) {
    return NextResponse.json({ ok: true })
  }

  const name = str(body.name, 120)
  const email = str(body.email, 200)
  const destination = str(body.destination, 200)
  const product = str(body.product, 300)

  if (!name || !destination || !product || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    )
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Server not configured" },
      { status: 500 }
    )
  }

  const record = {
    name,
    company: str(body.company, 200) || null,
    email,
    phone: str(body.phone, 60) || null,
    origin: str(body.origin, 200) || null,
    destination,
    incoterm: str(body.incoterm, 20) || null,
    mode: str(body.mode, 20) || null,
    customs_handling: str(body.customs_handling, 30) || null,
    product,
    quantity: str(body.quantity, 200) || null,
    weight: str(body.weight, 100) || null,
    ready_date: str(body.ready_date, 100) || null,
    dangerous_goods: body.dangerous_goods === true,
    inquiry_text: str(body.inquiry_text, 8000) || null,
    wants_call: body.wants_call === true,
    lang: str(body.lang, 10) || null,
    source: str(body.source, 60) || null,
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  const { error } = await supabase.from("export_plan_requests").insert(record)
  if (error) {
    console.error("export plan insert failed:", error.message)
    return NextResponse.json({ error: "Insert failed" }, { status: 500 })
  }

  // Best-effort email notification — only runs once RESEND_API_KEY is set.
  const resendKey = process.env.RESEND_API_KEY
  const notifyTo = process.env.PILOT_NOTIFY_TO
  const from = process.env.PILOT_NOTIFY_FROM
  if (resendKey && notifyTo && from) {
    try {
      const resend = new Resend(resendKey)
      await resend.emails.send({
        from,
        to: notifyTo,
        replyTo: email,
        subject: `Export plan request — ${record.company ?? name} → ${destination}`,
        text: [
          `Name: ${name}`,
          `Company: ${record.company ?? "-"}`,
          `Email: ${email}`,
          `Phone: ${record.phone ?? "-"}`,
          ``,
          `Route: ${record.origin ?? "Taiwan"} → ${destination}`,
          `Incoterm: ${record.incoterm ?? "-"}`,
          `Mode: ${record.mode ?? "-"}`,
          `Customs handling: ${record.customs_handling ?? "-"}`,
          `Product: ${product}`,
          `Quantity: ${record.quantity ?? "-"}`,
          `Weight: ${record.weight ?? "-"}`,
          `Ready date: ${record.ready_date ?? "-"}`,
          `Special cargo: ${record.dangerous_goods ? "YES" : "no"}`,
          `Wants call: ${record.wants_call ? "YES" : "no"}`,
          `Language: ${record.lang ?? "-"}`,
          ``,
          `Buyer inquiry:`,
          record.inquiry_text ?? "(none pasted)",
        ].join("\n"),
      })
    } catch (e) {
      console.error("plan notify email failed:", e)
      // don't fail the request if the notification email fails
    }
  }

  return NextResponse.json({ ok: true })
}
