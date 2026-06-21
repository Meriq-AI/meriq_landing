import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"

type Payload = {
  company?: string
  role?: string
  monthly_volume?: string
  main_pain?: string
  main_pain_other?: string
  can_share_docs?: string
  email?: string
  lang?: string
  location?: string
}

export async function POST(request: Request) {
  let body: Payload
  try {
    body = (await request.json()) as Payload
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const company = body.company?.trim()
  const email = body.email?.trim()
  const { role, monthly_volume, main_pain, can_share_docs } = body

  if (
    !company ||
    !email ||
    !role ||
    !monthly_volume ||
    !main_pain ||
    !can_share_docs
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    )
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  const record = {
    company,
    role,
    monthly_volume,
    main_pain,
    main_pain_other: body.main_pain_other?.trim() || null,
    can_share_docs,
    email,
    lang: body.lang ?? null,
    location: body.location ?? null,
  }

  const { error } = await supabase.from("pilot_applications").insert(record)
  if (error) {
    console.error("pilot insert failed:", error.message)
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
        subject: `New pilot application — ${company}`,
        text: [
          `Company: ${company}`,
          `Email: ${email}`,
          `Role: ${role}`,
          `Monthly volume: ${monthly_volume}`,
          `Main pain: ${main_pain}${
            record.main_pain_other ? ` — ${record.main_pain_other}` : ""
          }`,
          `Can share docs: ${can_share_docs}`,
          `Language: ${record.lang ?? "-"}`,
          `From: ${record.location ?? "-"}`,
        ].join("\n"),
      })
    } catch (e) {
      console.error("pilot notify email failed:", e)
      // don't fail the request if the notification email fails
    }
  }

  return NextResponse.json({ ok: true })
}
