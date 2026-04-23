import { NextResponse } from "next/server"
import { cache, setCache } from "./cache"

const PHP_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/get_categories.php"
const CACHE_TTL = 300_000   // 5 min — categorías cambian rarísimo
const ERROR_COOLDOWN = 20_000 // tras un error PHP, no reintentar 20s

let inflight: Promise<unknown> | null = null
let lastErrorAt: number | null = null

export async function GET() {
  // 1. Caché fresco
  if (cache && Date.now() - cache.at < CACHE_TTL) {
    return NextResponse.json(cache.data)
  }

  // 2. Cooldown: si PHP falló hace menos de 20s, servir stale o 429 sin tocar PHP
  if (lastErrorAt && Date.now() - lastErrorAt < ERROR_COOLDOWN) {
    if (cache) return NextResponse.json(cache.data)
    return NextResponse.json({ success: false, error: "rate limited" }, { status: 429 })
  }

  // 3. Single-flight
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
      lastErrorAt = null
      return data
    })
    .catch((e) => { lastErrorAt = Date.now(); throw e })
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
