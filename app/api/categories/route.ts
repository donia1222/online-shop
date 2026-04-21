import { NextResponse } from "next/server"
import { cache, setCache } from "./cache"

const PHP_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/get_categories.php"
const CACHE_TTL = 60_000

let inflight: Promise<unknown> | null = null

export async function GET() {
  if (cache && Date.now() - cache.at < CACHE_TTL) {
    return NextResponse.json(cache.data)
  }

  if (inflight) {
    try {
      const data = await inflight
      return NextResponse.json(data)
    } catch {
      if (cache) return NextResponse.json(cache.data)
      return NextResponse.json({ success: false, error: "upstream error" }, { status: 502 })
    }
  }

  const promise = fetch(PHP_URL, { method: "POST", cache: "no-store" })
    .then(async (res) => {
      if (!res.ok) throw new Error(`${res.status}`)
      const data = await res.json()
      setCache(data)
      return data
    })
    .finally(() => { inflight = null })

  inflight = promise

  try {
    const data = await promise
    return NextResponse.json(data)
  } catch (e: any) {
    if (cache) return NextResponse.json(cache.data)
    return NextResponse.json({ success: false, error: e.message }, { status: 502 })
  }
}
