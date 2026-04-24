import { NextRequest, NextResponse } from "next/server"

const PHP = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") + "/get_orders.php"
const CACHE_TTL = 30_000
const ERROR_COOLDOWN = 15_000

const cache = new Map<string, { data: unknown; at: number }>()
const lastErrorAt = new Map<string, number>()
const inflight = new Map<string, Promise<unknown>>()

async function fetchWithRetry(url: string): Promise<unknown> {
  const tryFetch = async () => {
    const res = await fetch(url, { next: { revalidate: 30 } })
    if (!res.ok) throw Object.assign(new Error(`PHP ${res.status}`), { status: res.status })
    return res.json()
  }

  try {
    return await tryFetch()
  } catch (e: any) {
    if (e.status === 429) {
      // Wait 2s and retry once — PHP rate limit is transient
      await new Promise(r => setTimeout(r, 2000))
      return tryFetch()
    }
    throw e
  }
}

export async function GET(req: NextRequest) {
  const qs = req.nextUrl.searchParams.toString()
  const url = qs ? `${PHP}?${qs}` : PHP

  const hit = cache.get(qs)
  if (hit && Date.now() - hit.at < CACHE_TTL) return NextResponse.json(hit.data)

  const errAt = lastErrorAt.get(qs)
  if (errAt && Date.now() - errAt < ERROR_COOLDOWN) {
    if (hit) return NextResponse.json(hit.data)
    return NextResponse.json({ success: false, error: "rate limited" }, { status: 429 })
  }

  const existing = inflight.get(qs)
  if (existing) {
    try { return NextResponse.json(await existing) } catch {
      if (hit) return NextResponse.json(hit.data)
      return NextResponse.json({ success: false, error: "upstream error" }, { status: 502 })
    }
  }

  const promise = fetchWithRetry(url)
    .then((data) => { cache.set(qs, { data, at: Date.now() }); lastErrorAt.delete(qs); return data })
    .catch((e) => { lastErrorAt.set(qs, Date.now()); throw e })
    .finally(() => inflight.delete(qs))

  inflight.set(qs, promise)

  try {
    return NextResponse.json(await promise)
  } catch (e: any) {
    if (hit) return NextResponse.json(hit.data)
    return NextResponse.json({ success: false, error: e.message }, { status: 502 })
  }
}
