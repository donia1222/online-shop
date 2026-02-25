import { NextResponse } from "next/server"
import { announcementCache } from "./cache"

const TTL = 5000

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const active = searchParams.get("active")
  const cacheKey = active ? "active" : "all"

  const cached = announcementCache.get(cacheKey)
  if (cached && Date.now() - cached.at < TTL) {
    return NextResponse.json(cached.data)
  }

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL
  const url = active
    ? `${apiBase}/get_announcement.php?active=1`
    : `${apiBase}/get_announcement.php`

  try {
    const res = await fetch(url, { cache: "no-store" })
    const text = await res.text()
    if (!res.ok) {
      console.error("[announcement GET] PHP error status:", res.status, "body:", text.slice(0, 500))
      try {
        const data = JSON.parse(text)
        return NextResponse.json(data, { status: res.status })
      } catch {
        return NextResponse.json({ success: false, error: `HTTP ${res.status}`, detail: text.slice(0, 200) }, { status: 502 })
      }
    }
    const data = JSON.parse(text)
    announcementCache.set(cacheKey, { data, at: Date.now() })
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 502 })
  }
}
