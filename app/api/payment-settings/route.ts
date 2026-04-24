import { NextRequest, NextResponse } from "next/server"

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "")
const PHP = BASE + "/get_payment_settings.php"

let cache: { data: unknown; at: number } | null = null
const TTL = 60_000

export async function GET() {
  if (cache && Date.now() - cache.at < TTL) {
    return NextResponse.json(cache.data)
  }
  try {
    const res = await fetch(PHP, { next: { revalidate: 60 } })
    if (!res.ok) throw new Error(`${res.status}`)
    const data = await res.json()
    cache = { data, at: Date.now() }
    return NextResponse.json(data)
  } catch (e: any) {
    if (cache) return NextResponse.json(cache.data)
    return NextResponse.json({ success: false, error: e.message }, { status: 502 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const res = await fetch(`${BASE}/save_payment_settings.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(`${res.status}`)
    const data = await res.json()
    cache = null // invalidate GET cache after save
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 502 })
  }
}
