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
  const company = str(body.company, 200)
  const email = str(body.email, 200)

  if (!name || !company || !EMAIL_RE.test(email)) {
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
    company,
    email,
    role: str(body.role, 40) || null,
    monthly_shipments: str(body.monthly_shipments, 40) || null,
    current_system: str(body.current_system, 300) || null,
    inquiry_text: str(body.inquiry_text, 8000) || null,
    wants_call: body.wants_call === true,
    lang: str(body.lang, 10) || null,
    source: str(body.source, 60) || null,
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  const { error } = await supabase.from("demo_requests").insert(record)
  if (error) {
    console.error("demo request insert failed:", error.message)
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
        subject: `Demo request — ${company}`,
        text: [
          `Name: ${name}`,
          `Company: ${company}`,
          `Email: ${email}`,
          `Role: ${record.role ?? "-"}`,
          `Monthly shipments: ${record.monthly_shipments ?? "-"}`,
          `Current system: ${record.current_system ?? "-"}`,
          `Language: ${record.lang ?? "-"}`,
          ``,
          `Pasted inquiry:`,
          record.inquiry_text ?? "(none pasted)",
        ].join("\n"),
      })
    } catch (e) {
      console.error("demo notify email failed:", e)
      // don't fail the request if the notification email fails
    }
  }

  return NextResponse.json({ ok: true })
}
