import { NextRequest, NextResponse } from "next/server"

const PHP_BASE = process.env.NEXT_PUBLIC_API_BASE_URL + "/get_products.php"
const CACHE_TTL = 120_000     // 2 min
const ERROR_COOLDOWN = 20_000 // tras un error PHP, no reintentar 20s

const cache = new Map<string, { data: unknown; at: number }>()
const inflight = new Map<string, Promise<unknown>>()
const lastErrorAt = new Map<string, number>()

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  // Si viene _= es un cache-buster del admin (quiere datos frescos): invalida el caché
  const bustCache = params.has("_")
  params.delete("_")
  const qs = params.toString()
  const url = qs ? `${PHP_BASE}?${qs}` : PHP_BASE
  const hit = cache.get(qs)

  if (!bustCache && hit && Date.now() - hit.at < CACHE_TTL) {
    return NextResponse.json(hit.data)
  }

  // Si piden un producto por id y la lista completa ya está en caché, servir desde ahí
  // PHP devuelve { product: {...} } singular — hay que respetar ese formato
  if (!bustCache && params.has("id") && params.size === 1) {
    const productId = String(params.get("id"))
    const fullList = cache.get("")
    if (fullList && Date.now() - fullList.at < CACHE_TTL) {
      const full = fullList.data as any
      const product = full?.products?.find((p: any) => String(p.id) === productId)
      if (product) return NextResponse.json({ success: true, product })
    }
  }

  // Cooldown: si PHP falló hace menos de 20s, servir stale o 429 sin tocar PHP
  const errAt = lastErrorAt.get(qs)
  if (!bustCache && errAt && Date.now() - errAt < ERROR_COOLDOWN) {
    if (hit) return NextResponse.json(hit.data)
    return NextResponse.json({ success: false, error: "rate limited" }, { status: 429 })
  }

  // Single-flight
  const existing = inflight.get(qs)
  if (!bustCache && existing) {
    try {
      const data = await existing
      return NextResponse.json(data)
    } catch {
      if (hit) return NextResponse.json(hit.data)
      return NextResponse.json({ success: false, error: "upstream error" }, { status: 502 })
    }
  }

  const promise = fetch(url, { cache: "no-store" })
    .then(async (res) => {
      if (!res.ok) throw new Error(`${res.status}`)
      const data = await res.json()
      cache.set(qs, { data, at: Date.now() })
      lastErrorAt.delete(qs)
      return data
    })
    .catch((e) => { lastErrorAt.set(qs, Date.now()); throw e })
    .finally(() => inflight.delete(qs))

  if (!bustCache) inflight.set(qs, promise)

  try {
    const data = await promise
    return NextResponse.json(data)
  } catch (e: any) {
    if (hit) return NextResponse.json(hit.data)
    return NextResponse.json({ success: false, error: e.message }, { status: 502 })
  }
}
